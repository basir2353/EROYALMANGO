import Image, { type ImageProps } from "next/image";

/** Storefront images — default quality 90 for sharper product/hero photos */
export default function AppImage({
  quality = 90,
  ...props
}: ImageProps) {
  return <Image quality={quality} {...props} />;
}
