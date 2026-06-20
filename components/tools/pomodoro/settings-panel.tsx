"use client";

import type { Settings } from "@/lib/pomodoro/types";

type SettingsPanelProps = {
  settings: Settings;
  notificationPermission: NotificationPermission | null;
  onUpdate: (partial: Partial<Settings>) => void;
  onRequestNotificationPermission: () => void;
  onResetAllData: () => void;
};

export function SettingsPanel({
  settings,
  notificationPermission,
  onUpdate,
  onRequestNotificationPermission,
  onResetAllData,
}: SettingsPanelProps) {
  function handleToggleNotifications(checked: boolean) {
    if (checked && notificationPermission !== "granted") {
      onRequestNotificationPermission();
      return;
    }
    onUpdate({ notificationsEnabled: checked });
  }

  function handleResetAllData() {
    if (window.confirm("Reset all Pomodoro settings and stats? This can't be undone.")) {
      onResetAllData();
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <NumberField
        label="Focus (minutes)"
        value={settings.workMinutes}
        min={1}
        max={120}
        onChange={(value) => onUpdate({ workMinutes: value })}
      />
      <NumberField
        label="Short break (minutes)"
        value={settings.shortBreakMinutes}
        min={1}
        max={60}
        onChange={(value) => onUpdate({ shortBreakMinutes: value })}
      />
      <NumberField
        label="Long break (minutes)"
        value={settings.longBreakMinutes}
        min={1}
        max={60}
        onChange={(value) => onUpdate({ longBreakMinutes: value })}
      />
      <NumberField
        label="Sessions before long break"
        value={settings.sessionsBeforeLongBreak}
        min={2}
        max={12}
        onChange={(value) => onUpdate({ sessionsBeforeLongBreak: value })}
      />

      <div className="space-y-3 sm:col-span-2">
        <ToggleRow
          label="Auto-start next session"
          checked={settings.autoStartNext}
          onChange={(checked) => onUpdate({ autoStartNext: checked })}
        />
        <ToggleRow
          label="Sound when a session ends"
          checked={settings.soundEnabled}
          onChange={(checked) => onUpdate({ soundEnabled: checked })}
        />
        <ToggleRow
          label="Browser notifications"
          checked={settings.notificationsEnabled}
          onChange={handleToggleNotifications}
        />
        {notificationPermission === "denied" && (
          <p className="text-xs text-muted">
            Notifications are blocked for this site in your browser settings.
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <button
          type="button"
          onClick={handleResetAllData}
          className="text-xs text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          Reset all data
        </button>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (Number.isFinite(parsed)) {
            onChange(Math.min(max, Math.max(min, parsed)));
          }
        }}
        className="border border-border bg-background px-3 py-2 font-mono text-foreground focus:border-accent focus:outline-none"
      />
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 border transition-colors ${
          checked ? "border-accent bg-accent" : "border-border bg-background"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4.5 w-4.5 bg-background transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
