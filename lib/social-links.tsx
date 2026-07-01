import { Facebook, Instagram, type LucideIcon } from "lucide-react";
import type { WebsiteSettings } from "@/lib/api";

export const SOCIAL_LINK_URLS = {
  facebook: "https://www.facebook.com/share/1JxSFsbRoM/",
  instagram:
    "https://www.instagram.com/eroyalmango?utm_source=qr&igsh=MTV0bDE4MDc3ZnEzaA==",
  whatsapp: "https://whatsapp.com/channel/0029Vb7vuPXFHWq07oF9Yf3N",
} as const;

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type SocialIcon = LucideIcon | typeof WhatsAppIcon;

export type SocialLinkItem = {
  href: string;
  label: string;
  icon: SocialIcon;
  filled?: boolean;
};

const SOCIAL_ICON_MAP: Record<string, SocialIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: WhatsAppIcon,
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp Channel",
};

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    href: SOCIAL_LINK_URLS.facebook,
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: SOCIAL_LINK_URLS.instagram,
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: SOCIAL_LINK_URLS.whatsapp,
    label: "WhatsApp Channel",
    icon: WhatsAppIcon,
    filled: true,
  },
];

export function resolveSocialLinks(settings?: WebsiteSettings | null): SocialLinkItem[] {
  if (Array.isArray(settings?.socialLinks) && settings.socialLinks.length > 0) {
    return settings.socialLinks.map((link) => {
      const platform = link.platform.toLowerCase();
      return {
        href: link.url,
        label: SOCIAL_LABELS[platform] ?? link.platform,
        icon: SOCIAL_ICON_MAP[platform] ?? Instagram,
        filled: platform === "whatsapp",
      };
    });
  }

  if (settings?.socialLinks && typeof settings.socialLinks === "object") {
    return Object.entries(settings.socialLinks).map(([platform, url]) => {
      const key = platform.toLowerCase();
      return {
        href: String(url),
        label: SOCIAL_LABELS[key] ?? platform,
        icon: SOCIAL_ICON_MAP[key] ?? Instagram,
        filled: key === "whatsapp",
      };
    });
  }

  return DEFAULT_SOCIAL_LINKS;
}

export function SocialLinkIcon({
  icon: Icon,
  filled,
  className = "h-4 w-4",
}: {
  icon: SocialIcon;
  filled?: boolean;
  className?: string;
}) {
  if (filled) {
    return <Icon className={className} />;
  }

  return <Icon className={className} strokeWidth={1.5} />;
}
