# Zad | زاد — landing page prototype

Marketing landing page for **Zad**, a meal-kit service delivering fresh, pre-portioned ingredients and easy recipes for authentic Qatari and Arab home cooking. Built for the CMPS307 group project.

Live site: https://ashldny.github.io/zad/

## What's on the page

- Hero with the brand tagline (English and Arabic) and the annotated Zad box
- How it works (4 steps), this week's menu with filters, and an interactive "Add your own touch" recipe customizer
- Customer segments, subscription plans, app/ordering channels, FAQ and a founding-families waitlist
- A working "box" (cart) drawer. Nothing is sent anywhere: checkout and the waitlist are front-end only

## Analytics

Every key action is pushed to `window.dataLayer` (page views, recipe views, add to box, checkout started, waitlist sign-ups), ready for GA4 or Plausible. Add `?analytics` to the URL to show a small funnel panel for demos:

https://ashldny.github.io/zad/?analytics

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Plain HTML, CSS and JavaScript; no build step.

Menus, prices and delivery details are illustrative.
