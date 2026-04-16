"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative">
      <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20" />
      
      {/* Example Amazon Hero Banner UI */}
      <Carousel />
    </div>
  );
}

function Carousel() {
  // A simple mockup of the famous amazon slider
  return (
    <div className="relative w-full overflow-hidden flex bg-gray-200" style={{ height: "400px" }}>
      <img
        loading="lazy"
        className="w-full h-full object-cover md:object-fill"
        src="https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg"
        alt="Hero Banner 1"
      />
    </div>
  )
}
