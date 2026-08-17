import React from 'react';
import { motion } from 'framer-motion';
import type { ItineraryResponse } from '../types';
import { Building2, Coffee, Moon, Sun, DollarSign, MapPin } from 'lucide-react';

interface ResultsViewProps {
  data: ItineraryResponse;
}

const getTimeIcon = (time: string) => {
  switch (time.toLowerCase()) {
    case 'morning': return <Sun className="w-5 h-5 text-accent" />;
    case 'afternoon': return <Coffee className="w-5 h-5 text-accent" />;
    case 'evening': return <Moon className="w-5 h-5 text-primary" />;
    default: return <MapPin className="w-5 h-5 text-textSecondary" />;
  }
};

export const ResultsView: React.FC<ResultsViewProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mx-auto space-y-12 mt-12 mb-24 px-4"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-textPrimary">Your AI Itinerary to {data.destination}</h2>
        <p className="text-textSecondary mt-2">
          {data.days} Days • {data.budget} Budget
        </p>
      </div>

      {/* Hotels */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-textPrimary flex items-center gap-2 border-b border-white/10 pb-2">
          <Building2 className="w-6 h-6 text-primary" />
          Recommended Stays
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.hotels.map((hotel, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-5 rounded-xl hover:border-primary/50 transition-colors"
            >
              <h4 className="font-bold text-lg text-textPrimary">{hotel.name}</h4>
              <p className="text-sm text-textSecondary mt-1 flex items-start gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {hotel.address}
              </p>
              <p className="text-sm text-textPrimary/80 mt-3 line-clamp-3">{hotel.description}</p>
              <div className="mt-4 font-bold text-primary">${hotel.pricePerNight} <span className="text-textSecondary text-xs font-normal">/ night</span></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Plan */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-textPrimary flex items-center gap-2 border-b border-white/10 pb-2">
          <MapPin className="w-6 h-6 text-primary" />
          Day-by-Day Plan
        </h3>
        <div className="space-y-8">
          {data.dailyItinerary.map((day, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl">
              <h4 className="text-lg font-bold text-accent mb-4 border-b border-white/5 pb-2">
                Day {day.day}: {day.theme}
              </h4>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {day.activities.map((act, j) => (
                  <div key={j} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-surfaceHighlight text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-0 mr-4 md:mx-auto">
                      {getTimeIcon(act.time)}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surfaceHighlight/50 border border-white/5 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">{act.time}</span>
                        <span className="text-xs text-accent font-semibold">${act.estimatedCost}</span>
                      </div>
                      <h5 className="font-bold text-textPrimary">{act.activity}</h5>
                      <p className="text-sm text-textSecondary mt-1">{act.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cost Breakdown */}
      <section className="space-y-6 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold text-textPrimary flex items-center gap-2 border-b border-white/10 pb-2">
          <DollarSign className="w-6 h-6 text-primary" />
          Cost Breakdown
        </h3>
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center text-textSecondary">
            <span>Hotels Total</span>
            <span className="font-medium text-textPrimary">${data.costBreakdown.hotelsTotal}</span>
          </div>
          <div className="flex justify-between items-center text-textSecondary">
            <span>Activities Total</span>
            <span className="font-medium text-textPrimary">${data.costBreakdown.activitiesTotal}</span>
          </div>
          <div className="flex justify-between items-center text-textSecondary">
            <span>Food & Misc (Est.)</span>
            <span className="font-medium text-textPrimary">${data.costBreakdown.foodAndMiscEstimated}</span>
          </div>
          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="font-bold text-lg text-textPrimary">Grand Total</span>
            <span className="font-bold text-xl text-primary">${data.costBreakdown.grandTotal}</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
