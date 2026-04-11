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
    agreements,
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
  const activeMission = currentAgreement;

  useEffect(() => {
    if (cleanId) {
      fetchAgreementById(cleanId).catch(() => { });
      fetchMilestones({ agreementId: cleanId }).catch(() => { });
    } else {
      fetchMilestones({}).catch(() => { });
      if (user?.role === 'partner') fetchMyPartnerAgreements();
      else fetchAllAgreements();
    }
  }, [cleanId, fetchAgreementById, fetchMilestones, fetchMyPartnerAgreements, fetchAllAgreements, user?.role]);

  const badgeConfig = {
    pending: { label: t('milestones.filter_pending'), classes: 'bg-slate-100 text-slate-500 border-slate-200', icon: <FiClock className="text-xl text-slate-400" /> },
    'in-progress': { label: t('milestones.filter_executing'), classes: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20', icon: <FiActivity className="text-xl text-tf-primary" /> },
    completed: { label: t('milestones.filter_completed'), classes: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: <FiCheckCircle className="text-xl text-emerald-500" /> },
  };

  const allMilestones = useMemo(() => {
    let source = Array.isArray(milestones) ? milestones.map(m => ({ ...m, isEmbedded: false })) : [];

    if (cleanId) {
      source = source.filter(m => {
        const mId = (m.agreementId?._id || m.agreementId)?.toString();
        return mId === cleanId.toString();
      });

      if (currentAgreement) {
        const embedded = (currentAgreement.initialMilestones ||
          currentAgreement.milestones ||
          currentAgreement.initial_milestones ||
          []).map(ms => ({ ...ms, agreementId: currentAgreement, isEmbedded: true }));
        const newEmbedded = embedded.filter(em => !em._id || !source.find(s => s._id === em._id));
        source = [...source, ...newEmbedded];
      }
    } else {
      if (Array.isArray(agreements)) {
        agreements.forEach(agreement => {
          const embedded = (agreement.initialMilestones || agreement.milestones || agreement.initial_milestones || [])
            .map(ms => ({ ...ms, agreementId: agreement, isEmbedded: true }));

          const newEmbedded = embedded.filter(em => !em._id || !source.find(s => s._id === em._id));
          source = [...source, ...newEmbedded];
        });
      }
    }
    return source;
  }, [milestones, currentAgreement, agreements, cleanId]);

  const visibleMilestones = useMemo(() => {
    let filtered = [...allMilestones];
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => (item.status || 'pending') === statusFilter);
    }
    return filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [allMilestones, statusFilter]);

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
    if (!allMilestones.length) return 0;
    const completedCount = allMilestones.filter((item) => item.status === 'completed').length;
    return Math.round((completedCount / allMilestones.length) * 100);
  }, [allMilestones]);

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
        if (editing.isEmbedded && editing.agreementId) {
          const agreement = editing.agreementId;
          const updatedInitialMilestones = (agreement.initialMilestones || []).map(m =>
            m._id === editing._id ? { ...m, ...payload } : m
          );
          await updateAgreement(agreement._id, {
            campaignId: agreement.campaignId?._id || agreement.campaignId,
            initialMilestones: updatedInitialMilestones
          });
          if (id && agreement._id === id.replace(/,+$/, '')) fetchAgreementById(id.replace(/,+$/, '')).catch(() => { });
          else if (user?.role === 'partner') fetchMyPartnerAgreements();
          setSuccess('Institutional protocol updated via agreement node.');
        } else {
          await updateMilestone(editing._id, payload);
          setSuccess('Milestone protocol updated successfully.');
        }
      } else {
        const agreementId = cleanId || id;
        const campaignId =
          activeMission?.campaignId?._id ||
          activeMission?.campaignId ||
          currentAgreement?.campaignId?._id ||
          currentAgreement?.campaignId;

        if (!agreementId || !campaignId) {
          throw new Error('Missing agreement or campaign linkage for milestone creation.');
        }

        await createMilestone({ ...payload, agreementId, campaignId });
        setSuccess('New mission milestone authorized and deployed.');
      }
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const backendMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message;
      setFormError(backendMessage || err.message || 'Failed to authorize milestone operation.');
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
        if (milestone.isEmbedded && milestone.agreementId) {
          // Update embedded milestone
          const agreement = milestone.agreementId;
          const updatedInitialMilestones = (agreement.initialMilestones || []).map(m =>
            m._id === milestone._id ? { ...m, evidence: { url: data.url, uploadedAt: new Date() } } : m
          );
          await updateAgreement(agreement._id, {
            campaignId: agreement.campaignId?._id || agreement.campaignId,
            initialMilestones: updatedInitialMilestones
          });
          if (id && agreement._id === id.replace(/,+$/, '')) fetchAgreementById(id.replace(/,+$/, '')).catch(() => { });
          else if (user?.role === 'partner') fetchMyPartnerAgreements();
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

  const handleDelete = async (milestone) => {
    if (milestone.isEmbedded) {
      return setError('Institutional protocol nodes cannot be terminated. They are core mission requirements.');
    }
    if (!window.confirm('Are you sure you want to terminate this node?')) return;
    try {
      await deleteMilestone(milestone._id);
      setSuccess('Node terminated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to terminate node.');
    }
  };

  const handleMarkExecuting = async (milestone) => {
    if (!window.confirm('Mark this node as ready for execution?')) return;
    try {
      if (milestone.isEmbedded && milestone.agreementId) {
        // It's an embedded milestone!
        const agreement = milestone.agreementId;
        const updatedInitialMilestones = (agreement.initialMilestones || []).map(m =>
          m._id === milestone._id ? { ...m, status: 'in-progress' } : m
        );
        await updateAgreement(agreement._id, {
          campaignId: agreement.campaignId?._id || agreement.campaignId,
          initialMilestones: updatedInitialMilestones
        });
        if (id && agreement._id === id.replace(/,+$/, '')) fetchAgreementById(id.replace(/,+$/, '')).catch(() => { });
        else if (user?.role === 'partner') fetchMyPartnerAgreements();
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
        frequency: null,
        notes: JSON.stringify({ milestoneId: milestone._id, isEmbedded: milestone.isEmbedded, agreementId: milestone.agreementId?._id || milestone.agreementId })
      };

      const { data } = await api.post('/api/finance/payhere/init', payload);
      if (data.success && data.paymentData) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.checkoutUrl || 'https://sandbox.payhere.lk/pay/checkout';
        Object.keys(data.paymentData).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data.paymentData[key];
          form.appendChild(input);
        });
        document.body.appendChild(form);
        // Store milestone context so the success page can update status
        sessionStorage.setItem('pendingMilestoneUpdate', JSON.stringify({
          milestoneId: milestone._id,
          isEmbedded: milestone.isEmbedded,
          agreementId: milestone.agreementId?._id || milestone.agreementId
        }));
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
              <button
                onClick={() => navigate('/partner/agreements')}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-95 group/back"
                title="Return to Agreements"
              >
                <FiArrowLeft className="group-hover/back:-translate-x-1 transition-transform" />
              </button>
              <span className="flex items-center gap-2 px-3 py-1 bg-tf-primary/10 border border-tf-primary/20 rounded-full text-tf-primary text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-sm ">
                <FiTarget className="text-sm" /> {t('milestones.header_badge')}
              </span>
              <span className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.5em] ">MISSION HUB</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter  leading-none">
              {t('milestones.institutional')} <span className="text-tf-primary not-">{t('milestones.roadmap')}</span>
            </h1>
            <p className="text-white/50 text-base md:text-lg font-medium  max-w-2xl leading-relaxed">
              {id ? t('milestones.subtitle') : t('milestones.global_hub_desc')}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col ">
                <span className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest ">{t('milestones.progress')}</span>
                <span className="text-xl font-extrabold text-white tabular-nums tracking-tighter ">{progress}%</span>
              </div>
              {id && (
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col ">
                  <span className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest ">{t('milestones.total_volume')}</span>
                  <span className="text-xl font-extrabold text-tf-primary tabular-nums tracking-tighter ">LKR {Number(activeMission?.amount || activeMission?.totalValue || 0).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {id && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] lg:w-80 space-y-6 ">
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest mb-1 ">{t('milestones.partner_node')}</p>
                  <p className="text-sm font-bold text-white leading-tight ">{activeMission?.partnerId?.organizationName || 'Verified Strategic Entity'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest mb-1 ">{t('milestones.mission_node')}</p>
                  <p className="text-sm font-bold text-white leading-tight ">{activeMission?.campaignId?.title || 'Operational Impact Node'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {success && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4 text-emerald-700 font-bold  shadow-sm mx-4">
          <FiCheckSquare className="text-xl" />
          {success}
        </motion.div>
      )}

      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden text-left ">
        {/* Navigation & Controls */}
        <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30 ">
          <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto selection:bg-tf-primary/10 ">
            {['all', 'pending', 'in-progress', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all whitespace-nowrap  ${statusFilter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                  }`}
              >
                {f === 'all' ? t('milestones.filter_all') : f === 'pending' ? t('milestones.filter_pending') : f === 'in-progress' ? t('milestones.filter_executing') : t('milestones.filter_completed')}
              </button>
            ))}
          </div>

          {!isAdminLike && user?.role === 'partner' && id && (
            <button
              onClick={openCreate}
              className="px-8 py-3.5 bg-tf-primary text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-tf-primary/20 active:scale-95 flex items-center gap-3 "
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
                      <div className="px-3 py-1 bg-tf-primary/10 border border-tf-primary/20 rounded-full text-tf-primary text-[8px] font-extrabold uppercase tracking-widest ">
                        {group.campaign?.title || 'Mission Node'}
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold text-white  tracking-tight uppercase leading-none">
                      {group.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-8 mt-4 md:mt-0">
                    <div className="text-right">
                      <p className="text-[9px] font-extrabold text-white/20 uppercase tracking-widest  mb-1">Success Nodes</p>
                      <p className="text-sm font-extrabold text-tf-primary  tabular-nums">{group.milestones.length} Active Steps</p>
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
                                  <button onClick={() => handleDelete(item)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:text-rose-500 hover:bg-rose-50 transition-colors">
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
            <div className="px-10 py-32 text-center ">
              <div className="max-w-xs mx-auto space-y-4 ">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto shadow-inner ">
                  <FiTarget size={40} />
                </div>
                <div className="space-y-1 ">
                  <h4 className="text-lg font-extrabold text-slate-900 tracking-tight ">{t('milestones.empty_title')}</h4>
                  <p className="text-xs text-slate-400 font-medium ">{t('milestones.empty_desc')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Operation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl ">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/20 "
            >
              <div className="p-10 bg-slate-900 text-white relative ">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/20 blur-3xl rounded-full -mr-16 -mt-16 " />
                <div className="relative z-10 flex items-center justify-between ">
                  <div className="flex items-center gap-4 ">
                    <div className="w-12 h-12 bg-tf-primary rounded-2xl flex items-center justify-center shadow-lg shadow-tf-primary/20 ">
                      <FiActivity size={24} />
                    </div>
                    <div className="">
                      <h3 className="text-2xl font-extrabold  tracking-tighter leading-none mb-1 ">{t('milestones.modal.title')}</h3>
                      <p className="text-[10px] uppercase font-extrabold tracking-widest text-white/40 ">Authorization Protocol Hub</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all ">
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8 ">
                {formError && (
                  <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold animate-shake ">
                    <FiAlertTriangle className="text-lg shrink-0 not-" /> {formError}
                  </div>
                )}

                <div className="space-y-6 ">
                  <div className="space-y-2 ">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  flex items-center gap-2">
                      <FiTarget className="text-tf-primary not-" /> {t('milestones.modal.label_title')}
                    </label>
                    <input
                      required type="text" value={form.title} placeholder="e.g. Community Support Initialization"
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-tf-primary/5 focus:border-tf-primary transition-all outline-none "
                    />
                  </div>

                  <div className="space-y-2 ">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  flex items-center gap-2">
                      <FiFileText className="text-tf-primary not-" /> {t('milestones.modal.label_desc')}
                    </label>
                    <textarea
                      required value={form.description} rows={3} placeholder="Detailed notes about the project objectives and activities."
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-tf-primary/5 focus:border-tf-primary transition-all outline-none resize-none "
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6 ">
                    <div className="space-y-2 ">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  flex items-center gap-2">
                        <FiClock className="text-tf-primary not-" /> {t('milestones.modal.label_date')}
                      </label>
                      <input
                        required type="date" value={form.dueDate}
                        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-tf-primary/20 focus:border-tf-primary transition-all outline-none "
                      />
                    </div>
                    <div className="space-y-2 ">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  flex items-center gap-2">
                        <FiActivity className="text-tf-primary not-" /> Budget (LKR)
                      </label>
                      <input
                        type="number" value={form.budget} placeholder="Allocation Amount"
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-tf-primary/20 focus:border-tf-primary transition-all outline-none "
                      />
                    </div>
                    <div className="space-y-2 ">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  flex items-center gap-2">
                        <FiActivity className="text-tf-primary not-" /> {t('milestones.modal.label_status')}
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-tf-primary/20 focus:border-tf-primary transition-all outline-none  appearance-none"
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
                  className="w-full py-5 bg-tf-primary hover:bg-orange-600 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-xl shadow-tf-primary/20 active:scale-95 flex items-center justify-center gap-3 "
                >
                  <FiCheckCircle className="text-lg not-" /> {t('milestones.modal.submit')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
