"use client";

import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Partners } from "@/components/sections/partners";
import { Services } from "@/components/sections/services";
import { Brands } from "@/components/sections/brands";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Partners />
      <Services />
      <Brands />
      <Footer />
    </main>
  );
}
