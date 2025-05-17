import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useAnimation } from 'framer-motion';

interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  tags: string[];
  description: string;
}

interface CardProps {
  destination: Destination;
  onSwipe: (direction: 'left' | 'right') => void;
}

export const Card = ({ destination, onSwipe }: CardProps) => {
  const [exitX, setExitX] = useState<number>(0);
  const cardElem = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -125, 0, 125, 200], [0, 1, 1, 1, 0]);
  const controls = useAnimation();

  // 3D parallax effect
  const rotateX = useSpring(0, { stiffness: 400, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardElem.current) return;
    const rect = cardElem.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    rotateX.set(mouseY * -0.01);
    rotateY.set(mouseX * 0.01);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleDragEnd = () => {
    const xVal = x.get();
    if (Math.abs(xVal) > 100) {
      setExitX(xVal > 0 ? 200 : -200);
      onSwipe(xVal > 0 ? 'right' : 'left');
      if (xVal > 0) {
        controls.start({
          scale: [1, 1.2, 1],
          transition: { duration: 0.3 }
        });
      }
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setExitX(-200);
        onSwipe('left');
      } else if (e.key === 'ArrowRight') {
        setExitX(200);
        onSwipe('right');
        controls.start({
          scale: [1, 1.2, 1],
          transition: { duration: 0.3 }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSwipe, controls]);

  return (
    <motion.div
      ref={cardElem}
      style={{
        x,
        rotate,
        opacity,
        rotateX,
        rotateY,
        perspective: 1000,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX, ...controls }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute w-full max-w-sm md:max-w-2xl cursor-grab active:cursor-grabbing focus:outline-none"
      tabIndex={0}
      role="button"
      aria-label={`${destination.name} - Swipe right to like, left to skip`}
    >
      <div className="card overflow-hidden transform-gpu">
        <div className="relative h-64 md:h-96 -mx-6 -mt-6">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-bg-secondary/90 to-transparent"
            animate={{
              opacity: x.get() > 100 ? 0.8 : x.get() < -100 ? 0.3 : 0.5
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <motion.h2
              className="text-2xl md:text-3xl font-semibold text-text-primary"
              animate={{
                scale: x.get() > 100 ? 1.1 : 1
              }}
            >
              {destination.name}
            </motion.h2>
            <p className="text-text-secondary">{destination.country}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {destination.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="px-2 py-1 text-sm bg-accent-primary/10 text-accent-primary rounded-full"
              >
                {tag}
              </motion.span>
            ))}
          </div>
          <p className="text-text-secondary">{destination.description}</p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-sm text-text-secondary">
          <span>← Swipe left to skip</span>
          <span>Swipe right to save →</span>
        </div>
      </div>
    </motion.div>
  );
}; 