import type { Phase, Settings, Stats, TimerState } from "@/lib/pomodoro/types";

export const DEFAULT_SETTINGS: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStartNext: false,
  soundEnabled: true,
  notificationsEnabled: false,
};

export const PHASE_LABELS: Record<Phase, string> = {
  work: "Focus",
  "short-break": "Short break",
  "long-break": "Long break",
};

export const STORAGE_KEYS = {
  settings: "pomodoro:settings",
  state: "pomodoro:state",
  stats: "pomodoro:stats",
} as const;

export function getPhaseDurationSeconds(phase: Phase, settings: Settings): number {
  switch (phase) {
    case "work":
      return Math.max(1, Math.round(settings.workMinutes * 60));
    case "short-break":
      return Math.max(1, Math.round(settings.shortBreakMinutes * 60));
    case "long-break":
      return Math.max(1, Math.round(settings.longBreakMinutes * 60));
  }
}

export function createInitialState(settings: Settings): TimerState {
  return {
    phase: "work",
    isRunning: false,
    endAt: null,
    remainingSeconds: getPhaseDurationSeconds("work", settings),
    completedWorkSessions: 0,
  };
}

export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createInitialStats(): Stats {
  return { date: todayDateString(), todayCount: 0, totalCount: 0 };
}
