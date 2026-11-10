<p align="center">
  <img src="assets/zad-logo.png" alt="Zad | زاد logo" width="220">
</p>

<h1 align="center">Zad | زاد</h1>

<p align="center"><strong>Fresh ingredients. Your touch. Your meal.</strong><br>
<span dir="rtl">مكونات طازجة. لمستك. وجبتك.</span></p>

<p align="center">
  <a href="https://ashldny.github.io/zad/">Live site</a> ·
  <a href="https://ashldny.github.io/zad/?analytics">Live site with analytics panel</a> ·
  <a href="https://ashldny.github.io/zad/?checkout">Checkout preview</a>
</p>

---

## About this project

This repository holds the **landing page and clickable prototype** for Zad, our group's business idea for **CMPS307: Introduction to Project Management** (Fall 2026).

The course project takes one business idea from first concept to a pitch. This website covers two of the deliverables:

- **Landing page and analytics.** A marketing page that explains the idea and records the actions we would measure.
- **Prototype.** A clickable version of the customer journey: browse recipes, customize a kit, build a box, and check out.

The other deliverables are kept outside this repo: the idea brief and value proposition, multi-criteria idea voting, SWOT analysis, Business Model Canvas, market feasibility study, funding and support study, growth study, customer-insight and MVP-testing mind maps, project schedule (PERT), and a two-minute pitch video.

> This is a student prototype. Menus, prices, delivery areas and order flows are illustrative. No real orders are taken and no data leaves the browser.

## The business idea

**Zad** (زاد, Arabic for *provisions*, the food you carry for a journey) is a meal-kit service in Qatar. Each box holds fresh, pre-portioned ingredients and an easy-to-follow recipe for an authentic Qatari or Arab home-cooked dish.

- **The idea:** make it easy and enjoyable to cook traditional dishes at home with fresh, high-quality ingredients, while still adding your own touch.
- **The goal:** bring the flavours of Qatari and Arab home cooking to more homes by combining tradition, freshness and convenience in one box.

### The problem

- **No time to plan.** Busy households spend hours each week deciding what to cook, shopping and prepping.
- **Food gets wasted.** Buying a whole bunch or bag for one recipe leaves half of it unused.
- **Shopping is slow.** Traditional dishes need ingredients from several shops, and standard meal kits rarely cover local cuisine or let you customize it.

### How Zad works

1. **Pick your recipes** in the Zad app or on the website.
2. **Make it yours.** Choose servings, swap the protein and set the spice level. Quantities adjust automatically.
3. **We pack and deliver** the ingredients, weighed and chilled, with a printed recipe card.
4. **Cook and enjoy.** Follow the card, or scan its QR code for a short video tutorial.

### Business Model Canvas (summary)

| Block | Zad |
|---|---|
| **Value proposition** | A convenient way to cook authentic Qatari and Arab dishes at home: fresh ingredients, pre-portioned kits, easy recipes with QR video tutorials, and room to add your own touch |
| **Customer segments** | Home cooks and families who love homemade food; busy professionals who want fresh, convenient meals; food enthusiasts who like trying new recipes |
| **Channels** | Mobile app (primary), website, social media, in-store pick-up, and home delivery across Qatar, starting in Doha |
| **Customer relationships** | Personalized app and web experience, loyalty rewards, flexible subscriptions, recipe and chef content, responsive support |
| **Revenue streams** | Meal-kit sales per box, weekly or monthly subscriptions, premium and seasonal boxes, add-ons such as desserts, drinks and pantry staples |
| **Key activities** | Sourcing ingredients, portioning and packing, recipe development and testing, order and delivery management, marketing |
| **Key resources** | Supplier network, recipe and video content, packing and fulfilment operations, brand, app and customer data, team |
| **Key partners** | Local farms and produce suppliers, Qatari and regional food suppliers, local chefs and recipe creators, packaging and last-mile delivery partners, payment providers |
| **Cost structure** | Ingredients, packaging, kitchen and packing facility, delivery, app and website, marketing, team and overheads |

### Plans shown on the site (illustrative)

| Plan | What's included | Price |
|---|---|---|
| Solo | 2 recipes for 1 person | QAR 165 / week |
| Family | 3 recipes for 4 people | QAR 310 / week |
| Chef Plus | 4 recipes with premium ingredients, chef and seasonal boxes | QAR 440 / week |

## The website

### What's on the page

- **Hero:** the brand tagline in English and Arabic, with a carousel (click to pause) showing the annotated Zad box, what's in every box, and who Zad is for
- **How it works:** four illustrated steps
- **This week's menu:** six Qatari dishes with filters, cooking times and spice levels
- **Add your own touch:** a recipe card that updates live as you change the protein, servings, spice and add-ons
- **Plans, ordering channels, FAQ** and a founding-families waitlist
- **Box and checkout:** the cart merges repeat items into one line with +/− quantity controls and dish thumbnails. Checkout covers the delivery address, delivery day and time, payment method, an order summary, and an order confirmation with a delivery tracker.

### Analytics

Every key action is pushed to `window.dataLayer`, ready to connect to Google Analytics 4 or Plausible:

| Event | Funnel step it measures |
|---|---|
| `page_view` | Visits |
| `recipe_view` | Recipe cards actually seen (at least 60% on screen) |
| `add_to_box` | Interest in a recipe or plan |
| `checkout_start` | Checkout started |
| `purchase` | Orders placed |
| `waitlist_signup` | Sign-ups for the launch list |

Add `?analytics` to the URL to show a small funnel panel with these counts and the add-to-box rate. This is handy for demos and presentation screenshots.

### Run it locally

No build step: it's plain HTML, CSS and JavaScript.

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

### Files

```
index.html        page markup
styles.css        all styles (brand colours and type are defined at the top)
script.js         menu, customizer, cart, checkout, carousel and analytics
assets/           logo, wordmark, box illustrations and favicon
```

## Team

CMPS307 group project, Fall 2026.

<!-- Add team member names and roles here -->
