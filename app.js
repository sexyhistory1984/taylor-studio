/* Taylor Caldwell studio site. No build step, no dependencies. */
(() => {
const CONFIG = {
  email: 'tarthwell@gmail.com',
  fiverr: 'https://www.fiverr.com/trade_upp',
  tz: 'America/New_York',
  hours: { days: [1,2,3,4,5,6], open: 9, close: 18 },
  site: 'https://taylor.famemaker.app/'
};

const CATS = {
  research: 'Research & intelligence',
  docs: 'Documents & policies',
  data: 'Spreadsheets & automation',
  copy: 'Store & marketplace copy',
  brand: 'Brand & visuals'
};

const SERVICES = [
 { id:'brief', cat:'research', name:'Market & competitor research brief', blurb:'A decision-ready brief built only from public, checkable sources: competitor profiles, comparison table, SWOT and next steps.', tags:['market research','competitors','SWOT'],
   tiers:[{n:'Snapshot',p:25,d:2,s:'3 competitors, 2-page summary, sources linked'},{n:'Competitor Brief',p:60,d:2,s:'5 competitors, pricing table, SWOT, 2 revisions'},{n:'Full Market Brief',p:120,d:3,s:'8 competitors, market sizing from public data, positioning recommendations, exec summary'}] },
 { id:'table', cat:'research', name:'Competitor analysis table in 48 hours', blurb:'A clean spreadsheet of pricing, features, target customer, positioning and channels, each cell linked to its source.', tags:['competitor table','pricing','48h'],
   tiers:[{n:'Five',p:25,d:2,s:'5 competitors, 8 columns, source links'},{n:'Ten',p:45,d:2,s:'10 competitors plus a gaps-and-opportunities note'},{n:'Fifteen',p:75,d:3,s:'15 competitors, summary page, 3 revisions'}] },
 { id:'vendor', cat:'research', name:'Vendor & tool comparison', blurb:'Side-by-side comparison of software, vendors or suppliers with a recommendation weighted to your requirements.', tags:['vendor comparison','software selection'],
   tiers:[{n:'Shortlist',p:80,d:2,s:'Up to 5 options: pricing tiers, features, limits, support, review signals'},{n:'Scored',p:140,d:3,s:'Up to 10 options with a weighted scoring matrix you can edit'},{n:'Board-ready',p:220,d:4,s:'Scored comparison plus a one-page recommendation memo'}] },
 { id:'resale', cat:'research', name:'What is it worth? Resale value check', blurb:'Real recent sold prices for a used item, with a realistic listing price, best channel and condition notes.', tags:['resale','eBay sold prices','valuation'],
   tiers:[{n:'One item',p:10,d:1,s:'1 item, 10+ sold comparables, price range'},{n:'Five items',p:25,d:1,s:'5 items in one sheet with recommended channels'},{n:'Inventory',p:45,d:2,s:'Up to 15 items, prioritised by expected return'}] },

 { id:'sop', cat:'docs', name:'SOP, proposal or policy drafting', blurb:'Turn rough notes into a structured, ready-to-use document: procedures with roles and checklists, client proposals, internal policies.', tags:['SOP','proposal','policy'],
   tiers:[{n:'One Document',p:30,d:2,s:'1 document up to 3 pages, 1 revision'},{n:'Document + Polish',p:70,d:3,s:'1 document up to 8 pages, formatted template, 2 revisions'},{n:'Document Pack',p:140,d:4,s:'Up to 3 related documents, 15 pages, editable template, 3 revisions'}] },
 { id:'sop-pack', cat:'docs', name:'SOP & onboarding template pack', blurb:'Twelve editable templates to document how your business runs and onboard staff consistently. Word and Google Docs.', tags:['templates','onboarding','instant'],
   tiers:[{n:'Pack',p:19,d:1,s:'12 templates: SOP master, register, process map, pre-boarding, day 1 to 90, 30/60/90 form and more'},{n:'Pack + Fit',p:49,d:2,s:'Pack customised with your business name, roles and three of your own procedures'},{n:'Pack + Workshop',p:99,d:3,s:'Customised pack plus a 45-minute walkthrough call'}] },
 { id:'dd', cat:'docs', name:'Due-diligence memo before you buy a website, SaaS or newsletter', blurb:'Red flags, traffic and revenue sanity checks, valuation range and payback period, written for a buyer who has to decide this week.', tags:['due diligence','acquisition','memo'],
   tiers:[{n:'Red-flag memo',p:40,d:2,s:'1 listing, 12-point red-flag check, verdict'},{n:'Valuation memo',p:75,d:2,s:'Adds valuation range, payback and seller questions'},{n:'Full memo',p:150,d:3,s:'Two listings compared, negotiation points, 3 revisions'}] },
 { id:'redflag', cat:'docs', name:'Flippa or Acquire listing red-flag check', blurb:'A fast, honest read of a marketplace listing before you spend time or money on it.', tags:['Flippa','Acquire','red flags'],
   tiers:[{n:'One listing',p:25,d:1,s:'12-point check with a clear pass, caution or walk-away verdict'},{n:'Three listings',p:60,d:2,s:'Three listings ranked against each other'},{n:'Deal flow',p:110,d:3,s:'Up to six listings per week for one week'}] },
 { id:'acq', cat:'docs', name:'Acquisition memo: valuation, red flags & payback in 48 hours', blurb:'For buyers of small digital businesses: the memo you would want from an analyst, at a price a solo buyer can justify.', tags:['valuation','payback','48h'],
   tiers:[{n:'Memo',p:75,d:2,s:'Valuation range, payback, 10 red flags, sources'},{n:'Memo + Model',p:150,d:3,s:'Adds an editable payback and sensitivity spreadsheet'},{n:'Memo + Call',p:220,d:3,s:'Adds a 30-minute walkthrough call'}] },

 { id:'clean', cat:'data', name:'Spreadsheet cleanup & report', blurb:'Duplicates removed, dates, numbers and names standardised, suspicious values flagged (never silently deleted), plus pivots, charts and a findings report.', tags:['Excel','Google Sheets','report'],
   tiers:[{n:'Quick Clean',p:20,d:1,s:'1 sheet, up to 1,000 rows, change log'},{n:'Clean + Summary',p:50,d:2,s:'Up to 3 sheets or 5,000 rows, summary pivot'},{n:'Clean + Report',p:100,d:3,s:'Up to 5 sheets or 10,000 rows, pivots, charts, 1-page report'}] },
 { id:'crm', cat:'data', name:'CRM contact list dedupe & standardise', blurb:'Merge duplicates, standardise names, phones, emails and addresses, flag invalid rows, and hand back an import-ready file with a change log.', tags:['CRM','dedupe','import-ready'],
   tiers:[{n:'Up to 5,000 rows',p:40,d:1,s:'Dedupe, standardise, flag, change log'},{n:'Up to 20,000 rows',p:90,d:2,s:'Adds merge rules you approve first'},{n:'Up to 50,000 rows',p:180,d:3,s:'Adds field mapping to your CRM import template'}] },
 { id:'csv', cat:'data', name:'CSV clean & convert script', blurb:'A reusable script that turns your bank, Shopify or CRM export into the exact import file another system wants, every time.', tags:['CSV','script','automation'],
   tiers:[{n:'One mapping',p:20,d:1,s:'1 source to 1 target, documented, runs on Mac or Windows'},{n:'Three mappings',p:45,d:2,s:'Three conversions with validation rules'},{n:'Pipeline',p:90,d:3,s:'Scheduled run, error report, 3 revisions'}] },
 { id:'macro', cat:'data', name:'Google Sheets Apps Script or Excel macro', blurb:'Automate the task you do every Monday: reports, reminders, formatting, imports, reconciliations.', tags:['Apps Script','VBA','automation'],
   tiers:[{n:'One task',p:25,d:2,s:'1 script or macro, commented, with instructions'},{n:'Workflow',p:60,d:3,s:'Up to 3 connected tasks, menu button, error handling'},{n:'Dashboard',p:120,d:4,s:'Workflow plus an auto-refreshing dashboard sheet'}] },
 { id:'template', cat:'data', name:'Custom Google Sheets or Notion template', blurb:'A tracker, CRM, budget or project board designed around how you actually work, with formulas and views set up.', tags:['Sheets','Notion','template'],
   tiers:[{n:'Starter',p:15,d:1,s:'1 tab or database, formulas and formatting'},{n:'System',p:40,d:2,s:'Up to 4 linked tabs or databases, dashboard view'},{n:'Studio build',p:85,d:3,s:'Full workspace with instructions video'}] },

 { id:'desc', cat:'copy', name:'Product descriptions for your online store', blurb:'Clear, persuasive descriptions that answer the buyer\'s questions and read well on mobile.', tags:['product copy','ecommerce'],
   tiers:[{n:'One',p:5,d:1,s:'1 product, up to 150 words'},{n:'Five',p:20,d:2,s:'5 products, consistent voice'},{n:'Ten',p:35,d:2,s:'10 products plus a tone guide for future listings'}] },
 { id:'listing', cat:'copy', name:'Etsy, Amazon or Shopify listing rewrite', blurb:'Titles, bullets and descriptions rewritten around what shoppers search for, with the keywords listed so you can see them.', tags:['Etsy','Amazon','Shopify'],
   tiers:[{n:'One listing',p:10,d:1,s:'Title, bullets, description, keyword list'},{n:'Three listings',p:25,d:2,s:'Three listings with a shared voice'},{n:'Six listings',p:45,d:3,s:'Six listings plus a listing checklist for your team'}] },

 { id:'mascot', cat:'brand', name:'Original mascot character for your brand', blurb:'A studio-rendered character with poses and expressions you can use across social, packaging and your site. Rendered imagery, always disclosed as rendered.', tags:['mascot','character','rendered'],
   tiers:[{n:'Character',p:25,d:2,s:'1 character, 3 poses, transparent PNGs, commercial licence'},{n:'Character set',p:60,d:3,s:'8 poses and expressions, style sheet'},{n:'Brand kit',p:120,d:4,s:'15 images, sticker set, usage guide'}] },
 { id:'scenes', cat:'brand', name:'Product lifestyle scenes from your photo', blurb:'Five studio-rendered scenes that place your product in real-feeling settings, without a photoshoot. Labelled as rendered wherever they are used.', tags:['product imagery','rendered scenes'],
   tiers:[{n:'Five scenes',p:25,d:2,s:'5 scenes from one product photo, 2048px'},{n:'Ten scenes',p:45,d:2,s:'10 scenes, two products'},{n:'Catalog',p:80,d:3,s:'20 scenes, up to four products, social crops included'}] }
];

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let toastTimer;
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200); };
const copy = async (text, ok='Copied') => { try { await navigator.clipboard.writeText(text); toast(ok); } catch { toast('Copy not available here'); } };

/* Theme */
const themeBtn = $('#themeBtn');
const applyTheme = t => { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); };
themeBtn.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const next = cur === 'light' ? 'dark' : 'light';
  applyTheme(next); try { localStorage.setItem('theme', next); } catch {}
});

/* Mobile drawer */
const drawer = $('#drawer'), menuBtn = $('#menuBtn');
const setDrawer = open => { drawer.classList.toggle('open', open); drawer.setAttribute('aria-hidden', String(!open)); menuBtn.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; };
menuBtn.addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));
$$('a', drawer).forEach(a => a.addEventListener('click', () => setDrawer(false)));

/* Marquee */
$('#marquee').innerHTML = [...SERVICES, ...SERVICES].map(s => `<span>${esc(s.name)}</span>`).join('');

/* Services grid + filters */
const grid = $('#serviceGrid'), filters = $('#filters');
let activeCat = 'all';
const renderFilters = () => {
  const cats = [['all','All services'], ...Object.entries(CATS)];
  filters.innerHTML = cats.map(([k,v]) => `<button class="filter" type="button" data-cat="${k}" aria-pressed="${k===activeCat}">${esc(v)}</button>`).join('') + `<span class="count" id="svcCount"></span>`;
  $$('.filter', filters).forEach(b => b.addEventListener('click', () => { activeCat = b.dataset.cat; renderFilters(); renderGrid(); }));
};
const renderGrid = () => {
  const list = SERVICES.filter(s => activeCat === 'all' || s.cat === activeCat);
  grid.innerHTML = list.map(s => `
    <button class="card svc reveal in" type="button" data-id="${s.id}" aria-haspopup="dialog">
      <span class="tag">${esc(CATS[s.cat])}</span>
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.blurb)}</p>
      <div class="chips" style="margin-bottom:14px">${s.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
      <div class="meta"><span class="price">${money(s.tiers[0].p)}<small>from · ${s.tiers[0].d} day${s.tiers[0].d>1?'s':''}</small></span><span class="btn btn-ghost btn-sm">Details</span></div>
    </button>`).join('');
  $('#svcCount').textContent = `${list.length} of ${SERVICES.length}`;
  $$('.svc', grid).forEach(b => b.addEventListener('click', () => openService(b.dataset.id)));
};
renderFilters(); renderGrid();

/* Service dialog */
const dlg = $('#serviceDialog'), dlgBody = $('#serviceDialogBody');
function openService(id) {
  const s = SERVICES.find(x => x.id === id); if (!s) return;
  dlgBody.innerHTML = `
    <header><div><span class="tag" style="font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);font-weight:600">${esc(CATS[s.cat])}</span><h3>${esc(s.name)}</h3></div><button class="icon-btn" type="button" data-close aria-label="Close">✕</button></header>
    <p class="muted">${esc(s.blurb)}</p>
    <div class="tiers">${s.tiers.map(t => `<div class="tier"><b>${esc(t.n)}</b><small>${esc(t.s)}</small><div class="tp">${money(t.p)} · ${t.d} day${t.d>1?'s':''}</div></div>`).join('')}</div>
    <ul><li>Written scope and fixed price before work starts</li><li>Sources or change log delivered with the files</li><li>Revisions included in every tier</li></ul>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" type="button" data-quote="${s.id}">Build a quote for this</button><a class="btn btn-ghost" href="${CONFIG.fiverr}" target="_blank" rel="noopener">Ask on Fiverr ↗</a></div>`;
  $('[data-close]', dlgBody).addEventListener('click', () => dlg.close());
  $('[data-quote]', dlgBody).addEventListener('click', () => { dlg.close(); selectService(s.id); location.hash = '#pricing'; });
  dlg.showModal();
}
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* Estimator */
const qService = $('#qService'), qTiers = $('#qTiers'), qNotes = $('#qNotes');
let qTier = 1;
qService.innerHTML = Object.entries(CATS).map(([k,v]) => `<optgroup label="${esc(v)}">${SERVICES.filter(s => s.cat===k).map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</optgroup>`).join('');
function selectService(id) { qService.value = id; qTier = 1; renderTiers(); calc(); }
function renderTiers() {
  const s = SERVICES.find(x => x.id === qService.value);
  qTiers.innerHTML = s.tiers.map((t,i) => `<button class="tier" type="button" data-i="${i}" aria-pressed="${i===qTier}"><b>${esc(t.n)}</b><small>${esc(t.s)}</small><div class="tp">${money(t.p)} · ${t.d}d</div></button>`).join('');
  $$('.tier', qTiers).forEach(b => b.addEventListener('click', () => { qTier = +b.dataset.i; renderTiers(); calc(); }));
}
function calc() {
  const s = SERVICES.find(x => x.id === qService.value); const t = s.tiers[qTier];
  let total = t.p, days = t.d; const lines = [[`${s.name} · ${t.n}`, money(t.p)]]; const extras = [];
  $$('.addons input:checked').forEach(c => {
    const label = c.parentElement.textContent.replace(/\s+/g,' ').replace(/\+\$?\d+%?/,'').trim();
    if (c.dataset.pct) { const add = t.p * (+c.dataset.pct/100); total += add; days = 1; lines.push([label, '+' + money(add)]); }
    else { total += +c.dataset.amt; lines.push([label, '+' + money(+c.dataset.amt)]); }
    extras.push(label);
  });
  $('#qTotal').innerHTML = `${money(total)} <small>estimate</small>`;
  $('#qDelivery').textContent = `Delivery in about ${days} day${days>1?'s':''} · ${t.n} tier`;
  $('#qLines').innerHTML = lines.map(([k,v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
  const notes = qNotes.value.trim();
  const brief = [`Project request for Taylor Caldwell Studio`, `Service: ${s.name}`, `Tier: ${t.n} (${t.s})`, extras.length ? `Extras: ${extras.join('; ')}` : null, `Estimated total: ${money(total)} · about ${days} day${days>1?'s':''}`, notes ? `Notes: ${notes}` : `Notes: (tell us about your business, the decision this supports, and your deadline)`, `Sent from ${CONFIG.site}`].filter(Boolean).join('\n');
  $('#qBrief').textContent = brief;
  $('#qEmail').href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Quote request: ' + s.name)}&body=${encodeURIComponent(brief)}`;
  return brief;
}
qService.addEventListener('change', () => { qTier = 1; renderTiers(); calc(); });
$$('.addons input').forEach(c => c.addEventListener('change', calc));
qNotes.addEventListener('input', calc);
$('#qCopy').addEventListener('click', () => copy(calc(), 'Brief copied'));
$('#qFiverr').addEventListener('click', () => copy(calc(), 'Brief copied. Paste it into the Fiverr message.'));
renderTiers(); calc();

/* Contact */
const emailLink = $('#emailLink'); emailLink.textContent = CONFIG.email; emailLink.href = `mailto:${CONFIG.email}`;
$('#copyEmail').addEventListener('click', () => copy(CONFIG.email, 'Email address copied'));
$('#shareBtn').addEventListener('click', async () => {
  const data = { title: document.title, text: 'Research, documents and data work, delivered in 24 to 72 hours.', url: CONFIG.site };
  if (navigator.share) { try { await navigator.share(data); } catch {} } else copy(CONFIG.site, 'Link copied');
});
$('#year').textContent = new Date().getFullYear();

/* Clock + availability */
function tick() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: CONFIG.tz, hour: 'numeric', minute: '2-digit', weekday: 'short' });
  $('#clock').textContent = fmt.format(now);
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: CONFIG.tz, hour: 'numeric', hour12: false, weekday: 'short' }).formatToParts(now);
  const hour = +parts.find(p => p.type === 'hour').value % 24;
  const wd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.find(p => p.type === 'weekday').value);
  const open = CONFIG.hours.days.includes(wd) && hour >= CONFIG.hours.open && hour < CONFIG.hours.close;
  $('#statusDot').classList.toggle('off', !open);
  $('#statusText').textContent = open ? 'Studio open now · taking new projects' : 'Taking new projects · replies next business morning';
}
tick(); setInterval(tick, 30000);

/* Scroll spy + reveal */
const links = $$('.nav-links a');
const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));
const rev = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), { threshold: .12 });
$$('.reveal').forEach(el => rev.observe(el));

/* Command palette */
const pal = $('#palette'), palInput = $('#paletteInput'), palList = $('#paletteList');
const ITEMS = [
  ...[['services','Services'],['process','How it works'],['work','Work'],['pricing','Instant quote'],['about','About Taylor'],['faq','FAQ'],['contact','Contact']].map(([id,l]) => ({ label: l, hint: 'Section', run: () => location.hash = '#' + id })),
  ...SERVICES.map(s => ({ label: s.name, hint: CATS[s.cat], run: () => openService(s.id) })),
  { label: 'Open Fiverr profile', hint: 'External', run: () => window.open(CONFIG.fiverr, '_blank', 'noopener') },
  { label: 'Toggle theme', hint: 'Setting', run: () => themeBtn.click() },
  { label: 'Copy email address', hint: 'Contact', run: () => copy(CONFIG.email, 'Email address copied') }
];
let palSel = 0, palHits = ITEMS;
function renderPal() {
  const q = palInput.value.trim().toLowerCase();
  palHits = ITEMS.filter(i => !q || i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q)).slice(0, 12);
  palSel = Math.min(palSel, Math.max(0, palHits.length - 1));
  palList.innerHTML = palHits.map((i,idx) => `<li role="option" aria-selected="${idx===palSel}" data-i="${idx}"><span>${esc(i.label)}</span><small>${esc(i.hint)}</small></li>`).join('') || '<li><small>No matches</small></li>';
  $$('li[data-i]', palList).forEach(li => li.addEventListener('click', () => runPal(+li.dataset.i)));
}
function runPal(i) { const it = palHits[i]; if (!it) return; pal.close(); setTimeout(it.run, 30); }
function openPal() { palInput.value = ''; palSel = 0; renderPal(); pal.showModal(); palInput.focus(); }
$('#paletteBtn').addEventListener('click', openPal);
palInput.addEventListener('input', () => { palSel = 0; renderPal(); });
palInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); palSel = Math.min(palSel+1, palHits.length-1); renderPal(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = Math.max(palSel-1, 0); renderPal(); }
  else if (e.key === 'Enter') { e.preventDefault(); runPal(palSel); }
});
pal.addEventListener('click', e => { if (e.target === pal) pal.close(); });
addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.open ? pal.close() : openPal(); } });

/* Deep link: #service=id */
if (location.hash.startsWith('#service=')) openService(location.hash.slice(9));

/* PWA */
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
