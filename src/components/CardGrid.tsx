import React from 'react';
import { motion } from 'motion/react';

interface CardGridProps {
  onSelect: (index: number) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({ onSelect }) => {
  // Create an array of 12 items for the 3x4 grid
  const placeholders = Array.from({ length: 12 });

  return (
    <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md mx-auto p-4">
      {placeholders.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(index)}
          className="aspect-[2/3] bg-white rounded-xl shadow-sm border border-sage/10 cursor-pointer relative overflow-hidden group"
        >
          {/* Card Back Design */}
          <div className="absolute inset-2 border border-sage/5 rounded-lg flex items-center justify-center bg-zen-bg/30">
            <div className="w-8 h-8 rounded-full border border-sage/20 flex items-center justify-center">
              <div className="w-1 h-1 bg-sage/40 rounded-full" />
            </div>
          </div>
          
          {/* Subtle Hover Effect */}
          <div className="absolute inset-0 bg-sage/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </div>
  );
};
