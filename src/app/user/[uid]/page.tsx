"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, Building, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function PublicProfilePage() {
  const { uid } = useParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          
          const res = await fetch(`/api/profile?uid=${uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!res.ok) {
            if (res.status === 404) {
               setError("User not found.");
            } else {
               setError("Failed to load profile.");
            }
            throw new Error(`Failed to fetch user: ${res.status}`);
          }

          const data = await res.json();
          setProfileData(data);
          
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [uid, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#701010]" />
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-gray-500 font-sans">{error || "User not found"}</p>
          <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const initials = profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-[#701010] transition-colors mb-6 font-sans text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-gray-900 to-[#701010] relative" />
          
          {/* Avatar & Info Row */}
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 relative">
              {/* Avatar (Overlapping Banner) */}
              <div className="relative -mt-16 flex-shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white flex items-center justify-center">
                  {profileData.photoURL ? (
                    <img 
                      src={profileData.photoURL} 
                      alt={profileData.fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#701010] flex items-center justify-center text-white font-serif font-bold text-5xl">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pt-2 sm:ml-4">
                <h1 className="text-3xl font-serif font-bold text-gray-900 leading-snug">
                  {profileData.fullName || "Business Owner"}
                </h1>
                
                <p className="text-[10px] font-headline text-gray-500 mt-1.5 uppercase tracking-wider font-bold">
                  {profileData.title || "Business Owner"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {profileData.companyName && (
                <div className="flex items-center gap-2 text-gray-600 font-sans text-sm">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>{profileData.companyName}</span>
                </div>
              )}
              {profileData.location && (
                <div className="flex items-center gap-2 text-gray-600 font-sans text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{profileData.location}</span>
                </div>
              )}
            </div>

            {profileData.about && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h2 className="text-sm font-headline font-bold text-gray-900 uppercase tracking-wider mb-3">About</h2>
                <p className="text-gray-700 font-sans leading-relaxed whitespace-pre-wrap">
                  {profileData.about}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
