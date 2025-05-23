import * as React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useDestinations } from '../contexts/DestinationContext';
import { Destination } from '../types';
import { Tag } from './Tag';
import { cn } from '@/lib/utils';
import { useSound } from '../hooks/useSound';
import { SwipeSticker } from './SwipeSticker';

interface DestinationCardProps {
  destination: Destination;
  onVote: (direction: 'right' | 'left') => void;
}

export const DestinationCard = ({ destination, onVote }: DestinationCardProps) => {
  const [exitX, setExitX] = React.useState<number>(0);
  const [isSwipeEnabled, setIsSwipeEnabled] = React.useState(true);
  const { addLikedCard, showStatsPanel } = useDestinations();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { play: playLikeSound } = useSound('/sounds/swipe-right.mp3');
  const { play: playDislikeSound } = useSound('/sounds/swipe-left.mp3');
  
  // Add state for sticker visibility
  const [showLikeSticker, setShowLikeSticker] = React.useState(false);
  const [showDislikeSticker, setShowDislikeSticker] = React.useState(false);
  
  // Parallax effect state
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);
  
  // Drag animation with Framer Motion
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-45, 45]);
  const opacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0]);
  
  // Update sticker visibility based on drag position
  React.useEffect(() => {
    const unsubscribe = x.onChange((latest) => {
      setShowLikeSticker(latest > 100);
      setShowDislikeSticker(latest < -100);
    });
    return () => unsubscribe();
  }, [x]);
  
  const handleDragEnd = (event: MouseEvent | PointerEvent | TouchEvent, info: { offset: { x: number } }) => {
    if (!isSwipeEnabled) return;
    
    if (info.offset.x > 150) {
      setExitX(300);
      addLikedCard(destination);
      playLikeSound();
      onVote('right');
      setIsSwipeEnabled(false);
      setShowLikeSticker(true);
      setTimeout(() => {
        setShowLikeSticker(false);
        setIsSwipeEnabled(true);
      }, 1000);
    } else if (info.offset.x < -150) {
      setExitX(-300);
      playDislikeSound();
      onVote('left');
      setIsSwipeEnabled(false);
      setShowDislikeSticker(true);
      setTimeout(() => {
        setShowDislikeSticker(false);
        setIsSwipeEnabled(true);
      }, 1000);
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
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable swiping if the panel or expanded card is open
      if (!isSwipeEnabled || showStatsPanel) return;
      
      if (e.key === 'ArrowRight') {
        setExitX(300);
        addLikedCard(destination);
        playLikeSound();
        onVote('right');
        setIsSwipeEnabled(false);
        setShowLikeSticker(true);
        setTimeout(() => {
          setShowLikeSticker(false);
          setIsSwipeEnabled(true);
        }, 1000);
      } else if (e.key === 'ArrowLeft') {
        setExitX(-300);
        playDislikeSound();
        onVote('left');
        setIsSwipeEnabled(false);
        setShowDislikeSticker(true);
        setTimeout(() => {
          setShowDislikeSticker(false);
          setIsSwipeEnabled(true);
        }, 1000);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [destination, addLikedCard, onVote, playLikeSound, playDislikeSound, isSwipeEnabled, showStatsPanel]);
  
  return (
    <>
      <SwipeSticker type="like" isVisible={showLikeSticker} />
      <SwipeSticker type="dislike" isVisible={showDislikeSticker} />
      <motion.div
        ref={cardRef}
        className="absolute inset-0 w-full h-full"
        drag={isSwipeEnabled ? "x" : false}
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
            "border-[7px] border-white dark:border-gray-800"
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
            <div className="card-overlay absolute -inset-[3px] rounded-2xl bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
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
