# Dinesh Bodhapalle — Portfolio

Single-page portfolio for **Dinesh Shivaji Bodhapalle** — AI-Powered Backend Engineer (Java / Spring Boot).

## Stack

Plain, dependency-free static site for maximum velocity:

- **HTML5** — semantic markup, SEO meta tags (title, description, OG, Twitter), JSON-LD Person schema
- **CSS** — custom design system on CSS custom properties (dark editoral theme, amber accent), mobile-first, `prefers-reduced-motion` support
- **JS** — vanilla: scroll-reveal (IntersectionObserver), animated stat counters, sticky nav, mobile menu

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Single page: Hero, About, Experience, Projects, Skills, Leadership, Certifications, Contact |
| `css/style.css` | All styles |
| `js/app.js` | Interactions |
| `vercel.json` | Static-site deployment config (build-less, clean URLs, resume cache header) |
| `resume.pdf` | Placeholder — replace with the real resume |

## Development

```sh
npm start        # webpack-dev-server at http://localhost:8080
```

## Deployment

Hosted on **Vercel**, deployed automatically by a **GitHub Actions** workflow (`.github/workflows/deploy.yml`) on every push to `main`. Deploys are authenticated via the `VERCEL_TOKEN` repo secret.

- Production URL: https://portfolio-dinesh-5a8d.vercel.app
- Inspect deployments: https://vercel.com/dinesh-5a8d/portfolio

## TODO before launch

- [ ] Replace `resume.pdf` placeholder with the real file
- [ ] Point Pulse-Grid / Cart-Forge GitHub buttons at the real repo URLs in `index.html`