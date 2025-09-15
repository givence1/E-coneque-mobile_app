import { create } from 'zustand';
import i18n from '../utils/i18n';

interface LanguageState {
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
}));
