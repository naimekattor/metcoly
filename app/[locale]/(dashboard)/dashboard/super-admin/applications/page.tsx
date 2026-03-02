'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Briefcase,
  User,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const APPLICATIONS = [
  { id: 'APP-102', client: 'James Wilson', type: 'Study Permit', country: 'Canada', date: 'Mar 04, 2026', status: 'Under Review', priority: 'High', consultant: 'Marc Davies' },
  { id: 'APP-101', client: 'Linda Smith', type: 'Work Permit', country: 'UK', date: 'Mar 04, 2026', status: 'Approved', priority: 'Medium', consultant: 'Elena Popa' },
  { id: 'APP-100', client: 'Kevin Lee', type: 'Express Entry', country: 'Canada', date: 'Mar 03, 2026', status: 'Under Review', priority: 'High', consultant: 'Marc Davies' },
  { id: 'APP-099', client: 'Emma Davis', type: 'Sponsorship', country: 'Australia', date: 'Mar 02, 2026', status: 'Approved', priority: 'Low', consultant: 'Robert Fox' },
  { id: 'APP-098', client: 'Michael Scott', type: 'Business Visa', country: 'Canada', date: 'Mar 01, 2026', status: 'Rejected', priority: 'Medium', consultant: 'Elena Popa' },
  { id: 'APP-097', client: 'Pam Beesly', type: 'Work Permit', country: 'Canada', date: 'Feb 28, 2026', status: 'Pending', priority: 'Low', consultant: 'Robert Fox' },
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

export default function ApplicationsPage() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = APPLICATIONS.filter(app => {
    const matchesFilter = filter === 'All' || app.status === filter;
    const matchesSearch = app.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.id.toLowerCase().includes(searchTerm.toLowerCase());
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
          <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
          <p className="text-sm text-gray-500">Oversee and manage all client immigration applications</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={18} /> Export List
          </button>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total Cases', value: '1,255', color: 'blue' },
          { label: 'In Review', value: '184', color: 'amber' },
          { label: 'Approved', value: '845', color: 'emerald' },
          { label: 'Rejected', value: '104', color: 'rose' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <motion.div variants={item} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto no-scrollbar">
          {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-[10px] sm:text-xs font-bold px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
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
            placeholder="Search applications..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0F2A4D]/10 focus:border-[#0F2A4D] transition-all"
          />
        </div>
      </motion.div>

      {/* ── TABLE ── */}
      <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">ID & Type</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Client</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Consultant</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Priority</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#0F2A4D]">{app.id}</span>
                      <span className="text-xs text-gray-400">{app.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{app.client}</span>
                      <span className="text-xs text-gray-400">{app.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                         {app.consultant.charAt(0)}
                       </div>
                       <span className="text-xs font-medium text-gray-600">{app.consultant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      app.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                      app.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {app.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-2 hover:bg-[#0F2A4D]/5 rounded-lg text-gray-400 hover:text-[#0F2A4D] transition-colors">
                      <MoreVertical size={18} />
                    </button>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'Under Review': 'bg-blue-50 text-blue-600 border-blue-100',
    'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
}
