import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useDestinations } from '../contexts/DestinationContext';
import { Destination } from '../types';
import { Tag } from './Tag';
import { cn } from '@/lib/utils';

interface DestinationCardProps {
  destination: Destination;
  onVote: (direction: 'right' | 'left') => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onVote }) => {
  const [exitX, setExitX] = useState<number>(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const { addLikedCard } = useDestinations();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  // Drag animation with Framer Motion
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -120, 0, 120, 200], [0, 0.3, 1, 0.3, 0]);
  
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(200);
      setShowHeartAnimation(true);
      addLikedCard(destination);
      onVote('right');
    } else if (info.offset.x < -100) {
      setExitX(-200);
      onVote('left');
    }
  };
  
  // Parallax effect handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !isHovering) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation values based on mouse position relative to card center
    const rotateXVal = ((e.clientY - centerY) / (rect.height / 2)) * -10;
    const rotateYVal = ((e.clientX - centerX) / (rect.width / 2)) * 10;
    
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };
  
  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setExitX(200);
        setShowHeartAnimation(true);
        addLikedCard(destination);
        onVote('right');
      } else if (e.key === 'ArrowLeft') {
        setExitX(-200);
        onVote('left');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [destination, addLikedCard, onVote]);
  
  return (
    <>
      {showHeartAnimation && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-7xl">💖</div>
        </motion.div>
      )}
      
      <motion.div
        ref={cardRef}
        className="absolute inset-0 w-full h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{
          x,
          rotate,
          opacity,
        }}
        animate={{ x: exitX }}
        transition={{ duration: 0.2 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <div 
          className={cn(
            "parallax-card w-full h-full rounded-2xl overflow-hidden shadow-2xl",
            "border-4 border-white dark:border-gray-800"
          )}
          style={{
            transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovering ? 1.02 : 1})`,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div 
            className="relative w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${destination.image})` }}
          >
            <div className="card-overlay absolute inset-0 rounded-2xl bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div className="mb-3 flex flex-wrap">
                {destination.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
              <h2 className="heading-text text-3xl md:text-4xl font-bold mb-1 text-shadow-sm">{destination.name}</h2>
              <p className="body-text text-gray-200 mb-3 text-shadow-sm">{destination.country}</p>
              <p className="body-text text-sm text-gray-100 max-w-md text-shadow-sm">{destination.description}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};