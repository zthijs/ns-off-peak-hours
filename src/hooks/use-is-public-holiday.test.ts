import { renderHook } from "@testing-library/react";
import useSWR from "swr";
import { describe, expect, test, vi } from "vitest";
import type { Holiday } from "@/hooks/use-is-public-holiday";
import { useIsPublicHoliday } from "@/hooks/use-is-public-holiday";

vi.mock("swr", () => ({ default: vi.fn() }));

const mockedUseSWR = vi.mocked(useSWR);

const christmas: Holiday = {
  date: "2026-12-25",
  localName: "Eerste Kerstdag",
  name: "Christmas Day",
  countryCode: "NL",
  fixed: true,
  global: true,
  types: ["Public"],
};

describe("useIsPublicHoliday", () => {
  test("returns isHoliday true when the date matches a holiday", () => {
    mockedUseSWR.mockReturnValue({
      data: [christmas],
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() =>
      useIsPublicHoliday(new Date(2026, 11, 25)),
    );

    expect(result.current.isHoliday).toBe(true);
    expect(result.current.holidays).toEqual([christmas]);
  });

  test("returns isHoliday false when the date does not match any holiday", () => {
    mockedUseSWR.mockReturnValue({
      data: [christmas],
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() =>
      useIsPublicHoliday(new Date(2026, 5, 16)),
    );

    expect(result.current.isHoliday).toBe(false);
  });

  test("defaults holidays to an empty array while the request is loading", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      isValidating: true,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() =>
      useIsPublicHoliday(new Date(2026, 5, 16)),
    );

    expect(result.current.holidays).toEqual([]);
    expect(result.current.isHoliday).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  test("passes through fetch errors", () => {
    const error = new Error("network down");
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() =>
      useIsPublicHoliday(new Date(2026, 5, 16)),
    );

    expect(result.current.error).toBe(error);
  });

  test("requests the holidays for the year of the given date", () => {
    mockedUseSWR.mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    });

    renderHook(() => useIsPublicHoliday(new Date(2026, 5, 16)));

    expect(mockedUseSWR).toHaveBeenCalledWith(
      "https://date.nager.at/api/v3/PublicHolidays/2026/NL",
      expect.any(Function),
    );
  });

  test("allows overriding the year independently of the date", () => {
    mockedUseSWR.mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    });

    renderHook(() => useIsPublicHoliday(new Date(2026, 5, 16), 2027));

    expect(mockedUseSWR).toHaveBeenCalledWith(
      "https://date.nager.at/api/v3/PublicHolidays/2027/NL",
      expect.any(Function),
    );
  });

  test("does not request anything when the date is not known yet", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useIsPublicHoliday(null));

    expect(mockedUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
    expect(result.current.isHoliday).toBe(false);
    expect(result.current.holidays).toEqual([]);
  });
});
