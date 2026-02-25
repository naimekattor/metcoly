import { useTranslations } from 'next-intl';

export default function TrustBadges() {
  const t = useTranslations('landing.trustBadges');

  const partners = [
    {
      id: 'quebec',
      label: t('quebec'),
      logo: (
        <div className="flex flex-col items-center">
          <p className="text-[10px] text-gray-500 leading-tight text-center">
            {t('quebecText').split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < t('quebecText').split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#1b3d6e] font-bold text-xl tracking-tight">Québec</span>
            {/* Fleur-de-lis flags */}
            <div className="flex gap-0.5 ml-1">
              {[0, 1].map((i) => (
                <div key={i} className="w-5 h-4 bg-[#1b3d6e] flex items-center justify-center rounded-sm">
                  <span className="text-white text-[8px] font-bold">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'cicc',
      label: 'CICC CCIC',
      logo: (
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-red-600 font-black text-2xl tracking-tight leading-none">CICC</span>
            <span className="text-[10px] text-gray-500 leading-none">{t('cicc')}</span>
          </div>
          {/* Maple leaf */}
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <circle cx="20" cy="20" r="18" fill="#dc2626" />
            <path d="M20 5 L22 16 L33 12 L27 20 L35 22 L27 24 L33 32 L22 28 L20 35 L18 28 L7 32 L13 24 L5 22 L13 20 L7 12 L18 16 Z" fill="white" />
          </svg>
          <div className="flex flex-col items-start">
            <span className="text-[#1b3d6e] font-black text-2xl tracking-tight leading-none">CCIC</span>
            <span className="text-[10px] text-gray-500 leading-none">{t('ccic')}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'certified',
      label: 'Government Certified',
      logo: (
        <div className="relative w-16 h-16">
          {/* Medal shape */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md border-4 border-yellow-300 mx-auto">
            <div className="text-center">
            <div className="text-white text-[8px] font-bold leading-tight">{t('govtLabel')}</div>
            <div className="text-white text-[7px] leading-tight font-bold">{t('govtCertified')}</div>

            </div>
          </div>
          {/* Ribbon */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-3 h-4 bg-red-600 rounded-b-sm" />
            <div className="w-3 h-4 bg-red-600 rounded-b-sm" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-white border-b border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 lg:gap-24">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-200"
              title={partner.label}
            >
              {partner.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
