"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Newspaper } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Unexpanded Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Menu & Subscribe */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 font-sans font-medium text-sm text-red-600 tracking-wide"
            >
              MENU <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className="font-serif font-bold text-lg md:text-xl tracking-tighter text-gray-900 flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              Fractional Sales 
              <span className="text-[#701010] font-headline text-[10px] uppercase tracking-widest font-bold border border-[#701010]/20 px-1.5 py-0.5 ml-1">
                Portal
              </span>
            </Link>
          </div>

          {/* Right: Profile */}
          <div className="flex items-center">
            <Link href="/login" className="relative p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
              <User className="w-5 h-5 text-gray-700" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Expanded Mega Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] bg-[#1a1a1a] text-white flex flex-col overflow-y-auto animate-in fade-in duration-200">
          {/* Expanded Header */}
          <div className="flex-none container mx-auto px-4 h-16 flex items-center justify-between border-b border-white/10">
            {/* Left: Close */}
            <div className="flex items-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 font-sans font-medium text-sm hover:text-gray-300 transition-colors tracking-wide"
              >
                CLOSE <X className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex items-center justify-center">
              <Link href="/" className="font-serif font-bold text-lg md:text-xl tracking-tighter text-white flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                Fractional Sales 
                <span className="text-white font-headline text-[10px] uppercase tracking-widest font-bold border border-white/20 px-1.5 py-0.5 ml-1">
                  Portal
                </span>
              </Link>
            </div>

            {/* Right: Profile */}
            <div className="flex items-center gap-6">
              <Link href="/login" className="relative p-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors">
                <User className="w-5 h-5 text-white" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1a1a]"></span>
              </Link>
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex-1 container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-full">
              {/* Column 1: TOPICS */}
              <div className="md:border-r border-white/10 pr-8">
                <h3 className="font-sans font-bold text-xs tracking-widest uppercase mb-6 text-white/90">Topics</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                  {["World", "Sports", "Science", "Politics", "Entertainment", "Health", "Climate", "Business"].map(topic => (
                    <Link key={topic} href={`#${topic.toLowerCase()}`} className="text-sm font-medium hover:text-red-500 transition-colors">
                      {topic}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Column 2: LATEST COLLECTIONS */}
              <div className="md:border-r border-white/10 pr-8">
                <h3 className="font-sans font-bold text-xs tracking-widest uppercase mb-6 text-white/90">Latest Collections</h3>
                <div className="flex flex-col gap-5">
                  {[
                    "The 100 Best Sales Plays of the Decade", 
                    "Fractional Sales Partner Visionaries", 
                    "Our Global Reach", 
                    "The 100 Most Influential Partners 2026", 
                    "Fractional Sales Partner Leadership Forums 2026"
                  ].map(collection => (
                    <Link key={collection} href="#" className="text-sm font-medium hover:text-red-500 transition-colors leading-snug">
                      {collection}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Column 3: FEATURED */}
              <div className="md:border-r border-white/10 pr-8">
                <h3 className="font-sans font-bold text-xs tracking-widest uppercase mb-6 text-white/90">Featured</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-white/5">
                      <Image src="/hero-bg-2.png" alt="Featured 1" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="text-sm font-bold group-hover:text-red-500 transition-colors leading-tight">AI Tools Are Transforming Global Partnerships</h4>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-white/5">
                      <Image src="/hero-bg.png" alt="Featured 2" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="text-sm font-bold group-hover:text-red-500 transition-colors leading-tight">Closing Deals: The Art of the Modern Ice Breaker</h4>
                  </div>
                </div>
              </div>

              {/* Column 4: NEWSLETTERS */}
              <div>
                <h3 className="font-sans font-bold text-xs tracking-widest uppercase mb-6 text-white/90">Newsletters</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["THE BRIEF +", "WORTH YOUR TIME +", "IN THE LOOP +", "THE DC BRIEF +"].map(pill => (
                    <button key={pill} className="px-4 py-1.5 rounded-full border border-white/30 text-xs font-medium hover:bg-white hover:text-black transition-colors">
                      {pill}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="flex-1 bg-white text-black px-3 py-2 text-sm outline-none"
                  />
                  <button className="bg-transparent border border-white/30 px-4 py-2 text-sm font-bold hover:bg-white hover:text-black transition-colors">
                    SIGN UP
                  </button>
                </div>
                <p className="text-[10px] text-white/60 mt-3 leading-tight">
                  By signing up you are agreeing to our <Link href="#" className="underline hover:text-white">Terms of Service</Link> and <Link href="#" className="underline hover:text-white">Privacy Policy</Link>.<br/><br/>
                  <Link href="#" className="hover:text-white transition-colors">See all Newsletters →</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
