'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Plus,
  Clock,
  Activity,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Case = {
  id: string;
  type: string;
  status: 'Submitted' | 'In Review' | 'Approved' | 'Pending';
  submittedDate: string;
  timeAgo: string;
};

type ActivityItem = {
  id: string;
  message: string;
  time: string;
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_CASES: Case[] = [
  {
    id: 'CASE-2026-006',
    type: 'Work Permit',
    status: 'Submitted',
    submittedDate: 'February 22, 2026',
    timeAgo: 'Just now',
  },
];

const MOCK_ACTIVITY: ActivityItem[] = [];

const STATUS_STYLES: Record<Case['status'], string> = {
  Submitted: 'bg-blue-100 text-blue-700',
  'In Review': 'bg-yellow-100 text-yellow-700',
  Approved:   'bg-green-100 text-green-700',
  Pending:    'bg-gray-100 text-gray-600',
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">{label}</span>
        <Icon size={18} className={iconColor} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const stats = [
    { label: t('stats.activeCases'),     value: 1,   icon: FileText,    iconColor: 'text-gray-400'   },
    { label: t('stats.pendingActions'),  value: 0,   icon: AlertCircle, iconColor: 'text-yellow-500' },
    { label: t('stats.completed'),       value: 0,   icon: CheckCircle2,iconColor: 'text-green-500'  },
    { label: t('stats.totalSpent'),      value: '$0',icon: CreditCard,  iconColor: 'text-gray-400'   },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t('welcome')}, <span className="text-[#1b3d6e]">John</span>
            </h1>
            <p className="mt-1 text-gray-500 text-sm">{t('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}/dashboard/user/my-cases/new`}
            className="inline-flex items-center gap-2 bg-[#1b3d6e] hover:bg-[#152f56] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow-sm flex-shrink-0"
          >
            <Plus size={16} /> {t('newCase')}
          </Link>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* ── Bottom Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Cases — takes 2/3 */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-base">{t('recentCases.title')}</h2>
              <Link
                href={`/${locale}/dashboard/user/my-cases`}
                className="inline-flex items-center gap-1 text-sm text-[#1b3d6e] font-medium hover:underline"
              >
                {t('recentCases.viewAll')} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Cases list */}
            <div className="divide-y divide-gray-50">
              {MOCK_CASES.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400 text-sm">
                  {t('recentCases.empty')}
                </div>
              ) : (
                MOCK_CASES.map((c) => (
                  <Link
                    key={c.id}
                    href={`/${locale}/dashboard/user/my-cases/${c.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-gray-900 text-sm">{c.id}</span>
                      <span className="text-gray-500 text-xs">{c.type}</span>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
                        <span>{t('recentCases.submitted')}: {c.submittedDate}</span>
                        <span>•</span>
                        <Clock size={11} className="flex-shrink-0" />
                        <span>{c.timeAgo}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[c.status]}`}>
                      {c.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity — takes 1/3 */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-base">{t('activity.title')}</h2>
              <p className="text-gray-400 text-xs mt-0.5">{t('activity.subtitle')}</p>
            </div>

            {/* Activity list */}
            <div className="px-6 py-4">
              {MOCK_ACTIVITY.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Activity size={24} className="text-gray-300" />
                  <p className="text-gray-400 text-sm">{t('activity.empty')}</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {MOCK_ACTIVITY.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#1b3d6e] mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 text-sm">{item.message}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{item.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}