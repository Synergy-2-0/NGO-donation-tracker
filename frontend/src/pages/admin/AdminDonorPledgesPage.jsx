import { useState, useEffect } from 'react';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

const statusColor = {
  active: 'bg-tf-green/10 text-tf-green border-tf-green/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
  fulfilled: 'bg-tf-pink/10 text-tf-pink border-tf-pink/20',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  pending: 'bg-amber-100 text-amber-600 border-tf-purple/5',
};

export default function AdminDonorPledgesPage() {
  const { pledges, loading, error, fetchAllPledges } = useAdminDonor();
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllPledges().catch(() => {});
  }, [fetchAllPledges]);

  const filtered = pledges.filter((p) => {
    const donorName = p.donorId?.userId?.name?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchSearch = !q || donorName.includes(q);
    const matchFilter = !filter || p.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading && pledges.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-24 font-sans selection:bg-tf-pink selection:text-white">
      
      {/* Cinematic Strategy Header */}
      <div className="relative p-12 lg:p-16 bg-tf-purple rounded-[4rem] overflow-hidden shadow-2xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tf-pink/10 blur-[130px] -mr-48 -mt-48 opacity-40 animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="w-2.5 h-2.5 rounded-full bg-tf-pink shadow-[0_0_20px_rgba(230,0,126,0.8)] animate-pulse" />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-60">Verified Philanthropic Commitment Database</p>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase italic tracking-tight">Pledge <span className="text-tf-pink">Commitment </span> Hub</h2>
           </div>
           <div className="bg-white/5 border border-white/10 backdrop-blur-md px-10 py-5 rounded-[2.5rem] flex items-center gap-12 text-center">
              <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Commitments</p>
                 <p className="text-2xl font-black italic text-tf-pink">{pledges.length}</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Active Pledges</p>
                 <p className="text-2xl font-black italic text-tf-green">{pledges.filter(p => p.status === 'active').length}</p>
              </div>
           </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Professional Filtering Controls */}
      <div className="flex flex-wrap gap-5 items-center bg-white rounded-[3.5rem] border border-slate-100 p-4 shadow-sm">
        <div className="flex-1 min-w-[300px] relative h-16 group">
           <input
             type="text"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search by donor name or reference ID…"
             className="w-full h-full bg-slate-50 border border-slate-100 rounded-full px-12 text-[13px] font-bold text-tf-purple placeholder:text-slate-300 focus:outline-none focus:border-tf-pink transition-all shadow-inner"
           />
           <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-tf-pink transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-16 bg-slate-50 border border-slate-100 rounded-full px-10 text-[11px] font-black uppercase tracking-widest text-tf-purple appearance-none focus:outline-none focus:border-tf-pink transition-all cursor-pointer shadow-inner pr-16"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
           onClick={() => fetchAllPledges()}
           className="h-16 px-12 bg-tf-purple hover:bg-tf-pink text-white text-[12px] font-black uppercase tracking-widest rounded-full transition-all shadow-xl shadow-tf-purple/10 active:scale-95"
        >
           Sync Hub Data
        </button>
      </div>

      {/* Commitment Registry Table */}
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-4">
        <div className="bg-slate-50 rounded-[3.5rem] border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Philanthropic Partner</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Planned Contribution</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic text-center">Frequency</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic text-center">Current Status</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-dashed border-slate-200">
                      <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <p className="text-[12px] font-black text-slate-300 uppercase tracking-widest italic">No pledge commitments match your current search.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((pledge) => (
                  <tr key={pledge._id} className="group hover:bg-slate-50 transition-all cursor-default">
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-tf-purple rounded-2xl flex items-center justify-center text-white text-[13px] font-black italic shadow-2xl shadow-tf-purple/10 group-hover:bg-tf-pink group-hover:rotate-6 transition-all">
                            {pledge.donorId?.userId?.name?.charAt(0) || 'D'}
                         </div>
                         <div className="space-y-1">
                            <span className="block text-[15px] font-black text-tf-purple tracking-tight group-hover:text-tf-pink transition-colors">{pledge.donorId?.userId?.name || 'Partner Member'}</span>
                            <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">Plan ID: {pledge._id.slice(-8).toUpperCase()}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                       <div className="space-y-1">
                          <span className="text-xl font-black text-tf-purple tracking-tighter italic tabular-nums group-hover:text-tf-pink transition-colors">LKR {Number(pledge.amount).toLocaleString()}</span>
                          <span className="block text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Scheduled Contribution</span>
                       </div>
                    </td>
                    <td className="px-10 py-10 text-center">
                       <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-100 px-6 py-3 rounded-2xl group-hover:bg-tf-purple group-hover:text-white transition-all shadow-sm">{pledge.frequency}</span>
                    </td>
                    <td className="px-10 py-10 text-center">
                      <span className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-dashed transition-all ${statusColor[pledge.status] || 'bg-white text-slate-400'}`}>
                        {pledge.status}
                      </span>
                    </td>
                    <td className="px-10 py-10">
                       <button
                         onClick={() => navigate(`/admin/donors/${pledge.donorId?._id}`)}
                         className="px-8 py-3 bg-white border-2 border-slate-100 hover:border-tf-pink hover:text-tf-pink text-tf-purple text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-sm hover:shadow-xl hover:shadow-tf-pink/10 active:scale-95"
                       >
                         View Member
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </div>
  );
}
