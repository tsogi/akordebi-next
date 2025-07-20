import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/utils/useUser';
import { useLanguage } from '@/context/LanguageContext';
import Alert from '@/components/Alert';
import { UserPlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PremiumSubscriptions() {
    const { user, setAuthOpenedFrom } = useUser();
    const { lang } = useLanguage();
    const [formData, setFormData] = useState({
        userEmail: '',
        paidUntil: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Check if user is authorized
    const isAuthorized = user && process.env.NEXT_PUBLIC_CAN_DELETE_SONG && 
        process.env.NEXT_PUBLIC_CAN_DELETE_SONG.includes(user.email);

    useEffect(() => {
        if (!user) {
            setAuthOpenedFrom('admin-subscriptions');
        }
    }, [user, setAuthOpenedFrom]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDateForInput = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().slice(0, 16);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.userEmail || !formData.paidUntil) {
            setErrorMessage(lang.admin.error_required_fields);
            setShowError(true);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/admin/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: formData.userEmail,
                    paidUntil: formData.paidUntil
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update subscription');
            }

            setShowSuccess(true);
            setFormData({ userEmail: '', paidUntil: '' });
        } catch (error) {
            console.error('Error updating subscription:', error);
            setErrorMessage(error.message);
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // If user is not logged in or not authorized, show appropriate message
    if (!user) {
        return (
            <>
                <Head>
                    <title>{lang.admin.premium_management}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-md mx-auto bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                            <div className="text-center">
                                <UserPlusIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
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
                    <title>{lang.admin.premium_management}</title>
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
                <title>{lang.admin.premium_management}</title>
                <meta name="description" content="Admin panel for managing premium subscriptions" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="container mx-auto px-4 py-8 sm:py-12">
                    <div className="max-w-lg mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                                <UserPlusIcon className="w-8 h-8 text-blue-400" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                {lang.admin.premium_management}
                            </h1>
                            <p className="text-slate-400 text-sm sm:text-base">
                                Manually add users to premium subscription
                            </p>
                        </div>

                        {/* Form */}
                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* User Email */}
                                <div className="space-y-2">
                                    <label htmlFor="userEmail" className="block text-sm font-medium text-slate-300">
                                        {lang.admin.user_email}
                                    </label>
                                    <input
                                        type="email"
                                        id="userEmail"
                                        name="userEmail"
                                        value={formData.userEmail}
                                        onChange={handleInputChange}
                                        placeholder={lang.admin.user_email_placeholder}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {/* Paid Until Date */}
                                <div className="space-y-2">
                                    <label htmlFor="paidUntil" className="block text-sm font-medium text-slate-300">
                                        {lang.admin.paid_until}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="paidUntil"
                                        name="paidUntil"
                                        value={formData.paidUntil}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{lang.admin.updating}</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5" />
                                            <span>{lang.admin.update_subscription}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-sm text-amber-200">
                                    <p className="font-medium mb-1">Note:</p>
                                    <p>This will execute the following query:</p>
                                    <code className="block mt-2 p-2 bg-slate-800/50 rounded text-xs text-amber-100 break-all">
                                        UPDATE users SET payment_date = "1993-01-19 00:00:00", payment_confirmed = 1, paid_until = "[selected_date]" WHERE email = "[entered_email]";
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Success Alert */}
            <Alert 
                open={showSuccess} 
                setOpen={setShowSuccess} 
                message={lang.admin.success_message} 
                duration={5}
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