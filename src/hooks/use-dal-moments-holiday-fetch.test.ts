import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useDalMoments } from "@/hooks/use-dal-moments";

describe("useDalMoments holiday fetching", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  test("never requests holidays for the epoch year before `now` is known", async () => {
    vi.setSystemTime(new Date(2026, 5, 16, 7, 0, 0));

    const fetchMock = vi
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve([]) });
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useDalMoments());

    await act(async () => {
      await Promise.resolve();
    });

    const requestedUrls = fetchMock.mock.calls.map((call) => call[0]);
    expect(
      requestedUrls.some((url) => url.includes("/PublicHolidays/1970/")),
    ).toBe(false);
    expect(
      requestedUrls.every((url) => url.includes("/PublicHolidays/2026/")),
    ).toBe(true);
    expect(fetchMock).toHaveBeenCalled();
  });
});
