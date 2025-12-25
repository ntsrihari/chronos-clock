import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserPreferences, WatchFaceType } from '@/types/clock';
import { Clock, Volume2, Moon, Timer } from 'lucide-react';

interface SettingsPageProps {
  preferences: UserPreferences;
  onToggle24Hour: () => void;
  onToggleSeconds: () => void;
  onToggleSound: () => void;
  onToggleAmbient: () => void;
  onSetDefaultFace: (face: WatchFaceType) => void;
}

const faceOptions: { id: WatchFaceType; name: string }[] = [
  { id: 'luxury', name: 'Luxury' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'digital', name: 'Digital' },
  { id: 'sporty', name: 'Sport' },
  { id: 'neon', name: 'Neon' },
];

export function SettingsPage({
  preferences,
  onToggle24Hour,
  onToggleSeconds,
  onToggleSound,
  onToggleAmbient,
  onSetDefaultFace,
}: SettingsPageProps) {
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
        Settings
      </motion.h1>

      <div className="w-full max-w-sm mx-auto space-y-6">
        {/* Time Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-medium text-foreground">Time Display</h2>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="24hour" className="text-foreground-muted">
              24-Hour Format
            </Label>
            <Switch
              id="24hour"
              checked={preferences.is24Hour}
              onCheckedChange={onToggle24Hour}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="seconds" className="text-foreground-muted">
              Show Seconds
            </Label>
            <Switch
              id="seconds"
              checked={preferences.showSeconds}
              onCheckedChange={onToggleSeconds}
            />
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-strong rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-primary" />
            <h2 className="font-medium text-foreground">Appearance</h2>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ambient" className="text-foreground-muted">
              Ambient Mode
            </Label>
            <Switch
              id="ambient"
              checked={preferences.ambientMode}
              onCheckedChange={onToggleAmbient}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="text-foreground-muted">
              Sound Effects
            </Label>
            <Switch
              id="sound"
              checked={preferences.soundEnabled}
              onCheckedChange={onToggleSound}
            />
          </div>
        </motion.div>

        {/* Default Face */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-primary" />
            <h2 className="font-medium text-foreground">Default Watch Face</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {faceOptions.map((face) => (
              <button
                key={face.id}
                onClick={() => onSetDefaultFace(face.id)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  preferences.defaultFace === face.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground-muted hover:bg-muted/80'
                }`}
              >
                {face.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center pt-4"
        >
          <p className="text-sm text-foreground-muted">
            Chronos v1.0.0
          </p>
          <p className="text-xs text-foreground-muted mt-1">
            A beautiful clock experience
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
