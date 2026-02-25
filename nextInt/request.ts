import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, locales } from './config';

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  const locale = cookieLocale && locales.includes(cookieLocale as any)
    ? cookieLocale
    : defaultLocale;

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  };
});
