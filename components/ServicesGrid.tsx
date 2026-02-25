'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Home, Users, GraduationCap, Briefcase, CheckCircle } from 'lucide-react';

const SERVICES = [
  {
    key: 'permanentResidence',
    icon: Home,
    href: '/services/permanent-residence',
    price: '$600+',
    features: ['eligibilityAssessment', 'applicationPrep', 'citizenshipTestPrep'],
  },
  {
    key: 'familyImmigration',
    icon: Users,
    href: '/services/family-immigration',
    price: '$1,200+',
    features: ['spousePartner', 'parentGrandparent', 'dependentChildren'],
  },
  {
    key: 'studyPermits',
    icon: GraduationCap,
    href: '/services/study-permits',
    price: '$800+',
    features: ['schoolSelection', 'studyPermitApps', 'postGraduation'],
  },
  {
    key: 'workPermits',
    icon: Briefcase,
    href: '/services/work-permits',
    price: '$900+',
    features: ['openWorkPermits', 'lmiaPermits', 'ihcWorkingHoliday'],
  },
] as const;

export default function ServicesGrid() {
  const t = useTranslations('services.grid');

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h2>
          <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">{t('subtitle')}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ key, icon: Icon, href, price, features }) => (
            <Link
              key={key}
              href={href}
              className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 hover:shadow-lg hover:border-[#1b3d6e]/30 transition-all duration-200 group"
            >
              {/* Icon */}
              <div className="w-11 h-11 bg-gray-100 group-hover:bg-[#1b3d6e]/10 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Icon size={20} className="text-[#1b3d6e]" />
              </div>

              {/* Title + desc */}
              <div>
                <h3 className="font-bold text-gray-900 text-base">{t(`items.${key}.title`)}</h3>
                <p className="mt-1.5 text-gray-500 text-sm leading-relaxed">{t(`items.${key}.desc`)}</p>
              </div>

              {/* Feature checklist */}
              <ul className="space-y-1.5 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-600 text-xs">
                    <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                    {t(`items.${key}.features.${f}`)}

                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-400 text-xs">{t('startingAt')}</span>
                <span className="text-[#1b3d6e] font-bold text-sm">{price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}