'use client';

import { useTranslations } from 'next-intl';
import { UserPlus, FileUp, Search, CheckCircle } from 'lucide-react';

const STEPS = [
  { icon: UserPlus,     key: 'createAccount',      color: 'bg-[#1b3d6e]' },
  { icon: FileUp,       key: 'submitDocs',          color: 'bg-[#1b3d6e]' },
  { icon: Search,       key: 'consultantAnalysis',  color: 'bg-[#1b3d6e]' },
  { icon: CheckCircle,  key: 'trackUpdate',         color: 'bg-green-600'  },
] as const;

export default function HowItWorks() {
  const t = useTranslations('landing.howItWorks');

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — hidden on mobile */}
          <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-px bg-gray-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 relative z-10">
            {STEPS.map(({ icon: Icon, key, color }, idx) => (
              <div key={key} className="flex flex-col items-center text-center gap-4">
                {/* Circle */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${color}`}
                >
                  <Icon size={22} className="text-white" />
                </div>

                {/* Label */}
                <div>
                  <p className="text-gray-900 font-bold text-sm">
                    {idx + 1}. {t(`steps.${key}.title`)}
                  </p>
                  <p className="mt-1.5 text-gray-500 text-xs leading-relaxed max-w-[180px] mx-auto">
                    {t(`steps.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}