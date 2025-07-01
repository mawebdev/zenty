import { deepMerge } from "../src/helpers/deep-merge.helper";

describe("deepMerge", () => {
  it("should merge flat objects", () => {
    const result = deepMerge<{ a: number; b: number }>(
        { a: 1, b: 2 },
        { b: 3 }
    );
    expect(result).toEqual({ a: 1, b: 3 });
  });

  it("should deeply merge nested objects", () => {
    const result = deepMerge<{ a: { x: number } }>(
        { a: { x: 1 } },
        { a: { x: 2, y: 3 } as unknown as { x: number; y: number } }
    );
    expect(result).toEqual({ a: { x: 2, y: 3 } });
  });

  it("should overwrite non-object values", () => {
    const result = deepMerge<{ a: unknown }>(
        { a: { x: 1 } },
        { a: 5 }
    );
    expect(result).toEqual({ a: 5 });
  });
});
