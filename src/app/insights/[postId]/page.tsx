"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import { getDocument } from "@/lib/firestore-rest";
import {
  Phone, Mail, MapPin, Calendar, User as UserIcon,
  Flame, Sun, Snowflake, ArrowLeft, Loader2,
  ChevronRight, Clock, AlertCircle
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

// Horizontal bar chart segment
const BarChart = ({ hot, warm, cold }: { hot: number; warm: number; cold: number }) => {
  const total = hot + warm + cold;
  if (total === 0) return null;
  const hotW = Math.round((hot / total) * 100);
  const warmW = Math.round((warm / total) * 100);
  const coldW = 100 - hotW - warmW;

  const rows = [
    { label: "Hot", count: hot, pct: hotW, color: "bg-red-500", light: "bg-red-50 text-red-700" },
    { label: "Warm", count: warm, pct: warmW, color: "bg-amber-400", light: "bg-amber-50 text-amber-700" },
    { label: "Cold", count: cold, pct: coldW, color: "bg-blue-300", light: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div className="space-y-3">
      {rows.map(({ label, count, pct, color, light }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-gray-400 w-8 shrink-0">{label}</span>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${color}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className={`text-[10px] font-headline font-bold px-1.5 py-0.5 rounded-full ${light} w-6 text-center shrink-0`}>{count}</span>
        </div>
      ))}
    </div>
  );
};

const TemperatureChip = ({ temp }: { temp: "hot" | "warm" | "cold" | null }) => {
  if (!temp) return null;
  const cfg = {
    hot: { icon: Flame, cls: "bg-red-50 text-red-600 border-red-100" },
    warm: { icon: Sun, cls: "bg-amber-50 text-amber-600 border-amber-100" },
    cold: { icon: Snowflake, cls: "bg-blue-50 text-blue-600 border-blue-100" },
  }[temp];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-headline font-bold uppercase tracking-widest border ${cfg.cls}`}>
      <Icon className="w-2.5 h-2.5" />{temp}
    </span>
  );
};

export default function PostInsightsPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;

  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<any>({});
  const [post, setPost] = useState<any>(null);
  const [spProfile, setSpProfile] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  const fetchLeads = useCallback(async (token: string) => {
    const res = await fetch(`/api/leads/list?postId=${postId}`, {
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
        setSpProfile(spData);
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

  const handleProcessAll = async () => {
    setProcessing(true);
    try {
      const token = await user?.getIdToken();
      const pending = leads.filter(l => l.status === "pending");
      for (const lead of pending) {
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

  const processedLeads = leads.filter(l => l.status === "processed");
  const pendingLeads = leads.filter(l => l.status === "pending");
  const hot = processedLeads.filter(l => l.temperature === "hot").length;
  const warm = processedLeads.filter(l => l.temperature === "warm").length;
  const cold = processedLeads.filter(l => l.temperature === "cold").length;

  // Leads with CTAs
  const ctaLeads = processedLeads.filter(l => l.actionItem);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#701010] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const eventDate = post?.date ? new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  const location = [post?.venue, post?.city, post?.country].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} profileData={profileData} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-4">

        {/* ── Back nav ─────────────────────────────────────── */}
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs font-headline font-bold uppercase tracking-widest text-gray-500 hover:text-[#701010] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {/* ── EVENT HEADER CARD ─────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {/* Top accent stripe */}
          <div className="h-1 bg-[#701010]" />
          <div className="p-5">
            {/* Event name */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] mb-1">Event</p>
                <h1 className="text-xl font-serif font-bold text-gray-900 leading-tight">
                  {post?.eventName || "Event Insights"}
                </h1>
              </div>
              <div className="bg-[#701010]/5 border border-[#701010]/10 rounded-lg px-3 py-2 text-center shrink-0">
                <p className="text-2xl font-serif font-bold text-[#701010] leading-none">{leads.length}</p>
                <p className="text-[9px] font-headline uppercase tracking-widest text-[#701010]/70 mt-0.5">leads</p>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 mb-4">
              {eventDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {eventDate}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {location}
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-gray-400 mb-2">Sales Partner</p>
              <div className="flex items-center gap-3">
                {spProfile?.profilePhoto ? (
                  <img src={spProfile.profilePhoto} alt="SP" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-serif font-bold text-gray-900">{spProfile?.fullName || user?.displayName || "—"}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                    {spProfile?.mobilePrimary && (
                      <a href={`tel:${spProfile.mobilePrimary}`} className="text-[10px] text-gray-500 hover:text-[#701010] flex items-center gap-1 transition-colors">
                        <Phone className="w-3 h-3" />{spProfile.mobilePrimary}
                      </a>
                    )}
                    {spProfile?.emailPersonal && (
                      <a href={`mailto:${spProfile.emailPersonal}`} className="text-[10px] text-gray-500 hover:text-[#701010] flex items-center gap-1 transition-colors">
                        <Mail className="w-3 h-3" />{spProfile.emailPersonal}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PENDING ALERT ─────────────────────────────────── */}
        {pendingLeads.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <p className="text-xs text-amber-800 font-headline font-bold">
                {pendingLeads.length} lead{pendingLeads.length !== 1 ? "s" : ""} awaiting AI processing
              </p>
            </div>
            <button
              onClick={handleProcessAll}
              disabled={processing}
              className="shrink-0 px-3 py-1.5 bg-[#701010] text-white rounded-lg text-[10px] font-headline font-bold uppercase tracking-widest hover:bg-[#5a0c0c] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center gap-1.5"
            >
              {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : "⚡"}
              {processing ? "Processing…" : "Process All"}
            </button>
          </div>
        )}

        {/* ── HIGHLIGHTS ─────────────────────────────────────── */}
        {processedLeads.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010]">Highlights</p>
                <p className="text-xs text-gray-400 font-headline mt-0.5">SP notes & context from the floor</p>
              </div>
            </div>
            <div className="space-y-3">
              {processedLeads
                .filter(l => l.contextSummary)
                .map(l => (
                  <div key={l.id} className="flex gap-3 items-start">
                    <div className="w-10 h-7 rounded overflow-hidden bg-gray-100 border border-gray-200 shrink-0 mt-0.5">
                      <img src={l.cardImageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[11px] font-bold text-gray-800 font-serif truncate">
                          {l.contactInfo?.name || "Contact"}
                        </p>
                        <TemperatureChip temp={l.temperature} />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{l.contextSummary}</p>
                    </div>
                  </div>
                ))}
              {processedLeads.filter(l => l.contextSummary).length === 0 && (
                <p className="text-xs text-gray-400 font-headline">No context notes yet — process leads to generate highlights.</p>
              )}
            </div>
          </div>
        )}

        {/* ── TEMPERATURE BREAKDOWN ─────────────────────────── */}
        {processedLeads.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] mb-1">Lead Quality</p>
            <p className="text-xs text-gray-400 font-headline mb-4">Temperature distribution across {processedLeads.length} processed leads</p>
            <BarChart hot={hot} warm={warm} cold={cold} />
          </div>
        )}

        {/* ── CTAs ──────────────────────────────────────────── */}
        {ctaLeads.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] mb-1">Action Items</p>
            <p className="text-xs text-gray-400 font-headline mb-4">Follow-ups identified by AI from voice notes & cards</p>
            <div className="space-y-2.5">
              {ctaLeads.map(l => (
                <div key={l.id} className="flex gap-3 items-start bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <div className="w-10 h-7 rounded overflow-hidden bg-emerald-100 border border-emerald-200 shrink-0 mt-0.5">
                    <img src={l.cardImageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-emerald-800 font-serif truncate mb-0.5">
                      {l.contactInfo?.name || "Contact"}
                      {l.contactInfo?.company ? ` · ${l.contactInfo.company}` : ""}
                    </p>
                    <p className="text-xs text-emerald-700 leading-relaxed">{l.actionItem}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FULL LEAD LIST ─────────────────────────────────── */}
        {processedLeads.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010]">All Contacts</p>
              <p className="text-xs text-gray-400 font-headline mt-0.5">{processedLeads.length} processed leads</p>
            </div>
            <div className="divide-y divide-gray-50">
              {processedLeads.map(lead => (
                <div key={lead.id}>
                  <button
                    onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/70 transition-colors text-left"
                  >
                    <div className="w-12 h-8 rounded overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      <img src={lead.cardImageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-serif font-bold text-gray-900 truncate">
                          {lead.contactInfo?.name || "Unknown"}
                        </p>
                        <TemperatureChip temp={lead.temperature} />
                      </div>
                      <p className="text-[10px] text-gray-400 font-headline truncate mt-0.5">
                        {[lead.contactInfo?.designation, lead.contactInfo?.company].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-gray-300 shrink-0 transition-transform ${expandedLead === lead.id ? "rotate-90" : ""}`} />
                  </button>

                  {expandedLead === lead.id && (
                    <div className="px-5 pb-4 pt-1 bg-gray-50/50 border-t border-gray-100 space-y-3">
                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {lead.contactInfo?.phone && (
                          <a href={`tel:${lead.contactInfo.phone}`} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#701010] transition-colors">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />{lead.contactInfo.phone}
                          </a>
                        )}
                        {lead.contactInfo?.email && (
                          <a href={`mailto:${lead.contactInfo.email}`} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#701010] transition-colors">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />{lead.contactInfo.email}
                          </a>
                        )}
                      </div>
                      {lead.voiceNoteUrl && (
                        <audio controls src={lead.voiceNoteUrl} className="w-full h-8 rounded" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {leads.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-10 text-center">
            <p className="text-sm font-headline font-bold uppercase tracking-wider text-gray-300">No leads captured yet</p>
            <p className="text-xs text-gray-400 mt-1">Scan cards at the event to see insights here.</p>
          </div>
        )}

      </main>
    </div>
  );
}
