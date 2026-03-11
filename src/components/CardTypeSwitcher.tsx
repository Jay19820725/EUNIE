import React from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { Image, Type } from 'lucide-react';

export const CardTypeSwitcher: React.FC = () => {
  const { cardType, setCardType, t } = useLocale();

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-ink/40 text-xs font-light tracking-widest uppercase">{t('selectType')}</p>
      <div className="flex items-center gap-1 bg-white/50 p-1 rounded-2xl border border-sage/20 shadow-sm">
        <button
          onClick={() => setCardType('img')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            cardType === 'img' 
              ? 'bg-ink text-white shadow-md' 
              : 'text-ink/40 hover:text-ink/60'
          }`}
        >
          <Image className="w-4 h-4" />
          {t('imageCards')}
        </button>
        <button
          onClick={() => setCardType('word')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            cardType === 'word' 
              ? 'bg-ink text-white shadow-md' 
              : 'text-ink/40 hover:text-ink/60'
          }`}
        >
          <Type className="w-4 h-4" />
          {t('wordCards')}
        </button>
      </div>
    </div>
  );
};
