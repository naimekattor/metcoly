'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft, User, Shield, Bell, Globe,
  Mail, Phone, MapPin, Eye, EyeOff, Save,
} from 'lucide-react';

// ── Reusable Input ────────────────────────────────────────────────────────────
function Field({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] transition bg-white';

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[#1b3d6e]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({
  icon: Icon,
  iconBg,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={17} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{title}</p>
          <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

// ── Save Button ───────────────────────────────────────────────────────────────
function SaveBtn({ label, onClick, color = 'navy' }: { label: string; onClick?: () => void; color?: 'navy' | 'green' }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handle = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onClick?.();
  };

  const base = color === 'green'
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-[#1b3d6e] hover:bg-[#152f56]';

  return (
    <button
      type="button"
      onClick={handle}
      disabled={saving}
      className={`inline-flex items-center gap-2 ${base} text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-70`}
    >
      {saving ? (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <Save size={14} />
      )}
      {saved ? '✓ Saved' : label}
    </button>
  );
}

// ── Profile Section ───────────────────────────────────────────────────────────
function ProfileSection() {
  const t = useTranslations('settings.profile');
  return (
    <SectionCard icon={User} iconBg="bg-blue-400" title={t('title')} subtitle={t('subtitle')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('firstName')}>
            <input defaultValue="John" className={inputCls} />
          </Field>
          <Field label={t('lastName')}>
            <input defaultValue="Smith" className={inputCls} />
          </Field>
        </div>

        <Field label={t('email')}>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input defaultValue="abuawad.arman123@gmail.com" className={`${inputCls} pl-9`} />
          </div>
        </Field>

        <Field label={t('phone')}>
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input defaultValue="+1 (555) 123-4567" className={`${inputCls} pl-9`} />
          </div>
        </Field>

        <Field label={t('streetAddress')}>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input defaultValue="123 Main Street, Toronto, ON" className={`${inputCls} pl-9`} />
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label={t('city')}>
            <input defaultValue="Toronto" className={inputCls} />
          </Field>
          <Field label={t('province')}>
            <input defaultValue="Ontario" className={inputCls} />
          </Field>
          <Field label={t('postalCode')}>
            <input defaultValue="M5V 3A8" className={inputCls} />
          </Field>
        </div>

        <div className="flex justify-end pt-2">
          <SaveBtn label={t('save')} />
        </div>
      </div>
    </SectionCard>
  );
}

// ── Security Section ──────────────────────────────────────────────────────────
function SecuritySection() {
  const t = useTranslations('settings.security');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const PwdInput = ({
    show, toggle, placeholder,
  }: { show: boolean; toggle: () => void; placeholder?: string }) => (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        defaultValue="••••••••"
        placeholder={placeholder}
        className={`${inputCls} pr-10`}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );

  return (
    <SectionCard icon={Shield} iconBg="bg-[#1b3d6e]" title={t('title')} subtitle={t('subtitle')}>
      <div className="flex flex-col gap-4">
        <Field label={t('currentPassword')}>
          <PwdInput show={showCurrent} toggle={() => setShowCurrent((v) => !v)} />
        </Field>
        <Field label={t('newPassword')}>
          <PwdInput show={showNew} toggle={() => setShowNew((v) => !v)} />
          <p className="text-[11px] text-gray-400 mt-1">{t('passwordHint')}</p>
        </Field>
        <Field label={t('confirmPassword')}>
          <PwdInput show={showConfirm} toggle={() => setShowConfirm((v) => !v)} />
        </Field>
        <div className="flex justify-end pt-2">
          <SaveBtn label={t('update')} color="green" />
        </div>
      </div>
    </SectionCard>
  );
}

// ── Notifications Section ─────────────────────────────────────────────────────
function NotificationsSection() {
  const t = useTranslations('settings.notifications');
  const [emailOn, setEmailOn] = useState(true);

  return (
    <SectionCard icon={Bell} iconBg="bg-yellow-500" title={t('title')} subtitle={t('subtitle')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">{t('emailLabel')}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('emailDesc')}</p>
          </div>
          <Toggle checked={emailOn} onChange={() => setEmailOn((v) => !v)} />
        </div>
        <div className="flex justify-end pt-2">
          <SaveBtn label={t('save')} />
        </div>
      </div>
    </SectionCard>
  );
}

// ── Language Section ──────────────────────────────────────────────────────────
function LanguageSection() {
  const t = useTranslations('settings.language');
  const [lang, setLang] = useState<'en' | 'fr'>('en');

  return (
    <SectionCard icon={Globe} iconBg="bg-teal-500" title={t('title')} subtitle={t('subtitle')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">{t('label')}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('desc')}</p>
          </div>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
                lang === 'en' ? 'bg-[#1b3d6e] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('fr')}
              className={`px-4 py-2 text-sm font-semibold border-l border-gray-200 transition-colors duration-150 ${
                lang === 'fr' ? 'bg-[#1b3d6e] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Français
            </button>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <SaveBtn label={t('save')} />
        </div>
      </div>
    </SectionCard>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const t        = useTranslations('settings');
  const pathname = usePathname();
  const locale   = pathname?.split('/')[1] || 'en';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Back link */}
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1b3d6e] mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> {t('backToDashboard')}
        </Link>

        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

        {/* Sections */}
        <div className="flex flex-col gap-6">
          <ProfileSection />
          <SecuritySection />
          <NotificationsSection />
          <LanguageSection />
        </div>

      </div>
    </div>
  );
}