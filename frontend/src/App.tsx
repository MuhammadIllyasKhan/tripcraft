import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Hero } from './components/Hero';
import { ItineraryForm } from './components/ItineraryForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultsView } from './components/ResultsView';
import type { ItineraryResponse } from './types';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ItineraryResponse | null>(null);

  // Use NEXT_PUBLIC_API_URL injected via vite.config.ts define, or fallback to the vercel backend URL
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || import.meta.env.VITE_API_URL || 'https://tripcraft-backend.vercel.app').replace(/\/$/, '');

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${apiBaseUrl}/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to generate itinerary');
      }

      const responseData: ItineraryResponse = await response.json();
      setResult(responseData);
      toast.success('Itinerary generated successfully!', {
        description: `We've also sent a copy to ${data.email}`,
      });
    } catch (error: any) {
      console.error(error);
      toast.error('Something went wrong', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <Toaster position="top-center" theme="dark" richColors />
      
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Hero />
        
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <ItineraryForm onSubmit={handleSubmit} isLoading={isLoading} />
              )}
            </motion.div>
          )}

          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <ResultsView data={result} />
              <button
                onClick={() => setResult(null)}
                className="mb-20 bg-surfaceHighlight hover:bg-white/10 text-textPrimary font-medium rounded-xl px-8 py-3 transition-colors border border-white/10"
              >
                Plan Another Trip
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
