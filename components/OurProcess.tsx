'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

const STEPS = [
  { key: 'freeConsultation',     num: '01' },
  { key: 'documentPreparation',  num: '02' },
  { key: 'applicationSubmission',num: '03' },
  { key: 'approvalSupport',      num: '04' },
] as const;

const STATS = [
  { value: '5,000+', key: 'successfulApplications' },
  { value: '98%',    key: 'approvalRate'            },
  { value: '15+',    key: 'yearsExperience'         },
] as const;

export default function OurProcess() {
  const t = useTranslations('services.process');

  return (
    <>
      {/* ── Steps ── */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h2>
            <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">{t('subtitle')}</p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ key, num }, idx) => (
              <div key={key} className="relative bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3">
                {/* Step number */}
                <span className="text-4xl font-black text-gray-100 leading-none select-none">{num}</span>

                {/* Arrow connector — hidden on mobile & last item */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight size={18} className="text-gray-300" />
                  </div>
                )}

                {/* Title + desc */}
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{t(`steps.${key}.title`)}</h3>
                  <p className="mt-1.5 text-gray-500 text-xs leading-relaxed">{t(`steps.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-[#1b3d6e] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {STATS.map(({ value, key }) => (
              <div key={key}>
                <p className="text-4xl md:text-5xl font-black text-green-400">{value}</p>
                <p className="mt-2 text-white/60 text-sm">{t(`stats.${key}`)}</p>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock size={22} className="text-[#1b3d6e]" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('bottomCta.title')}</h2>
          <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">{t('bottomCta.subtitle')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#1b3d6e] hover:bg-[#152f56] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 active:scale-95 shadow"
            >
              {t('bottomCta.primaryCta')} <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-[#1b3d6e] text-gray-700 hover:text-[#1b3d6e] text-sm font-medium px-6 py-3 rounded-lg transition-all duration-200"
            >
              {t('bottomCta.secondaryCta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}