"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-[80vh] flex items-end justify-center pb-12 overflow-hidden bg-white">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-collage.png"
          alt="Diverse sales professionals networking with vibrant gradient overlay"
          fill
          priority
          className="object-cover object-top opacity-90"
        />
      </div>

      {/* Center Glass Box overlay */}
      <div className="relative z-10 w-[90%] max-w-xl bg-white/80 backdrop-blur-md border border-white/40 py-8 px-6 md:px-10 text-center shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-serif text-red-600 font-bold mb-3 tracking-tight">
          Fractional Sales Partner
        </h1>
        <p className="text-slate-800 text-sm md:text-base mx-auto mb-6 font-sans leading-relaxed">
          Discover the change-makers helping MSMEs from emerging markets reach their full potential across the UK, USA, AUS, and EU.
        </p>
        
        <Link href="#read-more" className="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-800 transition-colors text-xs tracking-[0.2em] uppercase font-sans">
          READ MORE
          <div className="border border-red-600 p-0.5 ml-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </div>
        </Link>
      </div>
    </section>
  );
}
