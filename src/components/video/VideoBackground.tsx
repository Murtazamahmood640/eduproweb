'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoBackgroundProps {
  videoSrc?: string;
  fallbackColor?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc = '/videos/hero-bg.mp4',
  fallbackColor = 'from-primary to-primary-600',
  overlay = true,
  overlayOpacity = 0.4,
  children,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('canplay', () => setIsVideoLoaded(true));
      video.addEventListener('error', () => setHasError(true));
      video.play().catch(() => setHasError(true));

      return () => {
        video.removeEventListener('canplay', () => setIsVideoLoaded(true));
        video.removeEventListener('error', () => setHasError(true));
      };
    }
  }, []);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Fallback gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${fallbackColor}`} />

      {/* Video */}
      {!hasError && (
        <motion.video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0 }}
        >
          <source src={videoSrc} type="video/mp4" />
        </motion.video>
      )}

      {/* Overlay gradient */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
