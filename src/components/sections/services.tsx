"use client";


/**
 * Copyright (c) 2026 Biztribe Trading & Consultancy India Private Limited.
 * All rights reserved.
 *
 * This file is part of the Fractional Sales Partner platform.
 * CONFIDENTIAL AND PROPRIETARY — Unauthorised copying, redistribution,
 * modification, or use of this file, via any medium, is strictly prohibited.
 * Violation will result in civil and criminal prosecution under the
 * Copyright Act 1957, Information Technology Act 2000, and applicable
 * Indian and international intellectual property laws.
 */

import { ArrowUpRight, Briefcase, Scale, Printer } from "lucide-react";

export function Services() {
  const services = [
    {
      id: "bd",
      title: "Business Development",
      description: "Partner with elite agencies to scale your outreach, localize your value proposition, and navigate complex international markets with absolute confidence.",
      tags: ["Market Entry", "Outreach", "Localization"],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
      Icon: Briefcase
    },
    {
      id: "legal",
      title: "Legal Frameworks",
      description: "Secure your global partnerships with ironclad Memorandums of Understanding (MoUs) drafted by top-tier legal professionals specializing in cross-border trade.",
      tags: ["MoUs", "Compliance", "Contracts"],
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
      Icon: Scale
    },
    {
      id: "print",
      title: "Brand & Print Services",
      description: "Make a lasting impression at global expos with premium printed materials, high-impact standees, and curated corporate goodies.",
      tags: ["Standees", "Expos", "Merchandise"],
      image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=800&auto=format&fit=crop",
      Icon: Printer
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-t border-black">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-black font-bold mb-6 tracking-tighter leading-none">
            The Ecosystem.
          </h2>
          <p className="text-gray-600 font-sans max-w-2xl text-lg md:text-xl leading-relaxed">
            Everything you need to execute global partnerships, supplied by vetted external experts integrated seamlessly into our platform.
          </p>
        </div>

        {/* The Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-black">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="group border-r border-b border-black flex flex-col hover:bg-[#faf8f5] transition-colors duration-500 cursor-pointer overflow-hidden"
            >
              {/* Visual Hook Image */}
              <div className="relative h-48 md:h-64 border-b border-black overflow-hidden bg-gray-100">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute top-4 left-4 z-20 bg-black text-white text-[10px] uppercase tracking-widest px-3 py-1 font-bold">
                  Certified Partner
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6 text-red-600">
                    <service.Icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 leading-tight tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 font-sans leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-12">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-[10px] md:text-xs font-sans font-bold text-black uppercase tracking-widest border border-black/20 px-3 py-1 group-hover:border-black/40 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 font-sans font-bold text-sm tracking-widest uppercase text-black transition-colors w-fit group-hover:text-red-600">
                  Connect with Partners
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
