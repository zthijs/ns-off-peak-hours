"use client";

import { addDays, format, intervalToDuration, isWeekend } from "date-fns";
import { useEffect, useState } from "react";
import { useIsPublicHoliday } from "@/hooks/use-is-public-holiday";
import {
  type DalMoment,
  type DayMoments,
  findCurrentMoment,
  findNextMoment,
  getMomentsTimeline,
  groupMomentsByDay,
} from "@/lib/dal-schedule";
import { formatRemaining } from "@/lib/time";

const TIMELINE_DAYS = 8;
const TICK_INTERVAL_MS = 1000;

export interface UseDalMomentsResult {
  now: Date;
  timeline: DalMoment[];
  days: DayMoments[];
  current: DalMoment | undefined;
  next: DalMoment | undefined;
  isDal: boolean;
  message: string;
  isLoading: boolean;
}

function buildMessage(current: DalMoment | undefined, now: Date): string {
  if (!current) return "";

  const remaining = formatRemaining(
    intervalToDuration({ start: now, end: current.end }),
  );

  if (current.type === "dal") {
    return `Check binnen ${remaining} in om met daltarief te reizen.`;
  }

  return `Inchecken voor daltarief kan over ${remaining}.`;
}

export function useDalMoments(): UseDalMomentsResult {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const lastDay = now ? addDays(now, TIMELINE_DAYS - 1) : null;
  const { holidays: holidaysStartYear, isLoading: isStartYearLoading } =
    useIsPublicHoliday(now);
  const { holidays: holidaysEndYear, isLoading: isEndYearLoading } =
    useIsPublicHoliday(lastDay);

  if (!now) {
    return {
      now: new Date(0),
      timeline: [],
      days: [],
      current: undefined,
      next: undefined,
      isDal: false,
      message: "",
      isLoading: true,
    };
  }

  const holidayDates = new Set(
    [...holidaysStartYear, ...holidaysEndYear].map((holiday) => holiday.date),
  );

  const timeline = getMomentsTimeline(
    now,
    TIMELINE_DAYS,
    (day) => isWeekend(day) || holidayDates.has(format(day, "yyyy-MM-dd")),
  );

  const current = findCurrentMoment(timeline, now);
  const next = findNextMoment(timeline, now);
  const days = groupMomentsByDay(timeline, now, TIMELINE_DAYS);

  return {
    now,
    timeline,
    days,
    current,
    next,
    isDal: current?.type === "dal",
    message: buildMessage(current, now),
    isLoading: isStartYearLoading || isEndYearLoading,
  };
}
