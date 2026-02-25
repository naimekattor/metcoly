'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  UserCheck,
  Lock,
  Activity,
  MessageSquare,
  CreditCard,
  User,
} from 'lucide-react';

// ── Sub-component: Case Dashboard Card ────────────────────────────────────────
function CaseDashboardCard() {
  const t = useTranslations('landing.platform');
  const items = [
    { label: t('caseItems.workPermit'), status: t('caseItems.inReview'), statusColor: 'text-orange-500' },
    { label: t('caseItems.docUpload'), status: t('caseItems.complete'), statusColor: 'text-green-600' },
    { label: t('caseItems.paymentStatus'), status: t('caseItems.paid'), statusColor: 'text-green-600' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-[#1b3d6e] px-5 py-4 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">{t('dashboardTitle')}</span>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between px-5 py-4">
            <span className="text-gray-700 text-sm font-medium">{item.label}</span>
            <span className={`text-sm font-semibold ${item.statusColor}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sub-component: Feature List ───────────────────────────────────────────────
function FeatureList() {
  const t = useTranslations('landing.platform.features');
  const features = [
    {
      icon: UserCheck,
      key: 'account',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Lock,
      key: 'docs',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Activity,
      key: 'tracking',
      color: 'bg-teal-100 text-teal-600',
    },
    {
      icon: MessageSquare,
      key: 'messaging',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: CreditCard,
      key: 'payment',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <ul className="space-y-5">
      {features.map((f) => (
        <li key={f.key} className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${f.color}`}>
            <f.icon size={18} />
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm">{t(`${f.key}.title`)}</p>
            <p className="text-gray-500 text-xs mt-0.5">{t(`${f.key}.desc`)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function SecurePlatformSection() {
  const t = useTranslations('landing.platform');

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left – Dashboard card */}
          <div className="flex items-center justify-center md:justify-start">
            <CaseDashboardCard />
          </div>

          {/* Right – Features */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
              {t('title')}
            </h2>

            <FeatureList />

            <Link
              href="/login"
              className="mt-10 inline-block bg-primary hover:bg-[#152f56] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 active:scale-95 shadow"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
