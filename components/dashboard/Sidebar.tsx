"use client";

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
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SidebarProps {
  role?: 'user' | 'admin';
  onClose?: () => void;
}

export default function Sidebar({ role = 'user', onClose }: SidebarProps) {
  const t = useTranslations('dashboard.navigation');
  const pathname = usePathname();
  const locale = useLocale();

  const labelFromMessage = (key: string) => {
    const v = t.raw(key) as unknown;
    if (typeof v === 'string') return v;
    if (v && typeof v === 'object') {
      const obj = v as Record<string, unknown>;
      const preferred = obj.label ?? obj.title ?? obj.name ?? obj.text;
      if (typeof preferred === 'string') return preferred;
      const firstString = Object.values(obj).find((x) => typeof x === 'string');
      if (typeof firstString === 'string') return firstString;
    }
    return key;
  };

  const menuItems = role === 'admin' 
    ? [
        { icon: LayoutDashboard, label: labelFromMessage('admin.overview'), href: '/dashboard/admin' },
        { icon: ShieldCheck, label: labelFromMessage('admin.applications'), href: '/dashboard/admin/applications' },
        { icon: FileText, label: labelFromMessage('admin.reports'), href: '/dashboard/admin/reports' },
        { icon: Settings, label: labelFromMessage('admin.settings'), href: '/dashboard/admin/settings' },
      ]
    : [
        { icon: LayoutDashboard, label: labelFromMessage('user.myStatus'), href: '/dashboard/user' },
        { icon: FileText, label: labelFromMessage('user.myCases'), href: '/dashboard/user/my-cases' },
        { icon: Settings, label: labelFromMessage('user.settings'), href: '/dashboard/user/settings' },
      ];

  return (
    <aside className="h-full flex flex-col bg-[#0F2A4D] text-white w-64 lg:w-72 shadow-2xl">
      {/* ── LOGO ── */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative transition-transform duration-300 group-hover:scale-105">
            <Image 
              alt="Company Logo"
              width={140} 
              height={60}
              priority 
              src="/images/logo.png"
              className="brightness-0 invert"
            />
          </div>
        </Link>
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-3 mb-4">
          {role === 'admin' ? 'Admin Control' : 'General Menu'}
        </div>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
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
        <Link 
          href="/support"
          className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <HelpCircle size={20} />
          <span className="text-sm font-medium">Support</span>
        </Link>
        <Link 
          href="/dashboard/user/logout"
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all mt-2"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
