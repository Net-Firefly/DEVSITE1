import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";
import { SERVER_BASE_URL } from "@/lib/api";
import MessageBubble from "./MessageBubble";

const MAX_MESSAGE_LENGTH = 320;
const WHATSAPP_LINK = "https://wa.me/254700000000?text=Hello%20Tripple%20Kay%20Cutts%20Spa";

const baseQuickReplies = [
  { label: "View Services", value: "View services and prices" },
  { label: "Book Appointment", value: "I want to book an appointment" },
  { label: "Opening Hours", value: "What are your opening hours?" },
  { label: "WhatsApp Us", url: WHATSAPP_LINK },
];

const createKaiMessage = (text, quickReplies = baseQuickReplies) => ({
  id: `kai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role: "kai",
  text,
  timestamp: new Date().toISOString(),
  quickReplies,
});

const createUserMessage = (text) => ({
  id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role: "user",
  text,
  timestamp: new Date().toISOString(),
});

const localReply = (message, issue = "") => {
  const input = message.toLowerCase();
  const aiUnavailable = /unavailable|offline|quota|configuration|service limits/i.test(issue);
  const preface = aiUnavailable
    ? "Kai AI is temporarily unavailable, but I can still help right away. "
    : "";

  if (/hour|open|close|time/.test(input)) {
    return createKaiMessage(
      `${preface}We’re open Monday to Friday, 9:00 AM to 6:00 PM, and Saturday, 10:00 AM to 5:00 PM. We’re closed on Sunday.`
    );
  }

  if (/location|where|bomet|address/.test(input)) {
    return createKaiMessage(
      `${preface}Tripple Kay Cutts Spa is located in Bomet County, Kenya. If you’d like directions, tap WhatsApp Us and we’ll guide you directly.`
    );
  }

  if (/service|price|cost|charge|menu/.test(input)) {
    return createKaiMessage(
      `${preface}Popular services include Classic Cut (from KES 4,550), Premium Fade (from KES 5,850), Beard Sculpting (from KES 3,900), and spa/nail treatments. Would you like the best option for your style?`
    );
  }

  if (/book|appointment|reserve|schedule/.test(input)) {
    return createKaiMessage(
      `${preface}Great choice. I can help you book now. Please share your preferred date and time, or open the Services page to confirm your slot.`
    );
  }

  if (/hairstyle|style|fade|cut idea|look/.test(input)) {
    return createKaiMessage(
      `${preface}Top style picks right now are: low taper fade, textured crop, burst fade with curls, and clean beard lineup. Tell me your face shape and vibe, and I’ll suggest the best match.`
    );
  }

  if (/hello|hi|hey|good morning|good afternoon|good evening/.test(input)) {
    return createKaiMessage(
      `${preface}Welcome. I can help with bookings, services, prices, opening hours, and style recommendations. What would you like to do first?`
    );
  }

  if (/thank|thanks/.test(input)) {
    return createKaiMessage(
      `${preface}You’re welcome. If you’d like, I can help you choose a service and secure a booking now.`
    );
  }

  if (/beard|shave|lineup/.test(input)) {
    return createKaiMessage(
      `${preface}For beard grooming, I recommend Beard Sculpting and a clean lineup. If you tell me your preferred style, I can suggest the best finish for your look.`
    );
  }

  if (/kids|child|children/.test(input)) {
    return createKaiMessage(
      `${preface}Yes, we can recommend kid-friendly styles. Share the child’s age and preferred cut, and I’ll suggest the best option before you book.`
    );
  }

  if (/whatsapp|call|contact/.test(input)) {
    return createKaiMessage(
      `${preface}You can continue here, or tap WhatsApp Us for direct support from our team.`,
      baseQuickReplies
    );
  }

  const fallbackOptions = [
    `${preface}I can assist with services, pricing, booking, opening hours, location, and style ideas. Which one would you like right now?`,
    `${preface}Great question. I can guide you through booking, service selection, pricing, or hairstyle suggestions. What should we start with?`,
    `${preface}I’m ready to help with appointments, offers, opening times, and grooming recommendations. Tell me what you need most.`,
  ];
  const firstCharCode = input.length > 0 ? input.charCodeAt(0) : 0;
  const index = Math.abs(input.length + firstCharCode) % fallbackOptions.length;

  return createKaiMessage(fallbackOptions[index]);
};

const KaiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => [
    createKaiMessage(
      "Welcome to Tripple Kay Cutts Spa. I’m Kai – AI Assistant. I’m online and ready to help with services, prices, bookings, and style advice."
    ),
  ]);

  const scrollRef = useRef(null);

  const remainingChars = useMemo(() => MAX_MESSAGE_LENGTH - input.length, [input.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const callBackend = useCallback(async (userMessage, history) => {
    const response = await fetch(`${SERVER_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, history }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.message || "Kai is currently unavailable.");
    }

    const payload = await response.json();
    return payload?.text || "I can help with bookings, services, and pricing.";
  }, []);

  const handleSend = useCallback(
    async (overrideValue) => {
      const raw = typeof overrideValue === "string" ? overrideValue : input;
      const text = raw.trim();
      if (!text || isTyping) return;

      if (text.length > MAX_MESSAGE_LENGTH) {
        setMessages((prev) => [
          ...prev,
          createKaiMessage(`Please keep your message under ${MAX_MESSAGE_LENGTH} characters so I can assist quickly.`),
        ]);
        return;
      }

      const nextUser = createUserMessage(text);
      setMessages((prev) => [...prev, nextUser]);
      setInput("");
      setIsTyping(true);

      const history = messages.slice(-10).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      try {
        const textReply = await callBackend(text, history);
        setMessages((prev) => [...prev, createKaiMessage(textReply)]);
      } catch (error) {
        const issue = error instanceof Error ? error.message : "";
        setMessages((prev) => [...prev, localReply(text, issue)]);
      } finally {
        setIsTyping(false);
      }
    },
    [callBackend, input, isTyping, messages]
  );

  const handleReplyAction = useCallback((reply) => {
    if (reply.url) {
      window.open(reply.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (reply.value) {
      void handleSend(reply.value);
    }
  }, [handleSend]);

  const clearChat = () => {
    setMessages([
      createKaiMessage(
        "Chat cleared. I’m ready whenever you are. How can I assist you today?",
        baseQuickReplies
      ),
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mb-4 flex h-[75vh] max-h-[620px] w-[min(95vw,390px)] flex-col overflow-hidden rounded-2xl border border-primary/40 bg-black text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-primary/30 bg-black/95 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/60 bg-primary/20 text-sm font-semibold text-primary">
                  K
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Kai – AI Assistant</p>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearChat}
                  className="rounded-lg border border-primary/40 p-2 text-white/85 hover:bg-primary/10"
                  aria-label="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-primary/40 p-2 text-white/85 hover:bg-primary/10"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-black/90 px-3 py-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} onQuickReply={handleReplyAction} />
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-[75%] rounded-2xl border border-primary/35 bg-black/80 px-4 py-3"
                >
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  </div>
                  <p className="mt-1 text-[11px] text-white/60">Kai is typing...</p>
                </motion.div>
              )}
            </div>

            <div className="border-t border-primary/30 bg-black px-3 py-3">
              <div className="mb-2 flex items-center justify-between text-[11px] text-white/60">
                <span>Max {MAX_MESSAGE_LENGTH} chars</span>
                <span className={remainingChars < 30 ? "text-amber-300" : ""}>{remainingChars}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder="Ask Kai about services, styles, or bookings..."
                  className="flex-1 rounded-2xl border border-primary/35 bg-black/80 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="rounded-2xl bg-primary p-2 text-primary-foreground shadow-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="ml-auto flex h-14 items-center gap-2 rounded-full border border-primary/60 bg-black px-5 text-white shadow-2xl"
      >
        <MessageCircle className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">Chat with Kai</span>
      </motion.button>
    </div>
  );
};

export default KaiChatWidget;
