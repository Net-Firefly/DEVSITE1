import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

const PORT = process.env.PORT || 5000;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// M-Pesa Daraja API credentials (from environment variables)
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || 'YOUR_CONSUMER_KEY';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || 'YOUR_CONSUMER_SECRET';
const SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
const PASSKEY = process.env.MPESA_PASSKEY || 'YOUR_PASSKEY';
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'http://localhost:5000/api/mpesa-callback';

// Base URLs for Daraja API
const AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const STK_PUSH_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
const QUERY_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';

let accessToken = null;
let tokenExpiry = null;

// Google Calendar config (optional)
const GCALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || '';
const GCALENDAR_ON_PAYMENT = String(process.env.GOOGLE_CALENDAR_ON_PAYMENT || 'false').toLowerCase() === 'true';

// File-backed bookings storage (bookings.json in workspace root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BOOKINGS_FILE = path.resolve(__dirname, '..', 'bookings.json');

function readBookingsFile() {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const raw = fs.readFileSync(BOOKINGS_FILE, 'utf8');
      return JSON.parse(raw || '[]');
    }
    return [];
  } catch (err) {
    console.warn('Failed to read bookings file:', err.message);
    return [];
  }
}

function writeBookingsFile(bookings) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf8');
  } catch (err) {
    console.warn('Failed to write bookings file:', err.message);
  }
}

function createBooking(data) {
  const bookings = readBookingsFile();
  const orderId = data.order_id || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const booking = {
    order_id: orderId,
    service_id: data.service_id || null,
    service_name: data.service_name || null,
    name: data.name || null,
    email: data.email || null,
    phone: data.phone || null,
    date: data.date || null,
    time: data.time || null,
    notes: data.notes || null,
    price: data.price || 0,
    payment_method: data.payment_method || 'unknown',
    payment_status: 'pending',
    checkout_request_id: null,
    payment_intent_id: null,
    transaction_receipt: null,
    mpesa_transaction_code: null,
    created_at: new Date().toISOString(),
  };
  bookings.push(booking);
  writeBookingsFile(bookings);
  return booking;
}

function getBookingByOrderId(orderId) {
  const bookings = readBookingsFile();
  return bookings.find((b) => b.order_id === orderId);
}

function getBookingByCheckoutRequestId(checkoutRequestId) {
  const bookings = readBookingsFile();
  return bookings.find((b) => b.checkout_request_id === checkoutRequestId);
}

function listBookings() {
  const bookings = readBookingsFile();
  return bookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function markBookingPaid(orderId, updates = {}) {
  const bookings = readBookingsFile();
  const idx = bookings.findIndex((b) => b.order_id === orderId);
  if (idx === -1) return null;
  bookings[idx].payment_status = 'paid';
  if (updates.payment_intent_id) bookings[idx].payment_intent_id = updates.payment_intent_id;
  if (updates.transaction_receipt) bookings[idx].transaction_receipt = updates.transaction_receipt;
  if (updates.mpesa_transaction_code) bookings[idx].mpesa_transaction_code = updates.mpesa_transaction_code;
  writeBookingsFile(bookings);
  return bookings[idx];
}

function updateBookingByOrderId(orderId, updates = {}) {
  const bookings = readBookingsFile();
  const idx = bookings.findIndex((b) => b.order_id === orderId);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], ...updates };
  writeBookingsFile(bookings);
  return bookings[idx];
}

async function createCalendarEvent(booking) {
  if (!GCALENDAR_ID) return null;
  console.warn('[Calendar] GOOGLE_CALENDAR_ID is set but calendar event creation is not fully configured. Skipping event creation.');
  return null;
}

function updateBookingCalendarEvent(orderId, event) {
  return updateBookingByOrderId(orderId, {
    calendar_event_id: event?.id || null,
    calendar_event_link: event?.htmlLink || null,
  });
}

// Email utility (nodemailer)
async function sendEmail(to, subject, html) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[Email] Email not configured. Skipping email to: ${to}`);
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log(`[Email] Sent to ${to}`);
    return true;
  } catch (err) {
    console.warn('[Email] Failed to send email:', err.message);
    return false;
  }
}

/**
 * Get access token from Daraja API
 */
async function getAccessToken() {
  try {
    // Return cached token if still valid
    if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
      return accessToken;
    }

    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(AUTH_URL, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    accessToken = response.data.access_token;
    // Token expires in 3600 seconds, cache for 3500 seconds to be safe
    tokenExpiry = new Date(Date.now() + 3500 * 1000);

    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token from Daraja API');
  }
}

/**
 * Format phone number to international format (254XXXXXXXXX)
 */
function formatPhoneNumber(phone) {
  const cleaned = String(phone || '').replace(/\D/g, '');
  if (/^254\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

/**
 * KAI chat endpoint (site-specific OpenAI assistant)
 */
app.post(['/api/kai-chat', '/chat'], async (req, res) => {
  try {
    const { message, history } = req.body || {};
    const openaiApiKey = process.env.OPENAI_API_KEY || '';

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!openaiApiKey) {
      return res.status(503).json({
        success: false,
        message: 'Kai AI is currently unavailable while service setup is completed. Please try again shortly.',
      });
    }

    const safeHistory = Array.isArray(history)
      ? history
        .slice(-12)
        .filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
        .map((item) => ({ role: item.role, content: item.content.slice(0, 1500) }))
      : [];

    const systemPrompt = [
      'You are Kai, the official AI assistant for Tripple Kay Cutts Spa in Bomet County, Kenya.',
      'You are professional, friendly, and stylish.',
      'Answer clearly and politely.',
      'Encourage customers to book appointments.',
      'If a booking is requested, ask for preferred date and time.',
      'If customers ask about services, respond confidently and attractively.',
      'If unsure, politely ask for clarification.',
      'Keep responses short, helpful, and classy.',
    ].join(' ');

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        temperature: 0.25,
        max_tokens: 280,
        messages: [
          { role: 'system', content: systemPrompt },
          ...safeHistory,
          { role: 'user', content: trimmedMessage.slice(0, 2000) },
        ],
      },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return res.status(502).json({ success: false, message: 'No AI response returned' });
    }

    return res.json({ success: true, text });
  } catch (error) {
    const openaiCode = error?.response?.data?.error?.code;
    const openaiMessage = error?.response?.data?.error?.message;
    console.error('KAI chat error:', error.response?.data || error.message);

    if (openaiCode === 'insufficient_quota') {
      return res.status(503).json({
        success: false,
        message: 'Kai AI chat is currently offline due to service limits. Please try again shortly.',
      });
    }

    if (openaiCode === 'invalid_api_key') {
      return res.status(503).json({
        success: false,
        message: 'Kai AI is currently unavailable due to a service configuration issue. Please try again shortly.',
      });
    }

    if (openaiMessage && typeof openaiMessage === 'string') {
      return res.status(500).json({
        success: false,
        message: `Kai could not respond right now: ${openaiMessage}`,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Kai could not respond right now. Please try again shortly.',
    });
  }
});

/**
 * Send SMS notification to user
 */
async function sendSMS(phoneNumber, message) {
  try {
    // SMS sending is optional and will not block payment if it fails
    const SMS_API_KEY = process.env.SMS_API_KEY;
    const SMS_SENDER_ID = process.env.SMS_SENDER_ID || 'TripleKayCuts';

    // If no SMS API key is configured, log a message and continue
    if (!SMS_API_KEY) {
      console.log(`[SMS] SMS notifications not configured. Message would be sent to ${phoneNumber}`);
      return true;
    }

    // Using Africa's Talking SMS API (popular in Kenya)
    // Alternative: You can configure Twilio, Nexmo, or other SMS providers
    const smsResponse = await axios.post(
      'https://api.sandbox.africastalking.com/version1/messaging',
      {
        username: process.env.SMS_USERNAME || 'sandbox',
        recipients: [phoneNumber],
        message: message,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'ApiKey': SMS_API_KEY,
        },
      }
    );

    console.log(`[SMS] Message sent to ${phoneNumber}`);
    return true;
  } catch (error) {
    // Log SMS error but don't fail the payment
    console.warn(`[SMS] Failed to send notification: ${error.message}`);
    return false;
  }
}

/**
 * Initiate M-Pesa STK Push
 */
async function initiateMpesaPayment({ phone, amount, orderId }) {
  // Validate input
  if (!phone || !amount || !orderId) {
    return {
      ok: false,
      status: 400,
      body: {
        success: false,
        message: 'Phone number, amount, and order ID are required',
      },
    };
  }

  // Format phone number
  const formattedPhone = formatPhoneNumber(phone);
  if (!formattedPhone) {
    return {
      ok: false,
      status: 400,
      body: {
        success: false,
        message: 'Invalid phone number format. Use 254XXXXXXXXX (e.g., 254712345678).',
      },
    };
  }

  // Validate amount
  const parsedAmount = parseInt(amount);
  if (isNaN(parsedAmount) || parsedAmount < 1) {
    return {
      ok: false,
      status: 400,
      body: {
        success: false,
        message: 'Amount must be at least 1 KES',
      },
    };
  }

  // Get access token
  const token = await getAccessToken();

  // Generate timestamp in format: YYYYMMDDHHmmss
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);

  // Generate password: base64(SHORTCODE + PASSKEY + TIMESTAMP)
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

  // Prepare STK Push request
  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: parsedAmount,
    PartyA: formattedPhone,
    PartyB: SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: orderId,
    TransactionDesc: `Booking Payment - ${orderId}`,
  };

  // Send STK Push request
  const response = await axios.post(STK_PUSH_URL, payload, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('STK Push Response:', response.data);

  if (response.data.ResponseCode === '0') {
    try {
      const existing = getBookingByOrderId(orderId);
      if (existing) {
        updateBookingByOrderId(orderId, { checkout_request_id: response.data.CheckoutRequestID });
      }
    } catch (e) {
      console.warn('Failed to update booking with checkout id:', e.message);
    }

    const smsMessage = `Hi! Your M-Pesa payment prompt has been sent. Please enter your PIN to pay KES ${parsedAmount} for your Tripple Kay Cuts booking. Reference: ${orderId}`;
    sendSMS(formattedPhone, smsMessage).catch(err => console.warn('SMS notification failed:', err));

    return {
      ok: true,
      status: 200,
      body: {
        success: true,
        message: 'M-Pesa prompt sent to your phone. Please enter your PIN to complete payment.',
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
      },
    };
  }

  return {
    ok: false,
    status: 400,
    body: {
      success: false,
      message: response.data.ResponseDescription || 'Failed to initiate payment',
    },
  };
}

app.post('/api/mpesa-initiate', async (req, res) => {
  try {
    const { phone, amount, orderId, email } = req.body;
    const result = await initiateMpesaPayment({ phone, amount, orderId });
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('M-Pesa Initiate Error:', error.response?.data || error.message);

    // For sandbox testing, return success after 2 seconds
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        // In production, this would wait for actual payment confirmation
      }, 2000);
    }

    return res.status(500).json({
      success: false,
      message: error.response?.data?.errorMessage || 'Failed to initiate M-Pesa payment. Make sure your Daraja credentials are configured.',
      details: error.message,
    });
  }
});

/**
 * Compatibility endpoint for Safaricom sample integrations
 * Accepts form-data or JSON with: phone, amount
 */
app.post('/api/mpesa_payment', async (req, res) => {
  try {
    const phone = req.body?.phone;
    const amount = req.body?.amount ?? 1;
    const orderId = `MPESA-${Date.now()}`;

    const result = await initiateMpesaPayment({ phone, amount, orderId });

    if (result.ok) {
      return res.status(200).json({
        message: 'Please Complete Payment in Your Phone and we will deliver in minutes',
        ...result.body,
      });
    }

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('M-Pesa Payment Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.errorMessage || 'Failed to initiate M-Pesa payment. Make sure your Daraja credentials are configured.',
      details: error.message,
    });
  }
});

/**
 * Query M-Pesa payment status
 */
app.post('/api/mpesa-query', async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        message: 'Checkout request ID is required',
      });
    }

    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, '')
      .slice(0, 14);

    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await axios.post(QUERY_URL, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error('M-Pesa Query Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to query payment status',
    });
  }
});

/**
 * M-Pesa Callback endpoint (called by Safaricom after payment)
 */
app.post('/api/mpesa-callback', (req, res) => {
  try {
    const body = req.body;
    console.log('M-Pesa Callback received:', body);

    // Process callback data
    if (body.Body?.stkCallback) {
      const callback = body.Body.stkCallback;
      const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = callback;

      if (ResultCode === 0) {
        // Payment successful - find booking by CheckoutRequestID and mark paid
        console.log('Payment successful:', CheckoutRequestID);
        try {
          const booking = getBookingByCheckoutRequestId(CheckoutRequestID);
          if (booking) {
            // Extract receipt and phone from CallbackMetadata
            const items = CallbackMetadata?.Item || [];
            const receipt = items.find((i) => i.Name === 'MpesaReceiptNumber')?.Value || null;
            const amount = items.find((i) => i.Name === 'Amount')?.Value || null;
            const phone = items.find((i) => i.Name === 'PhoneNumber')?.Value || null;

            markBookingPaid(booking.order_id, { transaction_receipt: receipt, mpesa_transaction_code: receipt });

            // Notify user
            sendEmail(booking.email, 'Booking Paid - Tripple Kay Cuts', `<p>Your booking (${booking.order_id}) has been paid via M-Pesa. Receipt: ${receipt}. Amount: KES ${amount}.</p>`).catch(() => { });
            sendSMS(phone || booking.phone, `Hi ${booking.name || ''}, payment received for booking ${booking.order_id}. Thank you!`).catch(() => { });
          } else {
            console.warn('No booking found for CheckoutRequestID:', CheckoutRequestID);
          }
        } catch (e) {
          console.warn('Error updating booking after M-Pesa callback:', e.message);
        }

      } else {
        // Payment failed
        console.log('Payment failed:', ResultDesc);
      }
    }

    // Acknowledge receipt of callback
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('Callback Error:', error);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Error processing callback' });
  }
});

/**
 * Create Stripe PaymentIntent endpoint
 */
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'kes', metadata } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    // Note: KES is a zero-decimal currency; amount should be an integer in KES (e.g. 500)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      metadata: metadata || {},
      automatic_payment_methods: { enabled: true },
    });

    // If orderId passed in metadata, attach to booking
    try {
      if (metadata?.orderId) {
        updateBookingByOrderId(metadata.orderId, { payment_intent_id: paymentIntent.id });
      }
    } catch (e) {
      console.warn('Failed to update booking with payment_intent_id:', e.message);
    }

    return res.json({ success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('Stripe create-payment-intent error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Stripe webhook endpoint
 * Note: Stripe requires the raw request body for signature verification.
 */
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      // Use metadata (e.g., orderId) to mark booking as paid and send SMS/notification
      try {
        if (paymentIntent.metadata?.orderId) {
          const orderId = paymentIntent.metadata.orderId;
          const booking = getBookingByOrderId(orderId);
          if (booking) {
            markBookingPaid(orderId, { payment_intent_id: paymentIntent.id });
            // Notify user
            sendEmail(booking.email, 'Booking Paid - Tripple Kay Cuts', `<p>Your booking (${orderId}) has been paid. Thank you!</p>`).catch(() => { });
            sendSMS(booking.phone, `Hi ${booking.name || ''}, your payment for order ${orderId} was successful. Thank you!`).catch(() => { });
          }
        }
      } catch (e) {
        console.warn('Error handling payment_intent.succeeded webhook:', e.message);
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      console.log('Payment failed:', event.data.object);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * Create a booking
 */
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, service_id, service_name, date, time, notes, price, payment_method, service_duration } = req.body;

    if (!name || !email || !phone || !service_name || !date || !time) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields' });
    }

    const booking = createBooking({ name, email, phone, service_id, service_name, date, time, notes, price: Math.round(price), payment_method, service_duration });

    // Create Google Calendar event immediately unless configured to create on payment
    if (GCALENDAR_ID && !GCALENDAR_ON_PAYMENT) {
      const ev = await createCalendarEvent(booking);
      if (ev) booking.calendar_event_id = ev.id;
    }

    return res.json({ success: true, booking });
  } catch (err) {
    console.error('Create booking error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * List bookings (admin)
 */
app.get('/api/bookings', (req, res) => {
  try {
    const rows = listBookings();
    res.json({ success: true, bookings: rows });
  } catch (err) {
    console.error('List bookings error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Get single booking by order id
 */
app.get('/api/bookings/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const booking = getBookingByOrderId(orderId);
    if (!booking) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, booking });
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Manually mark booking paid (admin/testing)
 */
app.post('/api/bookings/:orderId/mark-paid', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { payment_intent_id, transaction_receipt, mpesa_transaction_code } = req.body;

    let updated = markBookingPaid(orderId, {
      payment_intent_id,
      transaction_receipt,
      mpesa_transaction_code: mpesa_transaction_code || transaction_receipt,
    });

    // Notify customer
    if (updated && updated.email) {
      await sendEmail(updated.email, 'Booking Paid - Tripple Kay Cuts', `<p>Your booking (${orderId}) has been marked as paid. Thank you!</p>`).catch(() => { });
      sendSMS(updated.phone, `Hi ${updated.name || ''}, your booking ${orderId} is confirmed. Thank you!`).catch(() => { });
    }
    // If calendar events are created on payment, do it now (if not created yet)
    try {
      if (GCALENDAR_ID && GCALENDAR_ON_PAYMENT && updated && !updated.calendar_event_id) {
        const ev = await createCalendarEvent(updated);
        if (ev) updated = updateBookingCalendarEvent(orderId, ev);
      }
    } catch (e) {
      console.warn('Failed to create calendar event on payment:', e.message || e);
    }
    res.json({ success: true, booking: updated });
  } catch (err) {
    console.error('Mark paid error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Receive quiz claim submissions from frontend and persist to disk
 */
app.post('/api/quiz-claim', (req, res) => {
  try {
    const { name, email, prize, score, date } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const filePath = path.resolve(process.cwd(), 'quiz_claims.json');
    let existing = [];
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        existing = JSON.parse(raw || '[]');
      } catch (e) {
        console.warn('Failed to parse existing quiz claims file, overwriting.');
        existing = [];
      }
    }

    existing.push({ name, email, prize: prize || null, score: score || null, date: date || new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf8');

    // Optionally send an SMS to the user (best-effort)
    if (process.env.SMS_API_KEY) {
      const formatted = formatPhoneNumber(req.body.phone || '');
      if (formatted) {
        sendSMS(formatted, `Hi ${name}, your prize claim (${prize}) has been received. We'll be in touch.`).catch(() => { });
      }
    }

    return res.json({ success: true, message: 'Claim recorded' });
  } catch (error) {
    console.error('Quiz claim error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record claim' });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'M-Pesa Payment Server is running',
    time: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
═══════════════════════════════════════════════════════════════
  M-Pesa Payment Server is running on port ${PORT}
═══════════════════════════════════════════════════════════════

  API Endpoints:
  - POST /api/kai-chat                    : Site-specific KAI assistant (OpenAI)
  - POST /api/mpesa-initiate              : Initiate M-Pesa payment
  - POST /api/mpesa-query                 : Query payment status
  - POST /api/mpesa-callback              : Payment callback (Safaricom)
  - POST /api/stripe/create-payment-intent: Create Stripe PaymentIntent (server-side)
  - POST /api/stripe-webhook              : Stripe webhook endpoint (configure STRIPE_WEBHOOK_SECRET)
  - GET  /health                          : Health check

  To configure M-Pesa:
  1. Create a .env file in the server directory
  2. Add your Daraja API credentials:
     MPESA_CONSUMER_KEY=your_key
     MPESA_CONSUMER_SECRET=your_secret
     MPESA_SHORTCODE=174379
     MPESA_PASSKEY=your_passkey

  Sandbox Testing:
  - Phone: 254708374149 (Test account)
  - Amount: Any amount >= 10 KES
  
═══════════════════════════════════════════════════════════════
  `);
});
