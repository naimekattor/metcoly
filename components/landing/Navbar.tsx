"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, usePathname, useRouter } from '@/nextInt/navigation';
import LanguageToggle from '@/components/dashboard/LanguageToggle';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

// Dashboard route by role
const DASHBOARD_ROUTES: Record<string, string> = {
  SUPER_ADMIN: '/dashboard/super-admin',
  CONSULTANT:  '/dashboard/consultant',
  CLIENT:      '/dashboard/user',
};

function ProfileAvatar({ user }: { user: { firstName: string; lastName: string } }) {
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1b3d6e] to-[#2d5fa6] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 select-none ring-2 ring-white shadow">
      {initials || <User size={16} />}
    </div>
  );
}

export default function Navbar() {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const router = useRouter();

  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setIsOpen(false);
    await logout();
    window.location.href = '/';
  };

  const dashboardRoute = user ? (DASHBOARD_ROUTES[user.role] || '/dashboard/user') : '/dashboard/user';

  const navLinks = [
    { href: '/services', label: t('services') },
    { href: '/contact',  label: t('contact')  },
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-2'
          : 'bg-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="relative transition-transform duration-300 group-hover:scale-110">
              <Image alt="Company Logo" width={182} height={80} priority src="/images/logo.png" />
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-[#1b3d6e] group"
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1b3d6e] transition-all duration-300 group-hover:w-full ${pathname === link.href ? 'w-full' : ''}`} />
              </Link>
            ))}
          </div>

          {/* ── DESKTOP ACTIONS ── */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />

            {!isLoading && isAuthenticated && user ? (
              /* ── Profile Dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200"
                >
                  <ProfileAvatar user={user} />
                  <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">
                    {user.firstName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>

                      <div className="p-1.5">
                        <Link
                          href={dashboardRoute}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#1b3d6e]/5 hover:text-[#1b3d6e] transition-colors"
                        >
                          <LayoutDashboard size={16} className="text-[#1b3d6e]" />
                          Dashboard
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !isLoading ? (
              /* ── Guest Buttons ── */
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-[#1b3d6e] px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#152f56] active:scale-95 transition-all duration-200 shadow-[0_4px_14px_0_rgba(27,61,110,0.39)] hover:shadow-[0_6px_20px_rgba(27,61,110,0.23)] whitespace-nowrap"
                >
                  {t('getStarted')}
                </Link>
              </>
            ) : null}
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-[#1b3d6e] hover:bg-gray-100/50 transition-colors duration-200 relative z-50"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl md:hidden overflow-y-auto"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-gray-500 hover:text-[#1b3d6e] hover:bg-gray-100 transition-colors duration-200 z-[60]"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col h-full p-6 pt-20">

                {/* Mobile nav links */}
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, i) => (
                    <motion.div key={link.href} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block text-lg font-semibold px-4 py-3 rounded-2xl transition-all duration-200 ${
                          pathname === link.href ? 'text-[#1b3d6e] bg-[#1b3d6e]/5' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="my-6 border-t border-gray-100" />

                <div className="flex flex-col gap-4 mt-auto">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
                    <LanguageToggle />
                  </motion.div>

                  {!isLoading && isAuthenticated && user ? (
                    <>
                      {/* Mobile: logged-in user info */}
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
                        className="flex items-center gap-3 px-4 py-3 bg-[#1b3d6e]/5 rounded-2xl"
                      >
                        <ProfileAvatar user={user} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </motion.div>

                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <Link
                          href={dashboardRoute}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 bg-[#1b3d6e] text-white text-base font-bold px-4 py-4 rounded-2xl shadow-lg active:scale-95 transition-all duration-200"
                        >
                          <LayoutDashboard size={18} />
                          Dashboard
                        </Link>
                      </motion.div>

                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 text-red-600 text-base font-semibold px-4 py-4 rounded-2xl hover:bg-red-50 transition-all duration-200 border border-red-100"
                        >
                          <LogOut size={18} />
                          Sign out
                        </button>
                      </motion.div>
                    </>
                  ) : !isLoading ? (
                    <>
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center text-lg font-semibold text-gray-700 px-4 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-200">
                          {t('login')}
                        </Link>
                      </motion.div>
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                        <Link href="/signup" onClick={() => setIsOpen(false)} className="block bg-[#1b3d6e] text-white text-center text-lg font-bold px-4 py-4 rounded-2xl shadow-lg active:scale-95 transition-all duration-200">
                          {t('getStarted')}
                        </Link>
                      </motion.div>
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
