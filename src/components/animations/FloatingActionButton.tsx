'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
  mainIcon?: React.ReactNode;
  onMainClick?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions,
  mainIcon = <Plus className="w-6 h-6" />,
  onMainClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleActionClick = (action: FABAction) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col-reverse items-center gap-4">
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <>
            {actions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                transition={{
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleActionClick(action)}
                className="relative group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                title={action.label}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {action.icon}
                </motion.div>

                {/* Label tooltip */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute right-16 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
                >
                  {action.label}
                </motion.div>
              </motion.button>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          setIsOpen(!isOpen);
          onMainClick?.();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-16 h-16 bg-gradient-to-br from-primary to-primary-600 text-white rounded-full shadow-2xl hover:shadow-2xl transition-all flex items-center justify-center group"
      >
        {/* Ripple effect */}
        <motion.div
          animate={{
            scale: [1, 1.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-primary rounded-full"
        />

        {/* Icon */}
        <div className="relative z-10">{mainIcon}</div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    </div>
  );
};
