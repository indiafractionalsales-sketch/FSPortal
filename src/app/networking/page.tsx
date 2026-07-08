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

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, LogOut, ChevronLeft, ChevronRight, ArrowLeft, Loader2, Sparkles, Send, Download
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getDocument } from "@/lib/firestore-rest";
import Navbar from "@/components/Navbar";

interface Message {
  role: 'user' | 'assistant';
  text: string;
  leads?: any[];
}

export default function AIPoweredNetworkingPage() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<"obo" | "sp" | "tpsp" | "">("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hello! I am your AI Networking Assistant. Ask me anything about your contacts, leads, or past connections. (e.g. *'Who is based in London?'* or *'Who can build mobile apps?'*)"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Left Sidebar profile data
  const [spData, setSpData] = useState({ fullName: "", profilePhoto: "" });
  const [oboData, setOboData] = useState({ brandName: "", logo: "" });
  const [tpspData, setTpspData] = useState({ companyName: "", logo: "" });

  // Carousel data
  const marketingAgencies = [
    { name: "Global Growth Media", location: "London, UK", desc: "Expert B2B SaaS growth & performance marketing for international scale.", tag: "SaaS & Tech", website: "globalgrowth.io", bg: "bg-gradient-to-br from-indigo-500 to-purple-600" },
    { name: "Pacific Brand Architects", location: "Singapore", desc: "Premium brand localization and entry strategy for Southeast Asia.", tag: "Consumer Brands", website: "pacificarchitects.sg", bg: "bg-gradient-to-br from-orange-400 to-red-500" },
    { name: "EuroLaunch Partners", location: "Munich, Germany", desc: "European go-to-market strategies, PR, and local compliance.", tag: "Enterprise PR", website: "eurolaunch.de", bg: "bg-gradient-to-br from-blue-500 to-cyan-600" }
  ];

  const bizDevAgencies = [
    { name: "Vanguard Sales Group", location: "New York, USA", desc: "Outsourced enterprise sales teams, lead generation, and local rep hire.", tag: "Enterprise Sales", website: "vanguardsales.com", bg: "bg-gradient-to-br from-emerald-500 to-teal-600" },
    { name: "Asiapoint Business Solutions", location: "Tokyo, Japan", desc: "B2B client acquisition, matchmaking, and local channel management.", tag: "Channel Partners", website: "asiapoint.jp", bg: "bg-gradient-to-br from-amber-500 to-orange-600" },
    { name: "Aria Outreach Associates", location: "Dubai, UAE", desc: "Direct sales outreach and corporate relationships in MEA region.", tag: "Direct Outreach", website: "ariaoutreach.ae", bg: "bg-gradient-to-br from-fuchsia-500 to-pink-600" }
  ];

  const [activeMarketingIndex, setActiveMarketingIndex] = useState(0);
  const [activeBizDevIndex, setActiveBizDevIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Authenticate user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Load profile identity
  useEffect(() => {
    if (!user) return;
    const fetchProfiles = async () => {
      try {
        const idToken = await user.getIdToken();
        const userData = await getDocument("users", user.uid, idToken, "default");
        if (userData?.role) {
          const dbId = (userData.databaseId as string) || "default";
          setUserType(userData.role as "obo" | "sp" | "tpsp");
          if (userData.role === "obo") {
            const data = await getDocument("OBO_Profile", user.uid, idToken, dbId);
            if (data) setOboData({ brandName: (data.brandName as string) || "", logo: (data.logo as string) || "" });
          } else if (userData.role === "sp") {
            const data = await getDocument("SP_Profile", user.uid, idToken, dbId);
            if (data) setSpData({ fullName: (data.fullName as string) || "", profilePhoto: (data.profilePhoto as string) || "" });
          } else if (userData.role === "tpsp") {
            const data = await getDocument("TPSP_Profile", user.uid, idToken, dbId);
            if (data) setTpspData({ companyName: (data.companyName as string) || "", logo: (data.logo as string) || "" });
          }
        }
      } catch (err) {
        console.error("Error loading basic profile metadata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSearching]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim() || isSearching) return;
    setIsSearching(true);
    setInputVal("");

    const newMessages: Message[] = [...messages, { role: 'user', text: queryText }];
    setMessages(newMessages);

    try {
      const idToken = await user?.getIdToken();
      const response = await fetch('/api/leads/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ queryText })
      });

      const data = await response.json();
      console.log('[AI Networking Debug]', data._debug);
      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', text: `⚠️ **Error:** ${data.error}` }]);
      } else {
        setMessages([...newMessages, {
          role: 'assistant',
          text: data.report,
          leads: data.leads
        }]);
      }
    } catch (err) {
      console.error("Query request failed:", err);
      setMessages([...newMessages, { role: 'assistant', text: "❌ Failed to complete search. Please try again." }]);
    } finally {
      setIsSearching(false);
    }
  };

  const downloadCSV = (text: string) => {
    const lines = text.split('\n');
    const tableLines = lines.filter(line => line.trim().startsWith('|'));
    if (tableLines.length === 0) {
      alert("No tabular data detected in this report to export.");
      return;
    }
    
    let csvContent = "";
    tableLines.forEach(line => {
      const cols = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (cols.every(c => c.match(/^[-:| ]+$/))) return;
      csvContent += cols.map(c => `"${c.replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "AI_Powered_Networking_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const initials = (spData.fullName || oboData.brandName || tpspData.companyName || user?.displayName || user?.email || "P")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatar = spData.profilePhoto || oboData.logo || tpspData.logo || user?.photoURL;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#701010] animate-spin mb-2" />
        <p className="text-xs font-headline font-bold text-gray-500 uppercase tracking-widest">Loading AI Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 leading-normal antialiased">
      <Navbar />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1920px] w-full mx-auto">
        
        {/* Left Sidebar Profile Column */}
        <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col p-4 bg-white border-r border-gray-100 space-y-4">
          
          {/* User Widget */}
          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#701010] flex items-center justify-center text-white font-bold text-lg font-serif shadow-sm">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <button
                onClick={() => router.push("/profile")}
                className="font-serif font-bold text-sm text-gray-900 leading-tight hover:text-[#701010] transition-colors cursor-pointer block text-left w-full truncate font-serif"
              >
                {spData.fullName || oboData.brandName || tpspData.companyName || user?.displayName || user?.email || "Partner User"}
              </button>
              <p className="text-[10px] font-headline text-gray-500 mt-0.5 uppercase tracking-wider truncate">
                {userType === "obo" ? "Overseas Business Owner" : userType === "sp" ? "Sales Partner" : userType === "tpsp" ? "Service Provider" : "Configure Profile"}
              </p>
              <p className="text-[10px] text-gray-400 truncate leading-snug">{user?.email || ""}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4 flex-1">
            <h4 className="text-xs font-headline font-bold text-gray-900 uppercase tracking-widest pb-1.5 mb-3 border-b border-gray-55">Quick Links</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => router.push("/home")} className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 transition-all rounded-lg text-left text-gray-700">
                  <span className="text-base">🌍</span>
                  <span className="text-xs font-headline font-bold uppercase tracking-wider">Global Feed</span>
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/home")} className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 transition-all rounded-lg text-left text-gray-700">
                  <span className="text-base">📝</span>
                  <span className="text-xs font-headline font-bold uppercase tracking-wider">My Posts</span>
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/home")} className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 transition-all rounded-lg text-left text-gray-700">
                  <span className="text-base">💼</span>
                  <span className="text-xs font-headline font-bold uppercase tracking-wider">My Deals</span>
                </button>
              </li>
              <div className="h-px bg-gray-100 my-2" />
              {[
                { label: 'My Network', icon: '🤝' },
                { label: 'Saved Items', icon: '🔖' },
              ].map((item) => (
                <li key={item.label}>
                  <button onClick={() => router.push("/home")} className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 transition-all rounded-lg text-left text-gray-700">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-headline font-bold uppercase tracking-wider">{item.label}</span>
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => router.push('/networking')} 
                  className="w-full flex items-center gap-2.5 px-2 py-2 bg-[#701010]/5 text-[#701010] transition-all rounded-lg text-left"
                >
                  <span className="text-base">✨</span>
                  <span className="text-xs font-headline font-bold uppercase tracking-wider">AI Powered Networking</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Center Dashboard View (The AI Chat Panel) */}
        <div className="flex-1 flex flex-col bg-gray-50/50 overflow-hidden border-r border-gray-100">
          
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#701010] lg:hidden" onClick={() => router.push("/home")} />
                <h1 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#701010]" />
                  AI Powered Networking
                </h1>
              </div>
              <p className="text-[11px] font-headline text-gray-500 uppercase tracking-widest mt-0.5">Semantic Search & Structured Directory Reports</p>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-4 rounded-2xl shadow-sm text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#701010] text-white rounded-tr-none'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none leading-relaxed'
                  }`}
                >
                  {/* Render helper to format standard markdown output */}
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {msg.text}
                  </div>

                  {/* Add CSV export CTA if markdown tables exist in the assistant response */}
                  {msg.role === 'assistant' && msg.text.includes('|') && (
                    <button
                      onClick={() => downloadCSV(msg.text)}
                      className="mt-3.5 flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Report (CSV)
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isSearching && (
              <div className="flex flex-col mr-auto max-w-[80%] items-start">
                <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-[#701010]" />
                  AI is searching & synthesizing...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Suggestions & Input */}
          <div className="bg-white border-t border-gray-100 p-4 space-y-3">
            
            {/* Prompt suggestion pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <span className="flex-shrink-0">Suggestions:</span>
              <button
                onClick={() => handleQuery("Who can build mobile apps?")}
                className="flex-shrink-0 px-2.5 py-1 bg-gray-50 hover:bg-[#701010]/5 hover:text-[#701010] rounded-full border border-gray-200 transition-colors"
              >
                App Developers
              </button>
              <button
                onClick={() => handleQuery("Who was the dairy contact in Pune?")}
                className="flex-shrink-0 px-2.5 py-1 bg-gray-50 hover:bg-[#701010]/5 hover:text-[#701010] rounded-full border border-gray-200 transition-colors"
              >
                Pune Dairy contact
              </button>
              <button
                onClick={() => handleQuery("Summarize my hottest manufacturing leads")}
                className="flex-shrink-0 px-2.5 py-1 bg-gray-50 hover:bg-[#701010]/5 hover:text-[#701010] rounded-full border border-gray-200 transition-colors"
              >
                Hottest Manufacturing Leads
              </button>
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuery(inputVal);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isSearching}
                placeholder="Ask about your network contacts (e.g. 'Show me warm leads from Mumbai')"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#701010] focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSearching || !inputVal.trim()}
                className="bg-[#701010] hover:bg-[#500c0c] text-white px-4 py-2.5 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Sidebar (Discover marketing and dev agencies) */}
        <div className="w-full lg:w-[300px] 2xl:w-[360px] flex-shrink-0 hidden lg:flex flex-col overflow-y-auto p-4 custom-scrollbar bg-white/50 border-l border-gray-100 space-y-6">
          
          {/* Marketing Agencies Carousel */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h4 className="text-[10px] font-headline font-bold text-gray-900 uppercase tracking-widest leading-none">Marketing Agencies</h4>
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  onClick={() => setActiveMarketingIndex(prev => (prev === 0 ? marketingAgencies.length - 1 : prev - 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <span className="text-[10px] font-headline font-bold text-gray-700 min-w-[24px] text-center">
                  {activeMarketingIndex + 1}/{marketingAgencies.length}
                </span>
                <button
                  onClick={() => setActiveMarketingIndex(prev => (prev === marketingAgencies.length - 1 ? 0 : prev + 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${marketingAgencies[activeMarketingIndex].bg} flex-shrink-0 flex items-center justify-center text-white shadow-sm font-bold`}>
                  M
                </div>
                <div>
                  <h5 className="font-serif font-bold text-xs text-gray-900 leading-snug">{marketingAgencies[activeMarketingIndex].name}</h5>
                  <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">{marketingAgencies[activeMarketingIndex].location}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{marketingAgencies[activeMarketingIndex].desc}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] font-headline font-bold text-[#701010] bg-[#701010]/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {marketingAgencies[activeMarketingIndex].tag}
                </span>
                <a
                  href={`https://${marketingAgencies[activeMarketingIndex].website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold text-gray-500 hover:text-[#701010] flex items-center gap-0.5 transition-colors"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </div>

          {/* Business Development Carousel */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h4 className="text-[10px] font-headline font-bold text-gray-900 uppercase tracking-widest leading-none">Business Development</h4>
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  onClick={() => setActiveBizDevIndex(prev => (prev === 0 ? bizDevAgencies.length - 1 : prev - 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <span className="text-[10px] font-headline font-bold text-gray-700 min-w-[24px] text-center">
                  {activeBizDevIndex + 1}/{bizDevAgencies.length}
                </span>
                <button
                  onClick={() => setActiveBizDevIndex(prev => (prev === bizDevAgencies.length - 1 ? 0 : prev + 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${bizDevAgencies[activeBizDevIndex].bg} flex-shrink-0 flex items-center justify-center text-white shadow-sm font-bold`}>
                  B
                </div>
                <div>
                  <h5 className="font-serif font-bold text-xs text-gray-900 leading-snug">{bizDevAgencies[activeBizDevIndex].name}</h5>
                  <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">{bizDevAgencies[activeBizDevIndex].location}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{bizDevAgencies[activeBizDevIndex].desc}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] font-headline font-bold text-[#701010] bg-[#701010]/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {bizDevAgencies[activeBizDevIndex].tag}
                </span>
                <a
                  href={`https://${bizDevAgencies[activeBizDevIndex].website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold text-gray-500 hover:text-[#701010] flex items-center gap-0.5 transition-colors"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
