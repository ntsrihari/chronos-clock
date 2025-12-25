import { useTimer } from '@/hooks/useClock';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const presets = [
  { label: '1 min', ms: 60000 },
  { label: '5 min', ms: 300000 },
  { label: '10 min', ms: 600000 },
  { label: '15 min', ms: 900000 },
  { label: '30 min', ms: 1800000 },
  { label: '1 hr', ms: 3600000 },
];

export function Timer() {
  const { isRunning, remainingTime, progress, start, pause, reset, setTime, formatTime } = useTimer();
  const time = formatTime(remainingTime);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(5);

  const handleCustomSet = () => {
    const totalMs = (customHours * 3600000) + (customMinutes * 60000);
    setTime(totalMs);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 glass-strong rounded-2xl">
      {/* Circular progress */}
      <div className="relative w-64 h-64">
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            style={{
              filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.5))',
            }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="text-5xl font-mono font-light tracking-tight text-foreground"
            style={{ textShadow: isRunning ? '0 0 20px hsl(var(--primary) / 0.3)' : 'none' }}
          >
            {time.hours !== '00' && <span>{time.hours}:</span>}
            <span>{time.minutes}</span>
            <span className="text-primary">:</span>
            <span>{time.seconds}</span>
          </div>
          {remainingTime === 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary text-sm mt-2"
            >
              Set a time
            </motion.span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          className="w-12 h-12 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={isRunning ? pause : start}
          disabled={remainingTime === 0}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary-glow disabled:opacity-50"
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </Button>
      </div>

      {/* Custom time input */}
      {!isRunning && remainingTime === 0 && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="23"
              value={customHours}
              onChange={(e) => setCustomHours(parseInt(e.target.value) || 0)}
              className="w-12 h-10 text-center bg-muted rounded-lg text-foreground font-mono"
            />
            <span className="text-foreground-muted text-sm">h</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="59"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
              className="w-12 h-10 text-center bg-muted rounded-lg text-foreground font-mono"
            />
            <span className="text-foreground-muted text-sm">m</span>
          </div>
          <Button onClick={handleCustomSet} variant="secondary" size="sm">
            Set
          </Button>
        </div>
      )}

      {/* Presets */}
      {!isRunning && remainingTime === 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              onClick={() => setTime(preset.ms)}
              className="text-xs text-foreground-muted hover:text-foreground hover:bg-muted"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
