import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Destination } from '../types';

type DestinationContextType = {
  likedCards: Destination[];
  tagCounts: Record<string, number>;
  showThemesAnimation: boolean;
  showStatsPanel: boolean;
  addLikedCard: (destination: Destination) => void;
  toggleStatsPanel: () => void;
  dismissThemesAnimation: () => void;
};

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export const DestinationProvider = ({ children }: { children: ReactNode }) => {
  const [likedCards, setLikedCards] = useState<Destination[]>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [showThemesAnimation, setShowThemesAnimation] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);

  const addLikedCard = (destination: Destination) => {
    // Check if card is already liked to prevent duplicates
    if (!likedCards.some(card => card.id === destination.id)) {
      setLikedCards((prev) => [...prev, destination]);
      
      // Update tag counts
      const newTagCounts = { ...tagCounts };
      destination.tags.forEach((tag) => {
        newTagCounts[tag] = (newTagCounts[tag] || 0) + 1;
      });
      setTagCounts(newTagCounts);
      
      // Show themes animation after 5 liked cards
      if (likedCards.length + 1 === 5) {
        setShowThemesAnimation(true);
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
          setShowThemesAnimation(false);
        }, 4000);
      }
    }
  };

  const toggleStatsPanel = () => {
    setShowStatsPanel((prev) => !prev);
  };

  const dismissThemesAnimation = () => {
    setShowThemesAnimation(false);
  };

  return (
    <DestinationContext.Provider 
      value={{ 
        likedCards, 
        tagCounts, 
        showThemesAnimation,
        showStatsPanel,
        addLikedCard,
        toggleStatsPanel,
        dismissThemesAnimation
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestinations = (): DestinationContextType => {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error('useDestinations must be used within a DestinationProvider');
  }
  return context;
};