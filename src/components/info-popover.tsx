"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { addYears, format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Info } from "@/assets/icons/info";
import { useIsPublicHoliday } from "@/hooks/use-is-public-holiday";
import {
  AFTERNOON_PEAK_END,
  AFTERNOON_PEAK_START,
  GRACE_MINUTES,
  MORNING_PEAK_END,
  MORNING_PEAK_START,
} from "@/lib/dal-schedule";

const fmt = ({ hours, minutes }: { hours: number; minutes: number }) =>
  `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

export const InfoPopover = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const { holidays: thisYear, isLoading: isThisYearLoading } =
    useIsPublicHoliday(now);
  const nextYear = now ? addYears(now, 1) : null;
  const { holidays: nextYearHolidays, isLoading: isNextYearLoading } =
    useIsPublicHoliday(nextYear);

  const today = now ? format(now, "yyyy-MM-dd") : "";
  const upcoming = [...thisYear, ...nextYearHolidays]
    .filter((holiday) => holiday.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const isLoading = !now || isThisYearLoading || isNextYearLoading;

  return (
    <Popover className="fixed top-4 right-4 z-40">
      <PopoverButton
        aria-label="Informatie over dal- en spitsuren"
        className="group flex size-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <Info className="size-6 transition-transform duration-300 ease-out group-hover:rotate-12 group-data-open:rotate-12" />
      </PopoverButton>

      <PopoverPanel
        transition
        anchor="bottom end"
        className="z-40 mt-2 max-h-[70dvh] w-[20rem] max-w-[calc(100vw-2rem)] origin-top-right overflow-y-auto rounded-2xl bg-white p-5 text-ns-gray-900 shadow-2xl ring-1 ring-ns-gray-100 transition duration-200 ease-out focus:outline-none data-closed:-translate-y-2 data-closed:scale-95 data-closed:opacity-0"
      >
        <section>
          <h2 className="text-base font-bold text-ns-blue">Tijdvensters</h2>
          <p className="mt-1 text-sm text-ns-gray-600">
            Op werkdagen geldt het spitstarief tijdens twee vensters.
            Daarbuiten, en de hele dag in het weekend en op feestdagen, reis je
            met daltarief.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full bg-ns-blue-mid" />
              <span>
                Ochtendspits{" "}
                <strong>
                  {fmt(MORNING_PEAK_START)}–{fmt(MORNING_PEAK_END)}
                </strong>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full bg-ns-blue-mid" />
              <span>
                Avondspits{" "}
                <strong>
                  {fmt(AFTERNOON_PEAK_START)}–{fmt(AFTERNOON_PEAK_END)}
                </strong>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full bg-primary" />
              <span>Daltarief: alle overige tijden</span>
            </li>
          </ul>
          <p className="mt-3 rounded-lg bg-ns-blue-light p-3 text-xs text-ns-blue">
            Je hebt {GRACE_MINUTES} minuten speling rond elke grens: je mag tot{" "}
            {GRACE_MINUTES} minuten vóór de spits nog met daltarief inchecken,
            en vanaf {GRACE_MINUTES} minuten vóór het einde van de spits geldt
            het daltarief alweer.
          </p>
        </section>

        <section className="mt-5 border-t border-ns-gray-100 pt-4">
          <h2 className="text-base font-bold text-ns-blue">Feestdagen</h2>
          <p className="mt-1 text-sm text-ns-gray-600">
            Op deze dagen geldt de hele dag daltarief.
          </p>
          {isLoading ? (
            <p className="mt-3 text-sm text-ns-gray-400">Laden…</p>
          ) : upcoming.length === 0 ? (
            <p className="mt-3 text-sm text-ns-gray-400">
              Geen feestdagen gevonden.
            </p>
          ) : (
            <ul className="mt-3 space-y-1.5 text-sm">
              {upcoming.map((holiday) => (
                <li
                  key={`${holiday.date}-${holiday.name}`}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span>{holiday.localName}</span>
                  <span className="shrink-0 tabular-nums text-ns-gray-600">
                    {format(parseISO(holiday.date), "EEE d MMM yyyy", {
                      locale: nl,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </PopoverPanel>
    </Popover>
  );
};
