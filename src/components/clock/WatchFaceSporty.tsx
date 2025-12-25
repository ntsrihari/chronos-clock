import { useClock } from '@/hooks/useClock';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface WatchFaceSportyProps {
  size?: number;
}

export function WatchFaceSporty({ size = 320 }: WatchFaceSportyProps) {
  const { hourDegrees, minuteDegrees, secondDegrees, hours, minutes, seconds, date } = useClock(true);

  const center = size / 2;
  const mainRadius = size * 0.44;
  const smallDialSize = size * 0.22;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Main dial */}
      <div 
        className="absolute inset-0 rounded-full bg-background-elevated border-4 border-accent-orange/80"
        style={{
          boxShadow: 'var(--shadow-clock), 0 0 40px hsl(var(--accent-orange) / 0.2)',
        }}
      >
        {/* Tachymeter bezel */}
        <div 
          className="absolute inset-1 rounded-full border border-foreground/10"
        >
          {/* Speed markers */}
          <svg className="absolute inset-0 w-full h-full">
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i * 6 - 90) * (Math.PI / 180);
              const isMain = i % 5 === 0;
              const innerRadius = mainRadius - (isMain ? 15 : 8);
              const outerRadius = mainRadius;
              
              return (
                <line
                  key={i}
                  x1={center + innerRadius * Math.cos(angle)}
                  y1={center + innerRadius * Math.sin(angle)}
                  x2={center + outerRadius * Math.cos(angle)}
                  y2={center + outerRadius * Math.sin(angle)}
                  stroke={isMain ? 'hsl(var(--accent-orange))' : 'hsl(var(--foreground) / 0.3)'}
                  strokeWidth={isMain ? 2 : 1}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>

        {/* Numbers */}
        {[12, 3, 6, 9].map((num, i) => {
          const angle = (i * 90 - 90) * (Math.PI / 180);
          const x = center + (mainRadius - 35) * Math.cos(angle);
          const y = center + (mainRadius - 35) * Math.sin(angle);
          
          return (
            <span
              key={num}
              className="absolute font-bold text-lg text-foreground"
              style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {num}
            </span>
          );
        })}

        {/* Sub-dial: Seconds */}
        <div 
          className="absolute rounded-full bg-background border border-foreground/10"
          style={{
            left: center - smallDialSize / 2,
            top: size * 0.22,
            width: smallDialSize,
            height: smallDialSize,
          }}
        >
          <svg className="absolute inset-0 w-full h-full">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const r = smallDialSize * 0.4;
              
              return (
                <line
                  key={i}
                  x1={smallDialSize / 2 + (r - 3) * Math.cos(angle)}
                  y1={smallDialSize / 2 + (r - 3) * Math.sin(angle)}
                  x2={smallDialSize / 2 + r * Math.cos(angle)}
                  y2={smallDialSize / 2 + r * Math.sin(angle)}
                  stroke="hsl(var(--foreground) / 0.4)"
                  strokeWidth={1}
                />
              );
            })}
          </svg>
          <motion.div
            className="absolute bg-accent-orange rounded-full"
            style={{
              left: smallDialSize / 2 - 1,
              top: smallDialSize / 2 - smallDialSize * 0.35,
              width: 2,
              height: smallDialSize * 0.35,
              transformOrigin: 'bottom center',
              transform: `rotate(${secondDegrees}deg)`,
            }}
          />
          <div 
            className="absolute bg-accent-orange rounded-full"
            style={{
              left: smallDialSize / 2 - 3,
              top: smallDialSize / 2 - 3,
              width: 6,
              height: 6,
            }}
          />
        </div>

        {/* Day display */}
        <div 
          className="absolute bg-background-card border border-foreground/10 rounded px-2 py-1"
          style={{
            left: center + 35,
            top: center - 8,
          }}
        >
          <span className="text-xs font-mono text-accent-orange">
            {format(date, 'EEE').toUpperCase()}
          </span>
        </div>

        {/* Date display */}
        <div 
          className="absolute bg-background-card border border-foreground/10 rounded px-2 py-1"
          style={{
            left: center - 55,
            top: center - 8,
          }}
        >
          <span className="text-xs font-mono text-foreground">
            {format(date, 'dd')}
          </span>
        </div>

        {/* Hour hand */}
        <motion.div
          className="absolute origin-bottom"
          style={{
            left: center - 5,
            top: center - size * 0.18,
            width: 10,
            height: size * 0.18,
            transform: `rotate(${hourDegrees}deg)`,
          }}
        >
          <div 
            className="w-full h-full"
            style={{
              background: 'linear-gradient(to top, hsl(var(--foreground)), hsl(var(--foreground) / 0.8))',
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </motion.div>

        {/* Minute hand */}
        <motion.div
          className="absolute origin-bottom"
          style={{
            left: center - 4,
            top: center - size * 0.28,
            width: 8,
            height: size * 0.28,
            transform: `rotate(${minuteDegrees}deg)`,
          }}
        >
          <div 
            className="w-full h-full"
            style={{
              background: 'linear-gradient(to top, hsl(var(--foreground)), hsl(var(--foreground) / 0.8))',
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </motion.div>

        {/* Second hand */}
        <motion.div
          className="absolute origin-bottom"
          style={{
            left: center - 1,
            top: center - size * 0.35,
            width: 2,
            height: size * 0.40,
            transform: `rotate(${secondDegrees}deg)`,
            transformOrigin: `center ${size * 0.35}px`,
          }}
        >
          <div className="w-full h-full bg-accent-orange" />
        </motion.div>

        {/* Center cap */}
        <div 
          className="absolute rounded-full bg-accent-orange"
          style={{
            left: center - 8,
            top: center - 8,
            width: 16,
            height: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        />

        {/* Brand */}
        <div className="absolute inset-x-0 bottom-1/3 text-center">
          <span className="text-[9px] tracking-[0.3em] text-foreground-muted uppercase">Chronos Sport</span>
        </div>
      </div>
    </motion.div>
  );
}
