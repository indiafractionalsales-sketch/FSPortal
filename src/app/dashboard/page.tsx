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
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f2f5] text-[#050505] font-sans overflow-hidden h-screen flex flex-col text-sm">
      {/* Top Navbar */}
      <header className="bg-white h-12 flex-shrink-0 w-full z-50 flex items-center justify-between px-4 border-b border-[#ced0d4] shadow-sm">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 w-1/4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-base text-white">
            FS
          </div>
        </div>

        {/* Center: Nav icons */}
        <div className="hidden md:flex items-center justify-center gap-1 w-2/4 h-full">
          <button className="px-8 h-full border-b-[3px] border-blue-500 text-blue-500 hover:bg-[#f2f2f2] transition-colors">
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Profile & Actions */}
        <div className="flex items-center justify-end gap-2 w-1/4">
          <button className="w-8 h-8 bg-[#e4e6eb] rounded-full flex items-center justify-center hover:bg-[#d8dadf] transition-colors relative">
            <Bell className="w-4 h-4 text-[#050505]" />
            <span className="absolute top-[-2px] right-[-2px] bg-red-500 text-white text-[10px] font-bold px-[4px] py-[0px] rounded-full border-2 border-white">
              3
            </span>
          </button>
          
          <div className="relative ml-1">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full border border-gray-300 overflow-hidden"
            >
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm">
                P
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-300 rounded-full flex flex-shrink-0 items-center justify-center text-gray-700 font-bold text-base">P</div>
                   <div>
                      <p className="text-sm font-semibold text-[#050505]">Partner User</p>
                      <p className="text-xs text-[#65676b]">See your profile</p>
                   </div>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-[#050505] hover:bg-[#f2f2f2] rounded-md flex items-center gap-3 transition-colors">
                    <div className="w-6 h-6 bg-[#e4e6eb] rounded-full flex items-center justify-center"><Settings className="w-3.5 h-3.5 text-[#050505]" /></div>
                    Settings & privacy
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-[#050505] hover:bg-[#f2f2f2] rounded-md flex items-center gap-3 transition-colors"
                  >
                    <div className="w-6 h-6 bg-[#e4e6eb] rounded-full flex items-center justify-center"><LogOut className="w-3.5 h-3.5 text-[#050505]" /></div>
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
        <div className="w-[300px] flex-shrink-0 hidden md:flex flex-col overflow-y-auto p-3 custom-scrollbar gap-3">

          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Banner */}
            <div className="h-16 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 relative" />

            {/* Avatar */}
            <div className="px-4 pb-4">
              <div className="relative -mt-8 mb-2">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL || undefined}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-xl shadow-sm">
                    {user?.email?.charAt(0).toUpperCase() ?? "P"}
                  </div>
                )}
              </div>

              <Link href="/profile" className="font-semibold text-[#050505] text-sm leading-tight hover:underline cursor-pointer">{user?.displayName || user?.email || "Partner User"}</Link>
              <p className="text-xs text-[#65676b] mt-0.5 leading-snug">{user?.email || ""}</p>
              <p className="text-xs text-[#65676b] mt-0.5">Fractional Sales Partner</p>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center py-1 cursor-pointer hover:bg-[#f8f8f8] rounded px-1 -mx-1 transition-colors">
                  <span className="text-xs text-[#65676b]">Connections</span>
                  <span className="text-xs font-semibold text-blue-600">248</span>
                </div>
                <div className="flex justify-between items-center py-1 cursor-pointer hover:bg-[#f8f8f8] rounded px-1 -mx-1 transition-colors">
                  <span className="text-xs text-[#65676b]">Profile views</span>
                  <span className="text-xs font-semibold text-blue-600">34</span>
                </div>
                <div className="flex justify-between items-center py-1 cursor-pointer hover:bg-[#f8f8f8] rounded px-1 -mx-1 transition-colors">
                  <span className="text-xs text-[#65676b]">Post impressions</span>
                  <span className="text-xs font-semibold text-blue-600">1,204</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3">
            <h4 className="text-xs font-semibold text-[#65676b] uppercase tracking-wide mb-2">Quick Links</h4>
            <ul className="space-y-1">
              {[
                { label: 'My Network', icon: '🤝' },
                { label: 'My Deals', icon: '💼' },
                { label: 'Saved Items', icon: '🔖' },
              ].map((item) => (
                <li key={item.label}>
                  <button className="w-full flex items-center gap-2.5 px-1 py-1.5 rounded-md hover:bg-[#f2f2f2] transition-colors text-left">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm text-[#050505] font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>


        {/* Center Feed */}
        <div className="flex-1 overflow-y-auto flex justify-center custom-scrollbar pb-10">
          <div className="max-w-[860px] w-full py-4 px-4">
            
            {/* Create Post */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-4">
              <div className="flex gap-2 mb-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex flex-shrink-0 items-center justify-center text-gray-700 font-bold text-sm">P</div>
                <div className="flex-1 bg-[#f0f2f5] hover:bg-[#e4e6eb] cursor-pointer rounded-full px-4 py-2 flex items-center transition-colors">
                  <span className="text-[#65676b] text-sm">What's on your mind, Partner?</span>
                </div>
              </div>
              <div className="flex border-t border-[#ced0d4] pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f2f2f2] py-1.5 rounded-md transition-colors">
                  <Video className="w-5 h-5 text-red-500" />
                  <span className="text-[#65676b] font-medium text-sm">Live video</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f2f2f2] py-1.5 rounded-md transition-colors">
                  <ImageIcon className="w-5 h-5 text-green-500" />
                  <span className="text-[#65676b] font-medium text-sm">Photo/video</span>
                </button>
                <button className="flex-1 hidden sm:flex items-center justify-center gap-2 hover:bg-[#f2f2f2] py-1.5 rounded-md transition-colors">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <span className="text-[#65676b] font-medium text-sm">Life event</span>
                </button>
              </div>
            </div>

            {/* Post 1 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 pb-2">
              <div className="p-3 flex items-start justify-between">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex flex-shrink-0 items-center justify-center font-bold text-blue-700 text-sm">DS</div>
                  <div>
                    <h4 className="font-semibold text-sm leading-tight hover:underline text-[#050505]">Deepak Sanghavi <span className="text-blue-500 font-normal">· Follow</span></h4>
                    <p className="text-xs text-[#65676b] hover:underline mt-0.5">20 June at 13:30 · 🌍</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-full hover:bg-[#f2f2f2] flex items-center justify-center transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-[#65676b]" />
                  </button>
                </div>
              </div>
              
              <div className="px-3 pb-3">
                <p className="text-sm text-[#050505]">Every leader wants to make the right decision.... <span className="font-semibold cursor-pointer hover:underline text-[#65676b]">See more</span></p>
              </div>

              {/* Post Video/Image area */}
              <div className="bg-black w-full aspect-video flex items-center justify-center relative cursor-pointer group">
                 {/* Placeholder for video */}
                 <div className="w-full h-full bg-[#18191a] flex flex-col items-center justify-center">
                    <h3 className="text-yellow-400 font-semibold text-lg mb-4">The CEO's Risk Mindset</h3>
                    <div className="relative w-36 h-36 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center border border-gray-600">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/40 group-hover:bg-white/30 transition-colors z-10">
                        <div className="w-0 h-0 border-t-6 border-b-6 border-l-[10px] border-t-transparent border-b-transparent border-l-white ml-1"></div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Engagement Stats */}
              <div className="px-3 py-2 flex items-center justify-between text-[#65676b] border-b border-[#ced0d4] mx-3">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><ThumbsUp className="w-2 h-2 text-white fill-current" /></div>
                  <span className="text-xs hover:underline cursor-pointer">1.3K</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs hover:underline cursor-pointer">12 comments</span>
                  <span className="text-xs hover:underline cursor-pointer">96 shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between px-2 py-1 mx-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[#65676b] font-medium text-sm hover:bg-[#f2f2f2] rounded-md transition-colors">
                  <ThumbsUp className="w-4 h-4" /> Like
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[#65676b] font-medium text-sm hover:bg-[#f2f2f2] rounded-md transition-colors">
                  <MessageCircle className="w-4 h-4" /> Comment
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[#65676b] font-medium text-sm hover:bg-[#f2f2f2] rounded-md transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] flex-shrink-0 hidden lg:block overflow-y-auto p-3 custom-scrollbar">
          {/* Empty right sidebar to maintain layout alignment without showing items */}
        </div>

      </div>

      {/* Global CSS for hiding scrollbars but allowing scroll, and mimicking FB styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: transparent;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #ced0d4;
        }
      `}} />
    </main>
  );
}
