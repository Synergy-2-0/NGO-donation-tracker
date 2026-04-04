import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartnerOperations } from '../context/PartnerOperationsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle, FiClock, FiActivity, FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiFileText, FiX, FiAlertTriangle, FiArrowRight, FiCheck, FiLink, FiCheckSquare, FiTarget, FiLayers, FiDollarSign } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

function asDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const emptyMilestone = {
  title: '',
  description: '',
  dueDate: '',
  status: 'pending',
  budget: '',
  evidenceUrl: '',
};

const MILESTONE_STATUSES = ['pending', 'in-progress', 'completed'];

export default function AgreementMilestonesPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentAgreement,
    milestones,
    loading,
    error,
    setError,
    fetchAgreementById,
    fetchMilestones,
    fetchMyPartnerAgreements,
    fetchAllAgreements,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    updateAgreement,
    uploadMilestoneEvidence,
  } = usePartnerOperations();

  const isAdminLike = user?.role === 'admin' || user?.role === 'ngo-admin';

  const cleanId = id?.replace(/,+$/, '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMilestone);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (cleanId) {
      fetchAgreementById(cleanId).catch(() => {});
      fetchMilestones({ agreementId: cleanId }).catch(() => {});
    } else {
      fetchMilestones({}).catch(() => {});
      if (user?.role === 'partner') fetchMyPartnerAgreements();
      else fetchAllAgreements();
    }
  }, [cleanId, fetchAgreementById, fetchMilestones, fetchMyPartnerAgreements, fetchAllAgreements, user?.role]);

  const badgeConfig = {
    pending: { label: t('milestones.filter_pending'), classes: 'bg-slate-100 text-slate-500 border-slate-200', icon: <FiClock className="text-xl text-slate-400" /> },
    'in-progress': { label: t('milestones.filter_executing'), classes: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20', icon: <FiActivity className="text-xl text-tf-primary" /> },
    completed: { label: t('milestones.filter_completed'), classes: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: <FiCheckCircle className="text-xl text-emerald-500" /> },
  };

  const activeMission = id ? currentAgreement : null;

  const visibleMilestones = useMemo(() => {
    // 1. Identify primary milestones from the registry Hub
    let source = milestones || [];
    
    // 2. If viewing a specific mission, hub-filter by its clean identifier
    if (cleanId) {
        source = source.filter(m => {
            // Embedded milestones don't have an agreementId because they ARE part of the currentAgreement
            if (!m.agreementId) return true; 
            const mId = (m.agreementId?._id || m.agreementId)?.toString();
            return mId === cleanId.toString();
        });
    }

    // 3. Merge embedded milestones Hub Hub Hub
    if (cleanId && currentAgreement) {
        const embedded = currentAgreement.initialMilestones || 
                         currentAgreement.milestones || 
                         currentAgreement.initial_milestones || 
                         [];
        // Filter out any embedded milestones that might somehow already be in source by _id (if ever synced)
        const newEmbedded = embedded.filter(em => !em._id || !source.find(s => s._id === em._id));
        source = [...source, ...newEmbedded];
    }

    let filtered = Array.isArray(source) ? [...source] : [];
    if (statusFilter !== 'all') {
        filtered = filtered.filter((item) => (item.status || 'pending') === statusFilter);
    }
    return filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [milestones, currentAgreement?.milestones, currentAgreement?.initialMilestones, statusFilter, cleanId]);

  const groupedData = useMemo(() => {
    if (id) return [{ id: 'current', title: '', milestones: visibleMilestones }];
    const groups = {};
    visibleMilestones.forEach(m => {
      const gId = m.agreementId?._id || 'unknown';
      if (!groups[gId]) {
        groups[gId] = {
          id: gId,
          title: m.agreementId?.title || 'Operational Strategic Node',
          campaign: m.agreementId?.campaignId || m.campaignId,
          milestones: []
        };
      }
      groups[gId].milestones.push(m);
    });
    return Object.values(groups);
  }, [visibleMilestones, id]);

  const progress = useMemo(() => {
    if (!milestones.length) return 0;
    const completedCount = milestones.filter((item) => item.status === 'completed').length;
    return Math.round((completedCount / milestones.length) * 100);
  }, [milestones]);

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      dueDate: item.dueDate?.slice(0, 10) || '',
      status: item.status || 'pending',
      evidenceUrl: item.evidence?.url || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const openCreate = () => {
    if (!id) {
        setFormError('Please select a specific mission node from the hub to initialize a milestone.');
        return;
    }
    setEditing(null);
    setForm(emptyMilestone);
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const payload = { ...form, budget: Number(form.budget) || 0 };
      if (editing) {
        await updateMilestone(editing._id, payload);
        setSuccess('Milestone protocol updated successfully.');
      } else {
        await createMilestone({ ...payload, agreementId: id });
        setSuccess('New mission milestone authorized and deployed.');
      }
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to authorize milestone operation.');
    }
  };

  const handleFileUpload = async (milestone, file) => {
    if (!file) return;
    if (!milestone._id) return setError('Cannot upload evidence for embedded milestone without saving first.');
    setUploading(true);
    try {
      // The context function expects just the File object: uploadMilestoneEvidence(file)
      const data = await uploadMilestoneEvidence(file);
      
      if (data && data.url) {
          if (!milestone.agreementId && activeMission) {
               // Update embedded milestone
               const updatedInitialMilestones = (activeMission.initialMilestones || []).map(m => 
                   m._id === milestone._id ? { ...m, evidence: { url: data.url, uploadedAt: new Date() } } : m
               );
               await updateAgreement(activeMission._id, { 
                   campaignId: activeMission.campaignId?._id || activeMission.campaignId,
                   initialMilestones: updatedInitialMilestones 
               });
               fetchAgreementById(activeMission._id).catch(() => {});
          } else {
               // Update real milestone
               await updateMilestone(milestone._id, { evidence: { url: data.url, uploadedAt: new Date() } });
          }
          setSuccess('Evidence node synchronized successfully.');
          setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Evidence synchronization failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mid) => {
    if (!window.confirm('Are you sure you want to terminate this node?')) return;
    try {
        await deleteMilestone(mid);
        setSuccess('Node terminated successfully.');
        setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
        setError('Failed to terminate node.');
    }
  };

  const handleMarkExecuting = async (milestone) => {
    if (!window.confirm('Mark this node as ready for execution?')) return;
    try {
        if (!milestone.agreementId && activeMission) {
            // It's an embedded milestone!
            const updatedInitialMilestones = (activeMission.initialMilestones || []).map(m => 
                m._id === milestone._id ? { ...m, status: 'in-progress' } : m
            );
            await updateAgreement(activeMission._id, { 
                campaignId: activeMission.campaignId?._id || activeMission.campaignId,
                initialMilestones: updatedInitialMilestones 
            });
            fetchAgreementById(activeMission._id).catch(() => {});
        } else {
            await updateMilestone(milestone._id, { status: 'in-progress' });
        }
        setSuccess('Mission milestone pushed to Executing phase.');
        setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data || err.message || JSON.stringify(err);
        setError(`Failed to update protocol status: ${msg}`);
    }
  };

  const handlePayMilestone = async (milestone) => {
    if (!user || user.role !== 'partner') return;
    if (paymentLoading) return;
    if (!milestone.budget || milestone.budget <= 0) {
        return setError('Milestone budget is invalid or zero.');
    }
    
    setPaymentLoading(true);
    try {
        const campaignId = milestone.campaignId || activeMission?.campaignId?._id || activeMission?.campaignId;
        const ngoId = activeMission?.campaignId?.createdBy || '660000000000000000000000';
        const payload = {
            donorId: user._id,
            ngoId: ngoId,
            campaignId: campaignId,
            amount: milestone.budget,
            currency: "LKR",
            firstName: user?.name?.split(' ')[0] || 'Partner',
            lastName: user?.name?.split(' ').slice(1).join(' ') || 'User',
            email: user?.email || '',
            phone: '0700000000',
            address: 'Colombo',
            city: 'Colombo',
            country: 'Sri Lanka',
            type: 'one-time',
            frequency: null
         };

         const { data } = await api.post('/api/finance/payhere/init', payload);
         if (data.success && data.paymentData) {
            // Optimistically formalize the completed status for the sandbox lifecycle Hub
            if (!milestone.agreementId && activeMission) {
                const updatedInitialMilestones = (activeMission.initialMilestones || []).map(m => 
                    m._id === milestone._id ? { ...m, status: 'completed' } : m
                );
                await updateAgreement(activeMission._id, { 
                    campaignId: activeMission.campaignId?._id || activeMission.campaignId,
                    initialMilestones: updatedInitialMilestones 
                });
            } else {
                await updateMilestone(milestone._id, { status: 'completed' });
            }

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://sandbox.payhere.lk/pay/checkout';
            Object.keys(data.paymentData).forEach(key => {
               const input = document.createElement('input');
               input.type = 'hidden';
               input.name = key;
               input.value = data.paymentData[key];
               form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
         }
    } catch (err) {
        setError(err.response?.data?.message || 'Payment initialization failed');
    } finally {
        setPaymentLoading(false);
    }
  };

  if (loading && milestones.length === 0) return <LoadingSpinner message={t('marketplace.loading')} />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-6 font-sans selection:bg-tf-primary selection:text-white text-left">
      
      {/* Dynamic Roadmap Header */}
      <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 px-3 py-1 bg-tf-primary/10 border border-tf-primary/20 rounded-full text-tf-primary text-[10px] font-black uppercase tracking-widest backdrop-blur-sm italic">
                        <FiTarget className="text-sm" /> {t('milestones.header_badge')}
                    </span>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">MISSION HUB</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic leading-none">
                    {t('milestones.institutional')} <span className="text-tf-primary not-italic">{t('milestones.roadmap')}</span>
                </h1>
                <p className="text-white/50 text-base md:text-lg font-medium italic max-w-2xl leading-relaxed">
                    {id ? t('milestones.subtitle') : t('milestones.global_hub_desc')}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col italic">
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">{t('milestones.progress')}</span>
                        <span className="text-xl font-black text-white tabular-nums tracking-tighter italic">{progress}%</span>
                    </div>
                    {id && (
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col italic">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">{t('milestones.total_volume')}</span>
                            <span className="text-xl font-black text-tf-primary tabular-nums tracking-tighter italic">LKR {Number(activeMission?.amount || activeMission?.totalValue || 0).toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {id && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] lg:w-80 space-y-6 italic">
                    <div className="space-y-4">
                        <div>
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 italic">{t('milestones.partner_node')}</p>
                            <p className="text-sm font-bold text-white leading-tight italic">{activeMission?.partnerId?.organizationName || 'Verified Strategic Entity'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 italic">{t('milestones.mission_node')}</p>
                            <p className="text-sm font-bold text-white leading-tight italic">{activeMission?.campaignId?.title || 'Operational Impact Node'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </section>

      {success && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4 text-emerald-700 font-bold italic shadow-sm mx-4">
          <FiCheckSquare className="text-xl" />
          {success}
        </motion.div>
      )}

      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden text-left italic">
        {/* Navigation & Controls */}
        <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30 italic">
          <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto selection:bg-tf-primary/10 italic">
            {['all', 'pending', 'in-progress', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap italic ${
                  statusFilter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {f === 'all' ? t('milestones.filter_all') : f === 'pending' ? t('milestones.filter_pending') : f === 'in-progress' ? t('milestones.filter_executing') : t('milestones.filter_completed')}
              </button>
            ))}
          </div>

          {!isAdminLike && user?.role === 'partner' && id && (
            <button 
                onClick={openCreate}
                className="px-8 py-3.5 bg-tf-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-tf-primary/20 active:scale-95 flex items-center gap-3 italic"
            >
              <FiPlus className="text-lg" /> {t('milestones.create_milestone')}
            </button>
          )}
        </div>

        {/* Grouped Milestone Sections */}
        <div className="space-y-12">
          {groupedData.length > 0 ? groupedData.map((group, gIdx) => (
            <div key={group.id || gIdx} className="animate-fadeIn">
              {!id && (
                <div className="px-10 py-8 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between group cursor-pointer hover:bg-slate-800 transition-all border-l-4 border-tf-primary shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                         <div className="px-3 py-1 bg-tf-primary/10 border border-tf-primary/20 rounded-full text-tf-primary text-[8px] font-black uppercase tracking-widest italic">
                            {group.campaign?.title || 'Mission Node'}
                         </div>
                    </div>
                    <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-none">
                      {group.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-8 mt-4 md:mt-0">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic mb-1">Success Nodes</p>
                      <p className="text-sm font-black text-tf-primary italic tabular-nums">{group.milestones.length} Active Steps</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/partner/milestones/${group.id}`)}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white/30 group-hover:text-tf-primary group-hover:border-tf-primary group-hover:bg-tf-primary/5 transition-all shadow-2xl"
                    >
                      <FiArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('milestones.table_milestones.title')}</th>
                      <th className="px-5 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('milestones.table_milestones.date')}</th>
                      <th className="px-5 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Budget</th>
                      <th className="px-5 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('milestones.table_milestones.status')}</th>
                      <th className="px-5 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('milestones.table_milestones.evidence')}</th>
                      <th className="px-10 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">{t('milestones.table_milestones.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {group.milestones.map((item, msIdx) => (
                        <motion.tr 
                          key={item._id || `${item.title}-${msIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: msIdx * 0.05 }}
                          className="group hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-10 py-6 w-[28%]">
                            <div className="space-y-0.5">
                              <span className="text-[15px] font-bold text-slate-900 tracking-tight">{item.title}</span>
                              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                            </div>
                          </td>
                          <td className="px-5 py-6">
                            <span className="text-sm font-semibold text-slate-700 tabular-nums">{item.dueDate ? asDate(item.dueDate) : 'No Date Set'}</span>
                          </td>
                          <td className="px-5 py-6 font-bold text-slate-900 text-[15px] tabular-nums">
                             LKR {(item.budget || 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-6">
                               <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest w-fit ${badgeConfig[item.status || 'pending']?.classes}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]" />
                                  {badgeConfig[item.status || 'pending']?.label}
                              </div>
                          </td>
                          <td className="px-5 py-6">
                            {item.evidence?.url ? (
                              <a 
                                href={item.evidence.url} target="_blank" rel="noopener noreferrer" 
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 text-tf-primary hover:bg-orange-100 transition-colors"
                              >
                                <FiLink size={14} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">{t('milestones.view_evidence')}</span>
                              </a>
                            ) : (
                              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">-</span>
                            )}
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                              {(user?.role === 'partner' || user?.role === 'ngo-admin') && (
                                  <div className="relative" title="Upload Evidence">
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(item, e.target.files[0])} disabled={uploading} />
                                    <button className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg hover:bg-tf-primary hover:text-white transition-all">
                                      <FiPlus className="text-sm" />
                                    </button>
                                  </div>
                              )}
                              
                              {user?.role === 'partner' && (
                                <>
                                  {item.status === 'in-progress' && (
                                    <button onClick={() => handlePayMilestone(item)} disabled={paymentLoading} className="h-9 px-4 bg-emerald-600 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50" title="Make Payment">
                                      <FiDollarSign size={14} /> Pay
                                    </button>
                                  )}
                                  <button onClick={() => openEdit(item)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:text-tf-primary hover:bg-slate-100 transition-colors">
                                    <FiEdit2 size={14} />
                                  </button>
                                  <button onClick={() => handleDelete(item._id)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:text-rose-500 hover:bg-rose-50 transition-colors">
                                    <FiTrash2 size={14} />
                                  </button>
                                </>
                              )}
                              {user?.role === 'ngo-admin' && item.status === 'pending' && (
                                <button onClick={() => handleMarkExecuting(item)} className="w-9 h-9 flex items-center justify-center bg-tf-primary/10 text-tf-primary rounded-lg hover:bg-tf-primary/20 transition-colors" title="Move to Executing">
                                  <FiActivity size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )) : (
            <div className="px-10 py-32 text-center italic">
              <div className="max-w-xs mx-auto space-y-4 italic">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto shadow-inner italic">
                  <FiTarget size={40} />
                </div>
                <div className="space-y-1 italic">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight italic">{t('milestones.empty_title')}</h4>
                  <p className="text-xs text-slate-400 font-medium italic">{t('milestones.empty_desc')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Operation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl italic">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/20 italic"
            >
              <div className="p-10 bg-slate-900 text-white relative italic">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/20 blur-3xl rounded-full -mr-16 -mt-16 italic" />
                 <div className="relative z-10 flex items-center justify-between italic">
                    <div className="flex items-center gap-4 italic">
                        <div className="w-12 h-12 bg-tf-primary rounded-2xl flex items-center justify-center shadow-lg shadow-tf-primary/20 italic">
                            <FiActivity size={24} />
                        </div>
                        <div className="italic">
                            <h3 className="text-2xl font-black italic tracking-tighter leading-none mb-1 italic">{t('milestones.modal.title')}</h3>
                            <p className="text-[10px] uppercase font-black tracking-widest text-white/40 italic">Authorization Protocol Hub</p>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all italic">
                        <FiX size={20} />
                    </button>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8 italic">
                {formError && (
                  <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold animate-shake italic">
                    <FiAlertTriangle className="text-lg shrink-0 not-italic" /> {formError}
                  </div>
                )}

                <div className="space-y-6 italic">
                    <div className="space-y-2 italic">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                            <FiTarget className="text-tf-primary not-italic" /> {t('milestones.modal.label_title')}
                        </label>
                        <input 
                            required type="text" value={form.title} placeholder="e.g. Community Support Initialization"
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-tf-primary/5 focus:border-tf-primary transition-all outline-none italic"
                        />
                    </div>

                    <div className="space-y-2 italic">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                            <FiFileText className="text-tf-primary not-italic" /> {t('milestones.modal.label_desc')}
                        </label>
                        <textarea 
                            required value={form.description} rows={3} placeholder="Detailed notes about the project objectives and activities."
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-tf-primary/5 focus:border-tf-primary transition-all outline-none resize-none italic"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6 italic">
                        <div className="space-y-2 italic">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                <FiClock className="text-tf-primary not-italic" /> {t('milestones.modal.label_date')}
                            </label>
                            <input 
                                required type="date" value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-tf-primary/20 focus:border-tf-primary transition-all outline-none italic"
                            />
                        </div>
                        <div className="space-y-2 italic">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                <FiActivity className="text-tf-primary not-italic" /> Budget (LKR)
                            </label>
                            <input 
                                type="number" value={form.budget} placeholder="Allocation Amount"
                                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-tf-primary/20 focus:border-tf-primary transition-all outline-none italic"
                            />
                        </div>
                        <div className="space-y-2 italic">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                <FiActivity className="text-tf-primary not-italic" /> {t('milestones.modal.label_status')}
                            </label>
                            <select 
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-tf-primary/20 focus:border-tf-primary transition-all outline-none italic appearance-none"
                            >
                                {MILESTONE_STATUSES.map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full py-5 bg-tf-primary hover:bg-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-tf-primary/20 active:scale-95 flex items-center justify-center gap-3 italic"
                >
                    <FiCheckCircle className="text-lg not-italic" /> {t('milestones.modal.submit')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
