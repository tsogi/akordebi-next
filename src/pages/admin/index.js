import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { 
    UserGroupIcon, 
    CreditCardIcon, 
    ShieldCheckIcon,
    ChevronRightIcon,
    ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const { user, setAuthOpenedFrom } = useUser();
    const { lang } = useLanguage();

    // Check if user is authorized
    const isAuthorized = user && process.env.NEXT_PUBLIC_CAN_DELETE_SONG && 
        process.env.NEXT_PUBLIC_CAN_DELETE_SONG.includes(user.email);

    useEffect(() => {
        if (!user) {
            setAuthOpenedFrom('admin-dashboard');
        }
    }, [user, setAuthOpenedFrom]);

    // If user is not logged in or not authorized, show appropriate message
    if (!user) {
        return (
            <>
                <Head>
                    <title>Admin Panel</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-md mx-auto bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                            <div className="text-center">
                                <ShieldCheckIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
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
                    <title>Admin Panel</title>
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
                                    {lang.admin?.error_not_authorized || "Not Authorized"}
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
                <title>Admin Panel</title>
                <meta name="description" content="Admin dashboard for site management" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="container mx-auto px-4 py-8 sm:py-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                                <ShieldCheckIcon className="w-8 h-8 text-purple-400" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                Admin Panel
                            </h1>
                            <p className="text-slate-400 text-sm sm:text-base">
                                Site administration and management tools
                            </p>
                        </div>

                        {/* Admin Links Grid */}
                        <div className="grid gap-4 sm:gap-6">
                            {/* Contributors Link */}
                            <Link href="/contributors" className="group">
                                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-800/90">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                                    <UserGroupIcon className="w-6 h-6 text-blue-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                                    კონტრიბუციები
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    View and manage contributors and their uploaded content
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>

                            {/* Premium Subscriptions Link */}
                            <Link href="/admin/premium-subscriptions" className="group">
                                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-800/90">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                                    <CreditCardIcon className="w-6 h-6 text-green-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
                                                    გამოწერები
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    Manually manage premium subscriptions for users
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>

                            {/* Reports Link */}
                            <Link href="/admin/reports" className="group">
                                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-800/90">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                                    <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                                                    რეპორტები
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    Manage user-submitted reports and issues
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* User Info */}
                        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <div className="text-sm text-slate-300">
                                    Logged in as: <span className="text-white font-medium">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
} 