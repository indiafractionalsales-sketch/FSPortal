"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Camera, Mic, MicOff, Check, Loader2, RotateCcw, Upload } from "lucide-react";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface LeadCaptureInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  targetOwnerUid?: string;
}

export default function LeadCaptureInterface({
  isOpen,
  onClose,
  postId,
  targetOwnerUid,
}: LeadCaptureInterfaceProps) {
  // States
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedImageFile, setCapturedImageFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [textNote, setTextNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [useTextMode, setUseTextMode] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const MAX_RECORDING_SECONDS = 60;

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      resetState();
      stopRecording();
    }
  }, [isOpen]);

  const resetState = () => {
    setCapturedImage(null);
    setCapturedImageFile(null);
    setAudioBlob(null);
    setRecordingDuration(0);
    setTextNote("");
    setIsProcessing(false);
    setShowSuccess(false);
    setLastResult(null);
  };

  const resetForNextCapture = () => {
    setCapturedImage(null);
    setCapturedImageFile(null);
    setAudioBlob(null);
    setRecordingDuration(0);
    setTextNote("");
    setShowSuccess(false);
    setLastResult(null);
  };

  // Image capture
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input for next capture
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        // Stop the stream tracks
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // Timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= MAX_RECORDING_SECONDS - 1) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to record voice notes.");
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  }, []);

  // Upload & Process
  const handleSubmit = async () => {
    if (!capturedImageFile) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please sign in first.");
      return;
    }

    setIsProcessing(true);

    try {
      const token = await currentUser.getIdToken();
      const timestamp = Date.now();

      // Upload image to Firebase Storage
      const imageRef = ref(storage, `leads/${currentUser.uid}/${timestamp}_card.jpg`);
      await uploadBytes(imageRef, capturedImageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Upload audio if available
      let audioUrl: string | undefined;
      if (audioBlob) {
        const audioRef = ref(storage, `leads/${currentUser.uid}/${timestamp}_note.webm`);
        await uploadBytes(audioRef, audioBlob);
        audioUrl = await getDownloadURL(audioRef);
      }

      // Call the processing API
      const res = await fetch("/api/leads/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl,
          audioUrl,
          textNote: textNote || undefined,
          postId: postId || undefined,
          ownerUid: targetOwnerUid || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLastResult(data.data);
        setProcessedCount((prev) => prev + 1);
        setShowSuccess(true);

        // Auto-reset for next capture after a brief animation
        setTimeout(() => {
          resetForNextCapture();
        }, 3000);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to process lead");
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      alert("Failed to submit lead. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-gray-950 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 z-10">
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-white font-serif font-bold text-sm">Capture Lead</p>
          {processedCount > 0 && (
            <p className="text-emerald-400 text-[10px] font-headline font-bold uppercase tracking-wider">
              {processedCount} captured this session
            </p>
          )}
        </div>
        {/* Placeholder for token pill (future) */}
        <div className="w-9" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto">
        {showSuccess && lastResult ? (
          /* Success State */
          <div className="text-center animate-in fade-in zoom-in-95 duration-300 max-w-sm">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-white font-serif font-bold text-xl mb-2">Lead Captured!</p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left mb-4">
              <p className="text-white font-semibold text-sm">
                {lastResult.contactInfo?.name || "Contact"}
              </p>
              <p className="text-gray-400 text-xs">
                {lastResult.contactInfo?.company || ""}{" "}
                {lastResult.contactInfo?.designation ? `• ${lastResult.contactInfo.designation}` : ""}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    lastResult.temperature === "hot"
                      ? "bg-red-500/20 text-red-400"
                      : lastResult.temperature === "warm"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {lastResult.temperature}
                </span>
              </div>
              <p className="text-gray-300 text-xs mt-2">{lastResult.actionItem}</p>
            </div>
            <p className="text-gray-500 text-xs">Next card loading automatically...</p>
          </div>
        ) : isProcessing ? (
          /* Processing State */
          <div className="text-center animate-pulse">
            <Loader2 className="w-16 h-16 text-[#701010] animate-spin mx-auto mb-4" />
            <p className="text-white font-serif font-bold text-lg">Processing with AI...</p>
            <p className="text-gray-400 text-xs mt-1">Extracting card data & analyzing voice note</p>
          </div>
        ) : capturedImage ? (
          /* Image Captured - Record Note */
          <div className="w-full max-w-sm">
            {/* Card Preview */}
            <div className="relative rounded-xl overflow-hidden mb-6 shadow-2xl">
              <img
                src={capturedImage}
                alt="Captured card"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setCapturedImageFile(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Note section */}
            <div className="text-center mb-4">
              <p className="text-white font-serif font-bold text-base mb-1">
                Add context
              </p>
              <p className="text-gray-500 text-xs">
                Record a voice note or type your tags
              </p>
              {/* Toggle */}
              <button
                onClick={() => setUseTextMode(!useTextMode)}
                className="mt-2 text-[10px] font-headline font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                {useTextMode ? "🎙 Switch to voice" : "⌨️ Switch to text"}
              </button>
            </div>

            {useTextMode ? (
              /* Text Note Mode */
              <textarea
                value={textNote}
                onChange={(e) => setTextNote(e.target.value)}
                placeholder='e.g. "Tag HOT LEAD, schedule demo next Monday. They need our software for Dubai factory."'
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-[#701010]/50 focus:border-[#701010]/30"
                rows={4}
              />
            ) : (
              /* Voice Note Mode */
              <div className="flex flex-col items-center">
                {audioBlob ? (
                  <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 mb-4">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                    <p className="text-white text-sm font-medium">
                      {recordingDuration}s recorded
                    </p>
                    <button
                      onClick={() => {
                        setAudioBlob(null);
                        setRecordingDuration(0);
                      }}
                      className="text-gray-400 hover:text-white ml-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                ) : isRecording ? (
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                      <button
                        onClick={stopRecording}
                        className="relative w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-500/30"
                      >
                        <MicOff className="w-8 h-8 text-white" />
                      </button>
                    </div>
                    <p className="text-red-400 text-sm font-medium mt-3 animate-pulse">
                      Recording... {recordingDuration}s / {MAX_RECORDING_SECONDS}s
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Tap to stop
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center mb-4">
                    <button
                      onClick={startRecording}
                      className="w-20 h-20 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    >
                      <Mic className="w-8 h-8 text-white" />
                    </button>
                    <p className="text-gray-400 text-sm mt-3">
                      Tap to record (up to {MAX_RECORDING_SECONDS}s)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Initial State - Capture Card */
          <div className="text-center">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-12 h-12 text-gray-600" />
              </div>
              <p className="text-white font-serif font-bold text-lg mb-1">
                Snap a Visiting Card
              </p>
              <p className="text-gray-500 text-xs max-w-xs mx-auto">
                Take a photo or upload an image of a business card, LinkedIn profile, or email signature
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-[#701010] hover:bg-[#5a0c0c] text-white rounded-xl font-headline font-bold uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#701010]/20"
              >
                <Camera className="w-5 h-5" />
                Open Camera
              </button>
              <button
                onClick={() => {
                  // Create a separate input for gallery
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCapturedImageFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setCapturedImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-headline font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 border border-gray-700"
              >
                <Upload className="w-4 h-4" />
                Upload from Gallery
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {capturedImage && !showSuccess && !isProcessing && (
        <div className="px-4 py-4 bg-gray-950 border-t border-gray-800">
          <button
            onClick={handleSubmit}
            disabled={!capturedImageFile}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-headline font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Check className="w-5 h-5" />
            Submit & Capture Next
          </button>
        </div>
      )}
    </div>
  );
}
