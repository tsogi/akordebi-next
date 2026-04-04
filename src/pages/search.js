import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import db from '@/services/data';
import { useLanguage } from '@/context/LanguageContext';
import { getNotation } from '@/utils/notations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT = 8;
const MAX_RESULTS = 5;

const NOTATION_STYLE = {
    guitar_chord:   { label: 'გიტარის აკორდი',   cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    guitar_tab:     { label: 'გიტარის ტაბი',      cls: 'bg-violet-500/20 text-violet-400 border border-violet-500/30' },
    guitar_lesson:  { label: 'გიტარის გაკვეთილი', cls: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
    fanduri_chord:  { label: 'ფანდურის აკორდი',  cls: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    fanduri_lesson: { label: 'ფანდურის გაკვეთილი',cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
    song_text:      { label: 'სიმღერის ტექსტი',  cls: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    karaoke:        { label: 'კარაოკე',           cls: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' },
};

function loadRecent() {
    try {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
}

function saveRecent(term, current) {
    try {
        const updated = [term, ...current.filter(s => s !== term)].slice(0, MAX_RECENT);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        return updated;
    } catch { return current; }
}

export default function SearchPage() {
    const { lang } = useLanguage();
    const inputRef = useRef(null);

    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        setRecentSearches(loadRecent());
        // Only auto-focus on desktop — on mobile it triggers iOS zoom
        if (window.innerWidth > 768) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, []);

    const handleSearch = useCallback(async (term) => {
        const query = (term ?? searchText).trim();
        if (!query) return;

        setIsSearching(true);
        setHasSearched(true);
        setRecentSearches(prev => saveRecent(query, prev));

        try {
            const response = await db.searchSongs(query);
            setSearchResults(response.status === 'ok' ? response.data.slice(0, MAX_RESULTS) : []);
        } catch {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [searchText]);

    function handleClear() {
        setSearchText('');
        setSearchResults([]);
        setHasSearched(false);
        inputRef.current?.focus();
    }

    function getSongUrl(song) {
        const notation = getNotation(song.notation_format);
        return notation ? `/resource/${notation.code}/${song.url}` : '/';
    }

    return (
        <>
            <Head>
                <title>ძებნა · akordebi.ge</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>

            <Header />

            <div className="page_container min-h-[80vh] flex flex-col pb-24">

                {/* ── Search bar ── centered vertically when empty */}
                <div className={`w-full max-w-xl mx-auto px-4 ${hasSearched || recentSearches.length > 0 ? 'pt-6' : 'mt-[120px]'}`}>
                    <p className="text-slate-400 text-sm font-semibold text-center mb-4 font-[Noto_Sans_Georgian]">
                        {lang._searchText || 'მოძებნეთ სიმღერა'}
                    </p>
                    <div className="flex gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-slate-600 focus-within:border-blue-500 rounded-xl px-4 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                className="flex-1 h-12 bg-transparent text-white placeholder-slate-500 focus:outline-none font-[Noto_Sans_Georgian]"
                                style={{ fontSize: '16px' }}
                                placeholder="სიმღერა, ავტორი..."
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                            />
                            {searchText && (
                                <button onClick={handleClear} className="text-slate-500 hover:text-slate-300 flex-shrink-0 transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => handleSearch()}
                            disabled={!searchText.trim() || isSearching}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-5 rounded-xl transition-colors font-[Noto_Sans_Georgian] flex-shrink-0"
                        >
                            {lang._search || 'ძებნა'}
                        </button>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="w-full max-w-xl mx-auto px-4 mt-4 flex-1">

                    {/* Loading */}
                    {isSearching && (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-[3px] border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Recent searches */}
                    {!isSearching && !hasSearched && recentSearches.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-[Noto_Sans_Georgian]">ბოლო ძებნები</span>
                                <button
                                    onClick={() => {
                                        try { localStorage.removeItem(RECENT_SEARCHES_KEY); } catch {}
                                        setRecentSearches([]);
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300 font-[Noto_Sans_Georgian]"
                                >
                                    გასუფთავება
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {recentSearches.map((term, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setSearchText(term); handleSearch(term); }}
                                        className="flex items-center gap-3 text-left px-4 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl hover:border-slate-600/60 transition-colors"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 flex-shrink-0">
                                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                        </svg>
                                        <span className="flex-1 text-sm text-slate-300 font-[Noto_Sans_Georgian]">{term}</span>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                                            <polyline points="9 18 15 12 9 6"/>
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No results */}
                    {!isSearching && hasSearched && searchResults.length === 0 && (
                        <div className="text-center py-12">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 mx-auto mb-4">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <p className="text-slate-500 font-[Noto_Sans_Georgian]">შედეგები ვერ მოიძებნა</p>
                        </div>
                    )}

                    {/* Results */}
                    {!isSearching && searchResults.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-500 font-[Noto_Sans_Georgian] mb-3">
                                მოიძებნა {searchResults.length} შედეგი
                            </p>
                            <div className="flex flex-col gap-3">
                                {searchResults.map(song => {
                                    const ns = NOTATION_STYLE[song.notation_format] || {
                                        label: getNotation(song.notation_format)?.page_title || song.notation_format,
                                        cls: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
                                    };
                                    return (
                                        <Link
                                            key={`${song.id}-${song.notation_format}`}
                                            href={getSongUrl(song)}
                                            className="group p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 shadow-xl backdrop-blur-sm hover:border-slate-600/60 transition-all duration-200 flex items-center gap-4"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-white text-sm leading-snug truncate font-[Noto_Sans_Georgian] group-hover:text-blue-300 transition-colors">
                                                    {song.name}
                                                </h4>
                                                {song.authors?.length > 0 && (
                                                    <p className="text-xs text-slate-400 mt-1 truncate font-[Noto_Sans_Georgian]">
                                                        {song.authors.join(', ')}
                                                    </p>
                                                )}
                                                <span className={`inline-flex items-center mt-2 px-2 py-0.5 rounded text-[11px] font-semibold font-[Noto_Sans_Georgian] ${ns.cls}`}>
                                                    {ns.label}
                                                </span>
                                            </div>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-hover:text-blue-400 flex-shrink-0 transition-colors">
                                                <polyline points="9 18 15 12 9 6"/>
                                            </svg>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
