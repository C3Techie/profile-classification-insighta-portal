"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, ShieldCheck, Globe, Clock, BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const resp = await api.get('/api/profiles?limit=1');
        setStats({
          total: resp.data.total,
          lastUpdated: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Profiles', value: stats?.total || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Analysts', value: 12, icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Countries Covered', value: 42, icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Avg Query Time', value: '142ms', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm">System-wide metrics and real-time intelligence overview.</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-3 py-1 rounded-full">
            Live Updates Enabled
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={cn("p-3 rounded-2xl", card.bg, card.color)}>
                <card.icon size={24} />
              </div>
              <TrendingUp className="text-green-500" size={16} />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{card.name}</p>
              <p className="text-3xl font-black mt-1">
                {loading ? <span className="inline-block w-16 h-8 bg-gray-100 animate-pulse rounded"></span> : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Activity Trends</h3>
            <BarChart3 className="text-gray-300" />
          </div>
          <div className="h-64 flex items-end gap-2 justify-between">
             {/* Mock chart */}
             {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85, 60, 90].map((h, i) => (
               <div key={i} className="flex-1 bg-indigo-50 hover:bg-indigo-600 transition-colors rounded-t-lg group relative" style={{ height: `${h}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                   {h * 12} requests
                 </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase">
            <span>Last 12 Hours</span>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Export</h3>
            <p className="text-indigo-100 text-sm">Download the latest system report in CSV format for offline analysis.</p>
          </div>
          <a 
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/profiles/export?format=csv`}
            className="mt-8 bg-white text-indigo-600 font-bold py-3 px-4 rounded-xl text-center hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Export All Data
          </a>
        </div>
      </div>
    </div>
  );
}
