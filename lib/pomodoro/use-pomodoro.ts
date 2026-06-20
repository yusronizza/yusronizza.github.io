"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createInitialState,
  createInitialStats,
  DEFAULT_SETTINGS,
  getPhaseDurationSeconds,
  STORAGE_KEYS,
  todayDateString,
} from "@/lib/pomodoro/constants";
import { playChime } from "@/lib/pomodoro/sound";
import { readStorage, removeStorage, writeStorage } from "@/lib/pomodoro/storage";
import type { Phase, Settings, Stats, TimerState } from "@/lib/pomodoro/types";

function nextPhaseAfter(phase: Phase, completedWorkSessions: number, settings: Settings): Phase {
  if (phase !== "work") return "work";
  const isLongBreakDue = completedWorkSessions % settings.sessionsBeforeLongBreak === 0;
  return isLongBreakDue ? "long-break" : "short-break";
}

function recomputeRemaining(state: TimerState): number {
  if (!state.isRunning || state.endAt === null) return state.remainingSeconds;
  return Math.max(0, Math.round((state.endAt - Date.now()) / 1000));
}

export function usePomodoro() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [state, setState] = useState<TimerState>(() => createInitialState(DEFAULT_SETTINGS));
  const [stats, setStats] = useState<Stats>(createInitialStats);
  // Only used to drive the per-second tick while running; while paused/idle
  // the displayed value comes straight from `state.remainingSeconds`.
  const [tickingRemaining, setTickingRemaining] = useState(state.remainingSeconds);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(
    null
  );

  // Mirrors `settings` for use inside the tick callback without
  // re-subscribing the interval on every settings change.
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Hydrate from localStorage once, on mount. Reading persisted state is
  // exactly the "synchronize with an external system" case effects are for;
  // the resulting setState calls are intentional, not a derivable value.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedSettings = readStorage<Settings>(STORAGE_KEYS.settings);
    const mergedSettings = storedSettings ? { ...DEFAULT_SETTINGS, ...storedSettings } : DEFAULT_SETTINGS;

    const storedState = readStorage<TimerState>(STORAGE_KEYS.state);
    const mergedState = storedState ?? createInitialState(mergedSettings);

    const storedStats = readStorage<Stats>(STORAGE_KEYS.stats);
    const today = todayDateString();
    const mergedStats: Stats =
      storedStats && storedStats.date === today
        ? storedStats
        : { date: today, todayCount: 0, totalCount: storedStats?.totalCount ?? 0 };

    setSettings(mergedSettings);
    setState(mergedState);
    setStats(mergedStats);
    setTickingRemaining(recomputeRemaining(mergedState));

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    setIsHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist on change (skip the pre-hydration render so we never clobber storage with defaults).
  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(STORAGE_KEYS.settings, settings);
  }, [isHydrated, settings]);

  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(STORAGE_KEYS.state, state);
  }, [isHydrated, state]);

  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(STORAGE_KEYS.stats, stats);
  }, [isHydrated, stats]);

  // `state` is read via this ref (kept fresh by the effect above the
  // hydration block) rather than through a setState updater function.
  // React's StrictMode deliberately double-invokes updater functions to
  // catch impurity, which would double-fire the side effects below
  // (stats, sound, notifications) if they lived inside one.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const completePhase = useCallback((isManualSkip: boolean) => {
    const current = stateRef.current;
    const currentSettings = settingsRef.current;

    const completedWorkSessions =
      current.phase === "work" ? current.completedWorkSessions + 1 : current.completedWorkSessions;
    const upcomingPhase = nextPhaseAfter(current.phase, completedWorkSessions, currentSettings);
    const duration = getPhaseDurationSeconds(upcomingPhase, currentSettings);
    const shouldAutoStart = currentSettings.autoStartNext;

    if (current.phase === "work" && !isManualSkip) {
      setStats((prevStats) => {
        const today = todayDateString();
        const base =
          prevStats.date === today ? prevStats : { date: today, todayCount: 0, totalCount: prevStats.totalCount };
        return { date: today, todayCount: base.todayCount + 1, totalCount: base.totalCount + 1 };
      });
    }

    if (currentSettings.soundEnabled) playChime();
    if (
      currentSettings.notificationsEnabled &&
      typeof document !== "undefined" &&
      document.visibilityState === "hidden" &&
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("Pomodoro", {
        body: upcomingPhase === "work" ? "Break's over — back to focus." : "Nice work. Time for a break.",
      });
    }

    setState({
      phase: upcomingPhase,
      isRunning: shouldAutoStart,
      endAt: shouldAutoStart ? Date.now() + duration * 1000 : null,
      remainingSeconds: duration,
      completedWorkSessions,
    });
  }, []);

  // Ticking. Recomputes from the end timestamp (not a naive decrement) so
  // background-tab throttling never causes drift. Only runs while active —
  // while paused/idle, `state.remainingSeconds` is the displayed value.
  useEffect(() => {
    if (!state.isRunning) return;

    const tick = () => {
      const remaining = recomputeRemaining(state);
      setTickingRemaining(remaining);
      if (remaining <= 0) completePhase(false);
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isRunning, state.endAt, completePhase]);

  const remainingSeconds = state.isRunning ? tickingRemaining : state.remainingSeconds;

  const start = useCallback(() => {
    setState((current) => {
      if (current.isRunning) return current;
      return {
        ...current,
        isRunning: true,
        endAt: Date.now() + current.remainingSeconds * 1000,
      };
    });
  }, []);

  const pause = useCallback(() => {
    setState((current) => {
      if (!current.isRunning) return current;
      return {
        ...current,
        isRunning: false,
        endAt: null,
        remainingSeconds: recomputeRemaining(current),
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState((current) => ({
      ...current,
      isRunning: false,
      endAt: null,
      remainingSeconds: getPhaseDurationSeconds(current.phase, settingsRef.current),
    }));
  }, []);

  const skip = useCallback(() => completePhase(true), [completePhase]);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...partial };
      setState((currentState) => {
        if (currentState.isRunning) return currentState;
        return { ...currentState, remainingSeconds: getPhaseDurationSeconds(currentState.phase, next) };
      });
      return next;
    });
  }, []);

  const resetAllData = useCallback(() => {
    removeStorage(STORAGE_KEYS.settings);
    removeStorage(STORAGE_KEYS.state);
    removeStorage(STORAGE_KEYS.stats);
    setSettings(DEFAULT_SETTINGS);
    setState(createInitialState(DEFAULT_SETTINGS));
    setStats(createInitialStats());
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission !== "granted") {
      updateSettings({ notificationsEnabled: false });
    }
  }, [updateSettings]);

  return {
    isHydrated,
    phase: state.phase,
    isRunning: state.isRunning,
    remainingSeconds,
    completedWorkSessions: state.completedWorkSessions,
    settings,
    stats,
    notificationPermission,
    start,
    pause,
    reset,
    skip,
    updateSettings,
    resetAllData,
    requestNotificationPermission,
  };
}
