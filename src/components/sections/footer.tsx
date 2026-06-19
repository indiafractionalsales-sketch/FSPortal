
"use client";

import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-xl text-white">ScaleFraction</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ScaleFraction Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
