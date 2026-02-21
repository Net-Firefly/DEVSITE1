# M-Pesa Payment Integration Setup

## Overview
This is a fully functional M-Pesa payment integration using Safaricom's Daraja API. When users enter their phone number and submit the booking form with M-Pesa selected, they will receive a prompt on their phone to complete the payment.

## What's Included

### Backend Server (`server/`)
- **server.js**: Express.js server with M-Pesa Daraja API integration
- Handles STK Push (prompts on user's phone)
- Payment callback processing
- Payment status queries

### Frontend Integration (`src/components/BookingForm.tsx`)
- M-Pesa payment method selection
- Phone number input with validation
- Calls backend API to initiate payment
- Shows success/error messages

## Getting Started

### Prerequisites
- Node.js installed
- Two terminal windows (one for frontend, one for backend)

### Step 1: Start the Backend Server

```bash
cd server
node server.js
```

You should see:
```
═══════════════════════════════════════════════════════════════
  M-Pesa Payment Server is running on port 5000
═══════════════════════════════════════════════════════════════
```

### Step 2: Start the Frontend (in another terminal)

```bash
npm run dev
```

The app will be available at `http://localhost:8080/`

### Step 3: Test M-Pesa Payment

1. Open the booking form
2. Fill in the booking details
3. Select **M-Pesa** as payment method
4. Enter your phone number: **+254708374149** (sandbox test number)
5. Enter any amount >= 10 KES
6. Click **Complete Booking & Pay**
7. You should see: "M-Pesa prompt sent to your phone"

## Configuration for Production

To use real M-Pesa payments, you need Daraja API credentials:

### Get Daraja API Credentials

1. Go to [https://developer.safaricom.co.ke/](https://developer.safaricom.co.ke/)
2. Create an account and register your app
3. Get your:
   - **Consumer Key**
   - **Consumer Secret**
   - **Shortcode** (your business shortcode)
   - **Passkey** (Lipa Na M-Pesa Online Passkey)

### Update `.env` File

Edit `server/.env`:

```env
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=your_business_shortcode
MPESA_PASSKEY=your_online_passkey_here
NODE_ENV=production
```

## How It Works

### User Flow
1. Customer fills booking form and selects M-Pesa
2. Customer enters their phone number
3. Customer clicks "Complete Booking & Pay"
4. **Frontend** sends request to backend with phone and amount
5. **Backend** calls Safaricom Daraja API to send STK Push
6. **Customer's phone** shows M-Pesa prompt
7. Customer enters PIN to complete payment
8. Safaricom sends callback to server
9. Payment is confirmed and booking is saved

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/kai-chat` | Site-specific Kai AI assistant response |
| POST | `/api/mpesa-initiate` | Initiate M-Pesa payment (STK Push) |
| POST | `/api/mpesa-query` | Check payment status |
| POST | `/api/mpesa-callback` | Receive payment confirmation from Safaricom |
| GET | `/health` | Server health check |

### Enable Kai AI (OpenAI)

Add these values to `server/.env`:

```env
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is missing, Kai in the frontend will automatically use its local keyword fallback mode.

## Troubleshooting

### "Payment server is not running"
- Make sure you started the backend with `node server.js` in the `server/` folder
- Check that port 5000 is not in use

### "Invalid phone number format"
- Use formats like: `+254712345678`, `0712345678`, or `254712345678`
- Must be a valid Kenyan number

### "Failed to get access token"
- Your Daraja API credentials are incorrect
- Check your `.env` file
- Make sure you're using sandbox credentials for testing

### "STK Push not appearing on phone"
- In sandbox, use test number: `254708374149`
- In production, use any real M-Pesa enabled number
- Phone must have M-Pesa registered

## Testing Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 8080
- [ ] M-Pesa payment method appears in booking form
- [ ] Phone number input accepts various formats
- [ ] API call made to `/api/mpesa-initiate`
- [ ] Success message displays after payment prompt sent
- [ ] User receives M-Pesa prompt on their phone (real environment)

## Security Notes

⚠️ **Important:**
- Never commit `.env` file with real credentials to git
- Use `.env.example` as template for team members
- In production, use HTTPS for all API calls
- Validate all inputs on backend
- Store payment logs securely
- Implement proper error handling and logging

## Support

For issues with Daraja API, visit:
- [Daraja Documentation](https://developer.safaricom.co.ke/docs)
- [Safaricom Developer Portal](https://developer.safaricom.co.ke/)

For issues with this integration, check the server logs for detailed error messages.
