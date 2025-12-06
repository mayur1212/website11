"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type SeatType = {
  label: string;
  price: number;
  status: "AVAILABLE" | "FILLING" | "ALMOST_FULL";
};

type ShowTimeFormat = "2D" | "IMAX 2D";

type ShowTime = {
  time: string;
  tag?: string;
  sessionId: string; // seat-layout page
  seats?: SeatType[]; // hover popup
  format?: ShowTimeFormat;
};

type Amenity = {
  id: string;
  label: string;
  icon: string;
};

type Theatre = {
  id: number;
  slug?: string;
  name: string;
  distance: string;
  meta: string;
  logoText: string;
  address?: string;
  amenities?: Amenity[];
  times: ShowTime[];
};

type ShowTimeBucket =
  | "EARLY_MORNING"
  | "MORNING"
  | "AFTERNOON"
  | "EVENING"
  | "NIGHT";

type DetailsTab = "REVIEWS" | "SYNOPSIS" | "CAST" | "VIDEOS" | "POSTERS";

const DATES = [
  { id: 1, dayNum: "28", dayLabel: "Fri", month: "NOV", isToday: true },
  { id: 2, dayNum: "29", dayLabel: "Sat" },
  { id: 3, dayNum: "30", dayLabel: "Sun" },
  { id: 4, dayNum: "1", dayLabel: "Mon", month: "DEC" },
  { id: 5, dayNum: "2", dayLabel: "Tue" },
  { id: 6, dayNum: "3", dayLabel: "Wed" },
  { id: 7, dayNum: "4", dayLabel: "Thu" },
];

// ---- FILTER OPTION CONFIGS ---- //

const FORMAT_FILTERS: { id: ShowTimeFormat; label: string }[] = [
  { id: "2D", label: "2D" },
  { id: "IMAX 2D", label: "IMAX 2D" },
];

const SHOW_TIME_FILTERS: {
  id: ShowTimeBucket;
  label: string;
  sub: string;
}[] = [
  { id: "EARLY_MORNING", label: "Early Morning", sub: "12 AM to 8 AM" },
  { id: "MORNING", label: "Morning", sub: "8 AM to 12 PM" },
  { id: "AFTERNOON", label: "Afternoon", sub: "12 PM to 4 PM" },
  { id: "EVENING", label: "Evening", sub: "4 PM to 7 PM" },
  { id: "NIGHT", label: "Night", sub: "7 PM to 12 AM" },
];

const PRICE_FILTERS = [
  { id: "100-200", label: "₹ 100 - ₹ 200", min: 100, max: 200 },
  { id: "200-300", label: "₹ 200 - ₹ 300", min: 200, max: 300 },
  { id: "300-400", label: "₹ 300 - ₹ 400", min: 300, max: 400 },
  { id: "400-500", label: "₹ 400 - ₹ 500", min: 400, max: 500 },
  { id: "500-600", label: "₹ 500 - ₹ 600", min: 500, max: 600 },
  { id: "600-700", label: "₹ 600 - ₹ 700", min: 600, max: 700 },
  { id: "700-800", label: "₹ 700 - ₹ 800", min: 700, max: 800 },
  { id: "800-900", label: "₹ 800 - ₹ 900", min: 800, max: 900 },
  { id: "900-1000", label: "₹ 900 - ₹ 1000", min: 900, max: 1000 },
  { id: "1000-1500", label: "₹ 1000 - ₹ 1500", min: 1000, max: 1500 },
  { id: "1500-2000", label: "₹ 1500 - ₹ 2000", min: 1500, max: 2000 },
  { id: "2000+", label: "₹ 2000 or above", min: 2000, max: null },
];

const OTHERS_FILTERS = [
  { id: "RECLINERS", label: "Recliners" },
  { id: "WHEELCHAIR", label: "Wheelchair Friendly" },
  { id: "PREMIUM", label: "Premium Seats" },
  { id: "COUPLE", label: "Couple Seats" },
];

// ---- SAMPLE THEATRE DATA (with `format`) ---- //
const THEATRES: Theatre[] = [
  {
    id: 1,
    slug: "cinepolis-grand-view-high-street-gurugram",
    name: "Cinepolis Grand View High Street, Gurugram",
    distance: "1.6 km away",
    meta: "Non-cancellable",
    logoText: "cinepolis",
    address:
      "Grand View High Street, Sector 82A, Gurugram, Haryana 122004, India",
    amenities: [
      { id: "cancel", label: "Allows cancellation", icon: "↩️" },
      { id: "parking", label: "Parking", icon: "🅿️" },
      { id: "mobile", label: "Mobile Ticket", icon: "📱" },
      { id: "food", label: "Food & Beverages", icon: "🍿" },
      { id: "recliners", label: "Recliners", icon: "🛋️" },
      { id: "digital", label: "Digital Payments", icon: "💳" },
      { id: "wheelchair", label: "Wheelchair Friendly", icon: "♿" },
      { id: "ac", label: "Air Conditioning", icon: "❄️" },
    ],
    times: [
      {
        time: "05:15 PM",
        sessionId: "cinepolis-1715",
        format: "2D",
        seats: [
          { label: "Executive", price: 200, status: "AVAILABLE" },
          { label: "Club", price: 220, status: "AVAILABLE" },
          { label: "Royal", price: 240, status: "AVAILABLE" },
          { label: "Royal Recliner", price: 490, status: "AVAILABLE" },
        ],
      },
      {
        time: "07:25 PM",
        sessionId: "cinepolis-1925",
        format: "2D",
        seats: [
          { label: "Executive", price: 210, status: "AVAILABLE" },
          { label: "Club", price: 230, status: "FILLING" },
          { label: "Royal", price: 260, status: "AVAILABLE" },
        ],
      },
      {
        time: "08:45 PM",
        sessionId: "cinepolis-2045",
        format: "2D",
        seats: [
          { label: "Executive", price: 190, status: "FILLING" },
          { label: "Royal", price: 240, status: "ALMOST_FULL" },
        ],
      },
      {
        time: "11:00 PM",
        sessionId: "cinepolis-2300",
        format: "2D",
        seats: [
          { label: "Executive", price: 180, status: "AVAILABLE" },
          { label: "Club", price: 210, status: "AVAILABLE" },
          { label: "Royal", price: 230, status: "AVAILABLE" },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "inox-world-mark-sector-65-gurugram",
    name: "INOX World Mark, Sector 65, Gurugram",
    distance: "4.4 km away",
    meta: "Allows cancellation",
    logoText: "INOX",
    address: "World Mark, Sector 65, Gurugram, Haryana 122018, India",
    amenities: [
      { id: "cancel", label: "Allows cancellation", icon: "↩️" },
      { id: "parking", label: "Parking", icon: "🅿️" },
      { id: "mobile", label: "Mobile Ticket", icon: "📱" },
      { id: "food", label: "Food & Beverages", icon: "🍿" },
      { id: "recliners", label: "Recliners", icon: "🛋️" },
      { id: "digital", label: "Digital Payments", icon: "💳" },
      { id: "wheelchair", label: "Wheelchair Friendly", icon: "♿" },
      { id: "ac", label: "Air Conditioning", icon: "❄️" },
    ],
    times: [
      {
        time: "04:20 PM",
        sessionId: "inox-1620",
        format: "2D",
        seats: [
          { label: "Executive", price: 220, status: "AVAILABLE" },
          { label: "Club", price: 250, status: "AVAILABLE" },
        ],
      },
      {
        time: "06:15 PM",
        tag: "LASER",
        sessionId: "inox-1815",
        format: "IMAX 2D",
        seats: [
          { label: "Royal", price: 280, status: "FILLING" },
          { label: "Royal Recliner", price: 520, status: "AVAILABLE" },
        ],
      },
      {
        time: "07:50 PM",
        sessionId: "inox-1950",
        format: "2D",
        seats: [
          { label: "Executive", price: 210, status: "AVAILABLE" },
          { label: "Club", price: 240, status: "AVAILABLE" },
          { label: "Royal", price: 270, status: "ALMOST_FULL" },
        ],
      },
      {
        time: "09:45 PM",
        tag: "LASER",
        sessionId: "inox-2145",
        format: "IMAX 2D",
        seats: [
          { label: "Royal", price: 290, status: "FILLING" },
          { label: "Royal Recliner", price: 540, status: "ALMOST_FULL" },
        ],
      },
      {
        time: "11:20 PM",
        sessionId: "inox-2320",
        format: "2D",
        seats: [
          { label: "Executive", price: 200, status: "AVAILABLE" },
          { label: "Club", price: 230, status: "AVAILABLE" },
        ],
      },
    ],
  },
];

// SAMPLE trailer embed
const TRAILER_EMBED_URL = "https://www.youtube.com/embed/9AJsFRNJGZ8";

// --------- SMALL HELPERS ---------- //

function toggleFromArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function timeToMinutes(timeStr: string): number {
  // "05:15 PM"
  const [hm, meridian] = timeStr.split(" ");
  const [hStr, mStr] = hm.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (meridian === "PM" && h !== 12) h += 12;
  if (meridian === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function getTimeBucket(timeStr: string): ShowTimeBucket {
  const mins = timeToMinutes(timeStr); // 0–1440
  if (mins >= 0 && mins < 8 * 60) return "EARLY_MORNING";
  if (mins >= 8 * 60 && mins < 12 * 60) return "MORNING";
  if (mins >= 12 * 60 && mins < 16 * 60) return "AFTERNOON";
  if (mins >= 16 * 60 && mins < 19 * 60) return "EVENING";
  return "NIGHT";
}

function matchPriceRanges(
  minSeatPrice: number,
  selectedPriceIds: string[]
): boolean {
  if (selectedPriceIds.length === 0) return true;
  return selectedPriceIds.some((id) => {
    const cfg = PRICE_FILTERS.find((p) => p.id === id);
    if (!cfg) return true;
    const { min, max } = cfg;
    if (max == null) return minSeatPrice >= min;
    return minSeatPrice >= min && minSeatPrice <= max;
  });
}

function hasAmenity(theatre: Theatre, id: string) {
  return theatre.amenities?.some((a) => a.id === id);
}

// --------------------------------- //

export default function MoviePage({ params }: { params: { slug: string } }) {
  const [selectedDateId, setSelectedDateId] = useState(1);
  const [selectedLang, setSelectedLang] = useState<"Hindi" | "English">(
    "Hindi"
  );

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [infoTheatre, setInfoTheatre] = useState<Theatre | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // movie details modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] =
    useState<DetailsTab>("REVIEWS");

  // refs for scroll-sync tabs (explicitly nullable)
  const detailsScrollRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const synopsisRef = useRef<HTMLDivElement | null>(null);
  const castRef = useRef<HTMLDivElement | null>(null);
  const videosRef = useRef<HTMLDivElement | null>(null);
  const postersRef = useRef<HTMLDivElement | null>(null);

  const [activeFilterTab, setActiveFilterTab] = useState<
    "FORMAT" | "SHOW_TIME" | "PRICE" | "OTHERS"
  >("FORMAT");

  const [selectedFormats, setSelectedFormats] = useState<ShowTimeFormat[]>(
    []
  );
  const [selectedShowTimes, setSelectedShowTimes] = useState<ShowTimeBucket[]>(
    []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(
    []
  );
  const [selectedOthers, setSelectedOthers] = useState<string[]>([]);

  const handleClearFilters = () => {
    setSelectedFormats([]);
    setSelectedShowTimes([]);
    setSelectedPriceRanges([]);
    setSelectedOthers([]);
  };

  // Top pills quick toggles
  const morningActive = selectedShowTimes.includes("MORNING");
  const after5Active =
    selectedShowTimes.includes("EVENING") ||
    selectedShowTimes.includes("NIGHT");
  const reclinersActive = selectedOthers.includes("RECLINERS");
  const wheelchairActive = selectedOthers.includes("WHEELCHAIR");
  const premiumActive = selectedOthers.includes("PREMIUM");
  const imaxActive = selectedFormats.includes("IMAX 2D");

  // Actual filtered theatres + showtimes
  const filteredTheatres: Theatre[] = THEATRES.map((t) => {
    const filteredTimes = t.times.filter((slot) => {
      // format
      if (
        selectedFormats.length > 0 &&
        slot.format &&
        !selectedFormats.includes(slot.format)
      ) {
        return false;
      }

      // show time bucket
      if (selectedShowTimes.length > 0) {
        const bucket = getTimeBucket(slot.time);
        if (!selectedShowTimes.includes(bucket)) return false;
      }

      // price
      const minPrice =
        slot.seats && slot.seats.length > 0
          ? Math.min(...slot.seats.map((s) => s.price))
          : 0;
      if (!matchPriceRanges(minPrice, selectedPriceRanges)) return false;

      // others – AND logic
      if (selectedOthers.length > 0) {
        const ok = selectedOthers.every((f) => {
          if (f === "RECLINERS") {
            return (
              hasAmenity(t, "recliners") ||
              (slot.seats ?? []).some((s) =>
                s.label.toLowerCase().includes("recliner")
              )
            );
          }
          if (f === "WHEELCHAIR") {
            return hasAmenity(t, "wheelchair");
          }
          if (f === "PREMIUM") {
            return (slot.seats ?? []).some((s) => {
              const l = s.label.toLowerCase();
              return (
                l.includes("royal") ||
                l.includes("prime") ||
                l.includes("vip") ||
                l.includes("premium")
              );
            });
          }
          if (f === "COUPLE") {
            return (slot.seats ?? []).some((s) =>
              s.label.toLowerCase().includes("couple")
            );
          }
          return true;
        });
        if (!ok) return false;
      }

      return true;
    });

    return { ...t, times: filteredTimes };
  }).filter((t) => t.times.length > 0);

  const totalShows = filteredTheatres.reduce(
    (sum, t) => sum + t.times.length,
    0
  );

  // ---------- Movie details modal: scroll + tab sync ---------- //
  const detailsTabs: { id: DetailsTab; label: string }[] = [
    { id: "REVIEWS", label: "Reviews" },
    { id: "SYNOPSIS", label: "Synopsis" },
    { id: "CAST", label: "Cast & Crew" },
    { id: "VIDEOS", label: "Videos" },
    { id: "POSTERS", label: "Posters" },
  ];

  // NOTE: allow nullable ref objects in typing
  const sectionRefMap: Record<DetailsTab, React.RefObject<HTMLDivElement | null>> = {
    REVIEWS: reviewsRef,
    SYNOPSIS: synopsisRef,
    CAST: castRef,
    VIDEOS: videosRef,
    POSTERS: postersRef,
  };

  const handleDetailsTabClick = (tab: DetailsTab) => {
    setActiveDetailsTab(tab);

    const container = detailsScrollRef.current;
    const target = sectionRefMap[tab].current;
    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const offset =
      targetRect.top - containerRect.top + container.scrollTop - 16;

    container.scrollTo({
      top: Math.max(0, offset),
      behavior: "smooth",
    });
  };

  const handleDetailsScroll = () => {
    const container = detailsScrollRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    let closestTab: DetailsTab = "REVIEWS";
    let minDistance = Number.POSITIVE_INFINITY;

    (Object.keys(sectionRefMap) as DetailsTab[]).forEach((tab) => {
      const el = sectionRefMap[tab].current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - containerRect.top - 40);

      if (distance < minDistance) {
        minDistance = distance;
        closestTab = tab;
      }
    });

    if (closestTab !== activeDetailsTab) {
      setActiveDetailsTab(closestTab);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 lg:px-0">
        {/* TOP HERO */}
        <section className="flex flex-col gap-6 border-b border-zinc-200 pb-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {/* Poster - click to open trailer */}
            <button
              type="button"
              onClick={() => setIsTrailerOpen(true)}
              className="relative h-[140px] w-[100px] overflow-hidden rounded-2xl bg-zinc-200 md:h-[160px] md:w-[115px]"
            >
              <Image
                src="/movies/d4.jpg"
                alt="Tere Ishk Mein"
                fill
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white shadow-lg">
                  ▶
                </span>
              </span>
            </button>

            <div className="flex flex-1 flex-col gap-2">
              <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">
                Tere Ishk Mein
              </h1>
              <p className="text-xs font-medium text-zinc-500 md:text-sm">
                UA16+ • Hindi +1 more • 2 hr 49 min
              </p>

              {/* OPEN MOVIE DETAILS MODAL */}
              <button
                type="button"
                onClick={() => setIsDetailsOpen(true)}
                className="mt-2 inline-flex w-max items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:border-zinc-300"
              >
                View details
              </button>
            </div>
          </div>
        </section>

        {/* DATE STRIP */}
        <section className="mt-4 border-b border-zinc-200 pb-4">
          <div className="flex items-stretch gap-4">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-100 px-3 text-xs font-semibold text-zinc-500">
              <span className="uppercase">
                {DATES.find((d) => d.id === selectedDateId)?.month || "NOV"}
              </span>
            </div>

            <div className="flex flex-1 gap-2 overflow-x-auto pb-1 no-scrollbar">
              {DATES.map((d) => {
                const active = d.id === selectedDateId;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDateId(d.id)}
                    className={[
                      "flex w-[64px] flex-col items-center justify-center rounded-2xl border px-2 py-2 text-xs font-medium transition-all",
                      active
                        ? "border-black bg-black text-white"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400",
                    ].join(" ")}
                  >
                    <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                      {d.month || ""}
                    </span>
                    <span className="text-base font-semibold">{d.dayNum}</span>
                    <span className="text-[11px]">{d.dayLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILTER PILLS */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800"
            >
              <span className="text-lg leading-none">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 5h16M7 5a2 2 0 1 0 4 0M4 12h16M13 12a2 2 0 1 0 4 0M4 19h16M6 19a2 2 0 1 0 4 0" />
                </svg>
              </span>
              <span>Filters</span>
              <span className="text-xs">▼</span>
            </button>

            <button
              onClick={() =>
                setSelectedFormats((prev) => toggleFromArray(prev, "IMAX 2D"))
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                imaxActive
                  ? "border-black bg-black text-white"
                  : "border-zinc-300 bg-white text-zinc-800"
              }`}
            >
              IMAX 2D
            </button>

            <button
              onClick={() =>
                setSelectedShowTimes((prev) => toggleFromArray(prev, "MORNING"))
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                morningActive
                  ? "border-black bg-black text-white"
                  : "border-zinc-300 bg-white text-zinc-800"
              }`}
            >
              Morning
            </button>

            <button
              onClick={() =>
                setSelectedShowTimes((prev) => {
                  let next = [...prev];
                  if (after5Active) {
                    next = next.filter(
                      (id) => id !== "EVENING" && id !== "NIGHT"
                    );
                  } else {
                    if (!next.includes("EVENING")) next.push("EVENING");
                    if (!next.includes("NIGHT")) next.push("NIGHT");
                  }
                  return next;
                })
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                after5Active
                  ? "border-black bg-black text-white"
                  : "border-zinc-300 bg-white text-zinc-800"
              }`}
            >
              After 5 PM
            </button>

            <button
              onClick={() =>
                setSelectedOthers((prev) => toggleFromArray(prev, "RECLINERS"))
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                reclinersActive
                  ? "border-black bg-black text-white"
                  : "border-zinc-300 bg-white text-zinc-800"
              }`}
            >
              Recliners
            </button>

            <button
              onClick={() =>
                setSelectedOthers((prev) => toggleFromArray(prev, "WHEELCHAIR"))
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                wheelchairActive
                  ? "border-black bg-black text-white"
                  : "border-zinc-300 bg-white text-zinc-800"
              }`}
            >
              Wheelchair Friendly
            </button>

            <button
              onClick={() =>
                setSelectedOthers((prev) => toggleFromArray(prev, "PREMIUM"))
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                premiumActive
                  ? "border-black bg-black text-white"
                  : "border-zinc-300 bg-white text-zinc-800"
              }`}
            >
              Premium Seats
            </button>
          </div>

          {/* LEGEND BAR */}
          <div className="mt-4 flex gap-6 rounded-md bg-zinc-100 px-4 py-2 text-xs text-zinc-600">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-zinc-900" />
              Available
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              Filling fast
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Almost full
            </span>
          </div>
        </section>

        {/* THEATRES + SHOWTIMES */}
        <section className="mt-4 space-y-6">
          {filteredTheatres.map((theatre) => (
            <div
              key={theatre.id}
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                {/* LEFT: logo + name - CLICKABLE for info modal */}
                <button
                  type="button"
                  onClick={() => setInfoTheatre(theatre)}
                  className="flex flex-1 items-start gap-4 text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-[10px] font-bold uppercase text-zinc-700">
                    {theatre.logoText}
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-[15px] font-semibold text-zinc-900 md:text-base">
                      {theatre.name}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {theatre.distance} • {theatre.meta}
                    </p>
                  </div>
                </button>

                {/* Favourite heart */}
                <button className="mt-1 h-12 w-12 flex items-center justify-center rounded-full hover:bg-zinc-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 stroke-[2] text-zinc-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                </button>
              </div>

              {/* showtimes → link to seat-layout page */}
              <div className="mt-4 flex flex-wrap gap-3">
                {theatre.times.map((slot, idx) => (
                  <div key={idx} className="relative group">
                    {/* HOVER POPUP */}
                    {slot.seats && slot.seats.length > 0 && (
                      <div
                        className="
                          pointer-events-none
                          absolute bottom-full left-1/2 z-20 mb-3
                          hidden -translate-x-1/2 transform
                          rounded-2xl bg-[#f3f3f3] px-7 py-4
                          shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                          group-hover:flex
                        "
                      >
                        <div className="flex gap-8">
                          {slot.seats.map((s, i) => (
                            <div key={i} className="min-w-[90px] text-center">
                              <div className="text-[11px] font-semibold tracking-wide text-zinc-500">
                                {s.label.toUpperCase()}
                              </div>
                              <div className="mt-1 text-[15px] font-semibold text-zinc-900">
                                ₹{s.price}
                              </div>
                              <div
                                className={`mt-1 text-[11px] font-semibold ${
                                  s.status === "AVAILABLE"
                                    ? "text-emerald-600"
                                    : s.status === "FILLING"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {s.status === "AVAILABLE"
                                  ? "AVAILABLE"
                                  : s.status === "FILLING"
                                  ? "FILLING FAST"
                                  : "ALMOST FULL"}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* notch-style arrow */}
                        <div
                          className="
                            pointer-events-none absolute left-1/2 top-full
                            -translate-x-1/2 -translate-y-[1px]
                          "
                        >
                          <div
                            className="
                              w-0 h-0
                              border-l-[18px] border-r-[18px] border-t-[14px]
                              border-l-transparent border-r-transparent
                              border-t-[#f3f3f3]
                            "
                          />
                        </div>
                      </div>
                    )}

                    {/* TIME CARD */}
                    <Link
                      href={`/movies/seat-layout/${slot.sessionId}`}
                      className="flex h-[56px] w-[160px] flex-col items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 hover:border-zinc-900"
                    >
                      <span>{slot.time}</span>
                      {slot.tag && (
                        <span className="mt-1 text-[10px] uppercase tracking-wide text-zinc-500">
                          {slot.tag}
                        </span>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredTheatres.length === 0 && (
            <div className="mt-8 text-center text-sm text-zinc-600">
              No shows match the selected filters.
            </div>
          )}
        </section>
      </main>

      {/* TRAILER MODAL */}
      {isTrailerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md"
          onClick={() => setIsTrailerOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsTrailerOpen(false)}
            className="absolute right-6 top-6 text-2xl font-semibold text-zinc-700 hover:text-black"
          >
            ✕
          </button>

          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full pb-[56.25%]">
              <iframe
                width="100%"
                height="100%"
                src={`${TRAILER_EMBED_URL}?autoplay=1`}
                className="absolute inset-0 h-full w-full"
                title="Tere Ishk Mein Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                Tere Ishk Mein
              </h2>
              <p className="mt-1 text-xs font-medium text-zinc-500">
                UA16+ &nbsp;|&nbsp; Hindi &nbsp;|&nbsp; 2 hr 49 min
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MOVIE DETAILS MODAL (View details) */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl bg-white px-8 py-6 shadow-2xl md:px-10 md:py-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsDetailsOpen(false)}
              className="absolute right-6 top-6 text-xl font-semibold text-zinc-500 hover:text-zinc-800"
            >
              ✕
            </button>

            <div>
              <h2 className="text-xl font-semibold text-zinc-900 md:text-2xl">
                Movie details
              </h2>
              <p className="mt-1 text-xs font-medium text-zinc-500 md:text-sm">
                Tere Ishk Mein
              </p>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-6 border-b border-zinc-200 text-sm md:text-base">
              {detailsTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleDetailsTabClick(tab.id)}
                  className={`relative px-1 pb-3 text-sm font-medium md:px-2 md:text-base ${
                    activeDetailsTab === tab.id ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {tab.label}
                  {activeDetailsTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 mx-auto h-[2px] w-full max-w-[70px] rounded-full bg-[#6c4bff]" />
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable content */}
            <div
              ref={detailsScrollRef}
              onScroll={handleDetailsScroll}
              className="mt-5 max-h-[60vh] overflow-y-auto pr-2"
            >
              {/* REVIEWS */}
              <section ref={reviewsRef} className="pb-10">
                <h3 className="text-sm font-semibold text-zinc-900 md:text-base">
                  Reviews
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-orange-100" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-800">
                          Bollywood Hungama
                        </p>
                        <p className="text-[11px] text-zinc-500">critic review</p>
                      </div>
                      <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                        3.0/5 ★
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-zinc-600">
                      An emotional love story with strong performances and a soundtrack that stays with you long after the film ends.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-800">Taran Adarsh</p>
                        <p className="text-[11px] text-zinc-500">film critic</p>
                      </div>
                      <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                        3.5/5 ★
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-zinc-600">
                      Relies heavily on its lead pair&apos;s chemistry and delivers a visually rich, emotionally charged experience.
                    </p>
                  </div>
                </div>
              </section>

              {/* SYNOPSIS */}
              <section ref={synopsisRef} className="pb-10">
                <h3 className="text-sm font-semibold text-zinc-900 md:text-base">Synopsis</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  Set in an urban landscape where modern love meets old–school devotion, <b>Tere Ishk Mein</b> follows two young adults drawn together by an unexpected encounter. As their relationship deepens, they must face external obstacles, internal doubts and the clash between passion and expectation.
                </p>

                <div className="mt-6 space-y-3 text-sm text-zinc-700">
                  <div className="flex items-center gap-3"><span className="text-lg">🎬</span><span>UA16+</span></div>
                  <div className="flex items-center gap-3"><span className="text-lg">🌐</span><span>Hindi, Tamil, Telugu</span></div>
                  <div className="flex items-center gap-3"><span className="text-lg">🎭</span><span>Drama, Romance</span></div>
                </div>
              </section>

              {/* CAST */}
              <section ref={castRef} className="pb-10">
                <h3 className="text-sm font-semibold text-zinc-900 md:text-base">Cast &amp; Crew</h3>
                <div className="mt-5 grid grid-cols-3 gap-y-6 gap-x-4 md:grid-cols-5">
                  {["Dhanush","Kriti Sanon","Priyanshu","Prakash Raj","Paramvir","Jaya B.","Vineet K.","Zeeshan A."].map((name, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className="h-16 w-16 rounded-full bg-zinc-200" />
                      <span className="text-[11px] font-medium text-zinc-800 text-center">{name}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* VIDEOS */}
              <section ref={videosRef} className="pb-10">
                <h3 className="text-sm font-semibold text-zinc-900 md:text-base">Videos</h3>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {[1,2].map((i)=>(
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900">
                      <Image src="/movies/d4.jpg" alt="Trailer" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xl shadow-lg">▶</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* POSTERS */}
              <section ref={postersRef} className="pb-4">
                <h3 className="text-sm font-semibold text-zinc-900 md:text-base">Posters &amp; wallpapers</h3>
                <div className="mt-5 flex justify-center">
                  <div className="relative max-w-md overflow-hidden rounded-3xl bg-zinc-900">
                    <Image src="/movies/d4.jpg" alt="Poster" width={600} height={800} className="h-auto w-full object-cover"/>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* THEATRE INFO MODAL */}
      {infoTheatre && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
          onClick={() => setInfoTheatre(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-3xl bg-white px-8 py-6 shadow-2xl md:px-10 md:py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInfoTheatre(null)}
              className="absolute right-6 top-6 text-xl font-semibold text-zinc-500 hover:text-zinc-800"
            >
              ✕
            </button>

            <div className="flex flex-col gap-4 pr-10 md:flex-row md:items-start">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-bold uppercase text-zinc-700">
                {infoTheatre.logoText}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-lg font-semibold text-zinc-900 md:text-xl">{infoTheatre.name}</h2>
                <p className="text-xs leading-relaxed text-zinc-600 md:text-sm">{infoTheatre.address}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-zinc-900">Services &amp; amenities</h3>

              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-xs text-zinc-700 sm:grid-cols-3 md:grid-cols-4">
                {infoTheatre.amenities?.map((a) => (
                  <div key={a.id} className="flex flex-col items-center gap-1 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-base">{a.icon}</div>
                    <span className="max-w-[8rem] text-[11px] leading-snug text-zinc-600">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link
                href={`/theatre/${infoTheatre.slug}`}
                className="flex w-full items-center justify-center rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-200"
              >
                View all movies playing here
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FILTER MODAL – fixed size across tabs */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="relative flex w-full max-w-4xl max-h-[80vh] flex-col rounded-3xl bg-white px-8 py-6 shadow-2xl md:px-10 md:py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="absolute right-6 top-6 text-xl font-semibold text-zinc-500 hover:text-zinc-800"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-zinc-900 md:text-xl">Filter by</h2>

            {/* Main body with fixed inner height */}
            <div className="mt-6 flex flex-1 gap-6 overflow-hidden">
              {/* Left tabs */}
              <div className="flex w-32 flex-col text-sm font-medium text-zinc-600">
                <button
                  onClick={() => setActiveFilterTab("FORMAT")}
                  className={`rounded-xl px-3 py-2 text-left ${activeFilterTab === "FORMAT" ? "bg-zinc-900/5 text-zinc-900" : "hover:bg-zinc-100"}`}
                >
                  Format
                </button>
                <button
                  onClick={() => setActiveFilterTab("SHOW_TIME")}
                  className={`mt-1 rounded-xl px-3 py-2 text-left ${activeFilterTab === "SHOW_TIME" ? "bg-zinc-900/5 text-zinc-900" : "hover:bg-zinc-100"}`}
                >
                  Show Time
                </button>
                <button
                  onClick={() => setActiveFilterTab("PRICE")}
                  className={`mt-1 rounded-xl px-3 py-2 text-left ${activeFilterTab === "PRICE" ? "bg-zinc-900/5 text-zinc-900" : "hover:bg-zinc-100"}`}
                >
                  Price
                </button>
                <button
                  onClick={() => setActiveFilterTab("OTHERS")}
                  className={`mt-1 rounded-xl px-3 py-2 text-left ${activeFilterTab === "OTHERS" ? "bg-zinc-900/5 text-zinc-900" : "hover:bg-zinc-100"}`}
                >
                  Others
                </button>
              </div>

              {/* Right content – fixed height, scrollable */}
              <div className="flex-1 h-[360px] rounded-2xl bg-zinc-50 px-6 py-5 overflow-y-auto">
                {/* FORMAT TAB */}
                {activeFilterTab === "FORMAT" && (
                  <ul className="space-y-4 text-sm">
                    {FORMAT_FILTERS.map((f) => (
                      <li key={f.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedFormats.includes(f.id)}
                          onChange={() => setSelectedFormats((prev) => toggleFromArray(prev, f.id))}
                          className="mt-[1px] h-4 w-4 rounded-full border-2 border-zinc-400 accent-black"
                        />
                        <span className="font-semibold text-zinc-900">{f.label}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* SHOW TIME TAB */}
                {activeFilterTab === "SHOW_TIME" && (
                  <ul className="space-y-4 text-sm">
                    {SHOW_TIME_FILTERS.map((opt) => (
                      <li key={opt.id} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedShowTimes.includes(opt.id)}
                          onChange={() => setSelectedShowTimes((prev) => toggleFromArray(prev, opt.id))}
                          className="mt-1 h-4 w-4 rounded-full border-2 border-zinc-400 accent-black"
                        />
                        <div>
                          <div className="font-semibold text-zinc-900">{opt.label}</div>
                          <div className="text-xs text-zinc-500">{opt.sub}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* PRICE TAB */}
                {activeFilterTab === "PRICE" && (
                  <ul className="space-y-3 text-sm">
                    {PRICE_FILTERS.map((opt) => (
                      <li key={opt.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(opt.id)}
                          onChange={() => setSelectedPriceRanges((prev) => toggleFromArray(prev, opt.id))}
                          className="h-4 w-4 rounded-full border-2 border-zinc-400 accent-black"
                        />
                        <span className="font-semibold text-zinc-900">{opt.label}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* OTHERS TAB */}
                {activeFilterTab === "OTHERS" && (
                  <ul className="space-y-4 text-sm">
                    {OTHERS_FILTERS.map((opt) => (
                      <li key={opt.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedOthers.includes(opt.id)}
                          onChange={() => setSelectedOthers((prev) => toggleFromArray(prev, opt.id))}
                          className="h-4 w-4 rounded-full border-2 border-zinc-400 accent-black"
                        />
                        <span className="font-semibold text-zinc-900">{opt.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="mt-8 flex items-center justify-between">
              <button type="button" onClick={handleClearFilters} className="text-sm font-medium text-zinc-700 underline underline-offset-4">
                Clear filter
              </button>

              <button type="button" onClick={() => setIsFilterOpen(false)} className="flex min-w-[200px] items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-900">
                View {totalShows} shows
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
