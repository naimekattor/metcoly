'use client';

import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { useRouter, usePathname } from '@/nextInt/navigation';
import { locales, type Locale } from '@/nextInt/config';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = (newLocale: string) => {
    // Navigate to the current path with the new locale
    router.replace(pathname, { locale: newLocale as Locale });
  };


  return (
    <div className="flex items-center space-x-2">
      <Globe size={20} className="text-gray-600" />
      <select
        value={currentLocale}
        onChange={(e) => switchLocale(e.target.value)}
        className="bg-transparent border-none focus:outline-none text-gray-700 cursor-pointer"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale === 'en' ? 'English' : 'Français'}
          </option>
        ))}
      </select>
    </div>
  );
}