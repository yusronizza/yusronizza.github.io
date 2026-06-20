export type Phase = "work" | "short-break" | "long-break";

export type Settings = {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartNext: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
};

export type TimerState = {
  phase: Phase;
  isRunning: boolean;
  /** Epoch ms when the current phase ends. Only meaningful while running. */
  endAt: number | null;
  /** Authoritative remaining seconds while paused/idle. */
  remainingSeconds: number;
  /** Completed work sessions since the last long break, drives cycling. */
  completedWorkSessions: number;
};

export type Stats = {
  /** ISO date (YYYY-MM-DD) the counters below were last updated. */
  date: string;
  todayCount: number;
  totalCount: number;
};
