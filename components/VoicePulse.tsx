'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface VoicePulseProps {
  analyser?: AnalyserNode | null;
  isActive: boolean;
  hasContradiction?: boolean;
  className?: string;
}

export function VoicePulse({ analyser, isActive, hasContradiction = false, className = '' }: VoicePulseProps) {
  const [audioLevel, setAudioLevel] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  // Smooth spring animation for the breathing effect
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, {
    stiffness: 50,
    damping: 15,
    mass: 0.5,
  });

  // Transform scale to opacity for outer glow
  const opacity = useTransform(springScale, [0.8, 1.2], [0.3, 0.6]);

  useEffect(() => {
    if (!isActive || !analyser) {
      scale.set(1);
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    if (!dataArrayRef.current) {
      dataArrayRef.current = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;
    }

    const updateAudioLevel = () => {
      if (!analyser || !dataArrayRef.current) return;
      
      analyser.getByteFrequencyData(dataArrayRef.current);
      
      // Calculate average audio level (0-255)
      const sum = dataArrayRef.current.reduce((acc, val) => acc + val, 0);
      const average = sum / bufferLength;
      
      // Normalize to 0-1 range and map to breathing scale (0.85 to 1.15)
      const normalized = average / 255;
      const breathingScale = 0.85 + normalized * 0.3; // Range: 0.85 to 1.15
      
      setAudioLevel(normalized);
      scale.set(breathingScale);
      
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, analyser, scale]);

  // Base colors
  const primaryColor = hasContradiction ? '#ef4444' : '#2563eb';
  const secondaryColor = hasContradiction ? '#dc2626' : '#6366f1';

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer glow layers */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          scale: springScale,
          opacity,
          background: `radial-gradient(circle, ${primaryColor}20 0%, ${secondaryColor}10 50%, transparent 70%)`,
        }}
      />
      
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          scale: springScale,
          opacity: useTransform(springScale, [0.8, 1.2], [0.2, 0.4]),
          background: `radial-gradient(circle, ${primaryColor}30 0%, ${secondaryColor}15 50%, transparent 70%)`,
        }}
      />

      {/* Main breathing orb */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: 200,
          height: 200,
          scale: springScale,
          background: `radial-gradient(circle at 30% 30%, ${primaryColor}80, ${secondaryColor}60, ${primaryColor}40)`,
          boxShadow: `0 0 60px ${primaryColor}40, 0 0 120px ${primaryColor}20, inset 0 0 40px ${primaryColor}20`,
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`,
          }}
        />
      </motion.div>

      {/* Pulse ring animation */}
      <motion.div
        className="absolute rounded-full border-2"
        style={{
          width: 200,
          height: 200,
          scale: springScale,
          borderColor: primaryColor,
          opacity: useTransform(springScale, [0.8, 1.2], [0.4, 0.8]),
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

