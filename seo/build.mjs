// Brandeeze build: copies the static site to dist/ and generates service × city SEO pages,
// city hubs, service hubs, /locations, sitemap.xml and robots.txt.
// Run: node seo/build.mjs   (Vercel runs this on every deploy)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTRIES, CITIES, REGION_ORDER } from "./data/geo.mjs";
import { SERVICES, GROUPS, INDUSTRIES } from "./data/services.mjs";
import { WORK, CATEGORIES, VENTURES, HEADLINE_STATS, PROFILE_PDF } from "./data/work.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "dist");
const SITE = "https://brandeeze.com";
const TODAY = new Date().toISOString().slice(0, 10);
const HQ = { city: "Dubai", cc: "AE", utc: 4 };
const DS = "/_ds/brandeez-design-system-fbe1068f-90f0-4bec-97b9-453ac5cf9fae/tokens/fonts.css";
const CONTACT_LABEL = { brand: "Branding", video: "Video & content", search: "SEO & performance", data: "SEO & performance", social: "Social media", automation: "Automation", web: "Web & software" };

/* ---------------- helpers ---------------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const KEEP = new Set(["WhatsApp", "Google", "Meta", "Ads", "Instagram", "Facebook", "Shopify", "Arabic", "English"]);
const lc = (s) => s.split(" ").map((w) => KEEP.has(w) || /[A-Z].*[A-Z]/.test(w) ? w : w.toLowerCase()).join(" ");
const TOPIC = { "creative-agency": "creative work", "crm-consultancy": "CRM", "data-analytics-consultancy": "data and analytics", "meta-ads-agency": "Meta ads" };
const topicOf = (svc) => TOPIC[svc.slug] || lc(svc.name.replace(/ (agency|company|consultancy)$/i, ""));
function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = hash(seed); return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
function shuffle(r, arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const list = (xs) => xs.length < 2 ? xs.join("") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
function clock(h) { h = ((h % 24) + 24) % 24; const hh = Math.floor(h), mm = Math.round((h - hh) * 60); const ap = hh >= 12 ? "pm" : "am"; const h12 = hh % 12 === 0 ? 12 : hh % 12; return h12 + (mm ? ":" + String(mm).padStart(2, "0") : "") + ap; }
const trim = (s, n) => s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…";

/* ---------------- geo context ---------------- */
const SVC = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));
const CITY = Object.fromEntries(CITIES.map((c) => [c.slug, c]));
function ctxFor(city) {
  const co = COUNTRIES[city.cc];
  const utc = city.utc ?? co.utc;
  const diff = utc - HQ.utc; // hours the city is ahead of Dubai
  // working-hours overlap (9–18 local) with Dubai 9–18
  const a0 = 9 - utc, a1 = 18 - utc, b0 = 9 - HQ.utc, b1 = 18 - HQ.utc;
  const overlap = Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
  let tz;
  if (city.cc === "AE") tz = { short: "Same time zone", long: `${city.name} is on the same clock as our Dubai team, so we can meet in person or jump on a call the same day.` };
  else if (diff === 0) tz = { short: "Same time zone as Dubai", long: `${city.name} shares Dubai's time zone, so our working days line up completely.` };
  else if (overlap >= 6) tz = { short: `${Math.round(overlap)}h shared working day`, long: `${city.name} is ${Math.abs(diff)} hour${Math.abs(diff) === 1 ? "" : "s"} ${diff > 0 ? "ahead of" : "behind"} Dubai, so our working days overlap for about ${Math.round(overlap)} hours.` };
  else if (overlap >= 2.5) tz = { short: `~${Math.round(overlap)}h daily overlap`, long: `We share roughly ${Math.round(overlap)} working hours a day with ${city.name}, which is plenty for calls, reviews and quick decisions.` };
  else if (diff > 0) tz = { short: `9am Dubai = ${clock(9 + diff)} ${city.name}`, long: `When our Dubai team starts at 9am it's ${clock(9 + diff)} in ${city.name}, so we schedule ${city.name} calls at the start of our day.` };
  else tz = { short: `9am ${city.name} = ${clock(9 - diff)} Dubai`, long: `Your 9am in ${city.name} is ${clock(9 - diff)} in Dubai, so we keep evening slots open for ${city.name} clients and work async in between.` };
  const nearby = CITIES.filter((c) => c.slug !== city.slug && c.cc === city.cc);
  const regional = CITIES.filter((c) => c.slug !== city.slug && c.cc !== city.cc && COUNTRIES[c.cc].region === co.region);
  return { co, utc, tz, overlap, nearby: [...nearby, ...regional].slice(0, 6), local: city.cc === HQ.cc };
}
function fill(str, city, ctx) {
  return str.replace(/\{city\}/g, city.name).replace(/\{country\}/g, ctx.co.name).replace(/\{cur\}/g, `${ctx.co.cur[0]} (${ctx.co.cur[1]})`)
    .replace(/\{social\}/g, list(ctx.co.social.slice(0, 3))).replace(/\{region\}/g, ctx.co.region);
}

/* ---------------- shared chrome ---------------- */
const ARROW = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
function head({ title, desc, url, schema }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:site_name" content="Brandeeze">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}${url}">
<meta property="og:image" content="${SITE}/assets/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE}/assets/og-image.jpg">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#1F2235">
<link rel="preload" href="/_ds/brandeez-design-system-fbe1068f-90f0-4bec-97b9-453ac5cf9fae/assets/fonts/archivo-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${DS}">
<link rel="stylesheet" href="/assets/seo.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
<header class="nav"><div class="in">
  <a href="/" class="logo" aria-label="Brandeeze home"><img src="/assets/wordmark-on-dark.svg" alt="Brandeeze" width="156" height="18"></a>
  <nav class="links"><a href="/#services">Services</a><a href="/work">Work</a><a href="/locations">Locations</a><a class="btn btn-gold btn-sm" href="/Contact.dc.html">Start a project</a></nav>
</div></header>
<main>`;
}
function foot() {
  return `</main>
<footer class="foot"><div class="wrap">
  <div><img src="/assets/wordmark-on-dark.svg" alt="Brandeeze" width="156" height="18"><p>A creative and marketing agency based in Dubai, working with brands across the Middle East and around the world.</p></div>
  <nav><span class="cap">Services</span><a href="/services/marketing-agency">Marketing</a><a href="/services/branding-agency">Branding</a><a href="/services/seo-agency">SEO</a><a href="/services/social-media-agency">Social media</a><a href="/services/web-design-company">Web design</a></nav>
  <nav><span class="cap">Popular</span><a href="/dubai">Dubai</a><a href="/abu-dhabi">Abu Dhabi</a><a href="/riyadh">Riyadh</a><a href="/london">London</a><a href="/locations">All locations</a></nav>
  <nav><span class="cap">Brandeeze</span><a href="/">Home</a><a href="/work">Work</a><a href="/brandeeze-profile.pdf" target="_blank" rel="noopener">Company profile (PDF)</a><a href="/Contact.dc.html">Contact</a><a href="mailto:hello@brandeeze.com">hello@brandeeze.com</a></nav>
</div><div class="wrap fine">© ${new Date().getFullYear()} Brandeeze. All rights reserved.</div></footer>
</body>
</html>`;
}
const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([n, u], i) => i === items.length - 1 ? `<span>${esc(n)}</span>` : `<a href="${u}">${esc(n)}</a>`).join("<i>/</i>")}</nav>`;
const crumbSchema = (items) => ({ "@type": "BreadcrumbList", itemListElement: items.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE + u })) });
const ORG = { "@type": "ProfessionalService", "@id": SITE + "/#org", name: "Brandeeze", url: SITE + "/", logo: SITE + "/assets/wordmark-on-dark.svg", image: SITE + "/assets/og-image.jpg", email: "hello@brandeeze.com",
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" } };
const bars = () => `<div class="bars" aria-hidden="true">${"<i></i>".repeat(6)}</div>`;

/* ---------------- service × city page ---------------- */
function servicePage(svc, city) {
  const ctx = ctxFor(city), co = ctx.co, g = GROUPS[svc.group];
  const r = rng(svc.slug + "@" + city.slug);
  const F = (s) => fill(s, city, ctx);
  const url = `/${city.slug}/${svc.slug}`;
  const sName = svc.name, sLow = lc(svc.name), topic = topicOf(svc);
  const layout = Math.floor(r() * 3), order = Math.floor(r() * 3);

  const titles = [`${sName} in ${city.name} | Brandeeze`, `${city.name} ${sLow} | Brandeeze`, `${sName} in ${city.name}, ${cap(co.short)} | Brandeeze`];
  const title = pick(r, city.name === co.short || city.name === "Singapore" || city.name === "Hong Kong" ? titles.slice(0, 2) : titles);
  const h1s = [`${sName} in ${city.name}`, `${sName} in ${city.name} for brands that want to grow`, `${sName} serving ${city.name}`, `${city.name}'s ${sLow} partner`];
  const h1 = pick(r, h1s);
  const lead = F(pick(r, svc.leads));
  const deliver = shuffle(r, svc.deliver).slice(0, 5 + Math.floor(r() * 2));
  const desc = trim(`${lead} ${deliver.slice(0, 2).map((d) => d[0]).join(", ")} and clear reporting. Free consultation.`, 158);

  // market paragraph variants
  const market = [
    `${city.name} is ${city.angle}. ${cap(co.short)} is ${co.note}. ${co.search}`,
    `Why ${city.name} needs a different approach: ${co.search} The city is ${city.angle}, which shapes how we plan every ${topic} engagement here.`,
    `We plan ${topic} work for ${city.name} around how the market actually behaves. ${co.search} Add the fact that ${city.name} is ${city.angle}, and generic playbooks stop working.`,
  ][Math.floor(r() * 3)];

  // FAQs
  const faqs = [];
  svc.faqs.forEach((f) => faqs.push([F(f[0]), F(f[1])]));
  g.faqs.forEach((f) => faqs.push([F(f[0]), F(f[1])]));
  if (!svc.faqs.some((f) => /best/i.test(f[0])))
    faqs.push([`How do I choose the best ${sLow} in ${city.name}?`, `Shortlist providers who can show results for businesses like yours, explain exactly what they will do in the first 90 days and report on leads and revenue rather than vanity metrics. Ask how they handle ${city.name}'s market specifically: ${lc(co.search)}`]);
  if (city.slug === "dubai") faqs.push(["Where is Brandeeze based?", "Brandeeze is based in Dubai, so we can meet in person, run workshops at your office and be on set for shoots across the UAE."]);
  else if (ctx.local) faqs.push([`Do you meet clients in ${city.name}?`, `Yes. ${city.name} is within easy reach of our Dubai base, so we regularly meet clients, run workshops and shoot on location here.`]);
  else faqs.push([`Can a Dubai-based agency work for a business in ${city.name}?`, `Yes. ${ctx.tz.long} We run kick-offs and reviews on video calls, share progress in real time and travel for workshops and shoots when a project needs it.`]);
  if (co.cur[0] !== "AED") faqs.push([`Can you quote in ${co.cur[0]} (${co.cur[1]})?`, co.cur[0] === "USD" ? "Yes. We quote and invoice in US dollars." : `Yes. We can quote and invoice in ${co.cur[0]} or USD, whichever is easier for your finance team.`]);
  const nonEn = co.lang.filter((l) => l !== "English");
  if (nonEn.length) faqs.push([`Can you create ${sLow === "logo design" ? "work" : "content"} in ${nonEn[0]}?`, nonEn[0] === "Arabic" ? "Yes. Our team creates content in English and Arabic in-house, written by native speakers, not machine translated." : `Yes. We work in English and Arabic in-house and partner with native ${nonEn[0]} writers and reviewers when your audience in ${city.name} needs it.`]);
  const faqSel = [faqs[0], ...shuffle(r, faqs.slice(1)).slice(0, 4 + Math.floor(r() * 2))];

  // sections
  const S = {};
  S.intro = (bg) => `<section class="sec ${bg}"><div class="wrap grid2">
    <div><span class="label">${pick(r, ["Overview", "The short version", `${sName}, explained`])}</span><h2 class="h2">${esc(pick(r, [`What ${topic} looks like with Brandeeze`, `How we approach ${topic} in ${city.name}`, `${cap(topic)} built around ${city.name}`]))}</h2></div>
    <div class="prose"><p>${esc(F(pick(r, svc.what)))}</p><p>${esc(market)}</p></div></div></section>`;
  S.industries = (bg) => `<section class="sec ${bg}"><div class="wrap">
    <span class="label">${pick(r, ["Industries", "Who we help", "Sectors"])}</span><h2 class="h2">${esc(pick(r, [`Who we help in ${city.name}`, `${sName} for ${city.name}'s key industries`, `Built for the sectors that drive ${city.name}`]))}</h2>
    <div class="cards">${shuffle(r, city.ind).slice(0, 3 + Math.floor(r() * 2)).map((k) => { const ind = INDUSTRIES[k]; const tpl = [`In ${lc(ind.label)}, ${ind.buyer}, so ${svc.benefit}.`, `${cap(ind.buyer)}. For ${lc(ind.label)} brands in ${city.name}, ${svc.benefit}.`, `${ind.label} in ${city.name} is demanding: ${ind.buyer}. That's where ${topic} earns its keep, because ${svc.benefit}.`]; return `<div class="card"><h3>${esc(ind.label)}</h3><p>${esc(pick(r, tpl))}</p></div>`; }).join("")}</div></div></section>`;
  S.deliver = (bg) => `<section class="sec ${bg}"><div class="wrap grid2">
    <div><span class="label">${pick(r, ["What's included", "Deliverables", "Scope"])}</span><h2 class="h2">${esc(pick(r, [`Our ${topic} services in ${city.name}`, `What you get`, `Everything ${topic} should include`]))}</h2><p class="muted">${esc(pick(r, ["Every engagement is scoped to your goals. These are the building blocks we combine.", "Pick what you need now and add the rest as you grow.", `One team delivers all of it, so nothing gets lost between suppliers.`]))}</p></div>
    <ol class="deliver">${deliver.map((d, i) => `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(F(d[0]))}</h3><p>${esc(F(d[1]))}</p></div></li>`).join("")}</ol></div></section>`;
  S.process = (bg) => `<section class="sec ${bg}"><div class="wrap">
    <span class="label">${pick(r, ["Process", "How it works", "How we work"])}</span><h2 class="h2">${esc(pick(r, ["Four steps. No guesswork.", "From first call to results", `How a ${topic} project runs`]))}</h2>
    <div class="steps">${g.steps.map((s, i) => `<div class="step" style="--w:${(i + 1) * 25}%"><span class="n">0${i + 1}</span><h3>${esc(s[0])}</h3><p>${esc(F(s[1]))}</p></div>`).join("")}</div></div></section>`;
  S.local = (bg) => `<section class="sec ${bg}"><div class="wrap grid2">
    <div><span class="label">${esc(city.name)}</span><h2 class="h2">${esc(pick(r, [ctx.local ? `Your ${topic} team, close to home` : `Working with us from ${city.name}`, `${city.name} at a glance`, `What makes ${city.name} different`]))}</h2></div>
    <div><div class="facts">
      <div><span>Working hours</span><b>${esc(ctx.tz.short)}</b></div>
      <div><span>We quote in</span><b>${esc(co.cur[0] === "USD" ? "USD" : co.cur[0] + " or USD")}</b></div>
      <div><span>Content languages</span><b>${esc(list(co.lang.slice(0, 2)))}</b></div>
      <div><span>Channels that matter</span><b>${esc(list(co.social.slice(0, 3)))}</b></div>
    </div><p class="muted" style="margin-top:20px">${esc(ctx.tz.long)} ${esc(co.search)}</p></div></div></section>`;
  const whySets = [
    [["One team, six disciplines", "Brand, content, SEO and performance, social, automation and web under one roof, so nothing gets lost between suppliers."], ["Reporting you can read", "One dashboard and a monthly review focused on leads, sales and revenue."], ["Built for the region", "Based in Dubai, fluent in English and Arabic, and used to working across time zones."]],
    [["Strategy first", "Every project starts with your numbers and your customers, not a template."], ["Craft that stands out", "Design, film and copy made to be remembered in a crowded market."], ["Honest by default", "No fake reviews, no guaranteed rankings, no hidden fees. Just clear work and clear results."]],
    [["Senior people on your account", "A dedicated lead who coordinates every specialist you need."], ["Fast, in-house production", "Design, video and development made by our team, not outsourced."], ["Measured on results", "We agree targets up front and report against them every month."]],
  ];
  S.why = (bg) => `<section class="sec ${bg}"><div class="wrap">
    <span class="label">${pick(r, ["Why Brandeeze", "The difference", "Why us"])}</span><h2 class="h2">${esc(pick(r, [`Why ${city.name} brands choose Brandeeze`, "Why work with us", `What you get with Brandeeze in ${city.name}`]))}</h2>
    <div class="cards three">${pick(r, whySets).map(([t, d]) => `<div class="card"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join("")}</div></div></section>`;
  S.faq = (bg) => `<section class="sec ${bg}"><div class="wrap grid2">
    <div><span class="label">FAQ</span><h2 class="h2">${esc(pick(r, ["Questions, answered", `${sName} in ${city.name}: FAQs`, "Common questions"]))}</h2><p class="muted">Something else? <a class="u" href="mailto:hello@brandeeze.com">hello@brandeeze.com</a></p></div>
    <div class="faq">${faqSel.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div></section>`;
  const relSvcs = svc.related.filter((s) => SVC[s]);
  S.related = (bg) => `<section class="sec ${bg}"><div class="wrap grid2">
    <div><span class="label">Explore</span><h2 class="h2">More from Brandeeze in ${esc(city.name)}</h2>
      <ul class="links-list">${relSvcs.map((s) => `<li><a href="/${city.slug}/${s}">${esc(SVC[s].name)} in ${esc(city.name)}${ARROW}</a></li>`).join("")}<li><a href="/${city.slug}">All services in ${esc(city.name)}${ARROW}</a></li></ul></div>
    <div><span class="label">Nearby</span><h2 class="h2">${esc(sName)} in other cities</h2>
      <ul class="links-list">${ctx.nearby.map((c) => `<li><a href="/${c.slug}/${svc.slug}">${esc(sName)} in ${esc(c.name)}${ARROW}</a></li>`).join("")}<li><a href="/services/${svc.slug}">${esc(sName)}: all locations${ARROW}</a></li></ul></div></div></section>`;

  const proofs = proofFor(svc, city, r);
  S.proof = (bg) => `<section class="sec ${bg}"><div class="wrap"><span class="label">${pick(r, ["Proof", "Results", "Case studies"])}</span><h2 class="h2">${esc(pick(r, ["Proof, not promises", "Results we've delivered", `Work that backs up our ${topic}`]))}</h2><div class="wgrid three">${proofs.map(workCard).join("")}</div><p class="muted" style="margin-top:24px"><a class="u" href="/work">See all ${WORK.length} case studies</a></p></div></section>`;
  const orders = [["intro", "industries", "deliver", "process", "local", "why", "proof", "faq", "related"], ["intro", "deliver", "local", "industries", "why", "process", "proof", "faq", "related"], ["intro", "why", "deliver", "industries", "process", "local", "proof", "faq", "related"]];
  const body = orders[order].map((k, i) => S[k](i % 2 ? "light" : (i === 0 ? "dark" : "dark2"))).join("\n");

  const crumbItems = [["Home", "/"], ["Locations", "/locations"], [city.name, `/${city.slug}`], [sName, url]];
  const contactHref = "/Contact.dc.html" + (CONTACT_LABEL[svc.group] ? "?service=" + encodeURIComponent(CONTACT_LABEL[svc.group]) : "");
  const ctas = `<div class="ctas"><a class="btn btn-gold" href="${contactHref}">${pick(r, ["Get a free consultation", "Start a project", "Talk to our team"])}${ARROW}</a><a class="btn btn-ghost" href="/work">See our work</a></div>`;
  const facts = `<div class="facts compact"><div><span>Working hours</span><b>${esc(ctx.tz.short)}</b></div><div><span>Currency</span><b>${esc(co.cur[0] === "USD" ? "USD" : co.cur[0] + " or USD")}</b></div><div><span>Languages</span><b>${esc(list(co.lang.slice(0, 2)))}</b></div><div><span>Based in</span><b>Dubai, UAE</b></div></div>`;
  let hero;
  if (layout === 0) hero = `<section class="hero h-split"><div class="wrap">${crumbs(crumbItems)}<div class="grid2 end"><div><span class="label">${esc(g.label)} · ${esc(city.name)}</span><h1>${esc(h1)}</h1><p class="lead">${esc(lead)}</p>${ctas}</div><div class="hero-side">${bars()}${facts}</div></div></div></section>`;
  else if (layout === 1) hero = `<section class="hero h-giant"><div class="ghost" aria-hidden="true">${esc(city.name)}</div><div class="wrap">${crumbs(crumbItems)}<span class="label">${esc(cap(co.short))} · ${esc(co.region)}</span><h1>${esc(h1)}</h1><div class="grid2 end"><p class="lead">${esc(lead)}</p>${ctas}</div>${facts}</div></section>`;
  else hero = `<section class="hero h-edit"><div class="wrap">${crumbs(crumbItems)}<div class="grid2 end"><div><span class="idx">${String(SERVICES.indexOf(svc) + 1).padStart(2, "0")} / ${SERVICES.length}</span><h1>${esc(h1)}</h1></div><div><p class="lead">${esc(lead)}</p>${ctas}</div></div></div><div class="ticker" aria-hidden="true"><div>${[...deliver, ...deliver].map((d) => `<span>${esc(F(d[0]))}</span>`).join("")}</div></div></section>`;

  const cta = `<section class="sec cta"><div class="wrap"><span class="label">Next step</span><h2 class="h-xl">${esc(pick(r, ["Your brand is next.", `Let's grow in ${city.name}.`, "Ready when you are."]))}</h2>${ctas}</div></section>`;

  const schema = { "@context": "https://schema.org", "@graph": [ORG,
    { "@type": "Service", name: `${sName} in ${city.name}`, serviceType: sName, url: SITE + url, description: lead, provider: { "@id": SITE + "/#org" },
      areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "Country", name: co.name.replace(/^the /, "") } } },
    crumbSchema(crumbItems),
    { "@type": "FAQPage", mainEntity: faqSel.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }] };
  return { url, html: head({ title, desc, url, schema }) + hero + body + cta + foot() };
}

/* ---------------- city hub ---------------- */
const GROUP_ORDER = ["agency", "brand", "video", "search", "social", "automation", "web", "data"];
function cityHub(city) {
  const ctx = ctxFor(city), co = ctx.co, r = rng("hub@" + city.slug);
  const url = `/${city.slug}`;
  const title = `Marketing, Branding & SEO Agency in ${city.name} | Brandeeze`;
  const desc = trim(`Brandeeze helps ${city.name} businesses grow with branding, video, SEO, paid ads, social media, automation and web design. One team, clear results.`, 158);
  const crumbItems = [["Home", "/"], ["Locations", "/locations"], [city.name, url]];
  const groups = GROUP_ORDER.map((gk) => [GROUPS[gk].label, SERVICES.filter((s) => s.group === gk)]);
  const html = head({ title, desc, url, schema: { "@context": "https://schema.org", "@graph": [ORG, crumbSchema(crumbItems),
      { "@type": "CollectionPage", name: title, url: SITE + url, about: { "@type": "City", name: city.name } }] } }) +
    `<section class="hero h-giant"><div class="ghost" aria-hidden="true">${esc(city.name)}</div><div class="wrap">${crumbs(crumbItems)}<span class="label">${esc(cap(co.short))} · ${esc(co.region)}</span><h1>Marketing agency in ${esc(city.name)}</h1><div class="grid2 end"><p class="lead">${esc(`Branding, content, SEO, paid media, social, automation and web for ${city.name} businesses, delivered by one team.`)}</p><div class="ctas"><a class="btn btn-gold" href="/Contact.dc.html">Get a free consultation${ARROW}</a></div></div></div></section>
<section class="sec dark2"><div class="wrap grid2"><div><span class="label">${esc(city.name)}</span><h2 class="h2">Marketing in ${esc(city.name)}</h2></div><div class="prose"><p>${esc(`${city.name} is ${city.angle}. ${cap(co.short)} is ${co.note}.`)}</p><p>${esc(co.search)} ${esc(ctx.tz.long)}</p></div></div></section>
<section class="sec light"><div class="wrap"><span class="label">Services</span><h2 class="h2">Everything we offer in ${esc(city.name)}</h2>
<div class="hub">${groups.map(([gl, ss]) => `<div><h3>${esc(gl)}</h3><ul>${ss.map((s) => `<li><a href="/${city.slug}/${s.slug}">${esc(s.name)} in ${esc(city.name)}</a></li>`).join("")}</ul></div>`).join("")}</div></div></section>
<section class="sec dark2"><div class="wrap"><span class="label">Industries</span><h2 class="h2">Sectors we know in ${esc(city.name)}</h2><div class="cards">${city.ind.map((k) => `<div class="card"><h3>${esc(INDUSTRIES[k].label)}</h3><p>${esc(cap(INDUSTRIES[k].buyer))}.</p></div>`).join("")}</div></div></section>
<section class="sec light"><div class="wrap"><span class="label">Nearby</span><h2 class="h2">Other locations</h2><ul class="links-list cols">${ctx.nearby.map((c) => `<li><a href="/${c.slug}">Marketing agency in ${esc(c.name)}${ARROW}</a></li>`).join("")}<li><a href="/locations">All locations${ARROW}</a></li></ul></div></section>
<section class="sec cta"><div class="wrap"><span class="label">Next step</span><h2 class="h-xl">Your brand is next.</h2><div class="ctas"><a class="btn btn-gold" href="/Contact.dc.html">Start a project${ARROW}</a></div></div></section>` + foot();
  return { url, html };
}

/* ---------------- service hub ---------------- */
function serviceHub(svc) {
  const url = `/services/${svc.slug}`, g = GROUPS[svc.group];
  const title = `${svc.name} | Brandeeze`;
  const plain = (s) => s.replace(/\{city\}/g, "your market").replace(/\{country\}/g, "your country").replace(/\{cur\}/g, "your currency").replace(/\{social\}/g, "the platforms your audience uses").replace(/\{region\}/g, "your region").replace(/ in your market/g, "");
  const desc = trim(plain(svc.leads[0]) + " Available in " + CITIES.length + " cities worldwide.", 158);
  const crumbItems = [["Home", "/"], ["Services", "/#services"], [svc.name, url]];
  const byRegion = REGION_ORDER.map((rg) => [rg, CITIES.filter((c) => COUNTRIES[c.cc].region === rg)]).filter(([, cs]) => cs.length);
  const html = head({ title, desc, url, schema: { "@context": "https://schema.org", "@graph": [ORG, crumbSchema(crumbItems),
      { "@type": "Service", name: svc.name, serviceType: svc.name, url: SITE + url, provider: { "@id": SITE + "/#org" }, areaServed: CITIES.map((c) => ({ "@type": "City", name: c.name })) }] } }) +
    `<section class="hero h-split"><div class="wrap">${crumbs(crumbItems)}<div class="grid2 end"><div><span class="label">${esc(g.label)}</span><h1>${esc(svc.name)}</h1><p class="lead">${esc(plain(svc.leads[1] || svc.leads[0]))}</p><div class="ctas"><a class="btn btn-gold" href="/Contact.dc.html">Get a free consultation${ARROW}</a></div></div><div class="hero-side">${bars()}</div></div></div></section>
<section class="sec dark2"><div class="wrap grid2"><div><span class="label">Overview</span><h2 class="h2">What's included</h2><p class="muted">${esc(plain(svc.what[0]))}</p></div><ol class="deliver">${svc.deliver.map((d, i) => `<li><span class="n">0${i + 1}</span><div><h3>${esc(plain(d[0]))}</h3><p>${esc(plain(d[1]))}</p></div></li>`).join("")}</ol></div></section>
<section class="sec light"><div class="wrap"><span class="label">Locations</span><h2 class="h2">${esc(svc.name)} by city</h2><div class="hub">${byRegion.map(([rg, cs]) => `<div><h3>${esc(rg)}</h3><ul>${cs.map((c) => `<li><a href="/${c.slug}/${svc.slug}">${esc(svc.name)} in ${esc(c.name)}</a></li>`).join("")}</ul></div>`).join("")}</div></div></section>
<section class="sec cta"><div class="wrap"><span class="label">Next step</span><h2 class="h-xl">Your brand is next.</h2><div class="ctas"><a class="btn btn-gold" href="/Contact.dc.html">Start a project${ARROW}</a></div></div></section>` + foot();
  return { url, html };
}

/* ---------------- locations index ---------------- */
function locations() {
  const url = "/locations";
  const title = "Locations: Marketing & Branding Agency Worldwide | Brandeeze";
  const desc = `Brandeeze works with brands in ${CITIES.length} cities, from Dubai and Riyadh to London and New York. Find marketing, branding, SEO and web services in your city.`;
  const byRegion = REGION_ORDER.map((rg) => [rg, CITIES.filter((c) => COUNTRIES[c.cc].region === rg)]).filter(([, cs]) => cs.length);
  const html = head({ title, desc, url, schema: { "@context": "https://schema.org", "@graph": [ORG, crumbSchema([["Home", "/"], ["Locations", url]])] } }) +
    `<section class="hero h-split"><div class="wrap">${crumbs([["Home", "/"], ["Locations", url]])}<div class="grid2 end"><div><span class="label">Based in Dubai · Working worldwide</span><h1>Where we work</h1><p class="lead">${esc(`From our base in Dubai we work with brands in ${CITIES.length} cities across ${Object.keys(COUNTRIES).length} countries. Pick your city to see how we help businesses there.`)}</p></div><div class="hero-side">${bars()}</div></div></div></section>
<section class="sec light"><div class="wrap"><div class="hub">${byRegion.map(([rg, cs]) => `<div><h3>${esc(rg)}</h3><ul>${cs.map((c) => `<li><a href="/${c.slug}">${esc(c.name)}, ${esc(COUNTRIES[c.cc].short.replace(/^the /, ""))}</a></li>`).join("")}</ul></div>`).join("")}</div></div></section>` + foot();
  return { url, html };
}


/* ---------------- work ---------------- */
const CAT_CLASS = { "Branding": "c-brand", "Software & automation": "c-soft", "E-commerce growth": "c-ecom", "Lead generation": "c-lead", "SEO": "c-seo", "Websites & stores": "c-web" };
const SVC_LINK = { "Brand identity": "branding-agency", "Monogram": "logo-design", "Packaging": "packaging-design", "Brand book": "branding-agency", "Custom e-commerce": "ecommerce-development", "Logo": "logo-design", "Symbol": "logo-design", "Brand guidelines": "branding-agency", "Stationery": "branding-agency", "Bags": "packaging-design", "Naming": "brand-strategy", "Mood board": "brand-strategy", "Logo concepts": "logo-design", "Submarks": "logo-design", "AI agents": "ai-automation-agency", "SaaS product": "software-development-company", "Custom CRM & ERP": "crm-consultancy", "Web app": "software-development-company", "Automation": "marketing-automation-agency", "Website": "web-design-company", "SEO": "seo-agency", "Admin panel": "web-design-company", "Tracking": "data-analytics-consultancy", "Personal branding": "branding-agency", "Meta Ads": "meta-ads-agency", "Google Ads": "google-ads-agency", "Google Search": "google-ads-agency", "WhatsApp automation": "whatsapp-automation", "WhatsApp Business": "whatsapp-automation", "CRM & WhatsApp automation": "crm-consultancy", "CRM follow-up": "crm-consultancy", "Bitrix24 CRM": "crm-consultancy", "Email automation": "marketing-automation-agency", "Performance marketing": "performance-marketing-agency", "Healthcare marketing": "performance-marketing-agency", "B2B SEO": "seo-agency", "Product SEO": "seo-agency", "Local SEO": "local-seo", "Portfolio SEO": "seo-agency", "Google Business Profile": "local-seo", "Schema markup": "seo-agency", "Content": "content-marketing-agency", "Shopify design": "ecommerce-development", "Shopify development": "ecommerce-development", "Shopify setup": "ecommerce-development", "Shopify build": "ecommerce-development", "Shopify redesign": "ecommerce-development", "Shopify subscriptions": "ecommerce-development", "E-commerce launch": "ecommerce-development", "E-commerce development": "ecommerce-development", "E-commerce": "ecommerce-development", "E-commerce platform": "ecommerce-development", "Website design": "web-design-company", "Website development": "web-design-company", "Development": "web-design-company", "Landing pages": "web-design-company", "Landing page optimisation": "web-design-company", "Social media ads": "meta-ads-agency", "Instagram lead ads": "meta-ads-agency", "Video ads": "video-production-company", "UGC creative": "content-marketing-agency", "Creative strategy": "creative-agency", "Catalogue automation": "ai-automation-agency", "CRO": "performance-marketing-agency", "UX": "web-design-company", "Upsells": "ecommerce-development", "Booking system": "software-development-company", "Property search": "software-development-company", "Lead generation": "performance-marketing-agency", "Local targeting": "local-seo" };
function cover(w, big) {
  if (w.images && w.images.length) return `<div class="cov cov-img ${CAT_CLASS[w.cat]}${big ? " big" : ""}"><img src="${w.images[0]}" alt="${esc(w.client)}: ${esc(w.headline)}" loading="lazy" width="1600" height="1000"><span class="cov-cat">${esc(w.cat)}</span><span class="cov-c">${esc(w.client)}</span></div>`;
  const m = w.metrics[0];
  return `<div class="cov ${CAT_CLASS[w.cat]}${big ? " big" : ""}" aria-hidden="true"><span class="cov-cat">${esc(w.cat)}</span><span class="cov-m">${esc(m[0])}</span><span class="cov-l">${esc(m[1])}</span><span class="cov-c">${esc(w.client)}</span></div>`;
}
function workCard(w) {
  return `<a class="wcard" href="/work/${w.slug}" data-cat="${esc(w.cat)}">${cover(w)}<div class="wbody"><span class="wloc">${esc(w.loc)}</span><h3>${esc(w.headline)}</h3><div class="wtags">${w.services.slice(0, 3).map((s) => `<span>${esc(s)}</span>`).join("")}</div></div></a>`;
}
function workIndex() {
  const url = "/work";
  const title = "Our Work: Case Studies & Client Results | Brandeeze";
  const desc = `${WORK.length} client projects across e-commerce, lead generation, SEO and websites, from Dubai and Doha to Melbourne and New York. Real numbers, real brands.`;
  const crumbItems = [["Home", "/"], ["Work", url]];
  const html = head({ title, desc, url, schema: { "@context": "https://schema.org", "@graph": [ORG, crumbSchema(crumbItems),
      { "@type": "CollectionPage", name: title, url: SITE + url, hasPart: WORK.map((w) => ({ "@type": "CreativeWork", name: `${w.client}: ${w.headline}`, url: `${SITE}/work/${w.slug}` })) }] } }) +
    `<section class="hero h-split"><div class="wrap">${crumbs(crumbItems)}<div class="grid2 end"><div><span class="label">Selected work</span><h1>Proof, not promises.</h1><p class="lead">${esc(`${WORK.length} projects for brands across ${new Set(WORK.map((w) => w.cc)).size} countries. Every number below comes from the client's own ad accounts, analytics or store data.`)}</p><div class="ctas"><a class="btn btn-gold" href="${PROFILE_PDF}" target="_blank" rel="noopener">Download company profile (PDF)${ARROW}</a></div></div><div class="hero-side">${bars()}</div></div>
    <div class="stats4">${HEADLINE_STATS.map(([k, v]) => `<div><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join("")}</div></div></section>
<section class="sec light"><div class="wrap">
  <div class="filters" role="tablist">${["All", ...CATEGORIES].map((c, i) => `<button type="button" class="chip${i ? "" : " on"}" data-f="${esc(c)}">${esc(c)} <i>${c === "All" ? WORK.length : WORK.filter((w) => w.cat === c).length}</i></button>`).join("")}</div>
  <div class="wgrid" id="wgrid">${WORK.map(workCard).join("")}</div></div></section>
<section class="sec dark2"><div class="wrap grid2"><div><span class="label">Ventures</span><h2 class="h2">Brands we built ourselves</h2><p class="muted">We don't just advise. We've launched and grown our own businesses with the same playbook.</p></div>
  <div class="cards">${VENTURES.map((v) => `<a class="card" href="${v.url}" target="_blank" rel="noopener"><h3>${esc(v.name)} ↗</h3><p>${esc(v.text)}</p></a>`).join("")}</div></div></section>
<section class="sec cta"><div class="wrap"><span class="label">Next step</span><h2 class="h-xl">Your brand is next.</h2><div class="ctas"><a class="btn btn-gold" href="/Contact.dc.html">Start a project${ARROW}</a></div></div></section>
<script>(()=>{const b=[...document.querySelectorAll('.chip')],c=[...document.querySelectorAll('.wcard')];b.forEach(x=>x.addEventListener('click',()=>{b.forEach(y=>y.classList.toggle('on',y===x));const f=x.dataset.f;c.forEach(k=>k.hidden=!(f==='All'||k.dataset.cat===f));}));})();</script>` + foot();
  return { url, html };
}
function caseStudy(w) {
  const url = `/work/${w.slug}`;
  const title = `${w.client} Case Study: ${w.metrics[0][0]} ${w.metrics[0][1]} | Brandeeze`;
  const desc = trim(`${w.headline}. ${w.summary}`, 158);
  const crumbItems = [["Home", "/"], ["Work", "/work"], [w.client, url]];
  const related = WORK.filter((o) => o !== w && o.cat === w.cat).slice(0, 3);
  const svcLinks = [...new Set(w.services.map((s) => SVC_LINK[s]).filter(Boolean))];
  const html = head({ title, desc, url, schema: { "@context": "https://schema.org", "@graph": [ORG, crumbSchema(crumbItems),
      { "@type": "Article", headline: `${w.client}: ${w.headline}`, description: w.summary, url: SITE + url, image: w.images.length ? SITE + w.images[0] : (w.proof || SITE + "/assets/og-image.jpg"),
        author: { "@id": SITE + "/#org" }, publisher: { "@id": SITE + "/#org" }, about: { "@type": "Organization", name: w.client, ...(w.site ? { url: w.site } : {}) }, keywords: w.services.join(", ") }] } }) +
    `<section class="hero h-split"><div class="wrap">${crumbs(crumbItems)}<div class="grid2 end"><div><span class="label">${esc(w.cat)} · ${esc(w.loc)}</span><h1 class="h1-case">${esc(w.headline)}</h1><p class="lead">${esc(w.client)}${w.duration ? " · " + esc(w.duration) : ""}</p><div class="ctas">${w.pdf ? `<a class="btn btn-gold" href="${PROFILE_PDF}#page=${w.pdf}" target="_blank" rel="noopener">See it in our profile (PDF)${ARROW}</a>` : ""}${w.site ? `<a class="btn btn-ghost" href="${w.site}" target="_blank" rel="noopener">Visit ${esc(w.site.replace(/^https?:\/\/(www\.)?/, ""))} ↗</a>` : ""}${w.brandbook ? `<a class="btn btn-ghost" href="${w.brandbook}" target="_blank" rel="noopener">Brand book ↗</a>` : ""}</div></div><div>${cover(w, true)}</div></div>
    <div class="stats4">${w.metrics.map(([k, v]) => `<div><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join("")}</div></div></section>
<section class="sec dark2"><div class="wrap grid2"><div><span class="label">The client</span><h2 class="h2">${esc(w.client)}</h2>${w.site ? `<p class="muted"><a class="u" href="${w.site}" target="_blank" rel="noopener">${esc(w.site.replace(/^https?:\/\//, ""))} ↗</a></p>` : ""}</div>
  <div class="prose"><p>${esc(w.summary)}</p><p><strong>The goal:</strong> ${esc(w.objective)}</p></div></div></section>
<section class="sec light"><div class="wrap grid2"><div><span class="label">Approach</span><h2 class="h2">What we did</h2></div><ol class="deliver">${w.strategy.map((s, i) => `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><div><p class="big">${esc(s)}</p></div></li>`).join("")}</ol></div></section>
<section class="sec dark2"><div class="wrap grid2"><div><span class="label">Results</span><h2 class="h2">What changed</h2></div><ul class="results">${w.results.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div></section>
${w.images.length > (w.cat === "Branding" ? 0 : 0) ? `<section class="sec light"><div class="wrap"><span class="label">${w.cat === "Branding" ? "The work" : w.cat === "Websites & stores" || w.cat === "Software & automation" ? "Screens" : "Proof"}</span><h2 class="h2">${w.cat === "Branding" ? "Identity in use" : w.cat === "Websites & stores" || w.cat === "Software & automation" ? "Inside the build" : "From the dashboard"}</h2><div class="gallery g${Math.min(w.images.length, 3)}">${w.images.map((src, i) => `<figure><img src="${src}" alt="${esc(w.client)} ${w.cat === "Branding" ? "brand identity" : "project"} image ${i + 1}" loading="lazy"></figure>`).join("")}</div>${w.pdf ? `<p class="muted" style="margin-top:20px">Full project on page ${w.pdf} of our <a class="u" href="${PROFILE_PDF}#page=${w.pdf}" target="_blank" rel="noopener">company profile (PDF)</a>.</p>` : ""}</div></section>` : ""}
${w.proof ? `<section class="sec light"><div class="wrap"><span class="label">Proof</span><h2 class="h2">From the dashboard</h2><figure class="proof"><img src="${w.proof}" alt="${esc(w.client)} campaign results dashboard" loading="lazy"><figcaption>Screenshot from ${esc(w.client)}'s ${w.cat === "Websites & stores" ? "store" : w.cat === "SEO" ? "search results" : "ad account"}.</figcaption></figure></div></section>` : ""}
<section class="sec ${w.proof || w.images.length ? "dark2" : "light"}"><div class="wrap grid2"><div><span class="label">Services used</span><h2 class="h2">How we can help you</h2><div class="wtags big">${w.services.map((s) => `<span>${esc(s)}</span>`).join("")}</div></div>
  <ul class="links-list">${svcLinks.map((s) => `<li><a href="/services/${s}">${esc(SVC[s].name)}${ARROW}</a></li>`).join("")}<li><a href="/work">All case studies${ARROW}</a></li></ul></div></section>
${related.length ? `<section class="sec light"><div class="wrap"><span class="label">More work</span><h2 class="h2">More ${esc(w.cat.toLowerCase())}</h2><div class="wgrid three">${related.map(workCard).join("")}</div></div></section>` : ""}
<section class="sec cta"><div class="wrap"><span class="label">Next step</span><h2 class="h-xl">Your brand is next.</h2><div class="ctas"><a class="btn btn-gold" href="/Contact.dc.html">Start a project${ARROW}</a><a class="btn btn-ghost" href="/work">See all work</a></div></div></section>` + foot();
  return { url, html };
}
function proofFor(svc, city, r) {
  const co = COUNTRIES[city.cc];
  const scored = WORK.map((w) => {
    let s = 0;
    if (w.groups.includes(svc.group)) s += 4;
    if (svc.group === "data" && w.groups.includes("search")) s += 3;
    if (city.ind.includes(w.ind)) s += 2;
    if (w.cc === city.cc) s += 3; else if (COUNTRIES[w.cc] && COUNTRIES[w.cc].region === co.region) s += 1;
    if (w.featured) s += 1;
    return [s + r() * 1.5, w];
  }).sort((a, b) => b[0] - a[0]);
  return scored.slice(0, 3).map((x) => x[1]);
}

/* ---------------- build ---------------- */
function write(url, html) {
  const dir = path.join(OUT, url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}
const SKIP = new Set(["seo", "dist", ".git", "node_modules", ".vercel", ".github"]);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(ROOT)) if (!SKIP.has(f)) fs.cpSync(path.join(ROOT, f), path.join(OUT, f), { recursive: true });
fs.copyFileSync(path.join(ROOT, "seo/assets/seo.css"), path.join(OUT, "assets/seo.css"));

for (const c of CITIES) if (fs.existsSync(path.join(OUT, c.slug))) throw new Error("City slug collides with site file: " + c.slug);
const urls = ["/", "/locations"];
let n = 0;
const L = locations(); write(L.url, L.html);
const WI = workIndex(); write(WI.url, WI.html);
for (const w of WORK) { const c = caseStudy(w); write(c.url, c.html); }
for (const c of CITIES) if (c.slug === "work") throw new Error("slug clash");
for (const svc of SERVICES) { const p = serviceHub(svc); write(p.url, p.html); urls.push(p.url); }
for (const city of CITIES) {
  const h = cityHub(city); write(h.url, h.html); urls.push(h.url);
  for (const svc of SERVICES) { const p = servicePage(svc, city); write(p.url, p.html); urls.push(p.url); n++; }
}
urls.push("/work", ...WORK.map((w) => "/work/" + w.slug), "/Contact.dc.html");
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /classic\nDisallow: /Home.dc.html\nDisallow: /Home%20v1.dc.html\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${n} service×city pages, ${CITIES.length} city hubs, ${SERVICES.length} service hubs, ${urls.length} sitemap URLs.`);
