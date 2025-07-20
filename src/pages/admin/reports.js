import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import Alert from '@/components/Alert';
import Link from 'next/link';
import { 
    ExclamationTriangleIcon, 
    CheckCircleIcon,
    ArrowLeftIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

export default function ReportsManagement() {
    const { user, setAuthOpenedFrom } = useUser();
    const { lang } = useLanguage();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Check if user is authorized
    const isAuthorized = user && process.env.NEXT_PUBLIC_CAN_DELETE_SONG && 
        process.env.NEXT_PUBLIC_CAN_DELETE_SONG.includes(user.email);

    useEffect(() => {
        if (!user) {
            setAuthOpenedFrom('admin-reports');
        } else if (isAuthorized) {
            fetchReports();
        }
    }, [user, setAuthOpenedFrom, isAuthorized]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/reports');
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch reports');
            }
            
            setReports(data.reports);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setErrorMessage(error.message);
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const updateReportStatus = async (reportId, newStatus) => {
        try {
            setUpdating(prev => ({ ...prev, [reportId]: true }));
            
            const response = await fetch('/api/admin/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportId,
                    status: newStatus
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update status');
            }

            // Update the report in the local state
            setReports(prevReports => 
                prevReports.map(report => 
                    report.id === reportId 
                        ? { ...report, status: newStatus, updated_at: new Date().toISOString() }
                        : report
                )
            );

            setShowSuccess(true);
        } catch (error) {
            console.error('Error updating report status:', error);
            setErrorMessage(error.message);
            setShowError(true);
        } finally {
            setUpdating(prev => ({ ...prev, [reportId]: false }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ka-GE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'resolved': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    const statusOptions = [
        { value: 'pending', label: lang.admin.pending },
        { value: 'in_progress', label: lang.admin.in_progress },
        { value: 'resolved', label: lang.admin.resolved },
        { value: 'rejected', label: lang.admin.rejected }
    ];

    // If user is not logged in or not authorized, show appropriate message
    if (!user) {
        return (
            <>
                <Head>
                    <title>{lang.admin.reports_management}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-md mx-auto bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                            <div className="text-center">
                                <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                                <h2 className="text-xl font-semibold text-white mb-2">
                                    {lang._auth.login}
                                </h2>
                                <p className="text-slate-300">
                                    {lang._auth.enterBtn}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!isAuthorized) {
        return (
            <>
                <Head>
                    <title>{lang.admin.reports_management}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-md mx-auto bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-700/50">
                            <div className="text-center">
                                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2">
                                    {lang.admin.error_not_authorized}
                                </h2>
                                <p className="text-slate-300">
                                    You don't have permission to access this page.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{lang.admin.reports_management}</title>
                <meta name="description" content="Admin panel for managing user reports" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="container mx-auto px-4 py-8 sm:py-12">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href="/admin" 
                                    className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-colors"
                                >
                                    <ArrowLeftIcon className="w-5 h-5 text-slate-400" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                        {lang.admin.reports_management}
                                    </h1>
                                    <p className="text-slate-400 text-sm sm:text-base mt-1">
                                        Manage user-submitted reports and issues
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
                                <span className="text-slate-300 text-sm font-medium">
                                    {reports.length} {lang.admin.reports}
                                </span>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                                <p className="text-slate-400 mt-4">{lang.admin.loading_reports}</p>
                            </div>
                        )}

                        {/* No Reports State */}
                        {!loading && reports.length === 0 && (
                            <div className="text-center py-12">
                                <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-slate-500 mb-4" />
                                <p className="text-slate-400 text-lg">{lang.admin.no_reports}</p>
                            </div>
                        )}

                        {/* Reports List */}
                        {!loading && reports.length > 0 && (
                            <div className="space-y-4">
                                {reports.map((report) => (
                                    <div 
                                        key={report.id} 
                                        className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50"
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Report Info */}
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white mb-1">
                                                            Report #{report.id}
                                                        </h3>
                                                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                                                            <span>{formatDate(report.created_at)}</span>
                                                            {report.ip && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>IP: {report.ip}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                                        {statusOptions.find(opt => opt.value === report.status)?.label || report.status}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-slate-300 mb-1">
                                                            {lang.admin.song_url}:
                                                        </h4>
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-blue-400 text-sm break-all">
                                                                {report.song_url}
                                                            </p>
                                                            <a 
                                                                href={report.song_url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="p-1 bg-slate-700/50 hover:bg-slate-600/50 rounded transition-colors"
                                                            >
                                                                <EyeIcon className="w-4 h-4 text-slate-400" />
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {report.line_number && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-slate-300 mb-1">
                                                                {lang.admin.line_number}: {report.line_number}
                                                            </h4>
                                                        </div>
                                                    )}

                                                    {report.line_text && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-slate-300 mb-1">
                                                                {lang.admin.line_text}:
                                                            </h4>
                                                            <p className="text-slate-300 text-sm bg-slate-700/30 p-3 rounded-lg">
                                                                {report.line_text}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className="text-sm font-medium text-slate-300 mb-1">
                                                            {lang.admin.report_text}:
                                                        </h4>
                                                        <p className="text-slate-300 text-sm bg-slate-700/30 p-3 rounded-lg">
                                                            {report.report_text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Update */}
                                            <div className="lg:border-l lg:border-slate-700/50 lg:pl-6">
                                                <h4 className="text-sm font-medium text-slate-300 mb-3">
                                                    {lang.admin.status}
                                                </h4>
                                                <div className="space-y-3">
                                                    <select
                                                        value={report.status}
                                                        onChange={(e) => updateReportStatus(report.id, e.target.value)}
                                                        disabled={updating[report.id]}
                                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                                    >
                                                        {statusOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {updating[report.id] && (
                                                        <div className="flex items-center space-x-2 text-blue-400 text-sm">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                                                            <span>{lang.admin.updating}</span>
                                                        </div>
                                                    )}

                                                    {report.updated_at && (
                                                        <p className="text-xs text-slate-500">
                                                            {lang.admin.updated_at}: {formatDate(report.updated_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {/* Success Alert */}
            <Alert 
                open={showSuccess} 
                setOpen={setShowSuccess} 
                message={lang.admin.status_updated} 
                duration={3}
                type="success"
            />

            {/* Error Alert */}
            <Alert 
                open={showError} 
                setOpen={setShowError} 
                message={errorMessage || 'An error occurred'} 
                duration={5}
                type="error"
            />
        </>
    );
} 