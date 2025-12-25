import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Globe, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TimezoneData {
  id: string;
  city: string;
  country: string;
  offset: number;
}

const AVAILABLE_TIMEZONES: TimezoneData[] = [
  { id: 'America/New_York', city: 'New York', country: 'USA', offset: -5 },
  { id: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA', offset: -8 },
  { id: 'America/Chicago', city: 'Chicago', country: 'USA', offset: -6 },
  { id: 'Europe/London', city: 'London', country: 'UK', offset: 0 },
  { id: 'Europe/Paris', city: 'Paris', country: 'France', offset: 1 },
  { id: 'Europe/Berlin', city: 'Berlin', country: 'Germany', offset: 1 },
  { id: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', offset: 9 },
  { id: 'Asia/Shanghai', city: 'Shanghai', country: 'China', offset: 8 },
  { id: 'Asia/Dubai', city: 'Dubai', country: 'UAE', offset: 4 },
  { id: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', offset: 8 },
  { id: 'Asia/Mumbai', city: 'Mumbai', country: 'India', offset: 5.5 },
  { id: 'Australia/Sydney', city: 'Sydney', country: 'Australia', offset: 11 },
  { id: 'Pacific/Auckland', city: 'Auckland', country: 'New Zealand', offset: 13 },
  { id: 'America/Sao_Paulo', city: 'São Paulo', country: 'Brazil', offset: -3 },
];

interface WorldClockProps {
  savedTimezones: string[];
  onAddTimezone: (tz: string) => void;
  onRemoveTimezone: (tz: string) => void;
}

export function WorldClock({ savedTimezones, onAddTimezone, onRemoveTimezone }: WorldClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeForTimezone = (offsetHours: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    return new Date(utc + offsetHours * 3600000);
  };

  const savedTzData = savedTimezones
    .map((id) => AVAILABLE_TIMEZONES.find((tz) => tz.id === id))
    .filter(Boolean) as TimezoneData[];

  const availableToAdd = AVAILABLE_TIMEZONES.filter(
    (tz) => !savedTimezones.includes(tz.id)
  );

  return (
    <div className="flex flex-col gap-4 p-6 glass-strong rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">World Clock</h3>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background-elevated border-border">
            <DialogHeader>
              <DialogTitle>Add City</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-80">
              <div className="space-y-1">
                {availableToAdd.map((tz) => (
                  <button
                    key={tz.id}
                    onClick={() => {
                      onAddTimezone(tz.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{tz.city}</p>
                      <p className="text-xs text-foreground-muted">{tz.country}</p>
                    </div>
                    <span className="text-xs text-foreground-muted">
                      UTC{tz.offset >= 0 ? '+' : ''}{tz.offset}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Local time */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary font-medium">Local Time</p>
            <p className="text-xs text-foreground-muted">Your timezone</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono text-foreground">
              {format(currentTime, 'HH:mm')}
            </p>
            <p className="text-xs text-foreground-muted">
              {format(currentTime, 'EEEE, MMM d')}
            </p>
          </div>
        </div>
      </div>

      {/* Saved timezones */}
      <div className="space-y-2">
        {savedTzData.map((tz, index) => {
          const tzTime = getTimeForTimezone(tz.offset);
          const isNextDay = tzTime.getDate() !== currentTime.getDate();
          const isPrevDay = tzTime.getDate() < currentTime.getDate();
          
          return (
            <motion.div
              key={tz.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onRemoveTimezone(tz.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-foreground-muted hover:text-destructive" />
                </button>
                <div>
                  <p className="text-sm font-medium text-foreground">{tz.city}</p>
                  <p className="text-xs text-foreground-muted">
                    {isNextDay && <span className="text-primary">Tomorrow, </span>}
                    {isPrevDay && <span className="text-accent-orange">Yesterday, </span>}
                    {format(tzTime, 'EEEE')}
                  </p>
                </div>
              </div>
              <p className="text-xl font-mono text-foreground">
                {format(tzTime, 'HH:mm')}
              </p>
            </motion.div>
          );
        })}
      </div>

      {savedTzData.length === 0 && (
        <p className="text-center text-sm text-foreground-muted py-4">
          No cities added. Tap + to add one.
        </p>
      )}
    </div>
  );
}
