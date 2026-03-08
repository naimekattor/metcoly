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
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, revRes, bookingsRes, appsRes] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getRevenueAnalytics(),
          bookingsAPI.getAllBookings({ limit: 5 }),
          applicationsAPI.getAllApplications({ limit: 4 })
        ]);

        setDashboardData(statsRes.data);
        setRevenueTrend((revRes.data?.revenueByPeriod || []).map((r: any) => ({
          month: r.period,
          value: Number(r.total_amount)
        })).reverse());
        setRecentBookings(bookingsRes.data?.bookings || []);
        setRecentApplications(appsRes.data?.applications || []);
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

  const maxRevenue = Math.max(...revenueTrend.map(d => d.value), 1);

  const overview = dashboardData?.overview || {};
  const monthly = dashboardData?.monthly || {};

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── REVENUE BAR CHART (PURE CSS) ── */}
        <motion.div variants={item} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t('revenueGrowth')}</h3>
              <p className="text-sm text-gray-400">Total revenue growth from last month: {monthly.revenueGrowth || 0}%</p>
            </div>
            <select className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 outline-none">
              <option>Recent Trend</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 h-64 px-2 relative">
            {revenueTrend.length === 0 && !loading && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                No revenue data available.
              </div>
            )}
            {revenueTrend.map((data, idx) => {
              const heightPercentage = (data.value / maxRevenue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full relative group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercentage}%` }}
                      transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                      className="w-full bg-[#0F2A4D] rounded-t-lg group-hover:bg-[#c9a84c] transition-colors relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ${data.value.toLocaleString()}
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{data.month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── APPLICATION BREAKDOWN ── */}
        <motion.div variants={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t('appBreakdown.title')}</h3>
          <p className="text-sm text-gray-400 mb-8">{t('appBreakdown.subtitle')}</p>
          
          <div className="space-y-6">
            {[
              { label: t('appBreakdown.stats.approved'), count: dashboardData?.applicationsByStatus?.APPROVED || 0, color: '#10b981' },
              { label: t('appBreakdown.stats.inReview'), count: (dashboardData?.applicationsByStatus?.UNDER_REVIEW || 0) + (dashboardData?.applicationsByStatus?.SUBMITTED || 0), color: '#3b82f6' },
              { label: t('appBreakdown.stats.rejected'), count: dashboardData?.applicationsByStatus?.REJECTED || 0, color: '#ef4444' },
            ].map((status, idx) => {
              const percentage = overview.totalApplications ? Math.round((status.count / overview.totalApplications) * 100) : 0;
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
            )})}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-xs text-gray-500 font-medium">85% Approval Rate</span>
            </div>
            <Link href="/dashboard/super-admin/applications" className="text-xs text-[#c9a84c] font-bold hover:underline">
              {t('viewAll')}
            </Link>
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
                {recentApplications.map((app, idx) => (
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
