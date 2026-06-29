"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import { 
  Search, Home, Tv, Store, Users, Grid, MessageCircle, Bell, 
  Settings, LogOut, MoreHorizontal, ThumbsUp, Share2, Plus, 
  Bookmark, Clock, Calendar, Video, ImageIcon
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#701010] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#0d0e12] font-body antialiased overflow-hidden h-screen flex flex-col text-sm">
      {/* Top Navbar */}
      <header className="bg-white h-16 flex-shrink-0 w-full z-50 flex items-center justify-between px-6 border-b border-gray-100">
        {/* Left: Logo (Matching landing page style) */}
        <div className="flex items-center gap-2 w-1/4">
          <Link href="/dashboard" className="font-serif font-bold text-lg md:text-xl tracking-tighter text-gray-900 flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            Fractional Sales 
            <span className="text-[#701010] font-headline text-[10px] uppercase tracking-widest font-bold border border-[#701010]/20 px-1.5 py-0.5 ml-1">
              Portal
            </span>
          </Link>
        </div>

        {/* Center: Nav icons */}
        <div className="hidden md:flex items-center justify-center gap-1 w-2/4 h-full">
          <button className="px-8 h-full border-b-2 border-[#701010] text-[#701010] hover:bg-gray-50 transition-colors">
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Profile & Actions */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <button className="w-9 h-9 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors relative">
            <Bell className="w-4 h-4 text-gray-700" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#701010] rounded-full border border-white"></span>
          </button>
          
          <div className="relative ml-1">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden hover:border-gray-400 transition-colors"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm font-headline">
                  {user?.email?.charAt(0).toUpperCase() ?? "P"}
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg py-2 z-50 shadow-lg">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                   {user?.photoURL ? (
                     <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                   ) : (
                     <div className="w-10 h-10 bg-gray-200 rounded-full flex flex-shrink-0 items-center justify-center text-gray-700 font-bold text-base font-headline">
                       {user?.email?.charAt(0).toUpperCase() ?? "P"}
                     </div>
                   )}
                   <div className="overflow-hidden">
                      <p className="text-sm font-serif font-bold text-gray-900 truncate">{user?.displayName || "Partner User"}</p>
                      <p className="text-[10px] font-headline text-gray-500 uppercase tracking-wider truncate">{user?.email || ""}</p>
                   </div>
                </div>
                <div className="p-1">
                  <Link href="/profile" className="w-full text-left px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded-md">
                    <Settings className="w-3.5 h-3.5" />
                    My Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-colors rounded-md"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-[300px] flex-shrink-0 hidden md:flex flex-col overflow-y-auto p-4 custom-scrollbar gap-4 border-r border-gray-100">

          {/* Profile Card */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {/* Banner */}
            <div className="h-16 bg-[#701010] relative" />

            {/* Avatar */}
            <div className="px-4 pb-4">
              <div className="relative -mt-8 mb-2">
                {user?.photoURL ? (
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

              <Link href="/profile" className="font-serif font-bold text-base text-gray-900 leading-tight hover:text-[#701010] transition-colors cursor-pointer block">{user?.displayName || user?.email || "Partner User"}</Link>
              <p className="text-[10px] font-headline text-gray-500 mt-1 uppercase tracking-wider">{user?.email || ""}</p>
              <p className="text-xs text-gray-500 mt-1 leading-snug">Fractional Sales Partner</p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded-md transition-colors">
                  <span className="text-xs font-headline font-bold text-gray-700 uppercase tracking-wider">Connections</span>
                  <span className="text-xs font-bold text-[#701010] font-headline">248</span>
                </div>
                <div className="flex justify-between items-center py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded-md transition-colors">
                  <span className="text-xs font-headline font-bold text-gray-700 uppercase tracking-wider">Profile views</span>
                  <span className="text-xs font-bold text-[#701010] font-headline">34</span>
                </div>
                <div className="flex justify-between items-center py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded-md transition-colors">
                  <span className="text-xs font-headline font-bold text-gray-700 uppercase tracking-wider">Post impressions</span>
                  <span className="text-xs font-bold text-[#701010] font-headline">1,204</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4">
            <h4 className="text-xs font-headline font-bold text-gray-900 uppercase tracking-widest pb-1.5 mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              {[
                { label: 'My Network', icon: '🤝' },
                { label: 'My Deals', icon: '💼' },
                { label: 'Saved Items', icon: '🔖' },
              ].map((item) => (
                <li key={item.label}>
                  <button className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 transition-all rounded-lg text-left">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-headline font-bold uppercase tracking-wider text-gray-700">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Center Feed */}
        <div className="flex-1 overflow-y-auto flex justify-center custom-scrollbar pb-10 bg-[#faf8f5]">
          <div className="max-w-[720px] w-full py-6 px-4">
            
            {/* Create Post */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 mb-6">
              <div className="flex gap-3 mb-4">
                 {user?.photoURL ? (
                   <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                 ) : (
                   <div className="w-10 h-10 bg-gray-200 rounded-full flex flex-shrink-0 items-center justify-center text-gray-700 font-bold text-sm font-headline">
                     {user?.email?.charAt(0).toUpperCase() ?? "P"}
                   </div>
                 )}
                <div className="flex-1 bg-gray-50 hover:bg-gray-100 cursor-pointer px-4 py-2.5 flex items-center transition-colors rounded-full">
                  <span className="text-gray-500 text-xs font-headline font-bold uppercase tracking-wider">What's on your mind, Partner?</span>
                </div>
              </div>
              <div className="flex border-t border-gray-100 pt-3 gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-50 py-2 transition-colors rounded-lg">
                  <Video className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700 font-headline font-bold uppercase tracking-wider text-[10px]">Live video</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-50 py-2 transition-colors rounded-lg">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span className="text-gray-700 font-headline font-bold uppercase tracking-wider text-[10px]">Photo/video</span>
                </button>
                <button className="flex-1 hidden sm:flex items-center justify-center gap-2 hover:bg-gray-50 py-2 transition-colors rounded-lg">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-gray-700 font-headline font-bold uppercase tracking-wider text-[10px]">Life event</span>
                </button>
              </div>
            </div>

            {/* Post 1 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6 pb-2 overflow-hidden">
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex flex-shrink-0 items-center justify-center font-serif font-bold text-[#701010] text-sm">
                    DS
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-gray-900 hover:text-[#701010] hover:underline transition-colors flex items-center gap-1.5">
                      Deepak Sanghavi 
                      <span className="text-red-600 font-headline text-[9px] uppercase tracking-widest font-bold ml-1">· Follow</span>
                    </h4>
                    <p className="text-[9px] font-headline text-gray-500 mt-1 uppercase tracking-widest">20 June at 13:30 · 🌍</p>
                  </div>
                </div>
                <div>
                  <button className="w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all">
                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-800 leading-relaxed font-sans">
                  Every leader wants to make the right decision.... <span className="font-headline font-bold text-[10px] text-[#701010] uppercase tracking-wider cursor-pointer hover:underline">See more</span>
                </p>
              </div>

              {/* Post Video/Image area */}
              <div className="bg-black w-full aspect-video flex items-center justify-center relative cursor-pointer group">
                 {/* Placeholder for video */}
                 <div className="w-full h-full bg-[#16161a] flex flex-col items-center justify-center p-6 relative">
                    <div className="absolute inset-0 bg-radial-gradient opacity-20"></div>
                    <h3 className="text-white font-serif font-bold text-lg md:text-xl mb-6 tracking-tight text-center z-10">The CEO's Risk Mindset</h3>
                    <div className="relative w-28 h-28 bg-[#faf8f5]/10 border border-white/20 flex items-center justify-center group-hover:scale-105 transition-all duration-300 z-10 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors shadow">
                        <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white ml-1"></div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Engagement Stats */}
              <div className="px-4 py-3 flex items-center justify-between text-gray-500 border-b border-gray-100 mx-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-[#701010] rounded-full flex items-center justify-center"><ThumbsUp className="w-2.5 h-2.5 text-white fill-current" /></div>
                  <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 hover:underline cursor-pointer">1.3K Likes</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 hover:underline cursor-pointer">12 comments</span>
                  <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 hover:underline cursor-pointer">96 shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between px-2 py-2 mx-4 gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all duration-300 rounded-lg">
                  <ThumbsUp className="w-3.5 h-3.5" /> Like
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all duration-300 rounded-lg">
                  <MessageCircle className="w-3.5 h-3.5" /> Comment
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all duration-300 rounded-lg">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] flex-shrink-0 hidden lg:block overflow-y-auto p-4 custom-scrollbar border-l border-gray-100">
          {/* Empty right sidebar to maintain layout alignment without showing items */}
        </div>

      </div>

      {/* Global CSS for hiding scrollbars but allowing scroll, and mimicking editorial styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: transparent;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #0d0e12;
        }
      `}} />
    </main>
  );
}
