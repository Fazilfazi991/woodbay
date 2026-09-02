import { describe, expect, it } from "vitest";
import { formatCartBadgeCount } from "./badge";

describe("formatCartBadgeCount", () => {
  it.each([
    [0, null],
    [1, "1"],
    [4, "4"],
    [9, "9"],
    [10, "10"],
    [25, "25"],
    [100, "99+"],
  ])("formats %i items as %s", (count, expected) => {
    expect(formatCartBadgeCount(count)).toBe(expected);
  });
});
