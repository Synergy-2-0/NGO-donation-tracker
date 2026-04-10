import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartnerOperations } from '../context/PartnerOperationsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import PartnershipFormModal from '../components/PartnershipFormModal';
import { useTranslation } from 'react-i18next';
import { 
  FiFileText, FiPlus, FiChevronRight, FiClock, FiCheckCircle, 
  FiAlertCircle, FiTrendingUp, FiLayers, FiActivity, FiX, FiSearch, FiArrowRight, FiShield
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const statusBadgeStyle = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  completed: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  rejected: 'bg-rose-50 text-rose-600 border-rose-100',
  draft: 'bg-slate-50 text-slate-400 border-slate-100',
  signed: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20',
  accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

const asMoney = (val) => `LKR ${Number(val || 0).toLocaleString()}`;

export default function PartnerAgreementsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const { 
    agreements,
    loading,
    error,
    setError,
    fetchAllAgreements,
    fetchMyPartnerAgreements, 
    createAgreement, 
    fetchPartnerProfile,
    acceptAgreement,
    approveAgreement,
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
              setError(t('institutional_agreements.error.onboarding'));
            }
          })
          .catch(() => {
            setPartner(null);
            setError(t('institutional_agreements.error.load'));
          });
    } else if (isAdmin) {
        fetchAllAgreements();
    }
    
    if (location.state?.prefillCampaignId) {
        setShowFormModal(true);
    }
  }, [fetchPartnerProfile, fetchMyPartnerAgreements, fetchAllAgreements, location.state, user?.role, isAdmin, t]);

  const [confirmingAgreement, setConfirmingAgreement] = useState(null);

  const onAccept = (id) => {
    setConfirmingAgreement(id);
  };

  const confirmFormalize = async () => {
    if (!confirmingAgreement) return;
    try {
        await acceptAgreement(confirmingAgreement);
        setSuccess(t('institutional_agreements.success.formalized'));
        setConfirmingAgreement(null);
        if (user?.role === 'partner') fetchMyPartnerAgreements();
        else fetchAllAgreements();
    } catch (err) {
        setError(err.response?.data?.message || t('institutional_agreements.error.sign'));
    }
  };

  const onUpdateStatus = async (agreementId, status) => {
    try {
      await updateAgreementStatus(agreementId, status);
      setSuccess(`Agreement transitioned to ${status} state.`);
      if (user?.role === 'partner') fetchMyPartnerAgreements();
      else fetchAllAgreements();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update agreement status.');
    }
  };

  const onApprove = async (id) => {
    try {
        await approveAgreement(id);
        setSuccess(t('institutional_agreements.success.activated'));
        if (user?.role === 'partner') fetchMyPartnerAgreements();
        else fetchAllAgreements();
    } catch (err) {
        setError(err.response?.data?.message || t('institutional_agreements.error.activate'));
    }
  };

  const onSave = async (payload) => {
    try {
        const pId = user.role === 'partner' ? partner?._id : payload.partnerId;
        await createAgreement({ ...payload, partnerId: pId });
        setShowFormModal(false);
        setSuccess('Strategic partnership proposal successfully initialized.');
        if (user?.role === 'partner') fetchMyPartnerAgreements();
        else fetchAllAgreements();
    } catch (err) {
        setError(err.response?.data?.message || 'Proposal initialization failure Hub.');
    }
  };

  const filteredAgreements = useMemo(() => {
    return agreements.filter(a => 
       a.campaignId?.title?.toLowerCase().includes(search.toLowerCase()) ||
       a.partnerId?.organizationName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [agreements, search]);

  if (loading && agreements.length === 0) return <LoadingSpinner message={t('marketplace.loading')} />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-6 animate-fadeIn font-sans selection:bg-tf-primary selection:text-white text-left">
      
      {/* Registry Hero */}
      <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 px-3 py-1 bg-tf-primary/10 border border-tf-primary/20 rounded-full text-tf-primary text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-sm ">
                        <FiLayers className="text-sm" /> {t('institutional_agreements.title')}
                    </span>
                    <span className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.5em] ">REGISTRY NODE</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter  leading-none">
                    Mission <span className="text-tf-primary not-">Agreements</span>
                </h1>
                <p className="text-white/50 text-base md:text-lg font-medium  max-w-2xl leading-relaxed">
                    {t('institutional_agreements.subtitle')}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col ">
                        <span className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest ">{t('dashboard.stats.active_campaigns')}</span>
                        <span className="text-xl font-extrabold text-white tabular-nums tracking-tighter ">{agreements.filter(a => a.status === 'active').length}</span>
                    </div>
                </div>
            </div>

            {user?.role === 'partner' && (
                <button 
                   onClick={() => setShowFormModal(true)}
                   className="relative group bg-tf-primary hover:bg-orange-500 text-white rounded-[2rem] p-1 shadow-2xl transition-all active:scale-95 "
                >
                    <div className="px-10 py-5 bg-slate-900 rounded-[1.8rem] flex items-center gap-4 border border-white/10 group-hover:bg-tf-primary group-hover:border-tf-primary transition-all">
                       <FiPlus className="text-2xl" />
                       <div className="text-left">
                         <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors ">NEW ALLIANCE</p>
                         <p className="text-xs font-extrabold uppercase tracking-[0.2em] ">{t('institutional_agreements.create')}</p>
                       </div>
                    </div>
                </button>
            )}
        </div>
      </section>

      {success && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4 text-emerald-700 font-bold  shadow-sm mx-4">
          <FiCheckCircle className="text-xl" />
          {success}
        </motion.div>
      )}

      {error && <ErrorAlert error={error} onClose={() => setError('')} />}

      {/* Database Node Controls */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden text-left ">
        <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30 ">
            <div className="relative flex-1 max-w-md ">
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('institutional_agreements.search')}
                        className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-tf-primary/5 focus:border-tf-primary/50 transition-all outline-none  shadow-sm group-hover:shadow-md"
                    />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest ">
                <FiActivity className="text-tf-primary " /> Logged Intelligence: {filteredAgreements.length} Nodes
            </div>
        </div>

        <div className="overflow-x-auto ">
            <table className="w-full text-left border-collapse ">
                <thead>
                    <tr className="bg-slate-50/50 ">
                        <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ">{t('institutional_agreements.table.mission')}</th>
                        {isAdmin && <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ">{t('institutional_agreements.table.partner')}</th>}
                        <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ">{t('institutional_agreements.table.allocation')}</th>
                        <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ">{t('institutional_agreements.table.state')}</th>
                        <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right ">{t('institutional_agreements.table.action')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 ">
                    <AnimatePresence mode='popLayout'>
                        {filteredAgreements.length > 0 ? filteredAgreements.map((a, idx) => (
                            <motion.tr 
                                key={a._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                                className="group hover:bg-slate-50/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-slate-100 "
                            >
                                <td className="px-10 py-8 ">
                                    <div className="space-y-2 ">
                                        <div className="flex items-center gap-2">
                                           <div className="w-1.5 h-6 bg-tf-primary rounded-full shadow-[0_0_12px_rgba(255,145,0,0.4)]" />
                                           <h3 className="text-[13px] font-extrabold text-slate-950  tracking-tight uppercase leading-none">{a.title || 'Official Partnership Node'}</h3>
                                        </div>
                                        <div className="pl-3.5 space-y-1">
                                            <p className="text-[10px] font-bold text-slate-500  tracking-tight">{a.campaignId?.title}</p>
                                            <p className="text-[8px] text-tf-primary font-extrabold uppercase tracking-[0.4em] ">MISSION REF: {a.campaignId?._id?.slice(-8)}</p>
                                        </div>
                                    </div>
                                </td>
                                {isAdmin && (
                                    <td className="px-10 py-8 ">
                                        <div className="flex items-center gap-4  group/partner">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-extrabold  shadow-lg transition-transform group-hover/partner:scale-110 group-hover/partner:bg-tf-primary">
                                                {a.partnerId?.organizationName?.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700  group-hover/partner:text-slate-900">{a.partnerId?.organizationName}</span>
                                        </div>
                                    </td>
                                )}
                                <td className="px-10 py-8 ">
                                    <div className="space-y-2 ">
                                        <div className="flex items-center gap-2 ">
                                            <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest ">Allocation Hub</span>
                                        </div>
                                        <div className="space-y-1.5 ">
                                            <span className="text-[15px] font-extrabold text-slate-950  tabular-nums tracking-tighter uppercase">{asMoney(a.amount || a.totalValue)}</span>
                                            <div className="flex items-center gap-2 ">
                                                <div className={`w-1.5 h-1.5 rounded-full ${a.legalCompliance?.verified ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-slate-200'} `} />
                                                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest ">{a.legalCompliance?.verified ? 'Compliance Verified' : 'Compliance Check'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 ">
                                    <div className="space-y-2 ">
                                        <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest ">Mission State</span>
                                        <div className="flex ">
                                            <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-[9px] font-extrabold uppercase tracking-widest  shadow-sm transition-all ${statusBadgeStyle[a.status] || statusBadgeStyle.draft}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse " />
                                                {a.status === 'pending' ? 'Verification Hub' : a.status === 'active' ? 'Active Mission' : a.status.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 ">
                                    <div className="flex items-center justify-end gap-3 ">
                                        <button 
                                            onClick={() => navigate(`/partner/milestones/${a._id}`)}
                                            title="View Roadmap"
                                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-tf-primary hover:shadow-xl transition-all active:scale-95 "
                                        >
                                            <FiLayers size={16} />
                                        </button>
                                        
                                        {/* NGO Admin Actions */}
                                        {isAdmin && a.status === 'draft' && (
                                            <button 
                                                onClick={() => onUpdateStatus(a._id, 'pending')}
                                                className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-extrabold uppercase tracking-widest hover:bg-tf-primary transition-all shadow-lg "
                                            >
                                                Send Proposal
                                            </button>
                                        )}

                                        {isAdmin && (a.status === 'pending' || a.status === 'signed') && (
                                            <button 
                                                onClick={() => onApprove(a._id)}
                                                className="px-6 py-3 bg-tf-primary text-white rounded-xl text-[9px] font-extrabold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg "
                                            >
                                                {t('institutional_agreements.activate')}
                                            </button>
                                        )}

                                        {/* Partner Actions */}
                                        {user?.role === 'partner' && a.status === 'pending' && (
                                            <button 
                                                onClick={() => onAccept(a._id)}
                                                className="px-6 py-3.5 bg-slate-900 text-white rounded-xl text-[9px] font-extrabold uppercase tracking-[0.2em] hover:bg-tf-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95  transition-all"
                                            >
                                                {t('institutional_agreements.formalize')}
                                            </button>
                                        )}

                                        <button 
                                            className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 hover:shadow-md transition-all "
                                            onClick={() => navigate(`/partner/milestones/${a._id}`)}
                                        >
                                            <FiChevronRight size={16} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        )) : (
                            <tr className="">
                                <td colSpan="5" className="px-10 py-32 text-center ">
                                    <div className="max-w-xs mx-auto space-y-4 ">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto shadow-inner ">
                                            <FiLayers size={40} />
                                        </div>
                                        <div className="space-y-1 ">
                                            <h4 className="text-lg font-extrabold text-slate-900 tracking-tight ">Protocol Empty.</h4>
                                            <p className="text-xs text-slate-400 font-medium ">{t('institutional_agreements.empty')}</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </AnimatePresence>
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

      {/* Digital Signature Confirmation Modal */}
      <AnimatePresence>
        {confirmingAgreement && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl ">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
               className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/20 "
            >
              <div className="p-10 bg-slate-900 text-white relative text-center ">
                 <div className="absolute top-0 inset-x-0 h-32 bg-tf-primary/20 blur-3xl rounded-full -mt-16 " />
                 <div className="relative z-10 space-y-4">
                    <div className="w-20 h-20 bg-tf-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-tf-primary/30 mx-auto ">
                        <FiShield size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-extrabold tracking-tighter leading-none mb-1 ">Institutional Signature</h3>
                        <p className="text-[10px] uppercase font-extrabold tracking-widest text-white/40 ">Legal Authorization Required</p>
                    </div>
                 </div>
              </div>

              <div className="p-10 space-y-8 text-center ">
                 <p className="text-sm font-bold text-slate-600 leading-relaxed ">
                    By clicking <span className="text-slate-950">"Authorize & Sign"</span>, you are providing a legally binding digital signature to this partnership agreement. You confirm that you have reviewed the roadmap, fiscal allocations, and terms of service.
                 </p>

                 <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-3 text-left">
                    <div className="flex items-center gap-3">
                        <FiCheckCircle className="text-tf-primary" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Roadmap Authorization</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <FiCheckCircle className="text-tf-primary" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Financial Commitment Registry</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <FiCheckCircle className="text-tf-primary" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Operational Strategic Protocol</span>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button 
                        onClick={() => setConfirmingAgreement(null)}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-slate-50 transition-all "
                    >
                        Decline
                    </button>
                    <button 
                        onClick={confirmFormalize}
                        className="flex-[1.5] py-4 bg-sf-dark bg-slate-900 text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-tf-primary transition-all shadow-xl shadow-slate-900/10 "
                    >
                        Authorize & Sign
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
