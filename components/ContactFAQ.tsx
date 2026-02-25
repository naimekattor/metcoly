'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_KEYS = [
  'responseTime',
  'virtualConsultations',
  'initialConsultation',
] as const;

export default function ContactFAQ() {
  const t = useTranslations('contact.faq');
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) => setOpen((prev) => (prev === key ? null : key));

  return (
    <section className="bg-gray-50 py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
          {t('title')}
        </h2>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQ_KEYS.map((key) => (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Question */}
              <button
                onClick={() => toggle(key)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="text-gray-900 font-semibold text-sm pr-4">
                  {t(`items.${key}.question`)}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    open === key ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === key ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                  {t(`items.${key}.answer`)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}