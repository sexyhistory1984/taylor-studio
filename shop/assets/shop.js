/* Taylor Caldwell Studio · Shop. No framework, no build step. Menu, search, filters, product format picker, reveals. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = v => '$' + Number(v).toFixed(2);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------------- menu ---------------- */
  const menuBtn = $('#menuBtn'), drawer = $('#drawer');
  function setMenu(open) {
    if (!drawer || !menuBtn) return;
    drawer.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) { const a = drawer.querySelector('a'); a && a.focus(); } else { menuBtn.focus(); }
  }
  menuBtn && menuBtn.addEventListener('click', () => setMenu(drawer.hidden));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer && !drawer.hidden) setMenu(false); });
  matchMedia('(min-width: 1081px)').addEventListener('change', e => { if (e.matches && drawer && !drawer.hidden) setMenu(false); });

  /* ---------------- search ---------------- */
  const dlg = $('#search'), q = $('#q'), results = $('#searchResults'), hint = $('#searchHint');
  const HINT = hint ? hint.textContent : '';
  let index = null, loading = null;
  const loadIndex = () => index ? Promise.resolve(index) : (loading || (loading = fetch(q.dataset.src).then(r => r.json()).then(d => (index = d)).catch(() => (index = []))));
  function openSearch() {
    if (!dlg || typeof dlg.showModal !== 'function') return;
    if (!dlg.open) dlg.showModal();
    q.value = ''; render([]); hint.hidden = false; hint.textContent = HINT;
    setTimeout(() => q.focus(), 20);
    loadIndex();
  }
  $('#searchBtn') && $('#searchBtn').addEventListener('click', openSearch);
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg && dlg.open ? dlg.close() : openSearch(); }
  });
  dlg && dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  function score(item, terms) {
    const hay = (item.t + ' ' + item.d + ' ' + item.k + ' ' + item.c.join(' ') + ' ' + item.f).toLowerCase();
    let s = 0;
    for (const t of terms) { if (!hay.includes(t)) return 0; s += item.t.toLowerCase().includes(t) ? 3 : 1; }
    return s;
  }
  function render(list) {
    if (!results) return;
    results.innerHTML = list.map(i => `<li><a href="${esc(i.u)}"><img src="${esc(i.i)}" alt="" width="52" height="52" loading="lazy"><span class="sr-t">${esc(i.t)}</span><span class="sr-m">${esc(i.f)} · from ${money(i.p)}</span></a></li>`).join('');
  }
  q && q.addEventListener('input', async () => {
    const terms = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    await loadIndex();
    if (!terms.length) { render([]); hint.hidden = false; hint.textContent = HINT; return; }
    const list = index.map(i => [score(i, terms), i]).filter(x => x[0]).sort((a, b) => b[0] - a[0]).slice(0, 12).map(x => x[1]);
    render(list);
    hint.hidden = list.length > 0;
    if (!list.length) hint.textContent = `No designs match “${q.value.trim()}”. Try a subject like “cat”, “cabin” or “pinup”.`;
  });
  const sform = $('.search-form');
  sform && sform.addEventListener('submit', e => {
    const first = results && results.querySelector('a');
    if (q.value.trim() && first) { e.preventDefault(); location.href = first.href; }
  });

  /* ---------------- toast (envelope confirmation when heading to Redbubble) ---------------- */
  const toast = $('#toast'); let toastT;
  function showToast(html) {
    if (!toast) return;
    toast.innerHTML = html; toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toastT);
    toastT = setTimeout(() => { toast.classList.remove('show'); setTimeout(() => { toast.hidden = true; }, 350); }, 3200);
  }
  const ENV = '<svg class="toast-env" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="12" rx="2"/><path class="flap" d="M3 8l9 6 9-6"/></svg>';
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href*="redbubble.com/i/"], a[href*="redbubble.com/shop/ap/"]');
    if (a) showToast(ENV + '<span>Opening Redbubble to finish your order…</span>');
  });

  /* ---------------- listing filters ---------------- */
  const form = $('#filters');
  if (form) {
    const grid = $('#tiles'), tiles = $$('#tiles > .tile'), count = $('#count'), empty = $('#empty');
    const reset = $('#resetFilters'), emptyReset = $('#emptyReset');
    const KEYS = ['type', 'col', 'price', 'sort'];
    const params = new URLSearchParams(location.search);
    KEYS.forEach(k => { const v = params.get(k); if (v && form.elements[k] && [...form.querySelectorAll(`[name=${k}]`)].some(el => el.value === v || el.tagName === 'SELECT')) form.elements[k].value = v; });
    tiles.forEach(t => {
      t.dataset.fmt0 = t.dataset.fmt;
      t.dataset.price0 = t.dataset.price;
      const prices = {};
      (t.dataset.prices || '').split('|').forEach(s => { const [slug, p, ...l] = s.split(':'); if (slug) prices[slug] = { p: Number(p), l: l.join(':') }; });
      t._prices = prices;
      t._fmt = t.querySelector('.tile-fmt'); t._price = t.querySelector('.tile-price'); t._link = t.querySelector('.tile-link');
      t._fmtText0 = t._fmt.textContent; t._priceText0 = t._price.textContent; t._href0 = t._link.getAttribute('href');
    });
    function setTile(t, slug) {
      const f = slug && t._prices[slug];
      if (f) {
        t._fmt.textContent = f.l; t._price.textContent = 'from ' + money(f.p);
        t._link.setAttribute('href', t._href0.replace(/\?format=.*$/, '') + '?format=' + slug);
        return f.p;
      }
      t._fmt.textContent = t._fmtText0; t._price.textContent = t._priceText0; t._link.setAttribute('href', t._href0);
      return Number(t.dataset.price0);
    }
    function apply(sync) {
      const type = form.elements.type ? form.elements.type.value : '';
      const col = form.elements.col ? form.elements.col.value : '';
      const price = form.elements.price.value, sort = form.elements.sort.value;
      let lo = null, hi = null;
      if (price) { const [a, b] = price.split('-'); lo = a === '' ? null : Number(a); hi = b === '' ? null : Number(b); }
      const typeInput = type ? form.querySelector(`input[name=type][value="${type}"]`) : null;
      const typeFormats = typeInput ? (typeInput.dataset.formats || '').split(' ') : null;
      let shown = 0;
      tiles.forEach(t => {
        const slug = typeFormats ? typeFormats.find(s => t._prices[s]) : null;
        const pr = setTile(t, slug);
        t.dataset.cur = pr;
        const ok = (!type || t.dataset.cats.split(' ').includes(type)) &&
                   (!col || t.dataset.cols.split(' ').includes(col)) &&
                   (lo === null || pr >= lo) && (hi === null || pr < hi);
        t.hidden = !ok; if (ok) shown++;
      });
      const by = {
        asc: (a, b) => a.dataset.cur - b.dataset.cur || a.dataset.order - b.dataset.order,
        desc: (a, b) => b.dataset.cur - a.dataset.cur || a.dataset.order - b.dataset.order,
        new: (a, b) => b.dataset.order - a.dataset.order,
        az: (a, b) => a.dataset.title.localeCompare(b.dataset.title),
        featured: (a, b) => a.dataset.order - b.dataset.order
      }[sort] || ((a, b) => a.dataset.order - b.dataset.order);
      tiles.slice().sort(by).forEach(t => grid.appendChild(t));
      grid.dispatchEvent(new CustomEvent('tiles:changed'));
      count.textContent = `${shown} design${shown === 1 ? '' : 's'}`;
      empty.hidden = shown > 0;
      const active = !!(type || col || price || (sort && sort !== 'featured'));
      reset.hidden = !active;
      if (sync) {
        const u = new URL(location.href);
        KEYS.forEach(k => u.searchParams.delete(k));
        if (type) u.searchParams.set('type', type);
        if (col) u.searchParams.set('col', col);
        if (price) u.searchParams.set('price', price);
        if (sort && sort !== 'featured') u.searchParams.set('sort', sort);
        history.replaceState(null, '', u);
      }
    }
    form.addEventListener('change', () => apply(true));
    form.addEventListener('reset', () => setTimeout(() => apply(true), 0));
    emptyReset && emptyReset.addEventListener('click', () => { form.reset(); });
    apply(false);
  }


  /* ---------------- card deck: one design at a time, swipe or arrow keys, loops ---------------- */
  const deckBar = $('#deckBar'), deckGrid = $('#tiles');
  if (deckBar && deckGrid) {
    const listing = deckGrid.closest('.listing');
    const count = $('#deckCount'), prevBtn = $('#deckPrev'), nextBtn = $('#deckNext');
    let order = [], i = 0, busy = false;
    const visible = () => $$('#tiles > .tile').filter(t => !t.hidden);
    const CLS = ['is-top', 'is-next', 'is-next2', 'is-out', 'to-left', 'to-right', 'is-dragging'];
    function paint() {
      order.forEach(t => { t.classList.remove(...CLS); t.style.transform = ''; });
      const n = order.length;
      if (!n) { count.textContent = '0 of 0'; return; }
      order[i % n].classList.add('is-top');
      if (n > 1) order[(i + 1) % n].classList.add('is-next');
      if (n > 2) order[(i + 2) % n].classList.add('is-next2');
      count.textContent = `${(i % n) + 1} of ${n}`;
      const img = order[(i + 3) % n] && order[(i + 3) % n].querySelector('img');
      if (img && img.loading === 'lazy') img.loading = 'eager';
    }
    function refresh() { order = visible(); i = 0; paint(); }
    function go(dir) {
      const n = order.length; if (n < 2 || busy) return;
      const top = order[i % n];
      if (reduce) { i = (i + dir + n) % n; paint(); return; }
      busy = true;
      top.classList.add('is-out', dir > 0 ? 'to-left' : 'to-right');
      setTimeout(() => { i = (i + dir + n) % n; paint(); busy = false; }, 380);
    }
    nextBtn.addEventListener('click', () => go(1));
    prevBtn.addEventListener('click', () => go(-1));
    document.addEventListener('keydown', e => {
      if (!listing.classList.contains('deck-mode') || e.target.closest('input,select,textarea,dialog')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    // swipe on the top card
    let drag = null;
    deckGrid.addEventListener('pointerdown', e => {
      if (!listing.classList.contains('deck-mode') || busy) return;
      const top = e.target.closest('.tile.is-top'); if (!top) return;
      drag = { top, x0: e.clientX, y0: e.clientY, dx: 0, moved: false, id: e.pointerId };
      top.classList.add('is-dragging'); top.setPointerCapture(e.pointerId);
    });
    deckGrid.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      drag.dx = e.clientX - drag.x0; const dy = e.clientY - drag.y0;
      if (Math.abs(drag.dx) > 6 && Math.abs(drag.dx) > Math.abs(dy)) drag.moved = true;
      if (drag.moved) drag.top.style.transform = `translateX(${drag.dx}px) rotate(${drag.dx / 22}deg)`;
    });
    const endDrag = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const { top, dx, moved } = drag; drag = null;
      top.classList.remove('is-dragging');
      if (moved && Math.abs(dx) > Math.min(110, top.clientWidth * 0.28)) { top.style.transform = ''; go(dx < 0 ? 1 : -1); }
      else top.style.transform = '';
      if (moved) { top._suppress = true; setTimeout(() => { top._suppress = false; }, 300); }
    };
    deckGrid.addEventListener('pointerup', endDrag);
    deckGrid.addEventListener('pointercancel', endDrag);
    deckGrid.addEventListener('click', e => { const t = e.target.closest('.tile'); if (t && t._suppress) e.preventDefault(); }, true);
    deckGrid.addEventListener('dragstart', e => e.preventDefault());
    deckGrid.addEventListener('tiles:changed', () => { if (listing.classList.contains('deck-mode')) refresh(); });
    // view toggle, remembered per device
    function setView(v, save) {
      const deckOn = v !== 'grid';
      listing.classList.toggle('deck-mode', deckOn);
      $$('.vt', deckBar).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === (deckOn ? 'deck' : 'grid'))));
      if (deckOn) refresh(); else order.forEach(t => { t.classList.remove(...CLS); t.style.transform = ''; });
      if (save) { try { localStorage.setItem('shopView', deckOn ? 'deck' : 'grid'); } catch (e) {} }
    }
    $$('.vt', deckBar).forEach(b => b.addEventListener('click', () => setView(b.dataset.view, true)));
    let saved = 'deck'; try { saved = localStorage.getItem('shopView') || 'deck'; } catch (e) {}
    deckBar.hidden = false;
    setView(saved, false);
  }

  /* ---------------- set builder: per-device checklist ---------------- */
  const builder = $('#setBuilder');
  if (builder) {
    const key = builder.dataset.key, boxes = $$('input[type=checkbox]', builder), prog = $('#setProgress');
    let done = []; try { done = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
    const sync = () => {
      boxes.forEach(b => { b.checked = done.includes(b.value); b.closest('li').classList.toggle('is-done', b.checked); });
      prog.textContent = `${done.length} of ${boxes.length} added`;
    };
    builder.addEventListener('change', e => {
      const b = e.target; if (b.type !== 'checkbox') return;
      done = b.checked ? [...new Set([...done, b.value])] : done.filter(v => v !== b.value);
      try { localStorage.setItem(key, JSON.stringify(done)); } catch (e2) {}
      sync();
    });
    sync();
  }

  /* ---------------- product page ---------------- */
  const formats = $('#formats');
  if (formats) {
    const buy = $('#buyBtn'), noun = $('#buyNoun'), priceV = $('#priceValue');
    const radios = $$('input[name=format]', formats);
    const want = new URLSearchParams(location.search).get('format') || location.hash.slice(1);
    const pre = radios.find(r => r.value === want);
    if (pre) pre.checked = true;
    function sync() {
      const r = radios.find(x => x.checked); if (!r) return;
      buy.href = r.dataset.url; noun.textContent = r.dataset.noun; priceV.textContent = r.dataset.price;
      radios.forEach(x => x.closest('.fmt').classList.toggle('is-active', x.checked));
      $$('.detail[data-format]').forEach(d => { d.open = d.dataset.format === r.value; });
    }
    formats.addEventListener('change', sync);
    sync();
    const main = $('#galleryMain'), alt = $('#galleryAlt');
    $$('.thumb').forEach(b => b.addEventListener('click', () => {
      const v = b.dataset.view;
      $$('.thumb').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      main.classList.toggle('show-alt', v === 'alt');
      if (alt) alt.hidden = v !== 'alt';
    }));
  }

  /* ---------------- reveals: CSS transitions driven by IntersectionObserver (GSAP/ScrollTrigger only drives the hero) ---------------- */
  let rev = $$('[data-reveal]');
  // anything already on screen at load is shown at once; only below-the-fold sections animate in
  rev = rev.filter(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * 0.92 && r.bottom > 0) { el.classList.add('in'); return false; } return true; });
  if (rev.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      rev.forEach(el => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
      rev.forEach(el => io.observe(el));
    }
  }
})();
