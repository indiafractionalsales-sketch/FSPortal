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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2, BrainCircuit } from "lucide-react";
import { aiPoweredPartnerDescription } from "@/ai/flows/ai-powered-partner-description";

export function AiMatching() {
  const [niche, setNiche] = useState("");
  const [traits, setTraits] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!niche || !traits) return;
    setLoading(true);
    try {
      const response = await aiPoweredPartnerDescription({
        salesNiche: niche,
        idealPartnerCharacteristics: traits,
      });
      setResult(response.partnerDescription);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-matching" className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
              <BrainCircuit className="text-accent w-6 h-6" />
            </div>
            <h2 className="font-headline text-4xl font-bold text-white leading-tight">
              Intelligent Partner Matching <span className="text-primary">Engine</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our GenAI system analyzes historical conversion data, niche expertise, and communication styles to recommend the perfect fractional sales partner for your specific industry.
            </p>
            <ul className="space-y-4">
              {[
                "Deep Industry Context Analysis",
                "Historical Performance Validation",
                "Cultural & Tone Alignment",
                "Scalable Matching Architecture"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Card className="glass-panel border-white/5 overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5">
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Find Your Ideal Partner
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Describe your needs and let ScaleFraction AI find the perfect match.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Sales Niche (e.g. SaaS, Fintech, Healthcare)</label>
                <Input 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Enter your industry niche..." 
                  className="bg-background/50 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Ideal Partner Traits</label>
                <Textarea 
                  value={traits}
                  onChange={(e) => setTraits(e.target.value)}
                  placeholder="Describe the skills and experience you're looking for..." 
                  className="bg-background/50 border-white/10 text-white min-h-[120px]"
                />
              </div>
              <Button 
                onClick={handleMatch}
                disabled={loading || !niche || !traits}
                className="w-full bg-accent hover:bg-accent/90 text-background font-bold h-12"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Match Profile"}
              </Button>

              {result && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 animate-fade-in">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Matched Profile Persona:</h4>
                  <p className="text-white/90 text-sm leading-relaxed italic">
                    "{result}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
