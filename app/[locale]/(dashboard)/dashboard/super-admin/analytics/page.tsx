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
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { analyticsAPI } from '@/lib/api/analytics';

interface StatBox {
  label: string;
  value: string;
  change: string;
}

interface RevenueItem {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface TrendItem {
  month: string;
  value: number;
}

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
  const t = useTranslations('superAdmin.analytics');
  
  const [stats, setStats] = useState<{
    totalRevenue: StatBox;
    totalUsers: StatBox;
    totalConsultants: StatBox;
    totalApplications: StatBox;
  } | null>(null);

  const [revenueByService, setRevenueByService] = useState<RevenueItem[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // We will mock the shape expected based on typical analytics endpoints 
        // until backend matches. Use what returns from these APIs:
        const [dashboardRes, revenueRes] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getRevenueAnalytics()
        ]);
        
        const overview = dashboardRes.data?.overview || {};
        const monthly = dashboardRes.data?.monthly || {};
        const revData = revenueRes.data || {};

        setStats({
          totalRevenue: { label: t('performance.avgRevenue'), value: `$${overview.totalRevenue || 0}`, change: `${monthly.revenueGrowth >= 0 ? '+' : ''}${monthly.revenueGrowth || 0}%` },
          totalApplications: { label: 'TOTAL APPLICATIONS', value: `${overview.totalApplications || 0}`, change: '+0%' },
          totalUsers: { label: t('performance.activeSessions'), value: `${overview.totalUsers || 0}`, change: '+0%' },
          totalConsultants: { label: 'TOTAL CONSULTANTS', value: `${overview.totalConsultants || 0}`, change: '+0%' },
        });

        setRevenueTrend((revData.revenueByPeriod || []).map((r: any) => ({
          month: r.period,
          value: Number(r.total_amount)
        })).reverse()); // reverse to show chronologically if needed
        
        const services = revData.revenueByService || [];
        const totalRev = overview.totalRevenue || 1;
        setRevenueByService(services.map((s: any, i: number) => ({
          name: s.service_name,
          amount: Number(s.total_amount),
          percentage: Math.round((Number(s.total_amount) / totalRev) * 100),
          color: ['#0F2A4D', '#3b82f6', '#10b981', '#f59e0b'][i % 4]
        })));

      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [t]);

  const maxVal = Math.max(...revenueTrend.map(d => d.value), 1); // Avoid div by 0

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-500">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">{t('last30Days')}</button>
          <button className="px-4 py-2 bg-[#0F2A4D] rounded-xl text-xs font-bold text-white shadow-lg">{t('downloadReport')}</button>
        </div>
      </div>

      {/* ── PERFORMANCE GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-4 p-12 text-center text-gray-500">
            Loading analytics...
          </div>
        ) : (
          [
            { ...stats?.totalRevenue, icon: DollarSign },
            { ...stats?.totalApplications, icon: TrendingUp },
            { ...stats?.totalUsers, icon: Users },
            { ...stats?.totalConsultants, icon: Layers },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  {stat.icon && <stat.icon size={20} />}
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{stat?.change}</span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat?.label}</p>
              <h3 className="text-xl font-black text-gray-900 mt-1">{stat?.value}</h3>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── REVENUE TREND ── */}
        <motion.div variants={item} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-gray-900">{t('revenueTrend.title')}</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-[#0F2A4D]" /> {t('revenueTrend.currentPeriod')}
               </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4 relative">
             {revenueTrend.length === 0 && !loading && (
               <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                 No trend data available for this period.
               </div>
             )}
             {revenueTrend.map((d, i) => {
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
          <h3 className="font-bold text-gray-900 mb-6">{t('revenueByService.title')}</h3>
          <div className="space-y-6">
            {revenueByService.length === 0 && !loading && (
              <div className="text-center text-gray-400 text-sm py-8">
                No service data available.
              </div>
            )}
            {revenueByService.map((s, i) => (
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
                <span>{t('revenueByService.totalCalculated')}</span>
                <span className="text-[#0F2A4D] font-black">{stats?.totalRevenue?.value || '$0'}</span>
             </div>
          </div>
        </motion.div>
      </div>

      
    </motion.div>
  );
}
