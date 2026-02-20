import { Star, Quote, ThumbsUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const allReviews = [
  {
    id: 1,
    name: "Marcus Johnson",
    rating: 5,
    text: "Best barbershop in town! The attention to detail is incredible. My fade has never looked better. The atmosphere is welcoming and the staff really knows their craft.",
    date: "2 weeks ago",
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    name: "David Chen",
    rating: 5,
    text: "Clean cuts, great vibes, and the staff treats you like family. Highly recommend! Been coming here for 3 years and never disappointed.",
    date: "1 month ago",
    helpful: 18,
    verified: true,
  },
  {
    id: 3,
    name: "James Williams",
    rating: 4,
    text: "Professional service and skilled barbers. The shop has a great atmosphere. Only wish they had more availability on weekends.",
    date: "3 weeks ago",
    helpful: 12,
    verified: true,
  },
  {
    id: 4,
    name: "Anthony Davis",
    rating: 5,
    text: "Been coming here for years. Consistent quality every single time. This is the real deal. They understand what you want without even explaining.",
    date: "1 week ago",
    helpful: 31,
    verified: true,
  },
  {
    id: 5,
    name: "Michael Thompson",
    rating: 5,
    text: "The Full Experience package is worth every penny. Hot towel, scalp massage, precision cut - left feeling like a new man. Premium service!",
    date: "2 months ago",
    helpful: 45,
    verified: true,
  },
  {
    id: 6,
    name: "Robert Garcia",
    rating: 4,
    text: "Great barbers who take their time to get it right. The shop is always clean and has a great vibe. Music is always on point too!",
    date: "1 month ago",
    helpful: 8,
    verified: false,
  },
];

const Reviews = () => {
  const averageRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: allReviews.filter(review => review.rating === r).length,
    percentage: (allReviews.filter(review => review.rating === r).length / allReviews.length) * 100,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-1/3 h-full opacity-10"
          style={{
            background: "linear-gradient(225deg, transparent 0%, hsl(43 74% 49% / 0.3) 100%)",
            clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)",
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
              <Star className="w-4 h-4" />
              Reviews
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Client <span className="text-gold-gradient">Testimonials</span>
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              See what our valued clients have to say about their experience
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Rating Overview */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
            style={{
              clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)",
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Big rating */}
              <div className="text-center">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl" />
                  <span className="relative font-display text-8xl font-bold text-gold-gradient">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < Math.round(averageRating) ? "text-primary fill-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="font-body text-muted-foreground mt-2">{allReviews.length} reviews</p>
              </div>
              
              {/* Rating breakdown */}
              <div className="flex-1 w-full space-y-3">
                {ratingCounts.map((item) => (
                  <div key={item.rating} className="flex items-center gap-4">
                    <span className="font-body text-sm text-muted-foreground w-8">{item.rating}★</span>
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + item.rating * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-gold-light rounded-full"
                      />
                    </div>
                    <span className="font-body text-sm text-muted-foreground w-8">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* All Reviews */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {allReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div 
                  className="glass-card p-8 transition-all duration-300 group-hover:border-primary/40"
                  style={{
                    clipPath: index % 2 === 0
                      ? "polygon(0 0, 100% 0, 100% 90%, 0 100%)"
                      : "polygon(0 0, 100% 0, 100% 100%, 0 90%)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center flex-shrink-0">
                      <span className="font-display text-xl text-primary-foreground font-bold">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-body font-semibold text-foreground">{review.name}</span>
                        {review.verified && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-body">
                            Verified
                          </span>
                        )}
                        <span className="font-body text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      
                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "text-primary fill-primary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      
                      {/* Quote */}
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                        <p className="font-body text-foreground/90 leading-relaxed pl-6">
                          {review.text}
                        </p>
                      </div>
                      
                      {/* Helpful */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                        <button className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 text-muted-foreground hover:text-primary hover:border-primary transition-colors text-sm font-body">
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Reviews;
