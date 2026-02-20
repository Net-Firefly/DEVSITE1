import { useState } from "react";
import { motion } from "framer-motion";
import { Scissors, Droplets } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm";
import { services, spaServices } from "../data/services";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../components/ui/alert-dialog";

const Services = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Image preview modal state
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | undefined>(undefined);

  const handleBookingClick = (service) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handlePreview = (src: string | undefined, name?: string) => {
    if (!src) return;
    setPreviewSrc(src);
    setPreviewName(name);
    setIsImageOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BookingForm isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} service={selectedService} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-10"
          style={{
            background: "linear-gradient(135deg, transparent 0%, hsl(43 74% 49% / 0.3) 100%)",
            clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
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
              <Scissors className="w-4 h-4" />
              Our Services
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Premium <span className="text-gold-gradient">Grooming</span> Services
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Experience the art of precision cutting and styling with our expert barbers
            </p>
            <p className="font-body text-sm text-muted-foreground mt-4">Tip: click any service image to preview it before booking.</p>
          </motion.div>
        </div>
      </section>

      {/* Group services by category */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {['VIP', 'Dyes', 'Kids', 'Regular'].map((cat) => (
            <div key={cat} className="mb-12">
              <h3 className="font-display text-3xl font-bold text-gold-gradient mb-6 text-left">{cat === 'Kids' ? 'Kids Cuts' : `${cat} Services`}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.filter(s => s.category === cat).map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div
                      className="glass-card p-0 h-full flex flex-col overflow-hidden transition-all duration-500 group-hover:scale-105"
                      style={{
                        clipPath:
                          index % 2 === 0
                            ? "polygon(0 0, 100% 0, 100% 95%, 0 100%)"
                            : "polygon(0 0, 100% 0, 100% 100%, 0 95%)",
                      }}
                    >
                      {/* Image */}
                      {service.image && (
                        <div
                          className="relative h-48 w-full overflow-hidden cursor-pointer"
                          onClick={() => handlePreview(service.image, service.name)}
                          role="button"
                          aria-label={`Preview ${service.name}`}
                        >
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Click to preview</div>
                          {/* Popular badge */}
                          {service.popular && (
                            <div className="absolute -top-3 -right-3 px-4 py-1 bg-primary rounded-full">
                              <span className="font-body text-xs font-bold text-primary-foreground">POPULAR</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-8 flex flex-col flex-1">
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-full border-gold-glow flex items-center justify-center mb-6 group-hover:animate-glow">
                          <service.icon className="w-7 h-7 text-primary" />
                        </div>

                        {/* Content */}
                        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                          {service.name}
                        </h3>
                        <p className="font-body text-muted-foreground mb-6">
                          {service.description}
                        </p>

                        {/* Price & Duration */}
                        <div className="flex items-end justify-between mt-auto">
                          <div>
                            <span className="font-display text-3xl font-bold text-gold-gradient">
                              KES {service.price.toLocaleString()}
                            </span>
                          </div>
                          <span className="font-body text-sm text-muted-foreground">
                            {service.duration}
                          </span>
                        </div>

                        {/* Book button */}
                        <button
                          onClick={() => handleBookingClick(service)}
                          className="w-full mt-6 py-3 rounded-full border border-primary/50 font-body font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spa Services Section */}
      <section className="py-20 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: "radial-gradient(circle at 70% 30%, hsl(43 74% 49%) 0%, transparent 50%)",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 text-primary font-body text-sm mb-6">
              <Droplets className="w-4 h-4" />
              Spa & Wellness
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Relaxation & <span className="text-gold-gradient">Wellness</span>
            </h2>
            <p className="font-body text-muted-foreground">
              Premium spa treatments and wellness services for complete rejuvenation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div
                  className="glass-card p-0 h-full transition-all duration-500 group-hover:scale-105 overflow-hidden flex flex-col"
                  style={{
                    clipPath: index % 2 === 0
                      ? "polygon(0 0, 100% 0, 100% 95%, 0 100%)"
                      : "polygon(0 0, 100% 0, 100% 100%, 0 95%)",
                  }}
                >
                  {/* Image */}
                  {service.image && (
                    <div
                      className="relative h-48 w-full overflow-hidden cursor-pointer"
                      onClick={() => handlePreview(service.image, service.name)}
                      role="button"
                      aria-label={`Preview ${service.name}`}
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Click to preview</div>
                      {/* Popular badge */}
                      {service.popular && (
                        <div className="absolute -top-3 -right-3 px-4 py-1 bg-primary rounded-full">
                          <span className="font-body text-xs font-bold text-primary-foreground">POPULAR</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    {/* Icon */}
                    {service.icon && (
                      <div className="w-14 h-14 rounded-full border-gold-glow flex items-center justify-center mb-6 group-hover:animate-glow">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                    )}

                    {/* Content */}
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                      {service.name}
                    </h3>
                    <p className="font-body text-muted-foreground mb-6">
                      {service.description}
                    </p>

                    {/* Price & Duration */}
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <span className="font-display text-3xl font-bold text-gold-gradient">
                          KES {service.price.toLocaleString()}
                        </span>
                      </div>
                      {service.duration && (
                        <span className="font-body text-sm text-muted-foreground">
                          {service.duration}
                        </span>
                      )}
                    </div>

                    {/* Book button */}
                    <button
                      onClick={() => handleBookingClick(service)}
                      className="w-full mt-6 py-3 rounded-full border border-primary/50 font-body font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ImagePreviewDialog open={isImageOpen} setOpen={setIsImageOpen} src={previewSrc} name={previewName} />
      <Footer />
    </div>
  );
};

export default Services;

// Image preview dialog rendered at bottom so it mounts once
import React from "react";

// Render AlertDialog controlled via state inside the same module
const ImagePreviewDialog = ({ open, setOpen, src, name }: { open: boolean; setOpen: (v: boolean) => void; src: string | null; name?: string }) => (
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{name || "Preview"}</AlertDialogTitle>
        <AlertDialogDescription />
      </AlertDialogHeader>
      <div className="w-full max-w-full h-auto">
        {src && <img src={src} alt={name || "preview"} className="w-full h-auto object-contain" />}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <AlertDialogCancel onClick={() => setOpen(false)}>Close</AlertDialogCancel>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

// Attach the dialog to default export to ensure it's available in the page
// This usage won't be rendered directly; instead Services uses the dialog state.