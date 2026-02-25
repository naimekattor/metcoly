'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Lock, Server, CreditCard, UserX } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, key: 'secureAuth'    },
  { icon: Lock,        key: 'dataEncryption' },
  { icon: Server,      key: 'canadianHosting'},
  { icon: CreditCard,  key: 'pciCompliance'  },
  { icon: UserX,       key: 'fraudProtection'},
] as const;

export default function SecurityCompliance() {
  const t = useTranslations('landing.security');

  return (
    <section className="bg-linear-to-r from-[#0F2A4D] via-[#0A5C63] to-[#0F2A4D] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {t('title')}
          </h2>
          <p className="mt-3 text-white/60 text-sm sm:text-base max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Feature icons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {FEATURES.map(({ icon: Icon, key }) => (
            <div key={key} className="flex flex-col items-center text-center gap-3 group">
              {/* Icon box */}
              <div className="w-14 h-14 bg-white/10 group-hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors duration-200 border border-white/10">
                <Icon size={22} className="text-green-400" />
              </div>

              {/* Title */}
              <p className="text-white font-semibold text-xs sm:text-sm leading-tight">
                {t(`items.${key}.title`)}
              </p>

              {/* Subtitle */}
              <p className="text-white/50 text-[11px] leading-snug">
                {t(`items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}