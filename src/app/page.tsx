"use client";

import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Partners } from "@/components/sections/partners";
import { Services } from "@/components/sections/services";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Partners />
      <Services />
      <Footer />
    </main>
  );
}
