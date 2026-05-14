'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  progress,
  size = 'md',
  color = '#0023ff',
  showLabel = true,
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const containerHeight = sizeClasses[size];

  return (
    <div className="w-full">
      <div className={`relative w-full ${containerHeight} bg-gray-200 rounded-full overflow-hidden`}>
        {/* Background shimmer */}
        {animated && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Progress bar */}
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full relative overflow-hidden shadow-lg`}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: animated ? 1.5 : 0.3,
            type: 'spring',
            stiffness: 50,
          }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Label */}
      {showLabel && (
        <motion.div
          className="mt-2 flex items-center justify-between text-xs font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-gray-600">Progress</span>
          <motion.span
            className="text-primary font-black"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            {progress.toFixed(0)}%
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};
