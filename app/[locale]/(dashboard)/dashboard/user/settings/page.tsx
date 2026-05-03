'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/nextInt/navigation';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { authAPI } from '@/lib/api/auth';
import { usersAPI } from '@/lib/api/users';
import { useAuthStore } from '@/store/authStore';
import {
  ChevronLeft, User, Shield, Bell, Globe,
  Mail, Phone, MapPin, Eye, EyeOff, Save, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
function SaveBtn({ label, onClick, color = 'navy', saving = false }: { label: string; onClick?: () => void; color?: 'navy' | 'green'; saving?: boolean }) {
  const base = color === 'green'
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-[#1b3d6e] hover:bg-[#152f56]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className={`inline-flex items-center gap-2 ${base} text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-70`}
    >
      {saving ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Save size={14} />
      )}
      {label}
    </button>
  );
}

// ── Profile Section ───────────────────────────────────────────────────────────
function ProfileSection() {
  const t = useTranslations('settings.profile');
  const { user, fetchUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        address: (user as any).address || '',
        city: (user as any).city || '',
        province: (user as any).province || '',
        postalCode: (user as any).postalCode || ''
      });
    } else {
      fetchUser();
    }
  }, [user, fetchUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await usersAPI.updateProfile(formData);
      await fetchUser(); // refresh global state
      toast.success(t('save') + ' successful');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard icon={User} iconBg="bg-blue-400" title={t('title')} subtitle={t('subtitle')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('firstName')}>
            <input name="firstName" value={formData.firstName} onChange={handleChange} className={inputCls} />
          </Field>
          <Field label={t('lastName')}>
            <input name="lastName" value={formData.lastName} onChange={handleChange} className={inputCls} />
          </Field>
        </div>

        <Field label={t('email')}>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="email" value={formData.email} onChange={handleChange} readOnly={true} className={`${inputCls} pl-9 bg-gray-50 text-gray-500 cursor-not-allowed`} />
          </div>
        </Field>

        <Field label={t('phone')}>
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="phone" value={formData.phone} onChange={handleChange} className={`${inputCls} pl-9`} placeholder="+1 (555) 123-4567" />
          </div>
        </Field>

        <Field label={t('streetAddress')}>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="address" value={formData.address} onChange={handleChange} className={`${inputCls} pl-9`} placeholder="123 Main Street" />
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label={t('city')}>
            <input name="city" value={formData.city} onChange={handleChange} className={inputCls} placeholder="Toronto" />
          </Field>
          <Field label={t('province')}>
            <input name="province" value={formData.province} onChange={handleChange} className={inputCls} placeholder="ON" />
          </Field>
          <Field label={t('postalCode')}>
            <input name="postalCode" value={formData.postalCode} onChange={handleChange} className={inputCls} placeholder="M5V 3A8" />
          </Field>
        </div>

        <div className="flex justify-end pt-2">
          <SaveBtn label={t('save')} onClick={handleSave} saving={saving} />
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

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const PwdInput = ({
    show, toggle, placeholder, value, onChange
  }: { show: boolean; toggle: () => void; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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

  const handleUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setSaving(true);
      await authAPI.changePassword({ currentPassword, newPassword });
      toast.success(t('update') + ' successful');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard icon={Shield} iconBg="bg-[#1b3d6e]" title={t('title')} subtitle={t('subtitle')}>
      <div className="flex flex-col gap-4">
        <Field label={t('currentPassword')}>
          <PwdInput show={showCurrent} toggle={() => setShowCurrent((v) => !v)} placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </Field>
        <Field label={t('newPassword')}>
          <PwdInput show={showNew} toggle={() => setShowNew((v) => !v)} placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <p className="text-[11px] text-gray-400 mt-1">{t('passwordHint')}</p>
        </Field>
        <Field label={t('confirmPassword')}>
          <PwdInput show={showConfirm} toggle={() => setShowConfirm((v) => !v)} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Field>
        <div className="flex justify-end pt-2">
          <SaveBtn label={t('update')} color="green" onClick={handleUpdate} saving={saving} />
        </div>
      </div>
    </SectionCard>
  );
}

// ── Notifications Section ─────────────────────────────────────────────────────
function NotificationsSection() {
  const t = useTranslations('settings.notifications');
  const { user, fetchUser } = useAuthStore();
  const [emailOn, setEmailOn] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEmailOn((user as any).emailNotifications ?? true);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await usersAPI.updateProfile({ emailNotifications: emailOn });
      await fetchUser();
      toast.success('Preferences saved');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

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
          <SaveBtn label={t('save')} onClick={handleSave} saving={saving} />
        </div>
      </div>
    </SectionCard>
  );
}

// ── Language Section ──────────────────────────────────────────────────────────
function LanguageSection() {
  const t = useTranslations('settings.language');
  const { user, fetchUser } = useAuthStore();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && (user as any).displayLanguage) {
      setLang((user as any).displayLanguage as 'en' | 'fr');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await usersAPI.updateProfile({ displayLanguage: lang });
      await fetchUser();
      toast.success('Language preferences updated.');
      
      // Force reload the page to apply the language change via middleware
      // We check if current path has the lang prefix to replace it, or just reload
      window.location.href = `/${lang}/dashboard/user/settings`;
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update language');
    } finally {
      setSaving(false);
    }
  };

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
          <SaveBtn label={t('save')} onClick={handleSave} saving={saving} />
        </div>
      </div>
    </SectionCard>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const t        = useTranslations('settings');
  const pathname = usePathname();

  return (
    <div className="min-h-screen ">
      <div className="">

        {/* Back link */}
        <Link
          href="/dashboard/user"
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