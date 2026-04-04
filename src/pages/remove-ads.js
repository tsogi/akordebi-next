import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/utils/supabase-client';

export default function RemoveAdsPage() {
    const { user, isPremium, setAuthOpenedFrom } = useUser();
    const { lang } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handlePay() {
        if (!user) {
            setAuthOpenedFrom('remove_ads');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            if (typeof window !== 'undefined') {
                localStorage.setItem('return_page_url', window.location.href);
            }
            const res = await fetch('/api/payment/initiate-bog-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'გადახდის დაწყება ვერ მოხერხდა');
            if (data.redirectUrl) window.location.href = data.redirectUrl;
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>რეკლამის გათიშვა · akordebi.ge</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>

            <Header />

            <main className="min-h-[80vh] flex items-center justify-center px-4 pb-24">
                <div className="w-full max-w-sm">

                    {isPremium ? (
                        /* ── Already subscribed ── */
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2 font-[Noto_Sans_Georgian]">
                                რეკლამა გათიშულია
                            </h1>
                            <p className="text-slate-400 font-[Noto_Sans_Georgian] text-sm mb-6">
                                თქვენ უკვე ხართ Premium მომხმარებელი. რეკლამა არ გამოჩნდება.
                            </p>
                            <Link href="/profile" className="inline-block px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-sm font-[Noto_Sans_Georgian] hover:border-slate-600 transition-colors">
                                პროფილის ნახვა
                            </Link>
                        </div>
                    ) : (
                        /* ── Upsell card ── */
                        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Top accent */}
                            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                            <div className="p-7">
                                {/* Icon + headline */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white font-[Noto_Sans_Georgian] leading-tight">
                                            რეკლამების გათიშვა
                                        </h1>
                                        <p className="text-slate-400 text-xs mxedruli">თუ რეკლამები გიშლით ხელს საიტის გამოყენებაში, შეგიძლიათ გამოიწეროთ akordebi.ge პრემიუმ პაკეტი</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 mb-5 text-center">
                                    <div className="text-4xl font-bold text-blue-400">
                                        {process.env.NEXT_PUBLIC_MONTHLY_COST}<span className="text-2xl">₾</span>
                                    </div>
                                    <div className="text-slate-400 text-sm font-[Noto_Sans_Georgian] mt-1">თვეში</div>
                                </div>

                                {/* Benefits */}
                                <ul className="space-y-3 mb-5">
                                    {[
                                        'ყველა რეკლამა გაქრება',
                                        'მუშაობს ყველა მოწყობილობაზე',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            <span className="text-slate-300 text-sm font-[Noto_Sans_Georgian]">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Bank card notice */}
                                <div className="flex items-center gap-2 bg-slate-700/40 border border-slate-600/40 rounded-lg px-3 py-2 mb-5">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                        <line x1="1" y1="10" x2="23" y2="10" />
                                    </svg>
                                    <span className="text-slate-400 text-xs font-[Noto_Sans_Georgian]">
                                        გადახდა ნებისმიერი ქართული ბანკის ბარათით
                                    </span>
                                </div>

                                {/* CTA */}
                                {user ? (
                                    <button
                                        onClick={handlePay}
                                        disabled={isLoading}
                                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all font-[Noto_Sans_Georgian] text-sm shadow-lg"
                                    >
                                        {isLoading ? 'გთხოვთ მოიცადოთ...' : 'ბარათით გადახდა'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setAuthOpenedFrom('remove_ads')}
                                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all font-[Noto_Sans_Georgian] text-sm shadow-lg"
                                    >
                                        შესვლა და გადახდა
                                    </button>
                                )}

                                {error && (
                                    <p className="mt-3 text-red-400 text-xs text-center font-[Noto_Sans_Georgian]">
                                        შეცდომა: {error}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
