'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollTextProps {
  text: string;
  className?: string;
}

export const ScrollText = ({ text, className = '' }: ScrollTextProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'center center'],
  });

  const words = text.split(' ');

  return (
    <div ref={ref} className={className}>
      <div className="flex flex-wrap">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          
          const opacity = useTransform(scrollYProgress, [start - 0.1, start, end], [0, 1, 1]);
          const y = useTransform(scrollYProgress, [start - 0.1, start, end], [20, 0, 0]);

          return (
            <motion.span
              key={i}
              style={{ opacity, y }}
              className="mr-[0.25em]"
            >
              {word}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const RevealText = ({ text, className = '', delay = 0 }: RevealTextProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'center center'],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ scaleX: progress }} className="absolute inset-0 bg-primary origin-left" />
      <div className="relative">{text}</div>
    </div>
  );
};
