import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDonor } from '../../context/AdminDonorContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

const statusBadge = (status) => {
  const cls = {
    active:   'bg-tf-green/10 text-tf-green border-tf-green/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
    inactive: 'bg-slate-100 text-slate-500 border-slate-200',
    deleted:  'bg-red-50 text-red-600 border-red-100',
  };
  return cls[status] || 'bg-slate-50 text-slate-400 border-slate-100';
};

const ROWS_PER_PAGE = 10;

export default function AdminDonorListPage() {
  const navigate = useNavigate();
  const { donors, loading, error, setError, fetchDonors, deleteDonor } = useAdminDonor();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDonors().catch(() => {});
  }, [fetchDonors]);

  const filtered = donors.filter((d) => {
    const name  = d.userId?.name?.toLowerCase() || '';
    const email = d.userId?.email?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || email.includes(q);
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleDelete = async () => {
    setLocalError('');
    try {
      await deleteDonor(confirmDelete);
      setConfirmDelete(null);
      setSuccess('Donor record updated successfully.');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to remove record.');
      setConfirmDelete(null);
    }
  };

  if (loading && donors.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-24 font-sans selection:bg-tf-primary selection:text-white">
      
      {/* Cinematic Header */}
      <div className="relative p-12 lg:p-16 bg-tf-purple rounded-[4rem] overflow-hidden shadow-2xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-tf-primary/10 blur-[120px] -ml-48 -mt-48 opacity-40" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,0.8)] animate-pulse" />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-60">Verified Donor Community Registry</p>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase italic tracking-tight">Donor <span className="text-tf-primary">Directory </span> Listing</h2>
           </div>
           <div className="bg-white/5 border border-white/10 backdrop-blur-md px-10 py-5 rounded-[2.5rem] flex items-center gap-12">
              <div className="text-center group/stat">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 group-hover/stat:text-white transition-colors">Total Members</p>
                 <p className="text-2xl font-black tabular-nums italic text-tf-primary">{donors.length}</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center group/stat">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 group-hover/stat:text-white transition-colors">Active Donors</p>
                 <p className="text-2xl font-black tabular-nums italic text-tf-green">{donors.filter(d => d.status === 'active').length}</p>
              </div>
           </div>
        </div>
      </div>

      {(localError || error) && (
        <ErrorAlert message={localError || error} onDismiss={() => { setLocalError(''); setError(null); }} />
      )}
      {success && (
        <div className="bg-tf-green/10 border border-tf-green/20 text-tf-green text-[11px] font-black uppercase tracking-widest px-10 py-6 rounded-full animate-fade-in shadow-sm w-fit mx-auto">
          {success}
        </div>
      )}

      {/* Professional Filters Hub */}
      <div className="flex flex-wrap gap-5 items-center bg-white rounded-[3.5rem] border border-slate-100 p-4 shadow-sm">
        <div className="flex-1 min-w-[300px] relative group h-16">
           <input
             type="text"
             value={search}
             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
             placeholder="Search by name, email or phone number…"
             className="w-full h-full bg-slate-50 border border-slate-100 rounded-full px-12 text-[13px] font-bold text-tf-purple placeholder-slate-300 focus:outline-none focus:border-tf-primary transition-all shadow-inner"
           />
           <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-tf-primary transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-16 bg-slate-50 border border-slate-100 rounded-full px-10 text-[11px] font-black uppercase tracking-widest text-tf-purple appearance-none focus:outline-none focus:border-tf-primary transition-all cursor-pointer shadow-inner pr-16"
        >
          <option value="">All Statuses</option>
          <option value="active">Verified (Active)</option>
          <option value="inactive">Unverified (Inactive)</option>
        </select>
        <button
          onClick={() => fetchDonors().catch(() => {})}
          className="h-16 px-12 bg-tf-purple hover:bg-tf-primary text-white text-[12px] font-black uppercase tracking-widest rounded-full transition-all shadow-xl shadow-tf-purple/10 active:scale-95"
        >
          Refresh Directory
        </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-4">
        <div className="bg-slate-50 rounded-[3.5rem] border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Member Identity</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Contact Details</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Total Contributed</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic text-center">Status</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-dashed border-slate-200">
                      <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <p className="text-[12px] font-black text-slate-300 uppercase tracking-widest italic">No member records match your current search.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((donor) => (
                  <tr key={donor._id} className="group hover:bg-slate-50 transition-all cursor-default">
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-tf-purple rounded-2xl flex items-center justify-center text-white text-[13px] font-black italic shadow-2xl shadow-tf-purple/10 group-hover:bg-tf-primary group-hover:rotate-6 transition-all">
                            {donor.userId?.name?.charAt(0) || 'D'}
                         </div>
                         <div className="space-y-1">
                            <span className="block text-[15px] font-black text-tf-purple tracking-tight group-hover:text-tf-primary transition-colors">{donor.userId?.name || 'Member'}</span>
                            <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {donor._id.slice(-8).toUpperCase()}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                       <div className="space-y-1.5">
                          <span className="block text-sm font-bold text-slate-700 tracking-tight group-hover:text-tf-purple transition-all italic underline decoration-tf-primary/10 underline-offset-4">{donor.userId?.email || '—'}</span>
                          <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest italic">P: {donor.phone || 'N/A'}</span>
                       </div>
                    </td>
                    <td className="px-10 py-10">
                       <div className="space-y-1">
                          <span className="text-xl font-black text-tf-purple tracking-tighter italic tabular-nums group-hover:text-tf-primary transition-colors">
                            {donor.analytics?.totalDonated != null
                              ? `LKR ${Number(donor.analytics.totalDonated).toLocaleString()}`
                              : 'LKR 0'}
                          </span>
                          <span className="block text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Verified Impact Plan</span>
                       </div>
                    </td>
                    <td className="px-10 py-10 text-center">
                      <span className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-dashed hover:border-solid transition-all ${statusBadge(donor.status)}`}>
                        {donor.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex gap-8 items-center">
                        <button
                          onClick={() => navigate(`/admin/donors/${donor._id}`)}
                          className="px-8 py-3 bg-white border-2 border-slate-100 hover:border-tf-primary hover:text-tf-primary text-tf-purple text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-sm hover:shadow-xl hover:shadow-tf-primary/10 active:scale-95 translate-y-0 hover:-translate-y-1"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => { setConfirmDelete(donor._id); setSuccess(''); }}
                          className="text-[10px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-12">
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">System Registry Active</span>
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
               Showing {((page - 1) * ROWS_PER_PAGE) + 1} — {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} total members
             </span>
          </div>
          <div className="flex gap-5">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-12 py-5 rounded-full border border-slate-200 text-slate-400 hover:text-tf-purple hover:border-tf-purple disabled:opacity-30 transition-all font-black uppercase tracking-[0.2em] text-[11px] bg-white group hover:shadow-xl active:scale-95">← Previous</button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-12 py-5 rounded-full bg-tf-primary text-white hover:bg-tf-purple disabled:opacity-30 transition-all font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-tf-primary/20 active:scale-95 group hover:-translate-y-1">Next Page →</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-tf-purple/90 backdrop-blur-2xl flex items-center justify-center z-[100] p-6 animate-fade-in font-sans">
          <div className="bg-white rounded-[4rem] shadow-2xl p-16 max-w-xl w-full space-y-10 relative overflow-hidden text-center border border-slate-100">
             <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner group transition-transform hover:scale-110">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             </div>
             <div className="space-y-6">
               <h4 className="text-4xl font-black text-tf-purple tracking-tighter italic uppercase">Remove Member?</h4>
               <p className="text-slate-500 font-medium leading-relaxed font-sans">
                 Warning: You are about to remove this member profile from the official registry. This action cannot be undone.
               </p>
             </div>
             <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <button onClick={handleDelete} disabled={loading} className="flex-[2] px-12 py-6 text-[12px] font-black text-white bg-red-600 hover:bg-slate-900 disabled:opacity-60 rounded-full transition-all uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 active:scale-95 group">
                  {loading ? 'REMOVING…' : 'CONFIRM REMOVAL'}
                </button>
                <button onClick={() => setConfirmDelete(null)} className="flex-1 px-12 py-6 text-[11px] font-black text-slate-400 border border-slate-100 hover:bg-slate-50 rounded-full transition-all uppercase tracking-[0.2em]">
                  CANCEL
                </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </div>
  );
}
