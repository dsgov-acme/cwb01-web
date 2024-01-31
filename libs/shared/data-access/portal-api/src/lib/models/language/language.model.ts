export const DEFAULT_LOCALE = 'en';
export const PSEUDO_LANGUAGE = 'zz';
export const AVAILABLE_LOCALES = ['en', 'zz'];
const PREFERRED_LANGUAGE_STORAGE_KEY = 'preferredLanguage';

export class LanguageModel {
  private _preferredLanguage = '';

  constructor() {
    this._preferredLanguage =
      AVAILABLE_LOCALES.find(language => language === localStorage.getItem(PREFERRED_LANGUAGE_STORAGE_KEY)) ??
      AVAILABLE_LOCALES.find(language => navigator.language.startsWith(language)) ??
      DEFAULT_LOCALE;
  }

  public get preferredLanguage(): string {
    return this._preferredLanguage;
  }

  public set preferredLanguage(language: string) {
    this._preferredLanguage = AVAILABLE_LOCALES.find(_language => _language === language) || DEFAULT_LOCALE;
    localStorage.setItem(PREFERRED_LANGUAGE_STORAGE_KEY, this._preferredLanguage);
  }
}
