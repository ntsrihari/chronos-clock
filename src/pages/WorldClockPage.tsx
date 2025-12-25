import { motion } from 'framer-motion';
import { WorldClock } from '@/components/tools/WorldClock';

interface WorldClockPageProps {
  savedTimezones: string[];
  onAddTimezone: (tz: string) => void;
  onRemoveTimezone: (tz: string) => void;
}

export function WorldClockPage({ savedTimezones, onAddTimezone, onRemoveTimezone }: WorldClockPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen px-4 pt-20 pb-28"
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold text-foreground mb-6 text-center"
      >
        World Clock
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm mx-auto"
      >
        <WorldClock
          savedTimezones={savedTimezones}
          onAddTimezone={onAddTimezone}
          onRemoveTimezone={onRemoveTimezone}
        />
      </motion.div>
    </motion.div>
  );
}
