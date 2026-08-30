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
import {
  MessageSquare, Send, Building2, User, Calendar, ShieldCheck,
  CheckCircle2, Clock, Search, ExternalLink, Star, Paperclip, ChevronLeft
} from "lucide-react";
import LeftSidebar from "@/components/LeftSidebar";
import QuickChatDockWidget from "@/components/QuickChatDockWidget";
import ReviewRequestCard from "@/components/ReviewRequestCard";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import {
  fetchUserInquiries,
  fetchInquiryMessages,
  sendChatMessage,
  submitReview,
  getDocument,
  MarketplaceInquiry,
  ChatMessage
} from "@/lib/marketplace-service";

export default function MessagesWorkspacePage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string>("obo");
  const [userName, setUserName] = useState<string>("");

  const [inquiries, setInquiries] = useState<MarketplaceInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<MarketplaceInquiry | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Authenticate user & load inquiries
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const userDoc = (await getDocument("users", user.uid, idToken)) as any;
          if (userDoc) {
            setUserRole(userDoc.role || "obo");
            setUserName(userDoc.displayName || userDoc.fullName || user.email?.split("@")[0] || "User");
          }
          const list = await fetchUserInquiries(user.uid, idToken);
          setInquiries(list);
          if (list.length > 0) {
            const urlParams = new URLSearchParams(window.location.search);
            const targetInquiryId = urlParams.get("inquiryId");
            const matchedInquiry = list.find(i => (i.id || i.__id) === targetInquiryId);
            setSelectedInquiry(matchedInquiry || list[0]);
          }
        } catch (err) {
          console.error("Error loading user inquiries in messages workspace:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Load messages for selected inquiry thread
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
    if (!inputText.trim() || !selectedInquiry || !currentUser) return;

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

      const updatedMsgs = await fetchInquiryMessages(selectedInquiry.id || selectedInquiry.__id || "", idToken);
      setMessages(updatedMsgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
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

  const filteredInquiries = inquiries.filter((inq) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inq.agencyName.toLowerCase().includes(q) ||
      inq.buyerName.toLowerCase().includes(q) ||
      inq.projectRequirements.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <LeftSidebar
        user={currentUser}
        userType={userRole}
        spData={null}
        oboData={null}
        tpspData={null}
        planName="Pro Partner"
      />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        
        {/* Top App Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-2xs flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#701010] flex items-center justify-center text-white font-bold shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-gray-900 leading-tight">Lead Communication Workspace</h1>
              <p className="text-xs text-gray-500 font-headline">Direct 2-way messaging for inquiries & project RFPs</p>
            </div>
          </div>
        </header>

        {/* Workspace Body: 2-Column Layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* Left Column: Inquiry Threads List */}
          <div className="w-80 md:w-96 border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
            
            {/* Search Box */}
            <div className="p-3 border-b border-gray-150">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search inquiries or clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Inquiries Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-gray-400">Loading inquiry inbox...</div>
              ) : filteredInquiries.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Building2 className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs font-headline font-bold text-gray-600">No Inquiries Found</p>
                  <p className="text-[11px] text-gray-400">Your marketplace lead communications will appear here.</p>
                </div>
              ) : (
                filteredInquiries.map((inq) => {
                  const isSelected = (selectedInquiry?.id || selectedInquiry?.__id) === (inq.id || inq.__id);
                  const isAgencyOwner = currentUser?.uid === inq.agencyOwnerUid;
                  const displayTitle = isAgencyOwner ? inq.buyerName : inq.agencyName;

                  return (
                    <button
                      key={inq.id || inq.__id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                        isSelected ? "bg-red-50/60 border-l-4 border-[#701010]" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center font-serif font-bold text-[#701010]">
                        {displayTitle.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-serif font-bold text-xs text-gray-900 truncate">{displayTitle}</h4>
                          <span className="text-[9px] text-gray-400 font-headline flex-shrink-0">
                            {new Date(inq.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-headline truncate mt-0.5">
                          Category: {inq.agencyName}
                        </p>
                        <p className="text-[11px] text-gray-600 font-sans line-clamp-1 mt-1">
                          {inq.projectRequirements}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column: Chat Thread Workspace */}
          {selectedInquiry ? (
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#701010] text-white flex items-center justify-center font-bold font-serif shadow-xs">
                    {selectedInquiry.agencyName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-gray-900 leading-tight">
                      {selectedInquiry.agencyName}
                    </h3>
                    <p className="text-xs text-gray-500 font-headline flex items-center gap-2 mt-0.5">
                      <span>Buyer: <strong>{selectedInquiry.buyerName}</strong> ({selectedInquiry.buyerPersona})</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> GST Verified
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentUser?.uid === selectedInquiry.agencyOwnerUid && (
                    <button
                      onClick={handleRequestReview}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" /> Request Review
                    </button>
                  )}
                </div>
              </div>

              {/* Requirement Summary Callout */}
              <div className="p-3.5 bg-slate-50 border-b border-gray-150 text-xs text-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="space-y-0.5 max-w-2xl">
                  <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-400">RFP Project Requirements:</span>
                  <p className="font-sans text-gray-800 line-clamp-2">{selectedInquiry.projectRequirements}</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-headline flex-shrink-0">
                  <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg">Budget: <strong>{selectedInquiry.estimatedBudget || "N/A"}</strong></span>
                  <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg">Timeline: <strong>{selectedInquiry.timeline}</strong></span>
                </div>
              </div>

              {/* Message List Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30 custom-scrollbar">
                {messages.map((msg, i) => {
                  const isMe = currentUser && msg.senderUid === currentUser.uid;

                  if (msg.cardType === "review_request") {
                    return (
                      <div key={msg.id || msg.__id || i} className="max-w-md mx-auto">
                        <ReviewRequestCard
                          inquiryId={selectedInquiry.id || ""}
                          agencyId={selectedInquiry.agencyId}
                          agencyName={selectedInquiry.agencyName}
                          agencyOwnerUid={selectedInquiry.agencyOwnerUid}
                          buyerUid={selectedInquiry.buyerUid}
                          currentUserUid={currentUser?.uid || ""}
                          onSubmitReview={async (rating, comment) => {
                            if (!currentUser) return;
                            const idToken = await currentUser.getIdToken();
                            await submitReview(
                              selectedInquiry.id || "",
                              selectedInquiry.agencyId,
                              currentUser.uid,
                              currentUser.displayName || selectedInquiry.buyerName,
                              selectedInquiry.agencyOwnerUid,
                              rating,
                              comment,
                              idToken
                            );
                          }}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id || msg.__id || i}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-headline font-bold text-gray-500">
                          {msg.senderName} ({msg.senderType})
                        </span>
                        <span className="text-[9px] text-gray-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`max-w-[70%] px-4 py-3 rounded-2xl text-xs font-sans leading-relaxed shadow-2xs ${
                          isMe
                            ? "bg-[#701010] text-white rounded-br-none"
                            : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Footer */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type your message or negotiate RFP terms..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={isSending || !inputText.trim()}
                  className="px-5 py-3 bg-[#701010] hover:bg-[#580d0d] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-8 text-center space-y-3">
              <div>
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <h3 className="font-serif font-bold text-lg text-gray-800">Select a Lead Inquiry</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Select a lead from the left pane to view requirements, exchange proposals, and chat.
                </p>
              </div>
            </div>
          )}

        </div>

      </main>

      <QuickChatDockWidget />
    </div>
  );
}
