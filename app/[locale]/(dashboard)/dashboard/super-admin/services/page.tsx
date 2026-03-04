'use client';

import { motion } from 'framer-motion';
import { 
  Plus, 
  Briefcase,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: 1, name: 'Permanent Residence', category: 'Immigration', price: '$2,500', status: 'Active', popular: true, description: 'Pathway to becoming a permanent resident of Canada.' },
  { id: 2, name: 'Study Permit', category: 'Immigration', price: '$800', status: 'Active', popular: false, description: 'Legal permission to study at a DLI in Canada.' },
  { id: 3, name: 'Work Permit', category: 'Immigration', price: '$1,200', status: 'Active', popular: true, description: 'Permission to work legally for a specific employer or open.' },
  { id: 4, name: 'Spousal Sponsorship', category: 'Family', price: '$1,800', status: 'Active', popular: false, description: 'Bringing your spouse or partner to live in Canada.' },
  { id: 5, name: 'Citizenship', category: 'Legal', price: '$1,000', status: 'Active', popular: false, description: 'Final step to becoming a Canadian citizen.' },
  { id: 6, name: 'Visitor Visa', category: 'Travel', price: '$150', status: 'Active', popular: false, description: 'Short-term entry for tourism or business.' },
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

export default function ServicesPage() {
  const t = useTranslations('superAdmin.system.services');
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
        {SERVICES.map((service) => (
          <motion.div key={service.id} variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Briefcase size={22} />
              </div>
              <div className="flex items-center gap-2">
                {service.popular && (
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded uppercase tracking-wider">{t('popular')}</span>
                )}
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase tracking-wider">{service.status}</span>
              </div>
            </div>
            
            <h4 className="text-lg font-bold text-gray-900">{service.name}</h4>
            <p className="text-[10px] font-black text-gray-400 uppercase mt-0.5 tracking-[0.2em]">{service.category}</p>
            
            <p className="text-sm text-gray-500 mt-4 line-clamp-2">
              {service.description}
            </p>
            
            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('baseFee')}</span>
                <span className="text-xl font-black text-[#0F2A4D]">{service.price}</span>
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
