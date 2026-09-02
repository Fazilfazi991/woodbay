import { describe, expect, it, vi } from "vitest";
import { isSearchFieldImplicitSubmit } from "./redeem-form";

describe("isSearchFieldImplicitSubmit", () => {
  it("blocks an implicit form submit while a searchable datalist field is active", () => {
    const activeElement = { matches: vi.fn().mockReturnValue(true) } as unknown as Element;

    expect(isSearchFieldImplicitSubmit(null, activeElement)).toBe(true);
    expect(activeElement.matches).toHaveBeenCalledWith("input[list]");
  });

  it("allows explicit button submissions and Enter from ordinary fields", () => {
    const searchField = { matches: vi.fn().mockReturnValue(true) } as unknown as Element;
    const ordinaryField = { matches: vi.fn().mockReturnValue(false) } as unknown as Element;
    const submitter = {} as HTMLElement;

    expect(isSearchFieldImplicitSubmit(submitter, searchField)).toBe(false);
    expect(isSearchFieldImplicitSubmit(null, ordinaryField)).toBe(false);
  });
});
