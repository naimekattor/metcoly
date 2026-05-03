'use client';

import { use, useEffect, useState } from 'react';
import { Link } from '@/nextInt/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  CreditCard,
  Calendar,
  AlertCircle,
  Loader2,
  User as UserIcon,
  Hash,
  Tag,
  Globe,
  Upload,
  X,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { applicationsAPI } from '@/lib/api/applications';
import { paymentsAPI } from '@/lib/api/payments';
import { documentsAPI } from '@/lib/api/documents';

// Backend status → display label
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
  Draft:             'bg-gray-100 text-gray-700 border border-gray-200',
  Submitted:         'bg-blue-100 text-blue-700 border border-blue-200',
  'Under Review':    'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'Pending Documents': 'bg-orange-100 text-orange-700 border border-orange-200',
  'In Progress':     'bg-indigo-100 text-indigo-700 border border-indigo-200',
  Approved:          'bg-green-100 text-green-700 border border-green-200',
  Rejected:          'bg-red-100 text-red-700 border border-red-200',
  Closed:            'bg-gray-100 text-gray-600 border border-gray-200',
};

// Timeline steps in order
const TIMELINE_STEPS = [
  { key: 'DRAFT',             label: 'Draft Created' },
  { key: 'SUBMITTED',        label: 'Submitted' },
  { key: 'UNDER_REVIEW',     label: 'Under Review' },
  { key: 'DOCUMENTS_MISSING',label: 'Documents Requested' },
  { key: 'PROCESSING',       label: 'Processing' },
  { key: 'APPROVED',         label: 'Approved' },
];

const STATUS_ORDER: Record<string, number> = {
  DRAFT: 0, SUBMITTED: 1, UNDER_REVIEW: 2,
  DOCUMENTS_MISSING: 3, PROCESSING: 4, APPROVED: 5, REJECTED: 5, CLOSED: 5,
};

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatBytes(bytes: number | bigint) {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

const PREDEFINED_DOC_TYPES = [
  "Passport Copy",
  "Passport Size Photo",
  "Birth Certificate",
  "Education Certificate",
  "Employment Letter",
  "Financial Documents"
];

export default function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payingNow, setPayingNow] = useState(false);

  // Upload state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await applicationsAPI.getApplication(id);
        setApplication(res.data?.application ?? res.data ?? res);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to load application.');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handlePayNow = async () => {
    try {
      setPayingNow(true);
      const res = await paymentsAPI.createSession({ applicationId: id, paymentType: 'PROCESSING' });
      const url = res.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error('Could not generate a payment link. Please try again.');
        setPayingNow(false);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Payment initiation failed.');
      setPayingNow(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return toast.error('Please select a file');
    if (!uploadType.trim()) return toast.error('Please specify a document type');

    try {
      setIsUploading(true);
      await documentsAPI.uploadDocument(uploadFile, id, uploadType);
      toast.success('Document uploaded successfully');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadType('');
      // Refresh application data
      const res = await applicationsAPI.getApplication(id);
      setApplication(res.data?.application ?? res.data ?? res);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const openResubmitModal = (docType: string) => {
    setUploadType(docType);
    setUploadFile(null);
    setIsUploadModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1b3d6e]" size={40} />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <AlertCircle size={48} />
        <p className="font-semibold text-lg">Application not found.</p>
        <Link href="/dashboard/user/my-cases" className="text-[#1b3d6e] underline font-medium">
          Back to My Cases
        </Link>
      </div>
    );
  }

  const statusKey = application.status;
  const statusLabel = STATUS_LABEL[statusKey] || statusKey;
  const currentOrder = STATUS_ORDER[statusKey] ?? 0;
  const isPaid = application.payments?.some((p: any) => p.status === 'PAID' || p.status === 'PENDING');
  const paymentStatus = application.payments?.find((p: any) => p.status === 'PAID')
    ? 'PAID'
    : application.payments?.find((p: any) => p.status === 'PENDING')
    ? 'PROCESSING'
    : null;
  const latestPayment = application.payments?.[0];
  const documents = application.documents ?? [];
  const consultant = application.consultant;
  const service = application.service;

  return (
    <div className="min-h-screen pb-20">
      <div>

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/user/my-cases"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-4 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to My Cases
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3d6e] tracking-tight font-mono">
                  #{application.applicationNumber || id.slice(0, 8).toUpperCase()}
                </h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[statusLabel] || 'bg-gray-100 text-gray-600'}`}>
                  {statusLabel}
                </span>
              </div>
              <p className="mt-1 text-gray-500 font-medium">{service?.name || 'General Application'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Main Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-lg font-bold text-gray-900">Application Timeline</h2>
                <p className="text-sm text-gray-500 mt-0.5">Track your application progress and history</p>
              </div>
              <div className="p-8">
                <div className="relative space-y-8">
                  {[
                    ...(application.statusHistory || []).map((h: any) => ({
                      key: h.id,
                      label: STATUS_LABEL[h.newStatus] || h.newStatus.replace('_', ' '),
                      date: h.changedAt,
                      completed: true,
                      current: h.newStatus === application.status
                    })),
                    // Always show the creation event
                    {
                      key: 'creation',
                      label: 'Application Created',
                      date: application.createdAt,
                      completed: true,
                      current: application.status === 'DRAFT' && (!application.statusHistory || application.statusHistory.length === 0)
                    }
                  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((step, idx, arr) => (
                    <div key={step.key} className="relative flex items-start">
                      {idx !== arr.length - 1 && (
                        <div className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-100" />
                      )}
                      <div className="relative flex items-center justify-center h-8 w-8 flex-shrink-0">
                        {step.current ? (
                          <Clock className="h-8 w-8 text-[#1b3d6e] bg-white rounded-full z-10 p-1 border-2 border-[#1b3d6e]" />
                        ) : (
                          <CheckCircle2 className="h-8 w-8 text-green-500 bg-white rounded-full z-10" />
                        )}
                      </div>
                      <div className="ml-5 min-w-0 flex flex-col flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-900">{step.label}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{formatDate(step.date)}</span>
                        </div>
                        {step.current && (
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Current Status</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Uploaded Documents</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{documents.length} file{documents.length !== 1 ? 's' : ''} submitted</p>
                </div>
                <button
                  onClick={() => {
                    setUploadType('');
                    setUploadFile(null);
                    setIsUploadModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1b3d6e]/10 text-[#1b3d6e] text-sm font-bold rounded-lg hover:bg-[#1b3d6e]/20 transition-colors"
                >
                  <Upload size={16} />
                  Upload Document
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {documents.length === 0 ? (
                  <div className="px-6 py-10 text-center text-gray-400 text-sm">No documents uploaded yet.</div>
                ) : (
                  documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <FileText className="h-5 w-5 text-[#1b3d6e]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{doc.fileName}</p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">
                            {formatDate(doc.uploadedAt)} • {doc.fileSize ? formatBytes(doc.fileSize) : '—'} • {doc.documentType || 'Document'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openResubmitModal(doc.documentType || 'Document')}
                        title="Resubmit this document"
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <RefreshCw size={14} />
                        Resubmit
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">

            {/* Case Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-lg font-bold text-gray-900">Case Information</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'Case ID', value: application.applicationNumber || id.slice(0, 8).toUpperCase(), icon: Hash },
                  { label: 'Service', value: service?.name || '—', icon: Tag },
                  { label: 'Country', value: application.country || '—', icon: Globe },
                  {
                    label: application.submittedAt ? 'Submitted' : 'Applied',
                    value: formatDate(application.submittedAt) !== '—'
                      ? formatDate(application.submittedAt)
                      : formatDate(application.createdAt),
                    icon: Calendar,
                  },
                  { label: 'Assigned Officer', value: consultant ? `${consultant.firstName} ${consultant.lastName}` : 'Not yet assigned', icon: UserIcon },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-lg font-bold text-gray-900">Payment</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Application Fee</span>
                  <span className="text-xl font-bold text-gray-900">
                    {service?.basePrice
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency || 'USD', minimumFractionDigits: 0 }).format(service.basePrice)
                      : '—'}
                  </span>
                </div>

                {paymentStatus === 'PAID' ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-green-700 block">Payment Complete</span>
                      {latestPayment?.paidAt && (
                        <span className="text-xs text-green-600">{formatDate(latestPayment.paidAt)}</span>
                      )}
                    </div>
                  </div>
                ) : paymentStatus === 'PROCESSING' ? (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <Loader2 className="h-4 w-4 text-blue-500 flex-shrink-0 animate-spin" />
                    <div>
                      <span className="text-xs font-bold text-blue-700 block">Payment Processing</span>
                      <span className="text-xs text-blue-500">Stripe confirmation pending</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <span className="text-xs font-bold text-amber-700">Payment Required</span>
                    </div>
                    <button
                      onClick={handlePayNow}
                      disabled={payingNow}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1b3d6e] text-white font-bold text-sm tracking-wide rounded-xl hover:bg-[#152e53] transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
                    >
                      {payingNow ? <Loader2 className="animate-spin" size={18} /> : <CreditCard className="h-4 w-4" />}
                      {payingNow ? 'Redirecting...' : 'Pay Now'}
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Upload Document</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Type</label>
                <select
                  required
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] bg-white"
                >
                  <option value="" disabled>Select Document Type</option>
                  {PREDEFINED_DOC_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  {uploadType && !PREDEFINED_DOC_TYPES.includes(uploadType) && (
                    <option value={uploadType}>{uploadType}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select File</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1b3d6e]/5 file:text-[#1b3d6e] hover:file:bg-[#1b3d6e]/10 cursor-pointer"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading || !uploadFile || !uploadType.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1b3d6e] text-white text-sm font-bold rounded-xl hover:bg-[#152e53] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {isUploading ? 'Uploading...' : 'Upload Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
