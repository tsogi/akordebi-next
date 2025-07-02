import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function Contributors() {
    const { lang } = useLanguage();
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedContributors, setExpandedContributors] = useState(new Set());

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

    const toggleContributor = (email) => {
        setExpandedContributors(prev => {
            const newSet = new Set(prev);
            if (newSet.has(email)) {
                newSet.delete(email);
            } else {
                newSet.add(email);
            }
            return newSet;
        });
    };

    const isExpanded = (email) => expandedContributors.has(email);

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
                                    key={contributor.email}
                                    className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 shadow-xl backdrop-blur-sm overflow-hidden"
                                >
                                    {/* Contributor Header - Clickable */}
                                    <div 
                                        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-slate-700/50 cursor-pointer hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-200"
                                        onClick={() => toggleContributor(contributor.email)}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {contributor.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-semibold text-white break-all">
                                                        {contributor.email}
                                                    </h2>
                                                    <p className="text-gray-400 text-sm">
                                                        {lang.contributors.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
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
                                                        className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isExpanded(contributor.email) ? 'rotate-180' : ''}`}
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
                                    {isExpanded(contributor.email) && (
                                        <div className="p-6 animate-fadeIn">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                </svg>
                                                {lang.contributors.uploaded_songs}
                                            </h3>
                                            
                                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                {contributor.songs && contributor.songs.map((song) => (
                                                    <a
                                                        key={song.id}
                                                        href={`/resource/${song.notation_format}/${song.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg border border-slate-600/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02]"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                                                                            <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors duration-200 truncate">
                                                                {song.name}
                                                            </h4>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </a>
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