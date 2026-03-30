import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartnerOperations } from '../context/PartnerOperationsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import PartnershipFormModal from '../components/PartnershipFormModal';
import { 
  FiFileText, FiPlus, FiChevronRight, FiClock, FiCheckCircle, 
  FiAlertCircle, FiTrendingUp, FiLayers, FiActivity, FiX, FiSearch
} from 'react-icons/fi';

const statusBadgeStyle = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  completed: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  rejected: 'bg-rose-50 text-rose-600 border-rose-100',
  draft: 'bg-slate-50 text-slate-400 border-slate-100',
};

const asMoney = (val) => `LKR ${Number(val || 0).toLocaleString()}`;

export default function PartnerAgreementsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const { 
    agreements,
    loading,
    error,
    setError,
    fetchAllAgreements,
    currentAgreement,
    fetchMyPartnerAgreements, 
    createAgreement, 
    fetchPartnerProfile,
    acceptAgreement,
    approveAgreement
  } = usePartnerOperations();
  
  const [partner, setPartner] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'ngo-admin';

  useEffect(() => {
    if (user?.role === 'partner') {
        fetchPartnerProfile()
          .then(p => {
            setPartner(p);
            if (p?._id) {
              fetchMyPartnerAgreements();
            } else {
              setError('Partner profile not found. Please complete onboarding.');
            }
          })
          .catch(() => {
            setPartner(null);
            setError('Failed to load partner profile.');
          });
    } else if (isAdmin) {
        fetchAllAgreements();
    }
    
    // Auto-open if redirected from Marketplace
    if (location.state?.prefillCampaignId) {
        setShowFormModal(true);
    }
  }, [fetchPartnerProfile, fetchMyPartnerAgreements, fetchAllAgreements, location.state, user?.role, isAdmin]);

  const stats = useMemo(() => {
    const active = agreements.filter(a => a.status === 'active').length;
    const total = agreements.reduce((sum, a) => sum + (Number(a.totalValue) || 0), 0);
    return { active, total };
  }, [agreements]);

  const onAccept = async (id) => {
    try {
        await acceptAgreement(id);
        setSuccess('Agreement formalized and signed.');
        if (user?.role === 'partner') fetchMyPartnerAgreements();
        else fetchAllAgreements();
    } catch (err) {
        setError(err.response?.data?.message || 'Acceptance signature failed.');
    }
  };

  const onApprove = async (id) => {
    try {
        await approveAgreement(id);
        setSuccess('Agreement verified and activated.');
        if (user?.role === 'partner') fetchMyPartnerAgreements();
        else fetchAllAgreements();
    } catch (err) {
        setError(err.response?.data?.message || 'Activation failed.');
    }
  };

  const filtered = agreements.filter(a => {
    const term = search.toLowerCase();
    const campaignTitle = a.campaignId?.title || a.title || '';
    const type = a.partnershipType || a.agreementType || '';
    
    return campaignTitle.toLowerCase().includes(term) || 
           type.toLowerCase().includes(term) ||
           a._id.toLowerCase().includes(term);
  });

  const onSave = async (payload) => {
    try {
        await createAgreement({ ...payload, partnerId: partner._id });
        setSuccess('Agreement created successfully.');
        setShowFormModal(false);
        if (user?.role === 'partner') fetchMyPartnerAgreements();
        else fetchAllAgreements();
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to create agreement.');
    }
  };

  if (loading && !partner && user?.role === 'partner') return <LoadingSpinner message="Loading agreements..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-left">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 mb-2">Management Center</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{isAdmin ? 'Global' : 'My'} <span className="text-brand-red">Agreements</span></h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium">Track historical contributions, active partnerships, and ongoing mission commitments.</p>
          </div>
          <button onClick={() => setShowFormModal(true)} className="px-6 py-3 bg-brand-red text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-xl shadow-brand-red/20 flex items-center gap-2 active:scale-95">
            <FiPlus className="text-sm stroke-[3]" /> Propose New Agreement
          </button>
        </div>
      </div>

      {(error || success) && (
        <div className="space-y-3 px-2">
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3"><FiAlertCircle /> {error} <FiX className="ml-auto cursor-pointer" onClick={() => setError('')} /></div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3"><FiCheckCircle /> {success} <FiX className="ml-auto cursor-pointer" onClick={() => setSuccess('')} /></div>}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-white rounded-[32px] border border-slate-100 p-7 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg"><FiActivity /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Agreements</p>
               <h4 className="text-2xl font-black text-slate-900">{stats.active}</h4>
            </div>
         </div>
         <div className="bg-white rounded-[32px] border border-slate-100 p-7 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 bg-brand-red text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-brand-red/10"><FiTrendingUp /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Commitment</p>
               <h4 className="text-2xl font-black text-slate-900">{asMoney(stats.total)}</h4>
            </div>
         </div>
         <div className="bg-white rounded-[32px] border border-slate-100 p-7 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg"><FiClock /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Review</p>
               <h4 className="text-2xl font-black text-slate-900">{agreements.filter(a => a.status === 'pending').length}</h4>
            </div>
         </div>
      </div>

      {/* Main Filter area */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm"><FiLayers /></span>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Agreement Registry</h3>
           </div>
           <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search campaigns..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-red/5 transition-all"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full">
             <thead>
                <tr className="text-left text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">Campaign Mission</th>
                  <th className="px-8 py-5">Partnership Type</th>
                  <th className="px-8 py-5">Contract Value</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {filtered.length > 0 ? filtered.map(a => {
                  const isAccepted = !!a.partnerAcceptedAt;
                  const isApproved = !!a.approvedAt;
                  const isPending = a.status === 'pending';
                  const isUserPartner = user?.role === 'partner';
                  const needsPartnerAcceptance = isPending && !isAccepted && isUserPartner;
                  const needsAdminApproval = isPending && !isApproved && isAdmin;

                  return (
                  <tr key={a._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                       <div>
                          <p className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-brand-red transition-colors">{a.campaignId?.title || a.title || 'Unknown Mission'}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: #{a._id.slice(-8).toUpperCase()}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-bold text-slate-500 capitalize">{(a.partnershipType || a.agreementType || 'Partnership')} Support</span>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 tracking-tighter">
                       {asMoney(a.totalValue)}
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex flex-col items-center gap-1">
                           <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusBadgeStyle[a.status] || 'bg-slate-50'}`}>
                              {a.status}
                           </span>
                           {isPending && (
                               <div className="flex gap-1">
                                   <div title="Partner Acceptance" className={`w-1.5 h-1.5 rounded-full ${isAccepted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                   <div title="Admin Approval" className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                               </div>
                           )}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          {needsPartnerAcceptance && (
                              <button 
                                onClick={() => onAccept(a._id)}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                              >
                                Formalize & Accept
                              </button>
                          )}
                          {needsAdminApproval && (
                              <button 
                                onClick={() => onApprove(a._id)}
                                className="px-4 py-2 bg-brand-red text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/10 active:scale-95"
                              >
                                Verify & Activate
                              </button>
                          )}
                          <Link to={`/partner/agreements/${a._id}/milestones`} className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95" title="Execution Matrix">
                             <FiChevronRight className="text-lg" />
                          </Link>
                       </div>
                    </td>
                 </tr>
                 );
               }) : (
                 <tr>
                   <td colSpan="5" className="px-8 py-24 text-center">
                      <FiFileText className="text-5xl text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Agreements Registered.</p>
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      </div>

      {showFormModal && (
        <PartnershipFormModal 
          onClose={() => setShowFormModal(false)}
          onSave={onSave}
          initialCampaignId={location.state?.prefillCampaignId}
        />
      )}
    </div>
  );
}
