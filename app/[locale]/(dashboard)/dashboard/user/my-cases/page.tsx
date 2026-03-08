'use client';

import { useState, useMemo, useEffect } from 'react';
import { Link } from '@/nextInt/navigation';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { applicationsAPI } from '@/lib/api/applications';
import {
  Plus, Search, Filter, Eye,
  FileText, Loader2, Eye as EyeIcon, CheckCircle2, Calendar,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────────────────────
type Status   = 'In Progress' | 'Under Review' | 'Completed' | 'Pending Documents' | 'Submitted' | 'Approved' | 'Rejected' | 'Pending' | string;
type Priority = 'High' | 'Medium' | 'Low' | string;

type Case = {
  id: string;
  type: string;
  description: string;
  status: Status;
  priority: Priority;
  submitted: string;
  consultant: string;
};

// ── Style maps ────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  DRAFT:             'Draft',
  SUBMITTED:         'Submitted',
  UNDER_REVIEW:      'Under Review',
  DOCUMENTS_MISSING: 'Pending Documents',
  PROCESSING:        'In Progress',
  APPROVED:          'Approved',
  REJECTED:          'Rejected',
  CLOSED:            'Closed',
};

const STATUS_STYLES: Record<string, string> = {
  'In Progress':       'bg-blue-100 text-blue-700 border border-blue-200',
  'Under Review':      'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'Completed':         'bg-green-100 text-green-700 border border-green-200',
  'Approved':          'bg-green-100 text-green-700 border border-green-200',
  'Pending Documents': 'bg-orange-100 text-orange-700 border border-orange-200',
  'Submitted':         'bg-gray-100 text-gray-700 border border-gray-200',
  'Rejected':          'bg-red-100 text-red-700 border border-red-200',
};

const PRIORITY_STYLES: Record<string, string> = {
  High:   'bg-red-100 text-red-600 border border-red-200',
  Medium: 'bg-yellow-100 text-yellow-600 border border-yellow-200',
  Low:    'bg-green-100 text-green-600 border border-green-200',
  Normal: 'bg-gray-100 text-gray-600 border border-gray-200',
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MyCasesPage() {
  const t        = useTranslations('dashboard.cases');
  const pathname = usePathname();

  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState<'all' | string>('all');
  
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await applicationsAPI.getMyApplications();
      const applications = Array.isArray(res.data?.applications) 
        ? res.data.applications 
        : (Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
      
      const mapped = applications.map((app: any) => ({
        id: app.applicationId || app.id || 'N/A',
        type: app.service?.name || 'General Application',
        description: app.formData?.firstName
          ? `${app.formData.firstName} ${app.formData.lastName || ''}`.trim()
          : 'Application case',
        status: STATUS_LABEL[app.status] || app.status || 'Submitted',
        priority: app.priority || 'Normal',
        submitted: app.createdAt
          ? new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          : '—',
        consultant: app.consultant
          ? `${app.consultant.firstName} ${app.consultant.lastName}`
          : 'Unassigned',
      }));
      
      setCases(mapped);
    } catch (err: any) {
      console.error('Failed to load applications:', err);
      toast.error('Failed to load your cases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Derived stats
  const inProgress  = cases.filter((c) => c.status !== 'Completed' && c.status !== 'Approved' && c.status !== 'Rejected').length;
  const underReview = cases.filter((c) => c.status === 'Under Review' || c.status === 'inReview').length;
  const completed   = cases.filter((c) => c.status === 'Completed' || c.status === 'Approved').length;

  // Filtered list
  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchSearch =
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.type.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.consultant.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [cases, search, statusFilter]);

  const STATUS_OPTIONS: Array<{ value: 'all' | string; label: string }> = [
    { value: 'all',               label: t('filters.allStatuses')       },
    { value: 'In Progress',       label: t('filters.inProgress')        },
    { value: 'Under Review',      label: t('filters.underReview')       },
    { value: 'Completed',         label: t('filters.completed')         },
    { value: 'Pending Documents', label: t('filters.pendingDocuments')  },
    { value: 'Submitted',         label: 'Submitted'  },
  ];

  return (
    <div className="min-h-screen ">
      <div className="">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="mt-1 text-gray-500 text-sm">{t('subtitle')}</p>
          </div>
          <Link
            href="/dashboard/user/my-cases/new"
            className="inline-flex items-center gap-2 bg-[#1b3d6e] hover:bg-[#152f56] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow-sm flex-shrink-0"
          >
            <Plus size={16} /> {t('submitNew')}
          </Link>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label={t('stats.total')}       value={cases.length} />
          <StatCard label={t('stats.inProgress')}  value={inProgress}  />
          <StatCard label={t('stats.underReview')} value={underReview} />
          <StatCard label={t('stats.completed')}   value={completed}   highlight />
        </div>

        {/* ── Cases Table Card ── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-base">{t('table.heading')}</h2>
            <p className="text-gray-400 text-xs mt-0.5">{t('table.subheading')}</p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-6 py-4 border-b border-gray-100">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search')}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] transition placeholder-gray-400"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatus(e.target.value)}
                className="pl-8 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] bg-white text-gray-700 transition appearance-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Desktop Table ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {[
                    t('table.caseId'),
                    t('table.type'),
                    t('table.description'),
                    t('table.status'),
                    t('table.priority'),
                    t('table.submitted'),
                    t('table.consultant'),
                    t('table.actions'),
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#1b3d6e] mx-auto" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                      {t('empty')}
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors duration-100">
                      <td className="px-6 py-4 font-bold text-gray-900">{c.id}</td>
                      <td className="px-6 py-4 text-gray-600">{c.type}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-[220px] truncate">{c.description}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-600'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY_STYLES[c.priority] || 'bg-gray-100 text-gray-600'}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                          {c.submitted}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{c.consultant}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/user/my-cases/${c.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1b3d6e] transition-colors inline-flex"
                          title={t('view')}
                        >
                          <Eye size={17} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards ── */}
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="px-6 py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#1b3d6e] mx-auto" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400 text-sm">{t('empty')}</div>
            ) : (
              filtered.map((c) => (
                <div key={c.id} className="px-4 py-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{c.id}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{c.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {c.status}
                      </span>
                      <Link
                        href={`/dashboard/user/my-cases/${c.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1b3d6e] transition-colors"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs">{c.description}</p>
                  <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500">
                    <span className={`font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[c.priority] || 'bg-gray-100 text-gray-600'}`}>
                      {c.priority}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {c.submitted}
                    </span>
                    <span>{c.consultant}</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}