'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Eye, EyeOff, MapPin, CheckCircle, Users, TrendingUp, Shield } from 'lucide-react';

// ── Left Branding Panel ───────────────────────────────────────────────────────
function BrandingPanel() {
  const t = useTranslations('auth.login.branding');

  const features = [
    t('features.rcic'),
    t('features.programs'),
    t('features.tracking'),
    t('features.bilingual'),
  ];

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 min-h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2d4a]/90 via-[#1b3d6e]/80 to-[#0d3d3a]/75" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-10">

        {/* Top badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 w-fit">
          <MapPin size={13} className="text-white/80" />
          <span className="text-white/90 text-xs font-medium">{t('badge')}</span>
        </div>

        {/* Middle content */}
        <div className="flex flex-col gap-8">
          {/* Heading */}
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-snug">
              {t('title')}
            </h1>
            <p className="mt-4 text-white/65 text-sm leading-relaxed max-w-sm">
              {t('subtitle')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 border border-white/15 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">5,000+</p>
                <p className="text-white/55 text-xs mt-0.5">{t('stat1')}</p>
              </div>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp size={16} className="text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">98%</p>
                <p className="text-white/55 text-xs mt-0.5">{t('stat2')}</p>
              </div>
            </div>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-white/75 text-sm">
                <CheckCircle size={15} className="text-green-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom ICCRC badge */}
        <div className="flex items-center gap-4 bg-white/10 border border-white/15 rounded-xl p-4">
          <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{t('certTitle')}</p>
            <p className="text-white/55 text-xs mt-0.5">{t('certSub')}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Login Form Panel ──────────────────────────────────────────────────────────
function LoginForm() {
  const t = useTranslations('auth.login.form');
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full lg:w-1/2 min-h-screen bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo (mobile only) */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-9 h-9">
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="47" fill="#1b3d6e" />
              <ellipse cx="50" cy="50" rx="22" ry="47" fill="none" stroke="#4a7fa5" strokeWidth="1.5" />
              <ellipse cx="50" cy="50" rx="38" ry="47" fill="none" stroke="#4a7fa5" strokeWidth="1.5" />
              <line x1="3" y1="50" x2="97" y2="50" stroke="#4a7fa5" strokeWidth="1.5" />
              <line x1="9" y1="28" x2="91" y2="28" stroke="#4a7fa5" strokeWidth="1.2" />
              <line x1="9" y1="72" x2="91" y2="72" stroke="#4a7fa5" strokeWidth="1.2" />
              <path d="M36 20 Q44 15 54 18 Q62 22 63 32 Q66 42 61 52 Q59 60 63 68 Q66 76 59 83 Q52 88 44 83 Q37 78 36 68 Q31 58 34 48 Q30 40 32 30 Z" fill="#2a5f8a" />
              <path d="M3 50 Q17 40 28 50 Q17 60 3 50Z" fill="#c9a84c" />
              <path d="M97 50 Q83 40 72 50 Q83 60 97 50Z" fill="#c9a84c" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-[#1b3d6e] font-bold text-sm tracking-widest uppercase">Larouss</span>
            <span className="block text-[#1b3d6e] font-medium text-[10px] tracking-widest uppercase">Immigration</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h2>
          <p className="mt-2 text-gray-500 text-sm">{t('subtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('password')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/30 focus:border-[#1b3d6e] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#1b3d6e] focus:ring-[#1b3d6e]/30 accent-[#1b3d6e]"
              />
              <span className="text-sm text-gray-600">{t('rememberMe')}</span>
            </label>
            <Link
              href={`/${locale}/forgot-password`}
              className="text-sm text-[#1b3d6e] font-medium hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b3d6e] hover:bg-[#152f56] disabled:opacity-70 text-white text-sm font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {t('signingIn')}
              </>
            ) : t('signIn')}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">{t('or')}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500">
            {t('noAccount')}{' '}
            <Link href={`/${locale}/signup`} className="text-[#1b3d6e] font-semibold hover:underline">
              {t('createAccount')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <BrandingPanel />
      <LoginForm />
    </div>
  );
}