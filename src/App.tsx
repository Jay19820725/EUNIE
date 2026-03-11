import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { LocaleProvider, useLocale } from './contexts/LocaleContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { CardTypeSwitcher } from './components/CardTypeSwitcher';
import { CardGrid } from './components/CardGrid';
import { loadCards, Card } from './services/CardLoader';

const EunieApp: React.FC = () => {
  const { locale, cardType, t } = useLocale();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isRitualStarted, setIsRitualStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        const data = await loadCards(locale, cardType);
        setCards(data);
      } catch (error) {
        console.error('Error loading cards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [locale, cardType]);

  const handleSelectCard = (index: number) => {
    if (cards.length === 0) return;
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    setSelectedCard(randomCard);
  };

  const resetRitual = () => {
    setSelectedCard(null);
    setIsRitualStarted(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-hidden bg-zen-bg">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square bg-sage/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square bg-lavender/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-serif font-semibold tracking-wide text-ink">EUNIE</h1>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center flex-1">
        <AnimatePresence mode="wait">
          {!isRitualStarted ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center space-y-12 my-auto"
            >
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-serif text-ink">{t('title')}</h2>
                <p className="text-ink/50 font-light tracking-widest uppercase text-sm">{t('subtitle')}</p>
              </div>

              <CardTypeSwitcher />
              
              <button
                onClick={() => setIsRitualStarted(true)}
                disabled={isLoading}
                className="px-12 py-4 bg-ink text-white rounded-full font-medium shadow-lg shadow-ink/10 hover:shadow-xl hover:shadow-ink/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? t('shuffle') : t('startRitual')}
              </button>
            </motion.div>
          ) : selectedCard ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl shadow-sage/10 border border-sage/20 text-center space-y-6 my-auto"
            >
              <div className="aspect-[2/3] bg-zen-bg rounded-2xl flex flex-col items-center justify-center p-6 border border-sage/10 overflow-hidden relative">
                {cardType === 'img' ? (
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 bg-sage/5 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-sage/20" />
                      <p className="absolute text-[10px] text-ink/20 bottom-4 uppercase tracking-tighter">Image Placeholder</p>
                    </div>
                    <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-sage/10">
                      <h3 className="text-xl font-serif mb-1">{selectedCard.card_name}</h3>
                      <p className="text-[10px] text-ink/40 uppercase tracking-widest mb-2">{selectedCard.card_name_en}</p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {selectedCard.keywords.map(kw => (
                          <span key={kw} className="text-[9px] px-2 py-0.5 bg-sage/10 text-sage rounded-full">#{kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-6">
                      <Sparkles className="w-8 h-8 text-sage" />
                    </div>
                    <h3 className="text-3xl font-serif mb-2">{selectedCard.card_name}</h3>
                    <p className="text-xs text-ink/40 uppercase tracking-widest mb-4">{selectedCard.card_name_en}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {selectedCard.keywords.map(kw => (
                        <span key={kw} className="text-xs text-ink/60 italic">#{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={resetRitual}
                className="flex items-center gap-2 mx-auto text-sage hover:text-sage/80 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                {t('back')}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="ritual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full space-y-8 my-auto"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-serif">{t('selectCard')}</h3>
                <div className="w-12 h-0.5 bg-sage/30 mx-auto rounded-full" />
              </div>
              <CardGrid onSelect={handleSelectCard} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-ink/20 text-xs font-light tracking-widest uppercase">
        &copy; 2026 EUNIE Healing AI Platform
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LocaleProvider>
      <EunieApp />
    </LocaleProvider>
  );
}
