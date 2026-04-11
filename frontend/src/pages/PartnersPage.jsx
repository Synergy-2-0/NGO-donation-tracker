import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import PartnerFormModal from '../components/PartnerFormModal';
import { SDG_GOALS, calculatePartnerReadiness, formatSdgLabel, getReadinessTier } from '../utils/partnerInsights';
import { 
  FiSearch, FiFilter, FiPlus, FiMoreVertical, FiEye, FiEdit2, FiTrash2, 
  FiCheckCircle, FiAlertCircle, FiChevronLeft, FiChevronRight, FiGrid, FiList,
  FiMapPin, FiBriefcase, FiUser, FiActivity
} from 'react-icons/fi';

const statusBadgeStyle = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  inactive: 'bg-slate-50 text-slate-400 border-slate-100',
  suspended: 'bg-rose-50 text-rose-600 border-rose-100',
};

const verificationBadgeStyle = {
  verified: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20 shadow-[0_0_10px_rgba(255,138,0,0.1)]',
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

const toTitle = (value = '') =>
  value
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
  const [sdgFilter, setSdgFilter] = useState('all');
  const [partnershipTypeFilter, setPartnershipTypeFilter] = useState('all');
  const [readinessFilter, setReadinessFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deleteId, setDeleteId] = useState('');
  const [success, setSuccess] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const canCreate = user?.role === 'partner';
  const isAdmin = user?.role === 'admin';
  const isNgoAdmin = user?.role === 'ngo-admin';
  const canModerate = isAdmin || isNgoAdmin;

  useEffect(() => {
    fetchPartners().catch(() => {});
  }, [fetchPartners]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, verificationFilter, orgTypeFilter, sdgFilter, partnershipTypeFilter, readinessFilter, sortBy, pageSize]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let rows = partners.filter((partner) => {
      if (statusFilter !== 'all' && partner.status !== statusFilter) return false;
      if (verificationFilter !== 'all' && partner.verificationStatus !== verificationFilter) return false;
      if (orgTypeFilter !== 'all' && partner.organizationType !== orgTypeFilter) return false;
      if (sdgFilter !== 'all' && !(partner.sdgGoals || []).includes(Number(sdgFilter))) return false;
      if (partnershipTypeFilter !== 'all' && !(partner.partnershipPreferences?.partnershipTypes || []).includes(partnershipTypeFilter)) return false;

      const readinessTier = getReadinessTier(calculatePartnerReadiness(partner));
      if (readinessFilter !== 'all' && readinessTier !== readinessFilter) return false;

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
  }, [partners, search, statusFilter, verificationFilter, orgTypeFilter, sdgFilter, partnershipTypeFilter, readinessFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedPartners = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onCreate = async (payload) => {
    try {
      await createPartner(payload);
      setShowCreateModal(false);
      setSuccess('Partner registered successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register entity.');
    }
  };

  const onUpdate = async (payload) => {
    try {
      await updatePartner(editingPartner._id, payload);
      setEditingPartner(null);
      setSuccess('Partner details updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  if (loading && partners.length === 0) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400 mb-2">Network Directory</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Strategic <span className="text-brand-red">Partners</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium">
              A global ecosystem of verified impact organizations, corporate collaborators, and trust-based entities.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {canModerate && (
              <Link to="/partners/verification"
                className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all border border-white/10 flex items-center gap-2">
                <FiCheckCircle className="text-sm text-emerald-400" />
                Vetting Queue
              </Link>
            )}
            {canCreate && (
              <button onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-brand-red hover:bg-brand-red/90 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-xl shadow-xl shadow-brand-red/20 transition-all flex items-center gap-2 active:scale-95">
                <FiPlus className="text-sm stroke-[3]" />
                Register Entity
              </button>
            )}
          </div>
        </div>
      </div>

      {(error || success) && (
        <div className="space-y-3">
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-sm animate-pulse">
            <FiAlertCircle className="shrink-0" /> {error}
          </div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-sm">
            <FiCheckCircle className="shrink-0" /> {success}
          </div>}
        </div>
      )}

      {/* Control Hub */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, industry, focus..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red/20 transition-all"
            />
          </div>

          <div className="lg:col-span-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-brand-red/5">
              <option value="all">Every State</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-brand-red/5">
              <option value="all">Verification</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select value={readinessFilter} onChange={(e) => setReadinessFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-brand-red/5 font-serif">
              <option value="all">Readiness</option>
              <option value="Tier 1">Tier 1 (Elite)</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
              <option value="Tier 4">Tier 4</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex gap-2">
            <button onClick={() => setViewMode('table')} className={`flex-1 flex items-center justify-center p-3.5 rounded-2xl border transition-all ${viewMode === 'table' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
              <FiList />
            </button>
            <button onClick={() => setViewMode('grid')} className={`flex-1 flex items-center justify-center p-3.5 rounded-2xl border transition-all ${viewMode === 'grid' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
              <FiGrid />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-left text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400 border-b border-slate-100">Foundational Data</th>
                  <th className="px-8 py-6 text-left text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400 border-b border-slate-100">Identity</th>
                  <th className="px-8 py-6 text-left text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400 border-b border-slate-100">Capability</th>
                  <th className="px-8 py-6 text-left text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400 border-b border-slate-100 text-center">Governance</th>
                  <th className="px-8 py-6 text-right text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400 border-b border-slate-100">Impact Ops</th>
                </tr>
              </thead><tbody className="divide-y divide-slate-50">
                {pagedPartners.length > 0 ? pagedPartners.map((partner) => (
                  <tr key={partner._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-105 transition-transform shrink-0 font-serif">
                          {partner.logoUrl ? <img src={partner.logoUrl} className="w-full h-full object-cover" /> : <FiBriefcase className="text-slate-400 text-xl" />}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 tracking-tight leading-none mb-1.5">{partner.organizationName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{partner.industry || 'Entity'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-700">{toTitle(partner.organizationType)}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                        <FiMapPin className="text-xs" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{partner.address?.city || 'Remote'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-extrabold text-slate-900 tracking-tight">LKR {(partner.capabilities?.financialCapacity || 0).toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Capacity</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col items-center gap-2">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest border ${verificationBadgeStyle[partner.verificationStatus] || 'bg-slate-50'}`}>
                             {partner.verificationStatus}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest border ${statusBadgeStyle[partner.status] || 'bg-slate-50'}`}>
                             {partner.status}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Link to={`/partners/${partner._id}`} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-brand-red transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                             <FiEye className="text-sm" />
                          </Link>
                          {(canModerate || String(partner.userId) === String(user?.id)) && (
                            <button onClick={() => setEditingPartner(partner)} className="p-2.5 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                               <FiEdit2 className="text-sm" />
                            </button>
                          )}
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
                        <FiSearch className="text-3xl" />
                      </div>
                      <p className="text-slate-400 font-extrabold text-sm uppercase tracking-widest">No entities detected.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {pagedPartners.length > 0 ? pagedPartners.map((partner) => (
             <div key={partner._id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-60 -mr-16 -mt-16 group-hover:bg-brand-red/10 transition-colors" />
                
                <div className="relative z-10 space-y-6">
                   <div className="flex items-start justify-between">
                      <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 p-1 flex items-center justify-center shadow-inner overflow-hidden">
                        {partner.logoUrl ? <img src={partner.logoUrl} className="w-full h-full object-cover rounded-2xl" /> : <FiBriefcase className="text-slate-100 text-3xl" />}
                      </div>
                      <div className="flex flex-col gap-1.5 items-end">
                         <span className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest border ${verificationBadgeStyle[partner.verificationStatus] || 'bg-slate-50'}`}>
                           {partner.verificationStatus}
                         </span>
                         <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[.2em] font-serif">
                            Tier {getReadinessTier(calculatePartnerReadiness(partner)).slice(-1)}
                         </span>
                      </div>
                   </div>

                   <div>
                      <h3 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight group-hover:text-brand-red transition-colors">{partner.organizationName}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{partner.industry || 'Institutional Entity'}</p>
                   </div>

                   <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">Structural</p>
                         <p className="text-sm font-bold text-slate-700">{toTitle(partner.organizationType)}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">Location</p>
                         <p className="text-sm font-bold text-slate-700">{partner.address?.city || 'Overseas'}</p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-2">
                       <div>
                          <p className="text-xl font-extrabold text-slate-900 tracking-tighter">LKR {(partner.capabilities?.financialCapacity || 0).toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liquidity Status</p>
                       </div>
                       <Link to={`/partners/${partner._id}`} className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-2xl text-white hover:bg-brand-red transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                          <FiChevronRight className="text-xl" />
                       </Link>
                   </div>
                </div>
             </div>
           )) : (
             <div className="md:col-span-2 lg:col-span-3 py-32 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                <FiAlertCircle className="text-5xl text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-extrabold uppercase tracking-widest">Zero Intelligence Detected.</p>
             </div>
           )}
        </div>
      )}

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all">
            <FiChevronLeft />
          </button>
          <div className="flex items-center gap-1.5 px-4 h-12 bg-white rounded-2xl border border-slate-200">
            <span className="text-sm font-extrabold text-slate-800">{page}</span>
            <span className="text-slate-300 font-bold">/</span>
            <span className="text-sm font-bold text-slate-400">{totalPages}</span>
          </div>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all">
            <FiChevronRight />
          </button>
        </div>
      )}

      {/* Legacy Modals */}
      {showCreateModal && <PartnerFormModal loading={loading} onClose={() => setShowCreateModal(false)} onSave={onCreate} />}
      {editingPartner && <PartnerFormModal partner={editingPartner} loading={loading} onClose={() => setEditingPartner(null)} onSave={onUpdate} />}
    </div>
  );
}
