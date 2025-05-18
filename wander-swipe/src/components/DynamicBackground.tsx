import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { WonderBackground } from './WonderBackground';

export const DynamicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 }); // Center by default
  const [isHovering, setIsHovering] = useState(true); // Start as true to show initial gradient
  const lastKnownPosition = useRef({ x: 0.5, y: 0.5 });
  const { theme } = useTheme();
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      lastKnownPosition.current = { x, y };
      setMousePosition({ x, y });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      // Keep the last known position when cursor leaves
      setMousePosition(lastKnownPosition.current);
      setIsHovering(true); // Keep the hover effect active
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const getGradientColors = () => {
    // Different colors for light and dark themes
    if (theme === 'dark') {
      return {
        start: 'hsl(240, 30%, 10%)',
        end: 'hsl(230, 30%, 15%)',
        hover: {
          start: 'hsl(250, 35%, 12%)',
          end: 'hsl(220, 35%, 18%)'
        }
      };
    } else {
      return {
        start: 'hsl(215, 100%, 96%)',
        end: 'hsl(248, 100%, 95%)',
        hover: {
          start: 'hsl(225, 100%, 88%)',
          end: 'hsl(258, 100%, 85%)'
        }
      };
    }
  };

  const gradientColors = getGradientColors();
  const startColor = isHovering ? gradientColors.hover.start : gradientColors.start;
  const endColor = isHovering ? gradientColors.hover.end : gradientColors.end;

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-all duration-1000"
      style={{
        background: `
          radial-gradient(
            circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
            ${startColor} 0%,
            ${endColor} 100%
          )
        `,
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
      }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5"></div>
      
      {/* Add the WonderBackground component */}
      <WonderBackground />
      
      {/* Light particles effect in dark mode */}
      {theme === 'dark' && Array.from({ length: 40 }).map((_, i) => (
        <div 
          key={i}
          className="absolute bg-white rounded-full opacity-20 animate-float"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 5}s`
          }}
        />
      ))}
      
      {children}
    </div>
  );
};
