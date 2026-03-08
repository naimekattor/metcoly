'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  User, Shield, Bell, Settings, Activity, LogOut,
  Mail, Phone, Briefcase, Calendar, MapPin, Building2,
  Lock, Eye, EyeOff, CheckCircle, Clock, UploadCloud, Send, FileText,
  ToggleLeft, ToggleRight,
  ChevronDown,
  DollarSign
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'profile' | 'security' | 'notifications' | 'preferences' | 'activity';

// ── Shared Components ─────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <Icon size={20} className="text-gray-500" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 ml-auto">{subtitle}</p>
    </div>
  );
}

function InputField({ label, type = 'text', placeholder, value, onChange, disabled = false, className = '', name }: {
  label: string; type?: string; placeholder: string; value: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; className?: string; name?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] outline-none transition-all text-sm text-gray-800 disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, className = '', name }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[]; className?: string; name?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          name={name}
          className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] outline-none transition-all text-sm text-gray-800 pr-10"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: () => void; description?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {description && <span className="text-xs text-gray-500 mt-0.5">{description}</span>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-[#1b3d6e]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}


// ── Profile Tab Content ───────────────────────────────────────────────────────
function ProfileTabContent({ t }: { t: any }) {
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phoneNumber: '+1 (416) 555-0123',
    position: 'Senior Immigration Consultant',
    department: 'Case Management',
    employeeID: 'EMP-001',
    dateJoined: '2023-01-15',
    professionalBio: 'Highly experienced immigration consultant with a proven track record in Canadian immigration processes. Specializing in Express Entry, PNP, and family sponsorship applications.',
    streetAddress: '123 Bay Street',
    city: 'Toronto',
    province: 'Ontario',
    postalCode: 'M5J 2R8',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Profile Saved:', formData);
    // In a real app, you would send this data to an API
    alert('Profile information saved!');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <SectionHeader title={t('profile.title')} subtitle={t('profile.subtitle')} icon={User} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
        <InputField label={t('profile.firstName')} placeholder={t('profile.firstName')} value={formData.firstName} onChange={handleChange} name="firstName" />
        <InputField label={t('profile.lastName')} placeholder={t('profile.lastName')} value={formData.lastName} onChange={handleChange} name="lastName" />
        <InputField label={t('profile.email')} type="email" placeholder={t('profile.email')} value={formData.email} onChange={handleChange} name="email" disabled />
        <InputField label={t('profile.phone')} placeholder={t('profile.phone')} value={formData.phoneNumber} onChange={handleChange} name="phoneNumber" />
        <InputField label={t('profile.position')} placeholder={t('profile.position')} value={formData.position} onChange={handleChange} name="position" />
        <SelectField
          label={t('profile.department')}
          value={formData.department}
          onChange={handleChange}
          name="department"
          options={[
            { value: 'Case Management', label: 'Case Management' },
            { value: 'Client Relations', label: 'Client Relations' },
            { value: 'Legal', label: 'Legal' },
            { value: 'Admin', label: 'Admin' },
          ]}
        />
        <InputField label={t('profile.employeeId')} placeholder={t('profile.employeeId')} value={formData.employeeID} onChange={handleChange} name="employeeID" disabled />
        <InputField label={t('profile.dateJoined')} type="date" placeholder={t('profile.dateJoined')} value={formData.dateJoined} onChange={handleChange} name="dateJoined" disabled />

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">{t('profile.bio')}</label>
          <textarea
            rows={3}
            placeholder={t('profile.bioPlaceholder')}
            value={formData.professionalBio}
            onChange={handleChange}
            name="professionalBio"
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] outline-none transition-all text-sm text-gray-800"
          />
        </div>
      </div>

      {/* <SectionHeader title="Office Address" subtitle="Where you prefer to receive mail" icon={MapPin} /> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-8">
        <InputField label="Street Address" placeholder="Street Address" value={formData.streetAddress} onChange={handleChange} name="streetAddress" className="md:col-span-2 lg:col-span-3" />
        <InputField label="City" placeholder="City" value={formData.city} onChange={handleChange} name="city" />
        <SelectField
          label="Province"
          value={formData.province}
          onChange={handleChange}
          name="province"
          options={[
            { value: 'Ontario', label: 'Ontario' },
            { value: 'Quebec', label: 'Quebec' },
            { value: 'Alberta', label: 'Alberta' },
            { value: 'British Columbia', label: 'British Columbia' },
          ]}
        />
        <InputField label="Postal Code" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} name="postalCode" />
      </div> */}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-xl shadow-md hover:bg-[#1b3d6e] transition-colors"
        >
          <CheckCircle size={18} /> {t('profile.save')}
        </button>
      </div>
    </div>
  );
}

// ── Security Tab Content ──────────────────────────────────────────────────────
function SecurityTabContent({ t }: { t: any }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30_minutes'); // e.g., '30_minutes', '1_hour', etc.


  const handlePasswordChange = () => {
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }
    console.log('Password updated', { currentPassword, newPassword });
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Change Password Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <SectionHeader title={t('security.title')} subtitle={t('security.subtitle')} icon={Lock} />

        <div className="grid grid-cols-1 gap-5 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{t('security.currentPassword')}</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder={t('security.currentPassword')}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] outline-none transition-all text-sm text-gray-800 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{t('security.newPassword')}</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder={t('security.newPassword')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] outline-none transition-all text-sm text-gray-800 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('security.passwordHint')}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{t('security.confirmPassword')}</label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                placeholder={t('security.confirmPassword')}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] outline-none transition-all text-sm text-gray-800 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handlePasswordChange}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-xl shadow-md hover:bg-[#1b3d6e] transition-colors"
          >
            <Lock size={18} /> {t('security.update')}
          </button>
        </div>
      </div>

      {/* Security Settings Section */}
      {/* <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <SectionHeader title="Security Settings" subtitle="Manage your account security preferences" icon={Shield} />

        <div className="mb-6">
          <ToggleSwitch
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={twoFactorAuth}
            onChange={() => setTwoFactorAuth((prev) => !prev)}
          />
          <SelectField
            label="Session Timeout"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            options={[
              { value: '15_minutes', label: '15 minutes' },
              { value: '30_minutes', label: '30 minutes' },
              { value: '1_hour', label: '1 hour' },
              { value: 'never', label: 'Never' },
            ]}
          />
          <p className="text-xs text-gray-500 mt-1">Automatically log out after period of inactivity</p>
        </div>
      </div> */}

      {/* Security Recommendations Section */}
      {/* <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <SectionHeader title="Security Recommendations" subtitle="Improve your account security posture" icon={CheckCircle} />
        <ul className="list-disc pl-5 text-sm text-orange-600 space-y-2">
          <li>Enable two-factor authentication for enhanced security</li>
          <li>Use a strong, unique password</li>
          <li>Review your activity log regularly</li>
        </ul>
      </div> */}
    </div>
  );
}

// ── Notifications Tab Content ─────────────────────────────────────────────────
function NotificationsTabContent({ t }: { t: any }) {
  const [notifications, setNotifications] = useState({
    newCaseAssigned: true,
    caseStatusUpdates: true,
    documentUploaded: false,
    paymentReceived: true,
    systemAlerts: true,
    dailyEmailDigest: false,
    smsNotifications: false,
    desktopNotifications: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log('Notification Preferences Saved:', notifications);
    alert('Notification preferences saved!');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <SectionHeader title={t('notifications.title')} subtitle={t('notifications.subtitle')} icon={Bell} />

      <div className="mb-8">
        <h3 className="text-md font-semibold text-gray-800 mb-3">{t('notifications.caseGroup')}</h3>
        <ToggleSwitch
          label={t('notifications.newCase')}
          description={t('notifications.newCaseDesc')}
          checked={notifications.newCaseAssigned}
          onChange={() => handleToggle('newCaseAssigned')}
        />
        <ToggleSwitch
          label={t('notifications.statusUpdate')}
          description={t('notifications.statusUpdateDesc')}
          checked={notifications.caseStatusUpdates}
          onChange={() => handleToggle('caseStatusUpdates')}
        />
        <ToggleSwitch
          label={t('notifications.docUpload')}
          description={t('notifications.docUploadDesc')}
          checked={notifications.documentUploaded}
          onChange={() => handleToggle('documentUploaded')}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-md font-semibold text-gray-800 mb-3">{t('notifications.financeGroup')}</h3>
        <ToggleSwitch
          label={t('notifications.payment')}
          description={t('notifications.paymentDesc')}
          checked={notifications.paymentReceived}
          onChange={() => handleToggle('paymentReceived')}
        />
      </div>

      {/* <div className="mb-8">
        <h3 className="text-md font-semibold text-gray-800 mb-3">System Notifications</h3>
        <ToggleSwitch
          label="System Alerts"
          description="Important system updates and alerts"
          checked={notifications.systemAlerts}
          onChange={() => handleToggle('systemAlerts')}
        />
        <ToggleSwitch
          label="Daily Email Digest"
          description="Daily summary of your activity"
          checked={notifications.dailyEmailDigest}
          onChange={() => handleToggle('dailyEmailDigest')}
        />
      </div> */}

      {/* <div className="mb-8">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Delivery Methods</h3>
        <ToggleSwitch
          label="SMS Notifications"
          description="Receive urgent notifications via SMS"
          checked={notifications.smsNotifications}
          onChange={() => handleToggle('smsNotifications')}
        />
        <ToggleSwitch
          label="Desktop Notifications"
          description="Show desktop notifications"
          checked={notifications.desktopNotifications}
          onChange={() => handleToggle('desktopNotifications')}
        />
      </div> */}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-xl shadow-md hover:bg-[#1b3d6e] transition-colors"
        >
          <CheckCircle size={18} /> {t('notifications.save')}
        </button>
      </div>
    </div>
  );
}

// ── Preferences Tab Content ───────────────────────────────────────────────────
function PreferencesTabContent({ t }: { t: any }) {
  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'Toronto (EST)',
    dateFormat: 'MM/DD/YYYY',
    dashboardLayout: 'Compact',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('System Preferences Saved:', preferences);
    alert('System preferences saved!');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <SectionHeader title={t('preferences.title')} subtitle={t('preferences.subtitle')} icon={Settings} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
        <SelectField
          label={t('preferences.language')}
          value={preferences.language}
          onChange={handleChange}
          name="language"
          options={[
            { value: 'English', label: 'English' },
            { value: 'Spanish', label: 'Spanish' },
            { value: 'French', label: 'French' },
          ]}
        />
        <SelectField
          label={t('preferences.timezone')}
          value={preferences.timezone}
          onChange={handleChange}
          name="timezone"
          options={[
            { value: 'Toronto (EST)', label: 'Toronto (EST)' },
            { value: 'Vancouver (PST)', label: 'Vancouver (PST)' },
            { value: 'London (GMT)', label: 'London (GMT)' },
          ]}
        />
        <SelectField
          label={t('preferences.dateFormat')}
          value={preferences.dateFormat}
          onChange={handleChange}
          name="dateFormat"
          options={[
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
          ]}
        />
        <SelectField
          label={t('preferences.layout')}
          value={preferences.dashboardLayout}
          onChange={handleChange}
          name="dashboardLayout"
          options={[
            { value: 'Compact', label: 'Compact' },
            { value: 'Spacious', label: 'Spacious' },
          ]}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-xl shadow-md hover:bg-[#1b3d6e] transition-colors"
        >
          <CheckCircle size={18} /> {t('preferences.save')}
        </button>
      </div>
    </div>
  );
}

// ── Activity Tab Content ──────────────────────────────────────────────────────
function ActivityTabContent({ t }: { t: any }) {
  const activityLog = [
    { id: 1, type: 'Updated case status', description: 'Case: CASE-2824-1234', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500' },
    { id: 2, type: 'Reviewed documents', description: 'Case: CASE-2824-1235', time: '4 hours ago', icon: FileText, color: 'text-purple-500' },
    { id: 3, type: 'Sent message to client', description: 'Case: CASE-2824-1236', time: '6 hours ago', icon: Send, color: 'text-orange-500' },
    { id: 4, type: 'Approved payment', description: 'Case: CASE-2824-1237', time: '1 day ago', icon: DollarSign, color: 'text-green-500' },
    { id: 5, type: 'Created new case', description: 'Case: CASE-2824-1238', time: '1 day ago', icon: Briefcase, color: 'text-blue-500' },
    { id: 6, type: 'Uploaded client agreement', description: 'Case: CASE-2824-1234', time: '2 days ago', icon: UploadCloud, color: 'text-indigo-500' },
  ];

  const activeSessions = [
    { id: 1, location: 'Toronto, ON', device: 'Chrome on Windows', status: 'Active', lastActive: 'just now' },
    { id: 2, location: 'Mississauga, ON', device: 'Safari on macOS', status: 'Inactive', lastActive: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <SectionHeader title={t('activity.title')} subtitle={t('activity.subtitle')} icon={Activity} />
        <div className="space-y-4">
          {activityLog.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3">
              <activity.icon size={18} className={activity.color} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.type}</p>
                <p className="text-xs text-gray-500">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="text-sm font-medium text-[#1b3d6e] hover:text-blue-700 transition-colors">
            {t('activity.viewAll')}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <SectionHeader title={t('activity.sessions')} subtitle={t('activity.sessionsSubtitle')} icon={Clock} />
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center gap-3">
              <Clock size={18} className="text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {session.location}, {session.device}
                </p>
                <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
              </div>
              <span className={`text-xs font-semibold ${session.status === 'Active' ? 'text-green-500' : 'text-gray-500'}`}>
                {session.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ── Main Admin Profile Page Component ─────────────────────────────────────────
export default function AdminProfilePage() {
  const t = useTranslations('admin.settings');
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTabContent t={t} />;
      case 'security':
        return <SecurityTabContent t={t} />;
      case 'notifications':
        return <NotificationsTabContent t={t} />;
      case 'preferences':
        return <PreferencesTabContent t={t} />;
      case 'activity':
        return <ActivityTabContent t={t} />;
      default:
        return <ProfileTabContent t={t} />;
    }
  };

  return (
    <div className="min-h-screen  ">
      <div className="">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="mt-1 text-gray-500 text-sm">{t('subtitle')}</p>
          </div>
          
        </div>

        {/* User Info Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 shadow-sm">
          <div className="relative w-20 h-20 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-[#1b3d6e] flex items-center justify-center text-white text-3xl font-bold">
              AU
            </div>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 border border-gray-200 shadow-sm hover:bg-gray-50">
              <UploadCloud size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">Admin User</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">Admin</span>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">Active</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">Senior Immigration Consultant</p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail size={15} /> admin@example.com
              </span>
              <span className="flex items-center gap-1">
                <Phone size={15} /> +1 (416) 555-0123
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={15} /> Case Management
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-center sm:text-right">
            <div>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-gray-500">Cases Managed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-xs text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border border-gray-200 rounded-2xl p-1 flex items-center justify-between mb-8 shadow-sm">
          {(['profile', 'security', 'notifications', 'preferences', 'activity'] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl transition-colors ${
                activeTab === tabKey ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tabKey === 'profile' && <User size={18} />}
              {tabKey === 'security' && <Shield size={18} />}
              {tabKey === 'notifications' && <Bell size={18} />}
              {tabKey === 'preferences' && <Settings size={18} />}
              {tabKey === 'activity' && <Activity size={18} />}
              {t(`tabs.${tabKey}`)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderContent()}
      </div>
    </div>
  );
}