"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  altMap,
  fallbackAlt,
}: {
  images: string[];
  altMap: Record<string, string>;
  fallbackAlt: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-4/5 w-full bg-[var(--nav-overlay-text)]" />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/5 w-full overflow-hidden bg-[var(--nav-overlay-text)]">
        <Image
          src={images[activeIdx]}
          alt={altMap[images[activeIdx]] ?? fallbackAlt}
          fill
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2.5">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIdx(i)}
              className="relative h-[68px] w-[68px] shrink-0 overflow-hidden"
              style={{
                border: `2px solid ${i === activeIdx ? "var(--accent-clay)" : "transparent"}`,
              }}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
