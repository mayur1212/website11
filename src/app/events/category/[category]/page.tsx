// src/app/events/category/[category]/page.tsx
import React from "react";

type Props = {
  params: { category: string };
};

export default function CategoryPage({ params }: Props) {
  const { category } = params;
  return (
    <main>
      <h1>Events — {category}</h1>
      <p>Placeholder page for category <strong>{category}</strong>.</p>
      {/* Replace with your actual UI / data fetching */}
    </main>
  );
}
