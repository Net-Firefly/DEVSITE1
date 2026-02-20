import React, { useRef, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ReviewsSection from "@/components/ReviewsSection";
import PopularTimesSection from "@/components/PopularTimesSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import SpecialOffers from "@/components/SpecialOffers";
import TeamSection from "@/components/TeamSection";
import EnhancedTestimonials from "@/components/EnhancedTestimonials";
import Newsletter from "@/components/Newsletter";
import ImagePreloader from "@/components/ImagePreloader";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, Crown, Sparkles, ArrowRight } from "lucide-react";

const featuredServices = [
  { icon: Scissors, name: "Classic Cut", price: "KES 3,500" },
  { icon: Crown, name: "Premium Fade", price: "KES 4,500" },
  { icon: Sparkles, name: "Beard Sculpt", price: "KES 3,000" },
];

const Index = () => {
  const navigate = useNavigate();

  const handleBookNowFromOffers = () => {
    navigate('/services');
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setPlayVideo(true);
        }
      });
    };
    const observer = new window.IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (playVideo && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  }, [playVideo]);

  // Preload critical images that appear in the gallery section
  const criticalImages = [
    "/gallery/_DSC0005%20(2).jpg",
    "/gallery/_DSC0007%20(2).jpg",
    "/gallery/_DSC0008.jpg",
    "/gallery/_DSC0013%20(2).jpg",
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ImagePreloader images={criticalImages} />
      <Navigation />
      <HeroSection />

      {/* Promo Video - plays on scroll into view */}
      <section className="py-16 md:py-20 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: "radial-gradient(circle at 70% 30%, hsl(43 74% 49%) 0%, transparent 50%)",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-8">
              Watch Our <span className="text-gold-gradient">Promo</span>
            </h2>

            <div className="relative rounded-2xl overflow-hidden aspect-video glass-card shadow-2xl">
              <video
                ref={videoRef}
                src="/promo.mp4"
                controls
                className="absolute inset-0 w-full h-full object-cover"
                title="Tripple Kay Cutts and Spa Promo"
                poster="/gallery/_DSC0005%20(2).jpg"
              >
                Sorry, your browser does not support embedded videos.
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Services Preview */}
      <section className="py-20 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: "radial-gradient(circle at 30% 50%, hsl(43 74% 49%) 0%, transparent 50%)",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold"
            >
              Our <span className="text-gold-gradient">Services</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center mb-6">
              <Link to="/quiz" className="inline-flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-sm shadow-md">
                🎉 Take the Quiz — Win Prizes!
              </Link>
            </div>
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 1 : -1 }}
                className="glass-card p-8 text-center group cursor-pointer"
                style={{
                  clipPath: index === 0
                    ? "polygon(0 0, 100% 5%, 100% 100%, 0 95%)"
                    : index === 1
                      ? "polygon(0 5%, 100% 0, 100% 95%, 0 100%)"
                      : "polygon(0 0, 100% 5%, 100% 95%, 0 100%)",
                }}
              >
                <div className="w-16 h-16 rounded-full border-gold-glow flex items-center justify-center mx-auto mb-4 group-hover:animate-glow">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{service.name}</h3>
                <p className="font-display text-2xl text-gold-gradient font-bold">{service.price}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-primary/50 font-body font-medium text-foreground hover:bg-primary/10 transition-all duration-300"
              >
                View All Services
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection />
      <SpecialOffers onBookNow={handleBookNowFromOffers} />
      <TeamSection />
      <EnhancedTestimonials />
      <PopularTimesSection />
      <GallerySection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
