import { DEFAULT_LOCALE, LanguageModel } from './language.model';

describe('LanguageModel', () => {
  let languageModel: LanguageModel;

  beforeEach(() => {
    localStorage.removeItem('preferredLanguage');
    languageModel = new LanguageModel();
  });

  it('should set _preferredLanguage to DEFAULT_LOCALE', () => {
    Object.defineProperty(global, 'navigator', { value: { language: 'unsupported-language' } });
    const languageModel2 = new LanguageModel();
    expect(languageModel2.preferredLanguage).toEqual(DEFAULT_LOCALE);
  });

  describe('preferredLanguage', () => {
    test('should get the default preferred language', () => {
      expect(languageModel.preferredLanguage).toEqual('en');
      expect(languageModel['_preferredLanguage']).toEqual('en');
      expect(localStorage.getItem('preferredLanguage')).toEqual(null);
    });

    test('should set the default preferred language to a supported language', () => {
      languageModel.preferredLanguage = 'zz';

      expect(languageModel.preferredLanguage).toEqual('zz');
      expect(languageModel['_preferredLanguage']).toEqual('zz');
      expect(localStorage.getItem('preferredLanguage')).toEqual('zz');
    });

    test('should set the default preferred language to a supported language', () => {
      languageModel.preferredLanguage = 'zzz';

      expect(languageModel.preferredLanguage).toEqual('en');
      expect(languageModel['_preferredLanguage']).toEqual('en');
      expect(localStorage.getItem('preferredLanguage')).toEqual('en');
    });
  });
});
