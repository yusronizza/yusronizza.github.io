/**
 * Plays a short two-note chime using the Web Audio API — no audio file
 * needed, so the tool stays dependency-free and loads instantly.
 */

let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedContext) sharedContext = new AudioContextClass();
  return sharedContext;
}

function playTone(context: AudioContext, frequency: number, startTime: number, duration: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playChime(): void {
  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;
  playTone(context, 880, now, 0.18);
  playTone(context, 1320, now + 0.16, 0.22);
}
