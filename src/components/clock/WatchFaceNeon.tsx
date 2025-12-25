import { useClock } from '@/hooks/useClock';
import { motion } from 'framer-motion';

interface WatchFaceNeonProps {
  size?: number;
}

export function WatchFaceNeon({ size = 320 }: WatchFaceNeonProps) {
  const { hourDegrees, minuteDegrees, secondDegrees, hours, minutes, seconds } = useClock(true);

  const center = size / 2;
  const radius = size * 0.42;

  // Create arc path for progress rings
  const createArc = (progress: number, r: number) => {
    const angle = (progress * 360 - 90) * (Math.PI / 180);
    const startAngle = -90 * (Math.PI / 180);
    const largeArc = progress > 0.5 ? 1 : 0;
    
    const startX = center + r * Math.cos(startAngle);
    const startY = center + r * Math.sin(startAngle);
    const endX = center + r * Math.cos(angle);
    const endY = center + r * Math.sin(angle);
    
    return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  const hourProgress = ((hours % 12) + minutes / 60) / 12;
  const minuteProgress = (minutes + seconds / 60) / 60;
  const secondProgress = seconds / 60;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative"
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 rounded-full bg-background"
        style={{
          boxShadow: `
            var(--shadow-clock),
            0 0 60px hsl(var(--accent-purple) / 0.3),
            inset 0 0 40px hsl(var(--accent-purple) / 0.1)
          `,
        }}
      >
        {/* Animated background rings */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent-purple))" />
              <stop offset="100%" stopColor="hsl(var(--accent-pink))" />
            </linearGradient>
            <linearGradient id="neonBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent-blue))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient id="neonPink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent-pink))" />
              <stop offset="100%" stopColor="hsl(var(--accent-orange))" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background circles */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="hsl(var(--accent-purple) / 0.1)"
            strokeWidth={6}
          />
          <circle
            cx={center}
            cy={center}
            r={radius - 15}
            fill="none"
            stroke="hsl(var(--accent-blue) / 0.1)"
            strokeWidth={6}
          />
          <circle
            cx={center}
            cy={center}
            r={radius - 30}
            fill="none"
            stroke="hsl(var(--accent-pink) / 0.1)"
            strokeWidth={6}
          />

          {/* Hour progress arc */}
          <motion.path
            d={createArc(hourProgress, radius)}
            fill="none"
            stroke="url(#neonPurple)"
            strokeWidth={6}
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Minute progress arc */}
          <motion.path
            d={createArc(minuteProgress, radius - 15)}
            fill="none"
            stroke="url(#neonBlue)"
            strokeWidth={6}
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Second progress arc */}
          <motion.path
            d={createArc(secondProgress, radius - 30)}
            fill="none"
            stroke="url(#neonPink)"
            strokeWidth={6}
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </svg>

        {/* Digital time in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <motion.span 
              key={hours}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl font-light font-mono text-accent-purple"
              style={{ textShadow: '0 0 20px hsl(var(--accent-purple))' }}
            >
              {hours.toString().padStart(2, '0')}
            </motion.span>
            <span className="text-5xl font-light mx-1 text-foreground-muted animate-pulse">:</span>
            <motion.span 
              key={minutes}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl font-light font-mono text-accent-blue"
              style={{ textShadow: '0 0 20px hsl(var(--accent-blue))' }}
            >
              {minutes.toString().padStart(2, '0')}
            </motion.span>
          </div>
          <motion.span 
            key={seconds}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-mono mt-1 text-accent-pink"
            style={{ textShadow: '0 0 15px hsl(var(--accent-pink))' }}
          >
            {seconds.toString().padStart(2, '0')}
          </motion.span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent-purple" style={{ boxShadow: '0 0 8px hsl(var(--accent-purple))' }} />
            <span className="text-[10px] text-foreground-muted">HR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent-blue" style={{ boxShadow: '0 0 8px hsl(var(--accent-blue))' }} />
            <span className="text-[10px] text-foreground-muted">MIN</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent-pink" style={{ boxShadow: '0 0 8px hsl(var(--accent-pink))' }} />
            <span className="text-[10px] text-foreground-muted">SEC</span>
          </div>
        </div>

        {/* Brand */}
        <div className="absolute top-1/4 inset-x-0 text-center">
          <span 
            className="text-[10px] tracking-[0.4em] uppercase gradient-text"
          >
            Chronos
          </span>
        </div>
      </div>
    </motion.div>
  );
}
