"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function SafeImage({
  src,
  alt,
  className,
  width,
  height,
}: {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const [ok, setOk] = useState(true);
  const placeholder = "/movies/placeholder.jpg"; // ensure exists in public/movies

  if (!ok) {
    // use normal <img> for placeholder (or Image)
    return <img src={placeholder} alt={alt} className={className} width={width} height={height} />;
  }

  // next/image does not reliably surface onError in all versions — so use onError on img fallback
  return (
    // using <img> to keep onError consistent — if you prefer next/Image remove and replace accordingly
    // But if you must use next/Image, still include <img> fallback below where necessary.
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setOk(false)}
    />
  );
}
