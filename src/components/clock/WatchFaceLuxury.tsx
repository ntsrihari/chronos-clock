import { useClock } from '@/hooks/useClock';
import { motion } from 'framer-motion';

interface WatchFaceLuxuryProps {
  size?: number;
}

export function WatchFaceLuxury({ size = 320 }: WatchFaceLuxuryProps) {
  const { hourDegrees, minuteDegrees, secondDegrees, date } = useClock(true);

  const center = size / 2;
  const tickRadius = size * 0.42;
  const numberRadius = size * 0.35;
  
  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Outer ring with gradient */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(145deg, hsl(45 80% 45%), hsl(45 90% 55%), hsl(45 80% 40%))',
          padding: 4,
        }}
      >
        <div className="w-full h-full rounded-full bg-clock-face relative overflow-hidden clock-shadow">
          {/* Inner shadow for depth */}
          <div 
            className="absolute inset-2 rounded-full"
            style={{
              boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5), inset 0 -2px 10px rgba(255,255,255,0.05)',
            }}
          />
          
          {/* Subtle texture */}
          <div 
            className="absolute inset-0 rounded-full opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 30%, white 0%, transparent 60%)',
            }}
          />

          {/* Hour markers and Roman numerals */}
          <svg className="absolute inset-0 w-full h-full">
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i * 6 - 90) * (Math.PI / 180);
              const isHour = i % 5 === 0;
              const innerRadius = isHour ? tickRadius - 12 : tickRadius - 6;
              const outerRadius = tickRadius;
              
              return (
                <line
                  key={i}
                  x1={center + innerRadius * Math.cos(angle)}
                  y1={center + innerRadius * Math.sin(angle)}
                  x2={center + outerRadius * Math.cos(angle)}
                  y2={center + outerRadius * Math.sin(angle)}
                  stroke={isHour ? 'hsl(45, 80%, 55%)' : 'hsl(0, 0%, 30%)'}
                  strokeWidth={isHour ? 2.5 : 1}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Roman numerals */}
          {romanNumerals.map((numeral, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = center + numberRadius * Math.cos(angle);
            const y = center + numberRadius * Math.sin(angle);
            
            return (
              <span
                key={i}
                className="absolute text-gold font-medium text-xs tracking-wide"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                {numeral}
              </span>
            );
          })}

          {/* Brand name */}
          <div className="absolute inset-x-0 top-1/3 text-center">
            <span className="text-gold/80 text-[10px] tracking-[0.3em] uppercase">Chronos</span>
          </div>

          {/* Date window */}
          <div 
            className="absolute right-[22%] top-1/2 -translate-y-1/2 bg-background-elevated border border-gold/30 rounded px-1.5 py-0.5"
          >
            <span className="text-foreground font-mono text-xs">
              {date.getDate()}
            </span>
          </div>

          {/* Hour hand */}
          <motion.div
            className="absolute origin-bottom"
            style={{
              left: center - 4,
              top: center - size * 0.22,
              width: 8,
              height: size * 0.22,
              transform: `rotate(${hourDegrees}deg)`,
            }}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(to top, hsl(45 70% 50%), hsl(45 80% 60%))',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            />
          </motion.div>

          {/* Minute hand */}
          <motion.div
            className="absolute origin-bottom"
            style={{
              left: center - 3,
              top: center - size * 0.32,
              width: 6,
              height: size * 0.32,
              transform: `rotate(${minuteDegrees}deg)`,
            }}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(to top, hsl(45 70% 50%), hsl(45 80% 60%))',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            />
          </motion.div>

          {/* Second hand */}
          <motion.div
            className="absolute origin-bottom"
            style={{
              left: center - 1,
              top: center - size * 0.36,
              width: 2,
              height: size * 0.42,
              transform: `rotate(${secondDegrees}deg)`,
              transformOrigin: `center ${size * 0.36}px`,
            }}
          >
            <div className="w-full h-full flex flex-col">
              <div 
                className="flex-1 rounded-full bg-destructive"
                style={{ boxShadow: '0 0 10px hsl(0 72% 51% / 0.5)' }}
              />
              <div className="w-3 h-3 -ml-0.5 rounded-full bg-destructive" />
            </div>
          </motion.div>

          {/* Center cap */}
          <div 
            className="absolute rounded-full glow-gold"
            style={{
              left: center - 8,
              top: center - 8,
              width: 16,
              height: 16,
              background: 'linear-gradient(145deg, hsl(45 90% 60%), hsl(45 80% 45%))',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
