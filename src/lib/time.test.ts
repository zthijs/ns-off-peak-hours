import { describe, expect, test } from "vitest";
import { atTime, formatRemaining, percentOfDay } from "@/lib/time";

describe("atTime", () => {
  test("sets the given hours and minutes on the day", () => {
    const day = new Date(2026, 5, 16, 0, 0, 0);
    const result = atTime(day, { hours: 9, minutes: 30 });

    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(30);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });
});

describe("percentOfDay", () => {
  test("returns 0 at the start of the day", () => {
    const day = new Date(2026, 5, 16, 0, 0, 0);
    expect(percentOfDay(day, day)).toBe(0);
  });

  test("returns 50 at noon", () => {
    const day = new Date(2026, 5, 16, 0, 0, 0);
    const noon = new Date(2026, 5, 16, 12, 0, 0);
    expect(percentOfDay(day, noon)).toBe(50);
  });

  test("returns 100 at the end of the day", () => {
    const day = new Date(2026, 5, 16, 0, 0, 0);
    const dayEnd = new Date(2026, 5, 17, 0, 0, 0);
    expect(percentOfDay(day, dayEnd)).toBe(100);
  });
});

describe("formatRemaining", () => {
  test("formats hours and minutes", () => {
    expect(formatRemaining({ hours: 1, minutes: 32 })).toBe(
      "1 uur en 32 minuten",
    );
  });

  test("formats minutes and seconds when there are no hours", () => {
    expect(formatRemaining({ minutes: 5, seconds: 10 })).toBe(
      "5 minuten en 10 seconden",
    );
  });

  test("formats only seconds when under a minute remains", () => {
    expect(formatRemaining({ seconds: 45 })).toBe("45 seconden");
  });
});
