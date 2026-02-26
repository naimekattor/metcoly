"use client";

import { useCaseStore } from '@/stores/useCaseStore';
import StepIndicator from '@/components/dashboard/StepIndicator';
import ServiceTypeStep from '@/components/dashboard/steps/ServiceTypeStep';
import PersonalInfoStep from '@/components/dashboard/steps/PersonalInfoStep';
import DocumentsStep from '@/components/dashboard/steps/DocumentsStep';
import ReviewStep from '@/components/dashboard/steps/ReviewStep';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewCasePage() {
  const { currentStep } = useCaseStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <ServiceTypeStep />;
      case 2: return <PersonalInfoStep />;
      case 3: return <DocumentsStep />;
      case 4: return <ReviewStep />;
      default: return <ServiceTypeStep />;
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-black text-[#0F2A4D] tracking-tight">
          Submit New Case
        </h1>
        <p className="mt-2 text-gray-500 font-medium">
          Follow the steps below to complete your immigration application.
        </p>
      </div>

      {/* Modern Stepper */}
      <StepIndicator currentStep={currentStep} />

      {/* Form Container */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-8 sm:p-12 lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-400 font-medium">
          Need help? <a href="#" className="text-[#0F2A4D] hover:underline">Contact our support team</a>
        </p>
      </div>
    </div>
  );
}
