import express from "express";
import axios from "axios";
import Order from "../models/Order.js";
import {
  getMpesaAccessToken,
  mpesaBaseUrl,
  mpesaPassword,
  mpesaTimestamp,
  normalizeKenyanPhone,
} from "../utils/mpesa.js";

const router = express.Router();

//
router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "mpesa route working" });
});

/**
 * POST /api/mpesa/stkpush
 * Body: { orderId, phone }
 */
router.post("/stkpush", async (req, res) => {
  try {
    const { orderId, phone } = req.body;
    if (!orderId || !phone) {
      return res.status(400).json({ message: "orderId and phone are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const amount = Number(order?.totals?.total ?? 0);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid order total" });
    }

    const token = await getMpesaAccessToken();
    const baseURL = mpesaBaseUrl();

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackURL = process.env.MPESA_CALLBACK_URL;

    if (!shortcode || !passkey || !callbackURL) {
      return res.status(500).json({
        message:
          "Missing MPESA env vars. Ensure MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL are set.",
      });
    }

    const timestamp = mpesaTimestamp();
    const password = mpesaPassword(shortcode, passkey, timestamp);

    const partyA = normalizeKenyanPhone(phone);

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount), // M-Pesa expects integer
      PartyA: partyA,
      PartyB: shortcode,
      PhoneNumber: partyA,
      CallBackURL: callbackURL,
      AccountReference: process.env.MPESA_STK_ACCOUNT_REF || `ORDER-${order._id}`,
      TransactionDesc: process.env.MPESA_STK_DESC || "Order payment",
    };

    const r = await axios.post(
      `${baseURL}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    //  Save IDs so callback can map back
    order.mpesa = {
      ...(order.mpesa || {}),
      phone: partyA,
      amount: Math.round(amount),
      merchantRequestID: r.data.MerchantRequestID || "",
      checkoutRequestID: r.data.CheckoutRequestID || "",
      resultDesc: r.data.CustomerMessage || r.data.ResponseDescription || "",
    };
    await order.save();

    return res.json({
      ok: true,
      message: r.data.CustomerMessage || "STK Push sent. Check your phone.",
      MerchantRequestID: r.data.MerchantRequestID,
      CheckoutRequestID: r.data.CheckoutRequestID,
      ResponseCode: r.data.ResponseCode,
    });
  } catch (err) {
    // Helpful Axios error info (Daraja returns useful text)
    const detail =
      err?.response?.data?.errorMessage ||
      err?.response?.data?.ResponseDescription ||
      err?.response?.data ||
      err.message;

    return res.status(500).json({ message: "STK push failed", error: detail });
  }
});

/**
 * POST /api/mpesa/callback
 * Safaricom will POST result here after user enters PIN
 */
router.post("/callback", async (req, res) => {
  try {
    const stk = req.body?.Body?.stkCallback;

    // Always ACK quickly
    if (!stk) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const checkoutRequestID = stk.CheckoutRequestID;
    const resultCode = Number(stk.ResultCode);
    const resultDesc = stk.ResultDesc;

    const order = await Order.findOne({
      "mpesa.checkoutRequestID": checkoutRequestID,
    });

    if (!order) {
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    let receiptNumber = "";
    let paidAmount = 0;
    let transactionDate = "";

    const items = stk?.CallbackMetadata?.Item || [];
    for (const it of items) {
      if (it.Name === "MpesaReceiptNumber") receiptNumber = it.Value;
      if (it.Name === "Amount") paidAmount = Number(it.Value || 0);
      if (it.Name === "TransactionDate") transactionDate = String(it.Value || "");
    }

    //  Update mpesa subdoc (NO mpesa.paidAt here)
    order.mpesa = {
      ...(order.mpesa || {}),
      resultCode,
      resultDesc,
      receiptNumber,
      transactionDate,
      amount: paidAmount || order.mpesa?.amount || 0,
    };

    //  Mark paid if successful
    if (resultCode === 0) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = "paid";
    }

    await order.save();

    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    // Always ACK to Safaricom even on error
    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
});

export default router;
