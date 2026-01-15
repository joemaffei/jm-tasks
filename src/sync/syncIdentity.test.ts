import { describe, expect, it, beforeEach } from "vitest";
import { getDeviceId, resetDeviceIdForTests } from "@/sync/syncIdentity";

describe("syncIdentity", () => {
  beforeEach(() => {
    resetDeviceIdForTests();
  });

  it("returns a stable device id", () => {
    const first = getDeviceId();
    const second = getDeviceId();

    expect(first).toBeDefined();
    expect(first).toBe(second);
  });
});
