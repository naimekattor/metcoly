'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/nextInt/navigation';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Calendar, CheckCircle2, AlertCircle, Clock,
  FileText, User, Mail, Phone, Download, Paperclip,
} from 'lucide-react';

type CaseStatus  = 'In Review' | 'Documents Required' | 'Submitted' | 'Approved' | 'Rejected';

type CaseDetail = {
  id: string;
  client: string;
  email: string;
  phone: string;
  type: string;
  status: CaseStatus;
  submitted: string;
  lastUpdate: string;
  consultant: string;
  priority: 'High' | 'Medium' | 'Low';
};

// Simple mock data – mirrors list view IDs so the detail feels connected.
const ALL_CASES: CaseDetail[] = [
  {
    id: 'CASE-2024-001',
    client: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    type: 'Work Permit',
    status: 'In Review',
    submitted: '2026-02-15',
    lastUpdate: '2026-02-18',
    consultant: 'Sarah Johnson',
    priority: 'High',
  },
  {
    id: 'CASE-2024-002',
    client: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    type: 'Study Permit',
    status: 'Documents Required',
    submitted: '2026-02-01',
    lastUpdate: '2026-02-22',
    consultant: 'Michael Chen',
    priority: 'High',
  },
];

const STATUS_OPTIONS: CaseStatus[] = [
  'In Review',
  'Documents Required',
  'Submitted',
  'Approved',
  'Rejected',
];

const STATUS_BADGE: Record<CaseStatus, string> = {
  'In Review':           'bg-blue-50 text-blue-700 border border-blue-200',
  'Documents Required':  'bg-orange-50 text-orange-700 border border-orange-200',
  'Submitted':           'bg-sky-50 text-sky-700 border border-sky-200',
  'Approved':            'bg-green-50 text-green-700 border border-green-200',
  'Rejected':            'bg-red-50 text-red-600 border border-red-200',
};

export default function AdminCaseDetailPage() {
  const t      = useTranslations('admin.caseDetails');
  const t_apps = useTranslations('admin.applications');
  const locale = useLocale();
  const params = useParams();
  const rawId  = params?.caseId as string | undefined;
  const caseId = rawId ? decodeURIComponent(rawId) : '';

  const currentCase = useMemo(
    () => ALL_CASES.find((c) => c.id === caseId) ?? ALL_CASES[0],
    [caseId],
  );

  const [status, setStatus] = useState<CaseStatus>(currentCase.status);
  const [activeTab, setActiveTab] = useState<'timeline' | 'documents' | 'notes'>('timeline');

  return (
    <div className="min-h-screen ">
      <div className="">

        {/* Back + Header */}
        <Link
          href="/dashboard/admin/applications"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} />
          <span>{t('backToCases')}</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {t('caseLabel')}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {currentCase.id}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {currentCase.type} – {currentCase.client}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
              {currentCase.priority === 'High' && t('priority.high')}
              {currentCase.priority === 'Medium' && t('priority.medium')}
              {currentCase.priority === 'Low' && t('priority.low')}
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
              {t('statusPill.inProgress')}
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              className="ml-2 px-3 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === 'In Review' && t_apps('status.inReview')}
                  {s === 'Documents Required' && t_apps('status.docsRequired')}
                  {s === 'Submitted' && t_apps('status.submitted')}
                  {s === 'Approved' && t_apps('status.approved')}
                  {s === 'Rejected' && t_apps('status.rejected')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary + Client info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Case overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-1 text-base">
              {t('overview.title')}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Application for work permit extension for tech industry professional.
              Client currently holds a valid work permit expiring in 60 days.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-gray-400 mb-1">{t('overview.submitted')}</p>
                <p className="font-semibold text-gray-900">{currentCase.submitted}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">{t('overview.updated')}</p>
                <p className="font-semibold text-gray-900">{currentCase.lastUpdate}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">{t('overview.type')}</p>
                <p className="font-semibold text-gray-900">{currentCase.type}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">{t('overview.assigned')}</p>
                <p className="font-semibold text-gray-900">{currentCase.consultant}</p>
              </div>
            </div>
          </div>

          {/* Client info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 text-base">
                {t('clientInfo.title')}
              </h3>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                  {currentCase.client.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {currentCase.client}
                  </p>
                  <p className="text-gray-400 text-xs">{t('clientInfo.label')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={14} className="text-gray-400" />
                <span>{currentCase.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} className="text-gray-400" />
                <span>{currentCase.phone}</span>
              </div>
            </div>

            <button className="w-full border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition">
              {t('clientInfo.viewProfile')}
            </button>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {t('quickActions.title')}
              </p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {t('quickActions.schedule')}
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
                  <span className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400" />
                    {t('quickActions.generate')}
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm border border-red-200 rounded-lg hover:bg-red-50 text-red-600">
                  <span className="flex items-center gap-2">
                    <AlertCircle size={14} />
                    {t('quickActions.close')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-5xl">
          <div className="border-b border-gray-100 flex items-center gap-4 px-6">
            {[
              { key: 'timeline', label: t('tabs.timeline') },
              { key: 'documents', label: t('tabs.documents') },
              { key: 'notes', label: t('tabs.notes') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`relative px-3 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'timeline' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-base">
                  {t('timeline.title')}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {t('timeline.subtitle')}
                </p>

                <div className="space-y-6">
                  {[
                    { label: t('timeline.steps.submitted'), date: '2026-02-15', done: true },
                    { label: t('timeline.steps.review'), date: '2026-02-16', done: true },
                    { label: t('timeline.steps.docs'), date: '2026-02-17', done: true },
                    { label: t('timeline.steps.awaiting'), date: '2026-02-18', done: status === 'In Review' || status === 'Documents Required' },
                    { label: t('timeline.steps.submit'), date: 'Pending', done: status === 'Submitted' || status === 'Approved' || status === 'Rejected' },
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            step.done ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {step.done && <CheckCircle2 size={12} className="text-green-500" />}
                        </div>
                        {idx < 4 && (
                          <div className="flex-1 w-px bg-gray-200 mt-1" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{step.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">Documents</h3>
                    <p className="text-gray-500 text-sm">
                      Case documents and their status
                    </p>
                  </div>
                  
                </div>

                <div className="border border-dashed border-gray-200 rounded-xl p-4 text-sm text-gray-400">
                  No documents found .
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-base">{t('notes.title')}</h3>
                <p className="text-gray-500 text-sm">
                  {t('notes.subtitle')}
                </p>
                <textarea
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder={t('notes.placeholder')}
                />
                <div className="flex justify-end">
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                    {t('notes.save')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

