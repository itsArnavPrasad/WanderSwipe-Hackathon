import * as React from 'react';

export const useSound = (soundPath: string, volume: number = 0.2) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const play = React.useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundPath);
    }
    audioRef.current.volume = volume;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.warn('Error playing sound:', error);
    });
  }, [soundPath, volume]);

  return { play };
}; 