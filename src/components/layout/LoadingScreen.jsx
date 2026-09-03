import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 12 + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(intervalRef.current);
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => onComplete?.(), 600);
        }, 400);
      }
      setProgress(Math.min(Math.floor(current), 100));
    }, 80);

    return () => clearInterval(intervalRef.current);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
        >
          {/* Background grain */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Loading lines */}
          <div className="relative w-48 sm:w-64 mb-12">
            {/* Top line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="absolute -top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent origin-left"
            />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                AMAN<span className="text-accent">.</span>
              </span>
              <p className="mt-2 font-mono text-[11px] text-muted/60 uppercase tracking-[0.3em]">
                Full Stack Developer
              </p>
            </motion.div>

            {/* Bottom line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent origin-right"
            />
          </div>

          {/* Progress bar */}
          <div className="relative w-48 sm:w-64">
            <div className="h-px w-full bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center gap-3"
          >
            <span className="font-mono text-2xl sm:text-3xl font-light text-foreground tabular-nums">
              {String(progress).padStart(3, '0')}
            </span>
            <span className="font-mono text-xs text-muted/40 uppercase tracking-widest">
              percent
            </span>
          </motion.div>

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-8 font-mono text-[10px] text-muted/30 uppercase tracking-[0.4em]"
          >
            Loading Experience
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
