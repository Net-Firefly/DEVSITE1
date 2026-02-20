import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Marcus Johnson",
    rating: 5,
    text: "Best barbershop in town! The attention to detail is incredible. My fade has never looked better.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "David Chen",
    rating: 5,
    text: "Clean cuts, great vibes, and the staff treats you like family. Highly recommend!",
    date: "1 month ago",
  },
];

const ReviewsSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Diagonal accent background */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(175deg, hsl(0 0% 6%) 0%, hsl(0 0% 4%) 50%, hsl(0 0% 6%) 100%)",
        }}
      />
      
      {/* Decorative gold line */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(43 74% 49% / 0.5), transparent)",
        }}
      />
      
      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full border border-primary/30 text-primary font-body text-sm mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            What Our <span className="text-gold-gradient">Clients</span> Say
          </h2>
        </motion.div>
        
        {/* Review cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -2 : 2 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.03, rotate: 0 }}
              className="group"
            >
              <div 
                className="glass-card p-8 h-full transition-all duration-300"
                style={{
                  clipPath: index % 2 === 0 
                    ? "polygon(0 0, 100% 5%, 100% 100%, 0 95%)"
                    : "polygon(0 5%, 100% 0, 100% 95%, 0 100%)",
                }}
              >
                <Quote className="w-10 h-10 text-primary/30 mb-4" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "text-primary fill-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                
                <p className="font-body text-foreground/90 text-lg leading-relaxed mb-6">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
                    <span className="font-display text-lg text-primary-foreground font-bold">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body font-semibold text-foreground">{review.name}</p>
                    <p className="font-body text-sm text-muted-foreground">{review.date}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View all link */}
        <div className="text-center">
          <Link to="/reviews">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-primary/50 font-body font-medium text-foreground hover:bg-primary/10 transition-all duration-300"
            >
              Read All Reviews
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
