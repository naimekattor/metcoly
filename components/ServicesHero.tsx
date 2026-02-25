'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, ClipboardList, User } from 'lucide-react';

export default function ServicesHero() {
  const t = useTranslations('services.hero');

  return (
    <section className="relative min-h-[280px] md:min-h-[320px] bg-[#1b3d6e] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/services-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-[#1b3d6e]/75" />

      {/* Top bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 flex justify-between items-center">
        <div className="inline-flex items-center gap-1.5 text-white/70 text-xs">
          <User size={12} />
          {t('breadcrumb')}

        </div>
        <button className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition-colors">
          🌐 Français
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-white/70 text-sm sm:text-base max-w-lg leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow"
          >
            {t('primaryCta')} <ArrowRight size={15} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200"
          >
            <ClipboardList size={15} /> {t('secondaryCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}