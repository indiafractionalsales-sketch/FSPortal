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

import { useState } from "react";
import { 
  Calendar, 
  BrainCircuit, 
  Trophy, 
  UserCircle, 
  Handshake, 
  TrendingUp,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";

type TabType = "msme" | "sales";

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<TabType>("msme");

  const msmeSteps = [
    {
      step: 1,
      title: "Post your event",
      description: "Share event details — location, dates, your product, target audience, and what you need represented.",
      Icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      gradient: "from-blue-100 to-transparent"
    },
    {
      step: 2,
      title: "Get matched",
      description: "We surface vetted sales partners in your target market. Review profiles, shortlist, and approve.",
      Icon: BrainCircuit,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      gradient: "from-indigo-100 to-transparent"
    },
    {
      step: 3,
      title: "They represent you",
      description: "Your partner attends, pitches, and closes on your behalf. You get reports and leads directly.",
      Icon: Trophy,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      gradient: "from-emerald-100 to-transparent"
    }
  ];

  const salesSteps = [
    {
      step: 1,
      title: "Create profile",
      description: "Highlight your sales experience, industry expertise, and regions you cover.",
      Icon: UserCircle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      gradient: "from-orange-100 to-transparent"
    },
    {
      step: 2,
      title: "Get matched",
      description: "Receive curated gig opportunities based on your skills and upcoming expos in your area.",
      Icon: Handshake,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      gradient: "from-red-100 to-transparent"
    },
    {
      step: 3,
      title: "Earn per gig",
      description: "Represent top brands, close deals, and earn competitive compensation without full-time commitment.",
      Icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      gradient: "from-green-100 to-transparent"
    }
  ];

  const currentSteps = activeTab === "msme" ? msmeSteps : salesSteps;
  
  const infoText = activeTab === "msme" 
    ? "No travel costs. No full-time hire. You pay only for the event represented — and only after approving your matched partner."
    : "Flexible hours. Focus entirely on pitching and closing at premium international expos with no micromanagement.";

  const buttonText = activeTab === "msme" ? "What info do I need to post?" : "View available gigs";

  return (
    <section className="bg-[#faf8f5] py-20 md:py-32 border-t border-gray-200 overflow-hidden relative">
      {/* Subtle Background Pattern/Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-gradient-to-b from-orange-100/40 via-red-100/20 to-transparent blur-3xl rounded-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10">
        
        {/* Toggle & Title */}
        <div className="flex flex-col items-center mb-20 md:mb-28">
          <div className="flex p-1.5 bg-white rounded-full border border-gray-200 shadow-sm mb-12 relative">
            <div 
              className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-[#701010] rounded-full transition-all duration-500 ease-out shadow-md ${activeTab === 'msme' ? 'left-1.5' : 'left-[calc(50%+4.5px)]'}`}
            ></div>
            <button 
              onClick={() => setActiveTab("msme")}
              className={`relative z-10 px-6 py-2.5 rounded-full font-sans font-bold text-sm tracking-wide transition-colors duration-300 w-40 sm:w-48 ${activeTab === 'msme' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              I'm a Business
            </button>
            <button 
              onClick={() => setActiveTab("sales")}
              className={`relative z-10 px-6 py-2.5 rounded-full font-sans font-bold text-sm tracking-wide transition-colors duration-300 w-40 sm:w-48 ${activeTab === 'msme' ? 'text-gray-600 hover:text-gray-900' : 'text-white'}`}
            >
              I'm a Sales Pro
            </button>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-black font-bold tracking-tight text-center max-w-3xl leading-tight">
            How {activeTab === "msme" ? "MSMEs get represented" : "Sales Pros land premium gigs"} <br className="hidden md:block"/> at global expos & events
          </h2>
        </div>

        {/* Alternating Timeline Layout for Desktop / Left-aligned for Mobile */}
        <div className="relative max-w-5xl mx-auto mb-20">
          
          {/* Central Glowing Line (Desktop) */}
          <div className="hidden md:block absolute top-10 bottom-10 left-1/2 w-1 bg-gradient-to-b from-gray-200 via-[#701010]/30 to-gray-200 -translate-x-1/2 rounded-full"></div>
          {/* Left Glowing Line (Mobile) */}
          <div className="md:hidden absolute top-10 bottom-10 left-[2.25rem] w-1 bg-gradient-to-b from-gray-200 via-[#701010]/30 to-gray-200 rounded-full"></div>

          <div className="flex flex-col gap-8 md:gap-16">
            {currentSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.step} className={`relative flex flex-col md:flex-row items-center justify-between w-full group ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Card Section */}
                  <div className={`w-full md:w-[45%] pl-24 md:pl-0 ${isEven ? 'md:pr-12 lg:pr-16 md:text-right' : 'md:pl-12 lg:pl-16 md:text-left'}`}>
                    <div className="relative p-6 md:p-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                      {/* Decorative Gradient Background */}
                      <div className={`absolute top-0 ${isEven ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} w-full h-full ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10`}></div>
                      
                      <span className={`text-xs font-black tracking-widest uppercase mb-3 block ${step.color}`}>
                        Step {step.step}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 font-sans text-base md:text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Section */}
                  <div className="absolute left-4 md:static md:w-[10%] flex justify-center relative z-10">
                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full bg-white shadow-xl border-4 ${step.border} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out`}>
                      <step.Icon className={`w-6 h-6 md:w-8 md:h-8 ${step.color}`} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Empty Spacer Section */}
                  <div className="hidden md:block w-[45%]"></div>
                  
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-[#f0ece1]/60 border border-[#e5dfd1] rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-center sm:text-left transition-colors duration-500 hover:bg-[#f0ece1]">
            <div className="flex-shrink-0 mt-1 p-3 bg-white rounded-full shadow-sm">
              <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-emerald-700" strokeWidth={2} />
            </div>
            <p className="text-gray-800 font-sans text-base md:text-lg leading-relaxed font-medium pt-1">
              {infoText}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button className="group flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 rounded-full font-sans font-bold text-base text-gray-800 shadow-sm hover:text-white hover:bg-[#701010] hover:border-[#701010] hover:shadow-lg transition-all duration-300">
            {buttonText}
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}
