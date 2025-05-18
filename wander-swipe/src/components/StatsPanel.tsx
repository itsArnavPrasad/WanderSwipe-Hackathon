import * as React from 'react';
import { useDestinations } from '../contexts/DestinationContext';
import { Tag } from './Tag';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ChevronRight, XCircle, ChevronLeft, Copy, Check } from 'lucide-react';
import { useSound } from '../hooks/useSound';

// Helper function to manage body scroll
const toggleBodyScroll = (disable: boolean) => {
  if (disable) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

export const StatsPanel = () => {
  const { likedCards, tagCounts, showStatsPanel, toggleStatsPanel, removeLikedCard } = useDestinations();
  const { play } = useSound('/sounds/button-click.mp3', 0.05);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const cardContentRef = React.useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = React.useState<number | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isFlipped, setIsFlipped] = React.useState(false);

  // Manage body scroll when panel or expanded card is open
  React.useEffect(() => {
    toggleBodyScroll(showStatsPanel || expandedCard !== null);
    return () => toggleBodyScroll(false);
  }, [showStatsPanel, expandedCard]);

  // Reset isFlipped when card changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [expandedCard]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // If expanded card is open, close it first
        if (expandedCard) {
          setExpandedCard(null);
          setCurrentCardIndex(null);
        } 
        // Only close the panel if there's no expanded card
        else if (showStatsPanel) {
          toggleStatsPanel();
        }
      }
    };

    if (showStatsPanel || expandedCard) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showStatsPanel, toggleStatsPanel, expandedCard]);

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

  const handleCardClick = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    play();
    setExpandedCard(cardId);
    setCurrentCardIndex(likedCards.findIndex(c => c.id === cardId));
  };

  const handlePanelToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    play();
    toggleStatsPanel();
  };

  const handleCardRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    play();
    removeLikedCard(id);
  };

  const handleExpandedCardClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    play();
    setExpandedCard(null);
  };

  const handleExpandedOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCard(null);
  };

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardElements = scrollContainerRef.current.getElementsByClassName('card-item');
      if (cardElements[index]) {
        cardElements[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex !== null && currentCardIndex > 0) {
      play();
      const newIndex = currentCardIndex - 1;
      setExpandedCard(likedCards[newIndex].id);
      setCurrentCardIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex !== null && currentCardIndex < likedCards.length - 1) {
      play();
      const newIndex = currentCardIndex + 1;
      setExpandedCard(likedCards[newIndex].id);
      setCurrentCardIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  const handleCopyDestinations = (e: React.MouseEvent) => {
    e.stopPropagation();
    play();
    const destinationsList = `Liked Destinations:\n${likedCards.map((card, index) => 
      `${index + 1}. ${card.name} - ${card.country}\n${card.description}`
    ).join('\n\n')}`;

    const textArea = document.createElement('textarea');
    textArea.value = destinationsList;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    play();
    setIsFlipped(!isFlipped);
    // If flipping to back side, scroll to top
    if (!isFlipped && cardContentRef.current) {
      cardContentRef.current.scrollTop = 0;
    }
  };

  return (
    <AnimatePresence mode="sync">
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
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring',
              stiffness: 400,
              damping: 40,
              duration: 0.2
            }}
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="heading-text font-bold text-xl">Your Travel Board</h2>
                <button 
                  onClick={handlePanelToggle}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
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

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="heading-text font-medium">Liked Destinations ({likedCards.length})</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Open the cards for more info</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={handleCopyDestinations}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
                        aria-label="Copy destinations list"
                      >
                        {isCopied ? (
                          <div className="flex items-center gap-1">
                            <Check className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-green-500">Copied!</span>
                          </div>
                        ) : (
                          <>
                            <Copy className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                              Copy list
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3" ref={scrollContainerRef}>
                    {likedCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          'relative group rounded-lg overflow-hidden border card-item',
                          card.id === expandedCard ? 'border-indigo-500 dark:border-indigo-400 scale-105' : 'border-gray-200 dark:border-gray-700',
                          'hover:border-gray-300 dark:hover:border-gray-600 transition-transform duration-300',
                          'hover:shadow-md'
                        )}
                        onClick={(e) => handleCardClick(e, card.id)}
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
                                onClick={(e) => handleCardRemove(e, card.id)}
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
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-60 bg-black/60"
                  onClick={handleExpandedOverlayClick}
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
                    stiffness: 400,
                    duration: 0.15
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const card = likedCards.find(c => c.id === expandedCard);
                    if (!card) return null;

                    return (
                      <motion.div 
                        className="relative w-full h-full"
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
                        style={{ 
                          transformStyle: "preserve-3d",
                          perspective: "2000px"
                        }}
                      >
                        {/* Front of the card */}
                        <motion.div 
                          className="absolute w-full h-full rounded-2xl border-[7px] border-white dark:border-gray-800"
                          style={{ 
                            backfaceVisibility: "hidden",
                            backgroundImage: `url(${card.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            WebkitBackfaceVisibility: "hidden"
                          }}
                        >
                          <div className="card-overlay absolute -inset-[3px] rounded-2xl bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
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
                            onClick={handleExpandedCardClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                          >
                            <X className="w-5 h-5 text-white" />
                          </button>
                          <button
                            onClick={handleFlip}
                            className="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-black/30 hover:bg-black/50 transition-colors text-white text-sm font-medium"
                          >
                            More Info
                          </button>
                          {/* Only show navigation arrows on front side */}
                          {!isFlipped && (
                            <>
                              {currentCardIndex !== null && currentCardIndex > 0 && (
                                <button
                                  onClick={handlePreviousCard}
                                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 transition-all duration-200 p-2 rounded-lg backdrop-blur-sm shadow-lg z-50"
                                  aria-label="Previous destination"
                                >
                                  <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
                                </button>
                              )}
                              {currentCardIndex !== null && currentCardIndex < likedCards.length - 1 && (
                                <button
                                  onClick={handleNextCard}
                                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 transition-all duration-200 p-2 rounded-lg backdrop-blur-sm shadow-lg z-50"
                                  aria-label="Next destination"
                                >
                                  <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
                                </button>
                              )}
                            </>
                          )}
                        </motion.div>

                        {/* Back of the card */}
                        <motion.div 
                          className="absolute w-full h-full rounded-2xl border-[7px] border-white dark:border-gray-800 overflow-hidden"
                          style={{ 
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            backgroundImage: `url(${card.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                          }}
                        >
                          {/* Dark overlay for better text readability */}
                          <div className="absolute inset-0 bg-black/90"></div>
                          
                          {/* Scrollable content area */}
                          <div 
                            ref={cardContentRef}
                            className="absolute inset-0 overflow-y-auto pb-20"
                          >
                            <div className="p-8">
                              <div className="text-white">
                                <h2 className="heading-text text-3xl font-bold mb-4">{card.name}</h2>
                                <p className="body-text text-xl text-gray-300 mb-4">{card.country}</p>
                                
                                <div className="mb-6">
                                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                                  <p className="text-gray-300">{card.description}</p>
                                </div>

                                <div className="mb-6">
                                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {card.tags.map((tag) => (
                                      <Tag key={tag} label={tag} />
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-6">
                                  <h3 className="text-lg font-semibold mb-2">What to Experience</h3>
                                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                                    {card.experience.map((exp, index) => (
                                      <li key={index}>{exp}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="mb-6">
                                  <h3 className="text-lg font-semibold mb-2">Who Should Visit</h3>
                                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                                    {card.demographic.map((demo, index) => (
                                      <li key={index}>{demo}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Fixed buttons container */}
                          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none">
                            <button
                              onClick={handleFlip}
                              className="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium pointer-events-auto"
                            >
                              Back
                            </button>
                          </div>

                          <button
                            onClick={handleExpandedCardClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <X className="w-5 h-5 text-white" />
                          </button>
                        </motion.div>
                      </motion.div>
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
          onClick={handlePanelToggle}
          className={cn(
            'fixed top-1/2 -translate-y-1/2 right-[-8px] z-50 w-[56px] h-20',
            'rounded-l-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center',
            'hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300',
            'border-l border-t border-b border-gray-200 dark:border-gray-700',
            likedCards.length > 0 ? 'animate-pulse' : ''
          )}
          whileHover={{ x: -8, scale: 1.05 }}
          initial={{ x: -8, scale: 1, opacity: 0 }}
          animate={{ x: -8, scale: 1, opacity: 1 }}
          exit={{ x: 4, scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
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
