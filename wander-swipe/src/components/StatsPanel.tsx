import * as React from 'react';
import { useDestinations } from '../contexts/DestinationContext';
import { Tag } from './Tag';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ChevronRight, XCircle } from 'lucide-react';

export const StatsPanel = () => {
  const { likedCards, tagCounts, showStatsPanel, toggleStatsPanel, removeLikedCard } = useDestinations();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showStatsPanel) {
        toggleStatsPanel();
      }
    };

    if (showStatsPanel) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showStatsPanel, toggleStatsPanel]);

  // Handle clicks outside the panel
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        toggleStatsPanel();
      }
    };

    if (showStatsPanel) {
      // Small delay to prevent immediate trigger
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showStatsPanel, toggleStatsPanel]);

  // Get top tags
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleCardClick = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <AnimatePresence mode="wait">
      {showStatsPanel ? (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <motion.div 
            key="panel"
            ref={panelRef}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] overflow-y-auto bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring',
              stiffness: 400,
              damping: 40
            }}
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="heading-text font-bold text-xl">Your Travel Board</h2>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatsPanel();
                  }}
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
                  <div className="space-y-3">
                    {likedCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          'relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700',
                          'hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300',
                          'hover:shadow-md'
                        )}
                        onClick={() => setExpandedCard(card.id)}
                      >
                        <div className="flex items-start cursor-pointer">
                          <div 
                            className="w-24 h-24 flex-shrink-0 bg-cover bg-center rounded-l-lg"
                            style={{ backgroundImage: `url(${card.image})` }}
                          />
                          <div className="flex-1 min-w-0 p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="heading-text font-medium text-gray-900 dark:text-white truncate">
                                  {card.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {card.country}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeLikedCard(card.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                                aria-label={`Remove ${card.name} from liked destinations`}
                              >
                                <XCircle className="w-5 h-5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400" />
                              </button>
                            </div>
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
          <AnimatePresence mode="wait">
            {expandedCard && (
              <>
                <motion.div
                  key="expanded-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCard(null);
                  }}
                />
                <motion.div
                  key="expanded-card"
                  layoutId={`card-${expandedCard}`}
                  className="fixed z-70 top-[25%] transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl h-[600px] rounded-2xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0.8, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ 
                    type: "spring",
                    damping: 30,
                    stiffness: 400
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
      ) : (
        <motion.button
          key="toggle-button"
          onClick={(e) => {
            e.stopPropagation();
            toggleStatsPanel();
          }}
          className={cn(
            'fixed top-1/2 -translate-y-1/2 right-[-8px] z-50 w-[56px] h-20',
            'rounded-l-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center',
            'hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300',
            'border-l border-t border-b border-gray-200 dark:border-gray-700',
            likedCards.length > 0 ? 'animate-pulse' : ''
          )}
          whileHover={{ x: -8, scale: 1.05 }}
          initial={{ x: -8, scale: 1 }}
          animate={{ x: -8, scale: 1 }}
          exit={{ x: 4, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
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
      )}
    </AnimatePresence>
  );
};
