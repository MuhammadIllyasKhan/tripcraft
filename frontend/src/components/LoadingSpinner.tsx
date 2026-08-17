import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Map, Building, Compass } from 'lucide-react';

const MESSAGES = [
  { text: "Consulting AI Intelligence...", icon: Sparkles },
  { text: "Finding the best hotels...", icon: Building },
  { text: "Structuring daily plans...", icon: Map },
  { text: "Finalizing your adventure...", icon: Compass },
];

export const LoadingSpinner: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = MESSAGES[index].icon;

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <CurrentIcon className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>
      
      <div className="h-8 overflow-hidden relative w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg text-textSecondary font-medium absolute"
          >
            {MESSAGES[index].text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
