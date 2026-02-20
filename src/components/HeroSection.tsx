import { MapPin, Bookmark, Share2, Star, Scissors } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Diagonal background layers */}
      <div className="absolute inset-0 bg-background" />

      {/* Diagonal gold accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-10"
        style={{
          background: "linear-gradient(135deg, transparent 0%, hsl(43 74% 49% / 0.3) 100%)",
          clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />

      {/* Curved decorative element */}
      <div
        className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, hsl(43 74% 49%) 0%, transparent 70%)",
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-primary/20 rotate-45 float" />
      <div className="absolute bottom-40 right-20 w-16 h-16 border border-primary/30 rounded-full float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-primary/10 rotate-12 float" style={{ animationDelay: "1s" }} />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left content */}
          <div className="flex-1 space-y-8 animate-slide-in-left">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full border-gold-glow">
              <Scissors className="w-4 h-4 text-primary" />
              <span className="text-sm font-body text-primary">Premium Barbershop</span>
            </div>

            {/* Brand name */}
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-none">
              <span className="text-foreground">Tripple</span>
              <br />
              <span className="text-gold-gradient">Kay Cutts</span>
            </h1>

            {/* Tagline */}
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-md">
              Where precision meets artistry. Experience the ultimate in grooming excellence.
            </p>

            {/* Action buttons - Pill shaped */}
            <div className="flex flex-wrap gap-4">
              <button className="btn-gold-glow px-8 py-4 rounded-full font-body font-semibold text-primary-foreground flex items-center gap-2 shimmer hover:scale-105 transition-transform">
                Book Now
              </button>
              <button className="px-8 py-4 rounded-full font-body font-medium border border-primary/50 text-foreground hover:bg-primary/10 transition-all duration-300 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </button>
            </div>
          </div>

          {/* Right - Rating emblem */}
          <div className="flex-shrink-0 animate-rotate-in">
            {/* Circular rating badge with glow */}
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl animate-glow" />

              {/* Main circular badge */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-gold-glow glass-card flex flex-col items-center justify-center">
                {/* Inner decorative ring */}
                <div className="absolute inset-4 rounded-full border border-primary/30" />
                <div className="absolute inset-8 rounded-full border border-primary/20" />

                {/* Rating content */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < 4 ? "text-primary fill-primary" : "text-primary/50"}`}
                    />
                  ))}
                </div>
                <span className="font-display text-6xl md:text-7xl font-bold text-gold-gradient">4.4</span>
                <span className="font-body text-muted-foreground mt-2">13 reviews</span>

                {/* Decorative scissors */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background px-4">
                  <Scissors className="w-8 h-8 text-primary rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curved bottom transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, hsl(0 0% 4%))",
        }}
      />
    </section>
  );
};

export default HeroSection;
