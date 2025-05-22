import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Head from 'next/head';
import Image from 'next/image';

export default function ChordsLibrary() {
    const { lang } = useLanguage();
    const [activeTab, setActiveTab] = useState('guitar');
    const [chords, setChords] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setChords([]); // Clear previous chords
        setLoading(true); // Reset loading state
    };

    useEffect(() => {
        const fetchChords = async () => {
            try {
                const response = await fetch(`/api/chords?type=${activeTab}`);
                const data = await response.json();
                setChords(data);
            } catch (error) {
                console.error('Error fetching chords:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChords();
    }, [activeTab]);

    return (
        <>
            <Head>
                <title>{lang.chords_library.title}</title>
                <meta name="description" content={lang.chords_library.title} />
            </Head>

            <main className="min-h-screen bg-gray-900 text-white p-4">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
                    {lang.chords_library.title}
                </h1>

                {/* Tab Switch */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-lg bg-gray-800 p-1">
                        <button
                            onClick={() => handleTabChange('guitar')}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                activeTab === 'guitar'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {lang.chords_library.guitar}
                        </button>
                        <button
                            onClick={() => handleTabChange('fanduri')}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                activeTab === 'fanduri'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {lang.chords_library.fanduri}
                        </button>
                    </div>
                </div>

                {/* Chords Grid */}
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : chords.length === 0 ? (
                    <p className="text-center text-gray-400">{lang.chords_library.no_chords}</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {chords.map((chord) => (
                            <div
                                key={chord}
                                className="bg-gray-800 rounded-lg p-4 flex flex-col items-center hover:bg-gray-700 transition-colors"
                            >
                                <div className="relative w-full aspect-square mb-2">
                                    <Image
                                        src={`/chords/${activeTab}/${chord}`}
                                        alt={chord.replace('.png', '')}
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                                <span className="text-sm text-gray-300">
                                    {chord.replace('.png', '')}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
} 