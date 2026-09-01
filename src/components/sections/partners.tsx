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
  BookOpen, ChevronDown, ChevronUp, UserCheck, FileCheck, 
  ShieldCheck, Truck, Globe2, Building2, Megaphone, 
  Scale, PackageCheck, CreditCard, Sparkles, CheckCircle2
} from "lucide-react";

export function Partners() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeRole, setActiveRole] = useState<"exporter" | "importer">("exporter");

  // We need 15 cells total. Cell at index 7 (middle) will be the red square.
  const cells = Array.from({ length: 15 }, (_, i) => i);

  const exporterSteps = [
    {
      step: "01",
      title: "Expo Representation & Availability Announcement",
      desc: "Sales Partners announce upcoming attendance at global expos (e.g. 'Attending XYZ Expo in Germany/Italy — hire me to pitch your brand, display standees & collect leads on your behalf').",
      icon: Megaphone,
      bg: "bg-emerald-50/90 border-emerald-200/90",
      iconBg: "bg-emerald-100 text-emerald-700"
    },
    {
      step: "02",
      title: "Actionable Lead Capture",
      desc: "Sales Partners pitch on-ground at expos, collect verified B2B buyer requirements and RFQs in real time, and upload decision-maker leads directly to the portal.",
      icon: UserCheck,
      bg: "bg-slate-50 border-gray-200",
      iconBg: "bg-blue-100 text-blue-700"
    },
    {
      step: "03",
      title: "Market Entry & Compliance Guidance",
      desc: "When leads arrive from Germany, Italy, or other regional markets, get expert guidance on CE/FDA certifications, product labeling, regional tax, and legal compliance.",
      icon: Scale,
      bg: "bg-purple-50/90 border-purple-200/90",
      iconBg: "bg-purple-100 text-purple-700"
    },
    {
      step: "04",
      title: "Ecosystem & CHA Marketplace",
      desc: "Leverage vetted Custom House Agents (CHA), export agencies, freight forwarders, and translation partners to convert raw leads into actionable export deals.",
      icon: Building2,
      bg: "bg-amber-50/90 border-amber-200/90",
      iconBg: "bg-amber-100 text-amber-700"
    },
    {
      step: "05",
      title: "Contract Signing & Escrow Protection",
      desc: "Execute standardized digital trade agreements, lock in clear commission structures, and protect deal funds through secure milestone escrow payments.",
      icon: FileCheck,
      bg: "bg-teal-50/90 border-teal-200/90",
      iconBg: "bg-teal-100 text-teal-700"
    },
    {
      step: "06",
      title: "Deliver & Secure Payout",
      desc: "Complete shipment clearance, door-to-door buyer delivery tracking, and automated partner commission payout upon successful trade fulfillment.",
      icon: Truck,
      bg: "bg-sky-50/90 border-sky-200/90",
      iconBg: "bg-sky-100 text-sky-700"
    }
  ];

  const importerSteps = [
    {
      step: "01",
      title: "Register & Access Digital Front",
      desc: "Browse verified emerging market manufacturers, view audited factory profiles, and discover high-quality export-ready product lines.",
      icon: Globe2,
      bg: "bg-emerald-50/90 border-emerald-200/90",
      iconBg: "bg-emerald-100 text-emerald-700"
    },
    {
      step: "02",
      title: "Submit Verified Buyer RFQs",
      desc: "Post actionable product requirements, target specs, and volumetric needs directly to on-the-ground fractional sales partners.",
      icon: FileCheck,
      bg: "bg-slate-50 border-gray-200",
      iconBg: "bg-blue-100 text-blue-700"
    },
    {
      step: "03",
      title: "On-Ground Sample Verification",
      desc: "Inspect physical product samples, standees, and technical datasheets presented directly by local fractional representatives.",
      icon: PackageCheck,
      bg: "bg-purple-50/90 border-purple-200/90",
      iconBg: "bg-purple-100 text-purple-700"
    },
    {
      step: "04",
      title: "Customs & CHA Coordination",
      desc: "Streamline import duties, regional tariffs, and lab testing with certified Custom House Agents and international trade specialists.",
      icon: Scale,
      bg: "bg-amber-50/90 border-amber-200/90",
      iconBg: "bg-amber-100 text-amber-700"
    },
    {
      step: "05",
      title: "Protected Escrow Deal Execution",
      desc: "Sign formal trade terms with full payment held in secure escrow until goods pass pre-shipment quality inspection.",
      icon: ShieldCheck,
      bg: "bg-teal-50/90 border-teal-200/90",
      iconBg: "bg-teal-100 text-teal-700"
    },
    {
      step: "06",
      title: "Seamless Delivery & Fulfill",
      desc: "Receive doorstep container delivery with full documentation, bill of lading, and verified compliance certificate.",
      icon: Truck,
      bg: "bg-sky-50/90 border-sky-200/90",
      iconBg: "bg-sky-100 text-sky-700"
    }
  ];

  const currentSteps = activeRole === "exporter" ? exporterSteps : importerSteps;

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
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-sans font-bold tracking-wider text-[#701010] hover:text-[#500b0b] flex items-center gap-2 transition-colors cursor-pointer border border-[#701010]/30 hover:border-[#701010] px-4 py-2.5 rounded-md w-fit bg-white/80 shadow-2xs"
            >
              {isExpanded ? (
                <>
                  SHOW LESS <ChevronUp className="w-4 h-4 text-[#701010]" />
                </>
              ) : (
                <>
                  READ MORE <ChevronDown className="w-4 h-4 text-[#701010]" />
                </>
              )}
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

                // Custom Partner Images for grid spots 2 and 8
                if (index === 2) {
                  return (
                    <div key={index} className="aspect-square relative overflow-hidden group bg-gray-200">
                      <img 
                        src="/partners/partner-1.jpg" 
                        alt="Fractional Sales Partner"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  );
                }

                if (index === 8) {
                  return (
                    <div key={index} className="aspect-square relative overflow-hidden group bg-gray-200">
                      <img 
                        src="/partners/partner-2.jpg" 
                        alt="Fractional Sales Partner"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  );
                }

                // Randomize pravatar images to get a good mix of professionals
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

        {/* Collapsible End-to-End Trade Workflow Process Panel */}
        {isExpanded && (
          <div className="mt-16 pt-12 border-t border-gray-200/80 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header & Role Selector Tabs */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#701010] bg-rose-50 border border-rose-200/80 px-3 py-1 rounded-full mb-3 shadow-2xs">
                End-to-End Trade &amp; Sales Workflow
              </span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-3">
                How We Work
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-sans max-w-xl leading-relaxed">
                From on-ground expo lead generation to market entry compliance and CHA delivery — seamless cross-border commerce in 6 easy steps.
              </p>

              {/* Role Toggle Switch */}
              <div className="flex items-center justify-center gap-3 mt-6 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm">
                <button
                  onClick={() => setActiveRole("exporter")}
                  className={`px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    activeRole === "exporter"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 bg-transparent"
                  }`}
                >
                  Exporter / Manufacturer
                </button>
                <button
                  onClick={() => setActiveRole("importer")}
                  className={`px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    activeRole === "importer"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 bg-transparent"
                  }`}
                >
                  Importer / Buyer
                </button>
              </div>

              <p className="text-xs text-gray-500 italic mt-3">
                Trade with verified global partners in 6 easy steps
              </p>
            </div>

            {/* 6 Step Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSteps.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center relative overflow-hidden ${item.bg}`}
                  >
                    {/* Top Step Pill */}
                    <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-3 bg-white/70 px-2.5 py-0.5 rounded-full border border-gray-200/50">
                      STEP {item.step}
                    </span>

                    {/* Icon Badge */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm ${item.iconBg}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h4 className="font-serif font-bold text-base md:text-lg text-gray-900 mb-2 leading-snug">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Close Bar */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs font-sans font-bold tracking-wider text-gray-600 hover:text-[#701010] flex items-center gap-1.5 transition-colors cursor-pointer bg-white px-5 py-2 rounded-full border border-gray-300 shadow-xs"
              >
                CLOSE WORKFLOW DETAILS <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
