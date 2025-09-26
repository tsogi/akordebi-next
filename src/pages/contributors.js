import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { getNotation } from '@/utils/notations';

export default function Contributors() {
    const { lang } = useLanguage();
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedContributors, setExpandedContributors] = useState(new Set());
    const [updatingPayments, setUpdatingPayments] = useState(new Set());
    const [bulkUpdatingUsers, setBulkUpdatingUsers] = useState(new Set());

    useEffect(() => {
        fetchContributors();
    }, []);

    const fetchContributors = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/contributors');
            const data = await response.json();
            
            if (response.ok) {
                setContributors(data.contributors || []);
            } else {
                setError(data.error || 'Failed to fetch contributors');
            }
        } catch (err) {
            setError('Failed to fetch contributors');
            console.error('Error fetching contributors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentStatusChange = async (userId, songId, paid) => {
        const paymentKey = `${userId}-${songId}`;
        setUpdatingPayments(prev => new Set(prev).add(paymentKey));

        try {
            const response = await fetch('/api/contributors/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, songId, paid }),
            });

            if (response.ok) {
                // Update local state
                setContributors(prev => prev.map(contributor => {
                    if (contributor.user_id === userId) {
                        return {
                            ...contributor,
                            songs: contributor.songs.map(song => {
                                if (song.id === songId) {
                                    return { ...song, paid };
                                }
                                return song;
                            })
                        };
                    }
                    return contributor;
                }));
            } else {
                console.error('Failed to update payment status');
                // You might want to show an error message to the user
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
        } finally {
            setUpdatingPayments(prev => {
                const newSet = new Set(prev);
                newSet.delete(paymentKey);
                return newSet;
            });
        }
    };

    const handleMarkAllAsPaid = async (userId) => {
        setBulkUpdatingUsers(prev => new Set(prev).add(userId));

        try {
            const response = await fetch('/api/contributors/bulk-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                // Update local state - mark all unpaid songs as paid
                setContributors(prev => prev.map(contributor => {
                    if (contributor.user_id === userId) {
                        return {
                            ...contributor,
                            songs: contributor.songs.map(song => ({
                                ...song,
                                paid: true,
                                payment_updated_at: new Date().toISOString()
                            }))
                        };
                    }
                    return contributor;
                }));
            } else {
                console.error('Failed to update bulk payment status');
                // You might want to show an error message to the user
            }
        } catch (error) {
            console.error('Error updating bulk payment status:', error);
        } finally {
            setBulkUpdatingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ka-GE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const toggleContributor = (userId) => {
        setExpandedContributors(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const isExpanded = (userId) => expandedContributors.has(userId);
    const isUpdatingPayment = (userId, songId) => updatingPayments.has(`${userId}-${songId}`);
    const isBulkUpdating = (userId) => bulkUpdatingUsers.has(userId);
    const hasUnpaidSongs = (contributor) => contributor.songs && contributor.songs.some(song => !song.paid);

    if (loading) {
        return (
            <>
                <Head>
                    <title>{`${lang.contributors.title} - ${lang._guitar_chords}`}</title>
                    <meta name="description" content={lang.contributors.meta_description} />
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>
                <Header />
                <div className="page_container">
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-300 text-lg">{lang.contributors.loading}</p>
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
                <title>{`${lang.contributors.title} - ${lang._guitar_chords}`}</title>
                <meta name="description" content={lang.contributors.meta_description} />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <Header />
            <div className="page_container">
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {lang.contributors.title}
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                            {lang.contributors.page_description}
                        </p>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-center">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Contributors List */}
                    {contributors.length === 0 && !error ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">{lang.contributors.no_contributors}</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {contributors.map((contributor, index) => (
                                <div 
                                    key={contributor.user_id}
                                    className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 shadow-xl backdrop-blur-sm overflow-hidden"
                                >
                                    {/* Contributor Header - Clickable */}
                                    <div 
                                        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-slate-700/50 cursor-pointer hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-200"
                                        onClick={() => toggleContributor(contributor.user_id)}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {contributor.user_id ? contributor.user_id.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-semibold text-white break-all font-mono">
                                                        {contributor.user_id || 'Unknown User'}
                                                        {contributor.masked_email && (
                                                            <span className="text-gray-400 text-base font-normal ml-2">
                                                                ({contributor.masked_email})
                                                            </span>
                                                        )}
                                                    </h2>
                                                    <p className="text-gray-400 text-sm">
                                                        {lang.contributors.user_id}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {/* Mark All as Paid Button */}
                                                {hasUnpaidSongs(contributor) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAllAsPaid(contributor.user_id);
                                                        }}
                                                        disabled={isBulkUpdating(contributor.user_id)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isBulkUpdating(contributor.user_id) ? (
                                                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                        <span className="text-green-400 text-sm font-medium whitespace-nowrap">
                                                            {isBulkUpdating(contributor.user_id) ? 'Updating...' : 'Mark All Paid'}
                                                        </span>
                                                    </button>
                                                )}
                                                <div className="text-right">
                                                    <div className="bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-500/30">
                                                        <span className="text-2xl font-bold text-blue-400">
                                                            {contributor.songs_count}
                                                        </span>
                                                        <p className="text-gray-400 text-sm">
                                                            {lang.contributors.songs_count}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Expand/Collapse Icon */}
                                                <div className="flex-shrink-0">
                                                    <svg 
                                                        className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isExpanded(contributor.user_id) ? 'rotate-180' : ''}`}
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Songs List - Collapsible */}
                                    {isExpanded(contributor.user_id) && (
                                        <div className="p-6 animate-fadeIn">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                </svg>
                                                {lang.contributors.uploaded_songs}
                                            </h3>
                                            
                                            <div className="flex flex-col gap-3">
                                                {contributor.songs && contributor.songs.map((song) => (
                                                    <div
                                                        key={song.id}
                                                        className="w-full group p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg border border-slate-600/30 transition-all duration-300"
                                                    >
                                                        <div className="flex items-start justify-between gap-3 mb-3">
                                                                                                                                                                                                                                         <div className="flex-1 min-w-0">
                                                            <a
                                                                href={`/resource/${song.notation_format}/${song.url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block hover:text-blue-400 transition-colors duration-200"
                                                            >
                                                                <h4 className="font-medium text-white hover:text-blue-400 transition-colors duration-200 truncate">
                                                                    {song.name}
                                                                </h4>
                                                            </a>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {lang.contributors.uploaded_at}: {formatDate(song.created_at)}
                                                            </p>
                                                        </div>
                                                            <div className="flex-shrink-0">
                                                                <a
                                                                    href={`/resource/${song.notation_format}/${song.url}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <svg className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                    </svg>
                                                                </a>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Payment Status */}
                                                        <div className="pt-3 border-t border-slate-600/30 space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={song.paid}
                                                                        onChange={(e) => handlePaymentStatusChange(contributor.user_id, song.id, e.target.checked)}
                                                                        disabled={isUpdatingPayment(contributor.user_id, song.id)}
                                                                        className="w-4 h-4 text-green-600 bg-slate-700 border-slate-500 rounded focus:ring-green-500 focus:ring-2"
                                                                    />
                                                                    <span className={`text-sm font-medium ${song.paid ? 'text-green-400' : 'text-gray-400'}`}>
                                                                        {song.paid ? 'Paid' : 'Unpaid'}
                                                                    </span>
                                                                    {isUpdatingPayment(contributor.user_id, song.id) && (
                                                                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-1"></div>
                                                                    )}
                                                                </label>
                                                                
                                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                                                                    song.notation_format === 'guitar_chord' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                                    song.notation_format === 'fanduri_chord' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                                    song.notation_format === 'song_text' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                                                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                                                }`}>
                                                                    {getNotation(song.notation_format)?.page_title || song.notation_format}
                                                                </span>
                                                            </div>
                                                            
                                                            {song.payment_updated_at && (
                                                                <div className="text-xs text-gray-500">
                                                                    Updated: {formatDate(song.payment_updated_at)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
} 