import React, { useEffect } from 'react';
import { useDestinations } from '../contexts/DestinationContext';
import { Tag } from './Tag';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Get top 2 or 3 tags
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.min(3, Object.keys(tagCounts).length))
    .map(([tag]) => tag);
  
  return (
    <AnimatePresence>
      {showThemesAnimation && (
        <motion.div 
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 100, opacity: 0, x: '-50%' }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 30,
            duration: 0.5 
          }}
          className="fixed bottom-10 left-1/2 z-50 
                     bg-white dark:bg-gray-800 px-4 py-3 rounded-full shadow-lg"
          onClick={dismissThemesAnimation}
        >
          <motion.div 
            className="flex items-center space-x-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.span 
              className="text-sm"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              You vibe with:
            </motion.span>
            <div className="flex space-x-1">
              {topTags.map((tag, index) => (
                <motion.div
                  key={tag}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Tag label={tag} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
