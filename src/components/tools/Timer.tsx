import { useTimer } from "@/hooks/useClock";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const presets = [
  { label: "1 min", ms: 60000 },
  { label: "5 min", ms: 300000 },
  { label: "10 min", ms: 600000 },
  { label: "15 min", ms: 900000 },
  { label: "30 min", ms: 1800000 },
  { label: "1 hr", ms: 3600000 },
];

function TimeInput({
  value,
  onChange,
  max,
  label,
}: {
  value: number;
  onChange: (val: number) => void;
  max: number;
  label: string;
}) {
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const decrement = () => {
    if (value > 0) onChange(value - 1);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={increment}
        className="w-8 h-8 rounded-full hover:bg-primary/10 hover:text-primary"
      >
        <Plus className="w-4 h-4" />
      </Button>

      <div className="relative">
        <input
          type="number"
          min="0"
          max={max}
          value={value.toString().padStart(2, "0")}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            if (val >= 0 && val <= max) onChange(val);
          }}
          className="w-14 h-14 text-center bg-background-elevated border border-border rounded-xl text-foreground font-mono text-2xl font-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={decrement}
        className="w-8 h-8 rounded-full hover:bg-primary/10 hover:text-primary"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <span className="text-xs text-foreground-muted mt-1">{label}</span>
    </div>
  );
}

export function Timer() {
  const {
    isRunning,
    remainingTime,
    progress,
    start,
    pause,
    reset,
    setTime,
    formatTime,
  } = useTimer();
  const time = formatTime(remainingTime);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(5);

  const handleCustomSet = () => {
    const totalMs = customHours * 3600000 + customMinutes * 60000;
    if (totalMs > 0) {
      setTime(totalMs);
    }
  };

  const handleReset = () => {
    reset();
    setCustomHours(0);
    setCustomMinutes(5);
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
              filter: "drop-shadow(0 0 10px hsl(var(--primary) / 0.5))",
            }}
          />
          <defs>
            <linearGradient
              id="timerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-5xl font-mono font-light tracking-tight text-foreground"
            style={{
              textShadow: isRunning
                ? "0 0 20px hsl(var(--primary) / 0.3)"
                : "none",
            }}
          >
            {time.hours !== "00" && <span>{time.hours}:</span>}
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

      {/* Controls - ALWAYS VISIBLE */}
      <div className="flex gap-4 items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="w-16 h-16 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          onClick={isRunning ? pause : start}
          disabled={remainingTime === 0}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 items-center"
        >
          <div className="flex items-center gap-6">
            <TimeInput
              value={customHours}
              onChange={setCustomHours}
              max={23}
              label="hours"
            />

            <div className="text-2xl text-foreground-muted font-light">:</div>

            <TimeInput
              value={customMinutes}
              onChange={setCustomMinutes}
              max={59}
              label="minutes"
            />
          </div>

          <Button
            onClick={handleCustomSet}
            variant="secondary"
            className="w-full max-w-[200px] rounded-full"
            disabled={customHours === 0 && customMinutes === 0}
          >
            Set Timer
          </Button>
        </motion.div>
      )}

      {/* Presets */}
      {!isRunning && remainingTime === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center max-w-xs"
        >
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              onClick={() => setTime(preset.ms)}
              className="text-xs text-foreground-muted hover:text-foreground hover:bg-muted rounded-full px-4"
            >
              {preset.label}
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
