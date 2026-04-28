"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { Search as SearchIcon, Loader2, Users, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';

interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  country_id: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const resp = await api.get('/api/profiles/search', { params: { q: query } });
      setResults(resp.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2 py-8">
        <h1 className="text-4xl font-black tracking-tight">Natural Query Engine</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Describe the audience you&apos;re looking for using plain English.
          Example: <span className="italic">&quot;young females from nigeria&quot;</span> or <span className="italic">&quot;seniors above 70&quot;</span>.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask the system anything..."
            className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-32 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all text-lg shadow-sm"
          />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={24} />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Query"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="font-bold uppercase tracking-widest text-[10px]">Processing Language Patterns...</p>
          </div>
        ) : searched ? (
          results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((p) => (
                <Link 
                  key={p.id} 
                  href={`/profiles/${p.id}`}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      👤
                    </div>
                    <div>
                      <h3 className="font-bold capitalize group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                      <p className="text-xs text-gray-400">{p.age}y • {p.gender} from {p.country_id}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
               <p className="text-gray-400 font-medium">No matches found for your query. Try different keywords.</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-10">
            <div className="p-6 bg-blue-50 rounded-3xl space-y-2">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-4">
                 <Users size={20} />
               </div>
               <h4 className="font-bold text-blue-900">Demographics</h4>
               <p className="text-xs text-blue-700/70 leading-relaxed">Search by age, gender or specific age groups across the entire bank.</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-3xl space-y-2">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm mb-4">
                 <Globe size={20} />
               </div>
               <h4 className="font-bold text-purple-900">Geographics</h4>
               <p className="text-xs text-purple-700/70 leading-relaxed">Filter by country or region using natural language like &quot;from Nigeria&quot;.</p>
            </div>
            <div className="p-6 bg-amber-50 rounded-3xl space-y-2">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm mb-4">
                 <SearchIcon size={20} />
               </div>
               <h4 className="font-bold text-amber-900">NLP Powered</h4>
               <p className="text-xs text-amber-700/70 leading-relaxed">Our engine interprets your intent using rule-based pattern matching.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
