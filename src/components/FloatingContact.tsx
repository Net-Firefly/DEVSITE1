import { useState } from "react";
import { MessageCircle, Send, Phone, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification] = useState(true);

  const whatsappNumber = "+254725077631"; // UPDATE THIS WITH ACTUAL NUMBER
  const whatsappMessage = encodeURIComponent(
    "Hello! I'm interested in booking a service at Tripple Kay Cutts and Spa. Can you help me?"
  );

  const contactOptions = [
    {
      id: 1,
      icon: MessageCircle,
      label: "WhatsApp",
      action: () => {
        window.open(
          `https://wa.me/${whatsappNumber.replace("+", "")}?text=${whatsappMessage}`,
          "_blank"
        );
      },
      color: "text-green-500",
    },
    {
      id: 2,
      icon: Phone,
      label: "Call Us",
      action: () => {
        window.location.href = `tel:+254712345678`;
      },
      color: "text-blue-500",
    },
    {
      id: 3,
      icon: Mail,
      label: "Email",
      action: () => {
        window.location.href = "mailto:info@triplekaycutts.com";
      },
      color: "text-orange-500",
    },
  ];

  return (
    <div className="fixed bottom-40 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-20 right-0 flex flex-col gap-3"
          >
            {contactOptions.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={option.action}
                className="glass-card p-4 rounded-full flex items-center gap-2 hover:scale-110 transition-transform group"
              >
                <option.icon className={`w-5 h-5 ${option.color}`} />
                <span className="font-body text-sm text-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {option.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification pulsing dot */}
        {hasNotification && !isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full"
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute bottom-20 right-20 glass-card px-4 py-2 rounded-lg text-sm text-foreground font-body pointer-events-none"
      >
        Quick Contact
      </motion.div>
    </div>
  );
};

export default FloatingContact;
