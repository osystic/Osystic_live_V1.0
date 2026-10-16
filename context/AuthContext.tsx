'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { logAudit, logSecurityEvent } from '@/lib/logAction';
import type { UserProfile } from '@/types';
import type { User } from '@supabase/supabase-js';

/**
 * Unified auth context.
 *
 * Two independent identity sources are supported at once:
 *
 * 1. `admin-auth-token` JWT cookie  -> the existing /admin panel
 *    (proxy.ts issues/validates this cookie; the user object is decoded
 *    straight from the token, no network call).
 *
 * 2. Supabase Auth session -> the Finance Management System (/dashboard).
 *    These routes are protected by database RLS, so a real Supabase session
 *    is required for them to return data.
 *
 * Resolution order is JWT first, then Supabase. This keeps the pre-existing
 * admin panel behaviour byte-for-byte identical while letting the finance
 * module mount its own session. `authSource` tells callers which one is
 * active so a module can require the right kind of session.
 */

interface JWTUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  permissions?: string[];
  orgId?: string;
  scope?: string;
}

export type AuthSource = 'jwt' | 'supabase' | null;

interface AuthContextType {
  user: JWTUser | User | null;
  profile: UserProfile | null;
  role: string;
  loading: boolean;
  authSource: AuthSource;
  signUp: (email: string, password: string, organizationName: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

function decodeJWT(token: string): JWTUser | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      permissions: decoded.permissions || [],
      orgId: decoded.orgId,
      scope: decoded.scope,
    };
  } catch {
    return null;
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function isSupabaseUser(u: unknown): u is User {
  return !!u && typeof u === 'object' && 'aud' in (u as Record<string, unknown>);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JWTUser | User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authSource, setAuthSource] = useState<AuthSource>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const fetchProfile = useCallback(async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      const blank = (role: string): UserProfile => ({
        id: '',
        user_id: authUser.id,
        full_name: '',
        role,
        organization_id: null,
        created_at: '',
        email: authUser.email || '',
        can_create_project: false, can_edit_project: false, can_delete_project: false,
        can_add_income: false, can_edit_income: false, can_delete_income: false,
        can_add_expense: false, can_edit_expense: false, can_delete_expense: false,
        can_create_invoice: false, can_edit_invoice: false, can_delete_invoice: false,
      } as UserProfile);

      if (error) {
        console.error('Profile fetch error:', error.message);
        setProfile(blank('User'));
      } else if (data) {
        setProfile({
          id: data.id || '',
          user_id: data.user_id || authUser.id,
          full_name: data.full_name || '',
          role: data.role || 'User',
          organization_id: data.organization_id || null,
          created_at: data.created_at || '',
          email: data.email || authUser.email || '',
          can_create_project: Boolean(data.can_create_project),
          can_edit_project: Boolean(data.can_edit_project),
          can_delete_project: Boolean(data.can_delete_project),
          can_add_income: Boolean(data.can_add_income),
          can_edit_income: Boolean(data.can_edit_income),
          can_delete_income: Boolean(data.can_delete_income),
          can_add_expense: Boolean(data.can_add_expense),
          can_edit_expense: Boolean(data.can_edit_expense),
          can_delete_expense: Boolean(data.can_delete_expense),
          can_create_invoice: Boolean(data.can_create_invoice),
          can_edit_invoice: Boolean(data.can_edit_invoice),
          can_delete_invoice: Boolean(data.can_delete_invoice),
        } as UserProfile);
      } else {
        setProfile(blank('Viewer'));
      }
    } catch (err) {
      console.error('Profile exception:', err);
    }
  }, []);

  // Primary: JWT cookie for the existing admin panel. Runs synchronously in a
  // timeout so it never blocks paint, exactly as before this file was unified.
  useEffect(() => {
    let active = true;

    const timer = window.setTimeout(() => {
      if (!active) return;
      const token = getCookie('admin-auth-token');
      if (token) {
        const jwtUser = decodeJWT(token);
        if (jwtUser) {
          setUser(jwtUser);
          setAuthSource('jwt');
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  // Secondary: Supabase session for the finance module. Only consulted when no
  // admin JWT is present, so admin behaviour is untouched.
  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const sUser = data?.session?.user ?? null;
      const token = getCookie('admin-auth-token');

      if (sUser && !token) {
        setUser(sUser);
        setAuthSource('supabase');
        void fetchProfile(sUser);
        setLoading(false);
      } else if (!sUser && !token) {
        setUser(null);
        setAuthSource(null);
        setProfile(null);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;
      const sUser = session?.user ?? null;
      const token = getCookie('admin-auth-token');

      // An active admin JWT always wins - never let a Supabase event swap the
      // identity out from under the /admin panel.
      if (token && decodeJWT(token)) {
        if (event === 'SIGNED_OUT') logAudit.logout();
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        // silent refresh, no audit entry needed
      } else if (event === 'SIGNED_IN' && sUser) {
        if (!sessionChecked) {
          setSessionChecked(true);
          void logSecurityEvent({ eventType: 'LOGIN_SUCCESS', userId: sUser.id, userEmail: sUser.email });
        }
      } else if (event === 'SIGNED_OUT') {
        void logAudit.logout();
      }

      if (sUser) {
        setUser(sUser);
        setAuthSource('supabase');
        await fetchProfile(sUser);
      } else {
        setUser(null);
        setAuthSource(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [fetchProfile, sessionChecked]);

  const isSupabase = authSource === 'supabase';
  const role = profile?.role || (user && !isSupabaseUser(user) ? user.role : undefined) || 'developer';
  const isAdmin =
    role === 'super_admin' || role === 'admin' || role === 'CEO' || role === 'Admin';

  const hasPermission = useCallback(
    (perm: string): boolean => {
      if (isAdmin) return true;
      if (!user) return false;
      if (isSupabaseUser(user)) {
        return Boolean((profile as unknown as Record<string, unknown> | null)?.[perm]);
      }
      return user.permissions?.includes(perm) ?? false;
    },
    [user, profile, isAdmin]
  );

  const signUp = useCallback(async (email: string, password: string, organizationName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { organization_name: organizationName.trim() } },
    });
    return error?.message || null;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message || null;
  }, []);

  const signOut = useCallback(async () => {
    try {
      logAudit.logout();
    } catch {
      // audit failures must not block sign-out
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAuthSource(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, role, loading, authSource, signUp, signIn, signOut, hasPermission, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}