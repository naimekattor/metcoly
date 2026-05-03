'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/nextInt/navigation';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { applicationsAPI } from '@/lib/api/applications';
import { useAuthStore } from '@/store/authStore';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Plus,
  Clock,
  Activity,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────────────────────
type Status   = 'In Progress' | 'Under Review' | 'Completed' | 'Pending Documents' | 'Submitted' | 'Approved' | 'Rejected' | 'Pending' | string;

type Case = {
  id: string;
  type: string;
  status: Status;
  submittedDate: string;
  timeAgo: string;
};

type ActivityItem = {
  id: string;
  message: string;
  time: string;
};

const STATUS_STYLES: Record<string, string> = {
  Submitted: 'bg-blue-100 text-blue-700',
  'In Review': 'bg-yellow-100 text-yellow-700',
  Approved:   'bg-green-100 text-green-700',
  Rejected:   'bg-red-100 text-red-700',
  Pending:    'bg-gray-100 text-gray-600',
  'Pending Documents': 'bg-orange-100 text-orange-700',
};

// Helper for formatting relative time
function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
}

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
  const { user } = useAuthStore();
  
  const [cases, setCases] = useState<Case[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats derived from actual cases
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await applicationsAPI.getMyApplications();
      
      // Map API response to our UI type
      // Check the exact structure your API returns. Here we expect an array in res.data or res
      const applications = Array.isArray(res.data?.applications) 
        ? res.data.applications 
        : (Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
      
      let calculatedTotalSpent = 0;
      let allActivities: any[] = [];

      const mappedCases = applications.map((app: any) => {
        const date = new Date(app.createdAt || new Date());
        
        // Calculate total spent from PAID payments
        if (app.payments && Array.isArray(app.payments)) {
          app.payments.forEach((payment: any) => {
            if (payment.status === 'PAID') {
              calculatedTotalSpent += Number(payment.amount) || 0;
            }
          });
        }

        // Collect activities
        if (app.statusHistory && Array.isArray(app.statusHistory)) {
          app.statusHistory.forEach((history: any) => {
            allActivities.push({
              id: history.id,
              message: `Case #${app.applicationNumber || app.id.slice(0, 8).toUpperCase()} moved to ${history.newStatus.replace('_', ' ')}`,
              time: timeSince(new Date(history.changedAt)),
              rawDate: new Date(history.changedAt)
            });
          });
        }

        return {
          id: app.applicationId || app.id || 'N/A',
          type: app.service?.name || app.type || 'General Application',
          status: app.status || 'Submitted',
          submittedDate: date.toLocaleDateString(),
          timeAgo: timeSince(date),
        };
      });
      
      allActivities.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
      
      setCases(mappedCases);
      setTotalSpent(calculatedTotalSpent);
      setRecentActivities(allActivities.slice(0, 2).map(a => ({ id: a.id, message: a.message, time: a.time })));
    } catch (err: any) {
      console.error('Failed to load cases:', err);
      toast.error('Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeCases = cases.filter(c => c.status !== 'Completed' && c.status !== 'Approved' && c.status !== 'Rejected').length;
  // Pending actions could be defined by "Pending Documents" or similar status
  const pendingActions = cases.filter(c => c.status === 'Pending Documents' || c.status === 'docsRequired').length;
  const completedCases = cases.filter(c => c.status === 'Completed' || c.status === 'Approved').length;

  const stats = [
    { label: t('stats.activeCases'),     value: activeCases,   icon: FileText,    iconColor: 'text-gray-400'   },
    { label: t('stats.pendingActions'),  value: pendingActions,   icon: AlertCircle, iconColor: 'text-yellow-500' },
    { label: t('stats.completed'),       value: completedCases,   icon: CheckCircle2,iconColor: 'text-green-500'  },
    { label: t('stats.totalSpent'),      value: `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,icon: CreditCard,  iconColor: 'text-gray-400'   }, 
  ];
  
  // Sort by newest for Recent Cases
  const recentCases = [...cases].slice(0, 5);

  return (
    <div className="min-h-screen ">
      <div className="">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t('welcome')}, <span className="text-[#1b3d6e]">{user?.firstName || 'User'}</span>
            </h1>
            <p className="mt-1 text-gray-500 text-sm">{t('subtitle')}</p>
          </div>
          <Link
            href="/dashboard/user/my-cases/new"
            className="inline-flex items-center gap-2 bg-[#1b3d6e] hover:bg-[#152f56] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow-sm flex-shrink-0"
          >
            <Plus size={16} /> {t('cases.submitNew')}
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
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-base">{t('recentCases.title')}</h2>
              <Link
                href="/dashboard/user/my-cases"
                className="inline-flex items-center gap-1 text-sm text-[#1b3d6e] font-medium hover:underline"
              >
                {t('recentCases.viewAll')} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Cases list */}
            <div className="divide-y divide-gray-50 flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1b3d6e]" />
                </div>
              ) : recentCases.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400 text-sm">
                  {t('recentCases.empty')}
                </div>
              ) : (
                recentCases.map((c) => (
                  <Link
                    key={c.id}
                    href={`/dashboard/user/my-cases/${c.id}`}
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
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-600'}`}>
                      {c.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity — takes 1/3 */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-base">{t('activity.title')}</h2>
              <p className="text-gray-400 text-xs mt-0.5">{t('activity.subtitle')}</p>
            </div>

            {/* Activity list */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {recentActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Activity size={24} className="text-gray-300" />
                  <p className="text-gray-400 text-sm">{t('activity.empty')}</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {recentActivities.map((item) => (
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