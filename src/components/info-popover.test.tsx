import { fireEvent, render, screen } from "@testing-library/react";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { InfoPopover } from "@/components/info-popover";
import type { Holiday } from "@/hooks/use-is-public-holiday";
import { useIsPublicHoliday } from "@/hooks/use-is-public-holiday";

vi.mock("@/hooks/use-is-public-holiday", () => ({
  useIsPublicHoliday: vi.fn(),
}));

const mocked = vi.mocked(useIsPublicHoliday);

const makeHoliday = (overrides: Partial<Holiday>): Holiday => ({
  date: "2026-12-25",
  localName: "Eerste Kerstdag",
  name: "Christmas Day",
  countryCode: "NL",
  fixed: true,
  global: true,
  types: ["Public"],
  ...overrides,
});

const christmas = makeHoliday({});
const newYearNext = makeHoliday({
  date: "2027-01-01",
  localName: "Nieuwjaarsdag",
  name: "New Year's Day",
});

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 5, 21));
});

afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  mocked.mockImplementation((date) => {
    const year = date?.getFullYear();
    const holidays =
      year === 2026 ? [christmas] : year === 2027 ? [newYearNext] : [];
    return { holidays, isHoliday: false, isLoading: false, error: undefined };
  });
});

const openPanel = () => {
  render(<InfoPopover />);
  fireEvent.click(screen.getByRole("button", { name: /informatie/i }));
};

describe("InfoPopover", () => {
  test("renders the trigger button", () => {
    render(<InfoPopover />);
    expect(
      screen.getByRole("button", { name: /informatie/i }),
    ).toBeInTheDocument();
  });

  test("shows the peak time windows when opened", () => {
    openPanel();
    expect(screen.getByText("Tijdvensters")).toBeInTheDocument();
    expect(screen.getByText(/06:30–09:00/)).toBeInTheDocument();
    expect(screen.getByText(/16:00–18:30/)).toBeInTheDocument();
  });

  test("explains the 5-minute grace period", () => {
    openPanel();
    expect(screen.getByText(/5 minuten speling/)).toBeInTheDocument();
  });

  test("lists upcoming holidays for the current and next year", () => {
    openPanel();
    expect(screen.getByText("Eerste Kerstdag")).toBeInTheDocument();
    expect(screen.getByText("Nieuwjaarsdag")).toBeInTheDocument();
  });
});
