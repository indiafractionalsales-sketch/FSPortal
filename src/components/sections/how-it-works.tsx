"use client";

import { useState } from "react";
import { 
  Calendar, 
  BrainCircuit, 
  Trophy, 
  UserCircle, 
  Handshake, 
  TrendingUp,
  ArrowRight,
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
    <section className="bg-[#faf8f5] py-20 md:py-32 border-t border-gray-200 overflow-hidden relative">
      {/* Subtle Background Pattern/Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-white/40 blur-3xl rounded-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1200px] relative z-10">
        
        {/* Toggle & Title */}
        <div className="flex flex-col items-center mb-16 md:mb-20">
          <div className="flex p-1.5 bg-white rounded-full border border-gray-200 shadow-sm mb-10 relative">
            <div 
              className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-[#701010] rounded-full transition-all duration-300 ease-out shadow-sm ${activeTab === 'msme' ? 'left-1.5' : 'left-[calc(50%+4.5px)]'}`}
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

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-black font-bold tracking-tight text-center max-w-2xl leading-tight">
            How {activeTab === "msme" ? "MSMEs get represented" : "Sales Pros land premium gigs"} <br className="hidden md:block"/> at global expos & events
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 lg:gap-4 xl:gap-8 mb-12">
          {currentSteps.map((step, index) => (
            <div key={step.step} className="flex flex-col lg:flex-row items-center flex-1 w-full max-w-md lg:max-w-none">
              <div className={`flex-1 flex flex-col items-center text-center p-8 md:p-10 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative group w-full h-full`}>
                
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 shadow-inner border ${step.bg} ${step.border}`}>
                  <step.Icon className={`w-8 h-8 ${step.color}`} strokeWidth={1.5} />
                </div>

                {/* Text Content */}
                <span className={`text-xs font-black tracking-widest uppercase mb-4 ${step.color}`}>
                  Step {step.step}
                </span>
                
                <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 font-sans text-sm md:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow Connector (Hidden on Mobile, shown on Desktop between cards) */}
              {index < currentSteps.length - 1 && (
                <div className="hidden lg:flex flex-col justify-center px-2 xl:px-4 text-gray-300">
                  <ArrowRight className="w-8 h-8" strokeWidth={1} />
                </div>
              )}
              {/* Arrow Connector (Mobile - points down) */}
              {index < currentSteps.length - 1 && (
                <div className="flex lg:hidden justify-center py-4 text-gray-300">
                  <ArrowRight className="w-6 h-6 rotate-90" strokeWidth={1.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="bg-[#f0ece1]/50 border border-[#e5dfd1] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left transition-colors duration-500 hover:bg-[#f0ece1]/80">
            <div className="flex-shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6 text-emerald-700" strokeWidth={2} />
            </div>
            <p className="text-gray-800 font-sans text-sm md:text-base leading-relaxed font-medium">
              {infoText}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button className="group flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-full font-sans font-bold text-sm text-gray-800 hover:text-[#701010] hover:border-[#701010]/30 hover:shadow-md transition-all duration-300">
            {buttonText}
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
