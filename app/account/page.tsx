"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { UserCircle, Shield, Calendar, Fingerprint, Activity } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const resp = await api.get('/auth/me');
        setUser(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  if (loading) return <div className="pt-32 text-center text-gray-400">Loading profile...</div>;

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end">
            <div className="-mt-16 border-4 border-white rounded-[32px] overflow-hidden shadow-xl bg-white">
              {user?.avatar_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatar_url} alt={user.username} className="w-32 h-32 object-cover" />
              ) : (
                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                  <UserCircle size={64} />
                </div>
              )}
            </div>
            <div className="pb-4">
               <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">ACTIVE SESSION</span>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <h1 className="text-3xl font-black">@{user?.username}</h1>
            <p className="text-gray-500 font-medium">{user?.email || 'No public email provided'}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Identity Details</h3>
              
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Fingerprint size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">System ID</p>
                  <p className="font-mono text-sm">{user?.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Assigned Role</p>
                  <p className="font-bold capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">System History</h3>
              
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Joined On</p>
                  <p className="font-bold">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                  <p className="font-bold text-green-600">Active - Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
