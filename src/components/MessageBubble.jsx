import { motion } from "framer-motion";

const formatTime = (iso) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessageBubble = ({ message, onQuickReply }) => {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ${isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-black/80 border border-primary/35 text-white"
                    }`}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className={`mt-1 text-[11px] ${isUser ? "text-primary-foreground/75" : "text-white/60"}`}>
                    {formatTime(message.timestamp)}
                </p>

                {!isUser && Array.isArray(message.quickReplies) && message.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {message.quickReplies.map((reply) => (
                            <button
                                key={reply.label}
                                type="button"
                                onClick={() => onQuickReply(reply)}
                                className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs text-white hover:bg-primary/20 transition-colors"
                            >
                                {reply.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MessageBubble;
