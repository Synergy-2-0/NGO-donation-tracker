import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function PartnerProfilePage() {
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await api.get('/api/partners/me/profile');
                setPartner(data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setPartner(null);
                    return;
                }
                setError(err.response?.data?.message || 'Failed to load partner profile.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Partner Profile</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your organization details and verification status.</p>
                </div>
                {partner && (
                    <div className="flex gap-2">
                        <Link
                            to="/partner/agreements"
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
                        >
                            Partnership Ops
                        </Link>
                        <Link
                            to={`/partners/${partner._id}`}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                        >
                            Open Full Profile
                        </Link>
                    </div>
                )}
            </div>

            {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

            {!partner ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                    <p className="text-gray-600 font-medium">No partner profile found for your account.</p>
                    <p className="text-sm text-gray-400 mt-1">Create your organization profile from the Partners page.</p>
                    <Link
                        to="/partners"
                        className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                    >
                        Go to Partners
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                        <div>
                            <p className="text-gray-400">Organization</p>
                            <p className="font-semibold text-gray-800">{partner.organizationName || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Type</p>
                            <p className="font-semibold text-gray-800 capitalize">{partner.organizationType || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Industry</p>
                            <p className="font-semibold text-gray-800">{partner.industry || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Status</p>
                            <p className="font-semibold text-gray-800 capitalize">{partner.status || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Verification</p>
                            <p className="font-semibold text-gray-800 capitalize">{partner.verificationStatus || 'pending'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Contact Person</p>
                            <p className="font-semibold text-gray-800">{partner.contactPerson?.name || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Contact Email</p>
                            <p className="font-semibold text-gray-800">{partner.contactPerson?.email || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Contact Phone</p>
                            <p className="font-semibold text-gray-800">{partner.contactPerson?.phone || '—'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-gray-400">Address</p>
                            <p className="font-semibold text-gray-800">
                                {[
                                    partner.address?.street,
                                    partner.address?.city,
                                    partner.address?.state,
                                    partner.address?.country,
                                    partner.address?.postalCode,
                                ]
                                    .filter(Boolean)
                                    .join(', ') || '—'}
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Link
                            to={`/partners/${partner._id}`}
                            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100"
                        >
                            Edit Profile
                        </Link>
                        <Link
                            to={`/partners/${partner._id}/impact`}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-100"
                        >
                            View Impact
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
