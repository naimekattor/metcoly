"use client";

import { useTranslations } from 'next-intl';
import { useCaseStore } from '@/stores/useCaseStore';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, FileCheck, Send, Info } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewStep() {
  const t = useTranslations('dashboard.newCase.step4');
  const { serviceType, personalInfo, documents, prevStep, resetForm } = useCaseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    resetForm();
    router.push('/dashboard/user/my-cases');
  };

  const docCount = Object.values(documents).filter(file => file !== null).length;

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-[#0F2A4D]">{t('title')}</h2>
        <p className="mt-2 text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Summary Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-[#0F2A4D]/10 flex items-center justify-center text-[#0F2A4D]">
              <FileCheck size={20} />
            </div>
            <h3 className="font-extrabold text-[#0F2A4D] text-xl">Application Summary</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium">Service Type:</span>
              <span className="text-[#0F2A4D] font-bold">{serviceType?.label}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium">Applicant Name:</span>
              <span className="text-[#0F2A4D] font-bold">{personalInfo.firstName} {personalInfo.lastName}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium">Email Address:</span>
              <span className="text-[#0F2A4D] font-bold">{personalInfo.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium">Documents Uploaded:</span>
              <span className="text-[#0F2A4D] font-bold">{docCount} files</span>
            </div>
            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-gray-500 font-bold">Application Fee:</span>
              <span className="text-[#B38B3F] text-2xl font-black">{serviceType?.price}</span>
            </div>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#FFF9F2] p-6 rounded-2xl border border-[#FFE8C8] flex gap-4">
            <div className="mt-1 text-[#B38B3F]">
              <Info size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#856404] leading-relaxed">
                By submitting this application, you agree to our Terms of Service and confirm that all information provided is accurate and complete.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4">
            <div className="mt-1 text-[#0F2A4D]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                Your data is encrypted and secure. Only certified consultants will have access to your documents.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center p-8 bg-[#0F2A4D]/5 rounded-3xl border-2 border-dashed border-[#0F2A4D]/20"
          >
            <p className="text-[#0F2A4D] font-bold text-center">Ready to begin your journey?</p>
          </motion.div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t border-gray-100 max-w-4xl mx-auto">
        <button
          disabled={isSubmitting}
          onClick={prevStep}
          className="px-8 py-4 rounded-2xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Previous
        </button>
        <button
          disabled={isSubmitting}
          onClick={handleFinalSubmit}
          className="bg-[#0F2A4D] hover:bg-[#1a3a61] text-white px-12 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-lg shadow-[#0F2A4D]/20 active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <CheckCircle2 size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
