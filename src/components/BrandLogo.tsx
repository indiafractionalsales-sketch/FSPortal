/**
 * Copyright (c) 2026 Biztribe Trading & Consultancy India Private Limited.
 * All rights reserved.
 *
 * This file is part of the Fractional Sales Partner platform.
 * CONFIDENTIAL AND PROPRIETARY — Unauthorised copying, redistribution,
 * modification, or use of this file, via any medium, is strictly prohibited.
 * Violation will result in civil and criminal prosecution under the
 * Copyright Act 1957, Information Technology Act 2000, and applicable
 * Indian and international intellectual property laws.
 */

"use client";

import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showTagline?: boolean;
  lightText?: boolean;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  showTagline = true,
  lightText = false,
  className = ""
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base md:text-xl",
    lg: "text-xl md:text-2xl"
  };

  const badgeSizes = {
    sm: "text-[8px] px-1 py-[0.5px]",
    md: "text-[8px] md:text-[10px] px-1.5 py-0.5",
    lg: "text-[10px] md:text-[12px] px-2 py-0.5"
  };

  const taglineSizes = {
    sm: "text-[7px]",
    md: "text-[8px] md:text-[9px]",
    lg: "text-[9px] md:text-[10px]"
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex-shrink-0 ${iconSizes[size]}`}>
        <Image
          src="/logo.png"
          alt="Fractional Sales Partner Logo"
          width={48}
          height={48}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col items-start leading-none">
          <div className={`flex items-center gap-1 font-serif font-bold tracking-tighter ${textSizes[size]}`}>
            <span className={lightText ? "text-white" : "text-gray-900"}>
              Fractional Sales
            </span>
            <span className={`font-headline uppercase tracking-widest font-bold border rounded-sm ml-0.5 ${
              lightText 
                ? "text-sky-200 border-sky-300/40 bg-sky-950/30" 
                : "text-[#701010] border-[#701010]/20 bg-[#701010]/5"
            } ${badgeSizes[size]}`}>
              Partner
            </span>
          </div>
          {showTagline && (
            <span className={`font-sans italic leading-none mt-0.5 truncate ${
              lightText ? "text-sky-100/90" : "text-gray-500"
            } ${taglineSizes[size]}`}>
              Every Post is a Business Post
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
