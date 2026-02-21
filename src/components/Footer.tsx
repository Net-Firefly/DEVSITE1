import { Scissors, MapPin, Phone, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const Footer = () => {
  return (
    <footer className="relative py-20 overflow-hidden">
      {/* Diagonal top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-24 bg-background"
        style={{
          clipPath: "polygon(0 0, 100% 100%, 100% 100%, 0 100%)",
        }}
      />

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 6%) 0%, hsl(0 0% 4%) 100%)",
        }}
      />

      {/* Gold accent line */}
      <div
        className="absolute top-24 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(43 74% 49% / 0.5), transparent)",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 pt-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 border-primary/30">
                <OptimizedImage src="/assets/logo/logo.jpeg" alt="Tripple Kay logo" className="w-full h-full object-cover" priority={true} />
              </div>
              <div className="w-12 h-12 rounded-full border-gold-glow flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-gold-gradient">Tripple Kay</h3>
                <p className="font-body text-sm text-muted-foreground">Cutts</p>
              </div>
            </Link>
            <p className="font-body text-muted-foreground leading-relaxed">
              Where precision meets artistry. Premium grooming services in the heart of the city.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/triplekaycutts/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display text-xl font-semibold text-foreground">Quick Links</h4>
            <div className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "Gallery", path: "/gallery" },
                { name: "Reviews", path: "/reviews" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block font-body text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <h4 className="font-display text-xl font-semibold text-foreground">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <p className="font-body text-muted-foreground">
                  Find us at:<br />
                  Opposite Kenya Power<br />
                  Bomet County, Kenya
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <p className="font-body text-muted-foreground">(+254) 726786668</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-6">
            <h4 className="font-display text-xl font-semibold text-foreground">Hours</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-body text-muted-foreground">Open Hours</span>
              </div>
              <div className="glass-card p-4 rounded-lg space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Mon - Fri</span>
                  <span className="text-foreground">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-primary">9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground">10:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            borderTop: "1px solid hsl(0 0% 15%)",
          }}
        >
          <p className="font-body text-sm text-muted-foreground">
            © 2026 Tripple Kay Cutts. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
