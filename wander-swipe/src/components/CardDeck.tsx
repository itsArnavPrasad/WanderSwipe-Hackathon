import { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import destinationsData from '../data/destinations.json';

interface DeckContextType {
  likedCards: typeof destinationsData.destinations;
  tagCounts: Record<string, number>;
  showThemesAnimation: boolean;
}

export const DeckContext = createContext<DeckContextType>({
  likedCards: [],
  tagCounts: {},
  showThemesAnimation: false,
});

export const useDeckContext = () => useContext(DeckContext);

export const CardDeck = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCards, setLikedCards] = useState<typeof destinationsData.destinations>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [showThemesAnimation, setShowThemesAnimation] = useState(false);
  const [exitX, setExitX] = useState(0);

  const visibleCards = destinationsData.destinations.slice(
    currentIndex,
    currentIndex + 3
  );

  const handleSwipe = (direction: 'left' | 'right') => {
    setExitX(direction === 'right' ? 200 : -200);
    
    if (direction === 'right') {
      const destination = destinationsData.destinations[currentIndex];
      setLikedCards(prev => [...prev, destination]);
      
      // Update tag counts
      const newTagCounts = { ...tagCounts };
      destination.tags.forEach(tag => {
        newTagCounts[tag] = (newTagCounts[tag] || 0) + 1;
      });
      setTagCounts(newTagCounts);

      // Check if we should show themes animation
      if (likedCards.length === 4) {
        setShowThemesAnimation(true);
      }
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitX(0);
    }, 300);
  };

  return (
    <DeckContext.Provider value={{ likedCards, tagCounts, showThemesAnimation }}>
      <div className="relative h-[600px] flex items-center justify-center">
        <AnimatePresence>
          {visibleCards.map((destination, index) => {
            const isTop = index === 0;
            return (
              <motion.div
                key={destination.id}
                initial={isTop ? { scale: 0.8, y: 50, opacity: 0 } : { scale: 0.95 - index * 0.05, y: -index * 10 }}
                animate={isTop ? { scale: 1, y: 0, opacity: 1 } : { scale: 0.95 - index * 0.05, y: -index * 10 }}
                exit={isTop ? { x: exitX, opacity: 0 } : { scale: 1 }}
                transition={{ type: "spring", damping: 20 }}
                style={{
                  zIndex: visibleCards.length - index,
                }}
              >
                {isTop ? (
                  <Card
                    destination={destination}
                    onSwipe={handleSwipe}
                  />
                ) : (
                  <div className="pointer-events-none">
                    <Card
                      destination={destination}
                      onSwipe={() => {}}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {currentIndex >= destinationsData.destinations.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-12"
          >
            <h2 className="text-xl font-semibold mb-2">
              No more destinations!
            </h2>
            <p className="text-text-secondary">
              Check out your travel stats to see your matches.
            </p>
          </motion.div>
        )}
      </div>
    </DeckContext.Provider>
  );
}; 