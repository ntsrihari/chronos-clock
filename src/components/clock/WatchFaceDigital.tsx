import { useClock } from '@/hooks/useClock';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface WatchFaceDigitalProps {
  size?: number;
  is24Hour?: boolean;
}

export function WatchFaceDigital({ size = 320, is24Hour = false }: WatchFaceDigitalProps) {
  const { hours, minutes, seconds, date } = useClock(false);

  const displayHours = is24Hour ? hours : hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const dayName = format(date, 'EEEE');
  const dateStr = format(date, 'MMM d');

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative"
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 rounded-3xl glass-strong flex flex-col items-center justify-center gap-2"
        style={{
          boxShadow: 'var(--shadow-clock), 0 0 60px hsl(var(--primary) / 0.1)',
        }}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />

        {/* Day and date */}
        <div className="text-center mb-2">
          <p className="text-primary text-xs tracking-[0.3em] uppercase">{dayName}</p>
          <p className="text-foreground-muted text-sm">{dateStr}</p>
        </div>

        {/* Main time display */}
        <div className="flex items-baseline gap-1">
          <motion.span 
            key={displayHours}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl font-light tracking-tight text-foreground font-mono"
          >
            {displayHours.toString().padStart(2, '0')}
          </motion.span>
          <span className="text-7xl font-light text-primary animate-pulse-slow">:</span>
          <motion.span 
            key={minutes}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl font-light tracking-tight text-foreground font-mono"
          >
            {minutes.toString().padStart(2, '0')}
          </motion.span>
        </div>

        {/* Seconds and AM/PM */}
        <div className="flex items-center gap-4 mt-1">
          <motion.span 
            key={seconds}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-mono text-primary tabular-nums"
          >
            {seconds.toString().padStart(2, '0')}
          </motion.span>
          {!is24Hour && (
            <span className="text-lg text-foreground-muted tracking-wider">{ampm}</span>
          )}
        </div>

        {/* Progress bar for seconds */}
        <div className="w-3/4 h-1 bg-muted rounded-full mt-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'var(--gradient-primary)',
              width: `${(seconds / 60) * 100}%`,
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Brand */}
        <p className="text-[10px] tracking-[0.4em] text-foreground-muted uppercase mt-3">Chronos</p>
      </div>
    </motion.div>
  );
}
