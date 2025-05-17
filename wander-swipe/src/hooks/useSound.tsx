import { useCallback, useRef } from 'react';

export const useSound = (soundPath: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundPath);
    }
    
    // Reset the audio to start and play
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.warn('Error playing sound:', error);
    });
  }, [soundPath]);

  return { play };
}; 