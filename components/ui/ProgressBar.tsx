'use client';

import { motion } from 'framer-motion';

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <motion.div
        className="bg-green-400 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
}
