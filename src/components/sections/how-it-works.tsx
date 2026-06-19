"use client";

import { useState } from "react";
import { 
  Calendar, 
  BrainCircuit, 
  Trophy, 
  UserCircle, 
  Handshake, 
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Store,
  Briefcase
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
      bg: "bg-blue-100",
      border: "border-blue-200"
    },
    {
      step: 2,
      title: "Get matched",
      description: "We surface vetted sales partners in your target market. Review profiles, shortlist, and approve.",
      Icon: BrainCircuit,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      border: "border-indigo-200"
    },
    {
      step: 3,
      title: "They represent you",
      description: "Your partner attends, pitches, and closes on your behalf. You get reports and leads directly.",
      Icon: Trophy,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "border-emerald-200"
    }
  ];

  const salesSteps = [
    {
      step: 1,
      title: "Create profile",
      description: "Highlight your sales experience, industry expertise, and regions you cover.",
      Icon: UserCircle,
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-200"
    },
    {
      step: 2,
      title: "Get matched",
      description: "Receive curated gig opportunities based on your skills and upcoming expos in your area.",
      Icon: Handshake,
      color: "text-red-600",
      bg: "bg-red-100",
      border: "border-red-200"
    },
    {
      step: 3,
      title: "Earn per gig",
      description: "Represent top brands, close deals, and earn competitive compensation without full-time commitment.",
      Icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-200"
    }
  ];

  const currentSteps = activeTab === "msme" ? msmeSteps : salesSteps;
  
  const infoText = activeTab === "msme" 
    ? "No travel costs. No full-time hire. You pay only for the event represented — and only after approving your matched partner."
    : "Flexible hours. Focus entirely on pitching and closing at premium international expos with no micromanagement.";

  const buttonText = activeTab === "msme" ? "What info do I need to post?" : "View available gigs";

  return (
    <section className="bg-[#faf8f5] py-16 md:py-24 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-serif text-black font-bold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-gray-600 font-sans text-lg max-w-2xl mx-auto">
            Choose your path to see how we connect brands with elite sales representation at global expos.
          </p>
        </div>

        {/* Visual Image Toggle */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-12 md:mb-16 max-w-4xl mx-auto">
          {/* MSME Button */}
          <button 
            onClick={() => setActiveTab('msme')}
            className={`relative flex-1 rounded-3xl overflow-hidden h-40 md:h-48 border-4 transition-all duration-500 group ${
              activeTab === 'msme' 
                ? 'border-[#701010] shadow-2xl scale-[1.02]' 
                : 'border-transparent opacity-70 hover:opacity-100 grayscale hover:grayscale-0'
            }`}
          >
            <img 
              src="https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=800&auto=format&fit=crop" 
              alt="Bustling exhibition and expo" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className={`absolute inset-0 transition-colors duration-500 ${activeTab === 'msme' ? 'bg-[#701010]/60' : 'bg-black/60'}`}></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
              <Store className={`w-8 h-8 mb-3 transition-transform duration-500 ${activeTab === 'msme' ? 'scale-110' : ''}`} />
              <span className="font-serif text-xl md:text-2xl font-bold tracking-wide">For Businesses & MSMEs</span>
              <span className="font-sans text-xs md:text-sm font-medium opacity-90 mt-2 uppercase tracking-widest">I need representation</span>
            </div>
            
            {/* Active Indicator Arrow */}
            <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#faf8f5] rotate-45 transition-transform duration-500 ${activeTab === 'msme' ? 'translate-y-0' : 'translate-y-12'}`}></div>
          </button>

          {/* Sales Pro Button */}
          <button 
            onClick={() => setActiveTab('sales')}
            className={`relative flex-1 rounded-3xl overflow-hidden h-40 md:h-48 border-4 transition-all duration-500 group ${
              activeTab === 'sales' 
                ? 'border-[#701010] shadow-2xl scale-[1.02]' 
                : 'border-transparent opacity-70 hover:opacity-100 grayscale hover:grayscale-0'
            }`}
          >
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" 
              alt="Confident sales professional" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className={`absolute inset-0 transition-colors duration-500 ${activeTab === 'sales' ? 'bg-[#701010]/60' : 'bg-black/60'}`}></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
              <Briefcase className={`w-8 h-8 mb-3 transition-transform duration-500 ${activeTab === 'sales' ? 'scale-110' : ''}`} />
              <span className="font-serif text-xl md:text-2xl font-bold tracking-wide">For Sales Professionals</span>
              <span className="font-sans text-xs md:text-sm font-medium opacity-90 mt-2 uppercase tracking-widest">I want to represent</span>
            </div>
            
            {/* Active Indicator Arrow */}
            <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#faf8f5] rotate-45 transition-transform duration-500 ${activeTab === 'sales' ? 'translate-y-0' : 'translate-y-12'}`}></div>
          </button>
        </div>

        {/* Dynamic Title based on selection */}
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-serif text-black font-bold">
            {activeTab === "msme" ? "How you get represented at global expos" : "How you land premium gigs"}
          </h3>
        </div>

        {/* Steps Grid - Ultra Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 relative mb-12">
          
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0"></div>

          {currentSteps.map((step) => (
            <div key={step.step} className="relative z-10 flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-5 bg-white md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none border border-gray-100 md:border-transparent shadow-sm md:shadow-none transition-transform hover:-translate-y-1">
              
              {/* Compact Icon */}
              <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full bg-white shadow-sm border-2 ${step.border} flex items-center justify-center relative group`}>
                <step.Icon className={`w-6 h-6 md:w-7 md:h-7 ${step.color}`} strokeWidth={2} />
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${step.bg} flex items-center justify-center text-[10px] font-bold ${step.color} border border-white shadow-sm`}>
                  {step.step}
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 md:text-center pt-1 md:pt-0">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-600 font-sans text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Info Box & CTA - Merged into a sleek, space-saving bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-start md:items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 md:mt-0" />
            <p className="text-gray-700 font-sans text-sm font-medium">
              {infoText}
            </p>
          </div>
          <button className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-[#701010] border border-transparent text-white rounded-full font-sans font-bold text-sm hover:bg-[#5a0c0c] hover:shadow-md transition-all duration-300 w-full md:w-auto justify-center group">
            {buttonText}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
