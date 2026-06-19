
"use client";

import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { AiMatching } from "@/components/sections/ai-matching";
import { ActivityFeed } from "@/components/sections/activity-feed";
import { Analytics } from "@/components/sections/analytics";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Rocket, BarChart } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-headline text-4xl font-bold text-white">Built for <span className="text-primary">Infinite Scale</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A high-performance architecture designed to manage millions of sales records with specialized fractional partnership logic.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Zap className="text-primary w-6 h-6" />}
              title="Activity Feed"
              description="Low-latency updates for millions of sales records using optimized indexing."
            />
            <FeatureCard 
              icon={<Shield className="text-accent w-6 h-6" />}
              title="Deal Ledger"
              description="Real-time transaction management for complex fractional distributions."
            />
            <FeatureCard 
              icon={<Rocket className="text-primary w-6 h-6" />}
              title="Waitlist Engine"
              description="Indexing architecture capable of handling millions of concurrent signups."
            />
            <FeatureCard 
              icon={<BarChart className="text-accent w-6 h-6" />}
              title="Velocity Tracking"
              description="Deep analytics into fractional contribution metrics and sales velocity."
            />
          </div>
        </div>
      </section>

      <AiMatching />
      <Analytics />
      <ActivityFeed />

      {/* Call to Action */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 glass-panel p-12 rounded-3xl border-primary/20">
            <h2 className="font-headline text-4xl font-bold text-white">Ready to fractionalize your sales force?</h2>
            <p className="text-xl text-muted-foreground">
              Join the future of high-performance sales partnerships today. Built on GenAI and scalable infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-full">
                Join the Network
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white h-14 px-10 rounded-full">
                Speak to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-panel p-8 rounded-2xl border-white/5 space-y-4 hover:border-primary/30 transition-all hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-white/10">
        {icon}
      </div>
      <h3 className="font-headline text-xl font-bold text-white">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
