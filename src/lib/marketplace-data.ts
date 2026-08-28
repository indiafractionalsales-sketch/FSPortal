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

export interface MarketplaceAgency {
  id: string;
  name: string;
  category: MarketplaceCategoryId;
  location: string;
  country: string;
  region: "Asia Pacific" | "Europe" | "North America" | "Middle East" | "Latin America" | "Global";
  tag: string;
  tagline: string;
  description: string;
  website: string;
  logoBg: string;
  iconName: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  specialties: string[];
  stats: {
    projectsDone: string;
    avgResponse: string;
    teamSize: string;
  };
}

export type MarketplaceCategoryId =
  | "biz_dev"
  | "marketing"
  | "digital_marketing"
  | "multilingual"
  | "cha"
  | "export"
  | "accounting"
  | "legal"
  | "office_space";

export interface MarketplaceCategoryInfo {
  id: MarketplaceCategoryId;
  name: string;
  shortName: string;
  icon: string;
  badgeCount: number;
  description: string;
  color: string;
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategoryInfo[] = [
  {
    id: "biz_dev",
    name: "Deal Closing Agencies",
    shortName: "Deal Closing",
    icon: "💼",
    badgeCount: 14,
    description: "Outsourced enterprise deal closers, sales execution partners, matchmaking, and channel deal closure teams.",
    color: "from-amber-600 to-orange-600"
  },
  {
    id: "marketing",
    name: "Marketing Agencies",
    shortName: "Marketing",
    icon: "📣",
    badgeCount: 18,
    description: "Strategic international brand localization, PR, product launches, and regional positioning for global markets.",
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: "digital_marketing",
    name: "Digital Marketing Agencies",
    shortName: "Digital Marketing",
    icon: "🚀",
    badgeCount: 22,
    description: "Performance marketing, localized SEO, PPC management, multi-platform social media growth, and conversion optimization.",
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: "multilingual",
    name: "Multilingual Support Agencies",
    shortName: "Multilingual Support",
    icon: "🗣️",
    badgeCount: 11,
    description: "24/7 multilingual customer support, technical helpdesk, document translation, and live customer voice assistance.",
    color: "from-emerald-600 to-teal-600"
  },
  {
    id: "cha",
    name: "CHAs (Custom House Agents)",
    shortName: "CHAs & Customs",
    icon: "🚢",
    badgeCount: 15,
    description: "Customs brokerage, port clearance, import-export documentation, tariff advisory, and cross-border freight compliance.",
    color: "from-sky-700 to-indigo-900"
  },
  {
    id: "export",
    name: "Export Agencies",
    shortName: "Export Agencies",
    icon: "🌍",
    badgeCount: 12,
    description: "Turnkey export management, international distributor networks, trade show management, and global supply chain setup.",
    color: "from-rose-600 to-red-700"
  },
  {
    id: "accounting",
    name: "Over-seas Accounting Support",
    shortName: "Overseas Accounting",
    icon: "📊",
    badgeCount: 16,
    description: "Cross-border tax planning, GST/VAT compliance, transfer pricing documentation, international payroll, and financial audit.",
    color: "from-teal-600 to-emerald-700"
  },
  {
    id: "legal",
    name: "Over-seas Legal Support",
    shortName: "Overseas Legal",
    icon: "⚖️",
    badgeCount: 19,
    description: "Global entity incorporation, cross-border contract drafting, intellectual property (IP) protection, and regulatory compliance.",
    color: "from-slate-700 to-slate-900"
  },
  {
    id: "office_space",
    name: "Office Spaces",
    shortName: "Office Spaces",
    icon: "🏢",
    badgeCount: 25,
    description: "Flexible executive workspaces, virtual business address registration, dedicated team suites, and overseas branch office setups.",
    color: "from-violet-600 to-purple-800"
  }
];

export const MOCK_AGENCIES: MarketplaceAgency[] = [
  // 1. Biz Dev
  {
    id: "agency-bd-1",
    name: "Vanguard Sales Group",
    category: "biz_dev",
    location: "New York, USA",
    country: "United States",
    region: "North America",
    tag: "Enterprise B2B",
    tagline: "Outsourced enterprise sales teams & local rep hiring across the Americas.",
    description: "Vanguard Sales Group helps global tech & industrial brands build high-performing outbound sales teams in North America with zero overhead.",
    website: "vanguardsales.com",
    logoBg: "bg-gradient-to-br from-emerald-500 to-teal-700",
    iconName: "Briefcase",
    rating: 4.9,
    reviewCount: 42,
    isVerified: true,
    specialties: ["Outbound B2B Sales", "Channel Partner Matchmaking", "Key Account Management"],
    stats: { projectsDone: "120+", avgResponse: "< 2 hrs", teamSize: "45 Reps" }
  },
  {
    id: "agency-bd-2",
    name: "Asiapoint Business Solutions",
    category: "biz_dev",
    location: "Tokyo, Japan",
    country: "Japan",
    region: "Asia Pacific",
    tag: "APAC Entry",
    tagline: "Unlocking B2B enterprise clients & Japanese channel partners.",
    description: "Specialized business representation and deal closure for Western companies expanding into Japan, South Korea, and Southeast Asia.",
    website: "asiapoint.jp",
    logoBg: "bg-gradient-to-br from-amber-500 to-orange-700",
    iconName: "Users",
    rating: 4.8,
    reviewCount: 36,
    isVerified: true,
    specialties: ["Japanese Market Entry", "OEM Deal Making", "Local Distributor Hiring"],
    stats: { projectsDone: "85+", avgResponse: "< 4 hrs", teamSize: "30 Reps" }
  },
  {
    id: "agency-bd-3",
    name: "Aria Outreach Associates",
    category: "biz_dev",
    location: "Dubai, UAE",
    country: "United Arab Emirates",
    region: "Middle East",
    tag: "MEA Network",
    tagline: "Direct C-Suite outreach & government contractor liaison in GCC.",
    description: "Connecting international exporters with top enterprise buyers, government tenders, and royal family offices in the GCC region.",
    website: "ariaoutreach.ae",
    logoBg: "bg-gradient-to-br from-fuchsia-600 to-pink-700",
    iconName: "Award",
    rating: 4.9,
    reviewCount: 29,
    isVerified: true,
    specialties: ["GCC Enterprise Sales", "Government Tender Support", "B2B Partner Sourcing"],
    stats: { projectsDone: "95+", avgResponse: "< 1 hr", teamSize: "25 Reps" }
  },

  // 2. Marketing
  {
    id: "agency-mkt-1",
    name: "Global Growth Media",
    category: "marketing",
    location: "London, UK",
    country: "United Kingdom",
    region: "Europe",
    tag: "Global PR & Brand",
    tagline: "Full-stack international brand building and corporate PR.",
    description: "Award-winning global PR and branding agency helping international entrants launch high-impact product releases across European media.",
    website: "globalgrowth.io",
    logoBg: "bg-gradient-to-br from-indigo-500 to-purple-700",
    iconName: "TrendingUp",
    rating: 4.9,
    reviewCount: 58,
    isVerified: true,
    specialties: ["European Media PR", "Brand Positioning", "Thought Leadership Campaigns"],
    stats: { projectsDone: "210+", avgResponse: "< 2 hrs", teamSize: "60 Specialists" }
  },
  {
    id: "agency-mkt-2",
    name: "Pacific Brand Architects",
    category: "marketing",
    location: "Singapore",
    country: "Singapore",
    region: "Asia Pacific",
    tag: "Consumer & Retail",
    tagline: "Localization and go-to-market strategies for SEA consumer brands.",
    description: "Tailored brand localization, influencer campaigns, and retail launch strategies across Singapore, Malaysia, Indonesia, and Vietnam.",
    website: "pacificarchitects.sg",
    logoBg: "bg-gradient-to-br from-orange-500 to-red-600",
    iconName: "Compass",
    rating: 4.7,
    reviewCount: 31,
    isVerified: true,
    specialties: ["Retail GTM Launch", "SEA Consumer Insights", "Multilingual PR"],
    stats: { projectsDone: "70+", avgResponse: "< 3 hrs", teamSize: "22 Specialists" }
  },

  // 3. Digital Marketing
  {
    id: "agency-dig-1",
    name: "Apex Performance Digital",
    category: "digital_marketing",
    location: "San Francisco, USA",
    country: "United States",
    region: "North America",
    tag: "Paid Growth & SEO",
    tagline: "Data-driven multi-channel digital acquisition for high-growth tech.",
    description: "Specialized in Google Ads, LinkedIn Ads, programmatic media buying, and SEO campaigns structured for international market scale.",
    website: "apexperformancedigital.com",
    logoBg: "bg-gradient-to-br from-blue-600 to-cyan-700",
    iconName: "Rocket",
    rating: 4.9,
    reviewCount: 64,
    isVerified: true,
    specialties: ["Global LinkedIn Ads", "International SEO", "Funnel Conversion Optimization"],
    stats: { projectsDone: "300+", avgResponse: "< 1 hr", teamSize: "50 Growth Marketers" }
  },
  {
    id: "agency-dig-2",
    name: "Nordic Digital House",
    category: "digital_marketing",
    location: "Stockholm, Sweden",
    country: "Sweden",
    region: "Europe",
    tag: "SaaS Digital Growth",
    tagline: "Scalable performance marketing across the Nordics and Western Europe.",
    description: "Helping global software companies capture market share across Sweden, Norway, Denmark, Germany, and the UK.",
    website: "nordicdigitalhouse.se",
    logoBg: "bg-gradient-to-br from-cyan-600 to-teal-800",
    iconName: "Globe",
    rating: 4.8,
    reviewCount: 40,
    isVerified: true,
    specialties: ["EU Market PPC", "Content Marketing Strategy", "Account-Based Marketing (ABM)"],
    stats: { projectsDone: "140+", avgResponse: "< 2 hrs", teamSize: "35 Growth Marketers" }
  },

  // 4. Multilingual Support
  {
    id: "agency-multi-1",
    name: "Polyglot Global Localization",
    category: "multilingual",
    location: "Paris, France",
    country: "France",
    region: "Europe",
    tag: "30+ Languages",
    tagline: "Native 24/7 customer experience and technical support centers.",
    description: "Multilingual call centers, email ticketing, and live chat management staffed by native speakers in French, German, Spanish, Japanese, and Arabic.",
    website: "polyglotglobal.fr",
    logoBg: "bg-gradient-to-br from-emerald-600 to-teal-700",
    iconName: "Headphones",
    rating: 4.9,
    reviewCount: 47,
    isVerified: true,
    specialties: ["24/7 Voice & Chat Support", "Technical Helpdesk", "Native Contract Translation"],
    stats: { projectsDone: "180+", avgResponse: "< 30 mins", teamSize: "120 Agents" }
  },
  {
    id: "agency-multi-2",
    name: "TransAsia Support Services",
    category: "multilingual",
    location: "Hong Kong",
    country: "Hong Kong",
    region: "Asia Pacific",
    tag: "Asian Language Hub",
    tagline: "Mandarin, Cantonese, Japanese & Korean B2B client support.",
    description: "Enterprise multi-channel support and translation services ensuring seamless communication with buyers across Greater China and APAC.",
    website: "transasiasupport.hk",
    logoBg: "bg-gradient-to-br from-teal-500 to-emerald-800",
    iconName: "Languages",
    rating: 4.8,
    reviewCount: 33,
    isVerified: true,
    specialties: ["Mandarin B2B Desk", "Asian Trade Documenting", "Omnichannel Live Chat"],
    stats: { projectsDone: "90+", avgResponse: "< 1 hr", teamSize: "40 Agents" }
  },

  // 5. CHAs (Custom House Agents)
  {
    id: "agency-cha-1",
    name: "Apex Customs & Clearing Corp",
    category: "cha",
    location: "Mumbai, India",
    country: "India",
    region: "Asia Pacific",
    tag: "Licensed CHA & Freight",
    tagline: "Fast-track customs clearance, ICEGATE filing, & port compliance.",
    description: "Authorized AEO-certified Custom House Agent offering seamless customs clearance, Duty Drawback assistance, and port logistics across JNPT, Mundra, and Chennai ports.",
    website: "apexcustoms.in",
    logoBg: "bg-gradient-to-br from-sky-700 to-indigo-900",
    iconName: "Ship",
    rating: 4.9,
    reviewCount: 88,
    isVerified: true,
    specialties: ["Port Customs Clearance", "Duty Exemption Assistance", "HS Code Classification"],
    stats: { projectsDone: "500+", avgResponse: "< 1 hr", teamSize: "75 Agents" }
  },
  {
    id: "agency-cha-2",
    name: "Harbor Bridge Customs Brokers",
    category: "cha",
    location: "Rotterdam, Netherlands",
    country: "Netherlands",
    region: "Europe",
    tag: "EU Customs Hub",
    tagline: "Smooth European port clearance & indirect tax representation.",
    description: "Specialized EU import clearance at Port of Rotterdam & Schiphol Airport. Direct integration with ATLAS & Customs systems.",
    website: "harborbridgecustoms.nl",
    logoBg: "bg-gradient-to-br from-blue-800 to-slate-900",
    iconName: "Anchor",
    rating: 4.8,
    reviewCount: 52,
    isVerified: true,
    specialties: ["EU Import Clearance", "Transit Documents (T1/T2)", "Customs Bonded Warehousing"],
    stats: { projectsDone: "320+", avgResponse: "< 2 hrs", teamSize: "50 Agents" }
  },

  // 6. Export Agencies
  {
    id: "agency-exp-1",
    name: "TerraCross Export Management",
    category: "export",
    location: "Frankfurt, Germany",
    country: "Germany",
    region: "Europe",
    tag: "Turnkey Export Setup",
    tagline: "End-to-end export distribution & overseas buyer onboarding.",
    description: "Full-service export house managing international shipping compliance, cross-border distributor contracts, and trade finance setup.",
    website: "terracrossexport.de",
    logoBg: "bg-gradient-to-br from-rose-600 to-red-800",
    iconName: "Globe",
    rating: 4.9,
    reviewCount: 39,
    isVerified: true,
    specialties: ["Export Compliance", "International Trade Finance", "Distributor Onboarding"],
    stats: { projectsDone: "110+", avgResponse: "< 3 hrs", teamSize: "30 Specialists" }
  },
  {
    id: "agency-exp-2",
    name: "SilkRoute Exporters Advisory",
    category: "export",
    location: "Istanbul, Turkey",
    country: "Turkey",
    region: "Middle East",
    tag: "Eurasia Trade Route",
    tagline: "Bridging European & Middle Eastern trade corridors.",
    description: "Export advisory and logistical support connecting manufacturers in Asia & Middle East with buyers in Eastern and Western Europe.",
    website: "silkrouteexporters.com.tr",
    logoBg: "bg-gradient-to-br from-amber-700 to-red-900",
    iconName: "Truck",
    rating: 4.7,
    reviewCount: 27,
    isVerified: true,
    specialties: ["Eurasian Logistics", "Certificate of Origin Filing", "B2B Trade Fairs"],
    stats: { projectsDone: "65+", avgResponse: "< 4 hrs", teamSize: "20 Specialists" }
  },

  // 7. Accounting
  {
    id: "agency-acc-1",
    name: "TaxBridge International Advisors",
    category: "accounting",
    location: "Singapore",
    country: "Singapore",
    region: "Asia Pacific",
    tag: "Cross-Border Tax",
    tagline: "Multi-jurisdiction tax planning, transfer pricing & audit.",
    description: "Premier accounting & tax advisory firm specializing in APAC entity taxation, withholding tax optimization, and cloud bookkeeping for foreign subsidiaries.",
    website: "taxbridge.sg",
    logoBg: "bg-gradient-to-br from-teal-600 to-emerald-800",
    iconName: "FileSpreadsheet",
    rating: 4.9,
    reviewCount: 51,
    isVerified: true,
    specialties: ["Transfer Pricing Advisory", "Double Taxation Agreements (DTA)", "Subsidiary Payroll"],
    stats: { projectsDone: "220+", avgResponse: "< 2 hrs", teamSize: "40 CPAs" }
  },
  {
    id: "agency-acc-2",
    name: "EuroTax & Audit Partners",
    category: "accounting",
    location: "Amsterdam, Netherlands",
    country: "Netherlands",
    region: "Europe",
    tag: "EU VAT & Corporate Tax",
    tagline: "EU VAT One-Stop-Shop (OSS) filing and European payroll.",
    description: "Comprehensive financial audit, EU VAT compliance, and corporate tax structuring for foreign companies establishing European headquarters.",
    website: "eurotaxpartners.nl",
    logoBg: "bg-gradient-to-br from-emerald-700 to-teal-900",
    iconName: "Calculator",
    rating: 4.8,
    reviewCount: 44,
    isVerified: true,
    specialties: ["EU VAT Compliance", "Corporate Audit", "Multi-Currency Bookkeeping"],
    stats: { projectsDone: "160+", avgResponse: "< 3 hrs", teamSize: "35 CPAs" }
  },

  // 8. Legal Support
  {
    id: "agency-leg-1",
    name: "LexGlobal Consult",
    category: "legal",
    location: "Geneva, Switzerland",
    country: "Switzerland",
    region: "Europe",
    tag: "Global Corporate Law",
    tagline: "Cross-border contract drafting, IP filing & entity setup.",
    description: "Leading legal counsel specializing in cross-border joint ventures, international arbitration, trademark registration, and local labor law compliance.",
    website: "lexglobal.ch",
    logoBg: "bg-gradient-to-br from-slate-700 to-slate-950",
    iconName: "ShieldCheck",
    rating: 4.9,
    reviewCount: 68,
    isVerified: true,
    specialties: ["Cross-Border Contracts", "Global Trademark & IP", "Entity Incorporation"],
    stats: { projectsDone: "280+", avgResponse: "< 2 hrs", teamSize: "50 Attorneys" }
  },
  {
    id: "agency-leg-2",
    name: "CrossBorder Trade Legal",
    category: "legal",
    location: "Washington DC, USA",
    country: "United States",
    region: "North America",
    tag: "Trade & Sanctions Law",
    tagline: "ITAR, EAR, export control compliance & regulatory defense.",
    description: "Specialist attorneys focused on US trade compliance, OFAC sanctions compliance, cross-border M&A, and international agency agreements.",
    website: "crossbordertradelegal.com",
    logoBg: "bg-gradient-to-br from-blue-900 to-slate-900",
    iconName: "Scale",
    rating: 4.9,
    reviewCount: 37,
    isVerified: true,
    specialties: ["US Export Control (EAR/ITAR)", "International Agency Contracts", "FCPA Compliance"],
    stats: { projectsDone: "130+", avgResponse: "< 2 hrs", teamSize: "28 Attorneys" }
  },

  // 9. Office Spaces
  {
    id: "agency-off-1",
    name: "Apex Coworking & Executive Hubs",
    category: "office_space",
    location: "Singapore",
    country: "Singapore",
    region: "Asia Pacific",
    tag: "Prime APAC Offices",
    tagline: "Turnkey executive desks, meeting rooms & virtual business addresses.",
    description: "Premium Grade-A commercial office space in central financial districts across Singapore, Tokyo, Sydney, and London. Includes instant corporate address registration.",
    website: "apexcoworking.sg",
    logoBg: "bg-gradient-to-br from-violet-600 to-purple-900",
    iconName: "Building2",
    rating: 4.9,
    reviewCount: 92,
    isVerified: true,
    specialties: ["Virtual Corporate Address", "Private Executive Suites", "Global Access Passes"],
    stats: { projectsDone: "450+", avgResponse: "< 30 mins", teamSize: "15 Hubs" }
  },
  {
    id: "agency-off-2",
    name: "Nomadic HQ Workspaces",
    category: "office_space",
    location: "Dubai, UAE",
    country: "United Arab Emirates",
    region: "Middle East",
    tag: "GCC Free Zone Workspaces",
    tagline: "Flexible hot desks & flex-office licensing for international firms.",
    description: "Plug-and-play office suites inside DIFC, DMCC, and Abu Dhabi Global Market (ADGM) with fully compliant lease agreements for visa quota issuance.",
    website: "nomadichq.ae",
    logoBg: "bg-gradient-to-br from-purple-700 to-indigo-900",
    iconName: "Building",
    rating: 4.8,
    reviewCount: 56,
    isVerified: true,
    specialties: ["Free Zone Flexi Desks", "Visa License Lease Agreements", "High-Tech Boardrooms"],
    stats: { projectsDone: "210+", avgResponse: "< 1 hr", teamSize: "8 Locations" }
  }
];
