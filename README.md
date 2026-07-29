# Caribbean Scribbles — Book Recommendations Newsfeed

**Live site:** [vjoycelyn.github.io/Island-Tales](https://vjoycelyn.github.io/Island-Tales/)  
**Main website:** [caribbeanscribblespublishing.com](https://caribbeanscribblespublishing.com/)

A GitHub Pages newsfeed showcasing weekly rotating Caribbean children's book recommendations from Caribbean Scribbles Publishing, with newsletter signup and automated welcome emails.

---

## What This Site Does

- **Weekly rotating book pick** — automatically shows the current week's featured book based on the date
- **Full book recommendations grid** — all 7 Caribbean Scribbles titles with Amazon links
- **Newsletter signup form** — collects name, email, and reader type
- **Automated welcome email** — sent automatically when someone subscribes (via Formspree + Mailchimp/beehiiv)
- **RSS feed** — `weekly-book-feed.xml` for podcast apps and RSS readers

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main page — newsfeed, featured pick, signup form |
| `style.css` | All styling — matches Caribbean Scribbles brand colours |
| `feed.js` | Renders book cards and featured pick from data |
| `subscribe.js` | Handles newsletter signup form submission |
| `weekly-book-feed.xml` | RSS feed for external readers |
| `newsletter-welcome-template.html` | Welcome email template for new subscribers |

---

## Setup: Newsletter Automation (5 minutes)

### Step 1 — Create a Free Formspree Account

1. Go to [formspree.io](https://formspree.io) and sign up (free)
2. Click **New Form** → name it "Caribbean Scribbles Newsletter"
3. Copy your form endpoint URL (looks like `https://formspree.io/f/xpwzabcd`)

### Step 2 — Update subscribe.js

Open `subscribe.js` and replace the endpoint on line 15:

```javascript
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID_HERE";
```

### Step 3 — Connect Formspree to Mailchimp (Auto Welcome Email)

In your Formspree dashboard:
1. Go to your form → **Integrations**
2. Click **Mailchimp** (or beehiiv)
3. Connect your Mailchimp account
4. Map the `email` field to your mailing list
5. In Mailchimp, set up an **Automation → Welcome Email** using `newsletter-welcome-template.html`

That's it — every new subscriber automatically gets a welcome email with your book picks!

### Step 4 — Enable GitHub Pages

In your GitHub repo:
1. Go to **Settings → Pages**
2. Set Source to **Deploy from a branch**
3. Select `main` branch, `/ (root)` folder
4. Save — your site will be live at `https://vjoycelyn.github.io/Island-Tales/`

---

## Customising the Book Feed

To add or update books, edit the `BOOKS` array in `feed.js`:

```javascript
{
  id: "AMAZON_ASIN",
  title: "Book Title",
  ages: "Ages X–Y",
  tag: "Genre · Category",
  desc: "Short description (1–2 sentences).",
  amazon: "https://www.amazon.com/dp/ASIN",
  cover: "https://images-na.ssl-images-amazon.com/images/P/ASIN.01.LZZZZZZZ.jpg",
  week: 8,          // week number in rotation
  featured: false   // set true for the default featured pick
}
```

The weekly rotation automatically cycles through all books based on the current date.

---

## Brand Colours

| Colour | Hex | Use |
|--------|-----|-----|
| Deep Green | `#0f4c3a` | Headers, accents, links |
| Coral Red | `#d64545` | Buttons, CTAs |
| Cream | `#faf7f2` | Page background |
| Sand | `#f3ede3` | Card backgrounds |

---

## About Caribbean Scribbles Publishing

Caribbean Scribbles Publishing is a Saint Kitts & Nevis based hybrid publishing studio helping Caribbean voices reach readers everywhere — in classrooms, on tablets, in libraries, and in little hands at bedtime.

**Founder:** Venetta J. Smithen — Author | Publisher

---

*Built with GitHub Pages · No server required · Fully static*
