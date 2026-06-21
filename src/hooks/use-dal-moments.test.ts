import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useDalMoments } from "@/hooks/use-dal-moments";

const { holidaysRef } = vi.hoisted(() => ({
  holidaysRef: { current: [] as { date: string }[] },
}));

vi.mock("@/hooks/use-is-public-holiday", () => ({
  useIsPublicHoliday: () => ({
    holidays: holidaysRef.current,
    isHoliday: false,
    isLoading: false,
    error: undefined,
  }),
}));

function setNow(date: Date) {
  vi.setSystemTime(date);
}

describe("useDalMoments", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    holidaysRef.current = [];
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("is dal during the morning off-peak window on a working day", () => {
    setNow(new Date(2026, 5, 16, 6, 0, 0)); // Tuesday 06:00
    const { result } = renderHook(() => useDalMoments());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isDal).toBe(true);
    expect(result.current.message).toMatch(/^Check binnen/);
  });

  test("is spits during the morning peak window on a working day", () => {
    setNow(new Date(2026, 5, 16, 7, 0, 0)); // Tuesday 07:00, inside 06:35-08:55 spits
    const { result } = renderHook(() => useDalMoments());

    expect(result.current.isDal).toBe(false);
    expect(result.current.message).toMatch(/^Inchecken voor daltarief/);
  });

  test("is dal during the afternoon peak window once the grace period passes", () => {
    setNow(new Date(2026, 5, 16, 16, 40, 0)); // Tuesday 16:40, inside 16:05-18:25 spits
    const { result } = renderHook(() => useDalMoments());

    expect(result.current.isDal).toBe(false);
  });

  test("is dal all day on a weekend, even during normal peak hours", () => {
    setNow(new Date(2026, 5, 20, 7, 0, 0)); // Saturday 07:00
    const { result } = renderHook(() => useDalMoments());

    expect(result.current.isDal).toBe(true);
  });

  test("is dal all day on a public holiday, even during normal peak hours", () => {
    setNow(new Date(2026, 5, 16, 7, 0, 0)); // Tuesday 07:00, would normally be spits
    holidaysRef.current = [{ date: "2026-06-16" }];

    const { result } = renderHook(() => useDalMoments());

    expect(result.current.isDal).toBe(true);
  });

  test("stays spits on a working day when only a different day is a holiday", () => {
    setNow(new Date(2026, 5, 16, 7, 0, 0)); // Tuesday 07:00
    holidaysRef.current = [{ date: "2026-06-17" }]; // Wednesday, not today

    const { result } = renderHook(() => useDalMoments());

    expect(result.current.isDal).toBe(false);
  });

  test("treats a holiday that falls on a weekday the same as a weekend", () => {
    setNow(new Date(2026, 5, 17, 7, 0, 0)); // Wednesday 07:00, a working day by default
    holidaysRef.current = [{ date: "2026-06-17" }];

    const { result } = renderHook(() => useDalMoments());
    const today = result.current.days[0];

    expect(today.segments).toHaveLength(1);
    expect(today.segments[0].type).toBe("dal");
  });

  test("builds an 8-day timeline starting on today's calendar day", () => {
    setNow(new Date(2026, 5, 16, 7, 0, 0));
    const { result } = renderHook(() => useDalMoments());

    expect(result.current.days).toHaveLength(8);
    expect(result.current.days[0].day.getDate()).toBe(16);
  });
});
