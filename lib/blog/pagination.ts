export const LIMIT_OPTIONS = [5, 10, 20] as const;
export type LimitOption = (typeof LIMIT_OPTIONS)[number];
export const DEFAULT_LIMIT: LimitOption = 10;

export function isValidLimit(n: number): n is LimitOption {
  return (LIMIT_OPTIONS as readonly number[]).includes(n);
}
