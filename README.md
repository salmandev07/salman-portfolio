# Salman Khan — Premium Portfolio

A world-class personal portfolio built with Next.js 15, Tailwind CSS, Framer Motion, shadcn/ui, and Lucide React.

Live design highlights:
- Glassmorphism UI, aurora background, animated mesh gradients
- Floating profile card with animated rings & glow pulse
- Typing animation, magnetic buttons, mouse-follow spotlight
- Interactive skills, project case studies, experience timeline
- GitHub contribution graph, testimonials carousel
- Contact form that saves messages to MongoDB
- Fully responsive, dark mode by default

## 1. Prerequisites

- Node.js 18.18+ (recommended Node 20)
- Yarn (`npm install -g yarn`) — this project uses Yarn, not npm
- (Optional) A local or cloud MongoDB instance — only needed if you want the **contact form** to actually save messages

## 2. Install

```bash
yarn install
```

## 3. Environment variables

Create a file named `.env` in the project root (same level as `package.json`) with:

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- If you don't have MongoDB locally, you can either:
  - Install MongoDB Community Edition, or
  - Use a free MongoDB Atlas cluster and paste the connection string into `MONGO_URL`, or
  - Just ignore it — the rest of the site works perfectly without it; only the contact form submit will fail.

## 4. Run the dev server

```bash
yarn dev
```

Open http://localhost:3000

## 5. Build for production

```bash
yarn build
yarn start
```

## 6. Project structure

```
app/
  api/[[...path]]/route.js   # Backend API routes (contact form, health check)
  globals.css                # Theme, glass effects, animations
  layout.js                  # Root layout + metadata
  page.js                    # All sections of the portfolio (single-file)
components/ui/               # shadcn/ui components
lib/                         # utils
package.json
tailwind.config.js
next.config.js
```

## 7. Where to customize

All content lives at the top of `app/page.js`:

- `PROFILE_IMG` — your photo URL (replace with your own)
- `NAV_LINKS`, `TYPING_ROLES`, `STATS`
- `SKILLS`, `PROJECTS`, `EXPERIENCE`, `ACHIEVEMENTS`
- `TECH_MARQUEE`, `TESTIMONIALS`
- Update social links inside `Hero`, `Contact`, and `Footer`

Theme colors live in `app/globals.css` (CSS variables and `.gradient-text` / `.glass` utilities).

## 8. Deploying

This is a standard Next.js 15 app. You can deploy to:
- Vercel (recommended — zero config)
- Netlify
- Any Node host

Remember to set `MONGO_URL`, `DB_NAME`, and `NEXT_PUBLIC_BASE_URL` in your host's environment settings.

---

Made with care. Happy hacking!
