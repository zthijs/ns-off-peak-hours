import { cn } from "@/lib/utils";

export const TariffStatus = ({
  isDal,
  size = "lg",
}: {
  isDal: boolean;
  size?: "sm" | "lg";
}) => (
  <div className="relative inline-block">
    <span
      className={cn(
        size === "lg"
          ? "text-2xl font-bold sm:text-3xl lg:text-4xl"
          : "text-sm font-medium",
      )}
    >
      {isDal ? "Daltarief" : "Spitstarief"}
    </span>
    <span
      className={cn(
        "absolute top-1/2 left-full flex -translate-y-1/2",
        size === "lg" ? "ml-2 size-3 lg:size-3.5" : "ml-1.5 size-2",
      )}
    >
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          isDal ? "bg-primary" : "bg-ns-blue-mid",
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-full w-full rounded-full",
          isDal ? "bg-primary" : "bg-ns-blue-mid",
        )}
      />
    </span>
  </div>
);
