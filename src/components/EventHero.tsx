"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type EventSlide = {
  id: number;
  dateTime: string;
  title: string;
  location: string;
  price: string;
  image: string;
};

const SLIDES: EventSlide[] = [
  {
    id: 1,
    dateTime: "Sat, 20 Dec, 7:00 PM",
    title: "A.R. Rahman - Harmony of Hearts | New Delhi",
    location: "Indira Gandhi Indoor Stadium, Delhi/NCR",
    price: "₹999 onwards",
    image: "/movies/d1.jpg",
  },
  {
    id: 2,
    dateTime: "Sun, 21 Dec, 8:00 PM",
    title: "Live Symphony Night | Mumbai",
    location: "Jio World Convention Centre, Mumbai",
    price: "₹1,499 onwards",
    image: "/movies/d2.jpg",
  },
  {
    id: 3,
    dateTime: "Mon, 22 Dec, 6:30 PM",
    title: "Arijit Singh Live Concert | Pune",
    location: "Balewadi Stadium, Pune",
    price: "₹2,199 onwards",
    image: "/movies/d3.jpg",
  },
];

export default function EventHero() {
  const [active, setActive] = useState<number>(0);

  // Auto-slide every 5s
  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const goNext = () => setActive((i) => (i + 1) % SLIDES.length);
  const goPrev = () => setActive((i) => (i === 0 ? SLIDES.length - 1 : i - 1));
  const slide = SLIDES[active];

  return (
    <>
      {/* ========== MOBILE / TABLET: horizontal card carousel (lg hidden) ========== */}
      <section className="lg:hidden w-full bg-[#fff9ec] px-4 py-8 sm:px-5 md:px-6">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">Featured Events</h2>

          <div className="relative mt-4">
            {/* fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#fff9ec] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#fff9ec] to-transparent" />

            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
              {SLIDES.map((event, index) => (
                <article
                  key={event.id}
                  className={`snap-center shrink-0 w-[260px] sm:w-[280px] overflow-hidden rounded-[24px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-transform duration-200 ${
                    index === active ? "scale-[1.02]" : "scale-[0.97] opacity-90"
                  }`}
                  onClick={() => setActive(index)}
                >
                  <div className="relative h-[260px] sm:h-[280px] w-full">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                  </div>

                  <div className="px-4 pb-4 pt-3">
                    <h3 className="text-sm font-semibold leading-snug text-zinc-900">{event.title}</h3>
                    <p className="mt-1 text-xs font-medium text-zinc-500">{event.price}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-3 flex justify-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`h-2 rounded-full transition-all ${idx === active ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== DESKTOP HERO (lg+) ========== */}
      <section className="hidden lg:block relative w-full overflow-hidden bg-gradient-to-r from-[#d7d4de] via-[#e6e0ea] to-[#f4edf4]">
        <div className="mx-auto flex w-[90%] items-center gap-14 px-14 py-16">
          {/* Left arrow */}
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="mr-2 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-black hover:text-zinc-800 md:flex"
          >
            ‹
          </button>

          {/* Text */}
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-800">{slide.dateTime}</p>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-zinc-900 md:text-4xl lg:text-5xl">{slide.title}</h1>

            <p className="mt-4 text-lg font-medium text-zinc-800">{slide.location}</p>

            <p className="mt-8 text-base font-semibold text-zinc-900">{slide.price}</p>

            <button className="mt-5 rounded-full bg-black px-10 py-3 text-sm font-semibold text-white shadow-lg hover:bg-zinc-900">
              Book tickets
            </button>
          </div>

          {/* Poster + right arrow */}
          <div className="relative flex flex-1 items-center justify-end">
            <div className="overflow-hidden rounded-3xl bg-[#1b062e] shadow-2xl">
              <div className="relative h-[340px] w-[250px] md:h-[380px] md:w-[280px] lg:h-[420px] lg:w-[300px]">
                <Image src={slide.image} alt={slide.title} fill className="object-cover" priority />
              </div>
            </div>

            <button
              onClick={goNext}
              aria-label="Next"
              className="ml-4 hidden h-10 w-10 items-center justify-center rounded-full text-xl text-black hover:text-zinc-800 md:flex"
            >
              ›
            </button>
          </div>
        </div>

        {/* Dots (bottom) */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={idx === active ? "h-1.5 w-8 rounded-full bg-black" : "h-1.5 w-2 rounded-full bg-zinc-400/70"}
            />
          ))}
        </div>
      </section>
    </>
  );
}
