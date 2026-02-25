'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

export default function CallToAction() {
  const t = useTranslations('landing.cta');

  return (
    <section className="bg-gradient-to-br from-[#1b3d6e] via-[#1a4a5e] to-[#0f3d3d] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto leading-snug">
          {t('title')}
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-white/65 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 active:scale-95 shadow-lg"
          >
            {t('primaryCta')} <ArrowRight size={16} />
          </Link>
          <Link
            href="tel:18001234567"
            className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white text-sm font-medium px-6 py-3 rounded-lg transition-all duration-200"
          >
            <Phone size={15} /> {t('secondaryCta')}
          </Link>
        </div>

        {/* Contact info */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <a
            href="mailto:info@larouss.com"
            className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-sm transition-colors duration-200"
          >
            <Mail size={14} /> {t('email')}
          </a>
          <div className="inline-flex items-center gap-1.5 text-white/55 text-sm">
            <MapPin size={14} /> {t('locations')}
          </div>
        </div>

      </div>
    </section>
  );
}