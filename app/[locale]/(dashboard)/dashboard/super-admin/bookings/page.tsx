'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const BOOKINGS = [
  { id: 'BK-8821', client: 'Sarah Johnson', email: 'sarah.j@example.com', service: 'Initial Consultation', date: 'Mar 05, 2026', time: '10:00 AM', status: 'Approved', amount: '$150' },
  { id: 'BK-8822', client: 'Ahmed Khan', email: 'ahmed.k@example.com', service: 'Study Permit Review', date: 'Mar 05, 2026', time: '11:30 AM', status: 'Pending', amount: '$200' },
  { id: 'BK-8823', client: 'Sophie Chen', email: 'sophie.c@example.com', service: 'Work Permit Assessment', date: 'Mar 06, 2026', time: '02:00 PM', status: 'Completed', amount: '$180' },
  { id: 'BK-8824', client: 'John Brown', email: 'j.brown@example.com', service: 'PR Points Calculation', date: 'Mar 06, 2026', time: '04:00 PM', status: 'No Show', amount: '$120' },
  { id: 'BK-8825', client: 'Maria Garcia', email: 'm.garcia@example.com', service: 'Spousal Sponsorship', date: 'Mar 07, 2026', time: '09:00 AM', status: 'Rejected', amount: '$250' },
  { id: 'BK-8826', client: 'David Wilson', email: 'd.wilson@example.com', service: 'Business Visa Info', date: 'Mar 08, 2026', time: '11:00 AM', status: 'Approved', amount: '$300' },
  { id: 'BK-8827', client: 'Elena Popa', email: 'e.popa@example.com', service: 'Citizenship Prep', date: 'Mar 09, 2026', time: '03:30 PM', status: 'Pending', amount: '$150' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function BookingsPage() {
  const t = useTranslations('superAdmin.bookings');
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = BOOKINGS.filter(booking => {
    const matchesFilter = filter === 'All' || booking.status === filter;
    const matchesSearch = booking.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-500">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={18} /> {t('export')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2A4D] rounded-xl text-sm font-semibold text-white hover:bg-[#1b3d6e] transition-colors shadow-lg shadow-blue-900/10">
            <Plus size={18} /> {t('newBooking')}
          </button>
        </div>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <motion.div variants={item} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                filter === tab ? 'bg-white text-[#0F2A4D] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative flex-1 md:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder={t('search')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0F2A4D]/10 focus:border-[#0F2A4D] transition-all"
          />
        </div>
      </motion.div>

      {/* ── BOOKINGS TABLE ── */}
      <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.info')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.client')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.service')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.amount')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.status')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#0F2A4D]">{booking.id}</span>
                      <span className="text-xs text-gray-400">{booking.date} at {booking.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{booking.client}</span>
                      <span className="text-xs text-gray-400">{booking.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-medium">{booking.service}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                    {booking.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-[#0F2A4D]/5 rounded-lg text-gray-400 hover:text-[#0F2A4D]" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600" title="Approve">
                        <CheckCircle2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600" title="Reject">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Showing {filteredBookings.length} of {BOOKINGS.length} bookings</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-[#0F2A4D] disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 text-xs font-bold text-[#0F2A4D] hover:bg-[#0F2A4D]/5 rounded-lg">Next</button>
          </div>
        </div>
      </motion.div>
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
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
}
