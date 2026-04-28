"use client";

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Filter, ChevronLeft, ChevronRight, Download, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  created_at: string;
}

interface Pagination {
  total: number;
  totalPages: number;
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    gender: '',
    country_id: '',
    age_group: '',
  });

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...filters,
      };
      // Clean empty filters
      const cleanParams: Record<string, string | number> = {};
      Object.entries(params).forEach(([key, val]) => {
        if (val !== '') cleanParams[key] = val;
      });
      
      const resp = await api.get('/api/profiles', { params: cleanParams });
      setProfiles(resp.data.data);
      setPagination({
        total: resp.data.total,
        totalPages: resp.data.total_pages,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Intelligence Bank</h1>
          <p className="text-gray-500 text-sm">Full index of classified identity profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/profiles/export?format=csv`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </a>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters Header */}
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-400 mr-2">
            <Filter size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
          </div>
          
          <select 
            name="gender" 
            onChange={handleFilterChange}
            className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select 
            name="age_group" 
            onChange={handleFilterChange}
            className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Age Groups</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>

          <input 
            type="text"
            name="country_id"
            placeholder="Country ID (e.g. NG)"
            onBlur={(e) => {
              setFilters({ ...filters, country_id: e.target.value });
              setPage(1);
            }}
            className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 w-32"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Age Group</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Origin</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6 h-16 bg-white"></td>
                  </tr>
                ))
              ) : profiles.length > 0 ? (
                profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold capitalize">{p.name}</p>
                          <p className="text-[10px] font-mono text-gray-400">{p.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-tighter",
                        p.gender === 'male' ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                      )}>
                        {p.gender}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{(p.gender_probability * 100).toFixed(0)}% confidence</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <p className="capitalize">{p.age_group}</p>
                      <p className="text-xs text-gray-400">{p.age} years old</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌍</span>
                        <p className="text-sm font-bold">{p.country_id}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 capitalize">{p.country_name.toLowerCase()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/profiles/${p.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      >
                        <MoreHorizontal size={20} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No profiles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500">
            Showing <span className="font-bold text-gray-900">{profiles.length}</span> of <span className="font-bold text-gray-900">{pagination?.total || 0}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold px-3">Page {page} of {pagination?.totalPages || 1}</span>
            <button 
              disabled={page >= (pagination?.totalPages || 1)}
              onClick={() => setPage(page + 1)}
              className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
