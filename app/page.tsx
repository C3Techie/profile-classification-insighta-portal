"use client";

import { Shield, Lock } from 'lucide-react';

export default function LoginPage() {
  const handleGithubLogin = () => {
    // Standard OAuth redirect to backend
    // The backend handles the state generation and redirect to GitHub
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    window.location.href = `${backendUrl}/auth/github`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Shield size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Insighta Labs+</h1>
            <p className="text-gray-500">Secure Profile Intelligence Platform</p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in with your GitHub account to access the internal dashboard.</p>
          </div>

          <button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <Lock size={20} />
            Continue with GitHub
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Internal Use Only</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-400">
          © 2026 Insighta Labs. All rights reserved.
        </p>
      </div>
    </div>
  );
}
