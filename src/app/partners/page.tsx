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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, Scale, Calculator, Truck, FileCheck, 
  Megaphone, ShieldCheck, CheckCircle2, ArrowRight, 
  Sparkles, Globe2, ChevronRight, UserPlus, HelpCircle, FileText
} from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export default function PartnersHelpPage() {
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    {
      id: "biz-dev-marketing",
      title: "Biz Dev & Marketing Agencies",
      tagline: "Market entry strategy, localized lead gen & exhibition collateral",
      icon: Megaphone,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      themeBg: "bg-emerald-50/70 border-emerald-200/80",
      accentColor: "#059669",
      overview: "Expand into high-growth international markets with on-the-ground marketing agencies and business development strategists. From exhibition booth standees to localized B2B pitch decks, our partner agencies ensure your brand resonates in foreign territories.",
      keyServices: [
        "On-ground exhibition booth design, roll-up standees & sample displays",
        "Localized B2B sales collateral & multi-lingual pitch decks",
        "Targeted digital lead generation & cold outreach campaigns",
        "Regional PR, trade magazine features & brand authority building",
        "Pre-event buyer matchmaking & appointment scheduling"
      ],
      collaborationModel: "Sales Partners collaborating with marketing agencies order physical sample kits and standees directly delivered to expo venues in Germany, Italy, UK, USA, or Australia before buyer meetings commence.",
      faqs: [
        {
          q: "How do marketing agencies assist Fractional Sales Partners at expos?",
          a: "Agencies prepare localized brochures, arrange roll-up standees at booth locations, and run targeted pre-event LinkedIn/email outreach to invite verified B2B buyers to the Sales Partner's booth."
        },
        {
          q: "Can manufacturers hire agencies for market entry reports?",
          a: "Yes! Manufacturers can commission country-specific market entry feasibility studies and competitor price benchmarking reports prior to allocating sales budgets."
        }
      ]
    },
    {
      id: "legal-regulatory",
      title: "Legal & Regulatory Services",
      tagline: "Cross-border contracts, IP protection, CE/FDA compliance & incorporation",
      icon: Scale,
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      themeBg: "bg-indigo-50/70 border-indigo-200/80",
      accentColor: "#4f46e5",
      overview: "Mitigate legal and regulatory risks when entering international jurisdictions. Certified international trade attorneys and compliance specialists guide manufacturers and sales reps through binding representation agreements, non-circumvention protections, and regulatory product approvals.",
      keyServices: [
        "Standardized Fractional Sales Partner Representation Agreements",
        "Non-Circumvention & Non-Disclosure Agreements (NCNDAs)",
        "Product compliance certification (CE mark, FDA, UKCA, ISO approvals)",
        "International trademark registration & IP protection",
        "Offshore entity incorporation & joint venture structuring"
      ],
      collaborationModel: "Before executing high-value overseas orders, exporters and sales partners utilize standardized platform legal templates or retain specialized trade lawyers to audit contract terms.",
      faqs: [
        {
          q: "What protects manufacturers from direct buyer circumvention?",
          a: "All platform interactions are backed by enforceable NCNDA clauses and digital trade contracts that restrict direct buyer bypass during and post-representation."
        },
        {
          q: "How is product compliance handled for EU/US markets?",
          a: "Legal & regulatory partners review lab test reports, CE marking requirements, and country-specific labeling laws to prevent customs impoundment."
        }
      ]
    },
    {
      id: "accounting-tax",
      title: "Accounting, Audit & Tax",
      tagline: "Global tax compliance, VAT/GST registration, transfer pricing & escrow audit",
      icon: Calculator,
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      themeBg: "bg-amber-50/70 border-amber-200/80",
      accentColor: "#d97706",
      overview: "Manage multi-currency export revenue, foreign tax compliance, and cross-border invoicing without friction. Certified chartered accountants and global tax advisors handle VAT/GST registration, Double Taxation Avoidance Agreement (DTAA) filings, and escrow audit verification.",
      keyServices: [
        "Cross-border VAT/GST registration & filing (UK, EU, USA sales tax)",
        "Double Taxation Avoidance Agreement (DTAA) tax optimization",
        "Export incentive audit, RoDTEP & duty drawback accounting",
        "Foreign currency remittance compliance & FEMA advisory",
        "Escrow payment audit & automated commission settlement verification"
      ],
      collaborationModel: "Tax advisors assist exporters in structuring invoicing to avoid double taxation on overseas commission payouts while maintaining compliant export ledger accounting.",
      faqs: [
        {
          q: "Do I need VAT registration to sell products in the European Union?",
          a: "If goods are warehoused or delivered within the EU, VAT registration or One Stop Shop (OSS) filing is mandatory. Tax partners streamline this registration."
        },
        {
          q: "How are currency conversions and payout taxes handled?",
          a: "Platform transactions process through compliant escrow gateways with automated tax withholding calculations based on DTAA provisions."
        }
      ]
    },
    {
      id: "logistics-freight",
      title: "Logistics & Freight Forwarding",
      tagline: "Air & ocean cargo forwarding, sample express dispatch & warehousing",
      icon: Truck,
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
      themeBg: "bg-sky-50/70 border-sky-200/80",
      accentColor: "#0284c7",
      overview: "Move physical goods smoothly across international borders. Global freight forwarders and logistics providers handle express sample shipments for expo displays as well as FCL/LCL ocean container shipping for bulk buyer orders.",
      keyServices: [
        "Express international courier for sample boxes & booth standees",
        "FCL (Full Container Load) & LCL (Less than Container Load) sea freight",
        "Air cargo chartering & door-to-door express freight",
        "Overseas warehousing & fulfillment centers (UK, EU, USA)",
        "Cargo transit insurance & real-time GPS container tracking"
      ],
      collaborationModel: "Sales Partners coordinate express sample delivery directly to trade show venues, while freight forwarders handle door-to-door container delivery to overseas buyer warehouses post-contract.",
      faqs: [
        {
          q: "How quickly can exhibition samples be delivered overseas?",
          a: "Express air cargo forwarders deliver sample boxes to European or UK expo centers within 3-5 business days with door-to-booth tracking."
        },
        {
          q: "Is cargo transit insurance included?",
          a: "All freight bookings through platform ecosystem partners include optional comprehensive door-to-door marine transit insurance."
        }
      ]
    },
    {
      id: "custom-house-agents",
      title: "Custom House Agents (CHAs)",
      tagline: "Customs clearance, Bill of Entry, tariff classification (HS Code) & port release",
      icon: FileCheck,
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      themeBg: "bg-rose-50/70 border-rose-200/80",
      accentColor: "#e11d48",
      overview: "Prevent port delays, unexpected tariffs, and customs holds. Certified Custom House Agents (CHAs) manage complete import/export customs clearance, tariff classification (HS Codes), Bill of Entry documentation, and port authority clearances.",
      keyServices: [
        "Export customs clearance at origin ports & airports",
        "Import customs clearance, duty assessment & Bill of Entry filing",
        "Harmonized System (HS) Code product classification & tariff audit",
        "Port trust clearance, container de-stuffing & demurrage prevention",
        "Duty drawback claim processing & EPCG license compliance"
      ],
      collaborationModel: "CHAs work directly with exporters to verify shipping documents (Invoice, Packing List, Certificate of Origin, Bill of Lading) prior to vessel departure, ensuring zero customs detention.",
      faqs: [
        {
          q: "Why is correct HS Code classification critical?",
          a: "Incorrect HS Codes lead to customs penalties, miscalculated import duties, or clearance delays. CHAs audit HS codes before shipment."
        },
        {
          q: "Can CHAs handle temporary sample imports for expos?",
          a: "Yes! CHAs process ATA Carnet documentation for duty-free temporary import of exhibition samples and standees."
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Top Hero Banner */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white pt-28 pb-16 md:pt-36 md:pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-widest text-amber-300 bg-amber-950/60 border border-amber-400/30 px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Ecosystem Partners Directory
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6 leading-tight">
            Cross-Border Trade &amp;<br className="hidden md:inline" /> Partner Ecosystem Services
          </h1>
          <p className="text-slate-300 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed font-sans font-normal">
            Everything your business needs to scale internationally — from Custom House Agents (CHAs) and freight forwarders to legal counsel, tax advisors, and on-ground marketing agencies.
          </p>

          {/* Quick Category Navigation Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="text-xs font-headline uppercase tracking-wider font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-2xs"
              >
                <span>{cat.title}</span>
                <ChevronRight className="w-3 h-3 text-amber-300" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Cards & Process Breakdown */}
      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl space-y-16">

          {categories.map((cat, index) => {
            const IconComp = cat.icon;
            return (
              <div
                key={cat.id}
                id={cat.id}
                className={`scroll-mt-24 p-6 md:p-10 rounded-3xl border ${cat.themeBg} transition-all duration-300 shadow-sm hover:shadow-md`}
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-900 flex-shrink-0">
                      <IconComp className="w-7 h-7" style={{ color: cat.accentColor }} />
                    </div>
                    <div>
                      <span className={`text-[10px] font-headline font-bold uppercase tracking-widest border px-2.5 py-0.5 rounded-md ${cat.badgeColor}`}>
                        Category 0{index + 1}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-1 tracking-tight">
                        {cat.title}
                      </h2>
                    </div>
                  </div>

                  <Link
                    href="/onboarding?role=tpsp"
                    className="inline-flex items-center gap-2 text-xs font-headline uppercase tracking-wider font-bold text-white bg-[#701010] hover:bg-[#580c0c] px-4 py-2.5 rounded-xl transition-all shadow-xs w-fit"
                  >
                    <span>Register as Partner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Body Content: Overview & Services */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
                  
                  {/* Left Column: Description & Collaboration */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Scope &amp; Role</h3>
                      <p className="text-gray-800 text-sm md:text-base leading-relaxed font-sans">
                        {cat.overview}
                      </p>
                    </div>

                    <div className="bg-white/90 p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#701010] mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#701010]" /> Collaboration Model
                      </h4>
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans">
                        {cat.collaborationModel}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Key Deliverables List */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b pb-3 flex items-center justify-between">
                      <span>Key Services &amp; Deliverables</span>
                      <FileText className="w-4 h-4 text-gray-400" />
                    </h3>
                    <ul className="space-y-3">
                      {cat.keyServices.map((svc, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-700 leading-snug">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                          <span>{svc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Accordion / FAQ Section for this category */}
                <div className="mt-8 pt-6 border-t border-gray-200/70">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-4 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-gray-500" /> Frequently Asked Questions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.faqs.map((faq, fIdx) => (
                      <div key={fIdx} className="bg-white/80 p-4 rounded-xl border border-gray-200/80">
                        <p className="text-xs md:text-sm font-bold text-gray-900 mb-1.5">Q: {faq.q}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">A: {faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* Call to Action for Ecosystem Partners */}
      <section className="bg-gradient-to-r from-[#701010] to-[#500b0b] text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="container mx-auto max-w-3xl relative z-10">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-rose-200 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full mb-4 inline-block">
            Join the Ecosystem
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 tracking-tight">
            Are You a Custom House Agent, Attorney, Freight Forwarder, or Agency?
          </h2>
          <p className="text-rose-100/90 text-sm md:text-base mb-8 leading-relaxed font-sans">
            Connect with active manufacturers, exporters, and fractional sales partners worldwide. List your services on the Fractional Sales Partner Marketplace today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding?role=tpsp"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-[#701010] bg-white hover:bg-gray-100 px-6 py-3.5 rounded-xl transition-all shadow-md font-headline uppercase tracking-wider"
            >
              <UserPlus className="w-4 h-4" /> Register as Ecosystem Partner
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-white border border-white/40 hover:border-white px-6 py-3.5 rounded-xl transition-all font-headline uppercase tracking-wider"
            >
              Partner Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
