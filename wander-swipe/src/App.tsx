import { useState, useEffect } from 'react';
import { StatsPanel } from './components/StatsPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { TagPopup } from './components/TagPopup';
import { CardDeck, useDeckContext } from './components/CardDeck';

export default function App() {
  const { showThemesAnimation, likedCards } = useDeckContext();
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [showTagPopup, setShowTagPopup] = useState(false);

  useEffect(() => {
    if (showThemesAnimation) {
      const topTags = Object.entries(
        likedCards
          .flatMap(card => card.tags)
          .reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([tag]) => tag);

      setCurrentTags(topTags);
      setShowTagPopup(true);
    }
  }, [showThemesAnimation, likedCards]);

  useEffect(() => {
    if (showTagPopup) {
      const timer = setTimeout(() => {
        setShowTagPopup(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showTagPopup]);

  return (
    <div className="min-h-screen bg-bg-primary transition-colors">
      <header className="fixed top-0 left-0 right-0 z-10 bg-bg-primary/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-accent-primary">
            WanderSwipe
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CardDeck />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <StatsPanel />
          </div>
        </div>
      </main>

      <TagPopup
        tags={currentTags}
        isVisible={showTagPopup}
        onClose={() => setShowTagPopup(false)}
      />
    </div>
  );
}
