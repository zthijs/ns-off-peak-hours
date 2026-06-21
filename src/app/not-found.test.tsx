import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import NotFound from "@/app/not-found";

describe("NotFound", () => {
  test("renders the not-found heading", () => {
    render(<NotFound />);
    expect(screen.getByText("Pagina niet gevonden")).toBeInTheDocument();
  });

  test("renders a link back to the homepage", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: "Terug naar de tijdlijn" });
    expect(link).toHaveAttribute("href", "/");
  });
});
