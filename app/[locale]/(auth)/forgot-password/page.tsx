'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/nextInt/navigation';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const { error, success } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email });
      setIsSubmitted(true);
      success(t('success.title'));
    } catch (err: any) {
      error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1b3d6e] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('backToLogin')}
        </Link>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#1b3d6e]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-[#1b3d6e]" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                <p className="mt-2 text-gray-500 text-sm">{t('subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1b3d6e] hover:bg-[#152f56] disabled:opacity-70 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-[#1b3d6e]/10 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      {t('sending')}
                    </>
                  ) : t('sendLink')}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('success.title')}</h1>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                {t('success.message', { email })}
              </p>
              
              <div className="mt-8 pt-8 border-t border-gray-100">
                <Link 
                  href="/login"
                  className="text-sm font-semibold text-[#1b3d6e] hover:underline"
                >
                  {t('backToLogin')}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Support Link */}
        <p className="text-center mt-8 text-sm text-gray-500">
          Need help? <Link href="/contact" className="text-[#1b3d6e] font-medium hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}
