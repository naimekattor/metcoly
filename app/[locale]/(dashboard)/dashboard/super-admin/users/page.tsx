'use client';

import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  MoreVertical, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ShieldAlert,
  Edit2,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const USERS = [
  { id: 'USR-001', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 234 567 8901', role: 'CLIENT', status: 'Active', joined: 'Jan 15, 2026' },
  { id: 'USR-002', name: 'Marc Davies', email: 'm.davies@metcoly.com', phone: '+1 234 567 8902', role: 'CONSULTANT', status: 'Active', joined: 'Dec 10, 2025' },
  { id: 'USR-003', name: 'Ahmed Khan', email: 'ahmed.k@example.com', phone: '+1 234 567 8903', role: 'CLIENT', status: 'Active', joined: 'Feb 01, 2026' },
  { id: 'USR-004', name: 'Elena Popa', email: 'e.popa@metcoly.com', phone: '+1 234 567 8904', role: 'CONSULTANT', status: 'Active', joined: 'Jan 20, 2026' },
  { id: 'USR-005', name: 'John Brown', email: 'j.brown@example.com', phone: '+1 234 567 8905', role: 'CLIENT', status: 'Inactive', joined: 'Feb 15, 2026' },
  { id: 'USR-006', name: 'Robert Fox', email: 'r.fox@metcoly.com', phone: '+1 234 567 8906', role: 'CONSULTANT', status: 'Active', joined: 'Mar 01, 2026' },
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

export default function UsersPage() {
  const t = useTranslations('superAdmin.users');
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = USERS.filter(user => {
    const matchesTab = activeTab === 'All' || 
                       (activeTab === 'Consultants' && user.role === 'CONSULTANT') ||
                       (activeTab === 'Clients' && user.role === 'CLIENT');
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
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
            <Download size={18} /> {useTranslations('superAdmin.bookings')('export')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2A4D] rounded-xl text-sm font-semibold text-white hover:bg-[#1b3d6e] transition-colors shadow-lg">
            <UserPlus size={18} /> {t('createConsultant')}
          </button>
        </div>
      </div>

      {/* ── STATS OVERVIEW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: t('stats.total'), value: USERS.length, icon: UsersIcon, color: 'blue' },
          { label: t('stats.consultants'), value: USERS.filter(u => u.role === 'CONSULTANT').length, icon: ShieldCheck, color: 'emerald' },
          { label: t('stats.clients'), value: USERS.filter(u => u.role === 'CLIENT').length, icon: UsersIcon, color: 'amber' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <motion.div variants={item} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          {['All', 'Clients', 'Consultants'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                activeTab === tab ? 'bg-white text-[#0F2A4D] shadow-sm' : 'text-gray-400 hover:text-gray-600'
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
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0F2A4D]/10 focus:border-[#0F2A4D] transition-all"
          />
        </div>
      </motion.div>

      {/* ── USERS TABLE ── */}
      <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.user')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.contact')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.role')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.joined')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.status')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0F2A4D]/5 text-[#0F2A4D] flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{user.name}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase">{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail size={12} className="text-gray-300" /> {user.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone size={12} className="text-gray-300" /> {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      user.role === 'CONSULTANT' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${
                      user.status === 'Active' ? 'text-emerald-500' : 'text-gray-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1  group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600" title="Deactivate">
                        <ShieldAlert size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
