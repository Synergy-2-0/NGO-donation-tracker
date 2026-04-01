import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCpu, FiTrendingUp, FiTarget, FiZap, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await axios.get('http://localhost:3000/api/ai/donor-insights', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setInsights(res.data.insights);
      } catch (err) {
        console.error('AI Insights fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  if (loading) return (
    <div className="premium-surface p-8 flex flex-col items-center justify-center min-h-[300px]">
      <FiCpu className="text-orange-500 animate-spin mb-4" size={32} />
      <p className="text-sm font-medium text-slate-400">Processing behavioral analytics...</p>
    </div>
  );

  return (
    <div className="premium-surface overflow-hidden group">
      <div className="p-8 bg-slate-950 text-white relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/20">
              <FiCpu size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight">AI Humanitarian Insights</h3>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50">Personalized Analytics Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/5 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            LIVE ANALYSIS
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence>
          {insights.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-orange-500/20 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group/item flex gap-4"
            >
              <div className="p-3 rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover/item:bg-orange-500 group-hover/item:text-white h-fit">
                {item.type === 'prediction' ? <FiTrendingUp /> : item.type === 'recommendation' ? <FiTarget /> : <FiZap />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {item.type} insight
                  </span>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-[9px] font-bold text-green-600 rounded">
                    {Math.round(item.confidence * 100)}% Match
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {item.insight}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium italic">
          <FiInfo size={14} className="not-italic" /> High confidence models active
        </div>
        <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
          RECALIBRATE →
        </button>
      </div>
    </div>
  );
}
