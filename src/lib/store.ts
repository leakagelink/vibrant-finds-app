import { useSyncExternalStore } from "react";

export type Status = "pending" | "approved" | "rejected";
export type Comment = { id: string; user: string; text: string; at: string };
export type Moment = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  distanceKm: number;
  date: string;
  time: string;
  price: string;
  host: string;
  hostType: "user" | "business";
  likes: number;
  views: number;
  shares: number;
  comments: Comment[];
  status: Status;
  featured?: boolean;
  reports: number;
  endTime?: string;
  offer?: string;
  going?: number;
  verified?: boolean;
  gallery?: string[];
  terms?: string;
};
export type Host = { id: string; name: string; type: string; email: string; city: string; status: Status; joined: string };
export type AppUser = { id: string; name: string; email: string; role: "user" | "business"; status: "active" | "banned"; joined: string };
export type Notice = { id: string; title: string; body: string; at: string; read: boolean };

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const istDay = (offset = 0) => new Date(Date.now() + 5.5 * 3600e3 + offset * 864e5).toISOString().slice(0, 10);
const today = istDay(), tomorrow = istDay(1);
const g = (...ids: string[]) => ids.map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&h=400&q=70`);

const seedMoments: Moment[] = [
  { id: "m1", title: "Live Music Night", description: "Indie bands, fairy lights and good vibes all night long.", image: img("photo-1501386761578-eac5c94b800a"), category: "Music", location: "The Music Lounge, Kakinada", distanceKm: 1.2, date: today, time: "20:00", price: "₹500", host: "The Music Lounge", hostType: "business", likes: 248, views: 2400, shares: 31, comments: [{ id: "c1", user: "Rahul", text: "This is amazing! 🔥", at: "2m" }], status: "approved", featured: true, reports: 0, endTime: "23:30", offer: "Free welcome drink", going: 142, verified: true, gallery: g("photo-1514525253161-7a46d19cd819","photo-1493225457124-a3eb161ffa5f","photo-1470229722913-7c0e2dbbafd3") },
  { id: "m2", title: "Street Food Festival", description: "50+ stalls of Andhra's best street food. Bring your appetite!", image: img("photo-1555939594-58d7cb561ad1"), category: "Food", location: "Beach Road, Kakinada", distanceKm: 3.4, date: today, time: "17:00", price: "Free", host: "Foodie Collective", hostType: "business", likes: 512, views: 5300, shares: 88, comments: [], status: "approved", featured: true, reports: 0, endTime: "22:00", offer: "50+ stalls · Free entry", going: 318, verified: true, gallery: g("photo-1504674900247-0877df9cc836","photo-1565299624946-b28f40a0ae38","photo-1555396273-367ea4eb4db5") },
  { id: "m3", title: "Sunrise Yoga at the Lake", description: "Free community yoga session. Mats provided.", image: img("photo-1506126613408-eca07ce68773"), category: "Wellness", location: "Surampalem Lake", distanceKm: 0.8, date: "2026-10-17", time: "06:00", price: "Free", host: "Anita Sharma", hostType: "user", likes: 96, views: 860, shares: 12, comments: [], status: "approved", reports: 0 },
  { id: "m4", title: "College Tech Fest", description: "Hackathon, robotics and gaming arena at the campus.", image: img("photo-1540575467063-178a50c2df87"), category: "Tech", location: "Aditya Campus, Surampalem", distanceKm: 0.5, date: today, time: "10:00", price: "₹200", host: "Aditya Tech Club", hostType: "business", likes: 341, views: 3100, shares: 45, comments: [], status: "approved", reports: 0, endTime: "18:00", offer: "Free robotics demo", going: 96, verified: true, gallery: g("photo-1531482615713-2afd69097998","photo-1518770660439-4636190af475","photo-1550745165-9bc0b252726f") },
  { id: "m5", title: "DJ Night – Neon Edition", description: "Glow paint, neon lights, top DJs.", image: img("photo-1470225620780-dba8ba36b745"), category: "Nightlife", location: "Skyline Club, Rajahmundry", distanceKm: 12, date: "2026-10-24", time: "21:00", price: "₹800", host: "Skyline Events", hostType: "business", likes: 120, views: 1500, shares: 9, comments: [], status: "pending", reports: 0 },
  { id: "m6", title: "Flash sale!!! 90% off", description: "Click link to win iPhone", image: img("photo-1607083206968-13611e3d76db"), category: "Offers", location: "Unknown", distanceKm: 5, date: "2026-10-20", time: "12:00", price: "Free", host: "user_78542", hostType: "user", likes: 2, views: 40, shares: 0, comments: [], status: "approved", reports: 7 },
  { id: "m7", title: "Unlimited Pizza Night", description: "Every pizza on the menu. All night. No limits. Grab a friend and eat your way through the board — with every second order completely on us.", image: img("photo-1569937715496-0ccf6012b1a2"), category: "Food", location: "MVP Mall, Kakinada", distanceKm: 0.65, date: today, time: "19:00", endTime: "23:30", price: "Free", offer: "Buy 1 Get 1", host: "Domino's", hostType: "business", likes: 286, views: 2300, shares: 19, going: 74, verified: true, comments: [], status: "approved", reports: 0, gallery: g("photo-1566843972142-a7fcb70de55a", "photo-1672856398893-2fb52d807874", "photo-1667388969250-1c7220bf3f37", "photo-1596458397260-255807e979f1"), terms: "Offer valid for dine-in only. One redemption per table per visit. Cannot be combined with other offers." },
  { id: "m8", title: "Rooftop Cocktail Hour", description: "Golden-hour cocktails with a 360° city view and a live acoustic set.", image: img("photo-1745060829261-688870d37793"), category: "Nightlife", location: "SkyBar, The Grand Hotel, Rajahmundry", distanceKm: 0.9, date: tomorrow, time: "18:30", endTime: "22:00", price: "₹300", offer: "50% off cocktails", host: "SkyBar", hostType: "business", likes: 97, views: 1800, shares: 12, going: 38, verified: true, comments: [], status: "approved", reports: 0, gallery: g("photo-1514362545857-3bc16c4c7d1b", "photo-1551024709-8f23befc6f87", "photo-1470337458703-46ad1756a187") },
];

const seedHosts: Host[] = [
  { id: "h1", name: "The Music Lounge", type: "Bar & Lounge", email: "hello@musiclounge.in", city: "Kakinada", status: "approved", joined: "2026-09-12" },
  { id: "h2", name: "Urban Bites", type: "Restaurant", email: "urban@bites.in", city: "Rajahmundry", status: "pending", joined: "2026-10-14" },
  { id: "h3", name: "City Cinema", type: "Entertainment", email: "info@citycinema.in", city: "Kakinada", status: "pending", joined: "2026-10-15" },
  { id: "h4", name: "Good Vibes Cafe", type: "Cafe", email: "gv@cafe.in", city: "Surampalem", status: "pending", joined: "2026-10-15" },
  { id: "h5", name: "Skyline Events", type: "Event Organizer", email: "team@skyline.in", city: "Rajahmundry", status: "approved", joined: "2026-08-02" },
];

const seedUsers: AppUser[] = [
  { id: "u1", name: "Sneha Patnaik", email: "sneha@gmail.com", role: "user", status: "active", joined: "2026-10-12" },
  { id: "u2", name: "Rajesh Kumar", email: "rajesh@host.com", role: "business", status: "active", joined: "2026-10-10" },
  { id: "u3", name: "Anita Sharma", email: "anita@gmail.com", role: "user", status: "active", joined: "2026-10-09" },
  { id: "u4", name: "Vikram Sahu", email: "vikram@gmail.com", role: "user", status: "active", joined: "2026-10-06" },
  { id: "u5", name: "user_78542", email: "spam@temp.io", role: "user", status: "active", joined: "2026-10-15" },
];

type State = {
  session: { name: string; email: string; role: "user" | "business" | "admin" } | null;
  location: { label: string; lat?: number; lng?: number } | null;
  moments: Moment[];
  liked: string[];
  saved: string[];
  skipped: string[];
  savedPlaces: string[];
  hosts: Host[];
  users: AppUser[];
  categories: string[];
  locations: string[];
  notices: Notice[];
};

const initial: State = {
  session: null,
  location: null,
  moments: seedMoments,
  liked: [],
  saved: [],
  skipped: [],
  savedPlaces: [],
  hosts: seedHosts,
  users: seedUsers,
  categories: ["Music", "Food", "Wellness", "Tech", "Nightlife", "Sports", "Art", "Offers"],
  locations: ["Surampalem", "Kakinada", "Rajahmundry", "Peddapuram"],
  notices: [
    { id: "n1", title: "Live Music Night is starting soon", body: "1.2 km away · 8:00 PM tonight", at: "5m", read: false },
    { id: "n2", title: "Street Food Festival is trending 🔥", body: "512 people liked it near you", at: "1h", read: false },
  ],
};

const KEY = "jakas-state-v2";
let state: State = initial;
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function hydrateStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      state = { ...initial, ...JSON.parse(raw) };
      listeners.forEach((l) => l());
    }
  } catch {
    /* ignore */
  }
}

export function setState(fn: (s: State) => Partial<State>) {
  state = { ...state, ...fn(state) };
  emit();
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => sel(state),
    () => sel(initial),
  );
}

const uid = () => Math.random().toString(36).slice(2, 9);
const toggle = (arr: string[], id: string) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
const patchMoment = (id: string, p: Partial<Moment> | ((m: Moment) => Partial<Moment>)) =>
  setState((s) => ({ moments: s.moments.map((m) => (m.id === id ? { ...m, ...(typeof p === "function" ? p(m) : p) } : m)) }));

export const actions = {
  login: (name: string, email: string, role: "user" | "business" | "admin") => setState(() => ({ session: { name, email, role } })),
  logout: () => setState(() => ({ session: null })),
  setLocation: (location: State["location"]) => setState(() => ({ location })),
  toggleLike: (id: string) =>
    setState((s) => {
      const has = s.liked.includes(id);
      return {
        liked: toggle(s.liked, id),
        moments: s.moments.map((m) => (m.id === id ? { ...m, likes: m.likes + (has ? -1 : 1) } : m)),
      };
    }),
  interested: (id: string) => setState((s) => ({ saved: s.saved.includes(id) ? s.saved : [...s.saved, id], skipped: s.skipped.filter((x) => x !== id) })),
  skip: (id: string) => setState((s) => ({ skipped: s.skipped.includes(id) ? s.skipped : [...s.skipped, id] })),
  resetSkipped: () => setState(() => ({ skipped: [] })),
  toggleSave: (id: string) => setState((s) => ({ saved: toggle(s.saved, id) })),
  toggleSavePlace: (place: string) => setState((s) => ({ savedPlaces: toggle(s.savedPlaces, place) })),
  share: (id: string) => patchMoment(id, (m) => ({ shares: m.shares + 1 })),
  comment: (id: string, user: string, text: string) =>
    patchMoment(id, (m) => ({ comments: [...m.comments, { id: uid(), user, text, at: "now" }] })),
  report: (id: string) => patchMoment(id, (m) => ({ reports: m.reports + 1 })),
  addMoment: (m: Omit<Moment, "id" | "likes" | "views" | "shares" | "comments" | "status" | "reports">) =>
    setState((s) => ({
      moments: [{ ...m, id: uid(), likes: 0, views: 0, shares: 0, comments: [], status: "pending", reports: 0 }, ...s.moments],
    })),
  updateMoment: patchMoment,
  deleteMoment: (id: string) => setState((s) => ({ moments: s.moments.filter((m) => m.id !== id) })),
  setHostStatus: (id: string, status: Status) => setState((s) => ({ hosts: s.hosts.map((h) => (h.id === id ? { ...h, status } : h)) })),
  registerHost: (h: Omit<Host, "id" | "status" | "joined">) =>
    setState((s) => ({ hosts: [{ ...h, id: uid(), status: "pending", joined: new Date().toISOString().slice(0, 10) }, ...s.hosts] })),
  toggleBan: (id: string) =>
    setState((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "banned" : "active" } : u)) })),
  addCategory: (c: string) => setState((s) => ({ categories: s.categories.includes(c) ? s.categories : [...s.categories, c] })),
  removeCategory: (c: string) => setState((s) => ({ categories: s.categories.filter((x) => x !== c) })),
  addLocation: (c: string) => setState((s) => ({ locations: s.locations.includes(c) ? s.locations : [...s.locations, c] })),
  removeLocation: (c: string) => setState((s) => ({ locations: s.locations.filter((x) => x !== c) })),
  pushNotice: (title: string, body: string) =>
    setState((s) => ({ notices: [{ id: uid(), title, body, at: "now", read: false }, ...s.notices] })),
  readAll: () => setState((s) => ({ notices: s.notices.map((n) => ({ ...n, read: true })) })),
};
