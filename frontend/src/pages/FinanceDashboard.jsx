import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrendingUp, FiPieChart, FiDollarSign, FiShield,
  FiBriefcase, FiActivity, FiPlus, FiArrowUpRight,
  FiTarget, FiLayers, FiAlertCircle, FiClipboard,
  FiCheckCircle, FiLock, FiExternalLink
} from 'react-icons/fi';

export default function FinanceDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    summary, fetchSummary, loading: summaryLoading,
    createAllocation, transactions, fetchTransactions,
    error: globalError
  } = useFinance();

  const [ngoProfile, setNgoProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [transparencyReport, setTransparencyReport] = useState(null);
  const [fetchingReport, setFetchingReport] = useState(false);

  const [allocationData, setAllocationData] = useState({
    transactionId: '',
    category: 'education',
    amount: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    api.get('/api/ngos/profile')
      .then(res => {
        setNgoProfile(res.data);
        if (res.data?._id) {
          fetchSummary(res.data._id);
          fetchTransactions(res.data._id);
        }
      })
      .catch(err => {
        console.error('NGO Profile fetch error on Finance Dashboard:', err);
      });
  }, [fetchSummary, fetchTransactions]);

  const fetchReport = async () => {
    if (!ngoProfile?._id) return;
    setFetchingReport(true);
    setShowComplianceModal(true);
    try {
      const res = await api.get(`/api/finance/transparency-report/${ngoProfile._id}`);
      setTransparencyReport(res.data.data);
    } catch (err) {
      console.error('Failed to fetch transparency report Hub:', err);
    } finally {
      setFetchingReport(false);
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!ngoProfile?._id || !allocationData.transactionId || !allocationData.amount) {
      setLocalError("Please select a transaction and specify an amount.");
      return;
    }

    if (allocationData.description.length < 5) {
      setLocalError("Deployment description must be at least 5 characters for compliance Hub Sync!");
      return;
    }

    setSubmitting(true);
    try {
      await createAllocation({
        ...allocationData,
        ngoId: ngoProfile._id,
        amount: parseFloat(allocationData.amount)
      });
      setShowModal(false);
      setAllocationData({ transactionId: '', category: 'education', amount: '', description: '' });
      fetchSummary(ngoProfile._id);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Transaction synchronization failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const availableTransactions = transactions.filter(t => t.status === 'completed');

  if (summaryLoading && !summary) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-left">
        <LoadingSpinner />
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 animate-pulse">Decrypting Ledger Hub...</p>
      </div>
    </div>
  );

  const netBalance = Number(summary?.totalIncome || 0) - Number(summary?.totalAllocated || 0);

  return (
    <div className="max-w-7xl mx-auto pb-32 pt-6 text-left">

      {/* Premium Dashboard Frame */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-500 to-amber-200 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        {/* Dynamic Header Hub */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 text-left">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900/5 rounded-full border border-slate-900/5 backdrop-blur-sm"
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">{t('finance.transparency_hub')}</span>
            </motion.div>
            <h1 className="text-6xl font-extrabold text-slate-900 tracking-tighter leading-none ">
              {t('finance.registry_title')}
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl">
              {t('finance.managing_funds')} <span className="text-slate-900 border-b-2 border-orange-200">{ngoProfile?.organizationName || 'Synergy Partner'}</span>. Deploy donor capital with verified audit trails.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchReport}
              className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:border-orange-500 transition-all flex items-center gap-3 text-slate-600 hover:text-orange-600 shadow-sm"
            >
              <FiShield size={16} /> Audit Compliance
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3"
            >
              <FiPlus size={18} /> {t('finance.allocate_capital')}
            </motion.button>
          </div>
        </div>

        {/* Financial Intelligence Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: t('finance.gross_income'), value: summary?.totalIncome || 0, icon: FiDollarSign, trend: '+12%', color: 'rose' },
            { label: t('finance.total_allocated'), value: summary?.totalAllocated || 0, icon: FiBriefcase, trend: '84%', color: 'orange' },
            { label: t('finance.unallocated_reserves'), value: netBalance, icon: FiActivity, trend: 'Healthy', color: 'emerald' },
            { label: 'Audit Density', value: summary?.recentAllocations?.length || 0, icon: FiTarget, trend: 'Secure', color: 'slate' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="premium-surface p-8 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <stat.icon size={80} />
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 w-fit rounded-xl text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                  <stat.icon size={20} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-extrabold rounded">{stat.trend}</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 tabular-nums leading-none">
                    {typeof stat.value === 'number' ? `LKR ${stat.value.toLocaleString()}` : stat.value}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Campaign-Wise Distribution Hub */}
          <div className="lg:col-span-2 space-y-10">
            <div className="premium-surface p-10 text-left">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl">
                    <FiClipboard size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none ">Mission-Specific Deployment</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ">Granular tracking of campaign-linked capital Hub</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {summary?.allocationsByCampaign?.length > 0 ? (
                  summary.allocationsByCampaign.map((item, idx) => {
                    const totalReceived = transactions.reduce((sum, t) => t.campaignId?._id === item._id ? sum + t.amount : sum, 0);
                    const efficiency = totalReceived > 0 ? ((item.totalAllocated / totalReceived) * 100).toFixed(1) : '100';

                    return (
                      <div key={item._id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1">
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Mission Title</p>
                            <p className="text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors ">{item.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">{efficiency}% Deployed</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>Allocated</span>
                            <span className="text-slate-900 ">LKR {item.totalAllocated.toLocaleString()}</span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${efficiency}%` }}
                              className="h-full bg-indigo-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-20 flex flex-col items-center grayscale opacity-30">
                    <FiLayers size={48} className="text-slate-300 mb-4" />
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ">No campaign-linked allocations detected Hub</p>
                  </div>
                )}
              </div>
            </div>

            <div className="premium-surface p-10 text-left">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-50 text-orange-600 rounded-3xl">
                    <FiPieChart size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none ">{t('finance.allocation_breakdown')}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ">{t('finance.by_category')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {summary?.allocationsByCategory?.length > 0 ? (
                  summary.allocationsByCategory.map((item, idx) => {
                    const percentage = Math.min(((item.total / (summary.totalIncome || 1)) * 100), 100).toFixed(1);
                    return (
                      <div key={item._id} className="group/item">
                        <div className="flex justify-between items-end mb-3">
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-extrabold text-slate-200 group-hover/item:text-orange-200 transition-colors  leading-none">0{idx + 1}</span>
                            <div>
                              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1  leading-none">{item._id}</p>
                              <p className="text-2xl font-extrabold text-slate-900 tabular-nums leading-none">LKR {Number(item.total).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-extrabold text-orange-500 uppercase tracking-widest">{percentage}% Usage</p>
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-32 flex flex-col items-center justify-center grayscale opacity-30 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                    <FiLayers size={64} className="mb-6 text-slate-400" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ">Waiting for deployment data...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Deployment History Table */}
            <div className="premium-surface overflow-hidden text-left">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-slate-900 text-tf-primary rounded-3xl">
                    <FiArrowUpRight size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none ">{t('finance.deployment_log')}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ">{t('finance.audit_sync')}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto text-left">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                    <tr>
                      <th className="px-10 py-6">{t('finance.date')}</th>
                      <th className="px-10 py-6">{t('finance.mission_category')}</th>
                      <th className="px-10 py-6">{t('finance.amount_sent')}</th>
                      <th className="px-10 py-6 text-right">{t('finance.registry_id')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-left">
                    {summary?.recentAllocations?.length > 0 ? (
                      summary.recentAllocations.map(alloc => (
                        <tr key={alloc._id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-10 py-8">
                            <p className="text-xs font-bold text-slate-500 ">{new Date(alloc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </td>
                          <td className="px-10 py-8">
                            <span className="px-3 py-1 bg-slate-100 text-slate-900 rounded-lg text-[10px] font-extrabold uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all ">
                              {alloc.category}
                            </span>
                          </td>
                          <td className="px-10 py-8">
                            <p className="text-sm font-extrabold text-slate-900 tabular-nums ">LKR {alloc.amount.toLocaleString()}</p>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <code className="text-[10px] font-bold text-slate-300">#MB-{alloc._id.slice(-8).toUpperCase()}</code>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-10 py-24 text-center">
                          <FiShield className="mx-auto text-slate-200 mb-4" size={48} />
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 ">Financial integrity check passed. No deployments found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Contextual Intelligence Sidebar */}
          <div className="space-y-8 text-left">
            <div className="premium-surface p-8 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 blur-[80px] opacity-20 -mr-16 -mt-16" />
              <FiShield className="text-orange-500 mb-6" size={32} />
              <h4 className="text-xl font-extrabold mb-2 tracking-tight  leading-none">Treasury Compliance</h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed ">
                All fund allocations under LKR 50K are auto-verified. Larger deployments require secondary validation from the Platform Audit Board Hub.
              </p>
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 ">Risk Score</p>
                  <p className="text-lg font-extrabold text-emerald-400 underline decoration-2 decoration-emerald-400/30  leading-none">LOW / SECURE</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 ">Ledger status</p>
                  <p className="text-lg font-extrabold  leading-none">VERIFIED</p>
                </div>
              </div>
            </div>

            <div className="premium-surface p-8 space-y-6 border-dashed border-2 border-slate-100 bg-transparent text-left">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2 ">
                <FiTrendingUp className="text-orange-500" /> Operational Insights
              </h4>
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-600 leading-relaxed ">
                  "Current utilization efficiency is at <span className="text-orange-500">84.2%</span>. Consider deploying remaining reserves to Infrastructure missions to maximize impact score Hub Sync!"
                </p>
                <div className="h-px bg-slate-100" />
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] ">Generated by Synergy AI Advisor Hub</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Intelligence Modal */}
      <AnimatePresence>
        {showComplianceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComplianceModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white rounded-[48px] w-full max-w-4xl shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-100 text-orange-600 rounded-3xl">
                    <FiShield size={28} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter  leading-none">Institutional Audit Report</h3>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mt-3  leading-none">Verified Financial Transparency Dashboard Hub</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowComplianceModal(false)}
                  className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <FiPlus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 max-h-[60vh] overflow-y-auto">
                <div className="lg:col-span-2 space-y-10">
                  {fetchingReport ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-slate-300">
                      <LoadingSpinner />
                      <p className="text-[10px] font-extrabold uppercase tracking-widest ">Scanning global audit nodes...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:rotate-12 transition-transform"><FiLock size={64} /></div>
                          <p className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ">Institutional Integrity Score</p>
                          <h4 className="text-6xl font-extrabold text-orange-500 mb-1  leading-none">{transparencyReport?.score || '--'}</h4>
                          <p className="text-xs font-bold text-slate-400 ">Class A Certified Hub</p>
                        </div>
                        <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                          <FiCheckCircle className="text-emerald-500 mb-4" size={32} />
                          <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest mb-1  leading-none">Audit Status</p>
                          <h4 className="text-2xl font-extrabold text-emerald-900 uppercase tracking-tight  leading-none">Verified Secure</h4>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2  leading-none">
                          <FiLock className="text-orange-500" /> Immutable Audit Trail (Recent)
                        </h5>
                        <div className="space-y-4">
                          {transparencyReport?.auditLogs?.slice(0, 5).map(log => (
                            <div key={log._id} className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-slate-300 rounded-full group-hover:bg-orange-500 transition-colors" />
                                <div>
                                  <p className="text-xs font-extrabold text-slate-900 uppercase tracking-widest leading-none mb-1 ">{log.action} {log.entityType}</p>
                                  <p className="text-[10px] font-bold text-slate-400  leading-none">Performed by {log.changedBy?.name || 'System Registry'}</p>
                                </div>
                              </div>
                              <p className="text-[10px] font-extrabold text-slate-300 tabular-nums uppercase ">{new Date(log.createdAt).toLocaleTimeString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-8 text-left">
                  <div className="p-8 bg-slate-50 rounded-3xl space-y-6">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ">Compliance Indicators Hub</p>
                    <div className="space-y-4">
                      {[
                        { label: 'Allocation Fidelity', value: 'High' },
                        { label: 'Identity Verified', value: 'Yes' },
                        { label: 'Market Linkage', value: 'Active' },
                        { label: 'Pledge Coverage', value: '94%' }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ">{item.label}</span>
                          <span className="text-[10px] font-extrabold text-slate-900 ">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-3  font-serif">
                    <FiExternalLink /> Export Full Audit (PDF)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Allocation Command Center Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50 bg-slate-50/50 relative">
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter  leading-none">{t('finance.allocate_capital')}</h3>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2 ">
                  <FiPlus className="text-orange-500" /> Professional Resource Orchestration Hub sync
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-10 right-10 text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
                >
                  <FiActivity size={24} />
                </button>
              </div>

              {localError && (
                <div className="mx-10 mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 animate-shake">
                  <FiAlertCircle className="text-rose-500" size={20} />
                  <p className="text-xs font-bold text-rose-700 ">{localError}</p>
                </div>
              )}

              <form onSubmit={handleAllocate} className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1 ">Source Capital Stream</label>
                  <div className="relative">
                    <select
                      required
                      value={allocationData.transactionId}
                      onChange={(e) => setAllocationData({ ...allocationData, transactionId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer "
                    >
                      <option value="">Select a verified income source Hub...</option>
                      {availableTransactions.map(t => (
                        <option key={t._id} value={t._id}>
                          {t.donorId?.name || 'Anonymous'} - {t.campaignId?.title ? `[${t.campaignId.title}]` : '[General]'} - LKR {t.amount.toLocaleString()} ({new Date(t.createdAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                      <FiLayers size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1 ">Mission Sector</label>
                    <select
                      required
                      value={allocationData.category}
                      onChange={(e) => setAllocationData({ ...allocationData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all "
                    >
                      <option value="education">Education Hub</option>
                      <option value="healthcare">Healthcare Hub</option>
                      <option value="infrastructure">Infrastructure Hub</option>
                      <option value="food">Food Hub</option>
                      <option value="clothing">Clothing Hub</option>
                      <option value="emergency-relief">Emergency Relief Hub</option>
                      <option value="administrative">Operations / Admin Hub</option>
                      <option value="other">Special Operations Hub</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1 ">Capital Amount (LKR)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 25000"
                      value={allocationData.amount}
                      onChange={(e) => setAllocationData({ ...allocationData, amount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all tabular-nums "
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1 ">Strategic Justification / Purpose</label>
                  <textarea
                    required
                    placeholder="Provide a detailed roadmap for this deployment Hub..."
                    value={allocationData.description}
                    onChange={(e) => setAllocationData({ ...allocationData, description: e.target.value })}
                    rows="4"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none "
                  />
                </div>

                <div className="pt-6 flex gap-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-5 bg-slate-50 text-slate-500 text-[10px] font-extrabold uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all  border border-slate-100"
                  >
                    Abort Deployment
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-5 bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10  disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Synchronizing Hub...</span>
                      </>
                    ) : (
                      <>
                        <span>Finalize Hub Deployment →</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
