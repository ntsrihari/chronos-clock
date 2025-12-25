import { useState, useEffect, useCallback } from "react";
import { UserPreferences, WatchFaceType, FontType } from "@/types/clock";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultFace: "luxury",
  is24Hour: false,
  showSeconds: true,
  soundEnabled: true,
  darkMode: true,
  savedTimezones: ["America/New_York", "Europe/London", "Asia/Tokyo"],
  fontFamily: "orbitron",
};

const STORAGE_KEY = "chronos-preferences";

export function usePreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load preferences:", e);
    }
    return DEFAULT_PREFERENCES;
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Apply font to body
  useEffect(() => {
    const fontClass = `font-${preferences.fontFamily}`;
    document.body.className = document.body.className
      .split(" ")
      .filter((c) => !c.startsWith("font-"))
      .concat(fontClass)
      .join(" ");
  }, [preferences.fontFamily]);

  // Fetch preferences from database when user logs in
  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "default_face, is_24_hour, show_seconds, sound_enabled, ambient_mode, saved_timezones, font_family"
        )
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Failed to fetch preferences:", error);
        return;
      }

      if (data) {
        const dbPrefs: UserPreferences = {
          defaultFace:
            (data.default_face as WatchFaceType) ||
            DEFAULT_PREFERENCES.defaultFace,
          is24Hour: data.is_24_hour ?? DEFAULT_PREFERENCES.is24Hour,
          showSeconds: data.show_seconds ?? DEFAULT_PREFERENCES.showSeconds,
          soundEnabled: data.sound_enabled ?? DEFAULT_PREFERENCES.soundEnabled,
          darkMode: data.ambient_mode ?? DEFAULT_PREFERENCES.darkMode,
          savedTimezones:
            data.saved_timezones || DEFAULT_PREFERENCES.savedTimezones,
          fontFamily:
            (data.font_family as FontType) || DEFAULT_PREFERENCES.fontFamily,
        };
        setPreferences(dbPrefs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbPrefs));
      }
    };

    fetchPreferences();
  }, [user]);

  // Sync preferences to database when they change (for logged-in users)
  const syncToDatabase = useCallback(
    async (newPrefs: UserPreferences) => {
      if (!user || isSyncing) return;

      setIsSyncing(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          default_face: newPrefs.defaultFace,
          is_24_hour: newPrefs.is24Hour,
          show_seconds: newPrefs.showSeconds,
          sound_enabled: newPrefs.soundEnabled,
          ambient_mode: newPrefs.darkMode,
          saved_timezones: newPrefs.savedTimezones,
          font_family: newPrefs.fontFamily,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to sync preferences:", error);
      }
      setIsSyncing(false);
    },
    [user, isSyncing]
  );

  // Save to localStorage and optionally to database
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.error("Failed to save preferences:", e);
    }
  }, [preferences]);

  const updatePreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPreferences((prev) => {
        const newPrefs = { ...prev, [key]: value };
        if (user) {
          syncToDatabase(newPrefs);
        }
        return newPrefs;
      });
    },
    [user, syncToDatabase]
  );

  const setDefaultFace = useCallback(
    (face: WatchFaceType) => {
      updatePreference("defaultFace", face);
    },
    [updatePreference]
  );

  const setFontFamily = useCallback(
    (font: FontType) => {
      updatePreference("fontFamily", font);
    },
    [updatePreference]
  );

  const toggle24Hour = useCallback(() => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, is24Hour: !prev.is24Hour };
      if (user) syncToDatabase(newPrefs);
      return newPrefs;
    });
  }, [user, syncToDatabase]);

  const toggleSeconds = useCallback(() => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, showSeconds: !prev.showSeconds };
      if (user) syncToDatabase(newPrefs);
      return newPrefs;
    });
  }, [user, syncToDatabase]);

  const toggleSound = useCallback(() => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, soundEnabled: !prev.soundEnabled };
      if (user) syncToDatabase(newPrefs);
      return newPrefs;
    });
  }, [user, syncToDatabase]);

  const toggleDarkMode = useCallback(() => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, darkMode: !prev.darkMode };
      if (user) syncToDatabase(newPrefs);
      return newPrefs;
    });
  }, [user, syncToDatabase]);

  const addTimezone = useCallback(
    (tzId: string) => {
      setPreferences((prev) => {
        const newTimezones = [...new Set([...prev.savedTimezones, tzId])];
        const newPrefs = { ...prev, savedTimezones: newTimezones };
        if (user) syncToDatabase(newPrefs);
        return newPrefs;
      });
    },
    [user, syncToDatabase]
  );

  const removeTimezone = useCallback(
    (tzId: string) => {
      setPreferences((prev) => {
        const newTimezones = prev.savedTimezones.filter((tz) => tz !== tzId);
        const newPrefs = { ...prev, savedTimezones: newTimezones };
        if (user) syncToDatabase(newPrefs);
        return newPrefs;
      });
    },
    [user, syncToDatabase]
  );

  return {
    preferences,
    updatePreference,
    setDefaultFace,
    setFontFamily,
    toggle24Hour,
    toggleSeconds,
    toggleSound,
    toggleDarkMode,
    addTimezone,
    removeTimezone,
  };
}
