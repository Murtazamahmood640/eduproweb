'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({ front, back, className = '' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={`relative w-full h-full cursor-pointer perspective ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onTap={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center',
        }}
      >
        {/* Front */}
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
          }}
          initial={false}
        >
          {front}
        </motion.div>

        {/* Back */}
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            inset: 0,
          }}
        >
          {back}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
