import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiTrendingUp, FiTarget, FiZap, FiInfo, FiCpu } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await api.get('/api/ai/donor-insights');
        setInsights(res.data.insights || []);
      } catch (err) {
        console.error('AI Insights fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  if (loading) return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-10 flex items-center justify-center shadow-sm">
      <LoadingSpinner message="Generating community insights Hub..." size="sm" />
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
      <div className="p-10 bg-slate-900 text-white relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-tf-primary rounded-2xl shadow-lg shadow-tf-primary/20">
               <FiCpu className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight leading-none mb-1">Donor Insights</h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-white/40 italic">Community Information Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest italic backdrop-blur-md">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
            Live Analysis
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <AnimatePresence>
          {insights.length > 0 ? insights.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-[1.5rem] bg-slate-50/50 border border-slate-50 hover:border-tf-primary/20 hover:bg-white hover:shadow-xl transition-all duration-500 group/item flex gap-5"
            >
              <div className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 group-hover/item:bg-slate-900 group-hover/item:text-white group-hover/item:rotate-12 transition-all shadow-sm h-fit shrink-0">
                {item.type === 'prediction' ? <FiTrendingUp /> : item.type === 'recommendation' ? <FiTarget /> : <FiZap />}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                    {item.type} Hub
                  </span>
                  {item.confidence && (
                    <div className="px-2 py-0.5 bg-emerald-50 text-[9px] font-black text-emerald-600 rounded-lg border border-emerald-100 uppercase tracking-widest">
                      {Math.round(item.confidence * 100)}% Match
                    </div>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                  {item.insight}
                </p>
              </div>
            </motion.div>
          )) : (
            <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-100 italic">
               <FiInfo className="mx-auto text-slate-200" size={40} />
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No donor insights available for the selected registry.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest italic leading-none">
          <FiInfo size={14} className="not-italic text-tf-primary" /> Active Synchronization Protocols Hub
        </div>
        <button className="text-[10px] font-black text-tf-primary hover:text-slate-900 transition-colors uppercase tracking-widest underline decoration-2 underline-offset-8 decoration-tf-primary/30">
          RECALIBRATERegistry →
        </button>
      </div>
    </div>
  );
}
