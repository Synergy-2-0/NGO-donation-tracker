import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartnerOperations } from '../context/PartnerOperationsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { FiCheckCircle, FiClock, FiActivity, FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiFileText, FiX, FiAlertTriangle, FiArrowRight, FiCheck, FiLink } from 'react-icons/fi';
import { LuScale3D } from "react-icons/lu";

const MILESTONE_STATUSES = ['pending', 'in-progress', 'completed'];

const badgeConfig = {
  pending: { label: 'Pending Start', classes: 'bg-slate-100 text-slate-500 border-slate-200', icon: <FiClock className="text-xl text-slate-400" /> },
  'in-progress': { label: 'In Execution', classes: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20', icon: <FiActivity className="text-xl text-brand-orange" /> },
  completed: { label: 'Milestone Met', classes: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: <FiCheckCircle className="text-xl text-emerald-500" /> },
};

function asDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const emptyMilestone = {
  title: '',
  description: '',
  dueDate: '',
  status: 'pending',
  evidenceUrl: '',
};

export default function AgreementMilestonesPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    currentAgreement,
    milestones,
    loading,
    error,
    setError,
    fetchAgreementById,
    fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    uploadMilestoneEvidence,
  } = usePartnerOperations();

  const isAdminLike = user?.role === 'admin' || user?.role === 'ngo-admin';

  const [statusFilter, setStatusFilter] = useState('all');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMilestone);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAgreementById(id).catch(() => {});
    fetchMilestones({ agreementId: id }).catch(() => {});
  }, [id, fetchAgreementById, fetchMilestones]);

  const visibleMilestones = useMemo(() => {
    let filtered = milestones;
    if (statusFilter !== 'all') {
        filtered = filtered.filter((item) => item.status === statusFilter);
    }
    // Sort by due date (ascending)
    return [...filtered].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [milestones, statusFilter]);

  const progress = useMemo(() => {
    if (!milestones.length) return 0;
    const completedCount = milestones.filter((item) => item.status === 'completed').length;
    return Math.round((completedCount / milestones.length) * 100);
  }, [milestones]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyMilestone);
    setFormError('');
    setSuccess('');
    setShowModal(true);
  };

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
    setSuccess('');
    setShowModal(true);
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Milestone metric or title is required.';
    if (!form.dueDate) return 'Execution target date is required.';
    if (form.evidenceUrl && !/^https?:\/\//i.test(form.evidenceUrl)) return 'Proof of Execution URL must start with http:// or https://';
    return '';
  };

  const [evidenceFile, setEvidenceFile] = useState(null);

  const onSave = async (event) => {
    event.preventDefault();
    const validation = validateForm();
    if (validation) {
      setFormError(validation);
      return;
    }

    if (!currentAgreement?._id || !currentAgreement?.campaignId) {
      setFormError('Agreement context is missing core system linkage.');
      return;
    }

    let finalEvidenceUrl = form.evidenceUrl;

    try {
      if (evidenceFile) {
        setUploading(true);
        const { url } = await uploadMilestoneEvidence(evidenceFile);
        finalEvidenceUrl = url;
        setUploading(false);
      }

      const payload = {
        agreementId: currentAgreement._id,
        campaignId: currentAgreement.campaignId?._id || currentAgreement.campaignId || "",
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate,
        status: form.status,
      };

      if (finalEvidenceUrl.trim()) {
        payload.evidence = { url: finalEvidenceUrl.trim() };
      }

      if (editing) {
        await updateMilestone(editing._id, payload);
        setSuccess('Milestone ledger updated.');
      } else {
        await createMilestone(payload);
        setSuccess('New execution milestone appended.');
      }
      setFormError('');
      setEvidenceFile(null);
      setShowModal(false);
      setError('');
      await fetchMilestones({ agreementId: id });
    } catch (err) {
      setUploading(false);
      setSuccess('');
      setFormError(err.response?.data?.message || 'Transaction failed. Could not sync milestone.');
    }
  };

  const onDelete = async (milestoneId) => {
    const confirmed = window.confirm('Drop this tracking milestone? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteMilestone(milestoneId);
      setSuccess('Milestone successfully purged.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to purge milestone.');
    }
  };

  const onStatusChangeQuick = async (id, newStatus) => {
      try {
          await updateMilestone(id, { status: newStatus });
          setSuccess('Execution phase updated.');
          setError('');
          await fetchMilestones({ agreementId: currentAgreement._id });
      } catch (err) {
          setSuccess('');
          setError(err.response?.data?.message || 'Failed to update phase.');
      }
  };

  if (loading && !currentAgreement) return <LoadingSpinner message="Opening agreement details..." />;
  if (!currentAgreement && !loading) return (
     <div className="p-20 text-center space-y-4">
        <FiAlertTriangle className="text-4xl text-amber-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">Agreement Not Found</h3>
        <Link to="/partner/agreements" className="text-brand-red font-black uppercase text-[10px] tracking-widest">Return to List</Link>
     </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-fadeIn relative text-left">
      <Link to="/partner/agreements" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-colors mb-2">
         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
         Back to Ledger
      </Link>

      {currentAgreement && (
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-8 items-center justify-between transition-all hover:shadow-2xl hover:shadow-slate-200/60">
            <div className="w-full md:w-1/2 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                     <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl shadow-md"><FiFileText /></span>
                     <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Ledger Details</span>
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2 pr-4">{currentAgreement.title}</h1>
                <p className="text-sm font-semibold text-slate-500 capitalize">{currentAgreement.agreementType?.replace('-', ' ') || 'Partnership'} support</p>
            </div>

            <div className="w-full md:w-1/2 relative z-10 flex flex-col gap-3">
                <div className="flex items-end justify-between mb-1">
                     <span className="text-sm font-black text-slate-800">Execution Matrix</span>
                     <span className="text-2xl font-black text-brand-red tracking-tighter">{progress}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-brand-orange to-brand-red rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                    {milestones.filter((item) => item.status === 'completed').length} of {milestones.length} Metrics Hit
                </p>
            </div>
        </div>
      )}

      {(error || success) && (
         <div className="px-2">
           {error && (
             <div className="flex items-center gap-3 bg-red-50/50 border border-brand-red/20 text-brand-red px-5 py-4 rounded-2xl animate-fadeIn mb-3">
                <FiAlertTriangle className="text-xl shrink-0" />
                <p className="text-sm font-medium">{error}</p>
                <button onClick={() => setError('')} className="ml-auto text-brand-red/60 hover:text-brand-red p-1"><FiX className="text-lg" /></button>
             </div>
           )}
           {success && (
             <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-200/50 text-emerald-700 px-5 py-4 rounded-2xl animate-fadeIn mb-3">
                <FiCheckCircle className="text-xl shrink-0" />
                <p className="text-sm font-medium">{success}</p>
                <button onClick={() => setSuccess('')} className="ml-auto text-emerald-700/60 hover:text-emerald-700 p-1"><FiX className="text-lg" /></button>
             </div>
           )}
         </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg">Filter Timeline:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Phases</option>
                <option value="pending">Pending Start</option>
                <option value="in-progress">In Execution</option>
                <option value="completed">Completed Metrics</option>
              </select>
          </div>
          
          {(isAdminLike || user?.role === 'partner') && (
            <button
              onClick={openCreate}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-red shadow-lg transition-all flex items-center gap-2 w-full md:w-auto justify-center active:scale-95"
            >
              + Append Metric
            </button>
          )}
      </div>

      {visibleMilestones.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Tracking Metrics Found</h3>
            <p className="text-slate-500 text-sm max-w-sm font-medium">Use the tracking matrix to hold partners accountable to execution promises over time.</p>
        </div>
      ) : (
        <div className="relative">
             {/* Timeline Line */}
             <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-200 hidden md:block"></div>
             
             <div className="space-y-6 md:space-y-8">
                {visibleMilestones.map((item, idx) => {
                    const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'completed';
                    const config = badgeConfig[item.status];
                    const isPartnerOwner = user?.role === 'partner';

                    return (
                        <div key={item._id} className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-8 group">
                             {/* Timeline Node */}
                             <div className={`hidden md:flex w-20 shrink-0 flex-col items-center relative z-10 pt-4`}>
                                 <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center text-sm shadow-sm transition-all duration-300 ${item.status === 'completed' ? 'border-emerald-200 bg-emerald-100' : isOverdue ? 'border-red-200 bg-red-100' : 'border-white bg-white shadow-md'}`}>
                                     {config.icon}
                                 </div>
                             </div>

                             {/* Content Card */}
                             <div className={`flex-1 bg-white rounded-[24px] border transition-all duration-300 relative overflow-hidden flex flex-col ${isOverdue ? 'border-red-200 shadow-[0_4px_20px_rgba(220,38,38,0.05)]' : 'border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1'}`}>
                                 {isOverdue && (
                                     <div className="w-full h-1 bg-brand-red/80 absolute top-0 left-0"></div>
                                 )}
                                 
                                 <div className="p-6 sm:p-8 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                         <div className="pr-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded border ${config.classes}`}>
                                                    {config.label}
                                                </span>
                                                {isOverdue && <span className="text-[10px] font-black text-brand-red uppercase tracking-widest flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Overdue</span>}
                                            </div>
                                            <h3 className={`text-xl font-extrabold tracking-tight leading-tight transition-colors ${item.status === 'completed' ? 'text-slate-400 line-through decoration-slate-200' : 'text-slate-900 group-hover:text-brand-red'}`}>{item.title}</h3>
                                         </div>
                                         <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-right shrink-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Target execution</p>
                                            <p className="text-sm font-black text-slate-800 tracking-tighter">{asDate(item.dueDate)}</p>
                                         </div>
                                    </div>
                                    <p className={`text-sm leading-relaxed font-medium ${item.status === 'completed' ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {item.description || 'No execution brief provided.'}
                                    </p>

                                    {item.evidence?.url && (
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            <a href={item.evidence.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-brand-red shadow-lg shadow-slate-900/10 active:scale-95">
                                               <FiFileText className="text-base" />
                                               View Proof of Execution
                                            </a>
                                            <div className="px-4 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-100">
                                                <FiLink /> Verified Evidence Attached
                                            </div>
                                        </div>
                                    )}
                                 </div>
                                 <div className="bg-slate-50 p-4 sm:px-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                                      {(isAdminLike || isPartnerOwner) ? (
                                           <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => onStatusChangeQuick(item._id, e.target.value)}
                                                    className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl px-3 py-2 w-full sm:w-auto outline-none cursor-pointer focus:border-brand-red transition-all shadow-sm"
                                                >
                                                    <option value="pending">Set Pending</option>
                                                    <option value="in-progress">Set Execution</option>
                                                    <option value="completed">Set Complete</option>
                                                </select>
                                           </div>
                                      ) : (
                                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">Review-Only Mode</div>
                                      )}

                                      {(isAdminLike || isPartnerOwner) && (
                                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                              <button onClick={() => openEdit(item)} className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto text-center shadow-sm active:scale-95">
                                                  Edit Metric
                                              </button>
                                              {isAdminLike && (
                                                <button onClick={() => onDelete(item._id)} className="px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto text-center shadow-sm active:scale-95">
                                                    Purge
                                                </button>
                                              )}
                                          </div>
                                      )}
                                 </div>
                             </div>
                        </div>
                    );
                })}
             </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 overflow-hidden text-left">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity" onClick={() => setShowModal(false)}></div>
          
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-slideUp mt-10 border border-slate-100">
            <div className="px-8 pt-8 pb-6 flex items-center justify-between shrink-0 bg-gradient-to-b from-slate-50 to-white">
              <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editing ? 'Optimize Execution Metric' : 'Design Functional Metric'}</h3>
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
                    Blockchain-Verified Milestone Ledger
                  </p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-90">
                  <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={onSave} className="flex-1 overflow-y-auto px-10 py-4 space-y-8 scrollbar-elegant">
              {formError && (
                  <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 text-sm font-bold shadow-sm animate-shake">
                      <FiAlertTriangle className="text-xl shrink-0 mt-0.5" />
                      <span>{formError}</span>
                  </div>
              )}

              <div className="space-y-6">
                  <div className="group">
                    <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2.5 transition-colors group-focus-within:text-brand-red">Metric Specification (Title)</label>
                    <input required value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-base font-bold text-slate-900 focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none transition-all placeholder:font-medium placeholder:text-slate-300" placeholder="e.g., Clinical Equipment Logistics" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2.5">Execution Brief (Operational Details)</label>
                    <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none transition-all min-h-[120px] resize-none placeholder:text-slate-300" placeholder="Describe the tactical implementation steps and success criteria for this milestone..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2.5">Target Completion</label>
                      <input required type="date" value={form.dueDate} onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none transition-all" />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2.5">Lifecycle Stage</label>
                      <select value={form.status} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none transition-all cursor-pointer">
                        <option value="pending">Pending Execution</option>
                        <option value="in-progress">In-Field Execution</option>
                        <option value="completed">Metric Successful</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-8 bg-brand-red/[0.02] border-2 border-dashed border-slate-100 rounded-[32px] space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2.5">Digital Proof of Execution (PoE)</label>
                      
                      <div className="flex flex-col gap-4">
                        <label className="flex flex-col items-center justify-center w-full px-6 py-10 bg-white border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 hover:border-brand-red transition-all group relative overflow-hidden">
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => setEvidenceFile(e.target.files[0])}
                            />
                            {uploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Uploading Evidence...</p>
                                </div>
                            ) : evidenceFile ? (
                                <div className="flex flex-col items-center gap-2 text-emerald-600">
                                    <FiCheckCircle className="text-4xl" />
                                    <p className="text-xs font-black uppercase tracking-widest">{evidenceFile.name}</p>
                                    <span className="text-[10px] font-bold text-slate-400">(Ready to Sync)</span>
                                </div>
                            ) : (
                                <>
                                    <FiFileText className="text-4xl text-slate-300 mb-3 group-hover:text-brand-red transition-colors" />
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 text-center">Drag and drop file <br/><span className="text-brand-red mt-1 block">or click to browse</span></p>
                                    <p className="text-[9px] font-bold text-slate-300 mt-4 uppercase tracking-widest text-center">Supports PDF, JPG, PNG (Max 5MB)</p>
                                </>
                            )}
                        </label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <FiLink className="text-slate-400" />
                            </div>
                            <input 
                              value={form.evidenceUrl} 
                              onChange={(e) => setForm(prev => ({ ...prev, evidenceUrl: e.target.value }))} 
                              className="w-full bg-white border border-slate-100 rounded-2xl pl-11 pr-5 py-4 text-xs font-mono text-slate-500 focus:border-slate-300 outline-none transition-all placeholder:font-sans" 
                              placeholder="Or provide direct external link (Google Drive, S3, etc.)" 
                            />
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </form>

            <div className="px-10 py-8 border-t border-slate-100 flex items-center justify-end gap-5 shrink-0 bg-white">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-xs font-black tracking-[0.2em] uppercase text-slate-400 hover:text-slate-900 transition-colors">
                  Discard
                </button>
                <button type="button" onClick={onSave} disabled={loading || uploading} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-red shadow-2xl shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  <FiCheck className="text-lg" />
                  {loading || uploading ? 'Syncing...' : editing ? 'Update Matrix' : 'Record Milestone'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
