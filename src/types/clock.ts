export type WatchFaceType = string; // Now dynamic from DB

export type FontType = string; // Now dynamic from DB

export interface WatchFaceConfig {
  id: WatchFaceType;
  name: string;
  description: string;
  preview: string;
}

export interface TimeZone {
  id: string;
  name: string;
  city: string;
  offset: string;
}

export interface UserPreferences {
  defaultFace: WatchFaceType;
  is24Hour: boolean;
  showSeconds: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  savedTimezones: string[];
  fontFamily: FontType;
}

export interface StopwatchState {
  isRunning: boolean;
  elapsedTime: number;
  laps: number[];
}

export interface TimerState {
  isRunning: boolean;
  remainingTime: number;
  totalTime: number;
}
