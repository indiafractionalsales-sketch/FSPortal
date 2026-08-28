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

export interface VerificationRecord {
  [key: string]: unknown;
  id: string;
  uid: string;
  role: "obo" | "sp" | "tpsp" | string;
  provider: "sandbox_gst" | "manual_admin" | "uk_companies_house" | "us_irs" | string;
  verificationType: "gst_india" | "manual_admin" | "uk_crn" | "us_ein" | string;
  identifier: string;
  country: string;
  status: "approved" | "pending_admin_approval" | "rejected";
  verifiedAt: string;
  approvedBy: string;
  summary: {
    legalName: string;
    tradeName?: string;
    taxpayerType?: string;
    state?: string;
    city?: string;
    documentUrl?: string;
    panNumber?: string;
    notes?: string;
  };
  rawResponse?: Record<string, unknown>;
}

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function isValidGSTINFormat(gstin: string): boolean {
  if (!gstin) return false;
  return GSTIN_REGEX.test(gstin.trim().toUpperCase());
}

/**
 * Execute strict live GST verification using Sandbox.co.in API.
 * NEVER auto-approves or generates dummy names if live API fails.
 */
export async function queryGSTVerificationAPI(gstin: string): Promise<{
  success: boolean;
  legalName: string;
  tradeName: string;
  taxpayerType: string;
  state: string;
  city: string;
  status: string;
  rawResponse: Record<string, unknown>;
  error?: string;
}> {
  const cleanGstin = gstin.trim().toUpperCase();

  if (!isValidGSTINFormat(cleanGstin)) {
    return {
      success: false,
      legalName: "",
      tradeName: "",
      taxpayerType: "",
      state: "",
      city: "",
      status: "Invalid",
      rawResponse: {},
      error: "Invalid Indian GSTIN format. Must be a 15-character alphanumeric code."
    };
  }

  const apiKey = (process.env.SANDBOX_API_KEY || "").replace(/^["']|["']$/g, "").trim();
  const apiSecret = (process.env.SANDBOX_API_SECRET || "").replace(/^["']|["']$/g, "").trim();

  if (!apiKey || apiKey.length < 5 || apiKey.includes("your_sandbox")) {
    return {
      success: false,
      legalName: "",
      tradeName: "",
      taxpayerType: "",
      state: "",
      city: "",
      status: "ConfigError",
      rawResponse: {},
      error: "Live GST API credentials (SANDBOX_API_KEY) are not configured on the server."
    };
  }

  try {
    console.log(`Executing live Sandbox API GST verification for GSTIN: ${cleanGstin}`);

    // Step 1: Authenticate with Sandbox API to get access token
    const authRes = await fetch("https://api.sandbox.co.in/authenticate", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "x-api-secret": apiSecret || "",
        "x-api-version": "1.0",
        "Content-Type": "application/json"
      }
    });

    if (!authRes.ok) {
      const authErrText = await authRes.text();
      console.error(`Sandbox API authentication failed (Status ${authRes.status}):`, authErrText);
      return {
        success: false,
        legalName: "",
        tradeName: "",
        taxpayerType: "",
        state: "",
        city: "",
        status: "AuthError",
        rawResponse: {},
        error: `Sandbox API Authentication failed (${authRes.status}). Verify SANDBOX_API_KEY and API_SECRET.`
      };
    }

    const authData = await authRes.json();
    const accessToken = authData?.data?.access_token || authData?.access_token;

    if (!accessToken) {
      console.error("Sandbox API returned no access_token:", authData);
      return {
        success: false,
        legalName: "",
        tradeName: "",
        taxpayerType: "",
        state: "",
        city: "",
        status: "AuthError",
        rawResponse: authData,
        error: "Sandbox API Authentication response did not return an access token."
      };
    }

    // Step 2: Query GSTIN verification endpoint (try gsp/public/gstin first, then fallback to kyc/gstin)
    const headers = {
      "Authorization": accessToken,
      "x-api-key": apiKey,
      "x-api-version": "1.0"
    };

    let gstRes = await fetch(`https://api.sandbox.co.in/gsp/public/gstin/${cleanGstin}`, {
      method: "GET",
      headers
    });

    if (!gstRes.ok) {
      console.warn(`gsp/public/gstin returned ${gstRes.status}, trying kyc/gstin endpoint...`);
      gstRes = await fetch(`https://api.sandbox.co.in/kyc/gstin/${cleanGstin}`, {
        method: "GET",
        headers
      });
    }

    if (gstRes.ok) {
      const gstData = await gstRes.json();
      const data = gstData?.data || gstData;

      const legalName = data.lgnm || data.legal_name || data.legalName || "";
      const tradeName = data.tradeNam || data.trade_name || data.tradeName || legalName;
      const status = data.sts || data.status || "Active";
      const taxpayerType = data.dty || data.taxpayer_type || data.taxpayerType || "Regular";
      const state = data.pradr?.addr?.stcd || data.state || "India";
      const city = data.pradr?.addr?.dst || data.city || "";

      if (!legalName) {
        return {
          success: false,
          legalName: "",
          tradeName: "",
          taxpayerType: "",
          state: "",
          city: "",
          status: "NotFound",
          rawResponse: gstData,
          error: "GSTIN record was not found or returned incomplete entity details."
        };
      }

      return {
        success: status.toLowerCase() === "active",
        legalName,
        tradeName,
        taxpayerType,
        state,
        city,
        status,
        rawResponse: gstData
      };
    } else {
      const gstErrText = await gstRes.text();
      console.error(`Sandbox GST lookup API failed (Status ${gstRes.status}):`, gstErrText);
      return {
        success: false,
        legalName: "",
        tradeName: "",
        taxpayerType: "",
        state: "",
        city: "",
        status: "APIError",
        rawResponse: {},
        error: `Sandbox GST API search failed (${gstRes.status}). Ensure your Sandbox subscription includes GSTIN lookup.`
      };
    }
  } catch (err: any) {
    console.error("Live Sandbox API call error:", err);
    return {
      success: false,
      legalName: "",
      tradeName: "",
      taxpayerType: "",
      state: "",
      city: "",
      status: "SystemError",
      rawResponse: {},
      error: `GST Verification Network Error: ${err.message || "Failed to reach Sandbox API."}`
    };
  }
}
