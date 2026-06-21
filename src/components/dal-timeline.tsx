"use client";

import { Button } from "@headlessui/react";
import { format, isToday } from "date-fns";
import { nl } from "date-fns/locale";
import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import type { DayMoments } from "@/lib/dal-schedule";
import { percentOfDay } from "@/lib/time";
import { cn } from "@/lib/utils";

const PEEK_RATIO = 1 / 3;
const EXPANDED_RATIO = 0.92;
const DRAG_CLICK_THRESHOLD_PX = 6;
const DRAG_TOGGLE_THRESHOLD_PX = 60;

interface DragState {
  startY: number;
  startHeight: number;
  startExpanded: boolean;
  moved: boolean;
  currentHeight: number;
}

interface DalTimelineContextValue {
  now: Date;
  days: DayMoments[];
  expanded: boolean;
  handlePointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  handlePointerUp: () => void;
  contentPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  contentPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  contentPointerUp: () => void;
}

const DalTimelineContext = createContext<DalTimelineContextValue | null>(null);

function useDalTimelineContext(component: string) {
  const ctx = useContext(DalTimelineContext);
  if (!ctx) {
    throw new Error(
      `DalTimeline.${component} must be rendered inside DalTimeline.Root`,
    );
  }
  return ctx;
}

const Root = ({
  days,
  now,
  children,
}: {
  days: DayMoments[];
  now: Date;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  function beginDrag(clientY: number) {
    const startHeight =
      panelRef.current?.getBoundingClientRect().height ??
      window.innerHeight * PEEK_RATIO;
    dragRef.current = {
      startY: clientY,
      startHeight,
      startExpanded: expanded,
      moved: false,
      currentHeight: startHeight,
    };
  }

  function updateDrag(clientY: number) {
    const drag = dragRef.current;
    if (!drag) return;

    const delta = drag.startY - clientY;
    if (Math.abs(delta) > DRAG_CLICK_THRESHOLD_PX) drag.moved = true;

    const min = window.innerHeight * PEEK_RATIO;
    const max = window.innerHeight * EXPANDED_RATIO;
    drag.currentHeight = Math.min(max, Math.max(min, drag.startHeight + delta));
    setDragHeight(drag.currentHeight);
  }

  function endDrag(tapToggles: boolean) {
    const drag = dragRef.current;
    if (!drag) return;

    if (!drag.moved) {
      if (tapToggles) setExpanded((value) => !value);
    } else {
      const movedDown = drag.startHeight - drag.currentHeight;
      const movedUp = drag.currentHeight - drag.startHeight;

      if (movedUp > DRAG_TOGGLE_THRESHOLD_PX) setExpanded(true);
      else if (movedDown > DRAG_TOGGLE_THRESHOLD_PX) setExpanded(false);
      else setExpanded(drag.startExpanded);
    }

    dragRef.current = null;
    setDragHeight(null);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    beginDrag(e.clientY);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    updateDrag(e.clientY);
  }

  function handlePointerUp() {
    endDrag(true);
  }

  function contentPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (expanded) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    beginDrag(e.clientY);
  }

  function contentPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    updateDrag(e.clientY);
  }

  function contentPointerUp() {
    if (!dragRef.current) return;
    endDrag(false);
  }

  return (
    <DalTimelineContext.Provider
      value={{
        now,
        days,
        expanded,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        contentPointerDown,
        contentPointerMove,
        contentPointerUp,
      }}
    >
      <div
        ref={panelRef}
        style={dragHeight !== null ? { height: dragHeight } : undefined}
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 flex flex-col overflow-hidden rounded-t-2xl border-t border-ns-gray-100 bg-white shadow-2xl",
          "lg:inset-x-6 lg:bottom-6 lg:rounded-2xl lg:border lg:h-[33dvh]",
          dragHeight === null && [
            "transition-[height] duration-300 ease-out",
            expanded ? "h-[92dvh]" : "h-[33dvh]",
          ],
        )}
      >
        {children}
      </div>
    </DalTimelineContext.Provider>
  );
};

const Handle = () => {
  const { expanded, handlePointerDown, handlePointerMove, handlePointerUp } =
    useDalTimelineContext("Handle");

  return (
    <Button
      aria-expanded={expanded}
      aria-label={expanded ? "Tijdlijn inklappen" : "Tijdlijn uitklappen"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "none" }}
      className="flex shrink-0 justify-center py-4 lg:hidden"
    >
      <span className="h-1.5 w-12 rounded-full bg-ns-gray-400" />
    </Button>
  );
};

const Status = ({ children }: { children: ReactNode }) => {
  const { expanded } = useDalTimelineContext("Status");

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-30 flex justify-center pt-6 text-sm font-medium text-white transition-opacity duration-300 ease-out lg:hidden",
        expanded ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {children}
    </div>
  );
};

const Legend = () => (
  <div className="flex shrink-0 items-center gap-4 px-4 pb-3 text-xs text-ns-gray-600 sm:text-sm lg:px-6 lg:py-4 lg:text-base">
    <span className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-full bg-primary" />
      Daluren
    </span>
    <span className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-full bg-ns-blue-mid" />
      Spitsuren
    </span>
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-0.5 bg-red-600" />
      Nu
    </span>
  </div>
);

const Day = ({
  day,
  segments,
  now,
  size = "sm",
}: {
  day: Date;
  segments: DayMoments["segments"];
  now: Date;
  size?: "sm" | "lg";
}) => {
  const today = isToday(day);

  return (
    <div className="flex flex-1 flex-col justify-center gap-2">
      <span
        className={cn(
          "capitalize",
          size === "lg"
            ? "text-sm lg:text-base xl:text-lg"
            : "text-xs sm:text-sm",
          today ? "font-semibold text-ns-blue-mid" : "text-ns-gray-600",
        )}
      >
        {today ? "Vandaag" : format(day, "EEEEEE d MMM", { locale: nl })}
      </span>

      <div
        className={cn(
          "relative flex overflow-hidden rounded-full bg-ns-gray-50",
          size === "lg" ? "h-5 lg:h-6 xl:h-7" : "h-3 sm:h-4",
        )}
      >
        {segments.map((segment) => (
          <div
            key={segment.start.toISOString()}
            title={`${segment.type === "dal" ? "Dal" : "Spits"} ${format(segment.start, "HH:mm")}–${format(segment.end, "HH:mm")}`}
            className={cn(
              "h-full",
              segment.type === "dal" ? "bg-primary" : "bg-ns-blue-mid",
            )}
            style={{
              width: `${percentOfDay(day, segment.end) - percentOfDay(day, segment.start)}%`,
            }}
          />
        ))}

        {today && (
          <div
            className={cn(
              "absolute top-0 h-full bg-red-600",
              size === "lg" ? "w-1" : "w-0.5",
            )}
            style={{ left: `${percentOfDay(day, now)}%` }}
          />
        )}
      </div>

      <div
        className={cn(
          "flex justify-between text-ns-gray-600",
          size === "lg" ? "text-xs lg:text-sm" : "text-[10px] sm:text-xs",
        )}
      >
        <span>00:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
};

const Grid = () => {
  const { days, now } = useDalTimelineContext("Grid");

  return (
    <div className="hidden flex-1 grid-cols-4 grid-rows-2 gap-x-8 gap-y-6 overflow-hidden px-6 pb-6 lg:grid">
      {days.map((day) => (
        <Day
          key={day.day.toISOString()}
          day={day.day}
          segments={day.segments}
          now={now}
          size="lg"
        />
      ))}
    </div>
  );
};

const List = () => {
  const {
    days,
    now,
    expanded,
    contentPointerDown,
    contentPointerMove,
    contentPointerUp,
  } = useDalTimelineContext("List");

  return (
    <div
      onPointerDown={contentPointerDown}
      onPointerMove={contentPointerMove}
      onPointerUp={contentPointerUp}
      style={{ touchAction: expanded ? "auto" : "none" }}
      className={cn(
        "flex-1 space-y-4 px-4 pb-6 lg:hidden",
        expanded ? "overflow-y-auto" : "overflow-hidden",
      )}
    >
      {days.map((day) => (
        <Day
          key={day.day.toISOString()}
          day={day.day}
          segments={day.segments}
          now={now}
        />
      ))}
    </div>
  );
};

export const DalTimeline = {
  Root,
  Status,
  Handle,
  Legend,
  Grid,
  List,
  Day,
};
