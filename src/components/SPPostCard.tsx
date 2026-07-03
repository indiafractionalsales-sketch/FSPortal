"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, Users, Globe, ExternalLink, ThumbsUp, MessageCircle, Video, Star } from "lucide-react";

interface SPPost {
  __id: string;
  eventName?: string;
  eventUrl?: string;
  date?: string;
  time?: string;
  country?: string;
  city?: string;
  venue?: string;
  googleMapLink?: string;
  expectedFootfall?: string;
  description?: string;
  mediaUrl?: string;
  videoUrl?: string;
  ownerUid?: string;
  createdAt?: string;
}

interface SPPostCardProps {
  post: SPPost;
  authorName?: string;
  authorAvatar?: string;
}

export default function SPPostCard({ post, authorName, authorAvatar }: SPPostCardProps) {
  const [isInterested, setIsInterested] = useState(false);

  const initials = authorName
    ? authorName.charAt(0).toUpperCase()
    : "S";

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      {/* Post Author */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#701010] flex items-center justify-center text-white font-serif font-bold text-lg">{initials}</div>
          )}
          <div>
            <h3 className="font-serif font-bold text-sm text-gray-900 leading-tight">{authorName || "Sales Partner"}</h3>
            <p className="text-[9px] font-headline text-gray-500 mt-0.5 uppercase tracking-wider">
              Sales Partner · {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsInterested(!isInterested)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-headline font-bold uppercase tracking-widest transition-all duration-200 ${
            isInterested
              ? "bg-amber-500 border-amber-500 text-white"
              : "bg-[#701010] border-[#701010] text-white hover:bg-[#5a0c0c]"
          }`}
        >
          <Star className={`w-2.5 h-2.5 ${isInterested ? "fill-white text-white" : "fill-current text-amber-400"}`} />
          {isInterested ? "Interested ✓" : "Interested?"}
        </button>
      </div>

      {/* Description — shown prominently above media */}
      {post.description && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-700 leading-relaxed font-sans line-clamp-3">{post.description}</p>
        </div>
      )}

      {/* Event Details Area */}
      {post.mediaUrl ? (
        <div className="flex w-full h-36 border-t border-b border-gray-100 bg-gray-50/30">
          {/* Media thumbnail */}
          <div className="w-1/3 h-full overflow-hidden flex-shrink-0">
            <img src={post.mediaUrl} alt="Event" className="w-full h-full object-cover" />
          </div>
          {/* Details */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-sm text-gray-900 leading-snug line-clamp-2">{post.eventName}</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                {formattedDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                    <span className="text-[10px] text-gray-700 font-sans truncate">{formattedDate}</span>
                  </div>
                )}
                {post.time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                    <span className="text-[10px] text-gray-700 font-sans truncate">{post.time}</span>
                  </div>
                )}
                {/* Location col1, Event capsule col2 — same grid row */}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                  <span className="text-[10px] text-gray-700 font-sans truncate">
                    {[post.venue, post.city, post.country].filter(Boolean).join(", ")}
                    {post.googleMapLink && (
                      <a href={post.googleMapLink} target="_blank" rel="noopener noreferrer" className="ml-1 text-[#701010] font-bold hover:underline">(Map)</a>
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  {post.eventUrl ? (
                    <a href={post.eventUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full hover:bg-red-100 transition-colors">
                      Event ↗
                    </a>
                  ) : (
                    <span className="inline-flex text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                      Event
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              {post.expectedFootfall ? (
                <div className="flex items-center gap-1 text-gray-500">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-600">
                    Expected: <span className="text-[#701010]">{post.expectedFootfall}</span>
                  </span>
                </div>
              ) : <div />}
            </div>
          </div>
        </div>
      ) : (
        /* No media: text-only card */
        <div className="px-4 pb-3 border-t border-gray-50 pt-3">
          <h4 className="font-serif font-bold text-base text-gray-900 leading-snug">{post.eventName}</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2.5">
            {formattedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                <span className="text-[10px] text-gray-700 font-sans">{formattedDate}</span>
              </div>
            )}
            {post.time && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                <span className="text-[10px] text-gray-700 font-sans">{post.time}</span>
              </div>
            )}
            {/* Location col1, Event capsule col2 — same grid row */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
              <span className="text-[10px] text-gray-700 font-sans truncate">
                {[post.venue, post.city, post.country].filter(Boolean).join(", ")}
              </span>
            </div>
            <div className="flex items-center">
              {post.eventUrl ? (
                <a href={post.eventUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full hover:bg-red-100 transition-colors">
                  Event ↗
                </a>
              ) : (
                <span className="inline-flex text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                  Event
                </span>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Video link */}
      {post.videoUrl && (
        <div className="px-4 pb-3 flex items-center gap-4">
          <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] hover:underline">
            <Video className="w-3 h-3" /> Watch Video
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center border-t border-gray-100 mx-4 gap-2 py-1">
        <button
          onClick={() => setIsInterested(!isInterested)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 font-headline font-bold uppercase tracking-widest text-[10px] transition-all rounded-lg ${
            isInterested ? "text-amber-500 hover:bg-amber-50" : "text-gray-700 hover:bg-gray-50 hover:text-[#701010]"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isInterested ? "fill-amber-400 text-amber-500" : ""}`} />
          {isInterested ? "Interested ✓" : "Interested"}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg">
          <ThumbsUp className="w-3.5 h-3.5" /> Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg">
          <MessageCircle className="w-3.5 h-3.5" /> Comment
        </button>
      </div>
    </div>
  );
}
