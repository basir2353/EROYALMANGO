"use client";

import { useState } from "react";
import { DEFAULT_PRODUCT_IMAGE, resolveMediaUrl } from "@/lib/media";

type CartItemImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function CartItemImage({ src, alt, className = "" }: CartItemImageProps) {
  const [imgSrc, setImgSrc] = useState(() => resolveMediaUrl(src));

  return (
    <div className={`cart-item-image-3d ${className}`.trim()}>
      <span className="cart-item-image-shadow" aria-hidden="true" />
      {/* Plain img — reliable for API uploads and external URLs in cart */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        className="cart-item-image-photo"
        loading="lazy"
        onError={() => setImgSrc(DEFAULT_PRODUCT_IMAGE)}
      />
    </div>
  );
}
