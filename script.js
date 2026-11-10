/* Zad landing page prototype: menu, customizer, box drawer and a tiny analytics layer.
   Nothing here talks to a server. Events go to window.dataLayer so a real analytics
   tool (GA4, Plausible, etc.) can be dropped in later. */
(() => {
  "use strict";

  /* ---------- analytics ---------- */
  window.dataLayer = window.dataLayer || [];
  const STORE = "zad-demo-stats";
  const EVENTS = [
    ["page_view", "Page views"],
    ["recipe_view", "Recipe views"],
    ["add_to_box", "Added to box"],
    ["checkout_start", "Checkout started"],
    ["purchase", "Orders placed"],
    ["waitlist_signup", "Waitlist sign-ups"],
  ];
  let counts = {};
  try { counts = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { counts = {}; }

  function track(event, props = {}) {
    window.dataLayer.push({ event, ...props, ts: Date.now() });
    counts[event] = (counts[event] || 0) + 1;
    try { localStorage.setItem(STORE, JSON.stringify(counts)); } catch (e) { /* storage blocked */ }
    renderStats();
  }

  const stats = document.getElementById("stats");
  const showStats = new URLSearchParams(location.search).has("analytics");
  if (showStats) stats.hidden = false;
  function renderStats() {
    if (!showStats) return;
    const list = document.getElementById("statsList");
    const rows = EVENTS.map(([k, label]) => `<dt>${label}</dt><dd>${counts[k] || 0}</dd>`);
    const views = counts.recipe_view || 0;
    const rate = views ? Math.round(((counts.add_to_box || 0) / views) * 100) : 0;
    rows.push(`<dt>Add-to-box rate</dt><dd>${rate}%</dd>`);
    list.innerHTML = rows.join("");
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-track]");
    if (t) track(t.dataset.track, { label: t.dataset.label || t.textContent.trim() });
  });

  /* ---------- helpers ---------- */
  const qar = (n) => `QAR ${Math.round(n)}`;
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 2600);
  }
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- menu data ---------- */
  const RECIPES = [
    { id: "machboos", name: "Chicken machboos", ar: "مكبوس دجاج", cat: "chicken", time: 45, spice: 2, price: 48,
      desc: "Spiced rice with dried lime, roast chicken and a tangy daqoos tomato sauce.", badge: "Customer favourite",
      bg: "#FFE9B8", plate: { base: "#E7B45A", grains: "#F3D9A0", pieces: "#B8682E", n: 6, garnish: "#7E9A4B" } },
    { id: "thareed", name: "Lamb thareed", ar: "ثريد لحم", cat: "meat", time: 60, spice: 1, price: 64,
      desc: "Slow-simmered lamb and vegetable stew poured over crisp regag bread.",
      bg: "#E5ECD2", plate: { base: "#C9894A", pieces: "#7A3E1E", n: 5, extra: "#EC7A2C", garnish: "#7E9A4B" } },
    { id: "harees", name: "Harees", ar: "هريس", cat: "chicken", time: 90, spice: 0, price: 42,
      desc: "Wheat and chicken cooked low and slow until silky, finished with ghee and cinnamon.", badge: "Ramadan classic",
      bg: "#F4E2C6", plate: { base: "#EAD5AA", swirl: "#E0A63C", dust: "#9A5A2A" } },
    { id: "saloona", name: "Fish saloona", ar: "صالونة سمك", cat: "seafood", time: 40, spice: 2, price: 58,
      desc: "Hammour in a tomato and dried-lime broth with potatoes and fresh coriander.",
      bg: "#FCDCC8", plate: { base: "#DE7535", pieces: "#F6E6C8", n: 4, extra: "#F2C76B", garnish: "#6E8C3E" } },
    { id: "margoog", name: "Vegetable margoog", ar: "مرقوق خضار", cat: "veg", time: 50, spice: 2, price: 38,
      desc: "Hand-rolled dough simmered in a spiced stew of squash, aubergine and tomato.",
      bg: "#E5ECD2", plate: { base: "#D5823F", squares: "#F3DFB4", n: 7, extra: "#7B4A7A", garnish: "#7E9A4B" } },
    { id: "luqaimat", name: "Luqaimat", ar: "لقيمات", cat: "sweet", time: 30, spice: 0, price: 22,
      desc: "Crisp saffron dumplings drizzled with date syrup and sesame. Makes about 30.", badge: "Add-on",
      bg: "#FFE9B8", plate: { balls: "#E3A33B", syrup: "#7A3E1E" } },
  ];

  function plateSVG(r, seed) {
    const rand = rng(seed);
    const p = r.plate;
    const cx = 100, cy = 100;
    let s = `<svg viewBox="0 0 200 200" aria-hidden="true">`;
    s += `<ellipse cx="104" cy="108" rx="92" ry="90" fill="rgba(78,38,17,.10)"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="92" fill="#FFFDF8" stroke="#EAD7BC" stroke-width="3"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="76" fill="none" stroke="#F3E7D3" stroke-width="2"/>`;

    // wobbly food mound
    const blob = (rad, fill, jitter = 6) => {
      const pts = [];
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const rr = rad + (rand() - 0.5) * jitter;
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        d += ` Q${a[0]},${a[1]} ${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2}`;
      }
      return `<path d="${d}Z" fill="${fill}"/>`;
    };
    const spot = (fn) => { // random point inside the mound
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * 46;
      return fn(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rand() * 180);
    };
    const leaves = (color, n) => {
      let g = "";
      for (let i = 0; i < n; i++) g += spot((x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" fill="${color}" transform="rotate(${rot} ${x} ${y})"/>`);
      return g;
    };

    if (p.balls) {
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + rand() * 0.3, d = i === 0 ? 0 : 30 + rand() * 18;
        const x = i === 0 ? cx : cx + Math.cos(a) * d, y = i === 0 ? cy : cy + Math.sin(a) * d;
        s += `<circle cx="${x}" cy="${y}" r="17" fill="${p.balls}"/><circle cx="${x - 5}" cy="${y - 6}" r="5" fill="#F6CE7A"/>`;
      }
      s += `<path d="M48 82 C 80 60, 90 120, 120 96 S 150 130, 156 110" fill="none" stroke="${p.syrup}" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;
      for (let i = 0; i < 18; i++) s += spot((x, y) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="1" fill="#FFF7E6"/>`);
    } else {
      s += blob(62, p.base);
      if (p.grains) for (let i = 0; i < 40; i++) s += spot((x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="1.2" fill="${p.grains}" transform="rotate(${rot} ${x} ${y})"/>`);
      if (p.swirl) s += `<path d="M100 100 m-4 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -18 -2 a18 18 0 1 1 30 12" fill="none" stroke="${p.swirl}" stroke-width="7" stroke-linecap="round"/>`;
      if (p.dust) for (let i = 0; i < 26; i++) s += spot((x, y) => `<circle cx="${x}" cy="${y}" r="1.4" fill="${p.dust}"/>`);
      if (p.extra) for (let i = 0; i < 5; i++) s += spot((x, y) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${p.extra}"/>`);
      if (p.squares) for (let i = 0; i < p.n; i++) s += spot((x, y, rot) => `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" rx="3" fill="${p.squares}" transform="rotate(${rot} ${x} ${y})"/>`);
      if (p.pieces) for (let i = 0; i < p.n; i++) s += spot((x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="9" fill="${p.pieces}" transform="rotate(${rot} ${x} ${y})"/>`);
      if (p.garnish) s += leaves(p.garnish, 9);
    }
    return s + "</svg>";
  }

  // Spice level: 0 to 3 chillies, always with a word so the icons never need explaining
  const SPICE = ["Not spicy", "Mild", "Medium", "Hot"];
  const chiliIcon = (hot) => `<svg viewBox="0 0 16 16" class="${hot ? "is-hot" : ""}"><path d="M1.6 13.6 C 5.8 15.8, 12.6 12.2, 13.2 5.6 C 13.3 4.4, 12 3.7, 11 4.3 L 9.2 5.3 C 8.6 9.2, 6 11.4, 2.4 12 C 1.4 12.2, 1 13.2, 1.6 13.6 Z"/><path d="M11.4 4.6 C 11.6 2.8, 12.8 1.6, 14.6 1.6"/></svg>`;
  const chili = (n) => `<span class="spice" aria-label="Spice level: ${SPICE[n]}"><span class="spice__icons" aria-hidden="true">${[0, 1, 2].map((i) => chiliIcon(i < n)).join("")}</span>${SPICE[n]}</span>`;
  const clock = `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 4.5 V 8 L 10.5 9.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  const list = document.getElementById("recipes");
  list.innerHTML = RECIPES.map((r, i) => `
    <li class="recipe" data-cat="${r.cat}" data-id="${r.id}">
      <div class="recipe__plate" style="background:${r.bg}">
        ${r.badge ? `<span class="recipe__badge">${r.badge}</span>` : ""}
        ${plateSVG(r, i * 97 + 13)}
      </div>
      <div class="recipe__body">
        <div class="recipe__names"><h3>${r.name}</h3><span class="recipe__ar" lang="ar" dir="rtl">${r.ar}</span></div>
        <p class="recipe__desc">${r.desc}</p>
        <div class="recipe__meta"><span>${clock}${r.time} min</span>${chili(r.spice)}</div>
        <div class="recipe__foot">
          <span class="recipe__price">${qar(r.price)} <small>for 2</small></span>
          <button type="button" class="addbtn" data-add="${r.id}" aria-label="Add ${r.name} to box">Add to box</button>
        </div>
      </div>
    </li>`).join("");

  // filters
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => { c.classList.remove("is-on"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-on"); chip.setAttribute("aria-pressed", "true");
      const f = chip.dataset.filter;
      list.querySelectorAll(".recipe").forEach((li) => { li.hidden = f !== "all" && li.dataset.cat !== f; });
      track("menu_filter", { filter: f });
    });
  });

  // recipe views (once per card per page load)
  if ("IntersectionObserver" in window) {
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const id = en.target.dataset.id;
        if (en.isIntersecting && !seen.has(id)) { seen.add(id); track("recipe_view", { recipe: id }); io.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    list.querySelectorAll(".recipe").forEach((li) => io.observe(li));
  }

  /* ---------- box (cart) ---------- */
  const box = [];
  const boxBtn = document.getElementById("boxBtn");
  const boxCount = document.getElementById("boxCount");
  const drawer = document.getElementById("drawer");
  const drawerList = document.getElementById("drawerList");
  const drawerEmpty = document.getElementById("drawerEmpty");
  const drawerTotal = document.getElementById("drawerTotal");

  function addToBox(item) {
    if (item.plan) {
      const i = box.findIndex((b) => b.plan);
      if (i > -1) box.splice(i, 1);
    }
    box.push({ ...item, key: Date.now() + Math.random() });
    track("add_to_box", { item: item.name, value: item.price });
    renderBox();
    boxBtn.classList.remove("is-bump"); void boxBtn.offsetWidth; boxBtn.classList.add("is-bump");
    toast(`Added ${item.name} to your box`);
  }
  function renderBox() {
    boxCount.textContent = box.length;
    drawerEmpty.hidden = box.length > 0;
    drawerList.innerHTML = box.map((b) => `
      <li><span>${b.name}<small>${b.detail}</small></span>
      <span class="drawer__price">${qar(b.price)} <button type="button" data-remove="${b.key}" aria-label="Remove ${b.name}">Remove</button></span></li>`).join("");
    drawerTotal.textContent = qar(box.reduce((a, b) => a + b.price, 0));
    document.querySelectorAll("[data-add]").forEach((btn) => {
      const inBox = box.some((b) => b.id === btn.dataset.add);
      btn.classList.toggle("is-added", inBox);
      btn.textContent = inBox ? "Added ✓" : "Add to box";
    });
  }

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      const r = RECIPES.find((x) => x.id === add.dataset.add);
      addToBox({ id: r.id, name: r.name, detail: "2 servings", price: r.price });
    }
    const plan = e.target.closest("[data-plan]");
    if (plan) {
      const name = plan.dataset.plan;
      const price = { Solo: 165, Family: 310, "Chef Plus": 440 }[name];
      addToBox({ plan: true, name: `${name} plan`, detail: "Weekly subscription", price });
    }
    const rm = e.target.closest("[data-remove]");
    if (rm) {
      const i = box.findIndex((b) => String(b.key) === rm.dataset.remove);
      if (i > -1) box.splice(i, 1);
      renderBox();
      drawer.querySelector(".drawer__close").focus();
    }
  });

  function openDrawer() { drawer.hidden = false; document.body.style.overflow = "hidden"; drawer.querySelector(".drawer__close").focus(); }
  function closeDrawer() { drawer.hidden = true; document.body.style.overflow = ""; boxBtn.focus(); }
  boxBtn.addEventListener("click", openDrawer);
  drawer.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeDrawer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) closeDrawer(); });

  /* ---------- checkout (visual prototype) ---------- */
  const co = document.getElementById("checkout");
  const coForm = document.getElementById("checkoutForm");
  const coMain = document.getElementById("coMain");
  const coDone = document.getElementById("coDone");
  const coErr = document.getElementById("coError");
  const subtotal = () => box.reduce((a, b) => a + b.price, 0);

  // next five delivery days, starting two days from today
  const days = document.getElementById("coDays");
  const fmt = (d, o) => d.toLocaleDateString("en-GB", o);
  days.innerHTML = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + 2 + i);
    return `<label><input type="radio" name="day" value="${fmt(d, { weekday: "long", day: "numeric", month: "long" })}" ${i === 0 ? "checked" : ""}>
      <span>${fmt(d, { weekday: "short" })}<b>${d.getDate()}</b>${fmt(d, { month: "short" })}</span></label>`;
  }).join("");

  function renderSummary() {
    const sub = subtotal(), disc = Math.round(sub * 0.5);
    document.getElementById("coItems").innerHTML = box.map((b) =>
      `<li><span>${b.name}<small>${b.detail}</small></span><b>${qar(b.price)}</b></li>`).join("");
    document.getElementById("coSub").textContent = qar(sub);
    document.getElementById("coDisc").textContent = `− ${qar(disc)}`;
    document.getElementById("coTotal").textContent = qar(sub - disc);
    document.getElementById("coPlace").textContent = `Place order · ${qar(sub - disc)}`;
  }
  function openCheckout() {
    if (!box.length) { toast("Add a recipe first, then check out"); return; }
    if (!drawer.hidden) { drawer.hidden = true; }
    renderSummary();
    coMain.hidden = false; coDone.hidden = true; coErr.textContent = "";
    co.hidden = false; co.scrollTop = 0;
    document.body.style.overflow = "hidden";
    co.querySelector(".checkout__back").focus();
    track("checkout_start", { items: box.length, value: subtotal() });
  }
  function closeCheckout() {
    co.hidden = true; document.body.style.overflow = ""; boxBtn.focus();
  }
  document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
  co.addEventListener("click", (e) => { if (e.target.closest("[data-co-close]")) closeCheckout(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !co.hidden) closeCheckout(); });

  coForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const missing = [...coForm.querySelectorAll("[required]")].filter((f) => !f.value.trim());
    coForm.querySelectorAll("[required]").forEach((f) => f.toggleAttribute("aria-invalid", missing.includes(f)));
    coForm.querySelectorAll("[aria-invalid]").forEach((f) => f.setAttribute("aria-invalid", "true"));
    if (missing.length) {
      coErr.textContent = "Add your name, mobile number and address so the driver can find you.";
      missing[0].focus();
      return;
    }
    const day = coForm.querySelector('input[name="day"]:checked').value;
    const slot = coForm.querySelector('input[name="slot"]:checked').value;
    document.getElementById("coWhen").textContent = `${day}, ${slot}`;
    document.getElementById("coRef").textContent = `ZAD-${Math.floor(1000 + Math.random() * 9000)}`;
    track("purchase", { value: subtotal() - Math.round(subtotal() * 0.5), items: box.length });
    box.length = 0; renderBox(); coForm.reset();
    coMain.hidden = true; coDone.hidden = false; co.scrollTop = 0;
    document.getElementById("coDoneTitle").focus();
  });

  // ?checkout opens the screen straight away with a sample box, handy for screenshots
  if (new URLSearchParams(location.search).has("checkout")) {
    const m = RECIPES[0], l = RECIPES[5];
    box.push({ id: m.id, name: m.name, detail: "2 servings", price: m.price, key: 1 },
             { id: l.id, name: l.name, detail: "Add-on", price: l.price, key: 2 });
    renderBox();
    openCheckout();
  }

  /* ---------- customizer ---------- */
  const PROTEIN = {
    chicken: { title: "Chicken machboos", ar: "مكبوس دجاج", item: "Chicken thighs, bone-in", g: 200, perServ: 24, time: 45 },
    lamb: { title: "Lamb machboos", ar: "مكبوس لحم", item: "Lamb shoulder, cubed", g: 180, perServ: 32, time: 75 },
    shrimp: { title: "Shrimp machboos", ar: "مكبوس روبيان", item: "Gulf shrimp, cleaned", g: 160, perServ: 30, time: 35 },
  };
  const ADDONS = { luqaimat: { name: "Luqaimat kit", price: 18 }, laban: { name: "Fresh laban, 1 L", price: 9 } };
  const cardList = document.getElementById("cardList");
  let prev = {};

  function cfg() {
    const v = (n) => document.querySelector(`input[name="${n}"]:checked`).value;
    return {
      protein: v("protein"), servings: +v("servings"), spice: +v("spice"),
      addons: [...document.querySelectorAll('input[name="addon"]:checked')].map((i) => i.value),
    };
  }
  function grams(n) { return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 ? 1 : 0)} kg` : `${Math.round(n / 5) * 5} g`; }
  function renderCard() {
    const c = cfg(), p = PROTEIN[c.protein], s = c.servings;
    const rows = [
      [p.item, grams(p.g * s)],
      ["Sella basmati rice", grams(90 * s)],
      ["Zad bzar spice blend", `${Math.round(6 * s * c.spice)} g`],
      ["Dried limes (loomi)", `${Math.ceil(s / 2) + (c.spice > 1 ? 1 : 0)}`],
      ["Onions", `${Math.ceil(s / 2)}`],
      ["Vine tomatoes", `${s}`],
      ["Garlic, coriander and ghee", "pack"],
    ];
    if (c.spice > 1) rows.push(["Green chillies", `${Math.max(2, s / 2)}`]);
    c.addons.forEach((a) => rows.push([ADDONS[a].name, `+ ${qar(ADDONS[a].price)}`, true]));

    cardList.innerHTML = rows.map(([k, val, extra]) => {
      const changed = prev[k] !== undefined && prev[k] !== val;
      return `<li class="${extra ? "is-extra" : ""}${changed ? " flash" : ""}"><span>${k}</span><b>${val}</b></li>`;
    }).join("");
    prev = Object.fromEntries(rows.map(([k, v]) => [k, v]));

    const price = p.perServ * s + c.addons.reduce((a, k) => a + ADDONS[k].price, 0);
    document.getElementById("cardTitle").textContent = p.title;
    document.getElementById("cardTitleAr").textContent = p.ar;
    document.querySelector(".card-recipe__time").textContent = `${p.time} min`;
    document.getElementById("cardServ").textContent = s;
    document.getElementById("cardPrice").textContent = qar(price);
    return { c, p, price };
  }
  document.querySelector(".touch__copy").addEventListener("change", () => { renderCard(); track("customize", cfg()); });
  document.getElementById("cardAdd").addEventListener("click", () => {
    const { c, p, price } = renderCard();
    const heat = { 0.7: "gentle", 1: "classic", 1.4: "bold" }[c.spice];
    const extras = c.addons.map((a) => ADDONS[a].name.toLowerCase());
    addToBox({ id: `custom-${c.protein}`, name: p.title, detail: [`${c.servings} servings`, `${heat} spice`, ...extras].join(", "), price });
  });
  renderCard();

  /* ---------- waitlist ---------- */
  const form = document.getElementById("waitlistForm");
  const email = document.getElementById("email");
  const msg = document.getElementById("waitlistMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    if (!ok) {
      email.setAttribute("aria-invalid", "true");
      msg.textContent = "Enter an email address like name@example.com.";
      email.focus();
      return;
    }
    email.removeAttribute("aria-invalid");
    email.value = "";
    msg.textContent = "You're on the list. We'll email you before Zad launches in your area.";
    track("waitlist_signup");
  });

  /* ---------- hero arrowheads, computed from the end of each sketched line ---------- */
  document.querySelectorAll(".notes [data-arrow]").forEach((path) => {
    const L = path.getTotalLength();
    const tip = path.getPointAtLength(L), back = path.getPointAtLength(L - 10);
    const ang = Math.atan2(tip.y - back.y, tip.x - back.x);
    const wing = (a) => `${tip.x - 14 * Math.cos(ang + a)},${tip.y - 14 * Math.sin(ang + a)}`;
    const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head.setAttribute("class", "note__line");
    head.setAttribute("d", `M${wing(0.5)} L${tip.x},${tip.y} L${wing(-0.5)}`);
    path.after(head);
  });

  /* ---------- nav ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  track("page_view", { path: location.pathname });
})();
