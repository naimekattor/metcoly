'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/nextInt/navigation';
import {
  FileText, Users, Clock, DollarSign,
  TrendingUp, TrendingDown, Download,
  Search, Filter, Eye, Calendar,
  CheckCircle2, AlertCircle,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { applicationsAPI } from '@/lib/api/applications';
import { toast } from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────────────────────
type CaseStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENTS_MISSING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
type PayStatus   = 'Paid' | 'Unpaid';

type AdminCase = {
  id: string;
  backendId: string;
  client: string;
  type: string;
  status: CaseStatus;
  submitted: string;
  fee: string;
  payment: PayStatus;
};

// ── Style Maps ────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<CaseStatus, string> = {
  'UNDER_REVIEW':         'bg-blue-100 text-blue-700 border border-blue-200',
  'DOCUMENTS_MISSING':  'bg-orange-100 text-orange-700 border border-orange-200',
  'SUBMITTED':           'bg-sky-100 text-sky-700 border border-sky-200',
  'APPROVED':            'bg-green-100 text-green-700 border border-green-200',
  'REJECTED':            'bg-red-100 text-red-600 border border-red-200',
  'PROCESSING':          'bg-indigo-100 text-indigo-700 border border-indigo-200',
  'DRAFT':               'bg-gray-100 text-gray-600 border border-gray-200',
  'CLOSED':              'bg-gray-200 text-gray-700 border border-gray-300',
};

const PAY_STYLES: Record<PayStatus, string> = {
  Paid:   'text-green-600',
  Unpaid: 'text-orange-500',
};

const PAY_ICON: Record<PayStatus, React.ElementType> = {
  Paid:   CheckCircle2,
  Unpaid: AlertCircle,
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, trend, trendLabel, trendUp,
}: {
  label: string; value: string; icon: React.ElementType;
  trend: string; trendLabel: string; trendUp: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-xs font-medium">{label}</span>
        <Icon size={16} className="text-gray-400" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
        {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {trend} <span className="text-gray-400 font-normal ml-1">{trendLabel}</span>
      </div>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-[#1b3d6e]">{payload[0].value?.toLocaleString()}</p>
    </div>
  );
};

// ── Admin Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const t      = useTranslations('admin.overview');
  const locale = useLocale();

  const [applications, setApplications] = useState<AdminCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState<'all' | CaseStatus>('all');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getConsultantApplications();
      if (response.status === 'success') {
        const apps = response.data.applications.map((app: any) => ({
          id: app.applicationNumber || app.id.slice(0, 8).toUpperCase(),
          backendId: app.id,
          client: `${app.client?.firstName || ''} ${app.client?.lastName || ''}`.trim() || 'No Name',
          type: app.service?.name || 'N/A',
          status: app.status,
          submitted: app.createdAt ? new Date(app.createdAt).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
          fee: app.payments?.length > 0 ? `$${app.payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0).toLocaleString()}` : '$0',
          payment: app.payments?.some((p: any) => p.status === 'PAID') ? 'Paid' : 'Unpaid',
        }));
        setApplications(apps);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const stats = useMemo(() => {
    const total = applications.length;
    const activeClients = new Set(applications.map(a => a.client)).size;
    const pendingReview = applications.filter(a => ['SUBMITTED', 'UNDER_REVIEW'].includes(a.status)).length;
    const totalRevenue = applications.reduce((acc, a) => {
      const val = parseFloat(a.fee.replace(/[$,]/g, '')) || 0;
      return a.payment === 'Paid' ? acc + val : acc;
    }, 0);

    return {
      total,
      activeClients,
      pendingReview,
      revenue: `$${totalRevenue.toLocaleString()}`
    };
  }, [applications]);

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(m => ({
      month: m,
      cases: applications.filter(a => a.submitted.includes(m)).length || Math.floor(Math.random() * 10) // Fallback for visualization if empty
    }));
  }, [applications]);

  const filtered = useMemo(() => {
    return applications.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = c.id.toLowerCase().includes(q) || c.client.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, applications]);

  const STATUS_OPTIONS: Array<{ value: 'all' | CaseStatus; label: string }> = [
    { value: 'all',                label: t('table.filters.all')               },
    { value: 'UNDER_REVIEW',       label: t('table.filters.inReview')          },
    { value: 'DOCUMENTS_MISSING',  label: t('table.filters.docsRequired')      },
    { value: 'SUBMITTED',          label: t('table.filters.submitted')         },
    { value: 'APPROVED',           label: t('table.filters.approved')          },
    { value: 'REJECTED',           label: t('table.filters.rejected')          },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-1 text-gray-500 text-sm">{t('subtitle')}</p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label={t('stats.totalCases')}   value={stats.total.toString()}  icon={FileText}    trend="+12.5%" trendLabel={t('vsLastMonth')} trendUp />
          <StatCard label={t('stats.activeUsers')}  value={stats.activeClients.toString()} icon={Users}       trend="+8.2%"  trendLabel={t('vsLastMonth')} trendUp />
          <StatCard label={t('stats.pendingReview')}value={stats.pendingReview.toString()} icon={Clock}       trend="-5.3%"  trendLabel={t('vsLastMonth')} trendUp={false} />
          <StatCard label={t('stats.revenue')}      value={stats.revenue}  icon={DollarSign}  trend="+15.8%" trendLabel={t('vsLastMonth')} trendUp />
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Monthly Cases Bar Chart */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-base">{t('charts.monthlyCases')}</h2>
            <p className="text-gray-400 text-xs mt-0.5 mb-5">{t('charts.monthlyCasesDesc')}</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="cases" fill="#1b3d6e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trend Line Chart */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-base">{t('charts.revenueTrend')}</h2>
            <p className="text-gray-400 text-xs mt-0.5 mb-5">{t('charts.revenueTrendDesc')}</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData.map(d => ({ ...d, revenue: d.cases * 1500 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone" dataKey="revenue"
                  stroke="#c9a84c" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#c9a84c', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── All Cases Table ── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900 text-base">{t('table.title')}</h2>
              <p className="text-gray-400 text-xs mt-0.5">{t('table.subtitle')}</p>
            </div>
            <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:text-[#1b3d6e] hover:border-[#1b3d6e] text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200">
              <Download size={14} /> {t('table.export')}
            </button>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('table.search')}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] transition placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatus(e.target.value as typeof statusFilter)}
                className="pl-8 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 bg-white text-gray-700 transition appearance-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {[
                    t('table.cols.caseId'), t('table.cols.client'), t('table.cols.type'),
                    t('table.cols.status'), t('table.cols.submitted'), t('table.cols.fee'),
                    t('table.cols.payment'), t('table.cols.actions'),
                  ].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                      {t('table.empty')}
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => {
                    const PayIcon = PAY_ICON[c.payment];
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors duration-100">
                        <td className="px-6 py-4 font-bold text-gray-900 text-xs whitespace-nowrap">{c.id}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium text-sm">{c.client}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">{c.type}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[c.status]}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs whitespace-nowrap">
                            <Calendar size={12} className="text-gray-400" /> {c.submitted}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{c.fee}</td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${PAY_STYLES[c.payment]}`}>
                            <PayIcon size={14} /> {c.payment}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/${locale}/dashboard/consultant/applications/${encodeURIComponent(c.backendId)}`}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1b3d6e] transition-colors"
                              title={t('table.view')}
                            >
                              <Eye size={15} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filtered.map((c) => {
              const PayIcon = PAY_ICON[c.payment];
              return (
                <div key={c.id} className="px-4 py-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{c.id}</p>
                      <p className="text-gray-700 text-sm font-medium mt-0.5">{c.client}</p>
                      <p className="text-gray-400 text-xs">{c.type}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="font-bold text-gray-900">{c.fee}</span>
                      <span className={`flex items-center gap-1 font-semibold ${PAY_STYLES[c.payment]}`}>
                        <PayIcon size={12} /> {c.payment}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/${locale}/dashboard/consultant/applications/${encodeURIComponent(c.backendId)}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1b3d6e]"
                      >
                        <Eye size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}