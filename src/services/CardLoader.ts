export interface Card {
  card_id: string;
  card_name: string;
  card_name_en: string;
  image_path: string;
  elements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  keywords: string[];
}

export const loadCards = async (locale: 'zh-TW' | 'ja-JP', cardType: 'img' | 'word'): Promise<Card[]> => {
  const languageKey = locale === 'zh-TW' ? 'tw' : 'jp';
  const response = await fetch(`/data/cards_${languageKey}_${cardType}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cards for ${locale} ${cardType}`);
  }
  return response.json();
};
