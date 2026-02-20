import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: "radial-gradient(circle at 50% 50%, hsl(43 74% 49%) 0%, transparent 50%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-16 max-w-3xl mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stay Updated with <span className="text-gold-gradient">Special Offers</span>
          </h2>

          <p className="font-body text-lg text-muted-foreground mb-8">
            Subscribe to our newsletter and get exclusive discounts, new service announcements, and beauty tips delivered to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-green-500"
            >
              <CheckCircle className="w-6 h-6" />
              <p className="font-body font-medium">Thanks for subscribing!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-3 rounded-full bg-white/5 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-body font-medium hover:bg-primary/90 transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <p className="font-body text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}

          <div className="mt-10 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-around gap-6">
            <div>
              <p className="font-display text-2xl font-bold text-primary">10K+</p>
              <p className="font-body text-sm text-muted-foreground">Satisfied Clients</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-primary">100%</p>
              <p className="font-body text-sm text-muted-foreground">Satisfaction Guarantee</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-primary">5⭐</p>
              <p className="font-body text-sm text-muted-foreground">Trusted Reviews</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
