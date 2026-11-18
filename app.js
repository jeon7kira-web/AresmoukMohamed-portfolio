(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const config = window.PORTFOLIO || { projects: {}, contact: {} };
  const makeEl = (tag, text) => {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
  };
  function webURL(value) {
    if (!value) return null;
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }
  function setLink(el, value) {
    if (!el) return;
    const url = webURL(value);
    el.hidden = !url;
    if (url) el.href = url;
    else el.removeAttribute('href');
  }

  /* Theme */
  const toggle = $('#theme-toggle');
  function setTheme(light) {
    document.body.classList.toggle('light', light);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(light));
      toggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    }
    document.querySelectorAll('.logo-mark img').forEach(img => {
      img.src = light ? 'logo-light.png' : 'logo.png';
    });
    $('meta[name="theme-color"]')?.setAttribute('content', light ? '#8f8aa8' : '#1e1a2d');
  }
  let saved;
  try { saved = localStorage.getItem('theme'); } catch {}
  setTheme(saved === 'light');
  toggle?.addEventListener('click', () => {
    const light = !document.body.classList.contains('light');
    setTheme(light);
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch {}
  });

  /* Responsive menu */
  const menu = $('#menu-toggle');
  const nav = $('#main-nav');
  function closeMenu() {
    menu?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      closeMenu(); menu.focus();
    }
  });
  document.addEventListener('click', e => {
    if (!nav?.contains(e.target) && !menu?.contains(e.target)) closeMenu();
  });
  const desktop = matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', closeMenu);

  /* Contact: no placeholder URLs are exposed. */
  const email = config.contact?.email?.trim();
  const emailLink = $('#contact-email');
  if (emailLink && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailLink.href = `mailto:${email}`;
    emailLink.hidden = false;
    $('#contact-fallback')?.setAttribute('hidden', '');
  }
  setLink($('#contact-linkedin'), config.contact?.linkedin);

  /* Character: pause outside the viewport, while hidden or while a dialog is open. */
  const head = $('.head-layer');
  const wrap = $('.character-wrap');
  const eyes = [...document.querySelectorAll('.eye')]
    .map(el => ({ el, pupil: el.querySelector('b'), x: 0, y: 0 }))
    .filter(e => e.pupil);
  let pointer = null, raf = 0, visible = true, lastTime = 0;
  let hx = 0, hy = 0;
  function canAnimate() {
    return head && wrap && visible && !motion.matches && !document.hidden && !$('#project-dialog')?.open;
  }
  function stopLook() {
    cancelAnimationFrame(raf); raf = 0; lastTime = 0; pointer = null;
    hx = hy = 0;
    if (head) ['--head-x', '--head-y', '--head-roll', '--head-shift'].forEach(p => head.style.removeProperty(p));
    eyes.forEach(e => { e.x = e.y = 0; e.pupil.style.transform = ''; });
  }
  function frame(time) {
    raf = 0;
    if (!canAnimate()) { stopLook(); return; }
    const dt = lastTime ? clamp((time - lastTime) / 16.667, 0.1, 3) : 1;
    lastTime = time;
    const he = 1 - Math.pow(1 - 0.07, dt);
    const ee = 1 - Math.pow(1 - 0.2, dt);
    // Read geometry before writing any transforms.
    const r = wrap.getBoundingClientRect();
    const rects = eyes.map(e => e.el.getBoundingClientRect());
    const tx = pointer ? clamp((pointer.x - r.left - r.width * .5) / (innerWidth * .5), -1, 1) : 0;
    const ty = pointer ? clamp((pointer.y - r.top - r.height * .29) / (innerHeight * .65), -1, 1) : 0;
    hx += (tx - hx) * he; hy += (ty - hy) * he;
    let moving = Math.abs(tx - hx) > .001 || Math.abs(ty - hy) > .001;
    const targets = rects.map(er => {
      if (!pointer) return { x: 0, y: 0 };
      const dx = pointer.x - er.left - er.width / 2;
      const dy = pointer.y - er.top - er.height / 2;
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 220);
      return { x: dx / d * reach, y: dy / d * reach };
    });
    head.style.setProperty('--head-x', `${hx * 8}deg`);
    head.style.setProperty('--head-y', `${-hy * 5}deg`);
    head.style.setProperty('--head-roll', `${hx * 2.5}deg`);
    head.style.setProperty('--head-shift', `${hx * 5}px`);
    eyes.forEach((e, i) => {
      const t = targets[i];
      e.x += (t.x - e.x) * ee; e.y += (t.y - e.y) * ee;
      moving ||= Math.abs(t.x - e.x) > .001 || Math.abs(t.y - e.y) > .001;
      e.pupil.style.transform = `translate(${e.x * 8}%, ${e.y * 4}%)`;
    });
    // Animated CSS transforms can change the character's geometry while visible.
    if (pointer || moving) raf = requestAnimationFrame(frame);
    else lastTime = 0;
  }
  function wake() { if (!raf && canAnimate()) raf = requestAnimationFrame(frame); }
  if (head && wrap) {
    addEventListener('pointermove', e => {
      if (e.pointerType === 'touch' || !canAnimate()) return;
      pointer = { x: e.clientX, y: e.clientY }; wake();
    }, { passive: true });
    root.addEventListener('pointerleave', () => { pointer = null; wake(); });
    addEventListener('blur', stopLook);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopLook(); });
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) stopLook();
    }).observe(wrap);
    motion.addEventListener('change', stopLook);
  }

  /* Scroll scene */
  let scrollFrame = 0;
  function scrollScene() {
    scrollFrame = 0;
    const progress = motion.matches ? 0 : clamp(scrollY / (innerWidth < 600 ? 500 : 450), 0, 1);
    root.style.setProperty('--scroll', progress);
    [['.character-note', 1], ['.tag-hello', 1], ['.tag-code', .8]].forEach(([s, fade]) => {
      const el = $(s); if (el) el.style.opacity = 1 - progress * fade;
    });
    wake();
  }
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(scrollScene);
  }, { passive: true });
  addEventListener('resize', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(scrollScene);
  }, { passive: true });
  motion.addEventListener('change', scrollScene);
  scrollScene();

  /* Project details and optional media */
  const dialog = $('#project-dialog');
  if (!dialog) return;
  const gallery = $('#modal-gallery');
  const video = $('#modal-video');
  let opener = null;
  function resetVideo() {
    video.pause(); video.removeAttribute('src'); video.removeAttribute('poster'); video.load();
  }
  function openProject(card) {
    const p = config.projects?.[card.dataset.project];
    if (!p || dialog.open) return;
    opener = card;
    $('#modal-title').textContent = p.title;
    $('#modal-description').textContent = p.description;
    $('#modal-features').replaceChildren(...(p.features || []).map(t => makeEl('li', t)));
    $('#modal-stack').replaceChildren(...(p.stack || []).map(t => makeEl('span', t)));
    const screenshots = p.screenshots || [];
    gallery.replaceChildren(...screenshots.map(shot => {
      const figure = document.createElement('figure');
      const a = document.createElement('a');
      a.href = shot.src; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', `${shot.alt || p.title}: open full image in a new tab`);
      const img = document.createElement('img');
      img.src = shot.src; img.alt = shot.alt || `${p.title} screenshot`; img.loading = 'lazy'; img.decoding = 'async';
      a.append(img); figure.append(a, makeEl('figcaption', img.alt));
      return figure;
    }));
    $('#modal-gallery-section').hidden = !screenshots.length;
    $('.gallery-controls').hidden = screenshots.length < 2;
    resetVideo();
    $('#modal-video-section').hidden = !p.demo;
    if (p.demo) { video.src = p.demo; if (p.poster) video.poster = p.poster; video.load(); }
    $('#modal-media').hidden = !screenshots.length && !p.demo;
    setLink($('#modal-live'), p.live);
    setLink($('#modal-repo'), p.repo);
    setLink($('#modal-demo'), p.demoUrl);
    stopLook(); dialog.showModal(); dialog.scrollTop = 0; gallery.scrollLeft = 0;
  }
  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', () => openProject(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card); }
    });
  });
  dialog.querySelectorAll('.close, .close-bottom').forEach(b => b.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => { resetVideo(); opener?.focus(); });
  let backdropDown = false;
  function outside(e) {
    const r = dialog.getBoundingClientRect();
    return e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom);
  }
  dialog.addEventListener('pointerdown', e => { backdropDown = outside(e); });
  dialog.addEventListener('click', e => { if (backdropDown && outside(e)) dialog.close(); backdropDown = false; });
  function moveGallery(direction) {
    const step = gallery.querySelector('figure')?.getBoundingClientRect().width || gallery.clientWidth;
    gallery.scrollBy({ left: direction * (step + 16), behavior: motion.matches ? 'instant' : 'smooth' });
  }
  $('#gallery-prev').addEventListener('click', () => moveGallery(-1));
  $('#gallery-next').addEventListener('click', () => moveGallery(1));
  gallery.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); moveGallery(e.key === 'ArrowLeft' ? -1 : 1); }
  });
})();
