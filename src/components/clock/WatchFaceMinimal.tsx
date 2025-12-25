import { useClock } from '@/hooks/useClock';
import { motion } from 'framer-motion';

interface WatchFaceMinimalProps {
  size?: number;
}

export function WatchFaceMinimal({ size = 320 }: WatchFaceMinimalProps) {
  const { hourDegrees, minuteDegrees, secondDegrees, hours, minutes } = useClock(true);

  const center = size / 2;
  const tickRadius = size * 0.44;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative"
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 rounded-full bg-foreground/5 border border-foreground/10"
        style={{
          boxShadow: 'var(--shadow-clock)',
        }}
      >
        {/* Minimalist hour markers */}
        <svg className="absolute inset-0 w-full h-full">
          {[0, 3, 6, 9].map((hour) => {
            const angle = (hour * 30 - 90) * (Math.PI / 180);
            const innerRadius = tickRadius - 20;
            const outerRadius = tickRadius;
            
            return (
              <line
                key={hour}
                x1={center + innerRadius * Math.cos(angle)}
                y1={center + innerRadius * Math.sin(angle)}
                x2={center + outerRadius * Math.cos(angle)}
                y2={center + outerRadius * Math.sin(angle)}
                stroke="hsl(var(--foreground))"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.8}
              />
            );
          })}
          
          {/* Subtle minute markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            if ([0, 3, 6, 9].includes(i)) return null;
            const angle = (i * 30 - 90) * (Math.PI / 180);
            
            return (
              <circle
                key={i}
                cx={center + tickRadius * Math.cos(angle)}
                cy={center + tickRadius * Math.sin(angle)}
                r={2}
                fill="hsl(var(--foreground))"
                opacity={0.3}
              />
            );
          })}
        </svg>

        {/* Digital time display */}
        <div className="absolute inset-x-0 bottom-1/3 text-center">
          <span className="text-foreground-muted font-mono text-sm opacity-50">
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Hour hand */}
        <motion.div
          className="absolute origin-bottom rounded-full bg-foreground"
          style={{
            left: center - 4,
            top: center - size * 0.18,
            width: 8,
            height: size * 0.18,
            transform: `rotate(${hourDegrees}deg)`,
            borderRadius: 4,
          }}
        />

        {/* Minute hand */}
        <motion.div
          className="absolute origin-bottom rounded-full bg-foreground"
          style={{
            left: center - 2.5,
            top: center - size * 0.30,
            width: 5,
            height: size * 0.30,
            transform: `rotate(${minuteDegrees}deg)`,
            borderRadius: 4,
          }}
        />

        {/* Second hand */}
        <motion.div
          className="absolute origin-bottom"
          style={{
            left: center - 1,
            top: center - size * 0.34,
            width: 2,
            height: size * 0.38,
            transform: `rotate(${secondDegrees}deg)`,
            transformOrigin: `center ${size * 0.34}px`,
          }}
        >
          <div 
            className="w-full h-full rounded-full bg-primary"
            style={{ boxShadow: '0 0 15px hsl(var(--primary) / 0.4)' }}
          />
        </motion.div>

        {/* Center dot */}
        <div 
          className="absolute rounded-full bg-primary glow-primary"
          style={{
            left: center - 6,
            top: center - 6,
            width: 12,
            height: 12,
          }}
        />
      </div>
    </motion.div>
  );
}
