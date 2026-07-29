/**
 * Caribbean Scribbles — Book Recommendations Feed
 * Renders the featured pick and full book grid from BOOKS data.
 */

const BOOKS = [
  {
    id: "B0H1HM6D8G",
    title: "The Girls of My Sketchbook: Hairstyles, Habitats & Hobbies",
    ages: "All ages",
    tag: "Coloring Book · Creativity",
    desc: "24 coloring pages celebrating diverse girls with natural hairstyles, hobbies, and habitats. A joyful celebration of representation and creativity.",
    amazon: "https://www.amazon.com/dp/B0H1HM6D8G/ref=cm_sw_r_as_gl_api_gl_i_5264H0V8W91CQQATESZ9?linkCode=ml1&tag=venettasmithe-20&linkId=7b6ca6b73666a72087ea206c0e0b45aa",
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0H1HM6D8G.01.LZZZZZZZ.jpg",
    week: 1,
    featured: true
  },
  {
    id: "B0GY155LQ2",
    title: "Island Lab: 15 Caribbean Science Experiments for Young Explorers",
    ages: "Ages 6–12",
    tag: "STEM · Science",
    desc: "Turn the whole island into your laboratory! 15 step-by-step experiments using local Caribbean materials. Perfect for STEM classrooms and science fairs.",
    amazon: "https://www.amazon.com/Island-Lab-Caribbean-Experiments-Explorers/dp/B0GY155LQ2",
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0GY155LQ2.01.LZZZZZZZ.jpg",
    week: 2,
    featured: false
  },
  {
    id: "B0G3F2GTFM",
    title: "Akejah and the Rules of Harmony Island",
    ages: "Ages 6–10",
    tag: "Caribbean Story · Values",
    desc: "A Caribbean story about kindness, courage, and the power of rules — where every rule has a little magic behind it. Ideal for classroom read-alouds.",
    amazon: "https://www.amazon.com/Akejah-Rules-Harmony-island-Caribbean/dp/B0G3F2GTFM",
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0G3F2GTFM.01.LZZZZZZZ.jpg",
    week: 3,
    featured: false
  },
  {
    id: "B0GXRNHRHS",
    title: "Sweets, Treats, Toys & Me!",
    ages: "Ages 5–10",
    tag: "Adventure · Entrepreneurship",
    desc: "An 8-year-old entrepreneurial adventure capturing the pure joy of childhood and island spirit. A favourite for young entrepreneurs and dreamers.",
    amazon: "https://www.amazon.com/Sweets-Treats-Toys-Entrepreneurial-Adventure/dp/B0GXRNHRHS",
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0GXRNHRHS.01.LZZZZZZZ.jpg",
    week: 4,
    featured: false
  },
  {
    id: "B0G473HPSN",
    title: "The Jingle of the Sugar Mas Bells",
    ages: "Ages 5–10",
    tag: "Holiday · Christmas",
    desc: "A Saint Kitts Christmas tale filled with carnival colour, street parades, and the rhythm of Sugar Mas bells. Perfect for Christmas gift baskets.",
    amazon: "https://www.amazon.com/Jingle-Sugar-Mas-Bells/dp/B0G473HPSN",
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0G473HPSN.01.LZZZZZZZ.jpg",
    week: 5,
    featured: false
  },
  {
    id: "B0F4M2QL24",
    title: "My Kindergarten Handbook: Little Kinder Kids",
    ages: "Ages 4–6",
    tag: "Early Learner · Activity Book",
    desc: "A friendly guide for young adventurers starting kindergarten — handwriting, counting, and confidence-building with a Caribbean touch.",
    amazon: "https://www.amazon.com/My-Kindergarten-Handbook-Little-Kinder/dp/B0F4M2QL24",
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0F4M2QL24.01.LZZZZZZZ.jpg",
    week: 6,
    featured: false
  },
  {
    id: "B0FL15G3KL",
    title: "Saint Kitts Pride: Exercise Book",
    ages: "All ages",
    tag: "School & Practice · Island Pride",
    desc: "Island-themed lined exercise book — turns everyday writing practice into a quiet celebration of home and heritage. Great for schools and bookstores.",
    amazon: "https://www.amazon.com/Saint-Kitts-Pride-Exercise-Book/dp/B0FL15G3KL",
    cover: "https://images-na.ssl-images-amazon.com/images/P/B0FL15G3KL.01.LZZZZZZZ.jpg",
    week: 7,
    featured: false
  }
];

/**
 * Determine which book is "this week's pick" based on the current date.
 * Rotates through the BOOKS array on a weekly cycle.
 */
function getCurrentFeaturedBook() {
  // Week 1 anchor: 2026-08-03 (Monday)
  const anchor = new Date("2026-08-03T00:00:00Z");
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceAnchor = Math.max(0, Math.floor((now - anchor) / msPerWeek));
  const idx = weeksSinceAnchor % BOOKS.length;
  return BOOKS[idx];
}

/**
 * Build the cover image element, falling back to an emoji placeholder.
 */
function buildCoverImg(book, className, width, height) {
  const img = document.createElement("img");
  img.src = book.cover;
  img.alt = book.title + " cover";
  img.className = className;
  if (width) img.width = width;
  if (height) img.height = height;
  img.onerror = function () {
    const ph = document.createElement("div");
    ph.className = className.replace("cover", "cover-placeholder");
    ph.textContent = "📚";
    img.replaceWith(ph);
  };
  return img;
}

/**
 * Render the featured book card.
 */
function renderFeatured() {
  const book = getCurrentFeaturedBook();
  const container = document.getElementById("featured-book");
  if (!container) return;

  const img = buildCoverImg(book, "featured-cover", 130, 180);

  const badge = `<span class="featured-badge">📚 This Week's Pick</span>`;
  const title = `<h2 class="featured-title">${escHtml(book.title)}</h2>`;
  const ages = `<p class="featured-ages">${escHtml(book.ages)} · ${escHtml(book.tag)}</p>`;
  const desc = `<p class="featured-desc">${escHtml(book.desc)}</p>`;
  const cta = `<a href="${book.amazon}" class="btn-amazon" target="_blank" rel="noopener">Shop on Amazon →</a>`;

  const body = document.createElement("div");
  body.className = "featured-body";
  body.innerHTML = badge + title + ages + desc + cta;

  container.appendChild(img);
  container.appendChild(body);
}

/**
 * Render the full book grid.
 */
function renderFeed() {
  const grid = document.getElementById("book-feed");
  if (!grid) return;

  BOOKS.forEach((book, i) => {
    const card = document.createElement("article");
    card.className = "book-card";

    const img = buildCoverImg(book, "book-card-cover", null, 200);

    const body = document.createElement("div");
    body.className = "book-card-body";
    body.innerHTML = `
      <p class="book-card-tag">${escHtml(book.tag)}</p>
      <h3 class="book-card-title">${escHtml(book.title)}</h3>
      <p class="book-card-ages">${escHtml(book.ages)}</p>
      <p class="book-card-desc">${escHtml(book.desc)}</p>
      <div class="book-card-footer">
        <a href="${book.amazon}" class="btn-card" target="_blank" rel="noopener">Buy on Amazon →</a>
        <span class="card-week">Pick #${book.week}</span>
      </div>
    `;

    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

/** Escape HTML entities to prevent XSS. */
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  renderFeatured();
  renderFeed();
});
