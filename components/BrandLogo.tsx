import AppImage from "@/components/AppImage";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  variant?: "nav" | "footer";
  className?: string;
};

const boxClasses = {
  nav: "brand-logo brand-logo--nav h-12 w-[44px] sm:h-14 sm:w-[52px]",
  footer: "brand-logo brand-logo--footer h-24 w-[88px] sm:h-28 sm:w-[102px]",
};

export default function BrandLogo({
  href = "/",
  variant = "nav",
  className = "",
}: BrandLogoProps) {
  const image = (
    <span
      className={`inline-flex shrink-0 items-center justify-start overflow-hidden ${boxClasses[variant]} ${className}`}
    >
      <AppImage
        src="/images/e-royal-mango-logo.png"
        alt="E Royal Mango — Premium Export Quality Mangoes"
        width={277}
        height={300}
        className="block h-full w-full object-contain object-left"
        priority={variant === "nav"}
      />
    </span>
  );

  if (!href) {
    return image;
  }

  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
    >
      {image}
    </Link>
  );
}
