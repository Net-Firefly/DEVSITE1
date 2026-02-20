import { useEffect } from "react";

interface ImagePreloaderProps {
    images: string[];
}

/**
 * Preloads critical images to improve perceived performance
 */
const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images }) => {
    useEffect(() => {
        // Preload images using link rel="preload"
        const preloadLinks: HTMLLinkElement[] = [];

        images.forEach((src) => {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "image";
            link.href = src;
            link.fetchPriority = "high";
            document.head.appendChild(link);
            preloadLinks.push(link);
        });

        // Cleanup on unmount
        return () => {
            preloadLinks.forEach((link) => {
                document.head.removeChild(link);
            });
        };
    }, [images]);

    return null;
};

export default ImagePreloader;
