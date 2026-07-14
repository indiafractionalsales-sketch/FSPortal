"use client";

import { useRouter } from "next/navigation";

interface LeftSidebarProps {
  user: any;
  userType: string;
  spData: any;
  oboData: any;
  tpspData: any;
  planName: string;
  feedTab?: string;
  setFeedTab?: (tab: "global" | "mine" | "deals") => void;
  mobileTab?: string;
  setMobileTab?: (tab: "profile" | "feed" | "discover") => void;
  className?: string; // To allow layout adjustments from parent
}

export default function LeftSidebar({
  user,
  userType,
  spData,
  oboData,
  tpspData,
  planName,
  feedTab = "global",
  setFeedTab,
  mobileTab,
  setMobileTab,
  className = ""
}: LeftSidebarProps) {
  const router = useRouter();

  const handleFeedTabClick = (tab: "global" | "mine" | "deals") => {
    if (setFeedTab) setFeedTab(tab);
    if (setMobileTab) setMobileTab("feed");
    // If we're not on the home page, redirect to home and let it handle the feed tab
    if (typeof window !== 'undefined' && window.location.pathname !== "/home") {
      router.push("/home");
    }
  };

  return (
    <div className={`w-full md:w-[260px] 2xl:w-[360px] flex-shrink-0 ${mobileTab === 'profile' ? 'flex' : (mobileTab ? 'hidden' : 'flex')} md:flex flex-col overflow-y-auto p-4 custom-scrollbar bg-white/50 gap-4 border-r border-gray-100 ${className}`}>
      
      {/* Profile Card */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex-shrink-0">
        {/* Banner */}
        <div className="h-16 bg-[#701010] relative overflow-hidden">
          {(oboData?.banner || spData?.banner || tpspData?.banner) && (
            <img src={oboData.banner || spData.banner || tpspData.banner} alt="Banner" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Avatar */}
        <div className="px-4 pb-4">
          <div className="relative -mt-8 mb-2">
            {spData?.profilePhoto ? (
              <img
                src={spData.profilePhoto}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover"
              />
            ) : oboData?.logo || tpspData?.logo ? (
              <img
                src={oboData.logo || tpspData.logo}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover"
              />
            ) : user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-gray-800 font-bold text-xl shadow-sm">
                {user?.email?.charAt(0).toUpperCase() ?? "P"}
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/profile")}
            className="font-serif font-bold text-base text-gray-900 leading-tight hover:text-[#701010] transition-colors cursor-pointer block text-left w-full truncate"
            title={spData?.fullName || oboData?.brandName || tpspData?.companyName || user?.displayName || user?.email || "Partner User"}
          >
            {spData?.fullName || oboData?.brandName || tpspData?.companyName || user?.displayName || user?.email || "Partner User"}
          </button>
          <p className="text-[10px] font-headline text-gray-500 mt-1 uppercase tracking-wider truncate">
            {userType === "obo" ? "Overseas Business Owner" : userType === "sp" ? "Sales Partner" : userType === "tpsp" ? "Service Provider" : "Configure Profile"}
          </p>
          {planName && (
            <div className="mt-1">
              <span className="inline-block text-[8px] font-headline font-bold bg-[#701010]/10 text-[#701010] border border-[#701010]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {planName}
              </span>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1 leading-snug truncate" title={user?.email || ""}>{user?.email || ""}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4 flex-1">
        <h4 className="text-xs font-headline font-bold text-gray-900 uppercase tracking-widest pb-1.5 mb-3 border-b border-gray-50">Quick Links</h4>
        <ul className="space-y-1.5">
          <li>
            <button onClick={() => handleFeedTabClick("global")} className={`w-full flex items-center gap-2.5 px-2 py-2 transition-all rounded-lg text-left ${feedTab === "global" ? "bg-[#701010]/5 text-[#701010]" : "hover:bg-gray-50 text-gray-700"}`}>
              <span className="text-base">🌍</span>
              <span className="text-xs font-headline font-bold uppercase tracking-wider">Global Feed</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleFeedTabClick("mine")} className={`w-full flex items-center gap-2.5 px-2 py-2 transition-all rounded-lg text-left ${feedTab === "mine" ? "bg-[#701010]/5 text-[#701010]" : "hover:bg-gray-50 text-gray-700"}`}>
              <span className="text-base">📝</span>
              <span className="text-xs font-headline font-bold uppercase tracking-wider">My Posts</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleFeedTabClick("deals")} className={`w-full flex items-center gap-2.5 px-2 py-2 transition-all rounded-lg text-left ${feedTab === "deals" ? "bg-[#701010]/5 text-[#701010]" : "hover:bg-gray-50 text-gray-700"}`}>
              <span className="text-base">💼</span>
              <span className="text-xs font-headline font-bold uppercase tracking-wider">My Deals</span>
            </button>
          </li>
          <div className="h-px bg-gray-100 my-2" />
          <li>
            <button onClick={() => router.push('/my-network')} className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg text-left text-gray-700">
              <span className="text-base">🤝</span>
              <span className="text-xs font-headline font-bold uppercase tracking-wider">My Network</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 transition-all rounded-lg text-left text-gray-700">
              <span className="text-base">🔖</span>
              <span className="text-xs font-headline font-bold uppercase tracking-wider">Saved Items</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => router.push('/networking')} 
              className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg text-left text-gray-700"
            >
              <span className="text-base">✨</span>
              <span className="text-xs font-headline font-bold uppercase tracking-wider">AI Powered Networking</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => router.push('/pricing')} 
              className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg text-left text-gray-700"
            >
              <span className="text-base">💳</span>
              <span className="text-xs font-headline font-bold uppercase tracking-wider">Plans & Subscriptions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
