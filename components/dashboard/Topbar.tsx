"use client";

import { useTranslations } from 'next-intl';
import { 
  Search, 
  Bell, 
  Menu, 
  User as UserIcon,
  ChevronDown,
  Globe
} from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useState } from 'react';

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Topbar({ onMenuClick, title = "Dashboard" }: TopbarProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <h1 className="text-lg lg:text-xl font-bold text-gray-800 hidden sm:block">
          {title}
        </h1>
      </div>

      {/* Search Bar - Hidden on Mobile */}
      {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search applications, documents..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all pb-2"
          />
        </div>
      </div> */}

      <div className="flex items-center gap-3 lg:gap-6">
        {/* Language Toggle */}
        <div className="hidden sm:block">
          <LanguageToggle />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-100 hidden sm:block mx-1"></div>

        {/* Profile */}
        {/* <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 lg:gap-3 p-1 rounded-full hover:bg-gray-50 transition-all"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
               <UserIcon size={20} />
            </div>
            <div className="hidden lg:block text-left mr-1">
              <p className="text-xs font-bold text-gray-800 leading-none">Naim Dev</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tight">User Account</p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">My Profile</button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">Settings</button>
              <div className="h-px bg-gray-50 my-1"></div>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">Log out</button>
            </div>
          )}
        </div> */}
      </div>
    </header>
  );
}
