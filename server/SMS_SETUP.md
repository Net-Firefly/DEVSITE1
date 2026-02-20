# SMS Notifications Setup Guide

## Overview
The payment system now sends SMS notifications to users when they initiate M-Pesa payments. This helps users understand that their payment prompt has been sent.

## How It Works

When a user initiates a payment:
1. Backend receives payment request
2. Initiates M-Pesa STK Push to user's phone
3. **Sends SMS notification to the same phone number** ✓
4. SMS message includes:
   - Payment confirmation
   - Amount to be paid
   - Order reference
   - Business name

**Example SMS:**
```
Hi! Your M-Pesa payment prompt has been sent. Please enter your PIN to pay 
KES 5,000 for your Tripple Kay Cuts booking. Reference: ORD-1705090800000-2
```

## Setup Instructions

### Option 1: Africa's Talking (Recommended for Kenya)

1. **Create Account**
   - Go to https://africastalking.com/
   - Sign up for free (includes test credits)
   - Verify your email

2. **Get Credentials**
   - Log in to dashboard
   - Go to Settings → API Key
   - Copy your API Key
   - Copy your username (usually "sandbox" for testing)

3. **Update .env File**
   ```env
   SMS_API_KEY=your_api_key_here
   SMS_USERNAME=sandbox
   SMS_SENDER_ID=TripleKayCuts
   ```

4. **Test Credentials (Sandbox)**
   - Username: `sandbox`
   - Receiver: `+254712345678` (any valid format)
   - You'll receive test SMSs in your Africa's Talking dashboard

### Option 2: Twilio

1. **Create Account**
   - Go to https://www.twilio.com/
   - Sign up and verify phone number
   - Get free trial credits

2. **Get Credentials**
   - Go to Console
   - Copy your Account SID and Auth Token
   - Buy a phone number

3. **Update server.js**
   - Modify the `sendSMS()` function to use Twilio API
   - Or use a community package: `npm install twilio`

### Option 3: Other SMS Providers
- AWS SNS
- Google Cloud Messaging
- Nexmo/Vonage
- Bandwidth
- MessageBird

## Testing SMS Notifications

### Without SMS API Key (Default)
```
1. User initiates payment
2. Payment succeeds
3. Console logs: "[SMS] SMS notifications not configured..."
4. No SMS is sent, but payment continues
```

### With SMS API Key
```
1. User initiates payment
2. M-Pesa STK Push sent
3. SMS notification sent to user's phone
4. Console logs: "[SMS] Message sent to +254712345678"
5. User receives SMS in their inbox
```

## Troubleshooting

### "SMS not received"
- Check API key is correct
- Verify phone number format (should be 254712345678)
- Check SMS credits/balance
- Check spam folder
- Verify sender ID is registered

### "Request failed with status code 401"
- API key is invalid
- Username is incorrect
- Check Africa's Talking credentials

### "Request timeout"
- SMS service might be down
- Check internet connection
- Increase timeout in sendSMS function

## Production Deployment

### Before Going Live

1. **Get Production Credentials**
   - Register business with SMS provider
   - Verify SMS Sender ID (your business name)
   - Set up proper authentication

2. **Update Configuration**
   ```env
   NODE_ENV=production
   SMS_API_KEY=your_production_key
   SMS_SENDER_ID=TripleKayCuts
   ```

3. **Test Thoroughly**
   - Send test payment
   - Verify SMS is received
   - Check SMS content is correct

4. **Monitor**
   - Check server logs for SMS failures
   - Monitor SMS delivery rates
   - Set up alerts for failures

## SMS Content Customization

Edit the SMS message in `server.js`, function `mpesa-initiate`:

```javascript
const smsMessage = `Hi! Your M-Pesa payment prompt has been sent. Please enter your PIN to pay KES ${parsedAmount} for your Tripple Kay Cuts booking. Reference: ${orderId}`;
```

## Cost Estimation

- **Africa's Talking**: Free tier + pay-per-SMS (usually 1-5 KES per SMS)
- **Twilio**: $0.01-0.05 per SMS in Kenya
- **Nexmo**: $0.015-0.05 per SMS

## SMS Delivery Guarantee

- SMS is sent **after** STK Push is triggered
- SMS failure doesn't block payment (payment continues)
- Delivery usually within 1-5 seconds
- Check SMS provider dashboard for delivery reports

## Support

- Africa's Talking: https://africastalking.com/help
- Twilio: https://www.twilio.com/docs
- Server logs: Check console output for [SMS] messages
