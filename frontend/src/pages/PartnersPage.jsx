import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import PartnerFormModal from '../components/PartnerFormModal';
import { motion, AnimatePresence } from 'framer-motion';

const pageSizeOptions = [5, 10, 20];

const statusBadgeStyle = {
  active: 'bg-tf-accent/10 text-tf-accent border-tf-accent/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
  inactive: 'bg-slate-100 text-slate-400 border-slate-200',
  suspended: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

const verificationBadgeStyle = {
  verified: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20 shadow-[0_0_10px_rgba(255,138,0,0.1)]',
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

const toTitle = (value) =>
  value
    .split('_')
    .join(' ')
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function PartnersPage() {
  const { user } = useAuth();
  const {
    partners,
    loading,
    error,
    setError,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    approvePartner,
  } = usePartner();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [orgTypeFilter, setOrgTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deleteId, setDeleteId] = useState('');
  const [success, setSuccess] = useState('');

  const canCreate = user?.role === 'partner';
  const isAdmin = user?.role === 'admin' || user?.role === 'ngo-admin';

  useEffect(() => {
    fetchPartners().catch(() => {});
  }, [fetchPartners]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, verificationFilter, orgTypeFilter, sortBy, pageSize]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let rows = partners.filter((partner) => {
      if (statusFilter !== 'all' && partner.status !== statusFilter) return false;
      if (verificationFilter !== 'all' && partner.verificationStatus !== verificationFilter) return false;
      if (orgTypeFilter !== 'all' && partner.organizationType !== orgTypeFilter) return false;

      if (!keyword) return true;
      const haystack = [
        partner.organizationName,
        partner.industry,
        partner.contactPerson?.name,
        partner.contactPerson?.email,
        partner.address?.city,
        ...(partner.csrFocus || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(keyword);
    });

    rows = rows.sort((a, b) => {
      if (sortBy === 'name-asc') return (a.organizationName || '').localeCompare(b.organizationName || '');
      if (sortBy === 'name-desc') return (b.organizationName || '').localeCompare(a.organizationName || '');
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return rows;
  }, [partners, search, statusFilter, verificationFilter, orgTypeFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedPartners = filtered.slice((page - 1) * pageSize, page * pageSize);

  const canMutatePartner = (partner) => isAdmin || String(partner.userId) === String(user?.id || user?._id);

  const onCreate = async (payload) => {
    try {
      await createPartner(payload);
      setShowCreateModal(false);
      setSuccess('Entity initialized in registry.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Initialization failure.');
    }
  };

  const onUpdate = async (payload) => {
    try {
      await updatePartner(editingPartner._id, payload);
      setEditingPartner(null);
      setSuccess('Structural matrix updated.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Sync failure.');
    }
  };

  const onDelete = async () => {
    try {
      await deletePartner(deleteId);
      setDeleteId('');
      setSuccess('Entity removed from registry.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Archival failure.');
    }
  };

  const onApprove = async (partnerId) => {
    try {
      await approvePartner(partnerId);
      setSuccess('Trust verified successfully.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failure.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-6 font-sans selection:bg-tf-primary selection:text-white animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      <div className="bg-[#0F172A] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 blur-[150px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
           <div className="space-y-6">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-pulse" />
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.6em] leading-none">Synergy Registry node</p>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-none uppercase">
                   Strategic <span className="text-tf-primary">Hub</span>
                 </h2>
              </div>
              <p className="text-base text-white/40 max-w-xl leading-relaxed italic font-medium">
                 Managed global network of verified humanitarian impact organizations and <span className="text-white/60">corporate collaborators.</span>
              </p>
           </div>

           <div className="flex flex-col sm:flex-row items-center gap-4">
              {isAdmin && (
                <Link
                  to="/partners/verification"
                  className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                >
                  Audit Queue
                </Link>
              )}
              {canCreate && (
                <button
                  onClick={() => { setShowCreateModal(true); setSuccess(''); setError(''); }}
                  className="px-10 py-5 bg-tf-primary text-white hover:bg-white hover:text-slate-950 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl shadow-tf-primary/20 active:scale-95 flex items-center gap-4 group"
                >
                  Initialize Entity <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
              )}
           </div>
        </div>
      </div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
            {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}
            {success && (
              <div className="bg-tf-accent/5 border border-tf-accent/10 text-tf-accent text-[11px] font-black uppercase tracking-[0.4em] px-10 py-5 rounded-[2rem] shadow-sm flex items-center gap-4 italic">
                <div className="w-2.5 h-2.5 bg-tf-accent rounded-full shadow-[0_0_10px_rgba(34,197,94,1)]" />
                {success}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="lg:col-span-2 relative group">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search matrix nodes, sectors, or focus..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-14 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-tf-primary/10 focus:border-tf-primary/30 transition-all font-bold placeholder:text-slate-300 uppercase italic tracking-widest"
                />
                <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-tf-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
          
          <div className="space-y-2">
             <label className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] px-4">State</label>
             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none transition-all outline-none">
                <option value="all">Every State</option>
                <option value="active">Operational</option>
                <option value="inactive">Dormant</option>
                <option value="suspended">Restricted</option>
             </select>
          </div>

          <div className="space-y-2">
             <label className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] px-4">Registry</label>
             <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none transition-all outline-none">
                <option value="all">All Identity</option>
                <option value="pending">Awaiting Audit</option>
                <option value="verified">Verified Trust</option>
                <option value="rejected">De-authenticated</option>
             </select>
          </div>

          <div className="space-y-2">
             <label className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] px-4">Taxonomy</label>
             <select value={orgTypeFilter} onChange={(e) => setOrgTypeFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none transition-all outline-none">
                <option value="all">All Structures</option>
                <option value="corporate">Corporate Hub</option>
                <option value="foundation">Foundation</option>
                <option value="government">Public Sector</option>
                <option value="individual">Direct Member</option>
             </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sequencing</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-50 text-slate-600 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-tight border border-slate-100 outline-none">
                    <option value="newest">Recent Log</option>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                    <option value="name-desc">Alphabetical (Z-A)</option>
                </select>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Density</span>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="bg-slate-50 text-slate-600 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-tight border border-slate-100 outline-none">
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>{size} Unit Scale</option>
                    ))}
                </select>
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] italic">TransFund Registry Interface v4.0.1</div>
        </div>
      </div>

      {loading && partners.length === 0 ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-32 rounded-[4rem] border border-slate-100 shadow-sm text-center space-y-8">
             <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300 border border-slate-100 shadow-inner">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div className="space-y-4">
               <h4 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">No Registry Matches</h4>
               <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.5em] italic">Adjust taxonomy filters to rediscover nodes in the network.</p>
            </div>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black italic border-b border-slate-50">
                  <th className="px-12 py-8">Entity Identity</th>
                  <th className="px-12 py-8 text-center">Structure</th>
                  <th className="px-12 py-8">Contact Protocol</th>
                  <th className="px-12 py-8">Resource Spectrum</th>
                  <th className="px-12 py-8 text-center">Status Matrix</th>
                  <th className="px-12 py-8 text-right">Strategic Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pagedPartners.map((partner) => (
                  <motion.tr variants={itemVariants} key={partner._id} className="group hover:bg-slate-50/50 transition-all duration-500">
                    <td className="px-12 py-8">
                      <div className="font-black text-slate-900 tracking-tighter text-lg group-hover:text-tf-primary transition-colors uppercase italic leading-none">{partner.organizationName}</div>
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-2 italic">{partner.industry || 'Legacy Industry'} &bull; {partner.address?.city || 'Global Hub'}</div>
                    </td>
                    <td className="px-12 py-8 text-center">
                       <span className="px-5 py-2 bg-slate-50 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border border-slate-100 text-slate-500 italic">
                          {toTitle(partner.organizationType || 'Individual')}
                       </span>
                    </td>
                    <td className="px-12 py-8">
                      <div className="text-sm font-black text-slate-700 italic leading-none mb-1">{partner.contactPerson?.name || '—'}</div>
                      <div className="text-[10px] font-black text-slate-400 truncate max-w-[150px] uppercase tracking-widest">{partner.contactPerson?.email || '—'}</div>
                    </td>
                    <td className="px-12 py-8">
                       <p className="text-base font-black text-slate-950 tracking-tighter tabular-nums italic">LKR {Number(partner.partnershipPreferences?.budgetRange?.min || 0).toLocaleString()} +</p>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1 italic">Allocation Capacity</p>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex flex-col items-center gap-3">
                        <span className={`px-5 py-2 rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] border transition-all ${statusBadgeStyle[partner.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                            {toTitle(partner.status || 'Active')}
                        </span>
                        <span className={`px-5 py-2 rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] border transition-all ${verificationBadgeStyle[partner.verificationStatus] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                            {toTitle(partner.verificationStatus || 'Pending')}
                        </span>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <div className="flex flex-wrap gap-3 justify-end">
                        <Link to={`/partners/${partner._id}`} className="p-4 bg-slate-50 text-slate-400 hover:text-tf-primary hover:bg-tf-primary/5 rounded-[1.2rem] border border-slate-100 shadow-sm transition-all active:scale-90 group/btn" title="Audit View">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </Link>
                        <Link to={`/partners/${partner._id}/impact`} className="p-4 bg-slate-50 text-slate-400 hover:text-tf-accent hover:bg-tf-accent/5 rounded-[1.2rem] border border-slate-100 shadow-sm transition-all active:scale-90" title="Impact Profile">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </Link>
                        
                        {(canMutatePartner(partner)) && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditingPartner(partner)}
                                    className="w-12 h-12 bg-slate-50 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-[1.2rem] flex items-center justify-center transition-all active:scale-95 border border-slate-100"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                    onClick={() => setDeleteId(partner._id)}
                                    className="w-12 h-12 bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-[1.2rem] flex items-center justify-center transition-all active:scale-95 border border-slate-100"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        )}
                        {isAdmin && partner.verificationStatus === 'pending' && (
                          <button
                            onClick={() => onApprove(partner._id)}
                            className="px-6 py-2 bg-tf-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-950 transition-all active:scale-95 shadow-lg flex items-center gap-2"
                          >
                            <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                            Verify Trust
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-12 py-8 border-t border-slate-50 flex flex-wrap items-center justify-between gap-8 bg-slate-50/20">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Visualizing {pagedPartners.length} of {filtered.length} nodes in segment registry</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="px-8 py-4 bg-white hover:bg-slate-950 hover:text-white disabled:opacity-30 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 border border-slate-100 shadow-sm"
              >
                Previous
              </button>
              <div className="px-8 py-4 bg-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 italic">Segment {page} / {totalPages}</div>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                className="px-8 py-4 bg-white hover:bg-slate-950 hover:text-white disabled:opacity-30 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 border border-slate-100 shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <PartnerFormModal
            loading={loading}
            onClose={() => setShowCreateModal(false)}
            onSave={onCreate}
          />
        )}
        {editingPartner && (
          <PartnerFormModal
            partner={editingPartner}
            loading={loading}
            onClose={() => setEditingPartner(null)}
            onSave={onUpdate}
          />
        )}
        {deleteId && (
          <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md flex items-center justify-center z-[200] p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-[3.5rem] shadow-3xl p-12 max-w-sm w-full relative overflow-hidden text-center border border-slate-100">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
               <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm border border-rose-100">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
               </div>
               <h4 className="text-2xl font-bold text-slate-900 tracking-tight mb-4 uppercase">De-register Entity?</h4>
               <p className="text-sm text-slate-400 font-medium leading-relaxed mb-12 italic">Removing this record will terminate its operational visibility. This action is logged.</p>
               <div className="flex flex-col gap-4">
                  <button onClick={onDelete} disabled={loading} className="w-full py-5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] shadow-xl hover:bg-slate-950 transition-all active:scale-95">
                     {loading ? 'Archiving...' : 'Terminate Node'}
                  </button>
                  <button onClick={() => setDeleteId('')} className="w-full py-5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] border border-slate-100 hover:bg-slate-100 transition-all active:scale-95 italic">
                     Abort
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
