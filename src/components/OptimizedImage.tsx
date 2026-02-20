import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    onLoad?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = "",
    priority = false,
    onLoad,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // If priority, skip intersection observer
        if (priority) {
            setIsInView(true);
            return;
        }

        // Set up intersection observer for lazy loading
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        if (observerRef.current && imgRef.current) {
                            observerRef.current.unobserve(imgRef.current);
                        }
                    }
                });
            },
            {
                rootMargin: "50px", // Start loading 50px before image comes into view
                threshold: 0.01,
            }
        );

        if (imgRef.current) {
            observerRef.current.observe(imgRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [priority]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    return (
        <div className="relative w-full h-full">
            {/* Shimmer placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 animate-shimmer bg-[length:200%_100%]" />
            )}

            {/* Actual image */}
            <motion.img
                ref={imgRef}
                src={isInView ? src : undefined}
                alt={alt}
                className={`${className} ${!isLoaded ? "opacity-0" : "opacity-100"}`}
                style={{
                    transition: "opacity 0.3s ease-in-out",
                }}
                onLoad={handleLoad}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={priority ? "high" : "auto"}
            />
        </div>
    );
};

export default OptimizedImage;
