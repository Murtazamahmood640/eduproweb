'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(0, 35, 255, 0.15)',
  spotlightSize = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Spotlight gradient */}
      <motion.div
        className="absolute pointer-events-none z-10 rounded-full"
        style={{
          width: spotlightSize,
          height: spotlightSize,
          background: `radial-gradient(circle, ${spotlightColor}, transparent 70%)`,
          filter: 'blur(40px)',
        }}
        animate={{
          x: isHovering ? position.x - spotlightSize / 2 : -spotlightSize,
          y: isHovering ? position.y - spotlightSize / 2 : -spotlightSize,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.1, type: 'tween' }}
      />

      {/* Content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
};
