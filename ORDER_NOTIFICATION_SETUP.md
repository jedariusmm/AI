# Order Notification Setup Guide

## ✅ What's Already Working
When someone submits an order on nupiai.com/order.html, the order will be sent to `/api/submit-order`

## 📧 Email Setup (Required)

### Option 1: Resend.com (Recommended - FREE)
1. Sign up at https://resend.com
2. Verify your domain OR use their test domain
3. Get your API key from dashboard
4. Add to `/api/submit-order.js`:
   ```javascript
   const RESEND_API_KEY = 're_your_api_key_here';
   ```

### Option 2: SendGrid (FREE tier available)
1. Sign up at https://sendgrid.com
2. Create an API key
3. Use their API to send emails

### Option 3: Direct SMTP (iCloud)
- iCloud doesn't allow programmatic SMTP for security
- Use Resend or SendGrid instead

## 📱 Telegram Setup (Your Token: 8177827077:AAHRgtXS6hRAQX6I7o6nFFDi-o8tjuQC1vY)

### Get Your Chat ID:
1. Open Telegram and search for your bot (or create one at https://t.me/BotFather)
2. Send a message to your bot: `/start`
3. Visit: `https://api.telegram.org/bot8177827077:AAHRgtXS6hRAQX6I7o6nFFDi-o8tjuQC1vY/getUpdates`
4. Look for "chat":{"id": YOUR_CHAT_ID}
5. Copy that number and replace in `/api/submit-order.js`

OR

Create a Telegram channel:
1. Create a new channel (e.g., "NUPI Orders")
2. Add your bot as admin
3. Use channel username like `@nupiai_orders`

## 📞 SMS Setup (Your Phone: 7042778009)

### Option 1: Twilio (Paid but cheap - $0.0079 per SMS)
1. Sign up at https://twilio.com
2. Get a phone number ($1/month)
3. Get Account SID and Auth Token
4. Add to code:
   ```javascript
   const accountSid = 'your_sid';
   const authToken = 'your_token';
   const twilioNumber = '+1234567890';
   const yourNumber = '+17042778009';
   ```

### Option 2: Vonage/Nexmo (Paid)
Similar to Twilio

## 🔥 Quick Start (What to do NOW):

1. **Sign up for Resend.com** (takes 2 minutes):
   - Go to https://resend.com
   - Sign up with jdautotintsllc@icloud.com
   - Get API key
   - I'll add it to the code

2. **Get Telegram Chat ID**:
   - Message your bot
   - Visit the getUpdates URL above
   - Send me the chat ID

3. **SMS** (optional):
   - Can add Twilio later if you want SMS notifications
   - Email + Telegram might be enough

## Current Status:
- ✅ Order form ready
- ✅ API endpoint created
- ⏳ Need email API key (Resend)
- ⏳ Need Telegram chat ID
- ❌ SMS not set up yet (optional)

