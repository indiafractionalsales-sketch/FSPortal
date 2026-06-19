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
    <section className="bg-[#faf8f5] py-12 md:py-16 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Toggle & Title - Compact Inline on Desktop */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-black font-bold tracking-tight text-center md:text-left">
            How {activeTab === "msme" ? "MSMEs get represented" : "Sales Pros land gigs"}
          </h2>
          
          <div className="flex p-1 bg-white rounded-full border border-gray-200 shadow-sm relative shrink-0">
            <div 
              className={`absolute inset-y-1 w-[calc(50%-4px)] bg-[#701010] rounded-full transition-all duration-300 ease-out shadow-sm ${activeTab === 'msme' ? 'left-1' : 'left-[calc(50%+2px)]'}`}
            ></div>
            <button 
              onClick={() => setActiveTab("msme")}
              className={`relative z-10 px-5 py-2 rounded-full font-sans font-bold text-sm tracking-wide transition-colors duration-300 w-36 ${activeTab === 'msme' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Business
            </button>
            <button 
              onClick={() => setActiveTab("sales")}
              className={`relative z-10 px-5 py-2 rounded-full font-sans font-bold text-sm tracking-wide transition-colors duration-300 w-36 ${activeTab === 'msme' ? 'text-gray-600 hover:text-gray-900' : 'text-white'}`}
            >
              Sales Pro
            </button>
          </div>
        </div>

        {/* Steps Grid - Ultra Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 relative mb-10 md:mb-12">
          
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0"></div>

          {currentSteps.map((step, index) => (
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-start md:items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 md:mt-0" />
            <p className="text-gray-700 font-sans text-sm font-medium">
              {infoText}
            </p>
          </div>
          <button className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-800 rounded-full font-sans font-bold text-sm hover:text-white hover:bg-[#701010] hover:border-[#701010] hover:shadow-md transition-all duration-300 w-full md:w-auto justify-center group">
            {buttonText}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
