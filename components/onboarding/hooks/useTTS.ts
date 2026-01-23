import { useState, useRef, useEffect } from 'react';

export function useTTS(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (synthRef.current.paused && utteranceRef.current) {
      synthRef.current.resume();
      setIsPlaying(true);
      startTimeRef.current = Date.now() - currentTime * 1000;
      
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setCurrentTime(Math.min(elapsed, duration));
        if (elapsed >= duration || !synthRef.current?.speaking) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 100);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
        voice.name.includes('Google') ||
        voice.name.includes('Microsoft') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Zira') ||
        voice.name.includes('Daniel') ||
        voice.name.includes('Fiona')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / (150 * 0.9)) * 60;
    setDuration(estimatedDuration);

    utterance.onstart = () => {
      setIsPlaying(true);
      startTimeRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setCurrentTime(Math.min(elapsed, estimatedDuration));
        if (elapsed >= estimatedDuration || !synthRef.current?.speaking) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 100);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(estimatedDuration);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  return {
    isPlaying,
    currentTime,
    duration,
    handlePlayPause,
    formatTime,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
}

