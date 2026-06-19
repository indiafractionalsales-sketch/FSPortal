
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, ArrowUpRight, TrendingUp, Globe } from "lucide-react";

const data = [
  { name: 'Mon', velocity: 4000, deals: 2400 },
  { name: 'Tue', velocity: 3000, deals: 1398 },
  { name: 'Wed', velocity: 2000, deals: 9800 },
  { name: 'Thu', velocity: 2780, deals: 3908 },
  { name: 'Fri', velocity: 1890, deals: 4800 },
  { name: 'Sat', velocity: 2390, deals: 3800 },
  { name: 'Sun', velocity: 3490, deals: 4300 },
];

export function Analytics() {
  return (
    <section className="py-24 bg-card/20 border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="font-headline text-4xl font-bold text-white">Performance <span className="text-primary">Ledger</span></h2>
              <p className="text-muted-foreground">Real-time distribution metrics for complex fractional sales structures.</p>
            </div>
            
            <Card className="glass-panel border-white/5 p-4 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d0e12', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#6366f1' }}
                  />
                  <Area type="monotone" dataKey="velocity" stroke="#6366f1" fillOpacity={1} fill="url(#colorVel)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-panel border-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="text-primary w-5 h-5" />
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">+14.2%</Badge>
              </div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Sales Velocity</h4>
              <p className="text-3xl font-bold text-white">1,248.5 <span className="text-sm font-normal text-muted-foreground">PTS</span></p>
            </Card>

            <Card className="glass-panel border-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Globe className="text-accent w-5 h-5" />
                </div>
                <ArrowUpRight className="text-accent w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Global Active Partners</h4>
              <p className="text-3xl font-bold text-white">14,204 <span className="text-sm font-normal text-muted-foreground">ACTIVE</span></p>
            </Card>

            <Card className="glass-panel border-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="text-primary w-5 h-5" />
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">Optimal</Badge>
              </div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Fractional Distributions</h4>
              <p className="text-3xl font-bold text-white">$4.2M <span className="text-sm font-normal text-muted-foreground">USD</span></p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
