'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  FileText, DollarSign, Users, Clock,
  TrendingUp, TrendingDown, ChevronDown,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

// ── Types ─────────────────────────────────────────────────────────────────────
type Period = 'Last 6 Months' | 'Last 3 Months' | 'Last Year' | 'This Year';
type Tab    = 'case' | 'revenue';

// ── Chart Data ────────────────────────────────────────────────────────────────
const CASES_BY_MONTH = [
  { month: 'Sep', cases: 11 },
  { month: 'Oct', cases: 16 },
  { month: 'Nov', cases: 18 },
  { month: 'Dec', cases: 22 },
  { month: 'Jan', cases: 28 },
  { month: 'Feb', cases: 31 },
];

const REVENUE_BY_MONTH = [
  { month: 'Sep', revenue: 12000 },
  { month: 'Oct', revenue: 15000 },
  { month: 'Nov', revenue: 18000 },
  { month: 'Dec', revenue: 22000 },
  { month: 'Jan', revenue: 28000 },
  { month: 'Feb', revenue: 34200 },
];

const CASES_BY_TYPE = [
  { name: 'Work Permit',       value: 30, color: '#1b3d6e' },
  { name: 'Family Sponsorship',value: 24, color: '#c9a84c' },
  { name: 'Student Visa',      value: 19, color: '#0f2d4a' },
  { name: 'Express Entry',     value: 16, color: '#5b8db8' },
  { name: 'Other',             value: 11, color: '#9db5c8' },
];

const REVENUE_BY_TYPE = [
  { name: 'Work Permit',       value: 38, color: '#1b3d6e' },
  { name: 'Permanent Res.',    value: 28, color: '#c9a84c' },
  { name: 'Study Permit',      value: 18, color: '#0f2d4a' },
  { name: 'Family Sponsorship',value: 10, color: '#5b8db8' },
  { name: 'Other',             value: 6,  color: '#9db5c8' },
];

const APPROVAL_TREND = [
  { month: 'Sep', approved: 8,  rejected: 2 },
  { month: 'Oct', approved: 13, rejected: 3 },
  { month: 'Nov', approved: 14, rejected: 4 },
  { month: 'Dec', approved: 19, rejected: 3 },
  { month: 'Jan', approved: 23, rejected: 5 },
  { month: 'Feb', approved: 26, rejected: 5 },
];

const REVENUE_BY_CONSULTANT = [
  { name: 'Sarah Johnson',   revenue: 14200 },
  { name: 'Michael Chen',    revenue: 11800 },
  { name: 'Emily Rodriguez', revenue: 8200  },
];

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs min-w-[110px]">
      {label && <p className="font-bold text-gray-700 mb-1.5">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="text-gray-500 capitalize">{p.name}</span>
          </span>
          <span className="font-semibold text-gray-800">
            {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const PieTip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-gray-700">{payload[0].name}</p>
      <p className="text-gray-500">{payload[0].value}%</p>
    </div>
  );
};

// ── Custom Pie Label ──────────────────────────────────────────────────────────
const PieLabel = ({ cx, cy, midAngle, outerRadius, name, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 36;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="fill-gray-500"
      style={{ fontSize: 11 }}
    >
      {name}: {value}%
    </text>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, trend, up, t }: {
  label: string; value: string; icon: React.ElementType; trend: string; up: boolean; t: any;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-xs font-medium">{label}</span>
        <Icon size={16} className="text-gray-300" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-green-500' : 'text-red-400'}`}>
        {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {trend} <span className="text-gray-400 font-normal ml-1">{t('stats.vsLastPeriod')}</span>
      </div>
    </div>
  );
}

// ── Chart Card ────────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, className = '' }: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="font-bold text-gray-900 text-base">{title}</h3>
      {subtitle && <p className="text-gray-400 text-xs mt-0.5 mb-5">{subtitle}</p>}
      {!subtitle && <div className="mb-5" />}
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [period, setPeriod]   = useState<Period>('Last 6 Months');
  const [tab, setTab]         = useState<Tab>('case');
  const [showPeriod, setShowPeriod] = useState(false);

  const t = useTranslations('admin.reports');
  const PERIODS: Period[] = ['Last 3 Months', 'Last 6 Months', 'Last Year', 'This Year'];

  const stats = [
    { label: t('stats.totalCases'),   value: '126',      icon: FileText,    trend: '+24%', up: true  },
    { label: t('stats.revenue'),      value: '$34,200',  icon: DollarSign,  trend: '+18%', up: true  },
    { label: t('stats.activeUsers'),  value: '284',      icon: Users,       trend: '+12%', up: true  },
    { label: t('stats.avgProcessing'),value: t('stats.avgProcessingValue', { days: 14 }),  icon: Clock,       trend: '-8%',  up: false },
  ];

  const caseAnalyticsContent = (
    <>
      {/* ── Charts Row 1 (Case Analytics) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cases by Month Bar Chart */}
        <ChartCard
          title={t('charts.casesByMonth')}
          subtitle={t('charts.casesByMonthDesc')}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={CASES_BY_MONTH} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: '#f3f4f6' }} />
              <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="cases" name="Cases" fill="#1b3d6e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cases by Type Pie Chart */}
        <ChartCard
          title={t('charts.casesByType')}
          subtitle={t('charts.casesByTypeDesc')}
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={CASES_BY_TYPE}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={PieLabel}
              >
                {CASES_BY_TYPE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Charts Row 2 (Case Analytics) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval vs Rejected Bar Chart */}
        <ChartCard
          title={t('charts.approvalVsRejected')}
          subtitle={t('charts.approvalVsRejectedDesc')}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={APPROVAL_TREND} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: '#f9fafb' }} />
              <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="approved" name="Approved" fill="#1b3d6e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Case Status Summary Table */}
        <ChartCard
          title={t('summary.caseStatus')}
          subtitle={t('summary.caseStatusDesc')}
        >
          <div className="flex flex-col gap-3">
            {[
              { label: 'Approved',            value: 54, pct: 43, color: 'bg-green-500' },
              { label: 'In Review',            value: 38, pct: 30, color: 'bg-yellow-400' },
              { label: 'Documents Required',   value: 20, pct: 16, color: 'bg-orange-400' },
              { label: 'Submitted',            value: 9,  pct: 7,  color: 'bg-blue-400' },
              { label: 'Rejected',             value: 5,  pct: 4,  color: 'bg-red-400' },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700 text-sm">{row.label}</span>
                  <span className="font-semibold text-gray-900 text-sm">{row.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${row.pct}%`, transition: 'width 0.5s ease' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </>
  );

  const revenueAnalyticsContent = (
    <>
      {/* ── Charts Row 1 (Revenue Analytics) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Month Line Chart */}
        <ChartCard
          title={t('charts.revenueTrend')}
          subtitle={t('charts.revenueTrendDesc')}
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={REVENUE_BY_MONTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTip />} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" name="revenue" stroke="#1b3d6e" strokeWidth={2.5}
                dot={{ r: 4, fill: '#1b3d6e', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue by Type Pie Chart */}
        <ChartCard
          title={t('charts.revenueByType')}
          subtitle={t('charts.revenueByTypeDesc')}
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={REVENUE_BY_TYPE}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={PieLabel}
              >
                {REVENUE_BY_TYPE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Charts Row 2 (Revenue Analytics) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Consultant Bar Chart */}
        <ChartCard
          title={t('charts.revenueByConsultant')}
          subtitle={t('charts.revenueByConsultantDesc')}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_BY_CONSULTANT} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<ChartTip />} cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="revenue" name="revenue" fill="#1b3d6e" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Payment Summary Table */}
        <ChartCard
          title={t('summary.payment')}
          subtitle={t('summary.paymentDesc')}
        >
          <div className="flex flex-col gap-3">
            {[
              { label: 'Paid',                value: '$28,400', pct: 83, color: 'bg-green-500' },
              { label: 'Partial',             value: '$3,600',  pct: 11, color: 'bg-blue-400' },
              { label: 'Unpaid',              value: '$2,200',  pct: 6,  color: 'bg-red-400' },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700 text-sm">{row.label}</span>
                  <span className="font-semibold text-gray-900 text-sm">{row.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${row.pct}%`, transition: 'width 0.5s ease' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </>
  );


  return (
    <div className="min-h-screen ">
      <div className="">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="mt-1 text-gray-500 text-sm">{t('subtitle')}</p>
          </div>

          {/* Period selector */}
          <div className="relative">
            <button
              onClick={() => setShowPeriod((v) => !v)}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-[#1b3d6e] transition-all shadow-sm"
            >
              {period === 'Last 3 Months' && t('periods.last3Months')}
              {period === 'Last 6 Months' && t('periods.last6Months')}
              {period === 'Last Year' && t('periods.lastYear')}
              {period === 'This Year' && t('periods.thisYear')}
              <ChevronDown size={15} className={`transition-transform ${showPeriod ? 'rotate-180' : ''}`} />
            </button>
            {showPeriod && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-[160px]">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setShowPeriod(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      p === period ? 'text-[#1b3d6e] font-semibold bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    {p === 'Last 3 Months' && t('periods.last3Months')}
                    {p === 'Last 6 Months' && t('periods.last6Months')}
                    {p === 'Last Year' && t('periods.lastYear')}
                    {p === 'This Year' && t('periods.thisYear')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-8 shadow-sm">
          {(['case', 'revenue'] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                tab === tabKey
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tabKey === 'case' ? t('tabs.case') : t('tabs.revenue')}
            </button>
          ))}
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => <StatCard key={s.label} {...s} t={t} />)}
        </div>

        {/* Conditional content based on tab */}
        {tab === 'case' ? caseAnalyticsContent : revenueAnalyticsContent}
      </div>
    </div>
  );
}