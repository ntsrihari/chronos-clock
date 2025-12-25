import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserPreferences } from "@/types/clock";
import { Clock, Volume2, Moon, Timer, Type } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";
import { Skeleton } from "@/components/ui/skeleton";

interface SettingsPageProps {
  preferences: UserPreferences;
  onToggle24Hour: () => void;
  onToggleSeconds: () => void;
  onToggleSound: () => void;
  onToggleDarkMode: () => void;
  onSetDefaultFace: (face: string) => void;
  onSetFontFamily: (font: string) => void;
}

export function SettingsPage({
  preferences,
  onToggle24Hour,
  onToggleSeconds,
  onToggleSound,
  onToggleDarkMode,
  onSetDefaultFace,
  onSetFontFamily,
}: SettingsPageProps) {
  const { settings, loading } = useAppSettings();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen px-4 pt-20 pb-28"
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold text-foreground mb-6 text-center text-glow"
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
            <Label htmlFor="darkmode" className="text-foreground-muted">
              Dark Mode
            </Label>
            <Switch
              id="darkmode"
              checked={preferences.darkMode}
              onCheckedChange={onToggleDarkMode}
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

        {/* Font Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="glass-strong rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-primary" />
            <h2 className="font-medium text-foreground">Font Style</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {settings.fonts.map((font) => (
                <button
                  key={font.key}
                  onClick={() => onSetFontFamily(font.key)}
                  style={{ fontFamily: font.family }}
                  className={`py-3 px-3 rounded-lg text-sm font-medium transition-all ${
                    preferences.fontFamily === font.key
                      ? "bg-primary text-primary-foreground text-glow-subtle"
                      : "bg-muted text-foreground-muted hover:bg-muted/80"
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          )}
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

          {loading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {settings.watchFaces.map((face) => (
                <button
                  key={face.key}
                  onClick={() => onSetDefaultFace(face.key)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    preferences.defaultFace === face.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground-muted hover:bg-muted/80"
                  }`}
                >
                  {face.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center pt-4"
        >
          <p className="text-sm text-foreground-muted text-glow-subtle">
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
