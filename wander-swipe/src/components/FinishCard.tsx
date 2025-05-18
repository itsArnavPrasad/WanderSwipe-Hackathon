import React from 'react';
import { useDestinations } from '../contexts/DestinationContext';
import { motion } from 'framer-motion';
import { Heart, Map } from 'lucide-react';

export const FinishCard: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const { likedCards, tagCounts } = useDestinations();

  // Get top tags
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
    >
      <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-6">
            {likedCards.length > 0 ? (
              <Heart className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Map className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          
          <h2 className="heading-text text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            {likedCards.length > 0 
              ? "Your travel journey awaits!" 
              : "Explore more destinations!"}
          </h2>
          
          <p className="body-text text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            {likedCards.length > 0 
              ? `You've liked ${likedCards.length} destination${likedCards.length > 1 ? 's' : ''}. Your travel personality is shining through!` 
              : "You haven't liked any destinations yet. Ready to discover places that match your style?"}
          </p>
          
          {likedCards.length > 0 && (
            <p className="body-text text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              Open the side panel to view all your liked destinations.
            </p>
          )}
          
          {likedCards.length > 0 && topTags.length > 0 && (
            <div className="mb-8">
              <p className="body-text mb-3 font-medium text-gray-700 dark:text-gray-200">Your top travel themes:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {topTags.map(([tag, count]) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-400 text-white rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={onReset}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 body-text"
          >
            Discover More Places
          </button>
        </div>
      </div>
    </motion.div>
  );
};
