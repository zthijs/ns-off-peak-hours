import { addDays, addMinutes, startOfDay, subMinutes } from "date-fns";
import { atTime } from "@/lib/time";

export type DalMomentType = "dal" | "spits";

export interface DalMoment {
  type: DalMomentType;
  start: Date;
  end: Date;
}

export const GRACE_MINUTES = 5;

export const MORNING_PEAK_START = { hours: 6, minutes: 30 };
export const MORNING_PEAK_END = { hours: 9, minutes: 0 };
export const AFTERNOON_PEAK_START = { hours: 16, minutes: 0 };
export const AFTERNOON_PEAK_END = { hours: 18, minutes: 30 };

/**
 * Builds the check-in windows for a single calendar day. The 5 minute grace
 * period from Rover's rules is folded into the boundaries here, so a dal
 * window's `end` is already the moment the dal check-in deadline passes.
 */
function getDayMoments(day: Date, isNonWorkingDay: boolean): DalMoment[] {
  const dayStart = startOfDay(day);
  const dayEnd = startOfDay(addDays(day, 1));

  if (isNonWorkingDay) {
    return [{ type: "dal", start: dayStart, end: dayEnd }];
  }

  const morningPeakStart = atTime(day, MORNING_PEAK_START);
  const morningPeakEnd = atTime(day, MORNING_PEAK_END);
  const afternoonPeakStart = atTime(day, AFTERNOON_PEAK_START);
  const afternoonPeakEnd = atTime(day, AFTERNOON_PEAK_END);

  return [
    {
      type: "dal",
      start: dayStart,
      end: addMinutes(morningPeakStart, GRACE_MINUTES),
    },
    {
      type: "spits",
      start: addMinutes(morningPeakStart, GRACE_MINUTES),
      end: subMinutes(morningPeakEnd, GRACE_MINUTES),
    },
    {
      type: "dal",
      start: subMinutes(morningPeakEnd, GRACE_MINUTES),
      end: addMinutes(afternoonPeakStart, GRACE_MINUTES),
    },
    {
      type: "spits",
      start: addMinutes(afternoonPeakStart, GRACE_MINUTES),
      end: subMinutes(afternoonPeakEnd, GRACE_MINUTES),
    },
    {
      type: "dal",
      start: subMinutes(afternoonPeakEnd, GRACE_MINUTES),
      end: dayEnd,
    },
  ];
}

function mergeAdjacentMoments(moments: DalMoment[]): DalMoment[] {
  const merged: DalMoment[] = [];
  for (const moment of moments) {
    const last = merged[merged.length - 1];
    if (
      last &&
      last.type === moment.type &&
      last.end.getTime() === moment.start.getTime()
    ) {
      last.end = moment.end;
    } else {
      merged.push({ ...moment });
    }
  }
  return merged;
}

/**
 * Builds an ordered, gap-free timeline of dal/spits check-in windows
 * starting on `from`'s calendar day.
 */
export function getMomentsTimeline(
  from: Date,
  days: number,
  isNonWorkingDay: (day: Date) => boolean,
): DalMoment[] {
  const moments: DalMoment[] = [];
  for (let i = 0; i < days; i++) {
    const day = addDays(startOfDay(from), i);
    moments.push(...getDayMoments(day, isNonWorkingDay(day)));
  }
  return mergeAdjacentMoments(moments);
}

export function findCurrentMoment(
  timeline: DalMoment[],
  now: Date,
): DalMoment | undefined {
  return timeline.find(
    (moment) =>
      now.getTime() >= moment.start.getTime() &&
      now.getTime() < moment.end.getTime(),
  );
}

export function findNextMoment(
  timeline: DalMoment[],
  now: Date,
): DalMoment | undefined {
  return timeline.find((moment) => moment.start.getTime() > now.getTime());
}

export interface DayMoments {
  day: Date;
  /** Timeline moments clipped to this day's [00:00, 24:00) bounds. */
  segments: DalMoment[];
}

/**
 * Splits a (possibly multi-day-spanning) timeline into per-day buckets,
 * clipping each moment to the day's bounds. Needed because adjacent
 * same-type moments (e.g. a weekend) are merged across day boundaries in
 * `getMomentsTimeline`.
 */
export function groupMomentsByDay(
  timeline: DalMoment[],
  from: Date,
  days: number,
): DayMoments[] {
  return Array.from({ length: days }, (_, i) => {
    const day = addDays(startOfDay(from), i);
    const dayEnd = addDays(day, 1);

    const segments = timeline
      .filter((moment) => moment.start < dayEnd && moment.end > day)
      .map((moment) => ({
        type: moment.type,
        start: moment.start < day ? day : moment.start,
        end: moment.end > dayEnd ? dayEnd : moment.end,
      }));

    return { day, segments };
  });
}
