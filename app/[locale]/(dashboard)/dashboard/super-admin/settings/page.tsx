'use client';

import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Layout, 
  Lock, 
  Cloud, 
  Mail, 
  Bell, 
  Activity, 
  ChevronRight,
  ShieldCheck,
  Globe,
  Database,
  Smartphone
} from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const SETTINGS_GROUPS = (t: any) => [
  {
    title: t('branding.title'),
    icon: Layout,
    items: [
      { name: t('branding.siteName'), desc: t('branding.siteNameDesc') },
      { name: t('branding.appearance'), desc: t('branding.appearanceDesc') },
      { name: t('branding.language'), desc: t('branding.languageDesc') },
    ]
  },
  {
    title: t('security.title'),
    icon: Lock,
    items: [
      { name: t('security.auth'), desc: t('security.authDesc') },
      { name: t('security.session'), desc: t('security.sessionDesc') },
      { name: t('security.api'), desc: t('security.apiDesc') },
    ]
  },
  {
    title: t('infrastructure.title'),
    icon: Cloud,
    items: [
      { name: t('infrastructure.storage'), desc: t('infrastructure.storageDesc') },
      { name: t('infrastructure.database'), desc: t('infrastructure.databaseDesc') },
      { name: t('infrastructure.email'), desc: t('infrastructure.emailDesc') },
    ]
  },
  {
    title: t('communications.title'),
    icon: Bell,
    items: [
      { name: t('communications.templates'), desc: t('communications.templatesDesc') },
      { name: t('communications.push'), desc: t('communications.pushDesc') },
      { name: t('communications.chat'), desc: t('communications.chatDesc') },
    ]
  }
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

export default function SettingsPage() {
  const t = useTranslations('superAdmin.system.settings');
  const groups = SETTINGS_GROUPS(t);

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
        <button className="px-6 py-2 bg-emerald-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
          {t('saveChanges')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {groups.map((group, idx) => (
          <motion.div key={idx} variants={item} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-[#0F2A4D]/5 text-[#0F2A4D]">
                 <group.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{group.title}</h3>
            </div>
            
            <div className="space-y-4">
              {group.items.map((subItem, sIdx) => (
                <div key={sIdx} className="p-4 rounded-2xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/10 transition-all cursor-pointer group/item flex items-center justify-between">
                   <div>
                      <h4 className="text-sm font-bold text-gray-800">{subItem.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{subItem.desc}</p>
                   </div>
                   <ChevronRight size={16} className="text-gray-300 group-hover/item:text-[#0F2A4D] group-hover/item:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

     
    </motion.div>
  );
}
