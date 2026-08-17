import React from 'react';
import { PlaneTakeoff } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden w-full pt-20 pb-16 flex flex-col items-center text-center px-4">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center space-x-3 mb-6"
      >
        <div className="p-3 bg-surfaceHighlight rounded-xl shadow-lg border border-white/10">
          <PlaneTakeoff className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">TripCraft AI</h1>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-textPrimary via-textPrimary to-textSecondary max-w-4xl mx-auto leading-tight"
      >
        Explore the World with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-200">AI Intelligence</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-lg md:text-xl text-textSecondary max-w-2xl mx-auto"
      >
        Provide your destination, budget, and travel days. Our AI will craft a personalized, day-by-day itinerary and send it directly to your inbox.
      </motion.p>
    </div>
  );
};
