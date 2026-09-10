"use client";

import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="unauthorized-shell min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
      <div className="unauthorized-card max-w-md w-full bg-white border border-gray-100 shadow-2xl shadow-blue-100/50 p-10 rounded-[2.5rem] text-center">
        <div className="inline-flex p-5 bg-red-50 rounded-2xl mb-8">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          You don&apos;t have permission to view this page. Please sign in with an authorized account.
        </p>

        <div className="space-y-4">
          <Link 
            href="/admin/login" 
            className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            <LogIn size={20} />
            Sign In Now
          </Link>
          
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back to Homepage
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-50 text-xs text-gray-400 uppercase tracking-widest font-bold">
          Security Protocol OSYSTIC
        </div>
      </div>
    </div>
  );
}