import { I18nContext } from 'nestjs-i18n';

const languages = ['uz', 'ru', 'en'];

export const currentLocale = (): string => {
  const lang = I18nContext.current()?.lang?.split('-')[0] || 'uz';
  if (!languages.includes(lang)) {
    return 'uz';
  }
  return lang;
};
