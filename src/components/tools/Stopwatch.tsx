import { useStopwatch } from '@/hooks/useClock';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Stopwatch() {
  const { isRunning, elapsedTime, laps, start, pause, reset, lap, formatTime } = useStopwatch();
  const time = formatTime(elapsedTime);

  return (
    <div className="flex flex-col items-center gap-6 p-6 glass-strong rounded-2xl">
      {/* Timer display */}
      <div className="relative">
        <div 
          className="text-6xl font-mono font-light tracking-tight text-foreground"
          style={{ textShadow: isRunning ? '0 0 30px hsl(var(--primary) / 0.5)' : 'none' }}
        >
          <span>{time.minutes}</span>
          <span className="text-primary mx-1">:</span>
          <span>{time.seconds}</span>
          <span className="text-3xl text-foreground-muted">.{time.centiseconds}</span>
        </div>
        
        {/* Pulsing ring when running */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-primary/30"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
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
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary-glow"
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={lap}
          disabled={!isRunning}
          className="w-12 h-12 rounded-full"
        >
          <Flag className="w-5 h-5" />
        </Button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <ScrollArea className="w-full max-h-48">
          <div className="space-y-2">
            <AnimatePresence>
              {laps.map((lapTime, index) => {
                const formattedLap = formatTime(lapTime);
                const diff = index > 0 ? lapTime - laps[index - 1] : lapTime;
                const diffFormatted = formatTime(diff);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between py-2 px-4 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm text-foreground-muted">Lap {index + 1}</span>
                    <div className="flex gap-4">
                      <span className="text-sm text-primary font-mono">
                        +{diffFormatted.minutes}:{diffFormatted.seconds}.{diffFormatted.centiseconds}
                      </span>
                      <span className="text-sm font-mono text-foreground">
                        {formattedLap.minutes}:{formattedLap.seconds}.{formattedLap.centiseconds}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
