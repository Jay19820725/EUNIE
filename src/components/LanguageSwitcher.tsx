import React from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-sage/20 shadow-sm">
      <Globe className="w-4 h-4 text-sage" />
      <button
        onClick={() => setLocale('zh-TW')}
        className={`text-xs font-medium transition-colors ${locale === 'zh-TW' ? 'text-sage' : 'text-ink/40 hover:text-ink/60'}`}
      >
        TW
      </button>
      <span className="text-ink/10 text-xs">|</span>
      <button
        onClick={() => setLocale('ja-JP')}
        className={`text-xs font-medium transition-colors ${locale === 'ja-JP' ? 'text-sage' : 'text-ink/40 hover:text-ink/60'}`}
      >
        JP
      </button>
    </div>
  );
};
