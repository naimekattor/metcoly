'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  Download, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Filter,
  Clock,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { analyticsAPI } from '@/lib/api/analytics';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 }
};

export default function LogsPage() {
  const t = useTranslations('superAdmin.system.logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await analyticsAPI.getActivityLogs();
        if (res.status === 'success') {
          setLogs(res.data?.logs || []);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
      const logEvent = `${log.actionType} ${log.entityType || ''} ${log.entityId || ''}`.toLowerCase();
      const userName = `${log.user?.firstName || ''} ${log.user?.lastName || ''}`.toLowerCase();
      const matchesSearch = logEvent.includes(searchTerm.toLowerCase()) || 
                           userName.includes(searchTerm.toLowerCase());
      return matchesSearch;
  });

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
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <Download size={18} /> {t('downloadCsv')}
        </button>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#0F2A4D]/10 focus:border-[#0F2A4D] shadow-sm transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:text-[#0F2A4D] shadow-sm transition-all">
          <Filter size={18} /> {t('filters')}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {loading ? (
             <div className="p-20 text-center">
               <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#0F2A4D] rounded-full animate-spin mb-4"></div>
               <p className="text-gray-400 font-medium">{t('loading')}</p>
             </div>
          ) : filteredLogs.length > 0 ? filteredLogs.map((log) => (
            <motion.div 
              key={log.id} 
              variants={item}
              className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50/50 transition-colors group"
            >
              <div className={`p-3 rounded-2xl bg-blue-50 text-blue-600 flex-shrink-0`}>
                <ShieldCheck size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{log.user?.role}</span>
                   <div className="w-1 h-1 rounded-full bg-gray-300" />
                   <div className="flex items-center gap-1">
                      <User size={12} className="text-gray-400" />
                      <span className="text-xs font-bold text-[#0F2A4D]">{log.user?.firstName} {log.user?.lastName}</span>
                   </div>
                </div>
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {log.actionType} {log.entityType ? `(${log.entityType})` : ''}
                </p>
                <div className="flex items-center gap-3 mt-1">
                   <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                      <Clock size={12} /> {new Date(log.createdAt).toLocaleString()}
                   </div>
                   <div className="flex items-center gap-1 text-[10px] text-gray-100 bg-gray-900 px-2 py-0.5 rounded font-mono">
                      IP: {log.ipAddress || 'unknown'}
                   </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-600 bg-white rounded-xl shadow-sm border border-gray-100">
                  <ExternalLink size={16} />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-medium">No activity logs found.</p>
            </div>
          )}
        </div>
        <div className="p-6 text-center bg-gray-50/50 border-t border-gray-50">
           <button className="text-xs font-bold text-blue-600 hover:underline">{t('loadMore')}</button>
        </div>
      </div>
    </motion.div>
  );
}
