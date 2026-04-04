import { describe, it, expect } from 'vitest';
import { translations } from './translations';

describe('translations', () => {
  it('should define zh and ja translations', () => {
    expect(translations).toBeDefined();
    expect(translations.zh).toBeDefined();
    expect(translations.ja).toBeDefined();
  });

  it('should have matching keys for both zh and ja', () => {
    const zhKeys = Object.keys(translations.zh).sort();
    const jaKeys = Object.keys(translations.ja).sort();

    expect(zhKeys).toEqual(jaKeys);
  });

  it('should not contain empty translation strings', () => {
    for (const [lang, translationsObj] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(translationsObj)) {
        expect(value.trim(), `Empty translation string found for ${lang}.${key}`).not.toBe('');
      }
    }
  });

  it('should contain expected common keys', () => {
    const commonKeys = [
      'loading',
      'save',
      'cancel',
      'edit',
      'logout',
      'login'
    ];

    for (const lang of ['zh', 'ja'] as const) {
      const keys = Object.keys(translations[lang]);
      for (const expectedKey of commonKeys) {
        expect(keys).toContain(expectedKey);
      }
    }
  });

  it('should properly format parameterized strings (e.g. {count})', () => {
    expect(translations.zh.ocean_cast_limit).toContain('{count}');
    expect(translations.ja.ocean_cast_limit).toContain('{count}');

    expect(translations.zh.report_dominant_desc).toContain('{element}');
    expect(translations.ja.report_dominant_desc).toContain('{element}');

    expect(translations.zh.report_weak_desc).toContain('{element}');
    expect(translations.ja.report_weak_desc).toContain('{element}');
  });
});
