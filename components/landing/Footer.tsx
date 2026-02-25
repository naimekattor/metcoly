'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/nextInt/navigation';
import { usePathname } from 'next/navigation';


const FOOTER_LINKS = {
  company: [
    { key: 'aboutUs',  href: '/about'   },
    { key: 'ourTeam', href: '/team'    },
    { key: 'careers', href: '/careers' },
    { key: 'news',    href: '/news'    },
  ],
  services: [
    { key: 'permanentResidence', href: '/services/permanent-residence' },
    { key: 'studyPermits',       href: '/services/study-permits'       },
    { key: 'workPermits',        href: '/services/work-permits'        },
    { key: 'familyImmigration',  href: '/services/family-immigration'  },
  ],
  clientPortal: [
    { key: 'login',         href: '/login'         },
    { key: 'createAccount', href: '/signup'        },
    { key: 'caseTracking',  href: '/dashboard'     },
    { key: 'support',       href: '/support'       },
  ],
  legal: [
    { key: 'privacyPolicy',  href: '/privacy'  },
    { key: 'termsOfService', href: '/terms'    },
    { key: 'legalNotices',   href: '/legal'    },
    { key: 'contact',        href: '/contact'  },
  ],
} as const;

const COLUMNS = ['company', 'services', 'clientPortal', 'legal'] as const;

export default function Footer() {
  const t = useTranslations('landing.footer');


  return (
    <footer className="bg-[#111827] text-white">
      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {COLUMNS.map((colKey) => (
            <div key={colKey}>
              {/* Column heading */}
              <h3 className="text-white font-bold text-sm mb-5">
                {t(`columns.${colKey}.title`)}
              </h3>

              {/* Links */}
              <ul className="mt-4 space-y-2">
                {FOOTER_LINKS[colKey].map(({ key: linkKey, href }) => (
                  <li key={linkKey}>
                    <Link
                      href={href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {t(`columns.${colKey}.links.${linkKey}`)}
                    </Link>

                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <p className="text-gray-400 text-sm">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}