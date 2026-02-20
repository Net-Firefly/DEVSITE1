import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle, X } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import { useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  image: string;
  bio: string;
}

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const team: TeamMember[] = [
    {
      id: 1,
      name: "LAVENDER",
      title: "Nail Artist",
      specialties: ["Nail Tech",],
      rating: 4.9,
      image: "/staff/WhatsApp%20Image%202026-01-28%20at%203.35.13%20PM.jpeg",
      bio: "With 7 years of expertise, Lavender transforms nails into works of art. Blending precision, creativity, and the latest trends, she delivers elegant, flawless, and personalized nail experiences for every client.",
    },
    {
      id: 2,
      name: "ANDY",
      title: "Nail & Massage Specialist",
      specialties: ["Nails tech ", "Masseuse"],
      rating: 4.95,
      image: "/staff/WhatsApp%20Image%202026-01-28%20at%203.35.15%20PM.jpeg",
      bio: "With over 10 years of experience, Andy combines expert nail artistry and therapeutic massage to create luxurious, personalized experiences. Her precision, creativity, and dedication ensure every client leaves relaxed, confident, and pampered.",
    },
    {
      id: 5,
      name: "NDINDA",
      title: "Beautician",
      specialties: ["Facials", "Makeup", "Skincare Treatments"],
      rating: 4.85,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.29%20(1).jpeg",
      bio: "Ndinda is a skilled beautician dedicated to enhancing natural beauty and promoting relaxation. With expertise in various skincare treatments, she provides personalized care that leaves clients feeling rejuvenated and confident.",
    },
    {
      id: 6,
      name: "HARMO",
      title: "Barber",
      specialties: ["Men's Haircuts", "Beard Trimming", "Grooming Services"],
      rating: 4.88,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.29%20(2).jpeg",
      bio: "Harmo is a skilled barber known for his precision cuts and modern styles. With a keen eye for detail and a passion for grooming, he delivers tailored looks that leave every client feeling confident and refreshed.",
    },
    {
      id: 7,
      name: "JONA WA NAILS",
      title: "Nail Technician",
      specialties: ["Nail Art", "Manicures & Pedicures", "Gel & Acrylic Nails"],
      rating: 4.92,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.29%20(3).jpeg",
      bio: "Jona Wa Nails is a skilled nail technician known for her intricate nail art and attention to detail. With a passion for creativity, she transforms nails into stunning masterpieces, ensuring each client leaves with confidence and style.",
    },
    {
      id: 8,
      name: "SUSAN",
      title: "BEAUTICIAN",
      specialties: ["Massage Therapy", "Spa Treatments", "Wellness Services"],
      rating: 4.87,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.29%20(4).jpeg",
      bio: "Susan is a skilled beautician dedicated to enhancing natural beauty and promoting relaxation. With expertise in various spa treatments, she provides personalized care that leaves clients feeling rejuvenated and confident.",
    },
    {
      id: 9,
      name: "KIM aka BUGAA",
      title: "Barber",
      specialties: ["Men's Haircuts", "Beard Trimming", "Grooming Services"],
      rating: 4.90,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.29.jpeg",
      bio: "Kim, known as Bugaa, is a skilled barber specializing in men's  haircuts and grooming. With a passion for precision and style, he delivers sharp, tailored looks that leave every client feeling confident and refreshed.",
    },
    {
      id: 10,
      name: "NELLY",
      title: "Lash Specialist",
      specialties: ["Facials & Skincare Treatments", "Eyebrow & Lash Services", "Waxing & Hair Removal"],
      rating: 4.86,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.30%20(1).jpeg",
      bio: "Nelly brings 4 years of expertise in beauty and self-care, offering personalized treatments that leave every client feeling confident and radiant.",
    },
    {
      id: 11,
      name: "ANASTASIA",
      title: "Receptionist",
      specialties: ["Front Desk & Guest Relations"],
      rating: 4.89,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.30%20(2).jpeg",
      bio: "Anastasia brings warmth, professionalism, and a friendly smile to every client interaction. With years of experience in guest services, she ensures that every visitor feels welcome, valued, and well cared for",
    },
    {
      id: 12,
      name: "KAREN",
      title: "Floor Manager",
      specialties: ["Guest Experience Manager", "Frontline Operations Manager", "Team Lead – Floor Operations"],
      rating: 4.84,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.30%20(3).jpeg",
      bio: "Karen is an experienced floor manager with a talent for organizing teams and ensuring smooth daily operations. She excels at coordinating staff, maintaining high service standards, and creating a welcoming environment for both customers and employees. Her leadership and attention to detail keep everything running efficiently and professionally.",
    },
    {
      id: 13,
      name: "LAUREEN",
      title: "Beautician & Skincare Specialist",
      specialties: ["Skincare", "Makeup", "Personalized Beauty Treatments"],
      rating: 4.91,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.30.jpeg",
      bio: "Laureen is a professional beautician with a passion for enhancing natural beauty. She specializes in skincare, makeup, and personalized beauty treatments, ensuring every client feels confident and refreshed. Her attention to detail and friendly approach make each session a relaxing and enjoyable experience.",
    },
    {
      id: 14,
      name: "DENNO",
      title: "Professional Barber & Hair Stylist",
      specialties: ["Beard Grooming & Shaping", "Creative Styling & Designs", "Precision Haircuts & Fades"],
      rating: 4.93,
      image: "/staff/WhatsApp%20Image%202026-02-03%20at%2010.30.31.jpeg",
      bio: "Denno is a skilled hair designer and professional barber specializing in precision cuts, clean fades, and modern styles. With a sharp eye for detail and a passion for grooming, he delivers personalized looks that leave every client confident and refreshed.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
            Meet Our <span className="text-gold-gradient">Expert Team</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional beauty and spa specialists dedicated to giving you the best experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6"
        >
          {team.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              className="group"
            >
              <div
                className="glass-card overflow-hidden h-full flex flex-col transition-all duration-500 hover:scale-105 cursor-pointer"
                onClick={() => setSelectedMember(member.id)}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-72 md:h-64">
                  <OptimizedImage
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={member.id <= 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button
                      className="w-full py-2 rounded-full bg-primary text-primary-foreground font-body font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add contact functionality here
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="font-body text-sm text-primary mb-4">
                    {member.title}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(member.rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="font-display text-sm font-bold text-foreground">
                      {member.rating}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="font-body text-sm text-muted-foreground mb-4 flex-1">
                    {member.bio}
                  </p>

                  {/* Specialties */}
                  <div>
                    <p className="font-body text-xs text-primary mb-2 font-medium">
                      SPECIALTIES
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, i) => (
                        <span
                          key={i}
                          className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-body text-xs text-primary"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Preview Modal */}
        <AnimatePresence>
          {selectedMember !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-lg p-6"
              onClick={() => setSelectedMember(null)}
            >
              <button
                className="absolute top-6 right-6 w-14 h-14 rounded-full border-2 border-primary/50 flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors z-10"
                onClick={() => setSelectedMember(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-full max-w-5xl glass-card rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const member = team.find(m => m.id === selectedMember);
                  if (!member) return null;
                  return (
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-3/5 h-96 md:h-auto">
                        <OptimizedImage
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          priority={true}
                        />
                      </div>
                      {/* Content */}
                      <div className="p-10 md:w-2/5 flex flex-col">
                        <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                          {member.name}
                        </h3>
                        <p className="font-body text-lg text-primary mb-6">
                          {member.title}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.floor(member.rating)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="font-display text-lg font-bold text-foreground">
                            {member.rating}
                          </span>
                        </div>

                        {/* Bio */}
                        <p className="font-body text-base text-muted-foreground mb-6 flex-1 leading-relaxed">
                          {member.bio}
                        </p>

                        {/* Specialties */}
                        <div>
                          <p className="font-body text-sm text-primary mb-3 font-semibold tracking-wide">
                            SPECIALTIES
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {member.specialties.map((specialty, i) => (
                              <span
                                key={i}
                                className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 font-body text-sm text-primary"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="font-body text-muted-foreground mb-6">
            Book with your favorite specialist
          </p>
          <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-body font-medium hover:bg-primary/90 transition-all duration-300">
            Book an Appointment
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
