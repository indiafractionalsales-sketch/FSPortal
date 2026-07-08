"use client";


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

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, UserCheck, Zap } from "lucide-react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

const INITIAL_FEED = [
  { 
    id: 1, 
    user: "Sarah J.", 
    action: "closed a fractional deal", 
    amount: "$12,400", 
    time: "2m ago", 
    type: "deal", 
    image: PlaceHolderImages[1]?.imageUrl || "https://picsum.photos/seed/sf2/200/200" 
  },
  { 
    id: 2, 
    user: "Marcus T.", 
    action: "matched with CloudScale", 
    niche: "SaaS", 
    time: "5m ago", 
    type: "match", 
    image: PlaceHolderImages[2]?.imageUrl || "https://picsum.photos/seed/sf3/200/200" 
  },
  { 
    id: 3, 
    user: "Elena V.", 
    action: "updated sales velocity to", 
    metric: "1.4x", 
    time: "12m ago", 
    type: "velocity", 
    image: PlaceHolderImages[3]?.imageUrl || "https://picsum.photos/seed/sf4/200/200" 
  },
];

export function ActivityFeed() {
  const [feed, setFeed] = useState(INITIAL_FEED);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEntry = {
        id: Date.now(),
        user: "System",
        action: "verified a new partner in",
        niche: "Enterprise Tech",
        time: "Just now",
        type: "match",
        image: `https://picsum.photos/seed/${Math.random()}/100/100`
      };
      setFeed(prev => [newEntry, ...prev.slice(0, 5)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="feed" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-headline text-4xl font-bold text-white">Live <span className="text-accent">Activity</span> Feed</h2>
            <p className="text-muted-foreground">Sub-millisecond latency for million-scale record updates.</p>
          </div>
          
          <div className="space-y-4">
            {feed.map((item) => (
              <Card key={item.id} className="glass-panel border-white/5 p-4 flex items-center gap-4 transition-all hover:translate-x-1 hover:border-white/10 group">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={item.image} />
                  <AvatarFallback>{item.user[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-medium text-sm">
                      <span className="text-accent font-bold">{item.user}</span> {item.action}
                    </p>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.amount && (
                      <Badge variant="outline" className="text-green-400 border-green-400/20 bg-green-400/5 text-[10px] py-0">
                        <DollarSign className="w-3 h-3 mr-1" /> {item.amount}
                      </Badge>
                    )}
                    {item.niche && (
                      <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 text-[10px] py-0">
                        <UserCheck className="w-3 h-3 mr-1" /> {item.niche}
                      </Badge>
                    )}
                    {item.metric && (
                      <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 text-[10px] py-0">
                        <TrendingUp className="w-3 h-3 mr-1" /> {item.metric} velocity
                      </Badge>
                    )}
                    {item.type === 'deal' && <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500 animate-pulse" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
