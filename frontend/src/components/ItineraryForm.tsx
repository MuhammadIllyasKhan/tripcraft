import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CalendarDays, Wallet, Mail, Send } from 'lucide-react';

interface ItineraryFormData {
  destination: string;
  days: number;
  budget: 'Budget' | 'Moderate' | 'Luxury';
  email: string;
}

interface ItineraryFormProps {
  onSubmit: (data: ItineraryFormData) => void;
  isLoading: boolean;
}

export const ItineraryForm: React.FC<ItineraryFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ItineraryFormData>({
    destination: '',
    days: 5,
    budget: 'Moderate',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit(formData);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="glass-panel rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Destination
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Kyoto, Japan"
            className="w-full bg-surfaceHighlight border border-white/5 rounded-xl px-4 py-3 text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          />
        </div>

        {/* Days */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Number of Days
          </label>
          <input
            type="number"
            required
            min={1}
            max={30}
            className="w-full bg-surfaceHighlight border border-white/5 rounded-xl px-4 py-3 text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={formData.days}
            onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Budget Level
          </label>
          <select
            className="w-full bg-surfaceHighlight border border-white/5 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value as any })}
          >
            <option value="Budget">Budget</option>
            <option value="Moderate">Moderate</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="w-full bg-surfaceHighlight border border-white/5 rounded-xl px-4 py-3 text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 bg-primary hover:bg-primaryHover text-background font-bold rounded-xl px-6 py-4 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <span className="animate-pulse">Generating your adventure...</span>
        ) : (
          <>
            <span>Craft My Itinerary</span>
            <Send className="w-5 h-5" />
          </>
        )}
      </button>
    </motion.form>
  );
};
