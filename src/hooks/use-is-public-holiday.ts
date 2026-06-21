"use client";

import { format, getYear } from "date-fns";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  types: string[];
}

export function useIsPublicHoliday(
  date: Date | null,
  year = date && getYear(date),
) {
  const { data, error, isLoading } = useSWR<Holiday[]>(
    date ? `https://date.nager.at/api/v3/PublicHolidays/${year}/NL` : null,
    fetcher,
  );

  const dateString = date && format(date, "yyyy-MM-dd");
  const isHoliday =
    (dateString && data?.some((h) => h.date === dateString)) ?? false;

  return { isHoliday, holidays: data ?? [], isLoading, error };
}
