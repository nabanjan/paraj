
# Organization Website Generator

This project generates a one-screen React landing page for an organization using the OpenAI API at build time.
The output is static frontend code (`src/App.jsx` and `src/App.css`).

## Important Rule

Only call OpenAI from the generator script.
Do not call OpenAI from React files (`src/App.jsx`, `src/main.jsx`), or your API key can be exposed in the browser.

## Prepare `data.txt` (Important)

Use `data.txt` as a keyword-rich context file. More specific keywords = better generated content.

Include as much of the following as possible:

- Organization name, tagline, and brand tone (professional, premium, bold, minimal)
- Industry and business type
- Core services (short bullet phrases)
- Service area (cities, states, countries)
- Target customers (B2B, B2C, enterprise, local businesses)
- Differentiators (speed, pricing, safety, support, years in business)
- Trust signals (clients served, ratings, certifications, milestones)
- Primary call-to-actions (Get Quote, Call Now, Book Demo, Track Shipment)
- Contact details (email, phone, address, support hours)
- SEO keywords you want on the page
- Visual style keywords (colors, gradients, modern, clean, high-contrast)
- Required sections (hero, services, pricing, testimonials, FAQ, footer)

Suggested `data.txt` format:

```txt
Organization: Acme Logistics
Tagline: Fast and reliable delivery across Assam
Industry: Logistics and courier services
Audience: Local businesses, ecommerce sellers, retail chains
Coverage: Guwahati, Silchar, Dibrugarh, Jorhat, Tezpur
Services: Same-day delivery, inter-district shipping, document courier, freight movement
Differentiators: 98% on-time delivery, real-time updates, affordable pricing
Trust Signals: 500+ daily shipments, 1000+ business clients
CTAs: Get Quote, Track Shipment, Call Now
SEO Keywords: logistics in Assam, courier in Guwahati, same-day parcel delivery
Design Keywords: modern, responsive, clean typography, gradient accents
Required Sections: Hero, Services, Coverage, Quote Form, Tracking Placeholder, Footer
```

## Generate And Run

Run:

```bash
./gen.sh "data.txt" "+919864096534"
```

Input rules:

- First argument should point to your context file (recommended: `data.txt`).
- Second argument must be a WhatsApp number in `+` + digits format.
- Spaces in WhatsApp number are removed automatically.

What `gen.sh` does:

- Reads prompt text from the file.
- Generates `src/App.jsx` and `src/App.css`.
- Ensures minimal React entry files exist (`index.html`, `src/main.jsx`).
- Installs missing dependencies (`openai`, `react`, `react-dom`, `vite`) if needed.
- Starts the app on `0.0.0.0:5173` by default.

Use a custom port:

```bash
PORT=8080 ./gen.sh "data.txt" "+919864096534"
```

## Deployment

Since the output is static, you can deploy to:

- Vercel
- Netlify
- GitHub Pages
