import React, { useEffect, useRef, useState } from 'react';

interface FadeInMusicProps {
  src: string;
  duration?: number;
}

const FadeInMusic: React.FC<FadeInMusicProps> = ({ src, duration = 3000 }) => {
  const [volume, setVolume] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio == null) return;

    audio.volume = 0;
    audio.play();

    const interval = setInterval(() => {
      setVolume((prevVolume) => {
        const newVolume = prevVolume + 0.01;
        if (newVolume >= 1) {
          clearInterval(interval);
          return 1;
        }
        return newVolume;
      });
    }, duration / 100); // Increment volume over the given duration

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return <audio ref={audioRef} src={src} loop />;
};

export default FadeInMusic;
