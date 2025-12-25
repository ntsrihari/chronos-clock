import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClockDisplay } from '@/components/clock/ClockDisplay';
import { WatchFaceSelector } from '@/components/clock/WatchFaceSelector';
import { WatchFaceType } from '@/types/clock';
import { format } from 'date-fns';
import { useClock } from '@/hooks/useClock';

interface ClockPageProps {
  defaultFace: WatchFaceType;
  is24Hour: boolean;
  onFaceChange: (face: WatchFaceType) => void;
}

export function ClockPage({ defaultFace, is24Hour, onFaceChange }: ClockPageProps) {
  const [currentFace, setCurrentFace] = useState<WatchFaceType>(defaultFace);
  const { date } = useClock(false);

  const handleFaceChange = (face: WatchFaceType) => {
    setCurrentFace(face);
    onFaceChange(face);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-28"
    >
      {/* Date display */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <p className="text-sm text-foreground-muted tracking-wide">
          {format(date, 'EEEE')}
        </p>
        <p className="text-lg text-foreground font-medium">
          {format(date, 'MMMM d, yyyy')}
        </p>
      </motion.div>

      {/* Clock face */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', bounce: 0.3 }}
        className="mb-8"
      >
        <ClockDisplay face={currentFace} size={300} is24Hour={is24Hour} />
      </motion.div>

      {/* Face selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <WatchFaceSelector currentFace={currentFace} onSelect={handleFaceChange} />
      </motion.div>

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div 
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'hsl(var(--primary))' }}
        />
        <div 
          className="absolute bottom-1/3 -right-32 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'hsl(var(--secondary))' }}
        />
      </div>
    </motion.div>
  );
}
