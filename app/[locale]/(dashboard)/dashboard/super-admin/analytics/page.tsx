'use client';

import { motion } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  FileText, 
  ArrowUpRight, 
  Calendar,
  Layers,
  Globe,
  PieChart
} from 'lucide-react';
import { useState } from 'react';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const REVENUE_BY_SERVICE = [
  { name: 'Permanent Residence', amount: 45000, percentage: 35, color: '#0F2A4D' },
  { name: 'Study Permit', amount: 32000, percentage: 25, color: '#3b82f6' },
  { name: 'Work Permit', amount: 28000, percentage: 22, color: '#10b981' },
  { name: 'Family Sponsorship', amount: 23430, percentage: 18, color: '#f59e0b' },
];

const MONTHLY_TREND = [
  { month: 'Sep', value: 45000 },
  { month: 'Oct', value: 52000 },
  { month: 'Nov', value: 48000 },
  { month: 'Dec', value: 61000 },
  { month: 'Jan', value: 72000 },
  { month: 'Feb', value: 81000 },
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

export default function AnalyticsPage() {
  const maxVal = Math.max(...MONTHLY_TREND.map(d => d.value));

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-sm text-gray-500">Deep dive into platform performance and growth metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">Last 30 Days</button>
          <button className="px-4 py-2 bg-[#0F2A4D] rounded-xl text-xs font-bold text-white shadow-lg">Download Report</button>
        </div>
      </div>

      {/* ── PERFORMANCE GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Revenue / User', value: '$45.12', change: '+5.4%', icon: DollarSign },
          { label: 'Conversion Rate', value: '12.8%', change: '+2.1%', icon: TrendingUp },
          { label: 'Active Sessions', value: '1,204', change: '+18%', icon: Users },
          { label: 'Retention Rate', value: '94.2%', change: '+0.5%', icon: Layers },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{stat.change}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-xl font-black text-gray-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── REVENUE TREND ── */}
        <motion.div variants={item} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-gray-900">Revenue Growth Trend</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2 H-2 rounded-full bg-[#0F2A4D]" /> Current Period
               </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4 relative">
             {MONTHLY_TREND.map((d, i) => {
               const height = (d.value / maxVal) * 100;
               return (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4">
                    <div className="w-full relative group">
                       <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="w-full bg-[#0F2A4D] rounded-t-lg group-hover:opacity-80 transition-opacity"
                       />
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         ${d.value.toLocaleString()}
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{d.month}</span>
                 </div>
               )
             })}
          </div>
        </motion.div>

        {/* ── REVENUE BY SERVICE ── */}
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Revenue by Service</h3>
          <div className="space-y-6">
            {REVENUE_BY_SERVICE.map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-gray-600">{s.name}</span>
                   <span className="text-xs font-black text-[#0F2A4D]">{s.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    style={{ backgroundColor: s.color }}
                    className="h-full rounded-full"
                   />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-gray-50">
             <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                <span>Total Calculated</span>
                <span className="text-[#0F2A4D] font-black">$128,430.00</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* ── GEOGRAPHIC DISTRIBUTION ── */}
      <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
           <Globe size={20} className="text-[#0F2A4D]" />
           <h3 className="font-bold text-gray-900">Geographic Distribution</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { country: 'Nigeria', users: '840', growth: '+12%', color: 'bg-emerald-500' },
             { country: 'India', users: '725', growth: '+8.4%', color: 'bg-blue-500' },
             { country: 'China', users: '512', growth: '-2.1%', color: 'bg-rose-500' },
           ].map((g, i) => (
             <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className={`w-3 h-3 rounded-full ${g.color}`} />
                <div className="flex-1">
                   <h4 className="text-sm font-bold text-gray-900">{g.country}</h4>
                   <p className="text-xs text-gray-400">{g.users} Active Users</p>
                </div>
                <span className={`text-xs font-bold ${g.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{g.growth}</span>
             </div>
           ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
