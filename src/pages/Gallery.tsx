import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import ImagePreloader from "@/components/ImagePreloader";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";

// List of image filenames in public/gallery
const galleryImages = [
  "_DSC0005 (2).jpg",
  "_DSC0007 (2).jpg",
  "_DSC0008.jpg",
  "_DSC0013 (2).jpg",
  "_DSC0014 (1).jpg",
  "_DSC0016 (1).jpg",
  "_DSC0020 (3).jpg",
  "_DSC0022 (1).jpg",
  "_DSC0025 (1).jpg",
  "_DSC0033.jpg",
  "_DSC0035 (2).jpg",
  "_DSC0036 (1).jpg",
  "_DSC0038 (2).jpg",
  "_DSC0040 (2).jpg",
  "_DSC0042 (3).jpg",
  "_DSC0044 (2).jpg",
  "_DSC0045 (1).jpg",
  "_DSC0046 (1).jpg",
  "_DSC0049 (4).jpg",
  "_DSC0050.jpg",
  "_DSC0051.jpg",
  "_DSC0052 (1).jpg",
  "_DSC0053.jpg",
  "_DSC0054.jpg",
  "_DSC0056 (1).jpg",
  "_DSC0057.jpg",
  "_DSC0059 (3).jpg",
  "_DSC0060 (1).jpg",
  "_DSC0061.jpg",
  "_DSC0062.jpg",
  "_DSC0064 (2).jpg",
  "_DSC0065 (1).jpg",
  "_DSC0066 (3).jpg",
];


const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Preload first 6 images for better initial load
  const preloadImages = galleryImages.slice(0, 6).map(
    (filename) => `/gallery/${encodeURIComponent(filename)}`
  );

  return (
    <div className="min-h-screen bg-background">
      <ImagePreloader images={preloadImages} />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: "radial-gradient(circle at 50% 50%, hsl(43 74% 49%) 0%, transparent 50%)",
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
              <Camera className="w-4 h-4" />
              Gallery
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-gold-gradient">Work</span>
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Browse our portfolio of precision cuts and transformations
            </p>
          </motion.div>
        </div>
      </section>


      {/* Only 'All' section, no category tabs */}

      {/* Gallery Grid - only images from public/gallery */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            <AnimatePresence>
              {galleryImages.map((filename, index) => (
                <motion.div
                  key={filename}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedIndex(index)}
                >
                  <div
                    className="relative h-64 md:h-80 overflow-hidden transition-transform duration-500 group-hover:scale-105"
                    style={{
                      clipPath: index % 3 === 0
                        ? "polygon(0 0, 100% 5%, 100% 100%, 0 95%)"
                        : index % 3 === 1
                          ? "circle(48% at 50% 50%)"
                          : "polygon(5% 0, 100% 0, 95% 100%, 0 100%)",
                      borderRadius: index % 3 === 1 ? "50%" : "0",
                    }}
                  >
                    <OptimizedImage
                      src={`/gallery/${encodeURIComponent(filename)}`}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                      priority={true}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div>
                        <p className="font-display text-lg font-bold text-foreground">Gallery Image {index + 1}</p>
                      </div>
                    </div>
                    {/* Gold accent */}
                    <div
                      className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: "linear-gradient(135deg, transparent 50%, hsl(43 74% 49%) 50%)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox for images */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-lg p-6"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-primary/50 flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-4xl aspect-video glass-card rounded-2xl flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={`/gallery/${encodeURIComponent(galleryImages[selectedIndex])}`}
                alt={`Gallery image ${selectedIndex + 1}`}
                className="w-full h-full object-cover"
                priority={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;
