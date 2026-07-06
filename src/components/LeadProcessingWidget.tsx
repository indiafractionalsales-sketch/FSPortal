"use client";

import { useState, useEffect, useCallback } from "react";
import { getPendingLeads, batchProcessLeads, PendingLead } from "@/lib/services/leads";
import { Loader2, Zap, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

type WidgetState = "idle" | "loading" | "processing" | "done" | "error";

interface LeadProcessingWidgetProps {
  onProcessed?: () => void;
  postId?: string; // if set, only processes leads for this post
}

export default function LeadProcessingWidget({ onProcessed, postId }: LeadProcessingWidgetProps) {
  const [pendingLeads, setPendingLeads] = useState<PendingLead[]>([]);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setWidgetState("loading");
    try {
      const leads = await getPendingLeads(postId);
      setPendingLeads(leads);
      setWidgetState("idle");
    } catch (err: any) {
      setError(err.message || "Failed to load pending leads");
      setWidgetState("error");
    }
  }, [postId]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleProcessAll = async () => {
    setWidgetState("processing");
    setProgress({ done: 0, total: pendingLeads.length });
    setResult(null);
    setError(null);

    try {
      const res = await batchProcessLeads((done, total) => {
        setProgress({ done, total });
      }, postId);
      setResult(res);
      setWidgetState("done");
      // Refresh pending count + notify parent to refresh lead list
      await fetchPending();
      onProcessed?.();
    } catch (err: any) {
      setError(err.message || "Processing failed");
      setWidgetState("error");
    }
  };

  // ── No pending leads ─────────────────────────────────────────────────────
  if (widgetState === "idle" && pendingLeads.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-900/40 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">All leads processed</p>
          <p className="text-xs text-gray-500 mt-0.5">No pending cards in your queue.</p>
        </div>
        <button onClick={fetchPending} className="ml-auto text-gray-600 hover:text-gray-400 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (widgetState === "loading") {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
        <p className="text-sm text-gray-500">Checking your lead queue…</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (widgetState === "error") {
    return (
      <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-5 flex items-center gap-4">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={fetchPending} className="ml-auto text-gray-500 hover:text-gray-300 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── Processing ───────────────────────────────────────────────────────────
  if (widgetState === "processing") {
    const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
    return (
      <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="w-5 h-5 text-white animate-spin" />
          <p className="text-sm font-semibold text-white">
            AI Processing… {progress.done}/{progress.total}
          </p>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Each lead costs ~$0.001 · Do not close this tab
        </p>
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  if (widgetState === "done" && result) {
    return (
      <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/20 p-5">
        <div className="flex items-center gap-3 mb-1">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-semibold text-white">Processing complete</p>
        </div>
        <p className="text-xs text-gray-400 ml-8">
          {result.success} processed · {result.failed} failed
        </p>
        {result.failed > 0 && (
          <button
            onClick={handleProcessAll}
            className="ml-8 mt-2 text-xs text-amber-400 underline underline-offset-2"
          >
            Retry failed leads
          </button>
        )}
      </div>
    );
  }

  // ── Idle with pending leads ───────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-sm font-semibold text-white">
              {pendingLeads.length} unprocessed lead{pendingLeads.length !== 1 ? "s" : ""}
            </p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Cards captured and ready for AI extraction.{" "}
            Est. cost: ~${(pendingLeads.length * 0.001).toFixed(3)}
          </p>
        </div>
        <button onClick={fetchPending} className="text-gray-600 hover:text-gray-400 transition-colors mt-0.5">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleProcessAll}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 active:scale-95 transition-all"
      >
        <Zap className="w-4 h-4" />
        Process All Leads
      </button>
    </div>
  );
}
