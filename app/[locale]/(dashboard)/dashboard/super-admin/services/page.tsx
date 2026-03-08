'use client';

import { motion } from 'framer-motion';
import { 
  Plus, 
  Briefcase,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { servicesAPI } from '@/lib/api/services';

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

export default function ServicesPage() {
  const t = useTranslations('superAdmin.system.services');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await servicesAPI.getActiveServices();
        if (res.status === 'success') {
          setServices(res.data?.services || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);
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
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2A4D] rounded-xl text-sm font-semibold text-white hover:bg-[#1b3d6e] transition-colors shadow-lg shadow-blue-900/10">
          <Plus size={18} /> {t('addService')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-20 text-center text-gray-500">
             Loading services...
          </div>
        ) : services.map((service) => (
          <motion.div key={service.id} variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Briefcase size={22} />
              </div>
              <div className="flex items-center gap-2">
                {service.popular && (
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded uppercase tracking-wider">{t('popular')}</span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${service.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <h4 className="text-lg font-bold text-gray-900">{service.name}</h4>
            <p className="text-[10px] font-black text-gray-400 uppercase mt-0.5 tracking-[0.2em]">{service.category || 'CATEGORY'}</p>
            
            <p className="text-sm text-gray-500 mt-4 line-clamp-2">
              {service.description}
            </p>
            
            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('baseFee')}</span>
                <span className="text-xl font-black text-[#0F2A4D]">${service.basePrice}</span>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn">
                {t('manageDetails')} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
