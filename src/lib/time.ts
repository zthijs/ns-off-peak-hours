import {
  type Duration,
  differenceInMilliseconds,
  formatDuration,
  set,
} from "date-fns";
import { nl } from "date-fns/locale";

export const DAY_MS = 24 * 60 * 60 * 1000;

export function atTime(day: Date, time: { hours: number; minutes: number }) {
  return set(day, { ...time, seconds: 0, milliseconds: 0 });
}

export function percentOfDay(day: Date, moment: Date) {
  return (differenceInMilliseconds(moment, day) / DAY_MS) * 100;
}

export function formatRemaining(duration: Duration): string {
  const format = duration.hours
    ? (["hours", "minutes"] as const)
    : duration.minutes
      ? (["minutes", "seconds"] as const)
      : (["seconds"] as const);

  return formatDuration(duration, {
    locale: nl,
    format: [...format],
    delimiter: " en ",
  });
}
