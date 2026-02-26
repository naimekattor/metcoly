'use client';

import { Link } from '@/nextInt/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  LogOut,
} from 'lucide-react';

export default function UserSidebar() {
  const t = useTranslations('dashboard.user');
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard/user', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/dashboard/user/my-cases', icon: FolderOpen, label: t('myCases') },
    { href: '/dashboard/user/settings', icon: Settings, label: t('settings') },
    { href: '/dashboard/user/logout', icon: LogOut, label: t('logout') },
  ];

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Logo
        </Link>
      </div>
      
      <nav className="px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}