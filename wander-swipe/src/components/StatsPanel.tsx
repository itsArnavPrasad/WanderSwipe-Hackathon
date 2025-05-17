import React, { useRef, useEffect, useState } from 'react';
import { useDestinations } from '../contexts/DestinationContext';
import { Tag } from './Tag';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ChevronRight } from 'lucide-react';

export const StatsPanel = () => {
  const { likedCards, tagCounts, showStatsPanel, toggleStatsPanel } = useDestinations();
  const panelRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showStatsPanel) {
        toggleStatsPanel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showStatsPanel, toggleStatsPanel]);

  // Get top tags
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleCardClick = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  if (!showStatsPanel) {
    return (
      <motion.button
        onClick={toggleStatsPanel}
        className={cn(
          'fixed top-1/2 -translate-y-1/2 right-0 z-50 w-12 h-20',
          'rounded-l-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center',
          'hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300',
          'border-l border-t border-b border-gray-200 dark:border-gray-700',
          likedCards.length > 0 ? 'animate-pulse' : ''
        )}
        whileHover={{ x: -8 }}
        initial={false}
        animate={{ x: 0 }}
        aria-label="Show your travel board"
      >
        <div className="flex flex-col items-center">
          <Heart className={cn(
            'w-5 h-5 mb-1',
            likedCards.length > 0 ? 'text-pink-500' : 'text-gray-400'
          )} />
          <span className="font-bold text-sm">{likedCards.length}</span>
          <ChevronRight className="w-4 h-4 mt-1 text-gray-400" />
        </div>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {showStatsPanel && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={toggleStatsPanel}
          />
          <motion.div 
            ref={panelRef}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] overflow-y-auto bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="heading-text font-bold text-xl">Your Travel Board</h2>
                <button 
                  onClick={toggleStatsPanel}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {likedCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                  </div>
                  <p className="body-text text-gray-500 dark:text-gray-400 mb-2">
                    Your board is empty
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Swipe right on destinations you like to see them here
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="heading-text font-medium mb-3">Your Top Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {topTags.map(([tag, count], index) => (
                        <motion.div 
                          key={tag} 
                          className="flex items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Tag label={tag} />
                          <span className="ml-1 text-xs text-gray-600 dark:text-gray-300">({count})</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <h3 className="heading-text font-medium mb-3">Liked Destinations ({likedCards.length})</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {likedCards.map((card, index) => (
                      <motion.div 
                        key={card.id}
                        className="flex bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleCardClick(card.id)}
                        layoutId={`card-${card.id}`}
                      >
                        <div 
                          className="w-20 h-20 bg-cover bg-center"
                          style={{ backgroundImage: `url(${card.image})` }}
                        />
                        <div className="p-3 flex-1">
                          <h4 className="heading-text font-medium text-sm">{card.name}</h4>
                          <p className="body-text text-xs text-gray-600 dark:text-gray-300">{card.country}</p>
                          <div className="mt-1 flex flex-wrap">
                            {card.tags.slice(0, 2).map((tag) => (
                              <Tag key={tag} label={tag} className="text-[10px] py-0 px-2" />
                            ))}
                            {card.tags.length > 2 && (
                              <span className="text-[10px] text-gray-500 ml-1">+{card.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Expanded Card Overlay */}
          <AnimatePresence>
            {expandedCard && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
                  onClick={() => setExpandedCard(null)}
                />
                <motion.div
                  layoutId={`card-${expandedCard}`}
                  className="fixed z-70 top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-md h-[500px] rounded-2xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0.8, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ 
                    type: "spring",
                    damping: 20,
                    stiffness: 300
                  }}
                >
                  {(() => {
                    const card = likedCards.find(c => c.id === expandedCard);
                    if (!card) return null;
                    return (
                      <div 
                        className="w-full h-full relative bg-cover bg-center"
                        style={{ backgroundImage: `url(${card.image})` }}
                      >
                        <div className="card-overlay absolute inset-0 rounded-2xl"></div>
                        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                          <div className="mb-3 flex flex-wrap">
                            {card.tags.map((tag) => (
                              <Tag key={tag} label={tag} />
                            ))}
                          </div>
                          <h2 className="heading-text text-3xl font-bold mb-1 text-shadow-sm">{card.name}</h2>
                          <p className="body-text text-gray-200 mb-3 text-shadow-sm">{card.country}</p>
                          <p className="body-text text-sm text-gray-100 max-w-md text-shadow-sm">{card.description}</p>
                        </div>
                        <button
                          onClick={() => setExpandedCard(null)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    );
                  })()}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};