'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface JWTUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  permissions?: string[];
  orgId?: string;
  scope?: string;
}

interface AuthContextType {
  user: JWTUser | null;
  role: string;
  loading: boolean;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JWTUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie('admin-auth-token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setUser(decoded);
      }
    }
    setLoading(false);
  }, []);

  const role = user?.role || 'developer';
  const isAdmin = role === 'super_admin' || role === 'admin';

  const hasPermission = useCallback((perm: string): boolean => {
    if (!user) return false;
    if (isAdmin) return true;
    return user.permissions?.includes(perm) ?? false;
  }, [user, isAdmin]);

  return (
    <AuthContext.Provider value={{ user, role, loading, hasPermission, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
