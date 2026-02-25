"use client";

import { Check, ClipboardList, User, Upload, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: 'Service Type', icon: ClipboardList },
  { id: 2, label: 'Personal Info', icon: User },
  { id: 3, label: 'Documents', icon: Upload },
  { id: 4, label: 'Review', icon: Eye },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <motion.div 
          className="absolute top-1/2 left-0 h-0.5 bg-[#0F2A4D] -translate-y-1/2 z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? '#0F2A4D' : '#FFFFFF',
                  color: isCompleted || isActive ? '#FFFFFF' : '#9CA3AF',
                  borderColor: isCompleted || isActive ? '#0F2A4D' : '#E5E7EB',
                  scale: isActive ? 1.1 : 1,
                }}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-shadow duration-300 ${
                  isActive ? 'shadow-[0_0_20px_rgba(15,42,77,0.3)]' : ''
                }`}
              >
                {isCompleted ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <Icon size={20} />
                )}
              </motion.div>
              <div className="absolute -bottom-8 w-32 text-center">
                <span className={`text-xs font-bold transition-colors duration-300 ${
                  isActive ? 'text-[#0F2A4D]' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
