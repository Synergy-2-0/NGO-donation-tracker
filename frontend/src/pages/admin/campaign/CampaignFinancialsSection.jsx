import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { FiUsers, FiDollarSign, FiClock, FiRepeat, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function CampaignFinancialsSection({ campaignId }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, contributors: 0 });

    useEffect(() => {
        const fetchFinancials = async () => {
            try {
                const res = await api.get(`/api/finance/transactions/campaign/${campaignId}`);
                const txs = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setTransactions(txs);
                
                const total = txs.reduce((sum, tx) => sum + (tx.amount || 0), 0);
                const uniqueDonors = new Set(txs.map(tx => tx.donorId?._id || tx.donorId)).size;
                setStats({ total, contributors: uniqueDonors });
            } catch (err) {
                console.error("Failed to load campaign financials:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFinancials();
    }, [campaignId]);

    if (loading) return <div className="py-20 text-center"><LoadingSpinner message="Retrieving Financial Registry..." /></div>;

    return (
        <div className="space-y-10 animate-soft">
            {/* Real-time Summary Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="premium-surface p-8 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-tf-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-tf-primary/10 text-tf-primary rounded-2xl flex items-center justify-center">
                            <FiDollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Contributions</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tighter ">LKR {stats.total.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                <div className="premium-surface p-8 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <FiUsers size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">Impact Partners</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tighter ">{stats.contributors} Donors</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inbound Funds Registry */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-950 tracking-tight ">Financial Contributors</h3>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Audit-ready verification registry</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                                <th className="px-10 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ">Identity</th>
                                <th className="px-10 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  text-center">Protocol</th>
                                <th className="px-10 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  text-right">Verification</th>
                                <th className="px-10 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  text-right">Liquidity Inbound</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.length > 0 ? transactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-tf-primary group-hover:text-white transition-all font-extrabold">
                                                {tx.donorId?.name?.[0] || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold text-slate-950  line-clamp-1">{tx.donorId?.name || 'Anonymous Intelligence'}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
                                                    <FiClock className="text-tf-primary" /> {new Date(tx.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        {tx.paymentType === 'pledge' ? (
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-extrabold uppercase tracking-widest border border-emerald-100 flex items-center justify-center gap-1.5 w-fit mx-auto">
                                                <FiRepeat /> Recurring
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-extrabold uppercase tracking-widest border border-slate-100 w-fit mx-auto">One-Time</span>
                                        )}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <FiCheckCircle className="text-emerald-500" />
                                            <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">#{tx.payHereOrderId || tx._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <p className="text-lg font-extrabold text-slate-950 tracking-tighter  tabular-nums">LKR {Number(tx.amount).toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Verified Registry</p>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-10 py-32 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                                            <FiUsers size={40} />
                                        </div>
                                        <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.5em] ">Awaiting Founding Contributors</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
