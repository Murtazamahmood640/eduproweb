'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export const ScrollCounter = ({ 
  target, 
  suffix = '', 
  prefix = '',
  className = '',
  duration = 1
}: ScrollCounterProps) => {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'center center'],
  });

  const count = useTransform(scrollYProgress, [0, 1], [0, target]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    unsubscribe = count.on('change', (value) => {
      setDisplayValue(Math.floor(value));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [count]);

  return (
    <div ref={ref} className={className}>
      <span>
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </span>
    </div>
  );
};

interface ScrollProgressProps {
  className?: string;
}

export const ScrollProgress = ({ className = '' }: ScrollProgressProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'center center'],
  });

  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scaleX }}
      className={`h-1 bg-gradient-to-r from-primary to-primary-600 origin-left ${className}`}
    />
  );
};
