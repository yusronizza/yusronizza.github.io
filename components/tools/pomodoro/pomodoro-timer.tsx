"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/tools/pomodoro/progress-ring";
import { SessionDots } from "@/components/tools/pomodoro/session-dots";
import { SettingsPanel } from "@/components/tools/pomodoro/settings-panel";
import { getPhaseDurationSeconds, PHASE_LABELS } from "@/lib/pomodoro/constants";
import { usePomodoro } from "@/lib/pomodoro/use-pomodoro";
import { formatTimer } from "@/lib/utils/format";

const DEFAULT_DOCUMENT_TITLE = "Pomodoro Timer | Yusron Izza Faradisa";

export function PomodoroTimer() {
  const {
    isHydrated,
    phase,
    isRunning,
    remainingSeconds,
    completedWorkSessions,
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
  } = usePomodoro();

  useEffect(() => {
    if (!isHydrated) return;
    document.title = isRunning
      ? `${formatTimer(remainingSeconds)} · ${PHASE_LABELS[phase]}`
      : DEFAULT_DOCUMENT_TITLE;
    return () => {
      document.title = DEFAULT_DOCUMENT_TITLE;
    };
  }, [isHydrated, isRunning, phase, remainingSeconds]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.code !== "Space") return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "BUTTON"].includes(target.tagName)) return;
      event.preventDefault();
      if (isRunning) {
        pause();
      } else {
        start();
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isRunning, pause, start]);

  const totalDuration = getPhaseDurationSeconds(phase, settings);
  const progress = isHydrated ? 1 - remainingSeconds / totalDuration : 0;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <p className="font-mono text-sm uppercase tracking-widest text-accent">
        {PHASE_LABELS[phase]}
      </p>

      <ProgressRing progress={progress}>
        <span className="font-mono text-5xl font-semibold tabular-nums">
          {isHydrated ? formatTimer(remainingSeconds) : "--:--"}
        </span>
      </ProgressRing>

      <SessionDots total={settings.sessionsBeforeLongBreak} completed={completedWorkSessions} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={isRunning ? pause : start} className="min-w-[7rem]">
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
        <Button variant="secondary" onClick={skip}>
          Skip
        </Button>
      </div>

      <p className="text-sm text-muted">
        {stats.todayCount} session{stats.todayCount === 1 ? "" : "s"} today &middot;{" "}
        {stats.totalCount} total
      </p>

      <details className="w-full max-w-md">
        <summary className="cursor-pointer text-center font-mono text-sm text-muted hover:text-accent">
          [settings]
        </summary>
        <div className="mt-6 border border-border bg-surface p-6">
          <SettingsPanel
            settings={settings}
            notificationPermission={notificationPermission}
            onUpdate={updateSettings}
            onRequestNotificationPermission={requestNotificationPermission}
            onResetAllData={resetAllData}
          />
        </div>
      </details>
    </div>
  );
}
