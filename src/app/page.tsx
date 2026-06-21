"use client";

import { RushCalm } from "@/assets/icons/rush-calm";
import { RushOvercrowded } from "@/assets/icons/rush-overcrowded";
import { DalTimeline } from "@/components/dal-timeline";
import { TariffStatus } from "@/components/tariff-status";
import { useDalMoments } from "@/hooks/use-dal-moments";

export default function Page() {
  const { isDal, message, isLoading, days, now } = useDalMoments();

  return (
    <>
      <main className="flex min-h-dvh items-center justify-center p-6 pb-[33dvh] lg:pb-[calc(33dvh+3rem)]">
        {!isLoading && (
          <div className="flex flex-col items-center gap-3 text-center">
            {isDal ? (
              <RushCalm className="size-16 lg:size-20" />
            ) : (
              <RushOvercrowded className="size-16 lg:size-20" />
            )}
            <TariffStatus isDal={isDal} />
            <p className="text-sm text-white/70 sm:text-base lg:text-lg">
              {message}
            </p>
          </div>
        )}
      </main>
      <DalTimeline.Root days={days} now={now}>
        <DalTimeline.Status>
          <TariffStatus isDal={isDal} size="sm" />
        </DalTimeline.Status>
        <DalTimeline.Handle />
        <DalTimeline.Legend />
        <DalTimeline.Grid />
        <DalTimeline.List />
      </DalTimeline.Root>
    </>
  );
}
