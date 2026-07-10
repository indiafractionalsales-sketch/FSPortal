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

import { useState, useRef, useCallback, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { savePendingLead, processLead, type PendingLead } from "@/lib/services/leads";
import {
  X,
  Camera,
  Upload,
  Mic,
  MicOff,
  AlignLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LeadCaptureInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  targetOwnerUid?: string;
}

type CaptureState = "idle" | "viewfinder" | "saving" | "success";
type ActivePanel = "capture" | "queue";

export default function LeadCaptureInterface({
  isOpen,
  onClose,
  postId,
  targetOwnerUid,
}: LeadCaptureInterfaceProps) {
  // ── Capture Panel State ─────────────────────────────────────────────────
  const [capturedImageBlob, setCapturedImageBlob] = useState<Blob | null>(null);
  const [capturedImagePreview, setCapturedImagePreview] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [textNote, setTextNote] = useState("");
  const [captureState, setCaptureState] = useState<CaptureState>("idle");
  const [leadCount, setLeadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // ── Panel State ─────────────────────────────────────────────────────────
  const [activePanel, setActivePanel] = useState<ActivePanel>("capture");

  // ── Queue Panel State ───────────────────────────────────────────────────
  const [pendingLeads, setPendingLeads] = useState<PendingLead[]>([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [queueRecordingId, setQueueRecordingId] = useState<string | null>(null);
  const [queueRecordingSeconds, setQueueRecordingSeconds] = useState(0);
  const [queueNoteEditId, setQueueNoteEditId] = useState<string | null>(null);
  const [queueNoteText, setQueueNoteText] = useState("");
  const [processingLeadId, setProcessingLeadId] = useState<string | null>(null);
  const [savingNoteLeadId, setSavingNoteLeadId] = useState<string | null>(null);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });

  // ── Refs ────────────────────────────────────────────────────────────────
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Queue-specific audio recording refs
  const queueMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const queueAudioChunksRef = useRef<Blob[]>([]);
  const queueTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setActivePanel("capture");
    }
  }, [isOpen]);

  // Fetch pending leads when Queue tab is activated or after a save
  useEffect(() => {
    if (isOpen && activePanel === "queue") {
      fetchPendingLeads();
    }
  }, [isOpen, activePanel, leadCount]);

  // Attach webcam stream to video element once viewfinder renders
  useEffect(() => {
    if (captureState === "viewfinder" && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [captureState]);

  const fetchPendingLeads = async () => {
    setQueueLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) { setQueueLoading(false); return; }

      const params = new URLSearchParams({ status: "pending" });
      if (postId) params.set("postId", postId);

      const res = await fetch(`/api/leads/list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setPendingLeads((data.leads || []) as PendingLead[]);
    } catch (err) {
      console.error("Failed to fetch pending leads:", err);
    } finally {
      setQueueLoading(false);
    }
  };

  const stopCameraStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const handleImageFile = useCallback((file: File) => {
    setCapturedImageBlob(file);
    const reader = new FileReader();
    reader.onload = (e) => setCapturedImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleCameraClick = async () => {
    if (isMobile) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleImageFile(file);
      };
      input.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 } },
      });
      streamRef.current = stream;
      setCaptureState("viewfinder");
    } catch {
      galleryInputRef.current?.click();
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedImageBlob(blob);
          setCapturedImagePreview(canvas.toDataURL("image/jpeg", 0.85));
        }
      },
      "image/jpeg",
      0.85
    );

    stopCameraStream();
    setCaptureState("idle");
  };

  // ── Capture-panel audio recording ─────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          if (s >= 59) { stopRecording(); return 60; }
          return s + 1;
        });
      }, 1000);
    } catch {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  // ── Save lead (capture panel) ─────────────────────────────────────────
  const handleSubmit = async () => {
    if (!capturedImageBlob) {
      alert("Please capture a visiting card photo first.");
      return;
    }
    setCaptureState("saving");
    try {
      await savePendingLead({
        cardImageBlob: capturedImageBlob,
        voiceNoteBlob: audioBlob,
        textNote: textNote || null,
        postId: postId || null,
        ownerUid: targetOwnerUid || null,
      });

      setLeadCount((c) => c + 1);
      setCaptureState("success");
    } catch (err: any) {
      alert(err.message || "Failed to save lead. Please try again.");
      setCaptureState("idle");
    }
  };

  const resetForNextCard = () => {
    setCapturedImageBlob(null);
    setCapturedImagePreview(null);
    setAudioBlob(null);
    setTextNote("");
    setShowNoteInput(false);
    setIsRecording(false);
    setRecordingSeconds(0);
    setCaptureState("idle");
  };

  // ── Queue-panel: per-card voice note recording ────────────────────────
  const startQueueRecording = async (leadId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      queueMediaRecorderRef.current = mediaRecorder;
      queueAudioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) queueAudioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(queueAudioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        setQueueRecordingId(null);
        setQueueRecordingSeconds(0);
        if (queueTimerRef.current) clearInterval(queueTimerRef.current);

        // Upload the voice note to the lead
        await saveQueueVoiceNote(leadId, blob);
      };

      mediaRecorder.start();
      setQueueRecordingId(leadId);
      setQueueRecordingSeconds(0);

      queueTimerRef.current = setInterval(() => {
        setQueueRecordingSeconds((s) => {
          if (s >= 59) {
            stopQueueRecording();
            return 60;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      alert("Microphone access denied.");
    }
  };

  const stopQueueRecording = () => {
    queueMediaRecorderRef.current?.stop();
    if (queueTimerRef.current) clearInterval(queueTimerRef.current);
  };

  const saveQueueVoiceNote = async (leadId: string, blob: Blob) => {
    setSavingNoteLeadId(leadId);
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      formData.append("leadId", leadId);
      formData.append("voiceNote", blob, "voice.webm");

      const res = await fetch("/api/leads/update-note", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save voice note");
      }

      // Update local state to reflect voice note attached
      setPendingLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, voiceNoteUrl: "updated" } : l
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to save voice note.");
    } finally {
      setSavingNoteLeadId(null);
    }
  };

  const saveQueueTextNote = async (leadId: string) => {
    setSavingNoteLeadId(leadId);
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      formData.append("leadId", leadId);
      formData.append("textNote", queueNoteText);

      const res = await fetch("/api/leads/update-note", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save text note");
      }

      setPendingLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, textNote: queueNoteText } : l
        )
      );
      setQueueNoteEditId(null);
      setQueueNoteText("");
    } catch (err: any) {
      alert(err.message || "Failed to save text note.");
    } finally {
      setSavingNoteLeadId(null);
    }
  };

  // ── Queue-panel: process individual lead ──────────────────────────────
  const handleProcessSingle = async (leadId: string) => {
    setProcessingLeadId(leadId);
    try {
      await processLead(leadId);
      setPendingLeads((prev) => prev.filter((l) => l.id !== leadId));
    } catch (err: any) {
      alert(err.message || "Failed to process lead.");
    } finally {
      setProcessingLeadId(null);
    }
  };

  // ── Queue-panel: batch process all ────────────────────────────────────
  const handleBatchProcess = async () => {
    setBatchProcessing(true);
    setBatchProgress({ done: 0, total: pendingLeads.length });
    let success = 0;

    for (let i = 0; i < pendingLeads.length; i++) {
      try {
        await processLead(pendingLeads[i].id);
        success++;
      } catch (err) {
        console.error(`Failed to process lead ${pendingLeads[i].id}:`, err);
      }
      setBatchProgress({ done: i + 1, total: pendingLeads.length });
    }

    setBatchProcessing(false);
    await fetchPendingLeads();
  };

  const getRelativeTime = (createdAt: any) => {
    if (!createdAt) return "";
    const date = createdAt.seconds ? new Date(createdAt.seconds * 1000) : new Date(createdAt);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-gray-950 flex flex-col">
      {/* Header with Tab Pills */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2">
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
            Lead Capture
          </p>
          {leadCount > 0 && activePanel === "capture" && (
            <p className="text-[10px] text-emerald-400 mt-0.5">
              {leadCount} saved this session
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Pills */}
      <div className="flex gap-1 mx-5 mb-4 p-1 bg-gray-900 rounded-xl border border-gray-800">
        <button
          onClick={() => setActivePanel("capture")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
            activePanel === "capture"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Capture
        </button>
        <button
          onClick={() => setActivePanel("queue")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
            activePanel === "queue"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Queue
          {pendingLeads.length > 0 && activePanel !== "queue" && (
            <span className="ml-1 w-5 h-5 rounded-full bg-amber-500 text-gray-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
              {pendingLeads.length}
            </span>
          )}
          {activePanel === "queue" && pendingLeads.length > 0 && (
            <span className="ml-1 text-[10px] font-bold opacity-60">({pendingLeads.length})</span>
          )}
        </button>
      </div>

      {/* Webcam Viewfinder — full screen camera UI */}
      {captureState === "viewfinder" && (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="flex-1 object-cover w-full"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex items-center justify-between px-10 py-8 bg-black/80 backdrop-blur-sm">
            <button
              onClick={() => { stopCameraStream(); setCaptureState("idle"); }}
              className="w-14 h-14 rounded-full bg-gray-800 flex flex-col items-center justify-center gap-0.5 text-gray-300 hover:bg-gray-700 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
              <span className="text-[8px] uppercase tracking-widest">Close</span>
            </button>
            <button
              onClick={captureSnapshot}
              className="w-24 h-24 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all shadow-2xl border-4 border-gray-200"
            >
              <div className="w-16 h-16 rounded-full bg-white border-[3px] border-gray-400" />
            </button>
            <div className="w-14 h-14" />
          </div>
        </div>
      )}

      {/* ═══ CAPTURE PANEL ═══ */}
      {activePanel === "capture" && (
        <>
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
            {captureState === "success" ? (
              <div className="w-full max-w-sm bg-gray-900 rounded-3xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-white font-bold text-lg">Lead Saved!</p>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Card & note uploaded. Swipe to{" "}
                  <button onClick={() => { resetForNextCard(); setActivePanel("queue"); }} className="text-emerald-400 font-semibold underline underline-offset-2">
                    Queue
                  </button>{" "}
                  to review & process, or scan the next card.
                </p>
              </div>
            ) : (
              <div
                className="w-full max-w-sm aspect-[1.6/1] rounded-2xl overflow-hidden relative cursor-pointer group border-2 border-dashed border-gray-700 hover:border-gray-500 transition-all"
                onClick={handleCameraClick}
              >
                {capturedImagePreview ? (
                  <>
                    <img src={capturedImagePreview} alt="Captured card" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Camera className="w-8 h-8 text-white drop-shadow" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-600">
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center">
                      <Camera className="w-7 h-7" />
                    </div>
                    <p className="text-xs text-gray-600">
                      {isMobile ? "Tap to open camera" : "Tap to open webcam"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {showNoteInput && captureState !== "success" && (
              <textarea
                value={textNote}
                onChange={(e) => setTextNote(e.target.value)}
                placeholder="Add context about this lead..."
                rows={2}
                className="w-full max-w-sm bg-gray-900 text-white text-sm rounded-2xl px-4 py-3 placeholder-gray-600 border border-gray-800 focus:border-gray-600 outline-none resize-none"
                autoFocus
              />
            )}

            {isRecording && (
              <div className="flex items-center gap-2 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono font-bold">
                  {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:
                  {String(recordingSeconds % 60).padStart(2, "0")}
                </span>
              </div>
            )}
            {audioBlob && !isRecording && (
              <p className="text-xs text-emerald-400">✓ Voice note recorded</p>
            )}
          </div>

          {/* Button Grid */}
          <div className="px-6 pb-12">
            {captureState === "success" ? (
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={onClose}
                  className="w-16 h-16 rounded-full bg-gray-800 flex flex-col items-center justify-center gap-1 text-gray-400 hover:bg-gray-700 transition-all"
                >
                  <X className="w-5 h-5" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Done</span>
                </button>
                <button
                  onClick={resetForNextCard}
                  className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center gap-1 shadow-lg hover:bg-gray-100 transition-all active:scale-95"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-900">Next</span>
                </button>
              </div>
            ) : captureState === "saving" ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-20 h-20 rounded-full bg-gray-800 flex flex-col items-center justify-center gap-1">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
                <p className="text-xs text-gray-500">Uploading…</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5 max-w-xs mx-auto">
                {/* Camera */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={handleCameraClick}
                    className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all active:scale-95 relative"
                  >
                    <Camera className={`w-6 h-6 ${capturedImagePreview ? "text-emerald-400" : "text-gray-300"}`} />
                    {capturedImagePreview && (
                      <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-950" />
                    )}
                  </button>
                  <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Camera</span>
                </div>

                {/* Gallery */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all active:scale-95"
                  >
                    <Upload className="w-6 h-6 text-gray-300" />
                  </button>
                  <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Gallery</span>
                </div>

                {/* Voice */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={toggleRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : audioBlob
                        ? "bg-emerald-800 hover:bg-emerald-700"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="w-6 h-6 text-white" />
                    ) : (
                      <Mic className={`w-6 h-6 ${audioBlob ? "text-emerald-400" : "text-gray-300"}`} />
                    )}
                  </button>
                  <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">
                    {isRecording ? "Stop" : "Voice"}
                  </span>
                </div>

                {/* Note */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => setShowNoteInput((v) => !v)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                      showNoteInput || textNote
                        ? "bg-blue-900 hover:bg-blue-800"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    <AlignLeft className={`w-6 h-6 ${textNote ? "text-blue-400" : "text-gray-300"}`} />
                  </button>
                  <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Note</span>
                </div>

                <div />

                {/* Save */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={handleSubmit}
                    disabled={!capturedImagePreview}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                      capturedImagePreview
                        ? "bg-white hover:bg-gray-100"
                        : "bg-gray-800 opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <ChevronRight className={`w-6 h-6 ${capturedImagePreview ? "text-gray-900" : "text-gray-600"}`} />
                  </button>
                  <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Save</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ QUEUE PANEL ═══ */}
      {activePanel === "queue" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {queueLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          ) : pendingLeads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6">
              <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-white">No pending cards</p>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Tap the <span className="text-gray-300 font-semibold">Capture</span> tab to scan visiting cards.
                They'll appear here for review & processing.
              </p>
            </div>
          ) : (
            <>
              {/* Scrollable lead list */}
              <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3 custom-scrollbar">
                {batchProcessing && (
                  <div className="rounded-2xl border border-gray-700 bg-gray-900 p-4 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <p className="text-xs font-bold text-white uppercase tracking-wider">
                        Processing… {batchProgress.done}/{batchProgress.total}
                      </p>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${batchProgress.total > 0 ? Math.round((batchProgress.done / batchProgress.total) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {pendingLeads.map((lead) => {
                  const isExpanded = expandedLeadId === lead.id;
                  const isProcessing = processingLeadId === lead.id;
                  const isSavingNote = savingNoteLeadId === lead.id;
                  const isRecordingThis = queueRecordingId === lead.id;

                  return (
                    <div
                      key={lead.id}
                      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all"
                    >
                      {/* Card header row */}
                      <button
                        onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                        className="w-full flex items-center gap-3 p-3 text-left"
                      >
                        {/* Card thumbnail */}
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
                          <img src={lead.cardImageUrl} alt="Card" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-300">Pending card</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[10px] text-gray-600">{getRelativeTime(lead.createdAt)}</span>
                            {lead.voiceNoteUrl ? (
                              <span className="text-[10px] text-emerald-500 font-semibold">✓ Voice</span>
                            ) : (
                              <span className="text-[10px] text-gray-600">🎤 No note</span>
                            )}
                            {lead.textNote && (
                              <span className="text-[10px] text-blue-400 font-semibold">📝 Note</span>
                            )}
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600 shrink-0" />
                        )}
                      </button>

                      {/* Expanded actions */}
                      {isExpanded && (
                        <div className="border-t border-gray-800 p-4 space-y-3">
                          {/* Card image preview */}
                          <div className="w-full aspect-[1.6/1] rounded-xl overflow-hidden bg-gray-800">
                            <img src={lead.cardImageUrl} alt="Card" className="w-full h-full object-contain" />
                          </div>

                          {/* Voice note section */}
                          <div className="bg-gray-800/60 rounded-xl p-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Voice Note</p>
                            {isRecordingThis ? (
                              <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-mono font-bold text-red-400">
                                  {String(Math.floor(queueRecordingSeconds / 60)).padStart(2, "0")}:
                                  {String(queueRecordingSeconds % 60).padStart(2, "0")}
                                </span>
                                <button
                                  onClick={stopQueueRecording}
                                  className="ml-auto px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all active:scale-95"
                                >
                                  Stop Recording
                                </button>
                              </div>
                            ) : isSavingNote ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                                <span className="text-xs text-gray-400">Saving note…</span>
                              </div>
                            ) : lead.voiceNoteUrl ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-emerald-400 font-semibold">✓ Voice note attached</span>
                                <button
                                  onClick={() => startQueueRecording(lead.id)}
                                  className="ml-auto text-[10px] text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
                                >
                                  Re-record
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startQueueRecording(lead.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold transition-all active:scale-95 w-full justify-center"
                              >
                                <Mic className="w-4 h-4" />
                                Record Voice Note
                              </button>
                            )}
                          </div>

                          {/* Text note section */}
                          <div className="bg-gray-800/60 rounded-xl p-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Text Note</p>
                            {queueNoteEditId === lead.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={queueNoteText}
                                  onChange={(e) => setQueueNoteText(e.target.value)}
                                  placeholder="Add context about this lead..."
                                  rows={2}
                                  className="w-full bg-gray-900 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-600 border border-gray-700 focus:border-gray-500 outline-none resize-none"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveQueueTextNote(lead.id)}
                                    disabled={isSavingNote}
                                    className="flex-1 py-2 rounded-lg bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50"
                                  >
                                    {isSavingNote ? "Saving…" : "Save Note"}
                                  </button>
                                  <button
                                    onClick={() => { setQueueNoteEditId(null); setQueueNoteText(""); }}
                                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-600 transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : lead.textNote ? (
                              <div className="flex items-start gap-2">
                                <p className="text-xs text-gray-300 flex-1 leading-relaxed">{lead.textNote}</p>
                                <button
                                  onClick={() => { setQueueNoteEditId(lead.id); setQueueNoteText(lead.textNote || ""); }}
                                  className="text-[10px] text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors shrink-0"
                                >
                                  Edit
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setQueueNoteEditId(lead.id); setQueueNoteText(""); }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold transition-all active:scale-95 w-full justify-center"
                              >
                                <AlignLeft className="w-4 h-4" />
                                Add Text Note
                              </button>
                            )}
                          </div>

                          {/* Process this lead */}
                          <button
                            onClick={() => handleProcessSingle(lead.id)}
                            disabled={isProcessing || batchProcessing}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing…
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4" />
                                Process This Lead
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Batch process CTA */}
              {!batchProcessing && pendingLeads.length > 0 && (
                <div className="px-5 pb-8 pt-2">
                  <button
                    onClick={handleBatchProcess}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 active:scale-[0.98] transition-all shadow-lg"
                  >
                    <Zap className="w-4 h-4" />
                    Process All ({pendingLeads.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
      />
    </div>
  );
}
