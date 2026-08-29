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
    services?: string;
    fullAddress?: string;
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
 * Tries all official Sandbox GST endpoint variants to ensure compatibility.
 */
export async function queryGSTVerificationAPI(gstin: string): Promise<{
  success: boolean;
  legalName: string;
  tradeName: string;
  taxpayerType: string;
  state: string;
  city: string;
  services: string;
  fullAddress: string;
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
      services: "",
      fullAddress: "",
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
      services: "",
      fullAddress: "",
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
        services: "",
        fullAddress: "",
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
        services: "",
        fullAddress: "",
        status: "AuthError",
        rawResponse: authData,
        error: "Sandbox API Authentication response did not return an access token."
      };
    }

    // Step 2: Query GSTIN using the correct Sandbox endpoint
    const gstRes = await fetch("https://api.sandbox.co.in/gst/compliance/public/gstin/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "authorization": accessToken,
        "x-api-version": "1.0.0"
      },
      body: JSON.stringify({ gstin: cleanGstin })
    });

    if (gstRes.ok) {
      const gstData = await gstRes.json();
      console.log("Raw Sandbox GST API Response:", JSON.stringify(gstData));
      
      const data = gstData?.data || gstData;
      const nestedData = data?.data || data;

      const legalName = 
        nestedData.lgnm || nestedData.legal_name || nestedData.legalName || nestedData.legal_name_of_business ||
        nestedData.company_name || nestedData.name || data.lgnm || data.legal_name || data.legal_name_of_business ||
        gstData.lgnm || gstData.legal_name || gstData.legal_name_of_business || "";

      const tradeName = 
        nestedData.tradeNam || nestedData.trade_name || nestedData.tradeName || nestedData.business_name ||
        data.tradeNam || data.trade_name || data.business_name || legalName;

      const status = nestedData.sts || nestedData.status || nestedData.gstin_status || data.sts || data.status || "Active";
      const taxpayerType = nestedData.dty || nestedData.taxpayer_type || nestedData.taxpayerType || data.dty || data.taxpayer_type || "Regular";
      const state = nestedData.pradr?.addr?.stcd || nestedData.state || data.pradr?.addr?.stcd || data.state || "India";
      const city = nestedData.pradr?.addr?.dst || nestedData.city || data.pradr?.addr?.dst || data.city || "";

      // Extract Nature of Business Activities (nba) array
      const rawNba = nestedData.nba || data.nba || gstData.nba || [];
      const services = Array.isArray(rawNba)
        ? rawNba.map(s => String(s).trim()).filter(Boolean).join(", ")
        : typeof rawNba === "string" ? rawNba : "";

      // Extract Principal Place of Business Address (pradr)
      const addrObj = nestedData.pradr?.addr || data.pradr?.addr || nestedData.principal_place_of_business || data.principal_place_of_business || {};
      const addressParts = [
        addrObj.bno || addrObj.building_no,
        addrObj.flno || addrObj.floor_no,
        addrObj.bnam || addrObj.building_name,
        addrObj.st || addrObj.street,
        addrObj.loc || addrObj.location,
        addrObj.dst || addrObj.district,
        addrObj.stcd || addrObj.state,
        addrObj.pncd || addrObj.pincode
      ].filter(Boolean);

      const fullAddress = addressParts.length > 0
        ? addressParts.join(", ")
        : (typeof addrObj === "string" ? addrObj : `${city}${city && state ? ", " : ""}${state}`);

      if (!legalName && !tradeName) {
        const rawJson = JSON.stringify(gstData);
        return {
          success: false,
          legalName: "",
          tradeName: "",
          taxpayerType: "",
          state: "",
          city: "",
          services: "",
          fullAddress: "",
          status: "NotFound",
          rawResponse: gstData,
          error: data?.message || gstData?.message || `GST API returned no legal name. Raw response: ${rawJson}`
        };
      }

      return {
        success: status.toLowerCase() === "active",
        legalName: legalName || tradeName,
        tradeName: tradeName || legalName,
        taxpayerType,
        state,
        city,
        services,
        fullAddress,
        status,
        rawResponse: gstData
      };
    } else {
      const errText = await gstRes.text();
      console.error(`Sandbox GST API failed (${gstRes.status}):`, errText);
      return {
        success: false,
        legalName: "",
        tradeName: "",
        taxpayerType: "",
        state: "",
        city: "",
        services: "",
        fullAddress: "",
        status: "APIError",
        rawResponse: {},
        error: `GST lookup failed (${gstRes.status}). ${errText}`
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
      services: "",
      fullAddress: "",
      status: "SystemError",
      rawResponse: {},
      error: `GST Verification Network Error: ${err.message || "Failed to reach Sandbox API."}`
    };
  }
}
