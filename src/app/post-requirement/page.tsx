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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Briefcase, ShieldCheck, CheckCircle2, ArrowRight, Building2, 
  MapPin, Calendar, Lock, Video, Camera, Sparkles, ChevronDown, 
  Users, Layers, Award, FileText, Globe2, Scan, HelpCircle, ArrowUpRight
} from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export default function PostRequirementPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col selection:bg-rose-100 selection:text-rose-900">
      {/* Global Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-white via-rose-50/30 to-[#fafafa] border-b border-rose-100/60 relative overflow-hidden">
        {/* Subtle background glow decorative elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-rose-200/20 via-amber-200/20 to-sky-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl text-center">
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-headline uppercase tracking-wider mb-6 shadow-2xs">
            <Briefcase className="w-3.5 h-3.5 text-rose-600" />
            <span>For Manufacturers, Traders &amp; Offshore Business Owners</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Post Your Business Requirement &amp; Hire Local <span className="text-[#701010] underline decoration-rose-300 decoration-wavy decoration-2">Sales Partners</span> Worldwide
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Expand into new global markets without opening expensive overseas offices. Post your trade show booth requirements, buyer verification tasks, or field audit needs in minutes.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => router.push("/login?role=obo&redirect=create-post")}
              className="w-full sm:w-auto px-8 py-4 bg-[#701010] hover:bg-[#5a0c0c] text-white font-headline font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Post Requirement Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-rose-200" />
            </button>
            <button
              onClick={() => router.push("/home")}
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-headline font-bold text-sm uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Active Sales Reps</span>
              <Globe2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Trust Highlights Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white border border-rose-100 p-4 rounded-xl shadow-2xs flex items-center gap-3">
              <span className="p-2 bg-rose-50 rounded-lg text-rose-600 shrink-0">
                <Lock className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">7-Day Escrow</p>
                <p className="text-[10px] text-gray-500">Payout held until audit completion</p>
              </div>
            </div>

            <div className="bg-white border border-emerald-100 p-4 rounded-xl shadow-2xs flex items-center gap-3">
              <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                <Video className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">Live Telemetry</p>
                <p className="text-[10px] text-gray-500">GPS check-in &amp; 2-hr live stream</p>
              </div>
            </div>

            <div className="bg-white border border-amber-100 p-4 rounded-xl shadow-2xs flex items-center gap-3">
              <span className="p-2 bg-amber-50 rounded-lg text-amber-600 shrink-0">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">Digital NDA</p>
                <p className="text-[10px] text-gray-500">Section 10A IT Act legal contract</p>
              </div>
            </div>

            <div className="bg-white border border-sky-100 p-4 rounded-xl shadow-2xs flex items-center gap-3">
              <span className="p-2 bg-sky-50 rounded-lg text-sky-600 shrink-0">
                <Scan className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">100% Lead Ownership</p>
                <p className="text-[10px] text-gray-500">Scanned cards belong to you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scope of Requirements Section */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full inline-block mb-3">
              Versatile Coverage
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              What Requirements Can You Post?
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-3">
              Sales Partners provide complete on-ground coverage across trade expos, B2B meetings, and field verification tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Requirement Card 1 */}
            <div className="bg-[#fff5f5]/60 border border-rose-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-rose-200 text-rose-600 flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                  Expo Booth Management &amp; Sales
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Deploy trained local Sales Partners to manage your stall at international trade fairs, pitch products to visitors, and capture verified buyer leads.
                </p>
                <ul className="space-y-2 text-xs text-gray-700 font-medium">
                  <li className="flex items-center gap-2 text-rose-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Full stall representation &amp; product pitch
                  </li>
                  <li className="flex items-center gap-2 text-rose-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Visiting card scanning via AI OCR
                  </li>
                  <li className="flex items-center gap-2 text-rose-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Mandatory 2-hr live video feed
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-rose-200/60">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  Popular for Expos <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Requirement Card 2 */}
            <div className="bg-[#f0fdf4]/60 border border-emerald-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                  On-Ground Buyer Verification
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Protect your business against fraud. Have local partners physically visit buyer offices or factories to verify business credentials and physical existence.
                </p>
                <ul className="space-y-2 text-xs text-gray-700 font-medium">
                  <li className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Physical office &amp; factory visit check
                  </li>
                  <li className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Geotagged photo &amp; video evidence
                  </li>
                  <li className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Business registration audit
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-200/60">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  Risk Mitigation <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Requirement Card 3 */}
            <div className="bg-[#fffbeb]/60 border border-amber-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 text-amber-600 flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                  Sample Handovers &amp; Quality Checks
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Need to deliver physical product samples or perform batch quality checks before shipping? Local Sales Partners handle physical handovers and inspections.
                </p>
                <ul className="space-y-2 text-xs text-gray-700 font-medium">
                  <li className="flex items-center gap-2 text-amber-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> In-person sample delivery to buyers
                  </li>
                  <li className="flex items-center gap-2 text-amber-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Pre-shipment batch condition checks
                  </li>
                  <li className="flex items-center gap-2 text-amber-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Immediate buyer feedback collection
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-200/60">
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                  Export Operations <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Step-by-step Execution Workflow) */}
      <section className="py-16 md:py-24 bg-[#f8fafc] border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-full inline-block mb-3">
              Simple 5-Step Process
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              How Business Requirement Posting Works
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-3">
              From requirement post to post-event audit settlement, every step is protected by smart escrow rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs relative z-10 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-headline font-bold text-xs flex items-center justify-center mb-4">
                  01
                </span>
                <h4 className="text-sm font-serif font-bold text-gray-900 mb-1.5">Post Requirement</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Specify event date, location, products, booth size, and desired partner qualifications.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs relative z-10 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-headline font-bold text-xs flex items-center justify-center mb-4">
                  02
                </span>
                <h4 className="text-sm font-serif font-bold text-gray-900 mb-1.5">Compare Quotes</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Receive tailored quotes from verified Sales Partners with Bronze, Silver &amp; Gold options.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs relative z-10 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-headline font-bold text-xs flex items-center justify-center mb-4">
                  03
                </span>
                <h4 className="text-sm font-serif font-bold text-gray-900 mb-1.5">Escrow &amp; NDA</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Deposit fee securely into escrow under a digital Section 10A IT Act agreement.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs relative z-10 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-headline font-bold text-xs flex items-center justify-center mb-4">
                  04
                </span>
                <h4 className="text-sm font-serif font-bold text-gray-900 mb-1.5">Live Telemetry</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Track GPS check-in, 2-hr live video streams, and real-time scanned business card leads.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs relative z-10 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-headline font-bold text-xs flex items-center justify-center mb-4">
                  05
                </span>
                <h4 className="text-sm font-serif font-bold text-gray-900 mb-1.5">7-Day Audit Payout</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Platform audits event compliance before disbursing representation fees to the partner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escrow Guarantee & Legal Security Section */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border border-rose-200/80 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200 text-rose-800 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Biztribe Escrow &amp; Audit Guarantee</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                  Zero Financial Risk for Business Owners
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6">
                  Your funds are protected in escrow. Payouts are withheld if a Sales Partner fails to arrive on time, misses the mandatory 2-hour live stream, fails to post 2-hour social updates, or misrepresents your brand.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-800 font-medium">
                  <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Mandatory GPS Check-In Audit
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Confidentiality &amp; NDA
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 12-Month Non-Compete Guarantee
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Transparent 25% Platform Fee
                  </div>
                </div>
              </div>

              <div className="bg-white border border-rose-200/90 rounded-2xl p-6 shadow-sm text-center">
                <Award className="w-10 h-10 text-[#701010] mx-auto mb-3" />
                <h4 className="text-base font-serif font-bold text-gray-900 mb-1">Ready to Hire a Rep?</h4>
                <p className="text-xs text-gray-500 mb-6">Create your business account and post your requirement in under 2 minutes.</p>
                <button
                  onClick={() => router.push("/login?role=obo&redirect=create-post")}
                  className="w-full py-3.5 bg-[#701010] hover:bg-[#5a0c0c] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Create Business Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Accordion) */}
      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full inline-block mb-3">
              Clear Answers
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">
              Frequently Asked Questions for Business Owners
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What happens if a Sales Partner fails to show up at the event venue?",
                a: "If the Sales Partner fails to check in via GPS at the designated venue on time, or fails to complete the mandatory 2-hour live stream, representation funds are immediately frozen, withheld, and refunded to your account per Clause 3 of the Service Agreement."
              },
              {
                q: "Who legally owns the attendee contact leads captured at the booth?",
                a: "100% of all attendee contact cards, scanned visiting cards, inquiry forms, and lead data generated during the event belong exclusively to your business and Biztribe Trading & Consultancy. Sales Partners are legally barred from harvesting or using your leads under strict non-disclosure terms."
              },
              {
                q: "How are commuting and travel charges handled?",
                a: "Commuting and travel charges are classified under total representation charges quoted in the package. They are subject to platform escrow rules, audit verification, and the standard 7-day post-event settlement schedule."
              },
              {
                q: "Do I need a physical registered office in the country where the expo takes place?",
                a: "No! That is the core power of Fractional Sales Partner. Verified local Sales Partners act as your on-the-ground fractional sales force, providing local presence without the overhead of establishing offshore offices."
              },
              {
                q: "What legal protection governs the requirement posting?",
                a: "Every transaction is executed under an advocate-drafted digital agreement compliant with Section 10A of the Information Technology Act 2000, Indian Contract Act 1872, Copyright Act 1957, and International Intellectual Property Laws."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm text-gray-900 hover:text-[#701010] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${openFaq === index ? "rotate-180 text-[#701010]" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
