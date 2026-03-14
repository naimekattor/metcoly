'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/nextInt/navigation';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Calendar, CheckCircle2, AlertCircle, Clock,
  FileText, Mail, Phone, ArrowRight, Download, Eye, Trash2,
  Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { applicationsAPI } from '@/lib/api/applications';
import { documentsAPI } from '@/lib/api/documents';

type CaseStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENTS_MISSING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'CLOSED';

export default function ConsultantApplicationDetailPage() {
  const t = useTranslations('admin.applications.caseDetails');
  const t_shared = useTranslations('admin.applications');
  const locale = useLocale();
  const params = useParams();
  const rawId = params?.caseId as string | undefined;
  const caseId = rawId ? decodeURIComponent(rawId) : '';

  const [currentApp, setCurrentApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<CaseStatus | ''>('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [activeTab, setActiveTab] = useState<'timeline' | 'documents' | 'notes'>('timeline');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchApp = async () => {
    if (!caseId) return;
    try {
      setLoading(true);
      const res = await applicationsAPI.getApplication(caseId);
      const appData = res?.data?.application || res?.data || res;
      setCurrentApp(appData);
      setStatus(appData?.status || '');
      setPriority(appData?.priority || 'Medium');
    } catch (error) {
      console.error('Failed to fetch application details:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApp();
  }, [caseId]);

  const handleStatusChange = async (newStatus: CaseStatus) => {
    setStatus(newStatus);
    try {
      setUpdatingStatus(true);
      const res = await applicationsAPI.updateStatus(caseId, newStatus, 'Status updated by consultant');
      if (res.status === 'success') {
        toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
        fetchApp(); // Refresh to get history
      }
    } catch (error: any) {
      console.error('Failed to update status', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
      setStatus(currentApp?.status || '');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const blob = await documentsAPI.downloadDocument(docId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download document:', error);
      toast.error('Download failed');
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await documentsAPI.deleteDocument(docId);
      toast.success('Document deleted');
      fetchApp();
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;
    try {
      setSavingNote(true);
      const res = await applicationsAPI.addNote(caseId, noteContent);
      if (res.status === 'success') {
        toast.success('Note added successfully');
        setNoteContent('');
        fetchApp();
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const STATUS_OPTIONS: CaseStatus[] = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_MISSING', 'PROCESSING', 'APPROVED', 'REJECTED', 'CLOSED'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F2A4D]"></div>
      </div>
    );
  }

  if (!currentApp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Application not found</p>
        <Link href="/dashboard/consultant/applications" className="text-[#0F2A4D] font-bold hover:underline">
          Go back to applications
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* ── BACK NAVIGATION ── */}
      <Link
        href="/dashboard/consultant/applications"
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
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
              priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' :
              priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              {priority === 'High' ? t('priority.high') : priority === 'Medium' ? t('priority.medium') : t('priority.low')}
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#0F2A4D] tracking-tight">{currentApp.applicationNumber || currentApp.id.substring(0, 8).toUpperCase()}</h1>
          <p className="text-gray-500 font-medium">{currentApp.service?.name || 'N/A'} • {currentApp.client?.firstName} {currentApp.client?.lastName}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400">{t_shared('table.status')}:</span>
              <select
                value={status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
                className="text-sm font-bold text-[#0F2A4D] bg-transparent outline-none cursor-pointer disabled:opacity-50"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            onClick={() => handleStatusChange('APPROVED')}
            disabled={status === 'APPROVED' || updatingStatus}
            className="bg-[#0F2A4D] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1a3b66] shadow-lg shadow-blue-900/10 transition-all disabled:opacity-50"
          >
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
                { label: t('overview.submitted'), value: currentApp.submittedAt ? new Date(currentApp.submittedAt).toLocaleDateString() : 'Draft' },
                { label: t('overview.updated'), value: currentApp.updatedAt ? new Date(currentApp.updatedAt).toLocaleDateString() : 'N/A' },
                { label: t('overview.type'), value: currentApp.service?.name || 'N/A' },
                { label: t('overview.assigned'), value: currentApp.consultant?.firstName ? `${currentApp.consultant.firstName} ${currentApp.consultant.lastName}` : 'Unassigned' }
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
                    <motion.div layoutId="consultantActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F2A4D]" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'timeline' && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100"
                  >
                    {[
                      { title: t('timeline.steps.submitted'), date: currentApp.submittedAt ? new Date(currentApp.submittedAt).toLocaleDateString() : 'Pending', done: !!currentApp.submittedAt },
                      { title: t('timeline.steps.review'), date: currentApp.assignedAt ? new Date(currentApp.assignedAt).toLocaleDateString() : 'Pending', done: !!currentApp.assignedAt },
                      { title: t('timeline.steps.docs'), date: currentApp.lastStatusChangeAt ? new Date(currentApp.lastStatusChangeAt).toLocaleDateString() : 'Pending', done: ['DOCUMENTS_MISSING', 'PROCESSING', 'APPROVED'].includes(currentApp.status) },
                      { title: t('timeline.steps.submit'), date: currentApp.status === 'APPROVED' ? 'Approved' : 'Pending', done: currentApp.status === 'APPROVED' }
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
                    
                    {/* Add dynamic history link if needed, but matching super-admin exactly means this fixed list */}
                  </motion.div>
                )}

                {activeTab === 'documents' && (
                  <motion.div
                    key="documents"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    {(!currentApp.documents || currentApp.documents.length === 0) ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Paperclip className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">{t('documents.empty')}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentApp.documents.map((doc: any) => (
                          <div key={doc.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-blue-500/30 hover:bg-white transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-blue-500 shadow-sm">
                                <FileText size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#0F2A4D] truncate max-w-[150px]">{doc.fileName}</span>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {formatFileSize(Number(doc.fileSize))} • {new Date(doc.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleDownload(doc.id, doc.fileName)}
                                className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    {/* New Note Form */}
                    <div className="space-y-4">
                      <textarea 
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all min-h-[120px]"
                        placeholder={t('notes.placeholder')}
                        disabled={savingNote}
                      />
                      <div className="flex justify-end">
                        <button 
                          onClick={handleSaveNote}
                          disabled={savingNote || !noteContent.trim()}
                          className="bg-white border border-gray-200 text-[#0F2A4D] px-6 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {savingNote ? 'Saving...' : t('notes.save')}
                        </button>
                      </div>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-4 mt-8">
                      {currentApp.notes?.length > 0 ? (
                        currentApp.notes.map((note: any) => (
                          <div key={note.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-[#0F2A4D] uppercase">
                                {note.consultant?.firstName || 'Me'} {note.consultant?.lastName || ''}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(note.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{note.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-400 text-sm py-8">{t('notes.empty')}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[#0F2A4D] uppercase tracking-widest">{t('clientInfo.title')}</h3>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0F2A4D] flex items-center justify-center text-white font-black text-sm uppercase">
                {currentApp.client?.firstName?.[0] || ''}{currentApp.client?.lastName?.[0] || ''}
              </div>
              <div>
                <p className="font-bold text-[#0F2A4D]">{currentApp.client?.firstName} {currentApp.client?.lastName}</p>
                <p className="text-xs text-gray-400 font-medium">{currentApp.country || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <Mail size={16} className="text-gray-300" />
                {currentApp.client?.email || 'N/A'}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <Phone size={16} className="text-gray-300" />
                 {currentApp.formData?.phone || currentApp.client?.phone || 'N/A'}
              </div>
            </div>

            {/* <button className="w-full py-3 border border-gray-100 rounded-xl text-xs font-bold text-[#0F2A4D] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group">
              {t('clientInfo.viewProfile')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button> */}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <h3 className="text-sm font-bold text-[#0F2A4D] uppercase tracking-widest mb-6">{t('quickActions.title')}</h3>
             <div className="space-y-3">
               <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all text-sm font-bold text-gray-600 hover:text-[#0F2A4D]">
                 <Calendar size={18} className="text-gray-400" />
                 {t('quickActions.schedule')}
               </button>
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

