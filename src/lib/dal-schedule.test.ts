import { describe, expect, test } from "vitest";
import {
  findCurrentMoment,
  findNextMoment,
  getMomentsTimeline,
  groupMomentsByDay,
} from "@/lib/dal-schedule";

const MONDAY = new Date(2026, 5, 15); // Mon 15 Jun 2026
const noWorkingDayException = () => false;

describe("getMomentsTimeline", () => {
  test("splits a working day into dal/spits/dal/spits/dal", () => {
    const timeline = getMomentsTimeline(MONDAY, 1, noWorkingDayException);

    expect(timeline.map((m) => m.type)).toEqual([
      "dal",
      "spits",
      "dal",
      "spits",
      "dal",
    ]);
  });

  test("applies the 5 minute grace period to peak boundaries", () => {
    const timeline = getMomentsTimeline(MONDAY, 1, noWorkingDayException);
    const morningSpits = timeline[1];

    expect(morningSpits.start.getHours()).toBe(6);
    expect(morningSpits.start.getMinutes()).toBe(35);
    expect(morningSpits.end.getHours()).toBe(8);
    expect(morningSpits.end.getMinutes()).toBe(55);
  });

  test("treats a non-working day as dal for the entire day", () => {
    const timeline = getMomentsTimeline(MONDAY, 1, () => true);

    expect(timeline).toHaveLength(1);
    expect(timeline[0]).toMatchObject({ type: "dal" });
  });

  test("merges adjacent same-type moments across day boundaries", () => {
    // Monday is a working day, Tuesday is forced non-working (all dal),
    // so the trailing dal moment of Monday should merge with all of Tuesday.
    const timeline = getMomentsTimeline(
      MONDAY,
      2,
      (day) => day.getDate() === 16,
    );

    const mondayEveningDal = timeline.find(
      (m) => m.start.getHours() === 18 && m.start.getDate() === 15,
    );
    expect(mondayEveningDal).toBeDefined();
    expect(mondayEveningDal?.end.getDate()).toBe(17);
  });
});

describe("findCurrentMoment", () => {
  test("finds the moment containing `now`", () => {
    const timeline = getMomentsTimeline(MONDAY, 1, noWorkingDayException);
    const now = new Date(2026, 5, 15, 7, 0, 0);

    const current = findCurrentMoment(timeline, now);
    expect(current?.type).toBe("spits");
  });

  test("returns undefined when `now` is outside the timeline", () => {
    const timeline = getMomentsTimeline(MONDAY, 1, noWorkingDayException);
    const farFuture = new Date(2030, 0, 1);

    expect(findCurrentMoment(timeline, farFuture)).toBeUndefined();
  });
});

describe("findNextMoment", () => {
  test("finds the next moment starting after `now`", () => {
    const timeline = getMomentsTimeline(MONDAY, 1, noWorkingDayException);
    const now = new Date(2026, 5, 15, 7, 0, 0);

    const next = findNextMoment(timeline, now);
    expect(next?.start.getHours()).toBe(8);
    expect(next?.start.getMinutes()).toBe(55);
    expect(next?.type).toBe("dal");
  });
});

describe("groupMomentsByDay", () => {
  test("clips multi-day moments to each day's [00:00, 24:00) bounds", () => {
    const timeline = getMomentsTimeline(
      MONDAY,
      2,
      (day) => day.getDate() === 16,
    );
    const days = groupMomentsByDay(timeline, MONDAY, 2);

    expect(days).toHaveLength(2);
    for (const { day, segments } of days) {
      for (const segment of segments) {
        expect(segment.start.getTime()).toBeGreaterThanOrEqual(day.getTime());
        expect(segment.end.getTime()).toBeLessThanOrEqual(
          day.getTime() + 24 * 60 * 60 * 1000,
        );
      }
    }
  });
});
