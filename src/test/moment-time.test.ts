import { describe, expect, it } from "vitest";
import { getTiming } from "@/lib/moment-time";

const ev = { date: "2026-10-22", time: "19:00", endTime: "23:30" };
const ist = (t: string) => new Date(`2026-10-22T${t}:00+05:30`).getTime();

describe("event timing (IST)", () => {
  it("is live between start and end", () => expect(getTiming(ev, ist("20:00")).state).toBe("live"));
  it("is starting soon within 3 hours", () => expect(getTiming(ev, ist("17:00")).state).toBe("soon"));
  it("is later when more than 3 hours away", () => expect(getTiming(ev, ist("10:00")).state).toBe("later"));
  it("is ended after the end time", () => expect(getTiming(ev, ist("23:45")).state).toBe("ended"));
});
