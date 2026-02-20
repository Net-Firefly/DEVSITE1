
import { Link } from "react-router-dom";
import { ArrowRight, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OptimizedImage from "./OptimizedImage";
import { useState } from "react";

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

const GallerySection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Diagonal background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(170deg, hsl(0 0% 4%) 0%, hsl(0 0% 8%) 50%, hsl(0 0% 4%) 100%)",
        }}
      />

      {/* Decorative lines */}
      <div
        className="absolute top-20 left-0 right-0 h-px opacity-30"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(43 74% 49%), transparent)",
        }}
      />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 text-primary font-body text-sm mb-4">
              <Camera className="w-4 h-4" />
              Gallery
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Our <span className="text-gold-gradient">Work</span>
            </h2>
          </motion.div>
          <Link to="/gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gold-glow px-6 py-3 rounded-full font-body font-semibold text-primary-foreground self-start md:self-auto flex items-center gap-2"
            >
              View All Photos
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        {/* Gallery preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.slice(0, 8).map((filename, index) => (
            <motion.div
              key={filename}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <div
                className="relative h-48 md:h-64 overflow-hidden"
                style={{
                  clipPath: index % 2 === 0
                    ? "polygon(0 0, 100% 5%, 100% 100%, 0 95%)"
                    : "polygon(0 5%, 100% 0, 100% 95%, 0 100%)",
                }}
              >
                <OptimizedImage
                  src={`/gallery/${encodeURIComponent(filename)}`}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="font-display text-lg font-bold text-foreground">Gallery Image {index + 1}</p>
                </div>
                <div
                  className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(135deg, transparent 50%, hsl(43 74% 49%) 50%)",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button (below grid) */}
        <div className="flex justify-center mt-12">
          <Link to="/gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gold-glow px-8 py-4 rounded-full font-body font-semibold text-primary-foreground flex items-center gap-2"
            >
              View Full Gallery
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
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
              className="w-full max-w-5xl max-h-[90vh] glass-card rounded-2xl flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={`/gallery/${encodeURIComponent(galleryImages.slice(0, 8)[selectedIndex])}`}
                alt={`Gallery image ${selectedIndex + 1}`}
                className="w-full h-full object-contain"
                priority={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
