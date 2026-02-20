import { motion } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";
import { useState } from "react";

interface Offer {
  id: number;
  title: string;
  description: string;
  discount: string;
  icon: React.ReactNode;
  services: string[];
  code: string;
}

const SpecialOffers = ({ onBookNow }: { onBookNow?: () => void }) => {
  const offers: Offer[] = [
    {
      id: 1,
      title: "New Customer Special",
      description: "Get 20% off your first haircut service",
      discount: "20% OFF",
      icon: <Zap className="w-6 h-6" />,
      services: ["Classic Cut", "Premium Fade", "Line-Up Only"],
      code: "WELCOME20",
    },
    {
      id: 2,
      title: "Combo Deal",
      description: "Get a haircut + beard trim for less",
      discount: "25% OFF",
      icon: <Sparkles className="w-6 h-6" />,
      services: ["Premium Fade", "Beard Sculpting"],
      code: "COMBO25",
    },
    {
      id: 3,
      title: "Friday Special",
      description: "All nail services get 15% discount",
      discount: "15% OFF",
      icon: <Sparkles className="w-6 h-6" />,
      services: ["All Nail Services"],
      code: "FRIDAY15",
    },
  ];

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: "radial-gradient(circle at 50% 50%, hsl(43 74% 49%) 0%, transparent 50%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Special <span className="text-gold-gradient">Offers</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Enjoy exclusive discounts on your favorite services. Limited time offers!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="glass-card p-8 h-full flex flex-col transition-all duration-500 hover:scale-105 relative overflow-hidden">
                {/* Discount Badge */}
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full">
                  <p className="font-display font-bold text-sm">{offer.discount}</p>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full border-gold-glow flex items-center justify-center mb-6 text-primary group-hover:animate-glow">
                  {offer.icon}
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {offer.title}
                </h3>
                <p className="font-body text-muted-foreground mb-6 flex-1">
                  {offer.description}
                </p>

                {/* Services */}
                <div className="mb-6">
                  <p className="font-body text-sm text-primary mb-2">Valid for:</p>
                  <ul className="space-y-1">
                    {offer.services.map((service, i) => (
                      <li key={i} className="font-body text-sm text-muted-foreground">
                        • {service}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Code */}
                <div className="bg-primary/10 p-4 rounded-lg mb-6 border border-primary/20">
                  <p className="font-body text-xs text-muted-foreground mb-2">Promo Code:</p>
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className="w-full font-display font-bold text-primary text-lg hover:text-primary/80 transition-colors text-center"
                  >
                    {copiedCode === offer.code ? "✓ Copied!" : offer.code}
                  </button>
                </div>

                {/* CTA Button */}
                <button
                  onClick={onBookNow}
                  className="w-full py-3 rounded-full bg-primary text-primary-foreground font-body font-medium hover:bg-primary/90 transition-all duration-300"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-body text-sm text-muted-foreground mt-12"
        >
          *Valid on first booking. Cannot be combined with other offers. Expires in 30 days.
        </motion.p>
      </div>
    </section>
  );
};

export default SpecialOffers;
