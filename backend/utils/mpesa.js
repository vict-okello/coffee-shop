// utils/mpesa.js
import axios from "axios";

export function mpesaBaseUrl() {
  return process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

export async function getMpesaAccessToken() {
  const baseURL = mpesaBaseUrl();
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  const r = await axios.get(`${baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  return r.data.access_token;
}

export function mpesaTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

export function mpesaPassword(shortcode, passkey, timestamp) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

export function normalizeKenyanPhone(phone) {
  // Accept: 07..., 01..., 2547..., +2547...
  let p = String(phone || "").trim().replace(/\s+/g, "");
  if (p.startsWith("+")) p = p.slice(1);

  if (/^0[17]\d{8}$/.test(p)) return "254" + p.slice(1);
  if (/^254[17]\d{8}$/.test(p)) return p;

  throw new Error("Invalid phone. Use 07XXXXXXXX or 2547XXXXXXXX.");
}
