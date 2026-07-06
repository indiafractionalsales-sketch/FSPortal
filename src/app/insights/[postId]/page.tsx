"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import { getDocument } from "@/lib/firestore-rest";
import {
  Phone, Mail, Globe, Building2,
  Flame, Sun, Snowflake, Clock,
  Loader2, ChevronRight, ArrowLeft
} from "lucide-react";

interface Lead {
  id: string;
  status: "pending" | "processing" | "processed" | "failed";
  capturedByUid: string;
  ownerUid: string;
  postId: string | null;
  cardImageUrl: string;
  voiceNoteUrl: string | null;
  textNote: string | null;
  createdAt: string | null;
  processedAt: string | null;
  contactInfo: {
    name?: string;
    designation?: string;
    company?: string;
    email?: string;
    phone?: string;
    website?: string;
  } | null;
  temperature: "hot" | "warm" | "cold" | null;
  actionItem: string | null;
  contextSummary: string | null;
}

const TemperatureBadge = ({ temp }: { temp: "hot" | "warm" | "cold" | null }) => {
  if (!temp) return null;
  const config = {
    hot: { icon: Flame, label: "Hot", cls: "bg-red-50 text-red-700 border-red-200" },
    warm: { icon: Sun, label: "Warm", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    cold: { icon: Snowflake, label: "Cold", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  }[temp];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-widest border ${config.cls}`}>
      <Icon className="w-3 h-3" />{config.label}
    </span>
  );
};

// SVG donut chart
const TemperatureDonut = ({ hot, warm, cold }: { hot: number; warm: number; cold: number }) => {
  const total = hot + warm + cold;
  if (total === 0) return null;
  const R = 38;
  const C = 2 * Math.PI * R;
  const hotD = (hot / total) * C;
  const warmD = (warm / total) * C;
  const coldD = (cold / total) * C;
  return (
    <div className="flex items-center gap-8">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="#f3f4f6" strokeWidth="14" />
          {hot > 0 && <circle cx="50" cy="50" r={R} fill="none" stroke="#ef4444" strokeWidth="14" strokeDasharray={`${hotD} ${C}`} strokeDashoffset={0} />}
          {warm > 0 && <circle cx="50" cy="50" r={R} fill="none" stroke="#f59e0b" strokeWidth="14" strokeDasharray={`${warmD} ${C}`} strokeDashoffset={-hotD} />}
          {cold > 0 && <circle cx="50" cy="50" r={R} fill="none" stroke="#93c5fd" strokeWidth="14" strokeDasharray={`${coldD} ${C}`} strokeDashoffset={-(hotD + warmD)} />}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-serif font-bold text-gray-900 leading-none">{total}</p>
          <p className="text-[9px] font-headline uppercase tracking-widest text-gray-500">leads</p>
        </div>
      </div>
      <div className="space-y-2">
        {[["#ef4444", "Hot", hot], ["#f59e0b", "Warm", warm], ["#93c5fd", "Cold", cold]].map(([color, label, count]) => (
          <div key={label as string} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color as string }} />
            <span className="text-xs text-gray-500 font-headline">{label as string}</span>
            <span className="text-xs font-bold text-gray-900 ml-1">{count as number}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeadCard = ({ lead }: { lead: Lead }) => {
  const [expanded, setExpanded] = useState(false);
  const name = lead.contactInfo?.name || "Unknown Contact";

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
          <img src={lead.cardImageUrl} alt="Card" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-serif font-bold text-gray-900 truncate">{name}</p>
            <TemperatureBadge temp={lead.temperature} />
          </div>
          {(lead.contactInfo?.company || lead.contactInfo?.designation) && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {[lead.contactInfo?.designation, lead.contactInfo?.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
          <div className="space-y-2">
            {lead.contactInfo?.phone && (
              <a href={`tel:${lead.contactInfo.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#701010] transition-colors">
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0"><Phone className="w-3.5 h-3.5 text-gray-500" /></div>
                {lead.contactInfo.phone}
              </a>
            )}
            {lead.contactInfo?.email && (
              <a href={`mailto:${lead.contactInfo.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#701010] transition-colors">
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5 text-gray-500" /></div>
                {lead.contactInfo.email}
              </a>
            )}
            {lead.contactInfo?.website && (
              <a href={lead.contactInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#701010] transition-colors">
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0"><Globe className="w-3.5 h-3.5 text-gray-500" /></div>
                {lead.contactInfo.website}
              </a>
            )}
            {lead.contactInfo?.company && (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0"><Building2 className="w-3.5 h-3.5 text-gray-400" /></div>
                {lead.contactInfo.company}
              </div>
            )}
          </div>

          {lead.contextSummary && (
            <div className="bg-white border border-gray-100 rounded-lg p-3">
              <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-gray-400 mb-1">Context</p>
              <p className="text-xs text-gray-600 leading-relaxed">{lead.contextSummary}</p>
            </div>
          )}
          {lead.actionItem && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
              <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-emerald-600 mb-1">Next Action</p>
              <p className="text-xs text-emerald-800 leading-relaxed">{lead.actionItem}</p>
            </div>
          )}
          {lead.voiceNoteUrl && (
            <div>
              <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-gray-400 mb-2">Voice Note</p>
              <audio controls src={lead.voiceNoteUrl} className="w-full h-8 rounded-lg" />
            </div>
          )}
          <p className="text-[10px] text-gray-400 font-headline">
            {lead.processedAt
              ? `Processed · ${new Date(lead.processedAt).toLocaleDateString()}`
              : `Captured · ${lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default function PostInsightsPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;

  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<any>({});
  const [post, setPost] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"processed" | "pending">("processed");
  const [processing, setProcessing] = useState(false);

  const fetchLeads = useCallback(async (token: string) => {
    const params = new URLSearchParams({ postId });
    const res = await fetch(`/api/leads/list?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads || []);
    }
  }, [postId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      try {
        const token = await u.getIdToken();
        const userData = await getDocument("users", u.uid, token);
        const dbId = userData?.databaseId || "default";
        const spData = await getDocument("SP_Profile", u.uid, token, dbId);
        setProfileData({ spData });
        const postData = await getDocument("Posts", postId, token, dbId);
        setPost(postData);
        await fetchLeads(token);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router, postId, fetchLeads]);

  const processedLeads = leads.filter(l => l.status === "processed");
  const pendingLeads = leads.filter(l => l.status === "pending" || l.status === "processing");
  const hot = processedLeads.filter(l => l.temperature === "hot").length;
  const warm = processedLeads.filter(l => l.temperature === "warm").length;
  const cold = processedLeads.filter(l => l.temperature === "cold").length;

  const handleProcessAll = async () => {
    setProcessing(true);
    try {
      const token = await user?.getIdToken();
      for (const lead of pendingLeads) {
        await fetch("/api/leads/process", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ leadId: lead.id }),
        });
      }
      if (token) await fetchLeads(token);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#701010] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} profileData={profileData} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[#701010] hover:border-[#701010]/30 transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-serif font-bold text-gray-900">Post Insights</h1>
            {post?.title && <p className="text-xs text-gray-500 mt-0.5 font-headline">{post.title}</p>}
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-gray-400">Total Leads</p>
            <p className="text-2xl font-serif font-bold text-gray-900 mt-0.5">{leads.length}</p>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div>
            <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-gray-400">Processed</p>
            <p className="text-2xl font-serif font-bold text-gray-900 mt-0.5">{processedLeads.length}</p>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div>
            <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-gray-400">Pending</p>
            <p className="text-2xl font-serif font-bold text-amber-600 mt-0.5">{pendingLeads.length}</p>
          </div>
        </div>

        {/* Temperature chart */}
        {processedLeads.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-gray-400 mb-4">Lead Temperature</p>
            <TemperatureDonut hot={hot} warm={warm} cold={cold} />
          </div>
        )}

        {/* Process All button */}
        {pendingLeads.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-serif font-bold text-gray-900">
                  {pendingLeads.length} lead{pendingLeads.length !== 1 ? "s" : ""} awaiting AI
                </p>
                <p className="text-xs text-gray-500 font-headline mt-0.5">
                  Est. cost: ~${(pendingLeads.length * 0.001).toFixed(3)}
                </p>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <button
              onClick={handleProcessAll}
              disabled={processing}
              className="w-full py-2.5 bg-[#701010] hover:bg-[#5a0c0c] text-white rounded-lg text-xs font-headline font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {processing ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing…</>
              ) : (
                "⚡ Process All Leads"
              )}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveTab("processed")}
            className={`flex-1 py-2.5 text-xs font-headline font-bold uppercase tracking-widest transition-all ${activeTab === "processed" ? "bg-[#701010] text-white" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Processed ({processedLeads.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-2.5 text-xs font-headline font-bold uppercase tracking-widest transition-all ${activeTab === "pending" ? "bg-[#701010] text-white" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Pending ({pendingLeads.length})
          </button>
        </div>

        {/* Lead list */}
        {activeTab === "processed" ? (
          processedLeads.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center">
              <p className="text-sm font-headline font-bold uppercase tracking-wider text-gray-400">No processed leads yet</p>
              <p className="text-xs text-gray-400 mt-1">Capture cards at the event, then process them here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {processedLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
            </div>
          )
        ) : (
          pendingLeads.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-headline font-bold uppercase tracking-wider text-gray-400">No pending leads</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLeads.map(lead => (
                <div key={lead.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex items-center gap-3">
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    <img src={lead.cardImageUrl} alt="Card" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-serif font-bold text-gray-700">Awaiting AI processing</p>
                    <p className="text-xs text-gray-400 font-headline mt-0.5">
                      {lead.voiceNoteUrl ? "Card + Voice note" : "Card only"}
                      {lead.textNote ? " + Note" : ""}
                    </p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
