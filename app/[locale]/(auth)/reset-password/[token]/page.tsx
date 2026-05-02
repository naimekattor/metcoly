'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/nextInt/navigation';
import { useParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword');
  const { token } = useParams();
  const router = useRouter();
  const { error, success } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      error(t('errors.mismatch'));
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`, {
        password: formData.password,
      });
      setIsSuccess(true);
      success(t('success.title'));
    } catch (err: any) {
      error(err.response?.data?.message || t('errors.invalidToken'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#1b3d6e]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-[#1b3d6e]" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                <p className="mt-2 text-gray-500 text-sm">{t('subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('newPassword')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('confirmPassword')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1b3d6e] hover:bg-[#152f56] disabled:opacity-70 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-[#1b3d6e]/10 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      {t('resetting')}
                    </>
                  ) : t('reset')}
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
                {t('success.message')}
              </p>
              
              <div className="mt-8 pt-8 border-t border-gray-100">
                <Link 
                  href="/login"
                  className="w-full bg-[#1b3d6e] text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 inline-block"
                >
                  {t('success.login')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
