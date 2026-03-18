'use client';

import { motion } from 'framer-motion';
import { 
  Calendar,
  DollarSign,
  FileText,
  PieChart as LucidePieChart,
  TrendingUp,
  Users
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { analyticsAPI } from '@/lib/api/analytics';

interface DashboardOverview {
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

interface RevenueByPeriod {
  period: string;
  total_amount: number;
}

interface RevenueByService {
  service_name: string;
  total_amount: number;
}

interface ApplicationTrend {
  month: string;
  total_applications: number;
}

interface CountryData {
  country: string;
  _count: number;
}

interface ConsultantMetric {
  id: string;
  first_name: string;
  last_name: string;
  total_assigned: number;
  approved_applications: number;
  avg_processing_days: number | null;
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
  
  const [loading, setLoading] = useState(true);
  const [dashboardOverview, setDashboardOverview] = useState<DashboardOverview | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<RevenueByPeriod[]>([]);
  const [revenueByService, setRevenueByService] = useState<RevenueByService[]>([]);
  const [appTrend, setAppTrend] = useState<ApplicationTrend[]>([]);
  const [topCountries, setTopCountries] = useState<CountryData[]>([]);
  const [consultants, setConsultants] = useState<ConsultantMetric[]>([]);
  const [appStatusBreakdown, setAppStatusBreakdown] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        setLoading(true);
        // Use individual try-catches or allSettled to prevent one failure from blocking all data
        const [dashRes, revRes, appRes, consRes] = await Promise.allSettled([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getRevenueAnalytics(),
          analyticsAPI.getApplicationAnalytics(),
          analyticsAPI.getConsultantPerformance()
        ]);

        if (dashRes.status === 'fulfilled' && dashRes.value.status === 'success') {
          setDashboardOverview(dashRes.value.data.overview);
          setMonthlyStats(dashRes.value.data.monthly);
          setAppStatusBreakdown(dashRes.value.data.applicationsByStatus || {});
        }

        if (revRes.status === 'fulfilled' && revRes.value.status === 'success') {
          setRevenueTrend((revRes.value.data.revenueByPeriod || []).map((r: any) => ({
            period: r.period,
            total_amount: Number(r.total_amount)
          })).reverse());
          setRevenueByService(revRes.value.data.revenueByService || []);
        }

        if (appRes.status === 'fulfilled' && appRes.value.status === 'success') {
          setAppTrend((appRes.value.data.applicationsOverTime || []).map((a: any) => ({
            month: a.month,
            total_applications: Number(a.total_applications)
          })));
          setTopCountries((appRes.value.data.topCountries || []).map((c: any) => ({
            country: c.country,
            _count: c._count?.country || c._count || 0
          })));
        }

        if (consRes.status === 'fulfilled' && consRes.value.status === 'success') {
          setConsultants(consRes.value.data.consultants || []);
        }

      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAnalytics();
  }, []);

  const maxRevenue = Math.max(...revenueTrend.map(d => d.total_amount), 1);
  const maxApps = Math.max(...appTrend.map(d => d.total_applications), 1);

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
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))
        ) : (
          <>
            <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <DollarSign size={20} />
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">
                  {monthlyStats?.revenueGrowth ?? 0}%
                </span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('performance.avgRevenue')}</p>
              <h3 className="text-xl font-black text-gray-900 mt-1">${(dashboardOverview?.totalRevenue || 0).toLocaleString()}</h3>
            </motion.div>

            <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <FileText size={20} />
                </div>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Applications</p>
              <h3 className="text-xl font-black text-gray-900 mt-1">{(dashboardOverview?.totalApplications || 0).toLocaleString()}</h3>
            </motion.div>

            <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Users size={20} />
                </div>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Users</p>
              <h3 className="text-xl font-black text-gray-900 mt-1">{(dashboardOverview?.totalUsers || 0).toLocaleString()}</h3>
            </motion.div>

            <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Calendar size={20} />
                </div>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bookings</p>
              <h3 className="text-xl font-black text-gray-900 mt-1">{(dashboardOverview?.totalBookings || 0).toLocaleString()}</h3>
            </motion.div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── REVENUE TREND ── */}
        <motion.div variants={item} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900">{t('revenueTrend.title')}</h3>
              <p className="text-xs text-gray-500 mt-1">Monthly revenue distribution</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} />
                {monthlyStats?.revenueGrowth ?? 0}% Growth
              </div>
            </div>
          </div>
          
          <div className="h-72 w-full">
            {loading ? (
              <div className="w-full h-full bg-gray-50 animate-pulse rounded-xl" />
            ) : revenueTrend.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No trend data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F2A4D" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0F2A4D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="period" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(value: any) => [`$${(Number(value) || 0).toLocaleString()}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total_amount" 
                    stroke="#0F2A4D" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* ── APPLICATION STATUS PIE CHART ── */}
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-900 mb-6">{t('statusBreakdown')}</h3>
          
          <div className="flex-1 min-h-[250px] relative">
            {loading ? (
              <div className="w-full h-full bg-gray-50 animate-pulse rounded-full aspect-square" />
            ) : Object.keys(appStatusBreakdown).length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic">
                No application data.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(appStatusBreakdown).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {Object.entries(appStatusBreakdown).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#0F2A4D', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-bold text-gray-500 uppercase">{value.replace('_', ' ')}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {!loading && Object.keys(appStatusBreakdown).length > 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-[-18px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Total</p>
                <p className="text-xl font-black text-gray-900">{dashboardOverview?.totalApplications || 0}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      

     

      
    </motion.div>
  );
}
