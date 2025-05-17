import * as React from 'react';

export const useSound = (soundPath: string) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const play = React.useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundPath);
      audioRef.current.volume = 0.2; // Set volume to 50%
    }
    
    // Reset the audio to start and play
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.warn('Error playing sound:', error);
    });
  }, [soundPath]);

  return { play };
}; 