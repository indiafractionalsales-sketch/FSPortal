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
import { savePendingLead } from "@/lib/services/leads";
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
} from "lucide-react";

interface LeadCaptureInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  targetOwnerUid?: string;
}

type CaptureState = "idle" | "viewfinder" | "saving" | "success";

export default function LeadCaptureInterface({
  isOpen,
  onClose,
  postId,
  targetOwnerUid,
}: LeadCaptureInterfaceProps) {
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!isOpen) stopCameraStream();
  }, [isOpen]);

  // Attach webcam stream to video element once viewfinder renders
  useEffect(() => {
    if (captureState === "viewfinder" && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [captureState]);

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

  // ── Save to Storage + Firestore (no AI) ──────────────────────────────────
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
            Lead Capture
          </p>
          {leadCount > 0 && (
            <p className="text-[10px] text-emerald-400 mt-0.5">
              {leadCount} saved this session · Process later from Insights
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {captureState === "success" ? (
          <div className="w-full max-w-sm bg-gray-900 rounded-3xl p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-white font-bold text-lg">Lead Saved!</p>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Card & note uploaded. Head to{" "}
              <span className="text-emerald-400 font-semibold">Insights</span>{" "}
              when you're ready to process them with AI.
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
