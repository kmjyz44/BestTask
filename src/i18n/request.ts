
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = requestLocale;
  if (!locale) locale = 'en';
  if (!['en', 'es'].includes(locale)) locale = 'en';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
