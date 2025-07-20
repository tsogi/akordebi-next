import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/utils/supabase-client';
import { useRouter } from 'next/router';
import SubscriptionPrompt from '@/components/SubscriptionPrompt';
import Link from 'next/link';
import { 
    UserCircleIcon, 
    CreditCardIcon,
    ArrowRightOnRectangleIcon,
    CheckCircleIcon,
    ClockIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function UserProfile() {
    const { user, isPremium, setAuthOpenedFrom } = useUser();
    const { lang } = useLanguage();
    const router = useRouter();
    const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        if (!user) {
            setAuthOpenedFrom('profile');
        }
    }, [user, setAuthOpenedFrom]);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Sign out error:', error);
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            setIsSigningOut(false);
        }
    };

    const handleUpgradeClick = () => {
        setShowSubscriptionPrompt(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatMemberSince = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('ka-GE', options);
    };

    const getSubscriptionStatus = () => {
        if (!user?.paid_until) return { isPremium: false, isExpired: false };
        const now = new Date();
        const paidUntil = new Date(user.paid_until);
        return {
            isPremium: paidUntil > now,
            isExpired: paidUntil <= now,
            date: paidUntil
        };
    };

    const subscriptionStatus = getSubscriptionStatus();

    // If user is not logged in, show login prompt
    if (!user) {
        return (
            <>
                <Head>
                    <title>{lang.user_profile.title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-md mx-auto bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                            <div className="text-center">
                                <UserCircleIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
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

    const customUnauthenticatedText = 'პრემიუმ პაკეტის გასააქტიურებლად გაიარეთ მარტივი Gmail ავტორიზაცია 1 კლიკით და შემდეგ ხელახლა დააჭირეთ გააქტიურებას';
    const customAuthenticatedText = 'გადაიხადეთ ნებისმიერი ბანკის ბარათით ან გადმორიცხეთ თანხა';

    return (
        <>
            <Head>
                <title>{lang.user_profile.title}</title>
                <meta name="description" content="User profile and subscription management" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="container mx-auto px-4 py-8 sm:py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => router.back()}
                                    className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-colors"
                                >
                                    <ArrowLeftIcon className="w-5 h-5 text-slate-400" />
                                </button>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                        {lang.user_profile.title}
                                    </h1>
                                    <p className="text-slate-400 text-sm sm:text-base mt-1">
                                        {lang.user_profile.signed_in_as} {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Account Information */}
                            <div className="lg:col-span-1">
                                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                    <h2 className="text-xl font-semibold text-white mb-6">
                                        {lang.user_profile.account_info}
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-slate-300 mb-2">
                                                {lang.user_profile.gmail_account}
                                            </h3>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center">
                                                    <UserCircleIcon className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.email}</p>
                                                    {user.user_metadata?.full_name && (
                                                        <p className="text-slate-400 text-sm">{user.user_metadata.full_name}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* {user.created_at && (
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-300 mb-2">
                                                    {lang.user_profile.member_since}
                                                </h3>
                                                <p className="text-slate-300">{formatMemberSince(user.created_at)}</p>
                                            </div>
                                        )} */}

                                        <div className="pt-4">
                                            <button
                                                onClick={handleSignOut}
                                                disabled={isSigningOut}
                                                className="w-full flex items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-600/50 py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
                                            >
                                                {isSigningOut ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400"></div>
                                                        <span>Signing out...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                                        <span>{lang.user_profile.sign_out}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Status */}
                            <div className="lg:col-span-2">
                                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                                    <h2 className="text-xl font-semibold text-white mb-6">
                                        {lang.user_profile.subscription_status}
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Current Plan */}
                                        <div className={`relative rounded-xl p-6 border ${
                                            subscriptionStatus.isPremium 
                                                ? 'bg-blue-50/5 border-blue-500/30' 
                                                : 'bg-slate-700/30 border-slate-600/50'
                                        }`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-white">
                                                    {subscriptionStatus.isPremium ? lang.user_profile.premium_plan : lang.user_profile.free_plan}
                                                </h3>
                                                {subscriptionStatus.isPremium ? (
                                                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                                                ) : (
                                                    <ClockIcon className="w-6 h-6 text-slate-400" />
                                                )}
                                            </div>
                                            
                                            {subscriptionStatus.isPremium ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2 text-green-400 text-sm">
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                        <span>{lang.user_profile.subscription_active}</span>
                                                    </div>
                                                    <p className="text-slate-300 text-sm">
                                                        {lang.user_profile.valid_until}: {formatDate(user.paid_until)}
                                                    </p>
                                                </div>
                                            ) : subscriptionStatus.isExpired ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                        <ClockIcon className="w-4 h-4" />
                                                        <span>{lang.user_profile.subscription_expired}</span>
                                                    </div>
                                                    <p className="text-slate-300 text-sm">
                                                        {lang.user_profile.expired_on}: {formatDate(user.paid_until)}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <p className="text-slate-300 text-sm">
                                                        Basic access to all resources
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Card */}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Subscription Prompt Modal */}
            {showSubscriptionPrompt && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                    onClick={() => setShowSubscriptionPrompt(false)}
                >
                    <div 
                        className="relative w-full max-w-md" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SubscriptionPrompt 
                            unauthenticatedText={customUnauthenticatedText}
                            authenticatedText={customAuthenticatedText}
                            source="profile_page"
                            inModal={true}
                        />
                    </div>
                </div>
            )}
        </>
    );
} 