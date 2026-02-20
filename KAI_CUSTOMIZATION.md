# 🤖 **KAI CUSTOMIZATION GUIDE**

## Quick Start - Customize Kai in 5 Minutes

### 1. **Change Kai's Name**

**File:** `src/components/KaiChatbot.tsx`

**Find (line ~85):**
```tsx
<p className="font-display font-bold text-primary-foreground">Kai</p>
```

**Change to:**
```tsx
<p className="font-display font-bold text-primary-foreground">Your Bot Name</p>
```

---

### 2. **Update Welcome Message**

**File:** `src/components/KaiChatbot.tsx`

**Find (line ~39):**
```tsx
text: "Hey there! 👋 I'm Kai, your personal barber assistant at Tripple Kay Cutts & Spa. How can I help you today?",
```

**Change to:**
```tsx
text: "Hey there! 👋 I'm [Name], your personal barber assistant. How can I help you today?",
```

---

### 3. **Update Service Information**

**File:** `src/components/KaiChatbot.tsx`

**Find (line ~135):**
```typescript
if (input.includes("haircut") || input.includes("fade") || input.includes("cut")) {
  return {
    text: "Awesome choice! 💇 We offer several haircut services:\n\n✨ Classic Cut - 4,550 KES\n✨ Premium Fade - 5,850 KES\n✨ Beard Sculpting - 3,900 KES\n✨ The Full Experience - 9,750 KES\n\nReady to book?",
```

**Update with your prices:**
```typescript
text: "Awesome choice! 💇 We offer several haircut services:\n\n✨ Classic Cut - [YOUR PRICE]\n✨ Premium Fade - [YOUR PRICE]\n✨ Beard Sculpting - [YOUR PRICE]\n✨ The Full Experience - [YOUR PRICE]\n\nReady to book?",
```

---

### 4. **Update Hours & Location**

**File:** `src/components/KaiChatbot.tsx`

**Find (line ~45):**
```typescript
text: "Great! I'd love to help you book an appointment. 📅 We're open:\n\n📍 Monday-Friday: 9:00 AM - 6:00 PM\n📍 Saturday: 10:00 AM - 5:00 PM\n📍 Sunday: Closed\n\nWhat service are you interested in?",
```

**Update your hours:**
```typescript
text: "Great! I'd love to help you book an appointment. 📅 We're open:\n\n📍 Monday-Friday: [YOUR HOURS]\n📍 Saturday: [YOUR HOURS]\n📍 Sunday: [YOUR HOURS]\n\nWhat service are you interested in?",
```

**Find (line ~209):**
```typescript
text: "Find us here! 📍\n\n📌 Tripple Kay Cutts & Spa\n📍 Nairobi, Kenya\n\n⏰ HOURS:\nMonday-Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 5:00 PM\nSunday: Closed\n\nNeed directions?",
```

**Update location:**
```typescript
text: "Find us here! 📍\n\n📌 [Your Business Name]\n📍 [Your Address]\n\n⏰ HOURS:\nMonday-Friday: [YOUR HOURS]\nSaturday: [YOUR HOURS]\nSunday: [YOUR HOURS]\n\nNeed directions?",
```

---

### 5. **Update Contact Information**

**File:** `src/components/KaiChatbot.tsx`

**Find (line ~219):**
```typescript
text: "Ready to connect? 📞\n\n💬 WhatsApp: Click the floating button (bottom right)\n📞 Call: Available 24/7\n📧 Email: info@triplekaycutts.com\n\nWhat's the best way to reach you?",
```

**Update with your info:**
```typescript
text: "Ready to connect? 📞\n\n💬 WhatsApp: Click the floating button (bottom right)\n📞 Call: [YOUR PHONE]\n📧 Email: [YOUR EMAIL]\n\nWhat's the best way to reach you?",
```

---

## 🎯 **Add New Topics to Kai**

### Template for Adding a Topic

**File:** `src/components/KaiChatbot.tsx`

**Location:** Inside the `getAIResponse()` function

```typescript
// Add this BEFORE the final return statement (around line 280)

if (input.includes("keyword1") || input.includes("keyword2") || input.includes("keyword3")) {
  return {
    text: "Your response text here! 📝\n\nYou can include:\n• Multiple lines\n• Emojis 🎉\n• Bullet points\n\nWhat next?",
    suggestions: ["Option 1", "Option 2", "Option 3"],
  };
}
```

### Example: Add a Loyalty Program Topic

```typescript
if (input.includes("loyalty") || input.includes("rewards") || input.includes("membership")) {
  return {
    text: "We have an awesome loyalty program! 🏆\n\n✨ Earn points on every visit\n✨ 10 visits = Free service\n✨ VIP exclusive discounts\n✨ Birthday specials\n\nReady to join?",
    suggestions: ["Tell me more", "How to earn points", "Sign me up"],
  };
}
```

---

## 🎨 **Customize Kai's Appearance**

### Change Button Color

**File:** `src/components/KaiChatbot.tsx`

**Find (line ~73):**
```tsx
className="bg-gradient-to-r from-primary to-primary/80"
```

**Change to any color:**
```tsx
className="bg-gradient-to-r from-blue-600 to-blue-500"
```

### Change Chat Window Size

**Find (line ~72):**
```tsx
className={`glass-card rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
  isMinimized ? "h-16" : "h-[600px] w-[400px]"  // ← Change these
}`}
```

**Adjust sizes:**
- `h-[600px]` = height (pixels)
- `w-[400px]` = width (pixels)

---

## 🚀 **Add Quick Action Buttons**

### Add Booking Button

Replace the text suggestion with a button:

```typescript
text: "Ready to book? Click below! 📅",
suggestions: ["Book Now", "Choose Service", "Ask More"],
```

---

## 🎓 **Advanced: Add Conditional Logic**

### Example: Recommend Services Based on Time

```typescript
// Add this to getAIResponse()
const hour = new Date().getHours();

if (hour >= 9 && hour < 12) {
  return {
    text: "Good morning! 🌅 Many customers love our Full Experience in the morning. Want to know more?",
    suggestions: ["View services", "Book now", "Grooming tips"],
  };
} else if (hour >= 12 && hour < 17) {
  return {
    text: "Good afternoon! 🌞 Perfect time for a quick haircut or beard trim. Interested?",
    suggestions: ["Quick cuts", "Beard trim", "Full service"],
  };
}
```

---

## 📊 **Track Kai's Performance**

### Add Analytics (Optional)

**Track these:**
```typescript
const [totalMessages, setTotalMessages] = useState(0);
const [topicsMentioned, setTopicsMentioned] = useState({});

// In handleSendMessage():
setTotalMessages(prev => prev + 1);
```

---

## 🎬 **Create Custom Conversation Flows**

### Example: Multi-Step Booking Process

```typescript
// Add state to track conversation step
const [conversationStep, setConversationStep] = useState(0);

// Modify getAIResponse() to return different responses based on step
if (conversationStep === 0) {
  return { text: "What service do you need?" };
} else if (conversationStep === 1) {
  return { text: "What date works for you?" };
} else if (conversationStep === 2) {
  return { text: "What time?" };
}
```

---

## 🔧 **Common Customizations**

### Change Welcome Message
Update line 39 in KaiChatbot.tsx

### Add New Service
Add new `if` condition in `getAIResponse()`

### Update Pricing
Search for "KES" and update numbers

### Change Team Names
Update line 195 (team section)

### Update Special Offers
Update line 242 (promo codes section)

### Change Operating Hours
Update lines 45 and 209

---

## ✨ **Pro Tips**

### 1. **Use Emojis for Visual Interest**
```typescript
text: "Great! 💇 Here's what we offer..."
```

### 2. **Make Suggestions Action-Oriented**
```typescript
suggestions: ["Book Now", "See All Services", "Contact Us"]
// NOT: suggestions: ["yes", "no", "ok"]
```

### 3. **Include Line Breaks for Readability**
```typescript
text: "Service 1\n\nService 2\n\nService 3"
```

### 4. **Personalize Responses**
```typescript
// Add customer name if you have it
text: `Hi ${customerName}! Here's what we offer...`
```

### 5. **Create Topic Aliases**
```typescript
// Users say different things for same topic
if (input.includes("beard") || input.includes("facial") || 
    input.includes("stubble") || input.includes("shave")) {
  // Beard-related response
}
```

---

## 📱 **Mobile Customization**

### Adjust for Mobile

**Find (line ~72):**
```tsx
h-[600px] w-[400px]
```

**For mobile optimization:**
```tsx
h-[500px] w-[90vw] sm:w-[400px]
```

---

## 🎯 **Integration with Other Features**

### Link to Booking Form

In suggestions, link to booking:
```typescript
suggestions: ["Book with Kai", "See availability", "Chat more"]
```

### Link to Services Page

```typescript
// In suggestion click handler
onClick={() => window.location.href = "/services"}
```

---

## 🔐 **Keep Sensitive Info Secure**

### DON'T hardcode:
- Personal phone numbers (use environment variables)
- Email addresses (use environment variables)
- Bank details
- Passwords

### DO use:
```typescript
const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER;
const businessEmail = process.env.REACT_APP_BUSINESS_EMAIL;
```

---

## 🚀 **Next Steps**

1. ✅ Customize the basic info (name, hours, phone)
2. ✅ Update service information
3. ✅ Test Kai on your website
4. ✅ Add custom topics
5. ✅ Collect customer feedback
6. ✅ Continuously improve responses

---

## 📞 **Support**

Need help? Check:
1. KAI_DOCUMENTATION.md - Full feature guide
2. Console errors - Browser dev tools (F12)
3. React documentation - https://react.dev

---

## 🎉 **You're Ready!**

Your AI assistant Kai is customized and ready to serve your customers!

**Remember:** The more you customize, the better Kai becomes for your business.

---

*Last Updated: Today*
*Status: Ready for Customization*
