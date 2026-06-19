"use client";

import { Hexagon, Triangle, Circle, Square, Sparkles, Command, Globe, Activity } from "lucide-react";

export function Brands() {
  const brands = [
    { name: "Acme Corp", Icon: Hexagon, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Globex", Icon: Globe, color: "text-green-500", bg: "bg-green-50" },
    { name: "Soylent", Icon: Circle, color: "text-red-500", bg: "bg-red-50" },
    { name: "Initech", Icon: Square, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Umbrella", Icon: Triangle, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Stark", Icon: Sparkles, color: "text-yellow-500", bg: "bg-yellow-50" },
    { name: "Wayne", Icon: Command, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Massive", Icon: Activity, color: "text-pink-500", bg: "bg-pink-50" },
  ];

  const renderBrandCards = () => (
    <>
      {brands.map((brand, i) => (
        <div 
          key={i} 
          className="w-64 md:w-80 shrink-0 group/card relative flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer"
        >
          {/* Hover background color that floods in */}
          <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${brand.bg} -z-10`}></div>
          
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm group-hover/card:shadow-md flex items-center justify-center mb-6 group-hover/card:scale-110 transition-transform duration-500 ease-out border border-gray-50 relative z-10`}>
            <brand.Icon className={`w-8 h-8 md:w-10 md:h-10 ${brand.color} transition-transform duration-700 group-hover/card:rotate-12`} strokeWidth={1.5} />
          </div>
          
          <h3 className="font-sans font-bold text-lg md:text-xl text-gray-800 group-hover/card:text-black transition-colors text-center relative z-10 whitespace-nowrap">
            {brand.name}
          </h3>
        </div>
      ))}
    </>
  );

  return (
    <section className="bg-white py-20 md:py-32 border-t border-gray-200 overflow-hidden relative z-0">
      {/* Cheerful background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] max-w-[1200px] h-[600px] bg-gradient-to-b from-[#ffed4a]/30 via-[#ff7e67]/10 to-transparent blur-[100px] -z-10 rounded-full opacity-60"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="text-center mb-16 md:mb-24 relative z-10">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-orange-500 mb-4 block">
            Trusted by the Best
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-black font-bold tracking-tight leading-none">
            Brands We've <br className="hidden md:block"/> Represented
          </h2>
        </div>
      </div>

      <div className="relative flex overflow-hidden group gap-4 md:gap-8">
        <div className="flex gap-4 md:gap-8 shrink-0 min-w-full justify-around animate-marquee group-hover:[animation-play-state:paused]">
          {renderBrandCards()}
        </div>
        <div className="flex gap-4 md:gap-8 shrink-0 min-w-full justify-around animate-marquee group-hover:[animation-play-state:paused]" aria-hidden="true">
          {renderBrandCards()}
        </div>
      </div>
    </section>
  );
}
