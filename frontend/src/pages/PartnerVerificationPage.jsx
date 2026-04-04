import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import { 
    FiCheckCircle, 
    FiMap, 
    FiAlertTriangle, 
    FiX, 
    FiFileText, 
    FiBriefcase, 
    FiArrowRight, 
    FiShield 
} from 'react-icons/fi';

export default function PartnerVerificationPage() {
  const { user } = useAuth();
  const { partners, loading, error, setError, fetchPartners, approvePartner } = usePartner();
  const [success, setSuccess] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [hasReviewedDocs, setHasReviewedDocs] = useState(false);
  
  const canApprove = user?.role === 'admin' || user?.role === 'ngo-admin';

  useEffect(() => {
    fetchPartners().catch(() => { });
  }, [fetchPartners]);

  const pendingPartners = useMemo(
    () => partners.filter((partner) => partner.verificationStatus === 'pending'),
    [partners]
  );

  const onApprove = async (id) => {
    try {
      setApprovingId(id);
      await approvePartner(id);
      setSuccess('Partner vetted and approved successfully.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to approve partner.');
    } finally {
      setApprovingId(null);
    }
  };

  const onReject = async (id) => {
    try {
      setRejectingId(id);
      await api.put(`/api/partners/${id}`, { verificationStatus: 'rejected' });
      fetchPartners();
      setSuccess('Partner application rejected.');
      setError('');
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to reject partner.');
    } finally {
      setRejectingId(null);
      setSelectedPartner(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* Header section with styling */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Partner Pipeline queue</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Review and verify institutional partners. Uphold network integrity by analyzing compliance documents and alignment with SDG goals before granting funding platform access.
            </p>
          </div>
          <Link to="/partners" className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl backdrop-blur-md border border-white/10 transition-all">
            <span>Network Directory</span>
            <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Alerts */}
      <div className="px-2">
         {(error || success) && (
           <div className="space-y-3 mb-6">
             {error && (
               <div className="flex items-center gap-3 bg-red-50/50 border border-brand-red/20 text-brand-red px-5 py-4 rounded-2xl animate-fadeIn">
                  <FiAlertTriangle className="text-xl shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                  <button onClick={() => setError('')} className="ml-auto text-brand-red/60 hover:text-brand-red p-1"><FiX className="text-xl" /></button>
               </div>
             )}
             {success && (
               <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-200/50 text-emerald-700 px-5 py-4 rounded-2xl animate-fadeIn">
                  <FiCheckCircle className="text-xl shrink-0" />
                  <p className="text-sm font-medium">{success}</p>
                  <button onClick={() => setSuccess('')} className="ml-auto text-emerald-700/60 hover:text-emerald-700 p-1"><FiX className="text-xl" /></button>
               </div>
             )}
           </div>
         )}

        {/* Content Area */}
        {loading && partners.length === 0 ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner message="Fetching pending pipeline..." />
          </div>
        ) : pendingPartners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[32px] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <FiBriefcase className="text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Queue Empty</h3>
            <p className="text-slate-500 text-sm max-w-sm">There are currently no partner verification requests waiting for review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {pendingPartners.map((partner) => (
              <div key={partner._id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative">
                
                {/* Status Indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                  </span>
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">Pending Review</span>
                </div>

                <div className="p-8 flex-1">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl border border-slate-100 bg-slate-50 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                      {partner.logoUrl ? (
                         <img src={partner.logoUrl} alt={partner.organizationName} className="w-full h-full object-cover" />
                      ) : (
                         <FiBriefcase className="text-2xl text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">{partner.organizationName}</h3>
                      <p className="text-slate-500 text-sm capitalize font-medium">{partner.organizationType} • {partner.industry}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Rep</span>
                      <p className="text-sm font-semibold text-slate-700">{partner.contactPerson?.name || '—'}</p>
                      <p className="text-xs text-slate-500 truncate">{partner.contactPerson?.email || '—'}</p>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Submission Date</span>
                      <p className="text-sm font-semibold text-slate-700">{new Date(partner.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="col-span-2">
                       <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Focus Areas</span>
                       <div className="flex flex-wrap gap-2">
                         {partner.csrFocus?.slice(0, 3).map(focus => (
                           <span key={focus} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase rounded-md border border-slate-100">
                             {focus.replace('_', ' ')}
                           </span>
                         ))}
                         {partner.csrFocus?.length > 3 && (
                           <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-md">
                             +{partner.csrFocus.length - 3}
                           </span>
                         )}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                   <div className="flex items-center gap-2">
                      <FiFileText className="text-lg text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500">{partner.verificationDocuments?.length || 0} Docs Attached</span>
                   </div>

                   <button 
                       onClick={() => {
                           setSelectedPartner(partner);
                           setHasReviewedDocs(false);
                       }} 
                       className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-red transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                   >
                     Review Application <FiArrowRight className="text-lg" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Review Modal */}
      {selectedPartner && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 overflow-hidden">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedPartner(null)}></div>
             
             <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn mt-10">
                 {/* Sidebar Preview */}
                 <div className="w-full md:w-5/12 bg-slate-50 border-r border-slate-100 p-8 flex flex-col overflow-y-auto">
                     <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-6">Compliance Documents</h3>
                     
                     {selectedPartner.verificationDocuments?.length > 0 ? (
                         <div className="flex-1 flex flex-col gap-4">
                             {selectedPartner.verificationDocuments.map((doc, idx) => {
                                 const isDocx = doc.url.toLowerCase().match(/\.(doc|docx)$/) || doc.url.toLowerCase().includes('.vnd.openxmlformats-officedocument');
                                 const previewUrl = isDocx ? `https://docs.google.com/gview?url=${encodeURIComponent(doc.url)}&embedded=true` : doc.url;
                                 return (
                                     <a 
                                         key={idx} 
                                         href={previewUrl} 
                                         target="_blank" 
                                         rel="noreferrer" 
                                         onClick={() => setHasReviewedDocs(true)}
                                         className="group block p-4 bg-white border-2 border-slate-200 border-dashed rounded-2xl hover:border-brand-red hover:bg-red-50/10 transition-colors cursor-pointer"
                                     >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                                                <FiFileText className="text-xl" />
                                            </div>
                                            <div>
                                               <span className="block text-sm font-bold text-slate-800 capitalize">{doc.documentType || 'Official Record'}</span>
                                               <span className="text-[10px] uppercase font-bold text-brand-red tracking-widest flex items-center gap-1">{isDocx ? 'Preview Document' : 'Click to Preview'}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-2 break-all">{doc.url}</p>
                                     </a>
                                 );
                             })}
                             
                             <div className="mt-auto pt-6">
                                <p className="text-xs text-slate-500 font-medium leading-relaxed bg-brand-orange/10 p-4 border border-brand-orange/20 rounded-xl text-brand-orange flex flex-col gap-1">
                                    <strong className="block font-bold text-brand-orange flex items-center gap-1"><FiAlertTriangle /> Verification Policy</strong>
                                    You must preview and verify the authenticity of all attached documents before approving this entity into the network directory.
                                </p>
                             </div>
                         </div>
                     ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-red-200 bg-red-50/30 rounded-2xl">
                             <FiAlertTriangle className="text-4xl text-brand-red mb-3" />
                             <h4 className="text-sm font-bold text-slate-800 mb-1">No Documents</h4>
                             <p className="text-xs text-slate-500">This entity has bypassed the document upload requirement. Extreme diligence recommended.</p>
                             <button onClick={() => setHasReviewedDocs(true)} className="mt-4 px-4 py-2 border border-slate-300 gap-1 flex items-center justify-center rounded text-xs font-bold bg-white hover:bg-slate-50"><FiShield /> Override Policy</button>
                         </div>
                     )}
                 </div>

                 {/* Details & Action */}
                 <div className="flex-1 flex flex-col overflow-y-auto">
                     <div className="p-8 flex-1">
                        <div className="flex items-center gap-4 mb-8">
                            {selectedPartner.logoUrl ? (
                                <img src={selectedPartner.logoUrl} alt="Logo" className="w-16 h-16 rounded-2xl border border-slate-100 object-cover shrink-0 bg-slate-50" />
                            ) : (
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200">
                                   <FiBriefcase className="text-3xl text-slate-300" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">{selectedPartner.organizationName}</h2>
                                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-[0.2em]">{selectedPartner.industry}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">Primary Contact</span>
                                <p className="text-sm font-bold text-slate-800">{selectedPartner.contactPerson?.name || '—'}</p>
                                <p className="text-xs text-slate-500">{selectedPartner.contactPerson?.position || '—'}</p>
                                <p className="text-xs text-brand-dark mt-1 hover:underline cursor-pointer">{selectedPartner.contactPerson?.email || '—'}</p>
                                <p className="text-xs font-mono text-slate-600 mt-1">{selectedPartner.contactPerson?.phone || '—'}</p>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">Entity Specs</span>
                                <p className="text-sm font-bold text-slate-800 capitalize mb-1">{selectedPartner.organizationType} <span className="text-slate-400 font-normal">Type</span></p>
                                <p className="text-xs text-slate-600 font-bold bg-slate-100 px-2 py-1 rounded inline-block">LKR {selectedPartner.partnershipPreferences?.budgetRange?.max?.toLocaleString() || 'N/A'} CSR Limits</p>
                            </div>
                        </div>

                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Aligned SDG Pillars</span>
                            <div className="flex gap-2 flex-wrap">
                                {selectedPartner.csrFocus?.length > 0 ? selectedPartner.csrFocus.map(focus => (
                                    <span key={focus} className="px-3 py-1 bg-brand-red/5 text-brand-red border border-brand-red/20 font-extrabold text-[10px] uppercase tracking-widest rounded-lg">
                                        {focus.replace('_', ' ')}
                                    </span>
                                )) : <span className="text-xs text-slate-400 ">No specific goals selected</span>}
                            </div>
                        </div>
                     </div>

                     <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
                         <button onClick={() => setSelectedPartner(null)} className="px-6 py-3 w-full sm:w-auto text-[10px] font-extrabold uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors">
                             Cancel
                         </button>

                         {canApprove && (
                             <div className="flex items-center gap-3 w-full sm:w-auto">
                                 <button 
                                   onClick={() => onReject(selectedPartner._id)} 
                                   disabled={rejectingId === selectedPartner._id}
                                   className="px-6 py-3 w-full sm:w-auto bg-white border border-slate-200 text-slate-600 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all active:scale-95 disabled:opacity-75"
                                 >
                                    {rejectingId === selectedPartner._id ? 'Rejecting...' : 'Reject'}
                                 </button>
                                 <button 
                                   onClick={() => {
                                     onApprove(selectedPartner._id);
                                     setSelectedPartner(null);
                                   }} 
                                   disabled={approvingId === selectedPartner._id || (!hasReviewedDocs && selectedPartner.verificationDocuments?.length > 0)}
                                   className="px-8 py-3 w-full sm:w-auto bg-brand-red text-white text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-xl hover:bg-brand-red/90 shadow-[0_8px_30px_rgb(220,38,38,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                   title={!hasReviewedDocs ? 'Open and review the document first to enable approval.' : ''}
                                 >
                                    <FiShield className="text-lg" />
                                    {approvingId === selectedPartner._id ? 'Approving...' : 'Verify & Approve'}
                                 </button>
                             </div>
                         )}
                     </div>
                 </div>
             </div>
         </div>
      )}
    </div>
  );
}
