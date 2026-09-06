/**
 * High-resolution timer helpers for measuring session & reaction times
 */

export function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

/**
 * Format milliseconds to MM:SS.SS format (e.g. 01:23.45)
 */
export function formatDuration(ms: number): string {
  if (ms < 0 || isNaN(ms)) ms = 0;
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const hundredths = Math.floor((ms % 1000) / 10);

  const mStr = minutes.toString().padStart(2, '0');
  const sStr = seconds.toString().padStart(2, '0');
  const hStr = hundredths.toString().padStart(2, '0');

  return `${mStr}:${sStr}.${hStr}`;
}

/**
 * Format reaction time (e.g. 0.85s / câu)
 */
export function formatReactionSpeed(ms: number): string {
  if (isNaN(ms) || ms <= 0) return '0.00s';
  const seconds = (ms / 1000).toFixed(2);
  return `${seconds}s / câu`;
}
