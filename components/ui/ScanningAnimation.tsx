'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProgressBar } from './ProgressBar';

export function ScanningAnimation({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 20; // update every 20ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-md mx-auto py-12 flex flex-col items-center justify-center">
      <div className="w-full mb-8">
        <p className="text-center font-orbitron text-amber-500 text-lg mb-4 animate-pulse">
          診断結果を算出中...
        </p>
        <ProgressBar value={progress} />
      </div>

      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 bg-amber-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
