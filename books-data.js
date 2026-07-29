// Caribbean Scribbles Publishing — Book Catalog
// All 7 titles with Amazon links, cover images, WhatsApp order links, prices, and ratings.

export type Book = {
  id: string;
  asin: string;
  title: string;
  ages: string;
  tag: string;
  category: string;
  desc: string;
  amazon: string;
  whatsapp: string;
  cover: string;
  pricePaperback: string;
  priceKindle?: string;
  priceHardcover?: string;
  rating: string;
  week: number; // rotation week (1-7)
};

const WA_BASE = "https://wa.me/18696639220?text=Hi%20Caribbean%20Scribbles%2C%20I%27d%20like%20to%20order";

export const BOOKS: Book[] = [
  {
    id: "B0GY155LQ2",
    asin: "B0GY155LQ2",
    title: "Island Lab: 15 Caribbean Science Experiments",
    ages: "Ages 6–12",
    tag: "STEM · Science",
    category: "STEM · Science",
    desc: "Turn the whole island into your laboratory! 15 step-by-step experiments using local Caribbean materials. Join Akejah on a STEM adventure through the Caribbean.",
    amazon: "https://www.amazon.com/Island-Lab-Caribbean-Experiments-Explorers/dp/B0GY155LQ2",
    whatsapp: `${WA_BASE}%20Island%20Lab.`,
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0GY155LQ2.01.LZZZZZZZ.jpg",
    pricePaperback: "$7.99",
    priceKindle: "$3.99",
    rating: "⭐⭐⭐⭐⭐ Perfect for STEM classrooms and science fairs.",
    week: 1,
  },
  {
    id: "B0G3F2GTFM",
    asin: "B0G3F2GTFM",
    title: "Akejah and the Rules of Harmony Island",
    ages: "Ages 6–10",
    tag: "Caribbean Story · Values",
    category: "Caribbean story · Values",
    desc: "A Caribbean story about kindness, courage, and the power of rules — where every rule has a little magic behind it. Follow Akejah as she discovers what makes an island community thrive.",
    amazon: "https://www.amazon.com/Akejah-Rules-Harmony-island-Caribbean/dp/B0G3F2GTFM",
    whatsapp: `${WA_BASE}%20Akejah%20and%20the%20Rules%20of%20Harmony%20Island.`,
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0G3F2GTFM.01.LZZZZZZZ.jpg",
    pricePaperback: "$8.40",
    priceKindle: "$3.99",
    rating: "⭐⭐⭐⭐⭐ Ideal for classroom read-alouds on community values.",
    week: 2,
  },
  {
    id: "B0GXRNHRHS",
    asin: "B0GXRNHRHS",
    title: "Sweets, Treats, Toys & Me!",
    ages: "Ages 5–10",
    tag: "Adventure · Entrepreneurship",
    category: "Adventure · Entrepreneurship",
    desc: "An 8-year-old entrepreneurial adventure — a delightful story capturing the pure joy of childhood and island spirit. A young girl learns business basics through her Caribbean community.",
    amazon: "https://www.amazon.com/Sweets-Treats-Toys-Entrepreneurial-Adventure/dp/B0GXRNHRHS",
    whatsapp: `${WA_BASE}%20Sweets%20Treats%20Toys%20and%20Me.`,
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0GXRNHRHS.01.LZZZZZZZ.jpg",
    pricePaperback: "$8.99",
    priceKindle: "$3.99",
    rating: "⭐⭐⭐⭐⭐ A favourite for young entrepreneurs and dreamers.",
    week: 3,
  },
  {
    id: "B0G473HPSN",
    asin: "B0G473HPSN",
    title: "The Jingle of the Sugar Mas Bells",
    ages: "Ages 5–10",
    tag: "Holiday · Christmas",
    category: "Holiday · Christmas",
    desc: "A Saint Kitts Christmas tale filled with carnival colour, street parades, and the rhythm of Sugar Mas bells. Experience the magic of Sugar Mas through a child's eyes.",
    amazon: "https://www.amazon.com/Jingle-Sugar-Mas-Bells/dp/B0G473HPSN",
    whatsapp: `${WA_BASE}%20The%20Jingle%20of%20the%20Sugar%20Mas%20Bells.`,
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0G473HPSN.01.LZZZZZZZ.jpg",
    pricePaperback: "$8.40",
    priceKindle: "$3.99",
    rating: "⭐⭐⭐⭐⭐ Perfect for Christmas gift baskets and classroom read-alouds.",
    week: 4,
  },
  {
    id: "B0F4M2QL24",
    asin: "B0F4M2QL24",
    title: "My Kindergarten Handbook: Little Kinder Kids",
    ages: "Ages 4–6",
    tag: "Early Learner · Activity Book",
    category: "Early learner · Activity book",
    desc: "A friendly guide for young adventurers starting kindergarten — handwriting, counting, and confidence-building with a Caribbean touch. Everything a little learner needs to feel ready on day one.",
    amazon: "https://www.amazon.com/My-Kindergarten-Handbook-Little-Kinder/dp/B0F4M2QL24",
    whatsapp: `${WA_BASE}%20My%20Kindergarten%20Handbook.`,
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0F4M2QL24.01.LZZZZZZZ.jpg",
    pricePaperback: "$10.00",
    priceKindle: "$4.99",
    rating: "⭐⭐⭐⭐⭐ Ideal for school readiness and early primary classrooms.",
    week: 5,
  },
  {
    id: "B0FL15G3KL",
    asin: "B0FL15G3KL",
    title: "Saint Kitts Pride: Exercise Book",
    ages: "All Ages",
    tag: "School · Island Pride",
    category: "School & practice · Island pride",
    desc: "Island-themed lined exercise book — turns everyday writing practice into a quiet celebration of home and heritage. Every page celebrates Saint Kitts & Nevis pride.",
    amazon: "https://www.amazon.com/Saint-Kitts-Pride-Exercise-Book/dp/B0FL15G3KL",
    whatsapp: `${WA_BASE}%20Saint%20Kitts%20Pride%20Exercise%20Book.`,
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0FL15G3KL.01.LZZZZZZZ.jpg",
    pricePaperback: "$6.08",
    priceHardcover: "$13.00",
    rating: "⭐⭐⭐⭐⭐ Great for schools, bookstores, and diaspora gift shops.",
    week: 6,
  },
  {
    id: "B0H1HM6D8G",
    asin: "B0H1HM6D8G",
    title: "The Girls of My Sketchbook: Hairstyles, Habitats & Hobbies",
    ages: "All Ages",
    tag: "Coloring Book · Creativity",
    category: "Coloring book · Creativity",
    desc: "24 coloring pages featuring diverse girls with natural hairstyles, hobbies, and habitats — celebrate creativity and representation. By Akejah S. Rey.",
    amazon: "https://www.amazon.com/Girls-My-Sketchbook-Hairstyles-Habitats/dp/B0H1HM6D8G",
    whatsapp: `${WA_BASE}%20The%20Girls%20of%20My%20Sketchbook.`,
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0H1HM6D8G.01.LZZZZZZZ.jpg",
    pricePaperback: "$6.99",
    rating: "⭐⭐⭐⭐⭐ Perfect for young artists and creative minds.",
    week: 7,
  },
];

/**
 * Returns the featured book for the current week based on today's date.
 * Cycles through all 7 books in sequence, starting from a fixed epoch date.
 */
export function getFeaturedBook(): Book {
  const epochDate = new Date("2026-08-03T00:00:00Z"); // Week 1 starts Aug 3, 2026
  const now = new Date();
  const daysSinceEpoch = Math.floor(
    (now.getTime() - epochDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekNumber = Math.floor(daysSinceEpoch / 7);
  const bookIndex = ((weekNumber % BOOKS.length) + BOOKS.length) % BOOKS.length;
  return BOOKS[bookIndex];
}

/**
 * Returns the featured book for a specific week number (0-indexed).
 */
export function getBookByWeek(weekIndex: number): Book {
  const idx = ((weekIndex % BOOKS.length) + BOOKS.length) % BOOKS.length;
  return BOOKS[idx];
}
