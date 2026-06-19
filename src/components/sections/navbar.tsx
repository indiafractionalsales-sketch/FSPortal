
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-white">ScaleFraction</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#ai-matching" className="hover:text-primary transition-colors">AI Matching</Link>
          <Link href="#feed" className="hover:text-primary transition-colors">Live Feed</Link>
          <Link href="#partners" className="hover:text-primary transition-colors">Partners</Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex text-muted-foreground">Login</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white">Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
