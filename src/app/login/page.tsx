"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import {
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect signed-in users to dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError("Sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side: Image */}
      <div className="hidden md:block md:w-1/2 relative bg-gray-900">
        <Image
          src="/hero-collage.png"
          alt="Sales professionals networking"
          fill
          priority
          className="object-cover opacity-100 brightness-110"
        />
        {/* Simple Header on top of image */}
        <div className="absolute top-0 left-0 p-8 z-10">
          <Link href="/" className="flex items-center gap-2 text-sm font-sans font-bold tracking-widest text-white hover:text-red-400 transition-colors drop-shadow-lg">
            <ArrowLeft className="w-4 h-4" /> BACK TO HOME
          </Link>
        </div>
      </div>

      {/* Right side: Login Functionality */}
      <div className="w-full md:w-1/2 flex flex-col">
        {/* Header for mobile only */}
        <header className="md:hidden h-16 border-b border-gray-200 flex items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-sans font-bold tracking-widest hover:text-red-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> BACK TO HOME
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h1 className="text-3xl lg:text-4xl font-serif text-black font-bold mb-4 leading-tight">Scale your revenue with high-performance partners.</h1>
              <p className="text-gray-500 font-sans">Sign in to access your partner portal.</p>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-4 flex items-center justify-center gap-3 transition-colors disabled:opacity-50 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>
            
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Don't have an account? <Link href="#" className="text-red-600 font-bold hover:underline ml-1">Apply Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
