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

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs font-sans text-white/50 tracking-widest uppercase">
          <div className="flex flex-col gap-1 text-center md:text-left text-[9px] normal-case opacity-70">
            <p>© {new Date().getFullYear()} Biztribe Trading & Consultancy India Private Limited. All rights reserved.</p>
            <p className="text-white/40">"Fractional Sales Partner" is a brand of Biztribe Trading & Consultancy India Private Limited.</p>
            <p className="mt-1">B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India</p>
            <p>Email: sales@fractionalsalespartner.com | CIN: U62020PN2026PTC251766</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/refund" className="hover:text-white transition-colors">Refund & Cancellation</Link>
            <Link href="/legal/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
