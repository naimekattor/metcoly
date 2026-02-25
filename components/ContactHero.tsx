'use client';

import { useTranslations } from 'next-intl';

export default function ContactHero() {
  const t = useTranslations('contact.hero');

  return (
    <section className="relative min-h-[180px] md:min-h-[220px] bg-[#1b3d6e] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/contact-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-[#1b3d6e]/75" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
        <p className="mt-3 text-white/70 text-sm sm:text-base max-w-lg leading-relaxed">
          {t('subtitle')}
        </p>
      </div>
    </section>
  );
}