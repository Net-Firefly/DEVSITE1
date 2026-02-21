import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: "radial-gradient(circle at 70% 30%, hsl(43 74% 49%) 0%, transparent 50%)",
          }}
        />
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 text-primary font-body text-sm mb-6">
              <MapPin className="w-4 h-4" />
              Contact Us
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Get In <span className="text-gold-gradient">Touch</span>
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Book your appointment or reach out with any questions
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div 
                className="glass-card p-8"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)",
                }}
              >
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">Visit Us</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border-gold-glow flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-foreground mb-1">Address</p>
                      <p className="font-body text-muted-foreground">
                        Bomet Town<br />
                        Opposite Kenya Power<br />
                        Bomet
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border-gold-glow flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-foreground mb-1">Phone</p>
                      <p className="font-body text-muted-foreground">(+254) 726786668</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border-gold-glow flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-foreground mb-1">Email</p>
                      <p className="font-body text-muted-foreground">info@tripplekaycutts.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                className="glass-card p-8"
                style={{
                  clipPath: "polygon(0 5%, 100% 0, 100% 100%, 0 95%)",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="font-display text-2xl font-bold text-foreground">Hours</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="text-foreground">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-primary font-semibold">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-foreground">10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
              
              {/* Map placeholder */}
              <div 
                className="h-64 glass-card overflow-hidden flex items-center justify-center"
                style={{
                  clipPath: "polygon(0 0, 100% 5%, 100% 100%, 0 95%)",
                }}
              >
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                  <p className="font-body text-muted-foreground">Interactive Map</p>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div 
                className="glass-card p-8 md:p-10"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
                }}
              >
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Send a Message</h3>
                <p className="font-body text-muted-foreground mb-8">
                  Have a question or want to book? Drop us a line.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-2 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-body text-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-body text-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-2 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-body text-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-2 block">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-body text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us what you need..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full btn-gold-glow px-8 py-4 rounded-full font-body font-semibold text-primary-foreground flex items-center justify-center gap-2 shimmer"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
