"use client";

import { useTranslations } from 'next-intl';
import { useCaseStore } from '@/stores/useCaseStore';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Globe, MapPin } from 'lucide-react';

export default function PersonalInfoStep() {
  const t = useTranslations('dashboard.newCase.step2');
  const { personalInfo, setPersonalInfo, nextStep, prevStep } = useCaseStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo({ [name]: value });
  };

  const isFormValid = personalInfo.firstName && personalInfo.lastName && personalInfo.email && personalInfo.phone;

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-[#0F2A4D]">{t('title')}</h2>
        <p className="mt-2 text-gray-500">{t('subtitle')}</p>
      </div>

      <form className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <User size={16} className="text-[#0F2A4D]" />
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={personalInfo.firstName}
            onChange={handleInputChange}
            placeholder="John"
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#0F2A4D]/5 focus:border-[#0F2A4D] outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <User size={16} className="text-[#0F2A4D]" />
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={personalInfo.lastName}
            onChange={handleInputChange}
            placeholder="Smith"
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#0F2A4D]/5 focus:border-[#0F2A4D] outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Mail size={16} className="text-[#0F2A4D]" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={personalInfo.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#0F2A4D]/5 focus:border-[#0F2A4D] outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Phone size={16} className="text-[#0F2A4D]" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={personalInfo.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#0F2A4D]/5 focus:border-[#0F2A4D] outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Globe size={16} className="text-[#0F2A4D]" />
            Nationality
          </label>
          <input
            type="text"
            name="nationality"
            value={personalInfo.nationality}
            onChange={handleInputChange}
            placeholder="e.g., Canadian"
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#0F2A4D]/5 focus:border-[#0F2A4D] outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <MapPin size={16} className="text-[#0F2A4D]" />
            Full Address
          </label>
          <textarea
            name="address"
            value={personalInfo.address}
            onChange={handleInputChange}
            rows={3}
            placeholder="Enter your full residential address"
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#0F2A4D]/5 focus:border-[#0F2A4D] outline-none transition-all placeholder:text-gray-300 resize-none"
          />
        </div>
      </form>

      <div className="flex justify-between pt-8 border-t border-gray-100 max-w-3xl mx-auto">
        <button
          onClick={prevStep}
          className="px-8 py-4 rounded-2xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 active:scale-95"
        >
          <ArrowLeft size={18} />
          Previous
        </button>
        <button
          disabled={!isFormValid}
          onClick={nextStep}
          className="bg-[#0F2A4D] hover:bg-[#1a3a61] text-white px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#0F2A4D]/20 active:scale-95"
        >
          Next Step
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
