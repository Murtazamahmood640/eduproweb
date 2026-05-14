'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StickyItem {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface StickyScrollProps {
  items: StickyItem[];
  className?: string;
}

export const StickyScroll = ({ items, className = '' }: StickyScrollProps) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const itemProgress = useTransform(scrollYProgress, [0, 1], [0, items.length - 1]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    unsubscribe = itemProgress.on('change', (value) => {
      setActiveIndex(Math.floor(value));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [itemProgress]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        height: `calc(100vh * ${items.length})`,
      }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Content side */}
        <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: activeIndex === i ? 1 : 0.3,
                  y: activeIndex === i ? 0 : 20,
                }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none"
              >
                <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visual side */}
        <div className="hidden lg:flex w-1/2 items-center justify-center px-8">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            {items[activeIndex].content}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
