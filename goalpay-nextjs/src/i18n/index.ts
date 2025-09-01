import zh from './locales/zh.json';
import en from './locales/en.json';
import jp from './locales/jp.json';

export type Language = 'zh' | 'en' | 'jp';

export const languages = {
  zh: { name: '繁體中文', flag: '🇹🇼' },
  en: { name: 'English', flag: '🇺🇸' },
  jp: { name: '日本語', flag: '🇯🇵' }
};

export const locales = {
  zh,
  en,
  jp
};

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = locales[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to Chinese if translation not found
      value = getNestedValue(locales.zh, keys);
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

function getNestedValue(obj: any, keys: string[]): any {
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
}

export function getLanguageName(language: Language): string {
  return languages[language].name;
}

export function getLanguageFlag(language: Language): string {
  return languages[language].flag;
}
