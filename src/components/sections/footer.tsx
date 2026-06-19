"use client";

import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 border-b border-white/10 pb-12 mb-8">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/">
              <span className="font-serif font-bold text-3xl tracking-tighter text-white">Fractional Sales Partner</span>
            </Link>
            <p className="text-white/60 font-sans mt-4 max-w-sm text-sm leading-relaxed">
              Discover the change-makers helping MSMEs from emerging markets reach their full potential globally.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Instagram" className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Facebook" className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs font-sans text-white/50 tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Fractional Sales Partner. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
