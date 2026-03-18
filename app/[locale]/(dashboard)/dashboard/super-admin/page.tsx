'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  UserCheck, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/nextInt/navigation';
import { analyticsAPI } from '@/lib/api/analytics';
import { bookingsAPI } from '@/lib/api/bookings';
import { applicationsAPI } from '@/lib/api/applications';

// ── Interfaces ───────────────────────────────────────────────────────────────

interface OverviewStats {
  totalUsers: number;
  totalConsultants: number;
  totalClients: number;
  totalApplications: number;
  totalBookings: number;
  totalRevenue: number;
}

interface MonthlyStats {
  revenue: number;
  revenueGrowth: number;
  newApplications: number;
  newBookings: number;
}

interface DashboardData {
  overview: OverviewStats;
  monthly: MonthlyStats;
  applicationsByStatus: Record<string, number>;
  bookingsByStatus: Record<string, number>;
  recentActivity: any[];
}

// ── Components ───────────────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function SuperAdminDashboard() {
  const t = useTranslations('superAdmin.overview');
  const [bookingFilter, setBookingFilter] = useState('All');
  const [applicationSearch, setApplicationSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResult, revResult, bookingsResult, appsResult] = await Promise.allSettled([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getRevenueAnalytics(),
          bookingsAPI.getAllBookings({ limit: 5 }),
          applicationsAPI.getAllApplications({ limit: 4 })
        ]);

        if (statsResult.status === 'fulfilled') {
          setDashboardData(statsResult.value?.data);
          console.log("dashboardData",dashboardData?.applicationsByStatus);
          
        } else {
          console.error('Failed to fetch dashboard stats:', statsResult.reason);
        }

        if (revResult.status === 'fulfilled') {
          const rawData = revResult.value?.data?.revenueByPeriod || [];
          const trendData = rawData.map((r: any) => {
            // Backend returns YYYY-MM, YYYY-MM-DD or YYYY
            let label = r.period;
            try {
              const dateParts = r.period.split('-');
              let date;
              if (dateParts.length === 1) { // YYYY
                date = new Date(parseInt(dateParts[0]), 0, 1);
              } else if (dateParts.length === 2) { // YYYY-MM
                date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, 1);
              } else { // YYYY-MM-DD
                date = new Date(r.period);
              }

              if (!isNaN(date.getTime())) {
                const options: Intl.DateTimeFormatOptions = dateParts.length === 1 
                  ? { year: 'numeric' }
                  : { month: 'short', year: '2-digit' };
                label = new Intl.DateTimeFormat('en-US', options).format(date);
              }
            } catch (e) {
              console.warn('Failed to parse date:', r.period);
            }

            return {
              month: label,
              value: Number(r.total_amount) || 0
            };
          }).reverse();
          setRevenueTrend(trendData);
        } else {
          console.error('Failed to fetch revenue analytics:', revResult.reason);
        }

        if (bookingsResult.status === 'fulfilled') {
          const res = bookingsResult.value;
          const bookingsArray = Array.isArray(res?.data?.bookings) ? res.data.bookings :
                                Array.isArray(res?.data) ? res.data :
                                Array.isArray(res) ? res : [];
          setRecentBookings(bookingsArray);
        } else {
          console.error('Failed to fetch bookings:', bookingsResult.reason);
        }

        if (appsResult.status === 'fulfilled') {
          const res = appsResult.value;
          const appsArray = Array.isArray(res?.data?.applications) ? res.data.applications :
                            Array.isArray(res?.data) ? res.data :
                            Array.isArray(res) ? res : [];
          setRecentApplications(appsArray);
          console.log("appsArray",appsArray);
          
        } else {
          console.error('Failed to fetch applications:', appsResult.reason);
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const filteredBookings = bookingFilter === 'All' 
    ? recentBookings 
    : recentBookings.filter(b => b.bookingStatus === bookingFilter.toUpperCase());

  const filteredApplications = recentApplications.filter(app => {
    const searchLower = applicationSearch.toLowerCase();
    const appNumber = (app.applicationNumber || app.id || '').toLowerCase();
    const clientName = `${app.client?.firstName || ''} ${app.client?.lastName || ''}`.toLowerCase();
    const serviceName = (app.service?.name || '').toLowerCase();
    return appNumber.includes(searchLower) || clientName.includes(searchLower) || serviceName.includes(searchLower);
  });
  

  const maxRevenue = Math.max(...revenueTrend.map(d => d.value), 1);

  const overview = dashboardData?.overview || {} as OverviewStats;
  const monthly = dashboardData?.monthly || {} as MonthlyStats;

  const stats = [
    { label: t('totalRevenue'), value: `$${overview.totalRevenue || 0}`, change: `${monthly.revenueGrowth >= 0 ? '+' : ''}${monthly.revenueGrowth || 0}%`, icon: DollarSign, trend: monthly.revenueGrowth >= 0 ? 'up' : 'down' },
    { label: t('totalUsers'), value: overview.totalUsers || 0, change: '+0%', icon: Users, trend: 'up' },
    { label: t('totalConsultants'), value: overview.totalConsultants || 0, change: '+0%', icon: UserCheck, trend: 'up' },
    { label: t('activeBookings'), value: overview.totalBookings || 0, change: '+0%', icon: Calendar, trend: 'up' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-xl bg-[#0F2A4D]/5 text-[#0F2A4D]">
                <stat.icon size={22} />
              </div>
              {/* <div className={`flex items-center gap-0.5 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div> */}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
            
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1  gap-6">
        

        <motion.div variants={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('appBreakdown.title')}</h3>
  <p className="text-sm text-gray-400 mb-8">{t('appBreakdown.subtitle')} {overview.totalApplications || 0}</p>
  
  <div className="space-y-6">
    {[
      { 
        label: 'Approved', 
        key: 'APPROVED',
        count: recentApplications.filter(app => app.status === 'APPROVED').length, 
        color: '#10b981' 
      },
      { 
        label: 'Submitted', 
        key: 'SUBMITTED',
        count: recentApplications.filter(app => app.status === 'SUBMITTED').length, 
        color: '#8b5cf6'  // Purple
      },
      { 
        label: 'Under Review', 
        key: 'UNDER_REVIEW',
        count: recentApplications.filter(app => app.status === 'UNDER_REVIEW').length, 
        color: '#3b82f6'  // Blue
      },
      { 
        label: 'Documents Missing', 
        key: 'DOCUMENTS_MISSING',
        count: recentApplications.filter(app => app.status === 'DOCUMENTS_MISSING').length, 
        color: '#f59e0b'  // Amber
      },
      { 
        label: 'Processing', 
        key: 'PROCESSING',
        count: recentApplications.filter(app => app.status === 'PROCESSING').length, 
        color: '#6366f1'  // Indigo
      },
      { 
        label: 'Draft', 
        key: 'DRAFT',
        count: recentApplications.filter(app => app.status === 'DRAFT').length, 
        color: '#9ca3af'  // Gray
      },
      { 
        label: 'Rejected', 
        key: 'REJECTED',
        count: recentApplications.filter(app => app.status === 'REJECTED').length, 
        color: '#ef4444'  // Red
      },
      { 
        label: 'Closed', 
        key: 'CLOSED',
        count: recentApplications.filter(app => app.status === 'CLOSED').length, 
        color: '#6b7280'  // Dark Gray
      },
    ].map((status, idx) => {
      const totalApplications = recentApplications.length;
      const percentage = totalApplications ? Math.round((status.count / totalApplications) * 100) : 0;
      
      return (
        <div key={idx} className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-gray-700">{status.label}</span>
            <span className="text-sm font-bold text-[#0F2A4D]">{status.count}</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: idx * 0.2, ease: 'easeOut' }}
              style={{ backgroundColor: status.color }}
              className="h-full rounded-full"
            />
          </div>
        </div>
      );
    })}
  </div>
</motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── RECENT BOOKINGS TABLE ── */}
        <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">{t('recentBookings')}</h3>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['All', 'Pending', 'Approved', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBookingFilter(tab)}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                    bookingFilter === tab ? 'bg-white text-[#0F2A4D] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Client</th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Consultant</th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((booking, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{booking.client?.firstName} {booking.client?.lastName}</span>
                        <span className="text-[10px] text-gray-400">{new Date(booking.startTime).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{booking.consultant?.firstName} {booking.consultant?.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.bookingStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400">
                      <button className="p-2 hover:bg-white rounded-lg hover:text-[#0F2A4D] transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-50 text-center">
            <button className="text-xs font-bold text-[#0F2A4D] hover:underline flex items-center justify-center gap-1 mx-auto">
              {t('viewAll')} <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* ── RECENT APPLICATIONS TABLE ── */}
        <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">{t('recentApplications')}</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search cases..." 
                value={applicationSearch}
                onChange={(e) => setApplicationSearch(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#0F2A4D] w-48 transition-all"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Application</th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Client</th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredApplications.map((app, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{app.applicationNumber || app.id.substring(0, 8)}</span>
                        <span className="text-[10px] text-gray-400">{app.service?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">{app.client?.firstName} {app.client?.lastName}</span>
                        <span className="text-[10px] text-gray-400">{app.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400">
                      <button className="p-2 hover:bg-white rounded-lg hover:text-[#0F2A4D] transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-50 text-center">
            <button className="text-xs font-bold text-[#0F2A4D] hover:underline flex items-center justify-center gap-1 mx-auto">
              {t('viewAll')} <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'APPROVED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'CONFIRMED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'PENDING': 'bg-amber-50 text-amber-600 border-amber-100',
    'COMPLETED': 'bg-blue-50 text-blue-600 border-blue-100',
    'NO_SHOW': 'bg-gray-50 text-gray-500 border-gray-100',
    'REJECTED': 'bg-rose-50 text-rose-600 border-rose-100',
    'UNDER_REVIEW': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'SUBMITTED': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
