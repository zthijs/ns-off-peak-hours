import { describe, expect, test } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  test("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  test("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  test("merges conflicting tailwind classes, keeping the last one", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  test("supports conditional object syntax", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });
});
