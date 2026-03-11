import React, { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'zh-TW' | 'ja-JP';
type CardType = 'img' | 'word';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  cardType: CardType;
  setCardType: (type: CardType) => void;
  t: (key: string) => string;
}

const translations = {
  'zh-TW': {
    title: '嶼妳 EUNIE',
    subtitle: '療癒系 AI 占卜平台',
    startRitual: '開始儀式',
    selectCard: '請深呼吸，選擇一張吸引你的卡片',
    back: '返回',
    imageCards: '圖像卡',
    wordCards: '文字卡',
    selectType: '選擇卡片類型',
    shuffle: '洗牌中...',
  },
  'ja-JP': {
    title: 'EUNIE',
    subtitle: 'ヒーリング AI 占いプラットフォーム',
    startRitual: '儀式を始める',
    selectCard: '深呼吸をして、気になるカードを一枚選んでください',
    back: '戻る',
    imageCards: '画像カード',
    wordCards: '単語カード',
    selectType: 'カードタイプを選択',
    shuffle: 'シャッフル中...',
  },
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('zh-TW');
  const [cardType, setCardType] = useState<CardType>('img');

  const t = (key: string) => {
    return translations[locale][key as keyof typeof translations['zh-TW']] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, cardType, setCardType, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
