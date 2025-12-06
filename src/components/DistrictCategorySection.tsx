"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Simple district category / store category section used on the Stores page.
 * - Responsive grid
 * - Each card links to a category page (you can change href)
 * - Uses next/image (replace image paths with your real assets)
 */

const CATEGORIES = [
  {
    id: "groceries",
    title: "Groceries",
    subtitle: "Daily essentials",
    image: "/assets/categories/groceries.jpg",
    href: "/stores/groceries",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    subtitle: "Medicines & health",
    image: "/assets/categories/pharmacy.jpg",
    href: "/stores/pharmacy",
  },
  {
    id: "electronics",
    title: "Electronics",
    subtitle: "Gadgets & accessories",
    image: "/assets/categories/electronics.jpg",
    href: "/stores/electronics",
  },
  {
    id: "fashion",
    title: "Fashion",
    subtitle: "Clothes & apparel",
    image: "/assets/categories/fashion.jpg",
    href: "/stores/fashion",
  },
  {
    id: "home",
    title: "Home & Living",
    subtitle: "Furniture & decor",
    image: "/assets/categories/home.jpg",
    href: "/stores/home",
  },
  {
    id: "beauty",
    title: "Beauty",
    subtitle: "Skincare & makeup",
    // fixed path to be consistent with other category images
    image: "/assets/categories/beauty.jpg",
    href: "/stores/beauty",
  },
];

export default function DistrictCategorySection() {
  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900">Shop by Category</h2>
          <Link href="/stores" className="text-sm text-zinc-500 hover:text-zinc-700">
            View all categories →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group block overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-36 w-full overflow-hidden rounded-t-2xl bg-zinc-50">
                {/* If your images are not present in /public/assets, replace path or use <img> */}
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="px-3 py-3">
                <h3 className="text-sm font-medium text-zinc-900">{cat.title}</h3>
                <p className="mt-1 text-xs text-zinc-500">{cat.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
