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

import { useState, useEffect, useRef } from "react";
import { X, MapPin, ChevronRight, Loader2, ShieldCheck, AlertTriangle, Check, Clock } from "lucide-react";
import { auth } from "@/lib/firebase";

interface AttendanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  clientName: string;
  onSuccess?: () => void;
}

type Mode = "idle" | "scanning" | "active" | "outside_geofence" | "override_submitting" | "success_in" | "success_out";

export default function AttendanceDrawer({ isOpen, onClose, postId, clientName, onSuccess }: AttendanceDrawerProps) {
  const [mode, setMode] = useState<Mode>("idle");
  const [distance, setDistance] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeShift, setActiveShift] = useState<any>(null);
  
  // Override form states
  const [overrideReason, setOverrideReason] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Swipe slider drag state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Stopwatch state
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  useEffect(() => {
    if (isOpen) {
      checkCurrentStatus();
    }
  }, [isOpen, postId]);

  // Stopwatch counter
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === "active" && activeShift?.checkIn?.timestamp) {
      const checkInMs = new Date(activeShift.checkIn.timestamp).getTime();
      
      const updateTimer = () => {
        const now = Date.now();
        const diffMs = now - checkInMs;
        const diffSecs = Math.floor(diffMs / 1000);
        
        const hrs = Math.floor(diffSecs / 3600);
        const mins = Math.floor((diffSecs % 3600) / 60);
        const secs = diffSecs % 60;
        
        setElapsedTime(
          `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
        );
      };

      updateTimer();
      timer = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, activeShift]);

  const checkCurrentStatus = async () => {
    setMode("scanning");
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const res = await fetch(`/api/attendance/status?postId=${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.active) {
        setActiveShift(data.data);
        setMode("active");
      } else {
        setMode("idle");
      }
    } catch {
      setMode("idle");
    }
  };

  const getCoordinates = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      }
    });
  };

  const handleStartCheckIn = async () => {
    setMode("scanning");
    setErrorMsg(null);
    try {
      const pos = await getCoordinates();
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLatitude(lat);
      setLongitude(lng);

      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ postId, latitude: lat, longitude: lng })
      });

      const data = await res.json();

      if (res.ok) {
        setMode("success_in");
        setTimeout(() => {
          checkCurrentStatus();
          onSuccess?.();
        }, 1500);
      } else if (data.error === "OutsideGeofence") {
        setDistance(data.distance);
        setMode("outside_geofence");
      } else {
        throw new Error(data.error || "Failed to check in");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Could not retrieve GPS lock. Please enable location permissions.");
      setMode("idle");
    }
  };

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;

    setMode("override_submitting");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          postId,
          latitude,
          longitude,
          overrideReason
        })
      });

      if (res.ok) {
        setMode("success_in");
        setTimeout(() => {
          checkCurrentStatus();
          onSuccess?.();
        }, 1500);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Override request failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit override request");
      setMode("outside_geofence");
    }
  };

  const handleCheckOut = async () => {
    setMode("scanning");
    try {
      const pos = await getCoordinates();
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/attendance/check-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      });

      if (res.ok) {
        setMode("success_out");
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1500);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Checkout failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "GPS location capture failed. Please retry.");
      setMode("active");
    }
  };

  // Drag handlers for custom slider
  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (mode === "scanning") return;
    setIsDragging(true);
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !sliderRef.current || !handleRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const handleRect = handleRef.current.getBoundingClientRect();
    const maxDrag = sliderRect.width - handleRect.width - 8; // 8px padding/margin

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const currentDrag = Math.max(0, Math.min(clientX - sliderRect.left - handleRect.width / 2, maxDrag));

    setDragX(currentDrag);

    // If reached the end of the slider, trigger action
    if (currentDrag >= maxDrag - 5) {
      setIsDragging(false);
      setDragX(0);
      if (mode === "idle") {
        handleStartCheckIn();
      } else if (mode === "active") {
        handleCheckOut();
      }
    }
  };

  const handleStopDrag = () => {
    setIsDragging(false);
    // Return back to starting position if released before the end
    setDragX(0);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleStopDrag);
      window.addEventListener("touchmove", handleDrag);
      window.addEventListener("touchend", handleStopDrag);
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleStopDrag);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("touchend", handleStopDrag);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0d0e12] border-l border-gray-800 h-full shadow-2xl flex flex-col animate-slide-in-right text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h2 className="font-serif font-bold text-lg">Check-in</h2>
            <p className="text-xs text-gray-500 mt-0.5">{clientName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
          
          {/* Main Visuals & Status */}
          <div className="flex-1 flex flex-col justify-center items-center gap-6">
            
            {/* 1. Radar Scanning State */}
            {mode === "scanning" && (
              <div className="text-center space-y-6">
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                  <span className="absolute w-24 h-24 rounded-full bg-indigo-500/10 animate-pulse" />
                  <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-indigo-400 shadow-lg">
                    <MapPin className="w-6 h-6 animate-bounce" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-300">Locking Coordinates...</p>
                  <p className="text-xs text-gray-500 mt-1">Acquiring high-accuracy GPS lock.</p>
                </div>
              </div>
            )}

            {/* 2. Success Arrive State */}
            {mode === "success_in" && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                  <Check className="w-10 h-10 animate-pulse" />
                </div>
                <div>
                  <p className="text-base font-bold text-emerald-400">Shift Started!</p>
                  <p className="text-xs text-gray-500 mt-1">Your check-in coordinates have been verified.</p>
                </div>
              </div>
            )}

            {/* 3. Success Depart State */}
            {mode === "success_out" && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-400 mx-auto flex items-center justify-center shadow-lg">
                  <Clock className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-base font-bold text-indigo-400">Checked Out Successfully!</p>
                  <p className="text-xs text-gray-500 mt-1">Shift summary logged. Tracking disabled.</p>
                </div>
              </div>
            )}

            {/* 4. Idle Check-In State */}
            {mode === "idle" && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-gray-900 border border-gray-800 text-gray-400 mx-auto flex items-center justify-center shadow-md">
                  <MapPin className="w-10 h-10 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                    You have arrived at <span className="text-white font-semibold">{clientName}</span>. Slide the slider below to verify location and start your shift.
                  </p>
                </div>
                {errorMsg && (
                  <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 max-w-sm mx-auto text-left">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400">{errorMsg}</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. Outside Geofence Override Flow */}
            {mode === "outside_geofence" && (
              <div className="w-full space-y-6">
                <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-400">Location Drift ({distance}m away)</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Verification matches your location to the venue within 100 meters. If you are at the location but experiencing GPS drift, submit a manual check-in request.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleOverrideSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Override Reason</label>
                    <textarea
                      required
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="e.g. Deep inside building lobby causing GPS coordinates drift."
                      rows={4}
                      className="w-full mt-2 bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-xs placeholder-gray-600 focus:border-gray-700 outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white text-gray-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    Request Location Override
                  </button>
                  <button
                    type="button"
                    onClick={handleStartCheckIn}
                    className="w-full py-3.5 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl text-xs uppercase tracking-widest transition-all"
                  >
                    Retry GPS Verification
                  </button>
                </form>
              </div>
            )}

            {/* 6. Submitting Override */}
            {mode === "override_submitting" && (
              <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
                <div>
                  <p className="text-sm font-bold text-amber-300">Submitting Override Request...</p>
                  <p className="text-xs text-gray-500 mt-1">Uploading reasoning. Please do not close.</p>
                </div>
              </div>
            )}

            {/* 7. Active Shift State (Stopwatch) */}
            {mode === "active" && (
              <div className="text-center space-y-6 w-full">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Shift Stopwatch</p>
                  <h1 className="text-5xl font-light font-mono text-white tracking-widest">{elapsedTime}</h1>
                </div>

                <div className="bg-emerald-950/15 border border-emerald-900/40 rounded-xl p-4 flex items-center justify-center gap-2.5 max-w-xs mx-auto">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Verified On-Site</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                  Shift started at {activeShift?.checkIn?.timestamp ? new Date(activeShift.checkIn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}. Slide below to log out.
                </p>

                {errorMsg && (
                  <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 max-w-sm mx-auto text-left">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400">{errorMsg}</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Swipe Slider Control Footer */}
          {(mode === "idle" || mode === "active") && (
            <div className="pt-8">
              <div
                ref={sliderRef}
                className="relative w-full h-14 bg-gray-900 rounded-full border border-gray-800 flex items-center justify-center overflow-hidden"
              >
                {/* Track Background highlights */}
                <div 
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${mode === 'idle' ? 'from-indigo-600/30' : 'from-indigo-600/30'} transition-opacity`}
                  style={{ width: `${dragX + 48}px` }} 
                />
                
                {/* Swipe Label Text */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 select-none">
                  {mode === "idle" ? "Slide to Arrive" : "Slide to Depart / Adios"}
                </span>

                {/* Drag Handle */}
                <div
                  ref={handleRef}
                  onMouseDown={handleStartDrag}
                  onTouchStart={handleStartDrag}
                  className="absolute left-1 w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg transition-transform duration-75 select-none"
                  style={{ 
                    transform: `translateX(${dragX}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                  }}
                >
                  <ChevronRight className="w-5 h-5 text-gray-950" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
