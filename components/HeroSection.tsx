'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/nextInt/navigation';
import { ArrowRight, Phone, CheckCircle } from 'lucide-react';


export default function HeroSection() {
  const t = useTranslations('landing.hero');

  return (
    <section className="relative min-h-[420px] md:min-h-[500px] bg-[#1b3d6e] overflow-hidden">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/herobg.png')" }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#0F2A4D]/90 to-[0F2A4D]/60" />

      
      <div className='flex justify-between items-center gap-8 max-w-7xl mx-auto'>
        {/* left side Content*/}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-6">
          <span className="text-white/80 text-xs font-medium">{t('badge')}</span>
          <span className="bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{t('verified')}</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-xl">
          {t('title')}{' '}
          <span className="text-[#c9a84c]">{t('titleSpan')}</span>
        </h1>

        {/* Description */}
        <p className="mt-4 text-white/75 text-sm sm:text-base max-w-md leading-relaxed">
          {t('subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow"
          >
            {t('primaryCta')} <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-transparent border border-white/40 hover:border-white text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200"
          >
            <Phone size={15} /> {t('secondaryCta')}
          </Link>

        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap gap-5">
          {[
            { key: 'noHiddenFees', label: t('trust.noHiddenFees') },
            { key: 'moneyBack', label: t('trust.moneyBack') },
            { key: 'dataStored', label: t('trust.dataStored') }
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-1.5 text-white/70 text-xs">
              <CheckCircle size={13} className="text-green-400 flex-shrink-0" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
      {/* Right side person image */}
      <div className="relative w-1/2 hidden md:flex items-end justify-center">
        <img
          src="/images/hero.png"
          alt={t('badge')}
          className="h-full max-h-[500px] object-contain object-bottom"
        />
        {/* Success Rate Card */}
      <div className="absolute bottom-0 left-0  z-20 hidden md:block">
        <div className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-[180px]">
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{t('status')}</p>
            <p className="text-sm font-bold text-gray-800">{t('successRate')}</p>
          </div>
        </div>
      </div>
      </div>
      </div>
      

      

      
    </section>
  );
}
