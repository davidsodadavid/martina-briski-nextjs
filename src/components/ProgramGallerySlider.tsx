"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_MS = 5000;

/** Full-bleed photo slideshow. Auto-advances every 5s when there's more
 * than one image; a single image just displays statically. */
export default function ProgramGallerySlider({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative ml-[calc(50%-50vw)] h-[80vh] w-screen overflow-hidden md:aspect-21/9 md:h-auto">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={i === 0}
          className="object-cover grayscale transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute right-6 bottom-5 z-10 flex gap-2 md:right-10">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Prikaži fotografiju ${i + 1}`}
              className="h-2 w-2"
              style={{
                background:
                  i === active ? "var(--nav-highlight)" : "rgba(255,255,255,0.5)",
                transition: "background-color .3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
