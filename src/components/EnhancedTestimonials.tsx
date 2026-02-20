import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  service: string;
  rating: number;
  text: string;
  image: string;
  date: string;
}

const EnhancedTestimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "James Kipchoge",
      service: "Premium Fade",
      rating: 5,
      text: "Best barber in Nairobi! The precision and attention to detail is unmatched. I've been going for 6 months and never disappointed.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      date: "5 weeks ago",
    },
    {
      id: 2,
      name: "Sarah Muthoni",
      service: "Deluxe Spa Pedicure",
      rating: 5,
      text: "The spa experience is incredible! Professional staff and amazing ambiance. My feet have never felt better. Highly recommend!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      date: "10 days ago",
    },
    {
      id: 3,
      name: "Michael Okonkwo",
      service: "The Full Experience",
      rating: 5,
      text: "The full experience package is worth every penny. Complete transformation! The team is professional and friendly.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      date: "3 days ago",
    },
    {
      id: 4,
      name: "Amelia Kariuki",
      service: "Nail Art",
      rating: 5,
      text: "Creative designs and excellent quality. The artist listened to my ideas and delivered beyond expectations. Coming back for sure!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      date: "5 days ago",
    },
  ];

  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const filteredTestimonials = selectedRating
    ? testimonials.filter((t) => t.rating === selectedRating)
    : testimonials;

  const averageRating = (
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
  ).toFixed(1);

  return (
    <section className="py-20 relative">
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
            Customer <span className="text-gold-gradient">Reviews</span>
          </h2>

          {/* Rating Summary */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-primary text-primary"
                />
              ))}
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              {averageRating}/5
            </span>
            <span className="font-body text-muted-foreground">
              ({testimonials.length} reviews)
            </span>
          </div>

          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our valued customers have to say about their experience at Tripple Kay Cutts and Spa.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 h-full flex flex-col transition-all duration-500 hover:scale-105">
                {/* Header with Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-foreground">
                      {testimonial.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {testimonial.service}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-body text-muted-foreground mb-6 flex-1">
                  "{testimonial.text}"
                </p>

                {/* Date */}
                <p className="font-body text-xs text-muted-foreground">
                  {testimonial.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-body text-muted-foreground mb-6">
            Have you visited us? Share your experience!
          </p>
          <a
            href="https://www.instagram.com/triplekaycutts/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-body font-medium hover:bg-primary/90 transition-all duration-300"
          >
            Share Your Review
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedTestimonials;
