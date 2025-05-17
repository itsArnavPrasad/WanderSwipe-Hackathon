import { createContext, useContext, useState, type ReactNode } from 'react';
import { Destination } from '../types';

type DestinationContextType = {
  likedCards: Destination[];
  tagCounts: Record<string, number>;
  showThemesAnimation: boolean;
  showStatsPanel: boolean;
  addLikedCard: (destination: Destination) => void;
  removeLikedCard: (destinationId: string) => void;
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
      
      // Show themes animation after every 5 likes
      if ((likedCards.length + 1) % 5 === 0) {
        setShowThemesAnimation(true);
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
          setShowThemesAnimation(false);
        }, 4000);
      }
    }
  };

  const removeLikedCard = (destinationId: string) => {
    const destinationToRemove = likedCards.find(card => card.id === destinationId);
    if (destinationToRemove) {
      // Remove the card
      setLikedCards((prev) => prev.filter(card => card.id !== destinationId));
      
      // Update tag counts
      const newTagCounts = { ...tagCounts };
      destinationToRemove.tags.forEach((tag) => {
        newTagCounts[tag] = Math.max(0, (newTagCounts[tag] || 0) - 1);
        if (newTagCounts[tag] === 0) {
          delete newTagCounts[tag];
        }
      });
      setTagCounts(newTagCounts);
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
        removeLikedCard,
        toggleStatsPanel,
        dismissThemesAnimation
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestinations = () => {
  const context = useContext(DestinationContext);
  if (context === undefined) {
    throw new Error('useDestinations must be used within a DestinationProvider');
  }
  return context;
};
