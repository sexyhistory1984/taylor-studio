/* Taylor Caldwell Studio · studio home. No framework, no build step.
   Menu, studio-wide search, services, estimator, contact form, notes feed, clock, reveals, service worker. */
(() => {
  'use strict';
  const CONFIG = {
    email: 'tarthwell@gmail.com',
    fiverr: 'https://www.fiverr.com/trade_upp',
    tz: 'America/New_York',
    hours: { days: [1, 2, 3, 4, 5, 6], open: 9, close: 18 },
    site: 'https://taylor.famemaker.app/',
    // Introduction video: set provider ('youtube' or 'vimeo') and the video id to show the play button.
    video: { provider: 'youtube', id: '' },
    // Privacy-friendly analytics: Cloudflare Web Analytics beacon token (no cookies, no personal data). Empty = off.
    cfBeacon: '',
    // Contact form endpoint (Formspree, Web3Forms, a Worker…). Empty = the form opens the visitor's mail app.
    formEndpoint: ''
  };

  const CATS = {
    research: 'Research & intelligence',
    docs: 'Documents & policies',
    data: 'Spreadsheets & automation',
    copy: 'Store & marketplace copy',
    brand: 'Brand & visuals'
  };

  const SERVICES = [
    { id: 'brief', cat: 'research', name: 'Market & competitor research brief', blurb: 'A decision-ready brief built only from public, checkable sources: competitor profiles, comparison table, SWOT and next steps.', tags: ['market research', 'competitors', 'SWOT'],
      tiers: [{ n: 'Snapshot', p: 25, d: 2, s: '3 competitors, 2-page summary, sources linked' }, { n: 'Competitor Brief', p: 60, d: 2, s: '5 competitors, pricing table, SWOT, 2 revisions' }, { n: 'Full Market Brief', p: 120, d: 3, s: '8 competitors, market sizing from public data, positioning recommendations, exec summary' }] },
    { id: 'table', cat: 'research', name: 'Competitor analysis table in 48 hours', blurb: 'A clean spreadsheet of pricing, features, target customer, positioning and channels, each cell linked to its source.', tags: ['competitor table', 'pricing', '48h'],
      tiers: [{ n: 'Five', p: 25, d: 2, s: '5 competitors, 8 columns, source links' }, { n: 'Ten', p: 45, d: 2, s: '10 competitors plus a gaps-and-opportunities note' }, { n: 'Fifteen', p: 75, d: 3, s: '15 competitors, summary page, 3 revisions' }] },
    { id: 'vendor', cat: 'research', name: 'Vendor & tool comparison', blurb: 'Side-by-side comparison of software, vendors or suppliers with a recommendation weighted to your requirements.', tags: ['vendor comparison', 'software selection'],
      tiers: [{ n: 'Shortlist', p: 80, d: 2, s: 'Up to 5 options: pricing tiers, features, limits, support, review signals' }, { n: 'Scored', p: 140, d: 3, s: 'Up to 10 options with a weighted scoring matrix you can edit' }, { n: 'Board-ready', p: 220, d: 4, s: 'Scored comparison plus a one-page recommendation memo' }] },
    { id: 'resale', cat: 'research', name: 'What is it worth? Resale value check', blurb: 'Real recent sold prices for a used item, with a realistic listing price, best channel and condition notes.', tags: ['resale', 'eBay sold prices', 'valuation'],
      tiers: [{ n: 'One item', p: 10, d: 1, s: '1 item, 10+ sold comparables, price range' }, { n: 'Five items', p: 25, d: 1, s: '5 items in one sheet with recommended channels' }, { n: 'Inventory', p: 45, d: 2, s: 'Up to 15 items, prioritised by expected return' }] },
    { id: 'sop', cat: 'docs', name: 'SOP, proposal or policy drafting', blurb: 'Turn rough notes into a structured, ready-to-use document: procedures with roles and checklists, client proposals, internal policies.', tags: ['SOP', 'proposal', 'policy'],
      tiers: [{ n: 'One Document', p: 30, d: 2, s: '1 document up to 3 pages, 1 revision' }, { n: 'Document + Polish', p: 70, d: 3, s: '1 document up to 8 pages, formatted template, 2 revisions' }, { n: 'Document Pack', p: 140, d: 4, s: 'Up to 3 related documents, 15 pages, editable template, 3 revisions' }] },
    { id: 'sop-pack', cat: 'docs', name: 'SOP & onboarding template pack', blurb: 'Twelve editable templates to document how your business runs and onboard staff consistently. Word and Google Docs.', tags: ['templates', 'onboarding', 'instant'],
      tiers: [{ n: 'Pack', p: 19, d: 1, s: '12 templates: SOP master, register, process map, pre-boarding, day 1 to 90, 30/60/90 form and more' }, { n: 'Pack + Fit', p: 49, d: 2, s: 'Pack customised with your business name, roles and three of your own procedures' }, { n: 'Pack + Workshop', p: 99, d: 3, s: 'Customised pack plus a 45-minute walkthrough call' }] },
    { id: 'dd', cat: 'docs', name: 'Due-diligence memo before you buy a website, SaaS or newsletter', blurb: 'Red flags, traffic and revenue sanity checks, valuation range and payback period, written for a buyer who has to decide this week.', tags: ['due diligence', 'acquisition', 'memo'],
      tiers: [{ n: 'Red-flag memo', p: 40, d: 2, s: '1 listing, 12-point red-flag check, verdict' }, { n: 'Valuation memo', p: 75, d: 2, s: 'Adds valuation range, payback and seller questions' }, { n: 'Full memo', p: 150, d: 3, s: 'Two listings compared, negotiation points, 3 revisions' }] },
    { id: 'redflag', cat: 'docs', name: 'Flippa or Acquire listing red-flag check', blurb: 'A fast, honest read of a marketplace listing before you spend time or money on it.', tags: ['Flippa', 'Acquire', 'red flags'],
      tiers: [{ n: 'One listing', p: 25, d: 1, s: '12-point check with a clear pass, caution or walk-away verdict' }, { n: 'Three listings', p: 60, d: 2, s: 'Three listings ranked against each other' }, { n: 'Deal flow', p: 110, d: 3, s: 'Up to six listings per week for one week' }] },
    { id: 'acq', cat: 'docs', name: 'Acquisition memo: valuation, red flags & payback in 48 hours', blurb: 'For buyers of small digital businesses: the memo you would want from an analyst, at a price a solo buyer can justify.', tags: ['valuation', 'payback', '48h'],
      tiers: [{ n: 'Memo', p: 75, d: 2, s: 'Valuation range, payback, 10 red flags, sources' }, { n: 'Memo + Model', p: 150, d: 3, s: 'Adds an editable payback and sensitivity spreadsheet' }, { n: 'Memo + Call', p: 220, d: 3, s: 'Adds a 30-minute walkthrough call' }] },
    { id: 'clean', cat: 'data', name: 'Spreadsheet cleanup & report', blurb: 'Duplicates removed, dates, numbers and names standardised, suspicious values flagged (never silently deleted), plus pivots, charts and a findings report.', tags: ['Excel', 'Google Sheets', 'report'],
      tiers: [{ n: 'Quick Clean', p: 20, d: 1, s: '1 sheet, up to 1,000 rows, change log' }, { n: 'Clean + Summary', p: 50, d: 2, s: 'Up to 3 sheets or 5,000 rows, summary pivot' }, { n: 'Clean + Report', p: 100, d: 3, s: 'Up to 5 sheets or 10,000 rows, pivots, charts, 1-page report' }] },
    { id: 'crm', cat: 'data', name: 'CRM contact list dedupe & standardise', blurb: 'Merge duplicates, standardise names, phones, emails and addresses, flag invalid rows, and hand back an import-ready file with a change log.', tags: ['CRM', 'dedupe', 'import-ready'],
      tiers: [{ n: 'Up to 5,000 rows', p: 40, d: 1, s: 'Dedupe, standardise, flag, change log' }, { n: 'Up to 20,000 rows', p: 90, d: 2, s: 'Adds merge rules you approve first' }, { n: 'Up to 50,000 rows', p: 180, d: 3, s: 'Adds field mapping to your CRM import template' }] },
    { id: 'csv', cat: 'data', name: 'CSV clean & convert script', blurb: 'A reusable script that turns your bank, Shopify or CRM export into the exact import file another system wants, every time.', tags: ['CSV', 'script', 'automation'],
      tiers: [{ n: 'One mapping', p: 20, d: 1, s: '1 source to 1 target, documented, runs on Mac or Windows' }, { n: 'Three mappings', p: 45, d: 2, s: 'Three conversions with validation rules' }, { n: 'Pipeline', p: 90, d: 3, s: 'Scheduled run, error report, 3 revisions' }] },
    { id: 'macro', cat: 'data', name: 'Google Sheets Apps Script or Excel macro', blurb: 'Automate the task you do every Monday: reports, reminders, formatting, imports, reconciliations.', tags: ['Apps Script', 'VBA', 'automation'],
      tiers: [{ n: 'One task', p: 25, d: 2, s: '1 script or macro, commented, with instructions' }, { n: 'Workflow', p: 60, d: 3, s: 'Up to 3 connected tasks, menu button, error handling' }, { n: 'Dashboard', p: 120, d: 4, s: 'Workflow plus an auto-refreshing dashboard sheet' }] },
    { id: 'template', cat: 'data', name: 'Custom Google Sheets or Notion template', blurb: 'A tracker, CRM, budget or project board designed around how you actually work, with formulas and views set up.', tags: ['Sheets', 'Notion', 'template'],
      tiers: [{ n: 'Starter', p: 15, d: 1, s: '1 tab or database, formulas and formatting' }, { n: 'System', p: 40, d: 2, s: 'Up to 4 linked tabs or databases, dashboard view' }, { n: 'Studio build', p: 85, d: 3, s: 'Full workspace with instructions video' }] },
    { id: 'desc', cat: 'copy', name: 'Product descriptions for your online store', blurb: 'Clear, persuasive descriptions that answer the buyer\'s questions and read well on mobile.', tags: ['product copy', 'ecommerce'],
      tiers: [{ n: 'One', p: 5, d: 1, s: '1 product, up to 150 words' }, { n: 'Five', p: 20, d: 2, s: '5 products, consistent voice' }, { n: 'Ten', p: 35, d: 2, s: '10 products plus a tone guide for future listings' }] },
    { id: 'listing', cat: 'copy', name: 'Etsy, Amazon or Shopify listing rewrite', blurb: 'Titles, bullets and descriptions rewritten around what shoppers search for, with the keywords listed so you can see them.', tags: ['Etsy', 'Amazon', 'Shopify'],
      tiers: [{ n: 'One listing', p: 10, d: 1, s: 'Title, bullets, description, keyword list' }, { n: 'Three listings', p: 25, d: 2, s: 'Three listings with a shared voice' }, { n: 'Six listings', p: 45, d: 3, s: 'Six listings plus a listing checklist for your team' }] },
    { id: 'mascot', cat: 'brand', name: 'Original mascot character for your brand', blurb: 'A character with poses and expressions you can use across social, packaging and your site. Drafted with AI image tools, finished by the studio, always disclosed as rendered.', tags: ['mascot', 'character', 'rendered'],
      tiers: [{ n: 'Character', p: 25, d: 2, s: '1 character, 3 poses, transparent PNGs, commercial licence' }, { n: 'Character set', p: 60, d: 3, s: '8 poses and expressions, style sheet' }, { n: 'Brand kit', p: 120, d: 4, s: '15 images, sticker set, usage guide' }] },
    { id: 'scenes', cat: 'brand', name: 'Product lifestyle scenes from your photo', blurb: 'Five rendered scenes that place your product in real-feeling settings, without a photoshoot. Made with AI image tools and labelled as rendered wherever they are used.', tags: ['product imagery', 'rendered scenes'],
      tiers: [{ n: 'Five scenes', p: 25, d: 2, s: '5 scenes from one product photo, 2048px' }, { n: 'Ten scenes', p: 45, d: 2, s: '10 scenes, two products' }, { n: 'Catalog', p: 80, d: 3, s: '20 scenes, up to four products, social crops included' }] }
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const days = d => `${d} day${d > 1 ? 's' : ''}`;

  /* ---------------- toast ---------------- */
  const toastEl = $('#toast'); let toastT;
  const ENV = '<svg class="toast-env" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="12" rx="2"/><path class="flap" d="M3 8l9 6 9-6"/></svg>';
  function toast(msg, envelope) {
    if (!toastEl) return;
    toastEl.innerHTML = (envelope ? ENV : '') + '<span>' + esc(msg) + '</span>'; toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastT);
    toastT = setTimeout(() => { toastEl.classList.remove('show'); setTimeout(() => { toastEl.hidden = true; }, 350); }, 3000);
  }
  const copy = async (text, ok = 'Copied') => { try { await navigator.clipboard.writeText(text); toast(ok); } catch { toast('Copy is not available here'); } };

  /* ---------------- menu ---------------- */
  const menuBtn = $('#menuBtn'), drawer = $('#drawer');
  function setMenu(open) {
    if (!drawer || !menuBtn) return;
    drawer.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) { const a = drawer.querySelector('a'); a && a.focus(); } else { menuBtn.focus({ preventScroll: true }); }
  }
  menuBtn && menuBtn.addEventListener('click', () => setMenu(drawer.hidden));
  drawer && $$('a', drawer).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer && !drawer.hidden) setMenu(false); });
  matchMedia('(min-width: 1181px)').addEventListener('change', e => { if (e.matches && drawer && !drawer.hidden) setMenu(false); });

  /* ---------------- marquee ---------------- */
  const mq = $('#marquee');
  if (mq) mq.innerHTML = [...SERVICES, ...SERVICES].map(s => `<span>${esc(s.name)}</span>`).join('');

  /* ---------------- services grid + filters ---------------- */
  const grid = $('#serviceGrid'), filters = $('#filters');
  let activeCat = 'all';
  function renderFilters() {
    const cats = [['all', 'All services'], ...Object.entries(CATS)];
    filters.innerHTML = cats.map(([k, v]) => `<button class="filter" type="button" data-cat="${k}" aria-pressed="${k === activeCat}">${esc(v)}</button>`).join('') + '<span class="count" id="svcCount"></span>';
    $$('.filter', filters).forEach(b => b.addEventListener('click', () => { activeCat = b.dataset.cat; renderFilters(); renderGrid(); }));
  }
  function renderGrid() {
    const list = SERVICES.filter(s => activeCat === 'all' || s.cat === activeCat);
    grid.innerHTML = list.map(s => `
      <button class="card svc" type="button" data-id="${s.id}" aria-haspopup="dialog">
        <span class="tag">${esc(CATS[s.cat])}</span>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.blurb)}</p>
        <div class="chips">${s.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        <div class="meta"><span class="price-tag">${money(s.tiers[0].p)}<small>from · ${days(s.tiers[0].d)}</small></span><span class="btn btn-ghost btn-sm">Details</span></div>
      </button>`).join('');
    $('#svcCount').textContent = `${list.length} of ${SERVICES.length}`;
    $$('.svc', grid).forEach(b => b.addEventListener('click', () => openService(b.dataset.id)));
  }
  if (grid && filters) { renderFilters(); renderGrid(); }

  /* ---------------- service dialog ---------------- */
  const dlg = $('#serviceDialog'), dlgBody = $('#serviceDialogBody');
  function openService(id) {
    const s = SERVICES.find(x => x.id === id); if (!s || !dlg) return;
    dlgBody.innerHTML = `
      <header><div><span class="tag">${esc(CATS[s.cat])}</span><h3>${esc(s.name)}</h3></div><button class="icon-btn" type="button" data-close aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></header>
      <p class="muted">${esc(s.blurb)}</p>
      <div class="tiers">${s.tiers.map(t => `<div class="tier"><b>${esc(t.n)}</b><small>${esc(t.s)}</small><div class="tp">${money(t.p)} · ${days(t.d)}</div></div>`).join('')}</div>
      <ul><li>Written scope and fixed price before work starts</li><li>Drafted by our team with AI assistance, checked by a person</li><li>Sources or change log delivered with the files</li><li>Revisions included in every tier</li></ul>
      <div class="ctas"><button class="btn btn-cherry" type="button" data-quote="${s.id}">Build a quote for this</button><a class="btn btn-ghost" href="${CONFIG.fiverr}" target="_blank" rel="noopener">Ask on Fiverr ↗</a></div>`;
    $('[data-close]', dlgBody).addEventListener('click', () => dlg.close());
    $('[data-quote]', dlgBody).addEventListener('click', () => { dlg.close(); selectService(s.id); location.hash = '#pricing'; });
    dlg.showModal();
  }
  dlg && dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

  /* ---------------- estimator ---------------- */
  const qService = $('#qService'), qTiers = $('#qTiers'), qNotes = $('#qNotes');
  let qTier = 1;
  const svcOptions = Object.entries(CATS).map(([k, v]) => `<optgroup label="${esc(v)}">${SERVICES.filter(s => s.cat === k).map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</optgroup>`).join('');
  if (qService) qService.innerHTML = svcOptions;
  function selectService(id) { if (!qService) return; qService.value = id; qTier = 1; renderTiers(); calc(); }
  function renderTiers() {
    const s = SERVICES.find(x => x.id === qService.value);
    qTiers.innerHTML = s.tiers.map((t, i) => `<button class="tier" type="button" data-i="${i}" aria-pressed="${i === qTier}"><b>${esc(t.n)}</b><small>${esc(t.s)}</small><div class="tp">${money(t.p)} · ${t.d}d</div></button>`).join('');
    $$('.tier', qTiers).forEach(b => b.addEventListener('click', () => { qTier = +b.dataset.i; renderTiers(); calc(); }));
  }
  function calc() {
    const s = SERVICES.find(x => x.id === qService.value); const t = s.tiers[qTier];
    let total = t.p, d = t.d; const lines = [[`${s.name} · ${t.n}`, money(t.p)]]; const extras = [];
    $$('.addons input:checked').forEach(c => {
      const label = c.parentElement.textContent.replace(/\s+/g, ' ').replace(/\+\$?\d+%?/, '').trim();
      if (c.dataset.pct) { const add = t.p * (+c.dataset.pct / 100); total += add; d = 1; lines.push([label, '+' + money(add)]); }
      else { total += +c.dataset.amt; lines.push([label, '+' + money(+c.dataset.amt)]); }
      extras.push(label);
    });
    $('#qTotal').innerHTML = `${money(total)} <small>estimate</small>`;
    $('#qDelivery').textContent = `Delivery in about ${days(d)} · ${t.n} tier`;
    $('#qLines').innerHTML = lines.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
    const notes = qNotes.value.trim();
    const brief = ['Project request for Taylor Caldwell Studio', `Service: ${s.name}`, `Tier: ${t.n} (${t.s})`, extras.length ? `Extras: ${extras.join('; ')}` : null, `Estimated total: ${money(total)} · about ${days(d)}`, notes ? `Notes: ${notes}` : 'Notes: (tell us about your business, the decision this supports, and your deadline)', `Sent from ${CONFIG.site}`].filter(Boolean).join('\n');
    $('#qBrief').textContent = brief;
    $('#qEmail').href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Quote request: ' + s.name)}&body=${encodeURIComponent(brief)}`;
    return brief;
  }
  if (qService) {
    qService.addEventListener('change', () => { qTier = 1; renderTiers(); calc(); });
    $$('.addons input').forEach(c => c.addEventListener('change', calc));
    qNotes.addEventListener('input', calc);
    $('#qCopy').addEventListener('click', () => copy(calc(), 'Brief copied'));
    $('#qFiverr').addEventListener('click', () => { copy(calc(), 'Brief copied. Paste it into the Fiverr message.'); });
    renderTiers(); calc();
  }

  /* ---------------- contact ---------------- */
  const emailLink = $('#emailLink');
  if (emailLink) { emailLink.textContent = CONFIG.email; emailLink.href = `mailto:${CONFIG.email}`; }
  $('#copyEmail') && $('#copyEmail').addEventListener('click', () => copy(CONFIG.email, 'Email address copied'));
  $('#shareBtn') && $('#shareBtn').addEventListener('click', async () => {
    const data = { title: document.title, text: 'Research, documents and data work, delivered in 24 to 72 hours.', url: CONFIG.site };
    if (navigator.share) { try { await navigator.share(data); } catch { /* cancelled */ } } else copy(CONFIG.site, 'Link copied');
  });
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = $('#contactForm');
  if (form) {
    const need = $('#cNeed');
    need.innerHTML = '<option value="Not sure yet, tell me what fits">Not sure yet</option>' + svcOptions + '<optgroup label="Other"><option>Something not listed</option><option>A retainer or ongoing work</option></optgroup>';
    const endpoint = CONFIG.formEndpoint || form.dataset.endpoint;
    const hint = $('#cHint');
    if (endpoint && hint) hint.textContent = 'Sent straight to the studio. We reply within one business day.';
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if ($('#cWeb').value) return; // honeypot
      const f = new FormData(form);
      const name = String(f.get('name') || '').trim(), email = String(f.get('email') || '').trim(), msg = String(f.get('message') || '').trim();
      if (!name || !email || !msg || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast('Please add your name, a valid email and a few words about the project.'); return; }
      const body = ['Project enquiry for Taylor Caldwell Studio', `Name: ${name}`, `Email: ${email}`, `Need: ${f.get('need')}`, `Budget: ${f.get('budget')}`, '', msg, '', `Sent from ${CONFIG.site}`].join('\n');
      const btn = $('#cSend');
      if (endpoint) {
        btn.disabled = true;
        try {
          const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name, email, need: f.get('need'), budget: f.get('budget'), message: msg, subject: `Studio enquiry from ${name}` }) });
          if (!r.ok) throw new Error(String(r.status));
          form.reset(); toast('Sent. We reply within one business day.', true);
        } catch { toast('Sending failed. Opening your mail app instead.'); location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Studio enquiry from ' + name)}&body=${encodeURIComponent(body)}`; }
        finally { btn.disabled = false; }
      } else {
        location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Studio enquiry from ' + name)}&body=${encodeURIComponent(body)}`;
        toast('Opening your mail app with the message ready to send.', true);
      }
    });
  }

  /* ---------------- clock + availability ---------------- */
  function tick() {
    const clock = $('#clock'); if (!clock) return;
    const now = new Date();
    clock.textContent = new Intl.DateTimeFormat('en-US', { timeZone: CONFIG.tz, hour: 'numeric', minute: '2-digit', weekday: 'short' }).format(now);
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: CONFIG.tz, hour: 'numeric', hour12: false, weekday: 'short' }).formatToParts(now);
    const hour = +parts.find(p => p.type === 'hour').value % 24;
    const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.find(p => p.type === 'weekday').value);
    const open = CONFIG.hours.days.includes(wd) && hour >= CONFIG.hours.open && hour < CONFIG.hours.close;
    $('#statusDot') && $('#statusDot').classList.toggle('off', !open);
    $('#statusText') && ($('#statusText').textContent = open ? 'Studio open now · taking new projects' : 'Taking new projects · replies next business morning');
  }
  tick(); setInterval(tick, 30000);

  /* ---------------- intro video (loads only when the visitor presses play) ---------------- */
  const video = $('#video');
  if (video && CONFIG.video.id) {
    const play = $('#playBtn'); play.hidden = false; $('#videoNote').hidden = true;
    play.addEventListener('click', () => {
      const src = CONFIG.video.provider === 'vimeo'
        ? `https://player.vimeo.com/video/${encodeURIComponent(CONFIG.video.id)}?autoplay=1&dnt=1`
        : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(CONFIG.video.id)}?autoplay=1&rel=0`;
      const f = document.createElement('iframe'); f.src = src; f.title = 'Introduction video'; f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true;
      video.appendChild(f); play.remove();
    });
  }

  /* ---------------- notes feed (articles published on the Offers pages) ---------------- */
  const NOTE_RE = /^(why|how|what|when|\d+ (things|questions|checks|ways)|five|ten|a )\b/i;
  const isNote = e => NOTE_RE.test(String(e.title || '').trim());
  let offers = null;
  const loadOffers = () => offers ? Promise.resolve(offers) : fetch('/offers/offers.json', { cache: 'no-cache' }).then(r => r.json()).then(d => (offers = Array.isArray(d) ? d : [])).catch(() => (offers = []));
  const notesGrid = $('#notesGrid');
  if (notesGrid) loadOffers().then(list => {
    const notes = list.filter(isNote).sort((a, b) => String(b.updated).localeCompare(String(a.updated))).slice(0, 6);
    if (!notes.length) { notesGrid.innerHTML = '<li class="note"><a href="/offers/"><h3>Notes are on the Offers page</h3><p>Short reads on research, documents and data, published alongside the offers they belong to.</p><span class="link-arrow">Open offers</span></a></li>'; return; }
    notesGrid.innerHTML = notes.map(n => `<li class="note" data-reveal><a href="/offers/${esc(n.slug)}/"><p class="eyebrow" style="margin:0">Note</p><h3>${esc(n.title)}</h3><p>${esc(n.summary || '')}</p><span class="link-arrow">Read</span></a></li>`).join('');
    reveal();
  });

  /* ---------------- studio-wide search (services, offers, notes, shop designs, sections) ---------------- */
  const sdlg = $('#search'), q = $('#q'), results = $('#searchResults'), hint = $('#searchHint');
  const HINT = hint ? hint.textContent : '';
  const SECTIONS = [['services', 'Services'], ['process', 'How it works'], ['work', 'Work'], ['pricing', 'Instant quote'], ['intro', 'Meet Taylor'], ['about', 'About Taylor'], ['notes', 'Notes'], ['faq', 'FAQ'], ['contact', 'Contact']];
  let index = null, loading = null, sel = 0, hits = [];
  function buildIndex() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    const base = [
      ...SECTIONS.map(([id, l]) => ({ k: 'Section', t: l, m: 'On this page', u: '#' + id, s: l })),
      ...SERVICES.map(s => ({ k: 'Service', t: s.name, m: `from ${money(s.tiers[0].p)}`, run: () => openService(s.id), s: `${s.name} ${s.blurb} ${s.tags.join(' ')} ${CATS[s.cat]}` })),
      { k: 'Link', t: 'Order on Fiverr', m: 'External', u: CONFIG.fiverr, ext: true, s: 'fiverr order buy' },
      { k: 'Link', t: 'The Shop', m: 'Cards, stickers, prints, tees', u: '/shop/', s: 'shop cards stickers posters prints tees redbubble' },
      { k: 'Link', t: 'All offers', m: 'Fixed-scope packages', u: '/offers/', s: 'offers packages' },
      { k: 'Action', t: 'Copy email address', m: CONFIG.email, run: () => copy(CONFIG.email, 'Email address copied'), s: 'email contact copy' }
    ];
    loading = Promise.all([
      loadOffers(),
      fetch('/shop/products.json').then(r => r.json()).catch(() => [])
    ]).then(([off, prod]) => {
      off.forEach(o => base.push({ k: isNote(o) ? 'Note' : 'Offer', t: o.title, m: isNote(o) ? 'Short read' : o.price, u: `/offers/${o.slug}/`, s: `${o.title} ${o.summary || ''}` }));
      (Array.isArray(prod) ? prod : []).forEach(p => base.push({ k: 'Shop', t: p.t, m: `${p.f} · from $${Number(p.p).toFixed(2)}`, u: p.u, i: p.i, s: `${p.t} ${p.d || ''} ${p.k || ''} ${(p.c || []).join(' ')} ${p.f || ''}` }));
      index = base; return index;
    });
    return loading;
  }
  function score(item, terms) {
    const hay = item.s.toLowerCase(); let sc = 0;
    for (const t of terms) { if (!hay.includes(t)) return 0; sc += item.t.toLowerCase().includes(t) ? 3 : 1; }
    return sc + (item.k === 'Service' ? .5 : 0);
  }
  function renderHits() {
    if (!results) return;
    results.innerHTML = hits.map((h, i) => {
      const inner = `${h.i ? `<img src="${esc(h.i)}" alt="" width="44" height="44" loading="lazy">` : `<span class="sr-k">${esc(h.k.slice(0, 5))}</span>`}<span class="sr-t">${esc(h.t)}</span><span class="sr-m">${esc(h.m)}</span>`;
      return `<li role="option" aria-selected="${i === sel}" data-i="${i}">${h.u ? `<a href="${esc(h.u)}"${h.ext ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>` : `<button type="button">${inner}</button>`}</li>`;
    }).join('');
    $$('li', results).forEach(li => li.addEventListener('click', e => { if (li.querySelector('button')) { e.preventDefault(); run(+li.dataset.i); } else sdlg.close(); }));
  }
  function run(i) { const h = hits[i]; if (!h) return; sdlg.close(); if (h.run) setTimeout(h.run, 30); else if (h.ext) window.open(h.u, '_blank', 'noopener'); else location.href = h.u; }
  function openSearch() {
    if (!sdlg || typeof sdlg.showModal !== 'function') return;
    if (!sdlg.open) sdlg.showModal();
    q.value = ''; hits = []; sel = 0; renderHits(); hint.hidden = false; hint.textContent = HINT;
    setTimeout(() => q.focus(), 20);
    buildIndex();
  }
  $('#searchBtn') && $('#searchBtn').addEventListener('click', openSearch);
  document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); sdlg && sdlg.open ? sdlg.close() : openSearch(); } });
  sdlg && sdlg.addEventListener('click', e => { if (e.target === sdlg) sdlg.close(); });
  q && q.addEventListener('input', async () => {
    const terms = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const idx = await buildIndex();
    if (!terms.length) { hits = []; renderHits(); hint.hidden = false; hint.textContent = HINT; return; }
    hits = idx.map(i => [score(i, terms), i]).filter(x => x[0]).sort((a, b) => b[0] - a[0]).slice(0, 12).map(x => x[1]);
    sel = 0; renderHits();
    hint.hidden = hits.length > 0;
    if (!hits.length) hint.textContent = `Nothing matches “${q.value.trim()}”. Try “brief”, “spreadsheet”, “SOP” or a shop subject like “cabin”.`;
  });
  q && q.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, hits.length - 1); renderHits(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); renderHits(); }
    else if (e.key === 'Enter' && hits.length) { e.preventDefault(); run(sel); }
  });

  /* ---------------- generic kind filters (Offers index) ---------------- */
  $$('[data-filter-group]').forEach(group => {
    const target = $(`[data-filter-target="${group.dataset.filterGroup}"]`); if (!target) return;
    const count = group.querySelector('[data-count]');
    group.addEventListener('click', e => {
      const b = e.target.closest('.filter[data-kind]'); if (!b) return;
      $$('.filter', group).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      let n = 0;
      $$('[data-kind]', target).forEach(li => { const show = b.dataset.kind === 'all' || li.dataset.kind === b.dataset.kind; li.hidden = !show; if (show) n++; });
      if (count) count.textContent = n;
    });
  });

  /* ---------------- scroll spy ---------------- */
  const links = $$('#navLinks a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
  }

  /* ---------------- reveals: CSS transitions driven by IntersectionObserver ---------------- */
  let io;
  function reveal() {
    const els = $$('[data-reveal]:not(.in):not([data-seen])');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    io = io || new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => { el.dataset.seen = '1'; io.observe(el); });
  }
  reveal();

  /* ---------------- deep link: #service=id ---------------- */
  if (location.hash.startsWith('#service=')) openService(location.hash.slice(9));

  /* ---------------- analytics (opt-in, cookieless) ---------------- */
  if (CONFIG.cfBeacon) {
    const s = document.createElement('script'); s.defer = true; s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: CONFIG.cfBeacon })); document.head.appendChild(s);
  }

  /* ---------------- service worker ---------------- */
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(() => {});
})();
