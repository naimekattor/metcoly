'use client';

import { use } from 'react';
import { Link } from '@/nextInt/navigation';
import { useTranslations } from 'next-intl';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Download, 
  FileText, 
  MessageSquare, 
  Send,
  CreditCard,
  User as UserIcon,
  Calendar,
  AlertCircle
} from 'lucide-react';

type CaseStatus = 'Submitted' | 'Initial Review' | 'Document Verification' | 'Processing' | 'Decision';

interface Message {
  id: string;
  sender: 'You' | 'Officer';
  role: string;
  text: string;
  time: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'You',
    role: 'Applicant',
    text: 'hello',
    time: 'Just now'
  }
];

const MOCK_DOCUMENTS = [
  { name: 'sr3z50swXwLbdzD8gvjVKhNlyxREG0CkuqDnZVFN.pdf', date: 'Feb 22, 2026', size: '0.75 MB' },
  { name: 'lumina.logo.png', date: 'Feb 22, 2026', size: '0.13 MB' },
  { name: 'sr3z50swXwLbdzD8gvjVKhNlyxREG0CkuqDnZVFN.pdf', date: 'Feb 22, 2026', size: '0.75 MB' },
  { name: 'sr3z50swXwLbdzD8gvjVKhNlyxREG0CkuqDnZVFN.pdf', date: 'Feb 22, 2026', size: '0.75 MB' },
  { name: 'sr3z50swXwLbdzD8gvjVKhNlyxREG0CkuqDnZVFN.pdf', date: 'Feb 22, 2026', size: '0.75 MB' },
  { name: 'sr3z50swXwLbdzD8gvjVKhNlyxREG0CkuqDnZVFN.pdf', date: 'Feb 22, 2026', size: '0.75 MB' },
];

export default function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('dashboard');

  const timeline: { status: CaseStatus, date?: string, completed: boolean, current?: boolean }[] = [
    { status: 'Submitted', date: 'February 22, 2026', completed: true },
    { status: 'Initial Review', completed: false, current: true },
    { status: 'Document Verification', completed: false },
    { status: 'Processing', completed: false },
    { status: 'Decision', completed: false },
  ];

  return (
    <div className="min-h-screen  pb-20">
      <div className="">
        
        {/* Header Section */}
        <div className="mb-8">
          <Link 
            href="/dashboard/user/my-cases" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-4 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-[#1b3d6e] uppercase tracking-tight">{id}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Submitted
                </span>
              </div>
              <p className="mt-1 text-gray-500 font-medium tracking-wide">Study Permit</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Application Status (Timeline) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-lg font-bold text-gray-900">Application Status</h2>
                <p className="text-sm text-gray-500 mt-0.5">Track your application progress</p>
              </div>
              <div className="p-8">
                <div className="relative space-y-8">
                  {timeline.map((item, idx) => (
                    <div key={item.status} className="relative flex items-start group">
                      {idx !== timeline.length - 1 && (
                        <div className={`absolute top-8 left-4 -ml-px h-full w-0.5 ${item.completed ? 'bg-green-500' : 'bg-gray-200'}`} aria-hidden="true" />
                      )}
                      <div className="relative flex items-center justify-center h-8 w-8 flex-shrink-0">
                        {item.completed ? (
                          <CheckCircle2 className="h-8 w-8 text-green-500 bg-white rounded-full z-10" />
                        ) : item.current ? (
                          <Clock className="h-8 w-8 text-blue-500 bg-white rounded-full z-10" />
                        ) : (
                          <Circle className="h-8 w-8 text-gray-200 fill-white z-10" />
                        )}
                      </div>
                      <div className="ml-5 min-w-0 flex flex-col">
                        <span className={`text-sm font-bold tracking-tight ${item.completed || item.current ? 'text-gray-900' : 'text-gray-400'}`}>
                          {item.status}
                        </span>
                        {item.date ? (
                          <span className="text-xs text-gray-400 font-medium mt-0.5">{item.date}</span>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium mt-0.5">Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-lg font-bold text-gray-900">Uploaded Documents</h2>
                <p className="text-sm text-gray-500 mt-0.5">View and download your submitted documents</p>
              </div>
              <div className="divide-y divide-gray-100">
                {MOCK_DOCUMENTS.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <FileText className="h-5 w-5 text-[#1b3d6e]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{doc.name}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{doc.date} • {doc.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-[#1b3d6e] hover:bg-white rounded-md transition-all shadow-sm">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Secure Messaging */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-lg font-bold text-gray-900">Secure Messaging</h2>
                <p className="text-sm text-gray-500 mt-0.5">Communication with your immigration officer</p>
              </div>
              
              <div className="p-6 bg-gray-50/50 min-h-[250px] flex flex-col gap-4">
                {MOCK_MESSAGES.map((msg) => (
                  <div key={msg.id} className="flex flex-col items-end gap-1 max-w-[85%] self-end">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-900">{msg.sender}</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{msg.role}</span>
                      <span className="text-[10px] text-gray-400 font-medium ml-2">{msg.time}</span>
                    </div>
                    <div className="bg-[#f0f3f6] rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-700 font-medium leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="relative">
                  <textarea 
                    placeholder="Type your message..."
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3d6e]/20 focus:border-[#1b3d6e] transition-all resize-none pr-12"
                  />
                  <button className="absolute right-2 bottom-2 p-2 bg-[#1b3d6e] text-white rounded-lg hover:bg-[#152e53] transition-colors shadow-lg">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex justify-center">
                   <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1b3d6e] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#152e53] transition-all shadow-md active:scale-95">
                    <Send className="h-3.5 w-3.5" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-8">
            
            {/* Case Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-lg font-bold text-gray-900">Case Information</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'Case ID', value: id, bold: true },
                  { label: 'Service Type', value: 'Study Permit', bold: true },
                  { label: 'Date Submitted', value: 'February 22, 2026', bold: true },
                  { label: 'Est. Completion', value: 'April 23, 2026', bold: true },
                  { label: 'Assigned Officer', value: 'Sarah Johnson', bold: true },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                    <span className={`text-sm ${item.bold ? 'font-bold text-gray-900' : 'text-gray-700'} tracking-tight`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-lg font-bold text-gray-900">Payment</h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Application Fee</span>
                  <span className="text-xl font-bold text-gray-900">$1,200</span>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-700">Payment Required</span>
                </div>

                <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1b3d6e] text-white font-bold text-sm tracking-wide rounded-xl hover:bg-[#152e53] transition-all shadow-lg active:scale-[0.98] group">
                  <CreditCard className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Pay Now
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
