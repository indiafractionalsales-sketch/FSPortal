"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import LeadProcessingWidget from "@/components/LeadProcessingWidget";
import { getDocument } from "@/lib/firestore-rest";
import {
  Phone, Mail, Globe, Building2, User as UserIcon,
  Flame, Sun, Snowflake, Clock, CheckCircle2,
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
  createdAt: any;
  processedAt: any | null;
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
    hot: { icon: Flame, label: "Hot", bg: "bg-red-950/40", text: "text-red-400", border: "border-red-800/40" },
    warm: { icon: Sun, label: "Warm", bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-800/40" },
    cold: { icon: Snowflake, label: "Cold", bg: "bg-slate-800/60", text: "text-slate-400", border: "border-slate-700/40" },
  }[temp];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const LeadCard = ({ lead }: { lead: Lead }) => {
  const [expanded, setExpanded] = useState(false);
  const name = lead.contactInfo?.name || "Unknown Contact";
  const company = lead.contactInfo?.company;
  const designation = lead.contactInfo?.designation;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* Card thumbnail */}
        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
          <img src={lead.cardImageUrl} alt="Card" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-white truncate">{name}</p>
            <TemperatureBadge temp={lead.temperature} />
          </div>
          {(company || designation) && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {[designation, company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <ChevronRight className={`w-4 h-4 text-gray-600 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-800 p-4 space-y-4">
          {/* Contact details */}
          <div className="grid grid-cols-1 gap-2">
            {lead.contactInfo?.phone && (
              <a href={`tel:${lead.contactInfo.phone}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors">
                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                </div>
                {lead.contactInfo.phone}
              </a>
            )}
            {lead.contactInfo?.email && (
              <a href={`mailto:${lead.contactInfo.email}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors">
                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                </div>
                {lead.contactInfo.email}
              </a>
            )}
            {lead.contactInfo?.website && (
              <a href={lead.contactInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors">
                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                </div>
                {lead.contactInfo.website}
              </a>
            )}
            {lead.contactInfo?.company && (
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                </div>
                {lead.contactInfo.company}
              </div>
            )}
          </div>

          {/* Context & action */}
          {lead.contextSummary && (
            <div className="bg-gray-800/60 rounded-xl p-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Context</p>
              <p className="text-xs text-gray-300 leading-relaxed">{lead.contextSummary}</p>
            </div>
          )}
          {lead.actionItem && (
            <div className="bg-emerald-950/30 border border-emerald-900/30 rounded-xl p-3">
              <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Next Action</p>
              <p className="text-xs text-emerald-300 leading-relaxed">{lead.actionItem}</p>
            </div>
          )}

          {/* Voice note */}
          {lead.voiceNoteUrl && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Voice Note</p>
              <audio controls src={lead.voiceNoteUrl} className="w-full h-8 rounded-lg" style={{ colorScheme: "dark" }} />
            </div>
          )}

          {/* Captured info */}
          <p className="text-[10px] text-gray-600">
            {lead.processedAt
              ? `Processed · ${new Date(lead.processedAt?.seconds * 1000).toLocaleDateString()}`
              : `Captured · ${new Date(lead.createdAt?.seconds * 1000).toLocaleDateString()}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default function InsightsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<any>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"processed" | "pending">("processed");
  const [databaseId, setDatabaseId] = useState("default");

  const fetchLeads = useCallback(async (uid: string, dbId: string) => {
    try {
      const q = query(
        collection(db, "Leads"),
        where("capturedByUid", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);

      try {
        const token = await u.getIdToken();
        const userData = await getDocument("users", u.uid, token);
        const dbId = userData?.databaseId || "default";
        setDatabaseId(dbId);
        const type = userData?.userType || userData?.role;
        setUserType(type);

        if (type !== "sp") {
          router.push("/home");
          return;
        }

        const spData = await getDocument("SP_Profile", u.uid, token, dbId);
        setProfileData({ spData });
        await fetchLeads(u.uid, dbId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router, fetchLeads]);

  const processedLeads = leads.filter(l => l.status === "processed");
  const pendingLeads = leads.filter(l => l.status === "pending" || l.status === "processing");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar user={user} profileData={profileData} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/home")} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">My Leads</h1>
            <p className="text-xs text-gray-500">
              {processedLeads.length} processed · {pendingLeads.length} pending
            </p>
          </div>
        </div>

        {/* Processing widget */}
        <LeadProcessingWidget onProcessed={() => fetchLeads(user!.uid, databaseId)} />

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveTab("processed")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === "processed"
                ? "bg-white text-gray-900"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Processed ({processedLeads.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === "pending"
                ? "bg-white text-gray-900"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Pending ({pendingLeads.length})
          </button>
        </div>

        {/* Lead list */}
        {activeTab === "processed" ? (
          processedLeads.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle2 className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No processed leads yet.</p>
              <p className="text-xs text-gray-600 mt-1">Capture cards and hit "Process All" above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {processedLeads.map(lead => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          )
        ) : (
          pendingLeads.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No pending leads.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLeads.map(lead => (
                <div key={lead.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
                    <img src={lead.cardImageUrl} alt="Card" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-300">Awaiting AI processing</p>
                    <p className="text-xs text-gray-600 mt-0.5">
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
