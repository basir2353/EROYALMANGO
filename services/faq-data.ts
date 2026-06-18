export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  bullets?: string[];
};

export type FaqCategory = {
  id: string;
  title: string;
  image: string;
  alt: string;
  defaultOpenId?: string;
  items: FaqItem[];
};

export const faqIntro =
  "Find answers about our warranty, returns, shipping, and mango refund policy. If you need more help, our team is available around the clock.";

export const faqCategories: FaqCategory[] = [
  {
    id: "warranty",
    title: "Warranty Program",
    image: "/images/chaunsa-premium-variety.png",
    alt: "Premium Chaunsa mangoes — warranty quality guarantee",
    defaultOpenId: "warranty-cover",
    items: [
      {
        id: "warranty-cover",
        question: "What does your warranty cover?",
        answer:
          "Our warranty covers the freshness and quality of every mango we deliver. If your order arrives damaged, under-ripe beyond our standards, or not as described, we will replace or refund eligible items after verification.",
      },
      {
        id: "warranty-claim",
        question: "How do I file a warranty claim?",
        answer:
          "Contact us within 12 hours of delivery via phone, email, or WhatsApp with your order number and clear photos of the product. Our support team will review your claim and guide you through the next steps.",
      },
      {
        id: "warranty-shipping",
        question: "What shipping methods are available?",
        answer:
          "We offer standard and express courier delivery across Pakistan, plus export and gift packaging for international orders. Shipping options are shown at checkout based on your location.",
      },
      {
        id: "warranty-return",
        question: "How about the Return Policy?",
        answer:
          "Returns are accepted for eligible orders within our stated window when products meet the conditions in our Return & Refund Policy. Perishable items must be reported promptly with photo evidence.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Exchanges",
    image: "/images/dasheri-mango.png",
    alt: "Fresh mangoes — returns and exchanges",
    defaultOpenId: "returns-exchange",
    items: [
      {
        id: "returns-exchange",
        question: "Can I return or exchange my order?",
        answer:
          "Yes. You may request a return or exchange within 7 days of delivery for qualifying issues such as damage, wrong variety, or quality concerns. Items must be reported with photos and proof of purchase.",
      },
      {
        id: "returns-process",
        question: "How is your online return process work?",
        answer:
          "Submit your request through our contact channels with order details and images. Once approved, we arrange pickup or provide instructions for return. Refunds are processed to your original payment method within 5–10 business days.",
      },
      {
        id: "returns-discounts",
        question: "Do you offer sales and discounts?",
        answer:
          "We run seasonal promotions, bundle offers, and coupon codes during peak mango season. Subscribe to our updates and follow our social channels for the latest deals.",
      },
      {
        id: "returns-stores",
        question: "Do you have a store in every country?",
        answer:
          "E Royal Mango operates primarily online with orchard sourcing in Multan, Pakistan. We ship domestically and internationally through trusted logistics partners rather than physical stores worldwide.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Recent Orders",
    image: "/images/anwar-ratol-mango.png",
    alt: "Anwar Ratol mangoes — shipping and orders",
    defaultOpenId: "shipping-method",
    items: [
      {
        id: "shipping-method",
        question: "How is my order shipped?",
        answer:
          "Orders within Pakistan are shipped via reputable courier services with temperature-aware packaging where required. International orders use export-grade packing and partnered logistics for safe transit.",
      },
      {
        id: "shipping-time",
        question: "How long will my package take to arrive?",
        answer:
          "Domestic delivery typically takes 2–5 business days depending on your city. International timelines vary by destination and customs — estimates are provided at checkout and in your confirmation email.",
      },
      {
        id: "shipping-business-days",
        question: "What are business days?",
        answer:
          "Business days are Monday through Saturday, excluding public holidays in Pakistan. Orders placed after cut-off time ship the next business day.",
      },
      {
        id: "shipping-track",
        question: "How can I know my package has shipped?",
        answer:
          "You will receive an email or SMS with tracking information once your order leaves our facility. You can also contact us with your order number for a status update.",
      },
    ],
  },
  {
    id: "refund-policy",
    title: "Return & Refund Policy for Mangoes",
    image: "/images/chaunsa-mango-premium.png",
    alt: "Premium mangoes — refund policy",
    defaultOpenId: "refund-urgent",
    items: [
      {
        id: "refund-urgent",
        question: "Urgent Information for Returns",
        answer:
          "Please review these requirements before starting a return or refund request:",
        bullets: [
          "Product must be damaged, spoiled, or incorrect versus your order.",
          "Notify us within 12 hours of delivery.",
          "Clear photos of the product and packaging are required.",
          "Proof of purchase (order number or receipt) must be provided.",
        ],
      },
      {
        id: "refund-start",
        question: "How to Start a Return / Refund Process",
        answer:
          "Call our emergency line at +92 307 3970850, email info@eroyalmango.com, or message us on WhatsApp with your order details. Our team will confirm eligibility and issue a replacement, credit, or refund as appropriate.",
      },
    ],
  },
];

export const emergencyPhone = "+92 307 3970850";
export const emergencyPhoneHref = "tel:+923073970850";
