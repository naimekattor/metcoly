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
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/nextInt/navigation';
import ActionMenu from '@/components/dashboard/super-admin/ActionMenu';
import { applicationsAPI } from '@/lib/api/applications';
import { usersAPI } from '@/lib/api/users';

// ── Types ───────────────────────────────────────────────────────────────────

interface Application {
  id: string;
  client: { firstName: string; lastName: string; email: string };
  consultant: { id: string; firstName: string; lastName: string; email: string } | null;
  service: { name: string };
  status: string;
  priority: string;
  createdAt: string;
}

interface Consultant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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

export default function ApplicationsPage() {
  const t = useTranslations('superAdmin.applications');
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [apps, setApps] = useState<Application[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, usersRes] = await Promise.all([
        applicationsAPI.getAllApplications(),
        usersAPI.getAllUsers({ role: 'CONSULTANT' })
      ]);
      
      const appsArray = Array.isArray(appsRes?.data?.applications) ? appsRes.data.applications : 
                        Array.isArray(appsRes?.data) ? appsRes.data : 
                        Array.isArray(appsRes) ? appsRes : [];
                        
      const usersArray = Array.isArray(usersRes?.data?.users) ? usersRes.data.users : 
                         Array.isArray(usersRes?.data) ? usersRes.data : 
                         Array.isArray(usersRes) ? usersRes : [];

      setApps(appsArray);
      setConsultants(usersArray);
    } catch (error) {
      console.error('Failed to fetch applications or consultants', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignConsultant = async (appId: string, consultantId: string) => {
    try {
      await applicationsAPI.assignConsultant(appId, consultantId);
      // Optimistic update
      setApps(prevApps => prevApps.map(app => 
        app.id === appId ? { ...app, consultant: consultantId === 'Unassigned' ? null : consultants.find(c => c.id === consultantId) || null } : app
      ));
    } catch (error) {
      console.error('Failed to assign consultant', error);
      fetchData(); // fallback refresh
    }
  };

  const handlePriorityChange = async (appId: string, priority: string) => {
    try {
      // In backend to change priority we might need a general update or updateStatus if priority is bundled there.
      // Assuming a dedicated endpoint or update property via updateApplication
      await applicationsAPI.updateApplication(appId, { priority });
      setApps(prevApps => prevApps.map(app => 
        app.id === appId ? { ...app, priority } : app
      ));
    } catch (error) {
      console.error('Failed to update priority', error);
      fetchData();
    }
  };

  const handleStatusChange = async (appId: string, status: string) => {
    try {
      await applicationsAPI.updateStatus(appId, status, 'Status updated by Super Admin');
      setApps(prevApps => prevApps.map(app => 
        app.id === appId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Failed to update status', error);
      fetchData();
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesFilter = filter === 'All' || app.status === filter.toUpperCase().replace(' ', '_');
    const clientName = `${app.client?.firstName || ''} ${app.client?.lastName || ''}`;
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-500">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={18} /> {t('export')}
          </button>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: t('stats.total'), value: filteredApps.length, color: 'blue' },
          { label: t('stats.inReview'), value: filteredApps.filter(app => app.status === 'UNDER_REVIEW').length, color: 'amber' },
          { label: t('stats.approved'), value: filteredApps.filter(app => app.status === 'APPROVED').length, color: 'emerald' },
          { label: t('stats.rejected'), value: filteredApps.filter(app => app.status === 'REJECTED').length, color: 'rose' },
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
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.id')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.client')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.consultant')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.status')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">{t('table.priority')}</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#0F2A4D]">{app.id.substring(0, 8)}</span>
                      <span className="text-xs text-gray-400">{app.service?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{app.client?.firstName} {app.client?.lastName}</span>
                      <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group/select max-w-[160px]">
                      <select 
                        value={app.consultant?.id || 'Unassigned'}
                        onChange={(e) => handleAssignConsultant(app.id, e.target.value)}
                        className={`w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-3 pr-8 text-[11px] font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-[#0F2A4D]/10 focus:border-[#0F2A4D] transition-all ${
                          app.consultant ? 'text-[#0F2A4D]' : 'text-gray-400 italic'
                        }`}
                      >
                        <option value="Unassigned">{t('notAssigned')}</option>
                        {consultants.map(c => (
                          <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                        ))}
                      </select>
                      <ArrowRight size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover/select:translate-x-0.5 transition-transform rotate-90" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
  <select 
    value={app.status || 'DRAFT'}
    onChange={(e) => handleStatusChange(app.id, e.target.value)}
    className={`appearance-none bg-transparent text-[10px] font-bold px-2 py-0.5 rounded outline-none cursor-pointer border transition-all ${
      app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
      app.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
      app.status === 'UNDER_REVIEW' ? 'bg-blue-50 text-blue-600 border-blue-100' :
      app.status === 'PROCESSING' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
      app.status === 'DOCUMENTS_MISSING' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
      app.status === 'SUBMITTED' ? 'bg-purple-50 text-purple-600 border-purple-100' :
      app.status === 'CLOSED' ? 'bg-gray-50 text-gray-600 border-gray-100' :
      'bg-gray-50 text-gray-600 border-gray-100' 
    }`}
  >
    <option value="DRAFT">Draft</option>
    <option value="SUBMITTED">Submitted</option>
    <option value="UNDER_REVIEW">Under Review</option>
    <option value="DOCUMENTS_MISSING">Documents Missing</option>
    <option value="PROCESSING">Processing</option>
    <option value="APPROVED">Approved</option>
    <option value="REJECTED">Rejected</option>
    <option value="CLOSED">Closed</option>
  </select>
</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group/priority max-w-[100px]">
                      <select 
                        value={app.priority}
                        onChange={(e) => handlePriorityChange(app.id, e.target.value)}
                        className={`w-full appearance-none bg-transparent text-[10px] font-bold px-2 py-0.5 rounded outline-none cursor-pointer border transition-all ${
                          app.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          app.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}
                      >
                        <option value="High">{t('caseDetails.priority.high')}</option>
                        <option value="Medium">{t('caseDetails.priority.medium')}</option>
                        <option value="Low">{t('caseDetails.priority.low')}</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <ActionMenu 
                      onView={() => router.push(`/dashboard/super-admin/applications/${app.id}`)}
                      onDelete={() => console.log('Delete', app.id)}
                    />
                  </td>
                </tr>
              ))}
              {!loading && filteredApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'APPROVED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'PENDING': 'bg-amber-50 text-amber-600 border-amber-100',
    'UNDER_REVIEW': 'bg-blue-50 text-blue-600 border-blue-100',
    'REJECTED': 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
  );
}
