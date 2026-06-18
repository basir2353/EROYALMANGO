export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  category: string;
  authorEmail: string;
  date: string;
};

export const blogCategories = ["Uncategorized"] as const;

export const blogArchives = [{ label: "June 2023", slug: "2023-06" }] as const;

export const blogPosts: BlogPost[] = [
  {
    id: "chaunsa-king-of-fruits",
    slug: "chaunsa-king-of-fruits",
    title: "Chaunsa King Of Fruits",
    excerpt:
      "Chaunsa mango is widely regarded as the king of fruits in Pakistan. Grown in the fertile orchards of Multan, its honey-sweet pulp, rich aroma, and fiber-free texture make it a favourite among mango lovers at home and abroad.",
    image: "/images/chaunsa-premium-variety.png",
    alt: "Chaunsa mangoes on the tree",
    category: "Uncategorized",
    authorEmail: "info@eroyalmango.com",
    date: "2023-06-12",
  },
  {
    id: "history-of-e-royal-mango",
    slug: "history-of-e-royal-mango",
    title: "History Of E Royal Mango",
    excerpt:
      "E Royal Mango was founded with a simple mission: to deliver Pakistan's finest mangoes to discerning customers worldwide. From orchard partnerships in Punjab and Sindh to export-grade packing, our heritage is rooted in quality, trust, and royal care.",
    image: "/images/anwar-ratol-mango.png",
    alt: "Premium mangoes from E Royal Mango orchards",
    category: "Uncategorized",
    authorEmail: "info@eroyalmango.com",
    date: "2023-06-08",
  },
];
