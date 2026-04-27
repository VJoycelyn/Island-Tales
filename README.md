# Island-Tales

## Demo
Explore the project here:
**[Play the Island Tales Interactive Game Here]**

https://islandtales-oatbsxnq.manus.space/

**Island Tales** is an Interactive, location-aware heritage storytelling and educational game for children. It bridges the gap between Caribbean folklore and high-tech accessibility.

**Island Tales** as it was originally called is now **Island Tales by Caribbean Scribbles** it was originally prototyped on the Emergent Platform. As of April 2026, the project has been migrated to **Manus** to leverage advanced AI-automated workflows and enhanced narrative branching capabilities. You can explore the latest iteration via the link above.

## About the Project
Built as part of the **Build Club Women in AI Accelerator**, Island Tales uses generative AI to turn traditional Caribbean legends into immersive, character-driven experiences.

## Why 100x?: The Challenge (The Process Being Redefined)
Historically, the digital preservation of Kittitian folklore has been hindered by a labor-intensive heritage experience, one had to manually bridge historical research, linguistic translation into Kittitian creole, multi-model asset generation, and technical web deployment. This manual workflow limited the volume, frequency and accessibility of cultural stories I could share.

**The 100X Solution**: I have engineered an AI-driven content automation pipeline that eliminates these manual bottlenecks. By integrating generative AI agents (Manus, Gemini) with my web architecture, I have transformed the process from a linear, week-long production cycle into a streamlined, iterative workflow. I can now ingest raw historical data and output fully realized, branching, and localized interactive narratives in a fraction of the time.

## The Professional Value
This project demonstrates my ability to leverage cutting-edge AI to create scalable, high-impact digital experiences. By automating the 'heavy lifting' of content creation, I am now able to focus my role on high-value tasks, curating deeper cultural narratives, expanding community engagement, and evolving Island Tales into a robust, global platform for Saint Kitts heritage. I am not just documenting history; I am automating its future accessibility.

**Update**: Island Tales by Caribbean Scribbles has evolved from a static prototype to an AI-automated engine. I have migrated the core architecture to Manus, which allows for a more robust, scalable and complex branching narrative structure.

## Technology Stack
- **Platform:** Built on the Emergent Platform
- **New Technology Stack:** Manus (Development & Workflow Automation), Generative AI (Narrative & Asset Generation), GitHub (Version Control & Deployment)

## Founder
Venetta J. Smithen
*Author | Publisher*

---

## Website Build — Setup & GitHub Pages Instructions

> This section covers the static website added on the `website-build` branch.
> The site is built with plain HTML, CSS, and JavaScript — no build tools or dependencies required.

### File Structure

```
Island-Tales/
├── index.html              ← Main website entry point
├── style.css               ← All styles (mobile-first, Caribbean theme)
├── script.js               ← All interactive behaviour
├── assets/
│   ├── images/             ← Place site images here (jpg, png, webp, svg)
│   └── fonts/              ← Place any custom font files here
└── README.md               ← This file
```

### Running Locally

No build step is needed. Simply open `index.html` in any modern browser:

```bash
# Option 1 — open directly
open index.html

# Option 2 — serve with Python (recommended to avoid CORS issues)
python3 -m http.server 8080
# Then visit: http://localhost:8080

# Option 3 — serve with Node.js npx
npx serve .
# Then visit the URL shown in the terminal
```

### Deploying to GitHub Pages

Follow these steps to publish the site live at `https://vjoycelyn.github.io/Island-Tales/`:

**Step 1 — Merge the branch**

On GitHub, open a Pull Request from `website-build` → `main` and merge it.
*(Or push directly to `main` if you prefer.)*

**Step 2 — Enable GitHub Pages**

1. Go to your repository on GitHub: `https://github.com/VJoycelyn/Island-Tales`
2. Click the **Settings** tab (top menu).
3. In the left sidebar, click **Pages**.
4. Under **Source**, select:
   - Branch: `main` (or `website-build` if you want to publish directly from that branch)
   - Folder: `/ (root)`
5. Click **Save**.

**Step 3 — Wait for deployment**

GitHub will build and deploy the site in 1–3 minutes.
A green banner will appear with your live URL:

```
https://vjoycelyn.github.io/Island-Tales/
```

**Step 4 — (Optional) Custom Domain**

To use a custom domain (e.g. `islandtales.com`):
1. In **Settings → Pages**, enter your domain in the **Custom domain** field.
2. Add a `CNAME` file to the root of your repository containing just your domain name.
3. Update your domain registrar's DNS with a `CNAME` record pointing to `vjoycelyn.github.io`.

### Adding Images

Place image files in `assets/images/` and reference them in `index.html` like this:

```html
<img src="assets/images/your-image.jpg" alt="Description of image" />
```

Recommended image formats: `.webp` (best performance), `.jpg`, `.png`, `.svg`.

### Customising the Gallery Themes

The gallery cards are generated dynamically from the `GALLERY_THEMES` array in `script.js`.
To add, remove, or edit a theme card, update that array — no HTML changes needed:

```js
// In script.js — GALLERY_THEMES array
{
  emoji: '🌊',
  title: 'Ocean Adventures',
  count: '2 stories',
  bg: '#eff6ff',
  border: '#3b82f6',
}
```

### Connecting the Contact Form

The contact form currently shows a simulated success message (no server required).
To connect it to a real backend or email service, replace the `simulateSubmit()` call
in `script.js` with a `fetch()` POST to your API:

```js
// Example using Formspree (free tier available at formspree.io)
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({ name, email, message })
})
.then(r => r.json())
.then(() => showStatus('Message sent! 🌴', 'success'))
.catch(() => showStatus('Something went wrong. Please try again.', 'error'));
```

### Browser Support

The site is compatible with all modern browsers (Chrome, Firefox, Safari, Edge).
It uses standard CSS custom properties, CSS Grid, Flexbox, and the IntersectionObserver API —
all supported in browsers released after 2019.
