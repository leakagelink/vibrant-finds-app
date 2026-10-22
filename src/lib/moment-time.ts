export type Timing = { state: "live" | "soon" | "later" | "ended"; seconds: number };

const at = (date: string, time: string) => new Date(`${date}T${time}:00+05:30`).getTime();

/** Event timing in IST. "soon" = starts within 3 hours; live counts down to the end time. */
export function getTiming(m: { date: string; time: string; endTime?: string }, now = Date.now()): Timing {
  const start = at(m.date, m.time);
  let end = m.endTime ? at(m.date, m.endTime) : start + 3 * 3600e3;
  if (end <= start) end += 24 * 3600e3;
  if (now >= end) return { state: "ended", seconds: 0 };
  if (now >= start) return { state: "live", seconds: Math.floor((end - now) / 1000) };
  const seconds = Math.floor((start - now) / 1000);
  return { state: seconds <= 3 * 3600 ? "soon" : "later", seconds };
}

export function formatCountdown(total: number) {
  const d = Math.floor(total / 86400), h = Math.floor((total % 86400) / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return d > 0 ? `${d}d ${h}h` : `${p(h)}:${p(m)}:${p(s)}`;
}

export const formatTime = (t: string) => {
  const [h = 0, m = 0] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};
