import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SERVER_BASE_URL } from "@/lib/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "kai";
  timestamp: Date;
  suggestions?: Array<{ label: string; action?: () => void; value?: string }>;
}

const KaiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to Tripple Kay Cutts & Spa. I’m Kai, your grooming concierge. How can I assist you today?",
      sender: "kai",
      timestamp: new Date(),
      suggestions: [
        { label: "Book an appointment", value: "I want to book an appointment" },
        { label: "View services", action: () => { } },
        { label: "Grooming tips", value: "Give me grooming tips" },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Knowledge base for fallback (when OpenAI unavailable)
  const knowledgeBase = {
    booking: {
      keywords: ["book", "appointment", "schedule", "reserve", "when", "available"],
      response: "Excellent choice. I can help you secure your appointment.\n\nHours:\nMonday-Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 5:00 PM\nSunday: Closed\n\nWhich service would you like to book?",
      suggestions: [
        { label: "Haircut", value: "haircut" },
        { label: "Beard trim", value: "beard" },
        { label: "Nail service", value: "nails" },
        { label: "Go to booking page", action: () => navigate("/services") },
      ],
    },
    services: {
      keywords: ["service", "offer", "what do you provide"],
      response: "We offer a premium barbering and grooming experience.\n\nHaircuts & Grooming:\n• Classic Cut - 4,550 KES\n• Premium Fade - 5,850 KES\n• Beard Sculpting - 3,900 KES\n• Full Experience - 9,750 KES\n\nNails & Spa:\n• Manicures, Pedicures, Gel, and Nail Art\n\nWould you like me to help you book one?",
      suggestions: [
        { label: "Book service", action: () => navigate("/services") },
        { label: "See pricing", value: "What are your prices?" },
        { label: "Contact us", action: () => navigate("/contact") },
      ],
    },
    grooming: {
      keywords: ["tip", "advice", "care", "grooming", "how to"],
      response: "Here are professional grooming essentials:\n\nBeard Care:\n• Trim every 2-3 weeks\n• Apply beard oil daily\n• Keep skin hydrated\n\nHair Maintenance:\n• Wash 2-3 times weekly\n• Use a quality shampoo\n• Schedule trims every 3-4 weeks\n\nNail Care:\n• Keep nails clean and dry\n• Moisturize regularly\n\nWould you like more tips or would you prefer to book a service?",
      suggestions: [
        { label: "Book service", action: () => navigate("/services") },
        { label: "More tips", value: "Tell me more grooming tips" },
      ],
    },
  };

  // Call backend KAI API first, else fall back to keyword matching
  const getAIResponse = async (userInput: string): Promise<{ text: string; suggestions?: Message["suggestions"] }> => {
    const toneRepairKeywords = [
      "rude",
      "mean",
      "asshole",
      "stupid",
      "dumb",
      "idiot",
      "hate",
      "angry",
      "mad",
      "annoyed",
      "bad service",
      "not helpful",
    ];

    const lowerInput = userInput.toLowerCase();
    if (toneRepairKeywords.some((kw) => lowerInput.includes(kw))) {
      return {
        text: "Thank you for the feedback, and I’m sorry about your experience. I’m here to make this easy and helpful from here onward. How would you like me to assist you right now?",
        suggestions: [
          { label: "Book appointment", value: "I want to book an appointment" },
          { label: "See services", value: "What services do you offer?" },
          { label: "Contact us", action: () => navigate("/contact") },
        ],
      };
    }

    // Try server-side AI first
    if (SERVER_BASE_URL) {
      try {
        const response = await fetch(`${SERVER_BASE_URL}/api/kai-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userInput,
            history: messages
              .slice(-12)
              .map((m) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.text,
              })),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.text || "I’m unable to respond fully at the moment, but I can still help with bookings, services, and pricing.";
          return {
            text,
            suggestions: [
              { label: "Book now", action: () => navigate("/services") },
              { label: "Services", value: "What services do you offer?" },
              { label: "Contact", action: () => navigate("/contact") },
            ],
          };
        }

        let backendMessage = "";
        try {
          const errorData = await response.json();
          backendMessage = typeof errorData?.message === "string" ? errorData.message : "";
        } catch {
          // ignore parse failure
        }

        if (backendMessage.toLowerCase().includes("quota exceeded")) {
          return {
            text: "Kai AI chat is briefly unavailable. I can still assist you with bookings, services, pricing, and opening hours right now.",
            suggestions: [
              { label: "Book now", action: () => navigate("/services") },
              { label: "Services", value: "What services do you offer?" },
              { label: "Hours", value: "What are your opening hours?" },
            ],
          };
        }
      } catch (error) {
        console.warn("KAI backend error, falling back to keyword matching:", error);
      }
    }

    // Fallback: keyword matching
    const input = userInput.toLowerCase();
    for (const [topic, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some((kw) => input.includes(kw))) {
        return {
          text: data.response,
          suggestions: data.suggestions,
        };
      }
    }

    // Default helpful response
    return {
      text: "I can help with bookings, service details, pricing, and grooming guidance. Which area would you like to explore first?",
      suggestions: [
        { label: "Book appointment", value: "I want to book" },
        { label: "See services", action: () => navigate("/services") },
        { label: "Grooming tips", value: "grooming tips" },
      ],
    };
  };

  const handleSendMessage = useCallback(async (text?: string, action?: () => void) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // If button has an action, execute it first
    if (action) {
      action();
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Get AI response
    setTimeout(async () => {
      const response = await getAIResponse(messageText);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response.text,
        sender: "kai",
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 600);
  }, [getAIResponse, inputValue]);

  return (
    <div
      className="fixed bottom-6 right-6 z-30"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`glass-card rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col ${isMinimized
              ? "h-16 w-40"
              : "w-[400px] max-w-[95vw] h-[500px] sm:h-[550px] md:h-[600px] max-h-[70vh]"
              }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="font-display font-bold text-primary-foreground">Kai</p>
                  <p className="text-xs text-primary-foreground/70">Your barber assistant</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-primary-foreground" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 min-h-[200px]">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-2xl ${message.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-white/10 text-foreground rounded-bl-none border border-white/20"
                          }`}
                      >
                        <p className="font-body text-sm whitespace-pre-wrap">{message.text}</p>

                        {/* Suggestions */}
                        {message.suggestions && message.sender === "kai" && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (suggestion.action) {
                                    suggestion.action();
                                  } else if (suggestion.value) {
                                    handleSendMessage(suggestion.value);
                                  }
                                }}
                                className="px-3 py-1 rounded-full text-xs bg-primary/20 hover:bg-primary/40 text-primary transition-colors"
                              >
                                {suggestion.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="p-3 rounded-2xl rounded-bl-none bg-white/10 border border-white/20">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                              className="w-2 h-2 rounded-full bg-primary"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-white/10 p-3 flex items-center gap-2 bg-background/30">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask Kai anything..."
                    className="flex-1 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button to open chat */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative px-6 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-shadow font-body font-semibold"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="flex items-center gap-3"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with Kai AI</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification dot */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full"
          />
        )}
      </motion.button>
    </div>
  );
};

export default KaiChatbot;
