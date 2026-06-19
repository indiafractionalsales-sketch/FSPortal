"use client";

import { BookOpen } from "lucide-react";

export function Partners() {
  // We need 15 cells total. Cell at index 7 (middle) will be the red square.
  const cells = Array.from({ length: 15 }, (_, i) => i);

  return (
    <section className="bg-[#faf8f5] py-16 md:py-24 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-4 flex flex-col justify-center pt-4">
            <h2 className="text-4xl md:text-5xl font-serif text-[#701010] mb-6 leading-[1.1] tracking-tight">
              How We Choose the<br />Fractional Partners
            </h2>
            
            <div className="flex gap-2 mb-6">
              <span className="text-[10px] md:text-xs font-sans text-gray-600 border border-gray-300 px-3 py-1 uppercase tracking-wide bg-white/50">
                Top Performers
              </span>
              <span className="text-[10px] md:text-xs font-sans text-gray-600 border border-gray-300 px-3 py-1 uppercase tracking-wide bg-white/50">
                Global
              </span>
            </div>
            
            <p className="text-gray-800 text-sm md:text-base font-sans mb-6 leading-relaxed">
              See how we select our elite list of fractional sales leaders helping MSMEs from emerging markets reach their full potential and close deals internationally.
            </p>
            
            <p className="text-xs font-bold font-sans text-gray-900 mb-8">
              by Founder's Office
            </p>
            
            <button className="text-xs font-sans font-medium tracking-wide text-gray-600 flex items-center gap-2 hover:text-[#701010] transition-colors">
              READ MORE <BookOpen className="w-4 h-4 text-[#701010]" />
            </button>
          </div>

          {/* Right Column: Image Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-1.5">
              {cells.map((index) => {
                // Middle cell
                if (index === 7) {
                  return (
                    <div 
                      key="center-square" 
                      className="aspect-square bg-[#ff0000] flex items-center justify-center p-2 text-center shadow-inner"
                    >
                      <span className="text-white font-sans font-bold text-xs md:text-sm lg:text-base tracking-widest uppercase leading-tight">
                        Partners<br />2026
                      </span>
                    </div>
                  );
                }

                // Randomize pravatar images to get a good mix of professionals
                // Pravatar IDs: 11, 12, 14, 15, 31, 32, 33, 44, 47, 50, 51, 57, 59, 60, 68
                const avatarIds = [11, 12, 14, 15, 31, 32, 33, 44, 47, 50, 51, 57, 59, 60, 68];
                const avatarId = avatarIds[index % avatarIds.length];

                return (
                  <div key={index} className="aspect-square relative overflow-hidden group bg-gray-200">
                    <img 
                      src={`https://i.pravatar.cc/300?img=${avatarId}`} 
                      alt={`Partner ${index}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
