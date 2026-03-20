import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import PartnerFormModal from '../components/PartnerFormModal';

const pageSizeOptions = [5, 10, 20];

const statusBadgeStyle = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  inactive: 'bg-gray-50 text-gray-400 border-gray-100',
  suspended: 'bg-rose-50 text-rose-600 border-rose-100',
};

const verificationBadgeStyle = {
  verified: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  rejected: 'bg-rose-50 text-rose-600 border-rose-100',
};

const toTitle = (value) =>
  value
    .split('_')
    .join(' ')
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

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
  const isAdmin = user?.role === 'admin';

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

  const canMutatePartner = (partner) => isAdmin || String(partner.userId) === String(user?.id);

  const onCreate = async (payload) => {
    try {
      await createPartner(payload);
      setShowCreateModal(false);
      setSuccess('Partner created successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to create partner.');
    }
  };

  const onUpdate = async (payload) => {
    try {
      await updatePartner(editingPartner._id, payload);
      setEditingPartner(null);
      setSuccess('Partner updated successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to update partner.');
    }
  };

  const onDelete = async () => {
    try {
      await deletePartner(deleteId);
      setDeleteId('');
      setSuccess('Partner deleted successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to delete partner.');
    }
  };

  const onApprove = async (partnerId) => {
    try {
      await approvePartner(partnerId);
      setSuccess('Partner approved successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to approve partner.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Partners</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Global network of verified impact organizations and corporate collaborators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/partners/verification"
              className="px-5 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-amber-100 shadow-sm"
            >
              Verification Queue
            </Link>
          )}
          {canCreate && (
            <button
              onClick={() => {
                setShowCreateModal(true);
                setSuccess('');
                setError('');
              }}
              className="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              Register Entity
            </button>
          )}
        </div>
      </div>

      {(error || success) && (
        <div className="space-y-4">
          <ErrorAlert message={error} onDismiss={() => setError('')} />
          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-6 py-4 rounded-2xl shadow-sm animate-pulse">
              {success}
            </div>
          )}
        </div>
      )}

      {/* Filters & Control Hub */}
      <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
           <div className="lg:col-span-2 relative">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search organizations, industries, or CSR focus..."
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 transition-all font-semibold"
                />
                <svg className="w-5 h-5 absolute left-4 top-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
          
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
            <option value="all">Every State</option>
            <option value="active">Operational</option>
            <option value="inactive">Dormant</option>
            <option value="suspended">Restricted</option>
          </select>

          <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} className="bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/10">
            <option value="all">All Identity</option>
            <option value="pending">Awaiting Audit</option>
            <option value="verified">Verified Trust</option>
            <option value="rejected">De-authenticated</option>
          </select>

          <select value={orgTypeFilter} onChange={(e) => setOrgTypeFilter(e.target.value)} className="bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/10">
            <option value="all">All Structures</option>
            <option value="corporate">Corporate Hub</option>
            <option value="foundation">Foundation</option>
            <option value="government">Public Sector</option>
            <option value="individual">Direct Member</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sorting Order</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-indigo-50 text-indigo-600 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-tight border border-indigo-100 outline-none">
                    <option value="newest">Recent Joining</option>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                    <option value="name-desc">Alphabetical (Z-A)</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page Capacity</span>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="bg-gray-100 text-gray-600 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-tight border border-gray-200 outline-none">
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>{size} units</option>
                    ))}
                </select>
            </div>
          </div>
          <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">Synergy Global Ledger v2.0</div>
        </div>
      </div>

      {loading && partners.length === 0 ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md p-24 rounded-[40px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200 border border-gray-100 group hover:rotate-6 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-gray-400 font-bold text-sm tracking-tight mb-2">Universe Filter Empty</p>
            <p className="text-gray-300 text-xs font-medium">Try adjusting your taxonomy filters to discover partners.</p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black border-b border-gray-50">
                  <th className="px-10 py-6">Identity Registry</th>
                  <th className="px-10 py-6">Structural Type</th>
                  <th className="px-10 py-6">Direct Contact</th>
                  <th className="px-10 py-6">Liquidity Capability</th>
                  <th className="px-10 py-6">Operational Status</th>
                  <th className="px-10 py-6 text-right">Strategic Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pagedPartners.map((partner) => (
                  <tr key={partner._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="font-black text-gray-800 tracking-tight text-sm mb-1 group-hover:text-indigo-600 transition-colors uppercase">{partner.organizationName}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{partner.industry || 'Legacy Industry'} &bull; {partner.address?.city || 'Global Hub'}</div>
                    </td>
                    <td className="px-10 py-6 capitalize text-xs font-bold text-gray-700">{toTitle(partner.organizationType || 'Individual')}</td>
                    <td className="px-10 py-6">
                      <div className="text-sm font-bold text-gray-800">{partner.contactPerson?.name || '—'}</div>
                      <div className="text-[10px] font-medium text-gray-400 truncate max-w-[150px]">{partner.contactPerson?.email || '—'}</div>
                    </td>
                    <td className="px-10 py-6">
                       <p className="text-xs font-black text-indigo-600 tracking-tighter">LKR {Number(partner.partnershipPreferences?.budgetRange?.min || 0).toLocaleString()} - {Number(partner.partnershipPreferences?.budgetRange?.max || 0).toLocaleString()}</p>
                       <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">Budget Spectrum</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col gap-2">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border w-fit ${statusBadgeStyle[partner.status] || 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                            {toTitle(partner.status || 'Active')}
                        </span>
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border w-fit ${verificationBadgeStyle[partner.verificationStatus] || 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                            {toTitle(partner.verificationStatus || 'Pending')}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Link to={`/partners/${partner._id}`} className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm">Audit View</Link>
                        <Link to={`/partners/${partner._id}/impact`} className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-sm">Impact Profile</Link>
                        
                        {(canMutatePartner(partner) || isAdmin) && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingPartner(partner)}
                                    className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all active:scale-95 border border-amber-100 shadow-sm"
                                    title="Edit Profile"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                    onClick={() => setDeleteId(partner._id)}
                                    className="w-8 h-8 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100 shadow-sm"
                                    title="Delete Entity"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        )}
                        {isAdmin && partner.verificationStatus === 'pending' && (
                          <button
                            onClick={() => onApprove(partner._id)}
                            className="px-4 py-1.5 bg-indigo-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
                          >
                            Authenticate Trust
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-10 py-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visualizing {pagedPartners.length} of {filtered.length} entities in the network</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Previous
              </button>
              <div className="px-4 py-2 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 bg-white">Segment {page} / {totalPages}</div>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
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
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl p-10 max-w-sm w-full relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 font-sans">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100 italic">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h4 className="text-2xl font-black text-gray-800 tracking-tight mb-4">De-register Entity?</h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed mb-10">
                You are about to permanently remove this partnership record. This operation is **irreversible**.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onDelete}
                        disabled={loading}
                        className="flex-1 py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
                    >
                        {loading ? 'Erasing...' : 'Confirm'}
                    </button>
                    <button
                        onClick={() => setDeleteId('')}
                        className="flex-1 py-4 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Abort
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
