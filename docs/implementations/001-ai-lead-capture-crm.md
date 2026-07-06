# 001: AI Lead Capture & Automated CRM + Post-Deal Rating Engine

**Status:** ✅ Implemented  
**Date:** 2026-07-06  
**Modules:** Module A (AI Lead Capture), Module B (Rating Engine)

---

## Problem Statement
Sales Partners attending trade shows and expos on behalf of Business Owners need a frictionless way to capture leads (visiting cards + voice context). Business Owners need a way to rate Sales Partners after a deal.

## Architectural Philosophy
- **Plug & Play:** The Lead Capture module is a decoupled component that works both within a specific deal context (linked to a `postId`) and independently as a personal CRM.
- **Mobile First:** The capture UI is designed as a full-screen, WhatsApp-style immersive experience optimized for one-handed mobile use.
- **Prepaid Token System (Future):** Architecture supports future monetization via `availableScans` and `availableReports` token counters.

---

## Module A: AI Lead Capture & Automated CRM

### Database Schema
**Root Collection: `Leads`**
| Field | Type | Description |
|-------|------|-------------|
| `ownerUid` | string | The Business Owner who owns the lead |
| `capturedByUid` | string | The user who captured the lead (SP or BO) |
| `postId` | string (optional) | If captured within a deal context |
| `contactInfo` | object | `{ name, designation, company, email, phone, website }` |
| `temperature` | enum | `hot`, `warm`, `cold` |
| `actionItem` | string | Next CTA extracted from voice/text |
| `contextSummary` | string | AI-generated English summary |
| `originalImageUrl` | string | Firebase Storage URL of the card image |
| `originalAudioUrl` | string (optional) | Firebase Storage URL of the voice note |
| `createdAt` | timestamp | Server timestamp |

### Voice Tag Protocol
Sales Partners use keyword tags to classify leads:
- **HOT:** "Tag HOT LEAD", "URGENT", "ASAP", "CLOSING"
- **WARM:** "Tag WARM LEAD", "FOLLOW UP", "SEND INFO", "CHECK IN"
- **COLD:** "Tag COLD LEAD", "JUST LOG", "NO ACTION"

The AI (Gemini 1.5 Pro) intelligently handles corrections, mixed languages, and missing tags.

### Files Created / Modified
| Action | File | Purpose |
|--------|------|---------|
| NEW | `src/ai/flows/lead-extraction.ts` | Genkit multimodal flow (image + audio → structured JSON) |
| NEW | `src/app/api/leads/process/route.ts` | API: auth → AI processing → Firestore save |
| NEW | `src/app/api/reports/generate/route.ts` | API: on-demand report generation |
| NEW | `src/components/LeadCaptureInterface.tsx` | WhatsApp-style immersive capture UI |
| MOD | `firestore.rules` | Added `Leads` collection security rules |
| MOD | `src/components/SPPostCard.tsx` | Added "📸 Capture Lead" button (SP-only) |

### Visibility & Trigger Rules (SPPostCard)
- **Capture Lead button:** Rendered at the **top header of the card** next to the `CLOSED` status capsule to reduce friction for active field scanning.
- **Access Control:** Visible only to the Sales Partner:
  - SP Post: `currentUid === post.ownerUid`
  - OBO Post: `currentUid === post.paymentLockedBy`
- **Events:** The button halts navigation events (`preventDefault` and `stopPropagation`) to prevent launching profile views from the parent `Link` component.

---

## Module B: Post-Deal Rating & Review Engine

### Database Schema
**Root Collection: `Reviews`**
| Field | Type | Description |
|-------|------|-------------|
| `reviewerUid` | string | The buyer who left the review |
| `targetUid` | string | The seller being reviewed |
| `postId` | string | The deal this review relates to |
| `rating` | integer | 1 to 5 stars |
| `comment` | string | Optional feedback text |
| `createdAt` | timestamp | Server timestamp |

**Updated: `UserProfiles`**
- `averageRating` (float) — recalculated atomically on each new review
- `totalReviews` (integer) — incremented atomically

### Files Created / Modified
| Action | File | Purpose |
|--------|------|---------|
| NEW | `src/app/api/reviews/submit/route.ts` | API: POST (submit) + GET (check existing) |
| NEW | `src/components/RatingModal.tsx` | 5-star interactive modal |
| MOD | `firestore.rules` | Added `Reviews` collection security rules |
| MOD | `src/components/SPPostCard.tsx` | Added "⭐ Rate Partner" button (buyer-only) |

### Visibility Rules (SPPostCard)
- **Rate Partner button:** Visible only to the Business Owner (buyer) in the bottom actions row:
  - SP Post: `currentUid === post.paymentLockedBy`
  - OBO Post: `currentUid === post.ownerUid`

---

## Verification
- TypeScript typecheck: **0 new errors** introduced
- All pre-existing errors remain unchanged (`profile/route.ts`, `firebase-admin.ts`)

## Future Enhancements (Not Yet Implemented)
1. **Prepaid Token System:** `availableScans` / `availableReports` wallet with balance checks before AI calls
2. **Global "My Leads" Tab:** Sidebar quick link to view all leads across events
3. **PDF with Charts:** Richer branded PDF reports with visual graphs
4. **Company Enrichment:** Auto-scrape the website URL from the card to generate a company summary
