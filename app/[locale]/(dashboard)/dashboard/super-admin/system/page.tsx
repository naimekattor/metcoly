'use client';

import { motion } from 'framer-motion';
import { 
  Cpu, 
  Activity, 
  Plus, 
  Layout, 
  Settings, 
  Cloud, 
  Lock, 
  Bell, 
  Clock, 
  User, 
  Briefcase,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: 1, name: 'Permanent Residence', category: 'Immigration', price: '$2,500', status: 'Active', popular: true },
  { id: 2, name: 'Study Permit', category: 'Immigration', price: '$800', status: 'Active', popular: false },
  { id: 3, name: 'Work Permit', category: 'Immigration', price: '$1,200', status: 'Active', popular: true },
  { id: 4, name: 'Spousal Sponsorship', category: 'Family', price: '$1,800', status: 'Active', popular: false },
];

const RECENT_LOGS = [
  { id: 101, user: 'Admin', event: 'Approved Booking BK-8821', time: '10 mins ago', type: 'SUCCESS' },
  { id: 102, user: 'Marc Davies', event: 'Added note to Application APP-102', time: '45 mins ago', type: 'INFO' },
  { id: 103, user: 'System', event: 'New user registered: Sarah Johnson', time: '3 hours ago', type: 'SUCCESS' },
  { id: 104, user: 'Admin', event: 'Server reboot initiated', time: '5 hours ago', type: 'WARNING' },
  { id: 105, user: 'Elena Popa', event: 'Rejected Document: ID_Front.jpg', time: '8 hours ago', type: 'ERROR' },
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

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState('Services');

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
          <h1 className="text-2xl font-bold text-gray-900">System Management</h1>
          <p className="text-sm text-gray-500">Configure platform services, view logs, and system settings</p>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex border-b border-gray-100 gap-8">
        {['Services', 'Activity Logs', 'System Settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab ? 'text-[#0F2A4D]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F2A4D]" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'Services' && <ServicesTab key="services" item={item} />}
        {activeTab === 'Activity Logs' && <LogsTab key="logs" item={item} />}
        {activeTab === 'System Settings' && <SettingsTab key="settings" item={item} />}
      </AnimatePresence>
    </motion.div>
  );
}

function ServicesTab({ item }: any) {
  return (
    <motion.div 
      variants={item}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Platform Services</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2A4D] rounded-xl text-sm font-semibold text-white hover:bg-[#1b3d6e] transition-colors shadow-lg">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Briefcase size={20} />
              </div>
              <div className="flex items-center gap-2">
                {service.popular && (
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded uppercase">Popular</span>
                )}
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase">{service.status}</span>
              </div>
            </div>
            <h4 className="font-bold text-gray-900">{service.name}</h4>
            <p className="text-xs text-gray-400 uppercase font-black mt-1 tracking-widest">{service.category}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-lg font-black text-[#0F2A4D]">{service.price}</span>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn">
                Manage Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LogsTab({ item }: any) {
  return (
    <motion.div 
      variants={item}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-900">Activity Timeline</h3>
        <button className="text-xs font-bold text-gray-400 hover:text-gray-600">Download Full Log</button>
      </div>
      <div className="divide-y divide-gray-50">
        {RECENT_LOGS.map((log) => (
          <div key={log.id} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
            <div className={`p-2 rounded-lg ${
              log.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' :
              log.type === 'WARNING' ? 'bg-amber-50 text-amber-600' :
              log.type === 'ERROR' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {log.type === 'SUCCESS' ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{log.event}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{log.user}</span>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-[10px] text-gray-400">{log.time}</span>
              </div>
            </div>
            <button className="p-2 text-gray-300 hover:text-gray-500">
              <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 text-center bg-gray-50/50 border-t border-gray-50">
        <button className="text-xs font-bold text-blue-600 hover:underline">View Older Activity</button>
      </div>
    </motion.div>
  );
}

function SettingsTab({ item }: any) {
  return (
    <motion.div 
      variants={item}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {[
        { title: 'Global Settings', desc: 'Maintenance mode, site name, logo', icon: Layout },
        { title: 'Authentication', desc: 'MFA, OAuth, Session timeout', icon: Lock },
        { title: 'Cloud Strorage', desc: 'S3, Azure, Google Cloud backup', icon: Cloud },
        { title: 'Email Templates', desc: 'Email branding, SMTP config', icon: Mail },
        { title: 'Notifications', desc: 'System alerts, Push settings', icon: Bell },
        { title: 'Maintenance', desc: 'Database optimization, cleaning', icon: Activity },
      ].map((config, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 w-fit">
            <config.icon size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{config.title}</h4>
            <p className="text-xs text-gray-400 mt-1">{config.desc}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

import { AnimatePresence } from 'framer-motion';
