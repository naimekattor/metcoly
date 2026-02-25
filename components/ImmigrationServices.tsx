'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Home, GraduationCap, Briefcase, Users } from 'lucide-react';

const SERVICES = [
  {
    icon: Home,
    key: 'permanentResidence',
    href: '/services/permanent-residence',
  },
  {
    icon: GraduationCap,
    key: 'studyPermits',
    href: '/services/study-permits',
  },
  {
    icon: Briefcase,
    key: 'workPermits',
    href: '/services/work-permits',
  },
  {
    icon: Users,
    key: 'familyImmigration',
    href: '/services/family-immigration',
  },
] as const;

export default function ImmigrationServices() {
  const t = useTranslations('landing.services');

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(({ icon: Icon, key, href }) => (
            <div
              key={key}
              className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-[#1b3d6e]/30 transition-all duration-200 group"
            >
              {/* Icon */}
              <div className="w-11 h-11 bg-gray-100 group-hover:bg-[#1b3d6e]/10 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Icon size={20} className="text-[#1b3d6e]" />
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-base">
                {t(`items.${key}.title`)}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                {t(`items.${key}.desc`)}
              </p>

              {/* Link */}
              <Link
                href={href}
                className="text-[#1b3d6e] text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all duration-200"
              >
                {t('learnMore')} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}