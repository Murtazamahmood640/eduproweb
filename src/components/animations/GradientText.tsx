'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  children: string;
  colors?: string[];
  className?: string;
  animated?: boolean;
  duration?: number;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors = ['#0023ff', '#00ccff', '#0023ff'],
  className = '',
  animated = true,
  duration = 4,
}) => {
  const backgroundGradient = `linear-gradient(90deg, ${colors.join(', ')})`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={{
        background: backgroundGradient,
        backgroundSize: animated ? '200% 200%' : 'auto',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        ...(animated && {
          animation: `gradient-shift ${duration}s ease infinite`,
        }),
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};
