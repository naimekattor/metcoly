'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/nextInt/navigation';
import {
  Search, Filter, Download, Eye, Trash2,
  Plus, Calendar, CheckCircle2, AlertCircle,
  ChevronLeft, ChevronRight, ArrowUpDown,
  FileText, Users, Clock, XCircle,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type CaseStatus  = 'In Review' | 'Documents Required' | 'Submitted' | 'Approved' | 'Rejected';
type PayStatus   = 'Paid' | 'Unpaid' | 'Partial';
type Priority    = 'High' | 'Medium' | 'Low';

type AdminCase = {
  id: string;
  client: string;
  email: string;
  type: string;
  status: CaseStatus;
  priority: Priority;
  submitted: string;
  lastUpdate: string;
  fee: string;
  payment: PayStatus;
  consultant: string;
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const ALL_CASES: AdminCase[] = [
  { id: 'CASE-2024-001', client: 'John Smith',      email: 'john.smith@email.com',     type: 'Work Permit',         status: 'In Review',          priority: 'High',   submitted: '2026-01-15', lastUpdate: '2026-02-20', fee: '$1,500', payment: 'Paid',    consultant: 'Sarah Johnson'   },
  { id: 'CASE-2024-002', client: 'John Smith',      email: 'john.smith@email.com',     type: 'Study Permit',        status: 'Documents Required', priority: 'High',   submitted: '2026-02-01', lastUpdate: '2026-02-22', fee: '$1,200', payment: 'Unpaid',  consultant: 'Michael Chen'    },
  { id: 'CASE-2024-003', client: 'Maria Garcia',    email: 'maria.garcia@email.com',   type: 'Permanent Residence', status: 'Submitted',           priority: 'Medium', submitted: '2026-02-10', lastUpdate: '2026-02-18', fee: '$3,500', payment: 'Paid',    consultant: 'Sarah Johnson'   },
  { id: 'CASE-2024-004', client: 'Ahmed Hassan',    email: 'ahmed.hassan@email.com',   type: 'Family Sponsorship',  status: 'Approved',            priority: 'Low',    submitted: '2025-12-20', lastUpdate: '2026-02-15', fee: '$2,000', payment: 'Paid',    consultant: 'Emily Rodriguez' },
  { id: 'CASE-2024-005', client: 'Sophie Dubois',   email: 'sophie.d@email.com',       type: 'Work Permit',         status: 'In Review',           priority: 'Medium', submitted: '2026-01-28', lastUpdate: '2026-02-21', fee: '$1,500', payment: 'Paid',    consultant: 'Michael Chen'    },
  { id: 'CASE-2024-006', client: 'Liang Wei',       email: 'liang.wei@email.com',      type: 'Study Permit',        status: 'Approved',            priority: 'Low',    submitted: '2026-01-05', lastUpdate: '2026-02-10', fee: '$1,200', payment: 'Paid',    consultant: 'Sarah Johnson'   },
  { id: 'CASE-2024-007', client: 'Priya Sharma',    email: 'priya.sharma@email.com',   type: 'Visitor Visa',        status: 'Rejected',            priority: 'Low',    submitted: '2026-01-20', lastUpdate: '2026-02-05', fee: '$800',  payment: 'Partial', consultant: 'Emily Rodriguez' },
  { id: 'CASE-2024-008', client: 'Carlos Mendez',   email: 'carlos.m@email.com',       type: 'Work Permit',         status: 'Documents Required',  priority: 'High',   submitted: '2026-02-12', lastUpdate: '2026-02-23', fee: '$1,500', payment: 'Unpaid',  consultant: 'Michael Chen'    },
  { id: 'CASE-2024-009', client: 'Fatima Al-Zahra', email: 'fatima.az@email.com',      type: 'Permanent Residence', status: 'In Review',           priority: 'Medium', submitted: '2026-01-30', lastUpdate: '2026-02-19', fee: '$3,500', payment: 'Partial', consultant: 'Sarah Johnson'   },
  { id: 'CASE-2024-010', client: 'David Kim',       email: 'david.kim@email.com',      type: 'Family Sponsorship',  status: 'Submitted',           priority: 'Medium', submitted: '2026-02-08', lastUpdate: '2026-02-17', fee: '$2,000', payment: 'Paid',    consultant: 'Emily Rodriguez' },
];

// ── Style Maps ────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<CaseStatus, string> = {
  'In Review':           'bg-yellow-50 text-yellow-700 border border-yellow-200',
  'Documents Required':  'bg-orange-50 text-orange-700 border border-orange-200',
  'Submitted':           'bg-blue-50 text-blue-700 border border-blue-200',
  'Approved':            'bg-green-50 text-green-700 border border-green-200',
  'Rejected':            'bg-red-50 text-red-600 border border-red-200',
};

const PRIORITY_STYLES: Record<Priority, string> = {
  High:   'bg-red-50 text-red-600',
  Medium: 'bg-yellow-50 text-yellow-600',
  Low:    'bg-gray-100 text-gray-500',
};

const PAY_STYLES: Record<PayStatus, { cls: string; icon: React.ElementType }> = {
  Paid:    { cls: 'text-green-600',  icon: CheckCircle2 },
  Unpaid:  { cls: 'text-orange-500', icon: AlertCircle  },
  Partial: { cls: 'text-blue-500',   icon: Clock        },
};

const PAGE_SIZE = 8;

// ── Stat Pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number; color: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={15} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="font-bold text-gray-900 text-base leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ caseId, onConfirm, onCancel, t }: {
  caseId: string; onConfirm: () => void; onCancel: () => void; t: any;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-600" />
        </div>
        <h3 className="font-bold text-gray-900 text-center text-base mb-1">{t('modal.deleteTitle')}</h3>
        <p className="text-gray-500 text-sm text-center mb-6">
          {t('modal.deleteConfirm', { caseId })}
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition">
            {t('modal.cancel')}
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition">
            {t('modal.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCasesPage() {
  const t      = useTranslations('admin.cases');
  const locale = useLocale();

  const [search, setSearch]           = useState('');
  const [statusFilter, setStatus]     = useState<'all' | CaseStatus>('all');
  const [typeFilter, setType]         = useState('all');
  const [page, setPage]               = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [cases, setCases]             = useState(ALL_CASES);

  // Derived stats
  const total       = cases.length;
  const inReview    = cases.filter((c) => c.status === 'In Review').length;
  const approved    = cases.filter((c) => c.status === 'Approved').length;
  const rejected    = cases.filter((c) => c.status === 'Rejected').length;

  // Unique types for filter
  const caseTypes = ['all', ...Array.from(new Set(ALL_CASES.map((c) => c.type)))];

  // Filtered + paginated
  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        c.id.toLowerCase().includes(q) ||
        c.client.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.consultant.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchType   = typeFilter === 'all' || c.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [cases, search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = () => {
    if (deleteTarget) {
      setCases((prev) => prev.filter((c) => c.id !== deleteTarget));
      setDeleteTarget(null);
    }
  };

  const STATUS_OPTIONS: Array<{ value: 'all' | CaseStatus; label: string }> = [
    { value: 'all',                label: t('filters.allStatus')           },
    { value: 'In Review',          label: t('status.inReview')            },
    { value: 'Documents Required', label: t('status.docsRequired')   },
    { value: 'Submitted',          label: t('status.submitted')            },
    { value: 'Approved',           label: t('status.approved')             },
    { value: 'Rejected',           label: t('status.rejected')             },
  ];

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          caseId={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          t={t}
        />
      )}

      <div className="min-h-screen ">
        <div className="">

          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="mt-1 text-gray-500 text-sm">{t('subtitle')}</p>
            </div>
            
          </div>

          {/* ── Stat Pills ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatPill icon={FileText}    label={t('stats.total')}     value={total}    color="bg-[#1b3d6e]" />
            <StatPill icon={Clock}       label={t('stats.inReview')}  value={inReview} color="bg-yellow-500" />
            <StatPill icon={CheckCircle2}label={t('stats.approved')}  value={approved} color="bg-green-500"  />
            <StatPill icon={XCircle}     label={t('stats.rejected')}  value={rejected} color="bg-red-500"    />
          </div>

          {/* ── Table Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{t('table.heading')}</h2>
              <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:text-[#1b3d6e] hover:border-[#1b3d6e] text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200">
                <Download size={14} /> {t('table.export')}
              </button>
            </div>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 px-6 py-4 border-b border-gray-100">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t('table.search')}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] transition placeholder-gray-400"
                />
              </div>

              {/* Status */}
              <div className="relative">
                <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatus(e.target.value as typeof statusFilter); setPage(1); }}
                  className="pl-8 pr-7 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 bg-white text-gray-700 transition appearance-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="pl-4 pr-7 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 bg-white text-gray-700 transition appearance-none cursor-pointer"
                >
                  {caseTypes.map((type) => (
                    <option key={type} value={type}>{type === 'all' ? t('filters.allTypes') : type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Desktop Table ── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {[
                      t('table.cols.caseId'),   t('table.cols.client'),
                      t('table.cols.type'),      t('table.cols.status'),
                      t('table.cols.priority'),  t('table.cols.submitted'),
                      t('table.cols.fee'),       t('table.cols.payment'),
                      t('table.cols.consultant'),t('table.cols.actions'),
                    ].map((h) => (
                      <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-5 py-14 text-center text-gray-400 text-sm">
                        {t('table.empty')}
                      </td>
                    </tr>
                  ) : (
                    paginated.map((c) => {
                      const Pay = PAY_STYLES[c.payment];
                      return (
                        <tr key={c.id} className="hover:bg-gray-50/70 transition-colors duration-100 group">
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-[#1b3d6e] text-xs">{c.id}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-gray-900 text-sm">{c.client}</p>
                            <p className="text-gray-400 text-xs">{c.email}</p>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 text-sm whitespace-nowrap">{c.type}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[c.status]}`}>
                              {c.status === 'In Review' && t('status.inReview')}
                              {c.status === 'Documents Required' && t('status.docsRequired')}
                              {c.status === 'Submitted' && t('status.submitted')}
                              {c.status === 'Approved' && t('status.approved')}
                              {c.status === 'Rejected' && t('status.rejected')}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${PRIORITY_STYLES[c.priority]}`}>
                              {c.priority === 'High' && t('priority.high')}
                              {c.priority === 'Medium' && t('priority.medium')}
                              {c.priority === 'Low' && t('priority.low')}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                              <Calendar size={11} /> {c.submitted}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-gray-900 text-sm">{c.fee}</td>
                          <td className="px-5 py-3.5">
                            <div className={`flex items-center gap-1.5 text-xs font-semibold ${Pay.cls}`}>
                              <Pay.icon size={13} /> {c.payment}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 text-sm whitespace-nowrap">{c.consultant}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                              <Link
                                href={`/dashboard/admin/applications/${encodeURIComponent(c.id)}`}
                                className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#1b3d6e] transition-colors"
                                title="View"
                              >
                                <Eye size={15} />
                              </Link>
                              <button
                                onClick={() => setDeleteTarget(c.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="lg:hidden divide-y divide-gray-100">
              {paginated.map((c) => {
                const Pay = PAY_STYLES[c.payment];
                return (
                  <div key={c.id} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-bold text-[#1b3d6e] text-xs">{c.id}</p>
                        <p className="font-semibold text-gray-900 text-sm">{c.client}</p>
                        <p className="text-gray-400 text-xs">{c.type}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[c.status]}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-gray-900">{c.fee}</span>
                        <span className={`flex items-center gap-1 font-semibold ${Pay.cls}`}>
                          <Pay.icon size={12} /> {c.payment}
                        </span>
                        <span className="text-gray-400">{c.consultant}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/admin/applications/${encodeURIComponent(c.id)}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1b3d6e]">
                          <Eye size={15} />
                        </Link>
                        <button onClick={() => setDeleteTarget(c.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} cases
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1b3d6e] hover:border-[#1b3d6e] disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                        page === i + 1
                          ? 'bg-[#1b3d6e] text-white'
                          : 'border border-gray-200 text-gray-600 hover:border-[#1b3d6e] hover:text-[#1b3d6e]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1b3d6e] hover:border-[#1b3d6e] disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}