import { afterEach, describe, expect, test, vi } from "vitest";
import { fetcher } from "@/lib/fetcher";

describe("fetcher", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("fetches the url and resolves with the parsed json body", async () => {
    const json = vi.fn().mockResolvedValue({ hello: "world" });
    const fetchMock = vi.fn().mockResolvedValue({ json });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetcher("https://example.com/data");

    expect(fetchMock).toHaveBeenCalledWith("https://example.com/data");
    expect(result).toEqual({ hello: "world" });
  });

  test("forwards all arguments to fetch", async () => {
    const json = vi.fn().mockResolvedValue([]);
    const fetchMock = vi.fn().mockResolvedValue({ json });
    vi.stubGlobal("fetch", fetchMock);

    await fetcher("https://example.com/data", { method: "POST" });

    expect(fetchMock).toHaveBeenCalledWith("https://example.com/data", {
      method: "POST",
    });
  });
});
