import React from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";

const DEMO_PUSHUPS = [
  "/boardRoom.gif",
  "/cafe.gif",
  "/computer.gif",
  "/dogs.gif",
  "/subway.gif",
  "/tea.gif",
  "/toilet.gif",
  "/traffic.gif",
];

export const MarqueeGifs = () => {
  const gifs = [...DEMO_PUSHUPS, ...DEMO_PUSHUPS];

  return (
    <nav className="relative w-full h-36 mt-4 flex items-center justify-center">
      {/* Marquee background layer */}
      <div className="absolute inset-0 z-0">
        <Marquee>
          {gifs.map((gif, idx) => (
            <img
              key={idx}
              src={gif}
              className="h-32 w-auto mx-4 shrink-0"
              alt={`gif-${idx}`}
            />
          ))}
        </Marquee>
      </div>

      <div className="z-10 px-4 py-2 rounded-xl flex items-center">
        <Link href="/" className="flex items-center">
          <img src="/icon.png" alt="GitPushups" width={200} height={200} />
        </Link>
      </div>
    </nav>
  );
};
