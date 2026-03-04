'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/nextInt/navigation';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Calendar, CheckCircle2, AlertCircle, Clock,
  FileText, Mail, Phone, ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

type CaseStatus = 'Under Review' | 'Approved' | 'Rejected' | 'Pending';

interface ApplicationDetail {
  id: string;
  client: string;
  email: string;
  phone: string;
  type: string;
  country: string;
  status: CaseStatus;
  submitted: string;
  lastUpdate: string;
  consultant: string;
  priority: 'High' | 'Medium' | 'Low';
}

const ALL_APPLICATIONS: ApplicationDetail[] = [
  { id: 'APP-102', client: 'James Wilson', email: 'james.wilson@email.com', phone: '+1 (555) 010-102', type: 'Study Permit', country: 'Canada', submitted: '2026-03-04', lastUpdate: '2026-03-04', status: 'Under Review', priority: 'High', consultant: 'Marc Davies' },
  { id: 'APP-101', client: 'Linda Smith', email: 'linda.smith@email.com', phone: '+1 (555) 010-101', type: 'Work Permit', country: 'UK', submitted: '2026-03-04', lastUpdate: '2026-03-04', status: 'Approved', priority: 'Medium', consultant: 'Elena Popa' },
  { id: 'APP-100', client: 'Kevin Lee', email: 'kevin.lee@email.com', phone: '+1 (555) 010-100', type: 'Express Entry', country: 'Canada', submitted: '2026-03-03', lastUpdate: '2026-03-03', status: 'Under Review', priority: 'High', consultant: 'Marc Davies' },
  { id: 'APP-099', client: 'Emma Davis', email: 'emma.davis@email.com', phone: '+1 (555) 010-099', type: 'Sponsorship', country: 'Australia', submitted: '2026-03-02', lastUpdate: '2026-03-02', status: 'Approved', priority: 'Low', consultant: 'Robert Fox' },
  { id: 'APP-098', client: 'Michael Scott', email: 'michael.scott@email.com', phone: '+1 (555) 010-098', type: 'Business Visa', country: 'Canada', submitted: '2026-03-01', lastUpdate: '2026-03-01', status: 'Rejected', priority: 'Medium', consultant: 'Elena Popa' },
  { id: 'APP-097', client: 'Pam Beesly', email: 'pam.beesly@email.com', phone: '+1 (555) 010-097', type: 'Work Permit', country: 'Canada', submitted: '2026-02-28', lastUpdate: '2026-02-28', status: 'Pending', priority: 'Low', consultant: '' },
];

const STATUS_OPTIONS: CaseStatus[] = ['Pending', 'Under Review', 'Approved', 'Rejected'];

export default function SuperAdminApplicationDetailPage() {
  const t = useTranslations('superAdmin.applications.caseDetails');
  const t_shared = useTranslations('superAdmin.applications');
  const params = useParams();
  const rawId = params?.id as string | undefined;
  const appId = rawId ? decodeURIComponent(rawId) : '';

  const currentApp = useMemo(
    () => ALL_APPLICATIONS.find((a) => a.id === appId) ?? ALL_APPLICATIONS[0],
    [appId],
  );

  const [status, setStatus] = useState<CaseStatus>(currentApp.status);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>(currentApp.priority);
  const [activeTab, setActiveTab] = useState<'timeline' | 'documents' | 'notes'>('timeline');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* ── BACK NAVIGATION ── */}
      <Link
        href="/dashboard/super-admin/applications"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F2A4D] transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="font-medium">{t('backToCases')}</span>
      </Link>

      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('caseLabel')}</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded outline-none border transition-all cursor-pointer ${
                priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
              }`}
            >
              <option value="High">{t('priority.high')}</option>
              <option value="Medium">{t('priority.medium')}</option>
              <option value="Low">{t('priority.low')}</option>
            </select>
          </div>
          <h1 className="text-3xl font-black text-[#0F2A4D] tracking-tight">{currentApp.id}</h1>
          <p className="text-gray-500 font-medium">{currentApp.type} • {currentApp.client}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400">{t_shared('table.status')}:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="text-sm font-bold text-[#0F2A4D] bg-transparent outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="bg-[#0F2A4D] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1a3b66] shadow-lg shadow-blue-900/10 transition-all">
            {t_shared('actions.approve')}
          </button>
        </div>
      </div>

      {/* ── OVERVIEW CARDS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
              <FileText size={120} />
            </div>
            
            <h2 className="text-lg font-bold text-[#0F2A4D] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
              {t('overview.title')}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { label: t('overview.submitted'), value: currentApp.submitted },
                { label: t('overview.updated'), value: currentApp.lastUpdate },
                { label: t('overview.type'), value: currentApp.type },
                { label: t('overview.assigned'), value: currentApp.consultant || t_shared('notAssigned') }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-[#0F2A4D]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-50 px-2 bg-gray-50/50">
              {[
                { id: 'timeline', label: t('tabs.timeline') },
                { id: 'documents', label: t('tabs.documents') },
                { id: 'notes', label: t('tabs.notes') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-xs font-bold transition-all relative ${
                    activeTab === tab.id ? 'text-[#0F2A4D]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F2A4D]" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'timeline' && (
                <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                  {[
                    { title: t('timeline.steps.submitted'), date: currentApp.submitted, done: true },
                    { title: t('timeline.steps.review'), date: 'Mar 04, 2026', done: true },
                    { title: t('timeline.steps.docs'), date: 'Mar 05, 2026', done: false },
                    { title: t('timeline.steps.submit'), date: 'Estimated Mar 20, 2026', done: false }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 relative">
                      <div className={`w-4 h-4 rounded-full border-2 z-10 ${
                        step.done ? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/30' : 'bg-white border-gray-200'
                      }`} />
                      <div>
                        <p className="text-sm font-bold text-[#0F2A4D]">{step.title}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400 font-medium">{t('documents.empty')}</p>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all min-h-[120px]"
                    placeholder={t('notes.placeholder')}
                  />
                  <div className="flex justify-end">
                    <button className="bg-white border border-gray-200 text-[#0F2A4D] px-6 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                      {t('notes.save')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[#0F2A4D] uppercase tracking-widest">{t('clientInfo.title')}</h3>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0F2A4D] flex items-center justify-center text-white font-black text-sm">
                {currentApp.client.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-bold text-[#0F2A4D]">{currentApp.client}</p>
                <p className="text-xs text-gray-400 font-medium">{currentApp.country}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <Mail size={16} className="text-gray-300" />
                {currentApp.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <Phone size={16} className="text-gray-300" />
                {currentApp.phone}
              </div>
            </div>

            <button className="w-full py-3 border border-gray-100 rounded-xl text-xs font-bold text-[#0F2A4D] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group">
              {t('clientInfo.viewProfile')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <h3 className="text-sm font-bold text-[#0F2A4D] uppercase tracking-widest mb-6">{t('quickActions.title')}</h3>
             <div className="space-y-3">
               {[
                 { label: t('quickActions.schedule'), icon: Calendar },
                 { label: t('quickActions.generate'), icon: FileText }
               ].map((action, i) => (
                 <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all text-sm font-bold text-gray-600 hover:text-[#0F2A4D]">
                   <action.icon size={18} className="text-gray-400" />
                   {action.label}
                 </button>
               ))}
               <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-rose-50 hover:bg-rose-50/50 transition-all text-sm font-bold text-rose-600">
                 <AlertCircle size={18} />
                 {t('quickActions.close')}
               </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
