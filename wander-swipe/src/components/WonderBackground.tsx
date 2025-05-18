import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue, useSpring } from 'framer-motion';

// Configuration for each wonder image
const wonderConfigs = [
  { id: 1, name: "Lion", defaultPos: { x: 4, y: 7 }, size: 150 + 10, blur: 1 },
  { id: 2, name: "London Clock", defaultPos: { x: 6, y: 38 }, size: 250 + 10, blur: 1 },
  { id: 3, name: "Christ Redeemer", defaultPos: { x: 20, y: 20 }, size: 220 + 10, blur: 0.5 },
  { id: 4, name: "Taj Mahal", defaultPos: { x: 7, y: 73 }, size: 280 + 10, blur: 0 },
  { id: 5, name: "Greek Building", defaultPos: { x: 75, y: 7 }, size: 200 + 10, blur: 0.8 },
  { id: 6, name: "Leaning Tower Of Pisa", defaultPos: { x: 67, y: 60 }, size: 215 + 10, blur: 0.3 },
  { id: 7, name: "Effiel Tower", defaultPos: { x: 80, y: 30 }, size: 235 + 10, blur: 0 },
  { id: 8, name: "Statue of Liberty", defaultPos: { x: 84, y: 65 }, size: 220 + 10, blur: 0.5 },
].map((config, index) => ({
  ...config,
  src: `/wonders/w${index + 1}.png`
}));

interface WonderImageProps {
  config: typeof wonderConfigs[0];
}

const WonderImage: React.FC<WonderImageProps> = ({ config }) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [baseX, setBaseX] = useState(0);
  const [baseY, setBaseY] = useState(0);
  
  // Spring configuration for more subtle jelly effect
  const springConfig = {
    stiffness: 150,
    damping: 10,
    mass: 1
  };

  // Motion values for x and y movement
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const rotate = useSpring(0, springConfig);
  const blur = useSpring(config.blur, springConfig);

  // Generate random movement parameters for this specific wonder
  useEffect(() => {
    const generateRandomMovement = () => {
      const randomX = (Math.random() - 0.5) * 8;
      const randomY = (Math.random() - 0.5) * 8;
      const randomDuration = 8 + Math.random() * 7;
      
      controls.start({
        x: [0, randomX, 0, -randomX, 0],
        y: [0, randomY, -randomY, 0, randomY, 0],
        rotate: [0, randomX/3, 0, -randomX/3, 0],
        transition: {
          duration: randomDuration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }
      }).then(() => {
        setBaseX(randomX);
        setBaseY(randomY);
      });
    };

    generateRandomMovement();
  }, [controls]);

  useEffect(() => {
    if (!ref.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const maxDistance = 250;

      if (distance < maxDistance) {
        const influence = 1 - (distance / maxDistance);
        const strength = 1;
        
        // Combine random movement with cursor following
        x.set(baseX - distanceX * 0.15 * influence * strength);
        y.set(baseY - distanceY * 0.15 * influence * strength);
        scale.set(1 + (0.08 * influence * strength));
        rotate.set((-distanceX * 0.04 * influence * strength));
        blur.set(Math.max(0, config.blur - (0.5 * influence * strength)));
      } else {
        x.set(baseX);
        y.set(baseY);
        scale.set(1);
        rotate.set(0);
        blur.set(config.blur);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, scale, rotate, blur, config.blur, baseX, baseY]);

  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{
        left: `${config.defaultPos.x}%`,
        top: `${config.defaultPos.y}%`,
        width: config.size,
        height: config.size,
        x,
        y,
        scale,
        rotate,
        filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, 0.02)) blur(${blur}px)`,
        zIndex: 1,
      }}
      animate={controls}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ opacity: 0.25 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={config.src}
          alt={config.name}
          className="w-full h-full object-contain transition-all duration-300 mix-blend-luminosity brightness-[0.9] contrast-[0.9]"
        />
      </motion.div>
    </motion.div>
  );
};

export const WonderBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Static background image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/t-line.png" 
          alt="Background pattern" 
          className="w-full h-full object-cover opacity-25 mix-blend-luminosity"
        />
      </div>
      
      {/* Wonder images */}
      <div className="relative w-full h-full pointer-events-auto">
        {wonderConfigs.map((config) => (
          <WonderImage key={config.id} config={config} />
        ))}
      </div>
    </div>
  );
}; 