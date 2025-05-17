import React, { useState, useEffect } from 'react';
import { DestinationCard } from './DestinationCard';
import { FinishCard } from './FinishCard';
import { Destination } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CardDeckProps {
  destinations: Destination[];
}

export const CardDeck: React.FC<CardDeckProps> = ({ destinations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const handleVote = (direction: 'right' | 'left') => {
    // Move to the next card
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        // If we've gone through all cards, show finish card
        if (prevIndex >= destinations.length - 1) {
          setIsFinished(true);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 300);
  };
  
  const handleReset = () => {
    setCurrentIndex(0);
    setIsFinished(false);
  };
  
  // Create a stack of cards showing the current and background cards
  const renderCards = () => {
    if (isFinished) {
      return <FinishCard onReset={handleReset} />;
    }
    
    // Get current card and next 3 cards (or fewer if at the end)
    return (
      <AnimatePresence>
        {destinations
          .slice(currentIndex, currentIndex + 4)
          .map((destination, index) => {
            const isTop = index === 0;
            
            // Generate random rotation angles for stack effect
            // More randomness for cards deeper in the stack
            const randomRotation = index === 0 ? 0 : (Math.random() * 30 - 15) + (index % 2 === 0 ? -index * 2 : index * 2);
            
            // Calculate stack effect properties
            const stackProps = {
              zIndex: 10 - index,
              opacity: isTop ? 1 : 1 - index * 0.1,
              scale: 1 - index * 0.05,
              y: index * 10,
              rotate: randomRotation,
            };
            
            return (
              <motion.div 
                key={destination.id} 
                className="absolute inset-0"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: stackProps.scale,
                  opacity: stackProps.opacity,
                  y: stackProps.y,
                  rotate: stackProps.rotate,
                  zIndex: stackProps.zIndex
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isTop ? (
                  <DestinationCard 
                    destination={destination} 
                    onVote={handleVote}
                  />
                ) : (
                  <div 
                    className="w-full h-full rounded-2xl overflow-hidden shadow-lg bg-cover bg-center border-[7px] border-white dark:border-gray-800"
                    style={{ backgroundImage: `url(${destination.image})` }}
                  >
                    {/* Add proper rounded overlay to fix sharp edges */}
                    <div className="absolute -inset-[3px] rounded-2xl card-overlay"></div>
                  </div>
                )}
              </motion.div>
            );
          })}
      </AnimatePresence>
    );
  };
  
  return (
    <div className="relative w-full max-w-md mx-auto h-[600px]">
      {destinations.length > 0 ? (
        renderCards()
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="body-text">No destinations available.</p>
        </div>
      )}
    </div>
  );
};
