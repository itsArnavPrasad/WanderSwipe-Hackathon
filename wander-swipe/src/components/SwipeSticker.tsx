import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SwipeStickerProps {
  type: 'like' | 'dislike';
  isVisible: boolean;
}

export const SwipeSticker: React.FC<SwipeStickerProps> = ({ type, isVisible }) => {
  // Generate random position values on mount
  const [randomOffset] = React.useState({
    y: Math.random() * 100 - 50, // Random value between -50 and 50
    x: Math.random() * 50 - 25,  // Random value between -25 and 25
  });

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotate: type === 'like' ? -30 : 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12
      }
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className="fixed z-50"
      style={{
        top: `calc(50% + ${randomOffset.y}px)`,
        [type === 'like' ? 'right' : 'left']: `calc(20% + ${randomOffset.x}px)`,
        transform: 'translate(-50%, -50%)'
      }}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      exit="exit"
      variants={variants}
    >
      <div
        className={cn(
          "px-8 py-4 rounded-full font-bold text-4xl transform rotate-12 border-8",
          type === 'like' 
            ? "bg-green-500/90 text-white border-green-600"
            : "bg-red-500/90 text-white border-red-600"
        )}
      >
        {type === 'like' ? "Nice!" : "No"}
      </div>
    </motion.div>
  );
}; 