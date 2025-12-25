export type WatchFaceType = 'luxury' | 'minimal' | 'digital' | 'sporty' | 'neon';

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
  ambientMode: boolean;
  savedTimezones: string[];
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
