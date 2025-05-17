
import React from 'react';
import { motion } from 'framer-motion';

export const DynamicTitle: React.FC = () => {
  return (
    <div className="relative mb-2">
      <motion.h1 
        className="heading-text text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-400 dark:from-indigo-400 dark:to-purple-200"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        WanderSwipe
      </motion.h1>
      <p className="body-text text-lg md:text-xl text-gray-600 dark:text-gray-300 italic font-light">
        Your next adventure awaits
      </p>
    </div>
  );
};
