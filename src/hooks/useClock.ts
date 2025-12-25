import { useState, useEffect, useCallback, useRef } from 'react';

interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  date: Date;
}

export function useClock(smoothSeconds = true) {
  const [time, setTime] = useState<ClockTime>(() => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      milliseconds: now.getMilliseconds(),
      date: now,
    };
  });

  const frameRef = useRef<number>();

  const updateTime = useCallback(() => {
    const now = new Date();
    setTime({
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      milliseconds: now.getMilliseconds(),
      date: now,
    });

    if (smoothSeconds) {
      frameRef.current = requestAnimationFrame(updateTime);
    }
  }, [smoothSeconds]);

  useEffect(() => {
    if (smoothSeconds) {
      frameRef.current = requestAnimationFrame(updateTime);
      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    } else {
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [smoothSeconds, updateTime]);

  // Calculate rotation degrees
  const getSecondDegrees = () => {
    if (smoothSeconds) {
      return ((time.seconds + time.milliseconds / 1000) / 60) * 360;
    }
    return (time.seconds / 60) * 360;
  };

  const getMinuteDegrees = () => {
    return ((time.minutes + time.seconds / 60) / 60) * 360;
  };

  const getHourDegrees = () => {
    return (((time.hours % 12) + time.minutes / 60) / 12) * 360;
  };

  return {
    ...time,
    secondDegrees: getSecondDegrees(),
    minuteDegrees: getMinuteDegrees(),
    hourDegrees: getHourDegrees(),
  };
}

export function useStopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };
  const lap = () => {
    if (isRunning) {
      setLaps((prev) => [...prev, elapsedTime]);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      centiseconds: centiseconds.toString().padStart(2, '0'),
    };
  };

  return {
    isRunning,
    elapsedTime,
    laps,
    start,
    pause,
    reset,
    lap,
    formatTime,
  };
}

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<number>();
  const endTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      endTimeRef.current = Date.now() + remainingTime;
      intervalRef.current = window.setInterval(() => {
        const remaining = endTimeRef.current - Date.now();
        if (remaining <= 0) {
          setRemainingTime(0);
          setIsRunning(false);
          // Trigger completion sound/notification
        } else {
          setRemainingTime(remaining);
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => {
    if (remainingTime > 0) {
      setIsRunning(true);
    }
  };
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setRemainingTime(totalTime);
  };
  const setTime = (ms: number) => {
    setTotalTime(ms);
    setRemainingTime(ms);
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  const progress = totalTime > 0 ? (remainingTime / totalTime) * 100 : 0;

  return {
    isRunning,
    remainingTime,
    totalTime,
    progress,
    start,
    pause,
    reset,
    setTime,
    formatTime,
  };
}
