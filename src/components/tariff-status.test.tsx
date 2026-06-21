import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TariffStatus } from "@/components/tariff-status";

describe("TariffStatus", () => {
  test("shows Daltarief when isDal is true", () => {
    render(<TariffStatus isDal={true} />);
    expect(screen.getByText("Daltarief")).toBeInTheDocument();
  });

  test("shows Spitstarief when isDal is false", () => {
    render(<TariffStatus isDal={false} />);
    expect(screen.getByText("Spitstarief")).toBeInTheDocument();
  });
});
