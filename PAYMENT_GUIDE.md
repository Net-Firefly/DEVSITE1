# 💳 Payment & Booking Integration Guide

Your website is ready for business! Here's how to add payment processing and booking management.

---

## 🏦 Payment Integration Options

### Option 1: M-Pesa (Kenya - RECOMMENDED)
**Best for:** Local customers, instant mobile payments

---

## Google Calendar Integration
We support creating Google Calendar events when a booking is created (or optionally when payment completes).

Steps:
1. Create a Google Cloud Service Account with the **Calendar API** enabled and generate a JSON key.
2. Share the calendar you want to use with the service account email (so the service account can add events).
3. Add the JSON to `server/.env` as `GOOGLE_SERVICE_ACCOUNT` (single-line JSON) or put the JSON file on disk and set `GOOGLE_SERVICE_ACCOUNT_PATH`.
4. Set `GOOGLE_CALENDAR_ID` to the calendar's ID (e.g., `yourcompany@gmail.com` or `xxxx@group.calendar.google.com`).
5. Optionally set `GOOGLE_CALENDAR_ON_PAYMENT=true` to only create events after payment succeeds.

The server will add `calendar_event_id` and `calendar_event_link` to the booking record when an event is created.


#### Integration Steps:
1. Register with Daraja API (M-Pesa Developer Portal)
2. Get your Consumer Key and Consumer Secret
3. Add this to `src/components/BookingForm.tsx`:

```typescript
const handlePaymentWithMPesa = async (phoneNumber: string, amount: number) => {
  const accessToken = await getMPesaAccessToken();
  
  const response = await fetch('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      BusinessShortCode: '174379', // Your M-Pesa code
      Password: generatePassword(), // Generated from timestamp + passkey
      Timestamp: getCurrentTimestamp(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: '174379',
      PhoneNumber: phoneNumber,
      CallBackURL: 'https://yourapi.com/mpesa-callback',
      AccountReference: `BOOKING-${Date.now()}`,
      TransactionDesc: 'Service Booking - Tripple Kay Cutts'
    })
  });
  
  return response.json();
};
```

**Cost:** Free to set up, 0.1% transaction fee

---

### Option 2: Stripe (International)
**Best for:** International customers, credit/debit cards

#### Integration Steps:
1. Create Stripe account at stripe.com
2. Get your Public Key and Secret Key
3. Install: `npm install @stripe/react-stripe-js @stripe/stripe-js`
4. Add to `src/components/BookingForm.tsx`:

```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_live_YOUR_PUBLIC_KEY'); // Get from Stripe dashboard

const handlePaymentWithStripe = async (amount: number) => {
  const stripe = useStripe();
  const elements = useElements();

  // Create a PaymentIntent on the server
  const resp = await fetch('/api/stripe/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: Math.round(amount), currency: 'kes' })
  });

  const { clientSecret } = await resp.json();
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: { card: elements.getElement(CardElement) }
  });

  return result;
};

// Environment variables:
// - Server (.env): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
// - Frontend (.env): VITE_STRIPE_PUBLISHABLE_KEY

// Install packages:
// - Server: `cd server && npm install stripe`
// - Frontend: `npm install @stripe/react-stripe-js @stripe/stripe-js`
```

**Cost:** 2.9% + $0.30 per transaction

---

### Option 3: PayPal
**Best for:** International payments

```typescript
const handlePaymentWithPayPal = async (amount: number) => {
  window.location.href = `https://www.paypal.com/checkoutnow?token=...`;
};
```

---

## 📅 Booking Management Systems

### Option 1: Firebase (FREE)
**Best for:** Small to medium businesses

1. Create Firebase project
2. Install: `npm install firebase`
3. Add to `src/services/bookingService.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveBooking = async (bookingData: BookingData) => {
  const docRef = await addDoc(collection(db, 'bookings'), {
    ...bookingData,
    createdAt: new Date(),
    status: 'pending'
  });
  return docRef.id;
};

export const getCustomerBookings = async (phoneNumber: string) => {
  const q = query(
    collection(db, 'bookings'),
    where('phone', '==', phoneNumber)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

---

### Option 2: Calendly Integration
**Best for:** Simple scheduling**

Embed on `/contact` page:
```tsx
<iframe 
  src="https://calendly.com/your-business/appointment"
  width="100%"
  height="600"
/>
```

---

### Option 3: Acuity Scheduling
**Best for:** Professional appointment management**

Install: `npm install acuity-scheduling`

```typescript
const bookingUrl = `https://your-business.acuityscheduling.com/schedule.php`;

// Add iFrame or redirect to Acuity
<iframe src={bookingUrl} width="100%" height="800" />
```

---

## 📧 Email Confirmations

### Setup Nodemailer (Backend)

```javascript
// backend/routes/bookings.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendBookingConfirmation = async (customerEmail, bookingDetails) => {
  await transporter.sendMail({
    to: customerEmail,
    from: 'bookings@triplekaycutts.com',
    subject: 'Booking Confirmation - Tripple Kay Cutts',
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Service: ${bookingDetails.service}</p>
      <p>Date: ${bookingDetails.date}</p>
      <p>Time: ${bookingDetails.time}</p>
      <p>Barber: ${bookingDetails.barber}</p>
      <p>Price: KES ${bookingDetails.price}</p>
      <p>Thank you for choosing Tripple Kay Cutts!</p>
    `
  });
};
```

---

## 📱 SMS Notifications

### Setup Twilio

1. Create Twilio account: twilio.com
2. Install: `npm install twilio`
3. Send SMS confirmations:

```typescript
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendBookingSMS = async (phoneNumber: string, bookingDetails) => {
  await client.messages.create({
    body: `Hi ${bookingDetails.name}! Your booking for ${bookingDetails.service} on ${bookingDetails.date} at ${bookingDetails.time} is confirmed. See you soon at Tripple Kay Cutts!`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
};
```

---

## 🔐 Backend API Setup

### Bookings persistence & admin
- Bookings are now persisted to a simple file `server/bookings.json` (replace with DB later if you want).
- Admin UI: visit `/admin/bookings` to view bookings and mark them paid (for testing).



### Example Node.js/Express Setup

```javascript
// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Booking endpoint
app.post('/api/bookings', async (req, res) => {
  const { name, email, phone, service, date, time, notes } = req.body;
  
  try {
    // Save to database
    const booking = await Booking.create({
      name, email, phone, service, date, time, notes,
      status: 'pending',
      createdAt: new Date()
    });
    
    // Send confirmation email
    await sendBookingConfirmation(email, booking);
    
    // Send SMS
    await sendBookingSMS(phone, booking);
    
    // Send notification to admin WhatsApp
    await notifyAdminWhatsApp(booking);
    
    res.json({ 
      success: true, 
      bookingId: booking.id,
      message: 'Booking created successfully!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// M-Pesa callback
app.post('/api/mpesa-callback', (req, res) => {
  const { Body } = req.body;
  const { stkCallback } = Body;
  
  if (stkCallback.ResultCode === 0) {
    // Payment successful
    console.log('Payment successful!');
    // Update booking status to 'confirmed'
  } else {
    // Payment failed
    console.log('Payment failed');
  }
  
  res.json({ ResultCode: 0 });
});

app.listen(5000, () => console.log('Server running on port 5000'));
```

---

## 🚀 Deployment Checklist

- [ ] Add environment variables (phone, email, API keys)
- [ ] Setup payment processor account
- [ ] Configure email service
- [ ] Test SMS notifications
- [ ] Create database/backend
- [ ] Add booking calendar view
- [ ] Setup admin dashboard
- [ ] Test end-to-end booking flow
- [ ] Add phone confirmation for bookings
- [ ] Setup automated reminders (24 hours before)
- [ ] Create cancellation policy
- [ ] Add receipt/invoice generation

---

## 💡 Pro Tips

1. **Start Simple:** Use Firebase + Calendly first, upgrade later
2. **WhatsApp Integration:** Use WhatsApp Business API for auto-confirmations
3. **Reminders:** Send SMS/email 24 hours before appointment
4. **Reviews:** Ask for reviews after service completion
5. **Loyalty:** Create referral program for repeat customers
6. **Analytics:** Track which services are most popular
7. **Pricing:** Consider dynamic pricing for peak times

---

## 📊 Recommended Stack

**Best Value:**
- **Payment:** M-Pesa (free for Kenya)
- **Booking:** Calendly (free)
- **Database:** Firebase (free tier)
- **Emails:** SendGrid (100 free/month)
- **SMS:** Twilio (trial credits)

**Enterprise:**
- **Payment:** Stripe
- **Booking:** Acuity Scheduling
- **Database:** PostgreSQL
- **Emails:** SendGrid/Mailgun
- **SMS:** Twilio/Vonage

---

## 🆘 API Reference

### Booking Model
```typescript
interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number; // in KES
  paymentStatus: 'pending' | 'paid' | 'failed';
  barber?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📞 Next Steps

1. Choose your payment processor (M-Pesa recommended for Kenya)
2. Choose your booking system (Calendly or Acuity)
3. Setup email confirmations
4. Deploy backend if needed
5. Test complete flow
6. Launch!

**Your website is ready to accept bookings and payments!** 🎉

---

*Website: Tripple Kay Cutts and Spa*
*Last Updated: Today*
