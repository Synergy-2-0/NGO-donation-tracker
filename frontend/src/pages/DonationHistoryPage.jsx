import { useEffect } from 'react';
import { useDonor } from '../context/DonorContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const statusColor = {
  completed: 'bg-tf-green/10 text-tf-green border-tf-green/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
  pending: 'bg-amber-100 text-amber-600 border-amber-200',
  failed: 'bg-red-50 text-red-600 border-red-100',
  archived: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function DonationHistoryPage() {
  const { donorProfile, transactions, loading, error, fetchProfile, fetchTransactions } =
    useDonor();

  useEffect(() => {
    const load = async () => {
      try {
        const profile = donorProfile || (await fetchProfile());
        if (profile?._id) await fetchTransactions(profile._id);
      } catch {
        // profile may not exist yet
      }
    };
    load();
  }, [donorProfile, fetchProfile, fetchTransactions]);

  if (loading && transactions.length === 0) return <LoadingSpinner />;

  const completedTx = transactions.filter((t) => t.status === 'completed');
  const totalDonated = completedTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const uniqueCampaigns = new Set(
    transactions.map((t) => t.campaignId?._id || t.campaignId).filter(Boolean)
  ).size;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1700px] mx-auto pb-24 font-sans selection:bg-tf-pink selection:text-white">
      
      {/* Cinematic History Header */}
      <div className="relative p-12 lg:p-16 bg-tf-purple rounded-[4rem] overflow-hidden shadow-2xl group text-white border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1600')] opacity-5 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tf-pink/10 blur-[130px] -ml-40 -mb-40 opacity-40 animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="w-2.5 h-2.5 rounded-full bg-tf-pink shadow-[0_0_20px_rgba(230,0,126,0.8)] animate-pulse" />
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-60">Verified Personal Donation History</p>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic tracking-tight">Impact <span className="text-tf-pink">History </span> Archive</h2>
           </div>
           <div className="bg-white/5 border border-white/10 backdrop-blur-md px-10 py-6 rounded-[2.5rem] flex items-center gap-12">
              <div className="text-center group/stat">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 group-hover/stat:text-white transition-colors">Cumulative Giving</p>
                 <p className="text-2xl font-black tabular-nums italic text-tf-pink">LKR {totalDonated.toLocaleString()}</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center group/stat">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 group-hover/stat:text-white transition-colors">Supported Causes</p>
                 <p className="text-2xl font-black tabular-nums italic text-tf-green">{uniqueCampaigns}</p>
              </div>
           </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Registry Table Matrix */}
      {transactions.length === 0 ? (
        <div className="bg-white rounded-[4rem] border-2 border-dashed border-slate-100 p-32 text-center space-y-12">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 shadow-inner rotate-3 hover:rotate-12 transition-transform duration-500">
             <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          </div>
          <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.4em] max-w-sm mx-auto leading-loose italic">
             No donations found in your personal history.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-4">
          <div className="bg-slate-50 rounded-[3.5rem] border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/50">
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Initiative name</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Contribution Amount</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Method</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Current Status</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="group hover:bg-slate-50 transition-all cursor-default">
                    <td className="px-10 py-10">
                      <div className="space-y-1">
                        <span className="text-[15px] font-black text-tf-purple tracking-tight group-hover:text-tf-pink transition-colors italic">
                          {tx.campaignId?.title || tx.campaignId || 'General Aid Support'}
                        </span>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Ref: {tx._id.slice(-12).toUpperCase()}</p>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                       <span className="text-2xl font-black text-tf-purple tracking-tighter italic tabular-nums group-hover:scale-110 transition-transform origin-left inline-block">LKR {Number(tx.amount).toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-10">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-5 py-2 rounded-xl group-hover:bg-tf-purple group-hover:text-white transition-all shadow-sm">{tx.type || 'DIRECT'}</span>
                    </td>
                    <td className="px-10 py-10">
                      <span className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-dashed transition-all ${statusColor[tx.status] || 'bg-white text-slate-400'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-10 py-10">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-tf-purple italic underline decoration-tf-pink/20 underline-offset-4">
                           {new Date(tx.createdAt).toLocaleDateString(undefined, {
                             year: 'numeric',
                             month: 'short',
                             day: 'numeric',
                           })}
                         </p>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Verified on Registry</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </div>
  );
}
