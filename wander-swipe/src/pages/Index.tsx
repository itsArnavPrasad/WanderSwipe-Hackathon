import React, { useState, useEffect } from 'react';
import { CardDeck } from '../components/CardDeck';
import { ThemeToggle } from '../components/ThemeToggle';
import { StatsPanel } from '../components/StatsPanel';
import { ThemesAnimation } from '../components/ThemesAnimation';
import { DynamicTitle } from '../components/DynamicTitle';
import { DynamicBackground } from '../components/DynamicBackground';
import destinations from '../data/destinations.json';
import { Destination } from '../types';

const Index: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  
  useEffect(() => {
    // Import the fonts CSS
    import('../styles/fonts.css');
    
    // Simulate loading destinations
    const timer = setTimeout(() => {
      setAllDestinations(destinations as Destination[]);
      setLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!loaded) {
    return (
      <DynamicBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="heading-text text-5xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">WanderSwipe</h1>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
              <p className="body-text ml-3 text-gray-600 dark:text-gray-300">Discovering destinations...</p>
            </div>
          </div>
        </div>
      </DynamicBackground>
    );
  }
  
  return (
    <DynamicBackground>
      <div className="min-h-screen flex flex-col items-center py-16 px-4 transition-colors duration-300">
        <ThemeToggle />
        <StatsPanel />
        <ThemesAnimation />
        
        <div className="mb-8 text-center">
          <DynamicTitle />
        </div>
        
        <div className="w-full max-w-md mx-auto flex-1">
          {allDestinations.length > 0 ? (
            <CardDeck destinations={allDestinations} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="body-text">No destinations available.</p>
            </div>
          )}
        </div>
      </div>
    </DynamicBackground>
  );
};

export default Index;
