
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button 
      onClick={toggleTheme}
      className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-800" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-300" />
        )}
      </motion.div>
    </motion.button>
  );
};
