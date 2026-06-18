"use client";

import type { ImageProps } from "next/image";
import AppImage from "@/components/AppImage";

type BlogPostImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/** Renders the exact blog featured image from the API — no catalog remapping. */
export default function BlogPostImage({ src, alt, className = "", ...props }: BlogPostImageProps) {
  if (!src?.trim()) {
    return (
      <div
        className={`blog-image-fallback ${className}`}
        role="img"
        aria-label={alt || "Blog post image"}
      />
    );
  }

  return <AppImage src={src} alt={alt} className={className} {...props} />;
}
