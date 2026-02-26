"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Determine role based on path for this demo
  const role = pathname.includes('/admin') ? 'admin' : 'user';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ── DESKTOP SIDEBAR ── */}
      <div className="hidden lg:block">
        <Sidebar role={role} />
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <Sidebar role={role} onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title={role === 'admin' ? 'Admin Control Center' : 'User Dashboard'}
        />
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
