import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';

const FREQUENCIES = ['one-time', 'monthly', 'quarterly', 'annually'];

const statusBadgeStyle = {
  active: 'bg-tf-primary/10 text-tf-primary border-tf-primary/20 shadow-[0_0_15px_rgba(255,138,0,0.1)]',
  fulfilled: 'bg-tf-accent/10 text-tf-accent border-tf-accent/20',
  cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
};

const inputCls = "w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-tf-primary focus:ring-4 focus:ring-tf-primary/10 transition-all shadow-inner placeholder:text-slate-200 uppercase tracking-widest";


function PledgeModal({ pledge, onClose, onSave, loading }) {
  const { t } = useTranslation();
  const defaultForm = {
    amount: '',
    frequency: 'one-time',
    campaignId: '',
    notes: '',
    startDate: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState(
    pledge
      ? {
        amount: pledge.amount ?? '',
        frequency: pledge.frequency ?? 'one-time',
        campaignId: pledge.campaign ?? '',
        notes: pledge.notes ?? '',
        startDate: pledge.startDate
          ? new Date(pledge.startDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      }
      : defaultForm
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      amount: Number(form.amount),
      frequency: form.frequency,
      startDate: form.startDate,
      notes: form.notes || undefined,
      campaign: form.campaignId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-[120] p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[3.5rem] shadow-3xl p-12 max-w-3xl w-full space-y-12 relative overflow-hidden group border border-slate-100"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-tf-primary/5 blur-[80px] -mr-24 -mt-24" />
        <div className="space-y-4 text-center">
           <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-50 border border-slate-100 rounded-full mx-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-tf-primary shadow-[0_0_8px_rgba(255,138,0,0.6)]" />
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] leading-none">{t('pledge_modal.mission_support')}</p>
           </div>
           <h4 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">
             {pledge?._id ? t('pledge_modal.title_edit') : t('pledge_modal.title_new')}
           </h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3 group/field">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] px-6 group-hover/field:text-tf-primary transition-colors">{t('pledge_modal.amount_label')}</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({...form, amount: e.target.value})}
                required
                placeholder="0.00"
                className={inputCls}
              />
            </div>
            <div className="space-y-3 group/field">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] px-6 group-hover/field:text-tf-primary transition-colors">{t('pledge_modal.frequency_label')}</label>
              <div className="relative">
                 <select
                   value={form.frequency}
                   onChange={(e) => setForm({...form, frequency: e.target.value})}
                   className={inputCls + " appearance-none cursor-pointer pr-16"}
                 >
                   {FREQUENCIES.map((f) => (
                     <option key={f} value={f}>{t(`pledge_modal.freq.${f}`)} {t('pledge_modal.gift_suffix')}</option>
                   ))}
                 </select>
                 <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3 group/field">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] px-6 group-hover/field:text-tf-primary transition-colors">{t('pledge_modal.start_date')}</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({...form, startDate: e.target.value})}
                className={inputCls}
              />
            </div>
            <div className="space-y-3 group/field">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] px-6 group-hover/field:text-tf-primary transition-colors">Mission ID / Name (Optional)</label>
              <input
                type="text"
                value={form.campaignId}
                onChange={(e) => setForm({...form, campaignId: e.target.value})}
                placeholder="ID OR NAME HUB"
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-3 group/field">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.4em] px-6 group-hover/field:text-tf-primary transition-colors">{t('pledge_modal.notes_label')}</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              rows={3}
              placeholder={t('pledge_modal.notes_placeholder')}
              className={inputCls + "uppercase tracking-widest"}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-6 relative z-20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-6 text-[11px] font-extrabold uppercase tracking-[0.5em] text-slate-400 hover:text-slate-900 transition-colors uppercase"
            >
              {t('pledge_modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-6 bg-slate-950 hover:bg-tf-primary text-white text-[12px] font-extrabold uppercase tracking-[0.5em] rounded-[2rem] transition-all duration-500 shadow-2xl shadow-black/10 active:scale-95 disabled:opacity-50"
            >
              {loading ? '...' : (pledge?._id ? t('pledge_modal.save_plan') : t('pledge_modal.create_plan'))}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function PledgesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { donorProfile, pledges, transactions, loading, fetchProfile, fetchTransactions, fetchPledges, createPledge, updatePledge, deletePledge } = useDonor();
  const [modal, setModal] = useState({ open: false, data: null });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = donorProfile || (await fetchProfile());
        if (profile?._id) {
          await fetchPledges(profile._id);
          const userId = profile.userId?._id || profile.userId;
          if (userId) await fetchTransactions(userId);
        }
      } catch {
        // quiet
      } finally {
        setInitialFetchDone(true);
      }
    };
    load();
  }, [donorProfile, fetchProfile, fetchPledges, fetchTransactions]);

  const handleSave = async (data) => {
    setLocalError('');
    setSuccess('');
    try {
      if (modal.data?._id) {
        await updatePledge(donorProfile._id, modal.data._id, data);
        setSuccess('Your support plan has been updated.');
      } else {
        await createPledge(donorProfile._id, data);
        setSuccess('Thank you for setting up a new support plan!');
      }
      setModal({ open: false, data: null });
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Verification failure.');
    }
  };

  const handleArchive = async (id) => {
    if (window.confirm('Stop this support plan? Any further donations will be cancelled.')) {
      try {
        await deletePledge(donorProfile._id, id);
        setSuccess('The support plan has been stopped.');
      } catch (err) {
        setLocalError('Failure to update plan.');
      }
    }
  };

  if (!initialFetchDone && loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-6 font-sans selection:bg-tf-primary selection:text-white animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      {/* High-End Header */}
      <div className="bg-[#0F172A] rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tf-primary/10 blur-[150px] -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
           <div className="space-y-6">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-tf-primary shadow-[0_0_15px_rgba(255,138,0,1)] animate-pulse" />
                    <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.6em] leading-none">{t('pledges_page.header_badge')}</p>
                    <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.6em] leading-none">{t('pledges_page.header_badge')}</p>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none">
                    {t('pledges_page.title_1')} <span className="text-tf-primary">{t('pledges_page.title_2')}</span>
                 </h2>
              </div>
              <p className="text-base text-white/40 max-w-xl leading-relaxed font-semibold">
                 {t('pledges_page.subtitle')}
              </p>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {localError && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <ErrorAlert message={localError} onDismiss={() => setLocalError('')} />
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="bg-tf-accent/5 border border-tf-accent/10 text-tf-accent text-[11px] font-extrabold uppercase tracking-[0.3em] px-12 py-6 rounded-[2rem] shadow-sm flex items-center gap-6"
          >
            <div className="w-2.5 h-2.5 bg-tf-accent rounded-full shadow-[0_0_10px_rgba(34,197,94,1)]" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal.open && (
          <PledgeModal pledge={modal.data} onClose={() => setModal({ open: false, data: null })} onSave={handleSave} loading={loading} />
        )}
      </AnimatePresence>

      {!donorProfile ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 rounded-[4rem] p-20 border border-slate-100 flex flex-col md:flex-row items-center gap-16">
            <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center shrink-0 border border-slate-100 shadow-xl text-tf-primary group hover:rotate-12 transition-transform duration-700">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 18a10.003 10.003 0 01-12-10 10.003 10.003 0 0110-10M12 3a10.003 10.003 0 0112 10 10.003 10.003 0 01-10 10" /></svg>
            </div>
            <div className="space-y-8 text-center md:text-left">
                <div className="space-y-3">
                   <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">{t('pledges_page.profile_verification.title')}</h3>
                   <p className="text-base text-slate-400 leading-relaxed max-w-2xl font-medium">{t('pledges_page.profile_verification.desc')}</p>
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="py-6 px-14 bg-slate-950 text-white text-[11px] font-extrabold uppercase tracking-[0.5em] rounded-[2rem] hover:bg-tf-primary transition-all duration-500 active:scale-95 shadow-2xl"
                >
                    {t('pledges_page.profile_verification.button')}
                </button>
            </div>
        </motion.div>
      ) : pledges.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[4rem] border border-slate-100 p-40 text-center space-y-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[120px] -mr-32 -mt-32" />
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300 border border-slate-100 shadow-inner">
             <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          </div>
          <div className="space-y-4">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{t('pledges_page.no_pledges.title')}</p>
            <p className="text-[11px] text-slate-500 font-extrabold uppercase tracking-[0.5em] leading-relaxed max-w-md mx-auto">{t('pledges_page.no_pledges.desc')}</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {pledges.map((pledge) => {
              const pledgeTxs = (transactions || []).filter(tx => 
                tx.status === 'completed' && 
                (tx.campaignId?._id === pledge.campaign?._id || tx.campaignId === pledge.campaign) &&
                Number(tx.amount) === Number(pledge.amount)
              );
              const totalImpact = pledgeTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
              const donePaymentsCount = pledgeTxs.length;

              const nextDueDate = (() => {
                if (pledge.status !== 'active' && pledge.status !== 'pending') return null;
                
                const months = pledge.frequency === 'monthly' ? 1 : pledge.frequency === 'quarterly' ? 3 : pledge.frequency === 'annually' ? 12 : 0;
                if (!months) return null;

                if (pledgeTxs.length > 0) {
                  const sortedTxs = [...pledgeTxs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  const latest = new Date(sortedTxs[0].createdAt);
                  latest.setMonth(latest.getMonth() + months);
                  return latest;
                }
                
                // FALLBACK: Anchor to start date
                return new Date(pledge.startDate || pledge.createdAt);
              })();

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  key={pledge._id} 
                  className="bg-white rounded-[3.5rem] border border-slate-100 p-12 hover:shadow-3xl transition-all duration-700 group relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-tf-primary/10 transition-colors" />
                  <div className="space-y-8 relative z-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                       <span className={`px-6 py-2.5 rounded-2xl text-[9px] font-extrabold uppercase tracking-[0.3em] border transition-all shadow-sm ${statusBadgeStyle[pledge.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                          {t(`pledges_page.status.${pledge.status}`)}
                       </span>
                       <p className="text-[10px] font-extrabold text-slate-300 font-mono tracking-widest uppercase">ID: {pledge._id.slice(-6)} HUB</p>
                    </div>
                    
                    <div className="space-y-2">
                       <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.5em] leading-none mb-1">{t('pledges_page.card.support_label')}</p>
                       <h3 className="text-3xl font-extrabold text-slate-950 tracking-tight tabular-nums leading-none">LKR {Number(pledge.amount).toLocaleString()}</h3>
                       <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t(`pledge_modal.freq.${pledge.frequency}`)} {t('pledges_page.card.cycle_suffix')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                       <div className="space-y-2">
                          <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.3em] leading-none mb-1">{t('pledges_page.card.gifts_verified')}</p>
                          <p className="text-base font-extrabold text-tf-accent leading-none tracking-tight">{donePaymentsCount} {t('pledges_page.card.payments_unit')}</p>
                       </div>
                       <div className="space-y-2 text-right">
                          <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.3em] leading-none mb-1">{t('pledges_page.card.total_given')}</p>
                          <p className="text-base font-extrabold text-slate-900 leading-none tracking-tight">LKR {totalImpact.toLocaleString()}</p>
                       </div>
                    </div>

                    <div className={`${pledge.status === 'pending' ? 'bg-amber-50' : 'bg-slate-50'} rounded-2xl p-6 space-y-2 group-hover:bg-tf-primary/5 transition-colors`}>
                       <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.3em] leading-none">{t('pledges_page.card.next_support')}</p>
                       <p className={`text-[13px] font-extrabold flex items-center gap-2 ${pledge.status === 'pending' ? 'text-amber-600' : 'text-slate-900'}`}>
                          <svg className="w-4 h-4 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {nextDueDate ? nextDueDate.toLocaleDateString(t('i18n.language'), {month: 'long', day: 'numeric', year: 'numeric'}) : (pledge.status === 'active' ? 'Payment Due' : 'Completed Plan')}
                       </p>
                    </div>

                    {pledge.notes && (
                      <div className="pt-2">
                         <p className="text-[13px] text-slate-400 font-medium leading-relaxed line-clamp-2">"{pledge.notes}"</p>
                      </div>
                    )}

                    <div className="flex gap-4 pt-8 mt-auto">
                      <button
                        onClick={() => handleArchive(pledge._id)}
                        className="flex-1 py-5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 rounded-[1.5rem] text-[10px] font-extrabold uppercase tracking-[0.4em] transition-all duration-500 active:scale-95"
                      >
                        {t('pledges_page.card.stop_button')}
                      </button>
                      <button
                        onClick={() => setModal({ open: true, data: pledge })}
                        className="px-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-tf-primary hover:bg-tf-primary/5 transition-all duration-500 active:scale-90"
                      >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
