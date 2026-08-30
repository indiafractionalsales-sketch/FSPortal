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

"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Maximize2, Building2, User, ChevronRight, Star, RotateCcw, Search } from "lucide-react";
import { auth } from "@/lib/firebase";
import {
  fetchUserInquiries,
  fetchInquiryMessages,
  sendChatMessage,
  submitReview,
  submitAgencyInquiry,
  MarketplaceInquiry,
  ChatMessage,
  MarketplaceAgency
} from "@/lib/marketplace-service";
import ReviewRequestCard from "@/components/ReviewRequestCard";
import Link from "next/link";interface GuidedInquiryState {
  agency: MarketplaceAgency;
  step: 1 | 2 | 3 | 4 | 5;
  targetRegion: string;
  requirements: string;
  budget: string;
  timeline: string;
}

export default function QuickChatDockWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inquiries, setInquiries] = useState<MarketplaceInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<MarketplaceInquiry | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Multi-Thread Dock View State
  const [viewMode, setViewMode] = useState<"list" | "chat">("chat");
  const [threadSearchQuery, setThreadSearchQuery] = useState("");

  // Guided Chat Inquiry State
  const [guidedInquiry, setGuidedInquiry] = useState<GuidedInquiryState | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  // Listen for global open_inquiry_chat events from Marketplace cards
  useEffect(() => {
    const handleOpenInquiryChat = (e: Event) => {
      const customEvt = e as CustomEvent<{ agency: MarketplaceAgency }>;
      if (!customEvt.detail?.agency) return;

      const targetAgency = customEvt.detail.agency;
      setIsOpen(true);
      setViewMode("chat");

      // Check if user already has an inquiry thread with this agency owner / user
      const existingInq = inquiries.find(
        (i) => i.agencyOwnerUid === targetAgency.ownerUid || i.buyerUid === targetAgency.ownerUid || i.agencyId === targetAgency.id
      );
      if (existingInq) {
        setSelectedInquiry(existingInq);
        setGuidedInquiry(null);
      } else {
        // Start Guided Conversational Assistant
        setSelectedInquiry(null);
        setGuidedInquiry({
          agency: targetAgency,
          step: 1,
          targetRegion: "",
          requirements: "",
          budget: "",
          timeline: ""
        });
      }
    };

    window.addEventListener("open_inquiry_chat", handleOpenInquiryChat);
    return () => window.removeEventListener("open_inquiry_chat", handleOpenInquiryChat);
  }, [inquiries]);

  // Listen for global open_direct_post_chat events from Feed Posts & Deals
  useEffect(() => {
    const handleOpenDirectPostChat = async (e: Event) => {
      const customEvt = e as CustomEvent<{
        recipientUid: string;
        recipientName: string;
        postTitle: string;
        postId: string;
      }>;
      if (!customEvt.detail?.recipientUid || !currentUser) return;

      const { recipientUid, recipientName, postTitle, postId } = customEvt.detail;

      // Guard: self-chat
      if (recipientUid === currentUser.uid) return;

      setIsOpen(true);
      setViewMode("chat");
      setGuidedInquiry(null);

      // Check if thread already exists between currentUser and recipientUid
      const existingInq = inquiries.find(
        (i) => i.agencyOwnerUid === recipientUid || i.buyerUid === recipientUid
      );

      if (existingInq) {
        setSelectedInquiry(existingInq);
      } else {
        // Create a direct chat thread for this post
        try {
          const idToken = await currentUser.getIdToken();
          const payload: MarketplaceInquiry = {
            agencyId: postId || "post_direct",
            agencyName: recipientName || "Partner",
            agencyOwnerUid: recipientUid,
            buyerUid: currentUser.uid,
            buyerName: currentUser.displayName || "Marketplace User",
            buyerEmail: currentUser.email || "",
            buyerPersona: "User",
            projectRequirements: `Hi! I'm reaching out regarding your post: "${postTitle}"`,
            timeline: "Immediate",
            channelType: "post_direct",
            contextId: postId,
            contextTitle: postTitle,
            status: "new",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const newInquiryId = await submitAgencyInquiry(payload, idToken);
          const updated = await fetchUserInquiries(currentUser.uid, idToken);
          setInquiries(updated);
          const createdInq = updated.find(i => (i.id || i.__id) === newInquiryId) || {
            ...payload,
            id: newInquiryId
          };
          setSelectedInquiry(createdInq);
        } catch (err) {
          console.error("Failed to start direct post chat thread:", err);
        }
      }
    };

    window.addEventListener("open_direct_post_chat", handleOpenDirectPostChat);
    return () => window.removeEventListener("open_direct_post_chat", handleOpenDirectPostChat);
  }, [inquiries, currentUser]);

  // Load active user inquiries when dock is opened
  useEffect(() => {
    async function loadInquiries() {
      if (!currentUser || !isOpen) return;
      setIsLoading(true);
      try {
        const idToken = await currentUser.getIdToken();
        const data = await fetchUserInquiries(currentUser.uid, idToken);
        setInquiries(data);
        if (data.length > 0 && !selectedInquiry && !guidedInquiry) {
          setSelectedInquiry(data[0]);
        }
      } catch (err) {
        console.warn("Failed to load inquiries for quick dock:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInquiries();
  }, [isOpen, currentUser]);

  // Load messages for active thread
  useEffect(() => {
    async function loadMessages() {
      if (!currentUser || !selectedInquiry) return;
      try {
        const idToken = await currentUser.getIdToken();
        const msgs = await fetchInquiryMessages(selectedInquiry.id || selectedInquiry.__id || "", idToken);
        setMessages(msgs);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (err) {
        console.warn("Failed to load thread messages:", err);
      }
    }
    loadMessages();
  }, [selectedInquiry, currentUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    if (guidedInquiry) {
      handleGuidedStepSubmit(inputText.trim());
      return;
    }

    if (!selectedInquiry) return;

    setIsSending(true);
    try {
      const idToken = await currentUser.getIdToken();
      const isAgency = currentUser.uid === selectedInquiry.agencyOwnerUid;
      const textToSend = inputText;
      setInputText("");

      await sendChatMessage(
        selectedInquiry.id || selectedInquiry.__id || "",
        {
          senderUid: currentUser.uid,
          senderName: currentUser.displayName || (isAgency ? selectedInquiry.agencyName : selectedInquiry.buyerName),
          senderType: isAgency ? "agency" : "buyer",
          text: textToSend
        },
        idToken
      );

      // Refresh messages
      const updatedMsgs = await fetchInquiryMessages(selectedInquiry.id || selectedInquiry.__id || "", idToken);
      setMessages(updatedMsgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Failed to send message in quick chat:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleGuidedStepSubmit = async (answerValue: string) => {
    if (!guidedInquiry || !currentUser) return;

    if (guidedInquiry.step === 1) {
      setGuidedInquiry({
        ...guidedInquiry,
        targetRegion: answerValue,
        step: 2
      });
      setInputText("");
    } else if (guidedInquiry.step === 2) {
      setGuidedInquiry({
        ...guidedInquiry,
        requirements: answerValue,
        step: 3
      });
      setInputText("");
    } else if (guidedInquiry.step === 3) {
      setGuidedInquiry({
        ...guidedInquiry,
        budget: answerValue,
        step: 4
      });
      setInputText("");
    } else if (guidedInquiry.step === 4) {
      const finalTimeline = answerValue;
      const finalRegion = guidedInquiry.targetRegion;
      const finalRequirements = guidedInquiry.requirements;
      const finalBudget = guidedInquiry.budget;
      const targetAgency = guidedInquiry.agency;

      setGuidedInquiry({
        ...guidedInquiry,
        timeline: finalTimeline,
        step: 5
      });
      setIsSending(true);

      try {
        const idToken = await currentUser.getIdToken();
        const payload: MarketplaceInquiry = {
          agencyId: targetAgency.id || targetAgency.__id || "agency_demo",
          agencyName: targetAgency.name,
          agencyOwnerUid: targetAgency.ownerUid || "owner_demo",
          buyerUid: currentUser.uid,
          buyerName: currentUser.displayName || "Marketplace Buyer",
          buyerEmail: currentUser.email || "",
          buyerPersona: "buyer",
          projectRequirements: finalRequirements,
          timeline: `${finalTimeline} (${finalRegion ? `Target: ${finalRegion}` : "Global"})`,
          estimatedBudget: finalBudget,
          status: "new",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const newInquiryId = await submitAgencyInquiry(payload, idToken);

        // Background executive teaser email notification
        fetch("/api/mailer/inquiry-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agencyOwnerEmail: targetAgency.ownerEmail || "partner@fractionalsales.com",
            agencyName: targetAgency.name,
            category: targetAgency.category,
            region: targetAgency.region,
            inquiryId: newInquiryId
          })
        }).catch(err => console.warn("Failed background inquiry email:", err));

        // Refresh user inquiries & select new thread
        const updatedInquiries = await fetchUserInquiries(currentUser.uid, idToken);
        setInquiries(updatedInquiries);
        const createdInq = updatedInquiries.find(i => (i.id || i.__id) === newInquiryId) || {
          ...payload,
          id: newInquiryId
        };
        setSelectedInquiry(createdInq);
        setGuidedInquiry(null);
        setViewMode("chat");
      } catch (err) {
        console.error("Failed to complete guided inquiry:", err);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleStartOver = () => {
    if (!guidedInquiry) return;
    setGuidedInquiry({
      agency: guidedInquiry.agency,
      step: 1,
      targetRegion: "",
      requirements: "",
      budget: "",
      timeline: ""
    });
    setInputText("");
  };

  const handleRequestReview = async () => {
    if (!selectedInquiry || !currentUser) return;
    try {
      const idToken = await currentUser.getIdToken();
      await sendChatMessage(
        selectedInquiry.id || selectedInquiry.__id || "",
        {
          senderUid: currentUser.uid,
          senderName: selectedInquiry.agencyName,
          senderType: "agency",
          text: "Review requested for this engagement.",
          cardType: "review_request",
          cardData: {
            agencyId: selectedInquiry.agencyId,
            agencyName: selectedInquiry.agencyName
          }
        },
        idToken
      );
      const updatedMsgs = await fetchInquiryMessages(selectedInquiry.id || selectedInquiry.__id || "", idToken);
      setMessages(updatedMsgs);
    } catch (err) {
      console.error("Error sending review request card:", err);
    }
  };

  if (!currentUser) return null;

  const filteredInquiries = inquiries.filter((inq) => {
    if (!threadSearchQuery.trim()) return true;
    const q = threadSearchQuery.toLowerCase();
    const matchAgency = inq.agencyName.toLowerCase().includes(q);
    const matchBuyer = inq.buyerName.toLowerCase().includes(q);
    const matchReq = inq.projectRequirements.toLowerCase().includes(q);
    return matchAgency || matchBuyer || matchReq;
  });

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div className="w-[320px] sm:w-[335px] h-[360px] sm:h-[390px] max-h-[calc(100vh-140px)] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-gray-900 via-slate-900 to-[#701010] text-white flex items-center justify-between shadow-xs">
            
            {/* Left Header Section: Back Button (in Chat mode) + Title */}
            <div className="flex items-center gap-2 min-w-0">
              
              {/* Screen 2 Back Button */}
              {viewMode === "chat" && !guidedInquiry && (
                <button
                  onClick={() => setViewMode("list")}
                  className="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                  title="Back to Conversations List"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 text-white" />
                </button>
              )}

              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold flex-shrink-0">
                <MessageSquare className="w-3.5 h-3.5 text-white" />
              </div>

              <div className="min-w-0">
                <h4 className="font-serif font-bold text-xs text-white leading-tight truncate">
                  {guidedInquiry
                    ? `Inquiry: ${guidedInquiry.agency.name}`
                    : viewMode === "list"
                    ? "Conversations"
                    : selectedInquiry
                    ? (currentUser?.uid === selectedInquiry.agencyOwnerUid ? selectedInquiry.buyerName : selectedInquiry.agencyName)
                    : "Lead Messages"}
                </h4>
                <p className="text-[10px] text-gray-300 font-headline truncate">
                  {guidedInquiry
                    ? `Guided Assistant (Step ${guidedInquiry.step}/4)`
                    : viewMode === "list"
                    ? `${inquiries.length} Connected Lead${inquiries.length === 1 ? "" : "s"}`
                    : selectedInquiry
                    ? `Ref: #${(selectedInquiry.id || "").slice(-6)}`
                    : "Marketplace Chat"}
                </p>
              </div>
            </div>

            {/* Right Header Section: Actions (Start Over/Cancel, Expand, Close) */}
            <div className="flex items-center gap-1">
              {guidedInquiry && (
                <div className="flex items-center gap-1 mr-1">
                  {guidedInquiry.step > 1 && (
                    <button
                      onClick={handleStartOver}
                      className="px-2 py-0.5 text-[10px] font-headline font-bold text-sky-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                      title="Start over from Step 1"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Reset
                    </button>
                  )}
                  <button
                    onClick={() => setGuidedInquiry(null)}
                    className="px-2 py-0.5 text-[10px] font-headline font-bold text-amber-300 hover:text-white bg-white/10 rounded-md transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <Link
                href={selectedInquiry ? `/messages?inquiryId=${selectedInquiry.id || selectedInquiry.__id}` : "/messages"}
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Expand to Full Workspace (/messages)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Message History Window / Guided Assistant Stream / Screen 1 Inbox List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/50 custom-scrollbar">
            {guidedInquiry ? (
              <div className="space-y-3">
                {/* Bot Greeting & Step 1 Prompt: Target Region */}
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-headline font-bold text-[#701010] mb-0.5">
                    🤖 Inquiry Assistant
                  </span>
                  <div className="max-w-[88%] px-3 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-none text-xs font-sans leading-relaxed shadow-2xs space-y-2">
                    <p>Hello! 👋 Let&apos;s set up your inquiry for <strong>{guidedInquiry.agency.name}</strong>.</p>
                    <p><strong>Step 1 of 4:</strong> What target country or region of operation are you looking to expand into?</p>
                    {guidedInquiry.step === 1 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {["India", "United States", "United Kingdom", "Singapore", "GCC / Middle East", "Europe", "Global"].map((r) => (
                          <button
                            key={r}
                            onClick={() => handleGuidedStepSubmit(r)}
                            className="px-2 py-1 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-headline font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 1 Answered */}
                {guidedInquiry.step >= 2 && (
                  <>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-headline font-bold text-gray-400 mb-0.5">You</span>
                      <div className="max-w-[82%] px-3 py-2 bg-[#701010] text-white rounded-2xl rounded-br-none text-xs font-sans leading-relaxed shadow-2xs">
                        {guidedInquiry.targetRegion}
                      </div>
                    </div>

                    {/* Step 2 Prompt: Requirement Details */}
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] font-headline font-bold text-[#701010] mb-0.5">
                        🤖 Inquiry Assistant
                      </span>
                      <div className="max-w-[88%] px-3 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-none text-xs font-sans leading-relaxed shadow-2xs">
                        Got it! <strong>Step 2 of 4:</strong> Could you tell me a bit about what you&apos;re looking for — the requirement, key deliverables, or product/scope of work?
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2 Answered */}
                {guidedInquiry.step >= 3 && (
                  <>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-headline font-bold text-gray-400 mb-0.5">You</span>
                      <div className="max-w-[82%] px-3 py-2 bg-[#701010] text-white rounded-2xl rounded-br-none text-xs font-sans leading-relaxed shadow-2xs">
                        {guidedInquiry.requirements}
                      </div>
                    </div>

                    {/* Step 3 Prompt: Est. Monthly Budget */}
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] font-headline font-bold text-[#701010] mb-0.5">
                        🤖 Inquiry Assistant
                      </span>
                      <div className="max-w-[88%] px-3 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-none text-xs font-sans leading-relaxed shadow-2xs space-y-2">
                        <p>Understood! <strong>Step 3 of 4:</strong> What is your estimated monthly budget for this engagement?</p>
                        {guidedInquiry.step === 3 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {["Under $1,000", "$1,000 - $5,000", "$5,000 - $15,000", "$15,000+", "To Be Discussed"].map((b) => (
                              <button
                                key={b}
                                onClick={() => handleGuidedStepSubmit(b)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-headline font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3 Answered */}
                {guidedInquiry.step >= 4 && (
                  <>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-headline font-bold text-gray-400 mb-0.5">You</span>
                      <div className="max-w-[82%] px-3 py-2 bg-[#701010] text-white rounded-2xl rounded-br-none text-xs font-sans leading-relaxed shadow-2xs">
                        {guidedInquiry.budget}
                      </div>
                    </div>

                    {/* Step 4 Prompt: Project Timeline */}
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] font-headline font-bold text-[#701010] mb-0.5">
                        🤖 Inquiry Assistant
                      </span>
                      <div className="max-w-[88%] px-3 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-none text-xs font-sans leading-relaxed shadow-2xs space-y-2">
                        <p>Great! <strong>Step 4 of 4:</strong> What is your expected project execution timeline?</p>
                        {guidedInquiry.step === 4 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {["Immediate (< 2 weeks)", "Within 1 Month", "1 - 3 Months", "Planning Phase"].map((t) => (
                              <button
                                key={t}
                                onClick={() => handleGuidedStepSubmit(t)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-headline font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 5 Submitting */}
                {guidedInquiry.step === 5 && (
                  <div className="py-4 text-center text-xs font-headline font-bold text-[#701010] animate-pulse">
                    ⚡ Creating live inquiry thread & notifying {guidedInquiry.agency.name}...
                  </div>
                )}

                {/* Inline Start Over Option */}
                {guidedInquiry.step > 1 && guidedInquiry.step < 5 && (
                  <div className="pt-1 text-right">
                    <button
                      type="button"
                      onClick={handleStartOver}
                      className="text-[10px] font-headline font-bold text-gray-400 hover:text-[#701010] underline transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Start over from Step 1
                    </button>
                  </div>
                )}
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search active conversations..."
                    value={threadSearchQuery}
                    onChange={(e) => setThreadSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] transition-all"
                  />
                </div>

                {filteredInquiries.length === 0 ? (
                  <div className="py-12 text-center space-y-1 text-gray-400">
                    <p className="text-xs font-headline font-bold">No Matching Conversations</p>
                    <p className="text-[10px]">Try clearing search keywords.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredInquiries.map((inq) => {
                      const isSelected = (selectedInquiry?.id || selectedInquiry?.__id) === (inq.id || inq.__id);
                      const isAgencyOwner = currentUser?.uid === inq.agencyOwnerUid;
                      const contactName = isAgencyOwner ? inq.buyerName : inq.agencyName;

                      return (
                        <div
                          key={inq.id || inq.__id}
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setViewMode("chat");
                          }}
                          className={`p-3 bg-white border rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-start gap-3 group ${
                            isSelected ? "border-[#701010] ring-1 ring-[#701010]/20" : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#701010]/10 text-[#701010] flex-shrink-0 flex items-center justify-center font-bold text-xs font-serif">
                            {contactName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className="font-serif font-bold text-xs text-gray-900 truncate group-hover:text-[#701010]">
                                {contactName}
                              </h5>
                              <span className="text-[9px] font-headline text-gray-400 flex-shrink-0">
                                {new Date(inq.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-headline truncate">
                              {isAgencyOwner ? `Inquiry for ${inq.agencyName}` : `Partner: ${inq.agencyName}`}
                            </p>
                            <p className="text-[11px] text-gray-600 truncate mt-0.5 font-sans">
                              {inq.projectRequirements}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : isLoading ? (
              <div className="py-12 text-center text-xs text-gray-400">Loading messages...</div>
            ) : inquiries.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-xs font-headline text-gray-500 font-bold">No Active Lead Messages</p>
                <p className="text-[11px] text-gray-400 max-w-[240px] mx-auto">
                  Click &quot;Request Quote / Connect&quot; on any agency card to start an inquiry chat!
                </p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.senderUid === currentUser.uid;

                if (msg.cardType === "review_request") {
                  return (
                    <ReviewRequestCard
                      key={msg.id || msg.__id || i}
                      inquiryId={selectedInquiry?.id || ""}
                      agencyId={selectedInquiry?.agencyId || ""}
                      agencyName={selectedInquiry?.agencyName || ""}
                      agencyOwnerUid={selectedInquiry?.agencyOwnerUid || ""}
                      buyerUid={selectedInquiry?.buyerUid || ""}
                      currentUserUid={currentUser.uid}
                      onSubmitReview={async (rating, comment) => {
                        const idToken = await currentUser.getIdToken();
                        await submitReview(
                          selectedInquiry?.id || "",
                          selectedInquiry?.agencyId || "",
                          currentUser.uid,
                          currentUser.displayName || selectedInquiry?.buyerName || "Buyer",
                          selectedInquiry?.agencyOwnerUid || "",
                          rating,
                          comment,
                          idToken
                        );
                      }}
                    />
                  );
                }

                if (msg.text.includes("reaching out regarding your post")) {
                  const postTopic = msg.text.includes(":") ? msg.text.split(":")[1]?.replace(/"/g, "")?.trim() : "Feed Post";
                  return (
                    <div key={msg.id || msg.__id || i} className="w-full my-1 flex flex-col items-start">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[9px] font-headline font-bold text-gray-400">{msg.senderName}</span>
                        <span className="text-[8px] text-gray-300">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="w-full bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 shadow-2xs text-gray-800 space-y-1 font-sans">
                        <div className="flex items-center gap-1.5 text-amber-900 font-headline font-bold text-[9px] uppercase tracking-wider">
                          <span>📌 Feed Post Context</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 leading-snug">
                          {postTopic}
                        </p>
                      </div>
                    </div>
                  );
                }

                if (msg.text.includes("FORMAL BUSINESS INQUIRY")) {
                  const lines = msg.text.split("\n").map(l => l.trim()).filter(Boolean);
                  const targetRegion = lines.find(l => l.includes("Target Country"))?.split(":")[1]?.trim() || "";
                  const scope = lines.find(l => l.includes("Scope of Work"))?.split(":")[1]?.trim() || "";
                  const budget = lines.find(l => l.includes("Monthly Budget"))?.split(":")[1]?.trim() || "";
                  const timeline = lines.find(l => l.includes("Execution Timeline"))?.split(":")[1]?.trim() || "";

                  return (
                    <div key={msg.id || msg.__id || i} className="w-full my-1.5 flex flex-col items-start">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[9px] font-headline font-bold text-gray-400">{msg.senderName}</span>
                        <span className="text-[8px] text-gray-300">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="w-full bg-white border border-slate-200 rounded-2xl p-3 shadow-xs text-gray-900 space-y-2 font-sans">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                          <span className="text-sm">📋</span>
                          <div>
                            <h5 className="font-serif font-bold text-xs text-gray-900 leading-tight">
                              Formal Business Inquiry & RFP
                            </h5>
                            <p className="text-[9px] text-gray-400 font-headline">Verified Marketplace Lead Summary</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-[11px]">
                          {targetRegion && (
                            <div className="flex items-start gap-1.5 bg-gray-50 p-1.5 rounded-lg border border-gray-150">
                              <span className="text-gray-400 font-headline font-bold text-[9px] uppercase w-20 flex-shrink-0">Target:</span>
                              <span className="font-semibold text-gray-800">{targetRegion}</span>
                            </div>
                          )}
                          {scope && (
                            <div className="flex items-start gap-1.5 bg-gray-50 p-1.5 rounded-lg border border-gray-150">
                              <span className="text-gray-400 font-headline font-bold text-[9px] uppercase w-20 flex-shrink-0">Scope:</span>
                              <span className="font-sans text-gray-800 leading-snug">{scope}</span>
                            </div>
                          )}
                          {budget && (
                            <div className="flex items-start gap-1.5 bg-gray-50 p-1.5 rounded-lg border border-gray-150">
                              <span className="text-gray-400 font-headline font-bold text-[9px] uppercase w-20 flex-shrink-0">Est. Budget:</span>
                              <span className="font-semibold text-emerald-700">{budget}</span>
                            </div>
                          )}
                          {timeline && (
                            <div className="flex items-start gap-1.5 bg-gray-50 p-1.5 rounded-lg border border-gray-150">
                              <span className="text-gray-400 font-headline font-bold text-[9px] uppercase w-20 flex-shrink-0">Timeline:</span>
                              <span className="font-semibold text-amber-800">{timeline}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id || msg.__id || i}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9px] font-headline font-bold text-gray-400">
                        {msg.senderName}
                      </span>
                      <span className="text-[8px] text-gray-300">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`max-w-[82%] px-3 py-2 rounded-2xl text-xs font-sans leading-relaxed shadow-2xs whitespace-pre-wrap ${
                        isMe
                          ? "bg-[#701010] text-white rounded-br-none"
                          : "bg-white text-gray-900 border border-gray-150 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Bar (Agency can request review) */}
          {!guidedInquiry && selectedInquiry && currentUser.uid === selectedInquiry.agencyOwnerUid && (
            <div className="px-3 py-1.5 bg-amber-50/60 border-t border-amber-150 flex items-center justify-between text-[10px] font-headline text-amber-900">
              <span>Deal Wrapped Up?</span>
              <button
                type="button"
                onClick={handleRequestReview}
                className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <Star className="w-2.5 h-2.5 fill-current" /> Request Review Card
              </button>
            </div>
          )}

          {/* Input Footer */}
          {viewMode === "chat" && (guidedInquiry || selectedInquiry) && (
            <form onSubmit={handleSendMessage} className="p-2 bg-white border-t border-gray-150 flex items-center gap-2">
              <input
                type="text"
                placeholder={guidedInquiry ? (guidedInquiry.step === 1 ? "Select or type target region..." : guidedInquiry.step === 2 ? "Tell us what you're looking for..." : "Type custom response...") : "Type your message..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={isSending || (!guidedInquiry && !inputText.trim())}
                className="p-2 bg-[#701010] hover:bg-[#580d0d] text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

        </div>
      )}

      {/* Floating Toggle Dock Pill Button */}
      <button
        onClick={() => {
          if (!isOpen) {
            if (!guidedInquiry && inquiries.length > 0) {
              setViewMode("list");
            }
          }
          setIsOpen(!isOpen);
        }}
        className="px-4 py-3 bg-[#701010] hover:bg-[#580d0d] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-full shadow-xl transition-all flex items-center gap-2.5 hover:scale-105 cursor-pointer border border-white/20"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Inquiries & Chat</span>
        {inquiries.length > 0 && (
          <span className="w-5 h-5 bg-white text-[#701010] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-2xs">
            {inquiries.length}
          </span>
        )}
      </button>
    </div>
  );
}
