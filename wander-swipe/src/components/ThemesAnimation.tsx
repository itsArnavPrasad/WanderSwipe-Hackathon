import React, { useEffect } from 'react';
import { useDestinations } from '../contexts/DestinationContext';
import { Tag } from './Tag';

export const ThemesAnimation = () => {
  const { tagCounts, showThemesAnimation, dismissThemesAnimation } = useDestinations();
  
  useEffect(() => {
    if (showThemesAnimation) {
      const timer = setTimeout(() => {
        dismissThemesAnimation();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [showThemesAnimation, dismissThemesAnimation]);
  
  if (!showThemesAnimation) {
    return null;
  }
  
  // Get top 2 or 3 tags
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.min(3, Object.keys(tagCounts).length))
    .map(([tag]) => tag);
  
  return (
    <div 
      className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 
                 bg-white dark:bg-gray-800 px-4 py-3 rounded-full shadow-lg 
                 animate-slide-up"
      onClick={dismissThemesAnimation}
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm">You vibe with:</span>
        <div className="flex space-x-1">
          {topTags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};