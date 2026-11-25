// Emits the list of share images to render: [name, params]
import { COUNTRIES, CITIES } from "../data/geo.mjs";
import { SERVICES } from "../data/services.mjs";
import { WORK } from "../data/work.mjs";
const j = [];
j.push(["home", {}]);
j.push(["work", { tag: "Selected work", h1: "Proof, not <em>promises.</em>", sub: `${WORK.length} case studies: branding, e-commerce, lead generation, SEO, websites and software.` }]);
j.push(["locations", { tag: "Based in Dubai · Working worldwide", h1: "Where we <em>work.</em>", sub: `Marketing, branding and SEO for brands in ${CITIES.length} cities.` }]);
for (const c of CITIES) { const co = COUNTRIES[c.cc];
  j.push([`city-${c.slug}`, { tag: `${co.short.replace(/^the /, "")} · ${co.region}`.replace(/^./, (x) => x.toUpperCase()), h1: `Marketing agency in <em>${c.name}.</em>`, sub: `Branding, SEO, ads, social, automation and web for ${c.name} brands.` }]); }
for (const s of SERVICES) j.push([`svc-${s.slug}`, { tag: "Brandeeze services", h1: `${s.name.replace(/ (agency|company)$/i, "")}<em>.</em>`, sub: s.leads[0].replace(/ in \{city\}/g, "").replace(/\{city\}/g, "your market").replace(/\{[a-z]+\}/g, "") }]);
for (const w of WORK) j.push([`work-${w.slug}`, { tag: `${w.cat} · ${w.loc}`, h1: `${w.client}<em>.</em>`, sub: w.headline, foot: w.metrics.map((m) => m.join("~")).join("|") }]);
console.log(JSON.stringify(j));
