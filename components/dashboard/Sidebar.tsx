"use client";

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/nextInt/navigation';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  ShieldCheck, 
  FileText, 
  History, 
  LogOut,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Calendar,
  Users as UsersIcon,
  BarChart2,
  Cpu,
  Activity,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
  role?: 'user' | 'admin' | 'super_admin';
  onClose?: () => void;
}

export default function Sidebar({ role = 'user', onClose }: SidebarProps) {
  const t = useTranslations('dashboard.navigation');
  const t_admin = useTranslations('admin');
  const t_super = useTranslations('superAdmin');
  const pathname = usePathname();
  const locale = useLocale();

  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Track open sections for super admin
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    bookings: true,
    applications: true,
    users: true,
    analytics: true,
    system: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const labelFromMessage = (key: string) => {
    try {
      const v = t.raw(key) as unknown;
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object') {
        const obj = v as Record<string, unknown>;
        const preferred = obj.label ?? obj.title ?? obj.name ?? obj.text;
        if (typeof preferred === 'string') return preferred;
      }
    } catch (e) {}
    return key;
  };

  const menuItems = role === 'admin' 
    ? [
        { icon: LayoutDashboard, label: t_admin('overview.title'), href: '/dashboard/admin' },
        { icon: ShieldCheck, label: t_admin('applications.title'), href: '/dashboard/admin/applications' },
        { icon: Settings, label: t_admin('settings.title'), href: '/dashboard/admin/settings' },
      ]
    : role === 'super_admin'
    ? [
        { icon: LayoutDashboard, label: t_super('navigation.dashboard'), href: '/dashboard/super-admin' },
        {
          id: 'bookings',
          icon: Calendar,
          label: t_super('navigation.bookings'),
          links: [
            { label: t_super('bookings.title'), href: '/dashboard/super-admin/bookings' }
          ]
        },
        {
          id: 'applications',
          icon: ShieldCheck,
          label: t_super('navigation.applications'),
          links: [
            { label: t_super('applications.management'), href: '/dashboard/super-admin/applications' }
          ]
        },
        {
          id: 'users',
          icon: UsersIcon,
          label: t_super('navigation.users.title'),
          links: [
            { label: t_super('navigation.users.all'), href: '/dashboard/super-admin/users' },
            // { label: t_super('navigation.users.consultants'), href: '/dashboard/super-admin/users?role=CONSULTANT' }
          ]
        },
        {
          id: 'analytics',
          icon: BarChart2,
          label: t_super('navigation.analytics.title'),
          links: [
            { label: t_super('navigation.analytics.overview'), href: '/dashboard/super-admin/analytics' }
          ]
        },
        {
          id: 'system',
          icon: Cpu,
          label: t_super('navigation.system.title'),
          links: [
            { icon: Briefcase, label: t_super('navigation.system.services'), href: '/dashboard/super-admin/services' },
            { icon: Activity, label: t_super('navigation.system.logs'), href: '/dashboard/super-admin/logs' },
            // { icon: Settings, label: t_super('navigation.system.settings'), href: '/dashboard/super-admin/settings' }
          ]
        }
      ]
    : [
        { icon: LayoutDashboard, label: labelFromMessage('user.myStatus'), href: '/dashboard/user' },
        { icon: FileText, label: labelFromMessage('user.myCases'), href: '/dashboard/user/my-cases' },
        { icon: Settings, label: labelFromMessage('user.settings'), href: '/dashboard/user/settings' },
      ];

  return (
    <aside className="h-full flex flex-col bg-[#0F2A4D] text-white w-64 lg:w-72 shadow-2xl overflow-hidden">
      {/* ── LOGO ── */}
      <div className="p-2 border-b border-white/10 flex justify-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative transition-transform duration-300 group-hover:scale-105">
            <Image 
              alt="Company Logo"
              width={140} 
              height={50}
              priority 
              src="/images/logo.png"
              className="brightness-0 invert object-contain"
            />
          </div>
        </Link>
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar no-scrollbar">
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-3 mb-4">
          {role === 'super_admin' ? t_super('navigation.header') : role === 'admin' ? t_admin('overview.title') : t('header')}
        </div>
        
        {menuItems.map((item: any) => {
          if ('links' in item) {
            const isOpen = openSections[item.id];
            const hasActiveChild = item.links.some((l: any) => pathname === l.href);

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => toggleSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    hasActiveChild ? 'bg-white/5 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={hasActiveChild ? 'text-white' : 'text-white/50 group-hover:text-white'} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-white/40" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden pl-10 pr-2 space-y-1"
                    >
                      {item.links.map((link: any) => {
                        const isLinkActive = pathname === link.href;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${
                              isLinkActive 
                                ? 'bg-blue-600 text-white font-semibold' 
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {link.icon && <link.icon size={14} />}
                            {link.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive ? 'text-white' : 'text-white/50 group-hover:text-white transition-colors'} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── FOOTER ACTIONS ── */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {/* <Link 
          href="/support"
          className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <HelpCircle size={20} />
          <span className="text-sm font-medium">{t('admin.reports') || 'Support'}</span>
        </Link> */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all mt-2"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">{useTranslations('navigation')('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
