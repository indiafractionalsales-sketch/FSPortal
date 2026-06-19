
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, Users, BarChart3 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full hero-gradient pointer-events-none" />
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 mb-4">
            Next-Gen Fractional Sales Intelligence
          </Badge>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-white">
            Scale Your Revenue with <span className="text-accent">Fractional Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The world's first AI-powered network for fractional sales partners. Built for high-volume partnerships and millions of records with sub-millisecond latency.
          </p>
          
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mt-10">
            <Input 
              type="email" 
              placeholder="Enter your work email" 
              className="bg-card/50 border-white/10 h-12 focus-visible:ring-primary"
            />
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold h-12 px-8">
              Join Waitlist
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">20k+ Sales Partners</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
