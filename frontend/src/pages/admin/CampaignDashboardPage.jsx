import { useEffect, useState } from 'react';
import { useAdminCampaign } from '../../context/AdminCampaignContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const statusConfig = {
    draft: {
        label: 'Draft',
        className: 'bg-gray-100 text-gray-500',
        dot: 'bg-gray-400',
    },
    active: {
        label: 'Active',
        className: 'bg-red-100 text-[#DC2626]',
        dot: 'bg-[#DC2626]',
    },
    completed: {
        label: 'Completed',
        className: 'bg-green-100 text-green-700',
        dot: 'bg-green-500',
    },
    archived: {
        label: 'Archived',
        className: 'bg-orange-100 text-[#7C2D12]',
        dot: 'bg-orange-500',
    },
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status] ?? statusConfig.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}


export default function CampaignDashboardPage() {
    const { campaigns, loading, fetchCampaigns, publishCampaign } = useAdminCampaign();
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const itemsPerPage = 8;

    useEffect(() => {
        fetchCampaigns().catch(() => { });
    }, [fetchCampaigns]);

    useEffect(() => {
        setCurrentPage(1);
    }, [campaigns.length, statusFilter]);

    if (loading && campaigns.length === 0) return <LoadingSpinner />;

    const totalCampaigns = campaigns.length;
    const draftCount = campaigns.filter((c) => c.status === 'draft').length;
    const nonDraftCount = campaigns.filter((c) => c.status !== 'draft').length;
    const filteredCampaigns =
        statusFilter === 'all'
            ? campaigns
            : campaigns.filter((c) => c.status === statusFilter);

    const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);


    return (
        <div className="min-h-full bg-gray-50 p-8 space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Campaign Dashboard</h2>
                    <p className="text-gray-500 text-sm mt-1">View and manage campaigns.</p>
                </div>
                <Link
                    to="/admin/campaigns/create"
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #DC2626 100%)' }}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Campaign
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 3v4m12-4v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#DC2626] leading-none">{totalCampaigns}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">Total Campaigns</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600 leading-none">{nonDraftCount}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">Published</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#7C2D12]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#7C2D12] leading-none">{draftCount}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">Drafts</p>
                    </div>
                </div>
            </div>

            {/* Campaign List */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-700">All Campaigns</h3>

                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-600"
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                {filteredCampaigns.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 3v4m12-4v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">No campaigns yet.</p>
                        <p className="text-xs text-gray-300 mt-1">Create your first campaign to get started.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {paginatedCampaigns.map((c) => (
                            <div
                                key={c._id}
                                className="flex items-center justify-between px-6 py-4 hover:bg-red-50/40 transition-colors duration-150 group"
                            >
                                {/* Left */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0 group-hover:border-red-200 group-hover:bg-red-50 transition-colors">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#DC2626] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 3v4m12-4v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#DC2626] transition-colors truncate">{c.title}</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                                            ID: {c._id ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <StatusBadge status={c.status} />

                                    {c.status === 'draft' && (
                                        <button
                                            onClick={() => publishCampaign(c._id)}
                                            className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors border border-green-100"
                                        >
                                            Publish
                                        </button>
                                    )}
                                    <Link
                                        to={`/admin/campaigns/${c._id}`}
                                        className="px-3 py-1 bg-red-50 text-[#DC2626] rounded-lg text-xs font-medium hover:bg-red-100 transition-colors border border-red-100"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredCampaigns.length > itemsPerPage && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="text-gray-700 disabled:text-gray-300"
                                aria-label="Previous page"
                            >
                                {"<"}
                            </button>

                            <span className="w-8 h-8 inline-flex items-center justify-center text-xs rounded border bg-[#DC2626] text-white border-[#DC2626]">
                                {currentPage}
                            </span>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="text-gray-700 disabled:text-gray-300"
                                aria-label="Next page"
                            >
                                {">"}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}