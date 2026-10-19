import { describe, expect, it } from "vitest";
import { isPublicHostMoment } from "@/lib/moment-visibility";

describe("Client host-only publication requirements", () => {
  it("does not expose ordinary-user events even if approved", () => {
    expect(isPublicHostMoment({ status: "approved", hostType: "user" })).toBe(false);
  });
  it("requires admin approval before a host event is public", () => {
    expect(isPublicHostMoment({ status: "pending", hostType: "business" })).toBe(false);
    expect(isPublicHostMoment({ status: "rejected", hostType: "business" })).toBe(false);
    expect(isPublicHostMoment({ status: "approved", hostType: "business" })).toBe(true);
  });
});