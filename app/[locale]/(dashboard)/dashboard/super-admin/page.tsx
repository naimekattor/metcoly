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
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: DollarSign, trend: 'up' },
  { label: 'Total Users', value: '2,845', change: '+8.2%', icon: Users, trend: 'up' },
  { label: 'Total Consultants', value: '42', change: '+4.1%', icon: UserCheck, trend: 'up' },
  { label: 'Active Bookings', value: '156', change: '-2.4%', icon: Calendar, trend: 'down' },
];

const REVENUE_DATA = [
  { month: 'Jul', value: 45000 },
  { month: 'Aug', value: 52000 },
  { month: 'Sep', value: 48000 },
  { month: 'Oct', value: 61000 },
  { month: 'Nov', value: 55000 },
  { month: 'Dec', value: 67000 },
  { month: 'Jan', value: 72000 },
  { month: 'Feb', value: 81000 },
];

const APPLICATION_STATUS = [
  { label: 'Approved', count: 845, percentage: 65, color: '#10b981' },
  { label: 'Pending', count: 184, percentage: 15, color: '#f59e0b' },
  { label: 'Under Review', count: 122, percentage: 10, color: '#3b82f6' },
  { label: 'Rejected', count: 104, percentage: 10, color: '#ef4444' },
];

const RECENT_BOOKINGS = [
  { id: 'BK-8821', client: 'Sarah Johnson', consultant: 'Marc Davies', date: 'Mar 05, 2026', time: '10:00 AM', status: 'Approved' },
  { id: 'BK-8822', client: 'Ahmed Khan', consultant: 'Elena Popa', date: 'Mar 05, 2026', time: '11:30 AM', status: 'Pending' },
  { id: 'BK-8823', client: 'Sophie Chen', consultant: 'Marc Davies', date: 'Mar 06, 2026', time: '02:00 PM', status: 'Completed' },
  { id: 'BK-8824', client: 'John Brown', consultant: 'Robert Fox', date: 'Mar 06, 2026', time: '04:00 PM', status: 'No Show' },
  { id: 'BK-8825', client: 'Maria Garcia', consultant: 'Elena Popa', date: 'Mar 07, 2026', time: '09:00 AM', status: 'Rejected' },
];

const RECENT_APPLICATIONS = [
  { id: 'APP-102', client: 'James Wilson', type: 'Study Permit', country: 'Canada', date: 'Mar 04, 2026', status: 'Under Review' },
  { id: 'APP-101', client: 'Linda Smith', type: 'Work Permit', country: 'UK', date: 'Mar 04, 2026', status: 'Approved' },
  { id: 'APP-100', client: 'Kevin Lee', type: 'Express Entry', country: 'Canada', date: 'Mar 03, 2026', status: 'Under Review' },
  { id: 'APP-099', client: 'Emma Davis', type: 'Sponsorship', country: 'Australia', date: 'Mar 02, 2026', status: 'Approved' },
];

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

  const filteredBookings = bookingFilter === 'All' 
    ? RECENT_BOOKINGS 
    : RECENT_BOOKINGS.filter(b => b.status === bookingFilter);

  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.value));

  const stats = [
    { label: t('totalRevenue'), value: '$128,430', change: '+12.5%', icon: DollarSign, trend: 'up' },
    { label: t('totalUsers'), value: '2,845', change: '+8.2%', icon: Users, trend: 'up' },
    { label: t('totalConsultants'), value: '42', change: '+4.1%', icon: UserCheck, trend: 'up' },
    { label: t('activeBookings'), value: '156', change: '-2.4%', icon: Calendar, trend: 'down' },
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
              <p className="text-sm text-gray-400">Total revenue increase of 12% from last month</p>
            </div>
            <select className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 outline-none">
              <option>Last 8 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 h-64 px-2">
            {REVENUE_DATA.map((data, idx) => {
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
              { label: t('appBreakdown.stats.approved'), count: 845, percentage: 65, color: '#10b981' },
              { label: t('appBreakdown.stats.inReview'), count: 184, percentage: 15, color: '#3b82f6' },
              { label: t('appBreakdown.stats.rejected'), count: 104, percentage: 10, color: '#ef4444' },
            ].map((status, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-700">{status.label}</span>
                  <span className="text-sm font-bold text-[#0F2A4D]">{status.count}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${status.percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.2, ease: 'easeOut' }}
                    style={{ backgroundColor: status.color }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
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
                        <span className="text-sm font-bold text-gray-900">{booking.client}</span>
                        <span className="text-[10px] text-gray-400">{booking.date} at {booking.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{booking.consultant}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
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
                {RECENT_APPLICATIONS.map((app, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{app.id}</span>
                        <span className="text-[10px] text-gray-400">{app.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">{app.client}</span>
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
    'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'Completed': 'bg-blue-50 text-blue-600 border-blue-100',
    'No Show': 'bg-gray-50 text-gray-500 border-gray-100',
    'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
    'Under Review': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
}
