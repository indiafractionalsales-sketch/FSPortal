"use client";

export function Brands() {
  const brands = [
    { name: "Age Aayurveda", subtitle: "Associate of Baidyanath Group", color: "text-amber-600", bg: "bg-amber-50", emoji: "🌿" },
  ];

  const marqueeItems = [...brands, ...brands, ...brands, ...brands];

  const renderBrandCards = () => (
    <>
      {marqueeItems.map((brand, i) => (
        <div 
          key={i} 
          className="shrink-0 group/card relative flex flex-row items-center justify-center gap-3 md:gap-4 px-6 py-3 md:px-8 md:py-4 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer"
        >
          {/* Hover background color */}
          <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${brand.bg} -z-10`}></div>
          
          <div className="flex items-center justify-center bg-white rounded-full p-2 shadow-sm group-hover/card:scale-110 transition-transform duration-500 ease-out border border-gray-50 relative z-10 text-xl">
            {brand.emoji}
          </div>
          
          <div className="flex flex-col relative z-10">
            <h3 className="font-sans font-bold text-sm md:text-base text-gray-800 group-hover/card:text-black transition-colors whitespace-nowrap">
              {brand.name}
            </h3>
            {brand.subtitle && (
              <p className={`text-[10px] font-medium ${brand.color} whitespace-nowrap`}>{brand.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <section className="bg-white py-12 md:py-16 border-t border-gray-200 overflow-hidden relative z-0">
      {/* Cheerful background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-[1200px] h-[300px] bg-gradient-to-r from-[#ffed4a]/30 via-[#ff7e67]/20 to-transparent blur-[80px] -z-10 rounded-full opacity-70"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="text-center mb-8 md:mb-12 relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <h2 className="text-2xl md:text-3xl font-serif text-black font-bold tracking-tight">
            Brands We've Represented
          </h2>
          <div className="hidden md:block w-12 h-[2px] bg-gray-200"></div>
          <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-orange-500">
            Growing Together
          </span>
        </div>
      </div>

      <div className="relative flex overflow-hidden group gap-4 md:gap-8 py-4">
        <div className="flex gap-4 md:gap-8 shrink-0 min-w-full justify-around animate-marquee group-hover:[animation-play-state:paused] px-4">
          {renderBrandCards()}
        </div>
        <div className="flex gap-4 md:gap-8 shrink-0 min-w-full justify-around animate-marquee group-hover:[animation-play-state:paused] px-4" aria-hidden="true">
          {renderBrandCards()}
        </div>
      </div>
    </section>
  );
}
