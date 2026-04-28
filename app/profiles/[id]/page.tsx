"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Fingerprint, Shield, Zap, Info } from 'lucide-react';

interface ProfileDetail {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

export default function ProfileDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const resp = await api.get(`/api/profiles/${id}`);
        setProfile(resp.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id]);

  if (loading) return <div className="pt-32 text-center text-gray-400">Analyzing identity...</div>;
  if (!profile) return <div className="pt-32 text-center text-gray-400">Profile not found.</div>;

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Bank
      </button>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-indigo-600 p-12 text-white flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[32px] flex items-center justify-center text-4xl font-black">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black capitalize">{profile.name}</h1>
              <div className="flex items-center gap-2 text-indigo-100 font-medium">
                <Fingerprint size={16} />
                <span className="text-xs font-mono">{profile.id}</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">System Integrity</p>
            <p className="text-2xl font-bold">98.4%</p>
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Info size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold">Inferred Intelligence</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gender Classification</p>
                  <p className="text-xl font-bold capitalize">{profile.gender}</p>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-indigo-600 h-full" style={{ width: `${profile.gender_probability * 100}%` }}></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{(profile.gender_probability * 100).toFixed(1)}% Probability</p>
                </div>

                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Geographic Origin</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold capitalize">{profile.country_name.toLowerCase()}</span>
                    <span className="text-xs font-bold text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-md">{profile.country_id}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-green-600 h-full" style={{ width: `${profile.country_probability * 100}%` }}></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{(profile.country_probability * 100).toFixed(1)}% Probability</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
               <div className="flex items-center gap-3">
                <Zap size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold">Metadata</h3>
              </div>
              <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 grid grid-cols-2 gap-8">
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Classification Group</p>
                   <p className="font-bold capitalize">{profile.age_group}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Determined Age</p>
                   <p className="font-bold">{profile.age} Years</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">System Ingestion</p>
                   <p className="font-bold">{new Date(profile.created_at).toLocaleDateString()}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                   <p className="font-bold text-green-600">Verified</p>
                 </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-900 rounded-3xl p-8 text-white space-y-6 shadow-xl shadow-gray-200">
               <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Quick Actions</h4>
               <div className="space-y-4">
                 <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-bold transition-all border border-white/10">Flag Discrepancy</button>
                 <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-bold transition-all border border-white/10">Request Rescan</button>
                 <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900">Download Record</button>
               </div>
            </div>

            <div className="p-6 border border-indigo-100 rounded-3xl bg-indigo-50/30 space-y-3">
              <Shield className="text-indigo-600" size={24} />
              <h4 className="font-bold text-sm text-indigo-900">GDPR Compliant</h4>
              <p className="text-[10px] text-indigo-700 leading-relaxed">This record is stored and processed according to internal data privacy policies for classified intelligence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
