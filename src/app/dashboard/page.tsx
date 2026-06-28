"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dashboard Topbar */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="font-serif font-bold text-xl text-black">
          Partner Portal
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl py-1 z-20">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Partner User</p>
                <p className="text-xs text-gray-500 mt-0.5">partner@example.com</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area - Blank for now */}
      <div className="flex-1 p-6 md:p-12">
        <div className="max-w-5xl mx-auto h-full min-h-[60vh] flex items-center justify-center">
          <div className="bg-white border border-gray-200 p-12 text-center shadow-sm w-full max-w-lg">
            <h2 className="text-2xl font-serif text-black mb-3">Welcome to your Dashboard</h2>
            <p className="text-gray-500 font-sans text-sm">
              Your partner activity, analytics, and tools will be available here soon. We are actively developing this section.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
