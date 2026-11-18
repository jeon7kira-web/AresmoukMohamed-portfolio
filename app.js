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

    /* Scroll progress bar */
  const bar = document.createElement('div');
  bar.className = 'page-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  const updateBar = () => {
    const h = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? clamp(scrollY / h, 0, 1) : 0})`;
  };
  addEventListener('scroll', updateBar, { passive: true });
  addEventListener('resize', updateBar, { passive: true });
  updateBar();

  /* Active nav link */
  const navLinks = [...document.querySelectorAll('#main-nav a[href^="#"]')];
  const linkById = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
      const a = linkById.get(e.target.id);
      if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'skills', 'work', 'journey', 'certificates', 'contact']
      .forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* Reveal on scroll */
  if (!motion.matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, o) => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      o.unobserve(el);
      setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 900);
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll(
      '.section-heading,.what-list article,.projects .project,.skill-card,.journey-item,.certificate-card,.contact-bottom,.contact-links'
    ).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 3) * 70}ms`;
      io.observe(el);
    });
  }
  /* Project chronology: one unified grid, newest projects first. */
  const projectGrids = [...document.querySelectorAll('#work .projects')];
  if (projectGrids.length) {
    const mainGrid = projectGrids[0];
    const cards = projectGrids.flatMap(grid => [...grid.querySelectorAll(':scope > .project')]);
    cards.sort((a, b) => {
      const pa = config.projects?.[a.dataset.project] || {};
      const pb = config.projects?.[b.dataset.project] || {};
      return (pb.sortDate || '').localeCompare(pa.sortDate || '');
    });
    cards.forEach(card => {
      const p = config.projects?.[card.dataset.project];
      const meta = card.querySelector('.project-meta > div');
      if (p && meta) {
        const date = document.createElement('small');
        date.className = 'project-date';
        date.textContent = [p.period, p.kind].filter(Boolean).join(' · ');
        meta.append(date);
      }
      mainGrid.append(card);
    });
    projectGrids.slice(1).forEach(grid => grid.remove());
    document.querySelectorAll('#work .project-group-title, #work .project-group-copy').forEach((el, i) => {
      if (i > 1) el.remove();
    });
  }

  /* Project details and optional media */
  const dialog = $('#project-dialog');
  if (!dialog) return;
  const gallery = $('#modal-gallery');
  const video = $('#modal-video');
  let opener = null;
  function resetVideo() {
    if (!video) return;
    video.pause();
    video.removeAttribute('src');
    video.removeAttribute('poster');
    video.load();
  }
  function openProject(card) {
    const p = config.projects?.[card.dataset.project];
    if (!p || dialog.open) return;
    opener = card;
    const title = $('#modal-title');
    const description = $('#modal-description');
    const features = $('#modal-features');
    const stack = $('#modal-stack');
    if (!title || !description || !features || !stack || !gallery) return;
    title.textContent = p.title || 'Project';
    description.textContent = p.description || '';
    features.replaceChildren(...(p.features || []).map(t => makeEl('li', t)));
    stack.replaceChildren(...(p.stack || []).map(t => makeEl('span', t)));
    const screenshots = (p.screenshots || []).filter(shot => shot && typeof shot.src === 'string' && shot.src.trim());
    gallery.replaceChildren(...screenshots.map(shot => {
      const figure = document.createElement('figure');
      const a = document.createElement('a');
      a.href = shot.src; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', `${shot.alt || p.title}: open full image in a new tab`);
      const img = document.createElement('img');
      img.src = shot.src; img.alt = shot.alt || `${p.title || 'Project'} screenshot`; img.loading = 'lazy'; img.decoding = 'async';
      img.addEventListener('error', () => figure.remove(), { once: true });
      a.append(img); figure.append(a, makeEl('figcaption', img.alt));
      return figure;
    }));
    $('#modal-gallery-section').hidden = !screenshots.length;
    $('.gallery-controls').hidden = screenshots.length < 2;
    resetVideo();
    $('#modal-video-section').hidden = !p.demo || !video;
    if (p.demo && video) {
      video.src = p.demo;
      if (p.poster) video.poster = p.poster;
      video.load();
    }
    $('#modal-media').hidden = !screenshots.length && !p.demo;
    setLink($('#modal-live'), p.live);
    const off = $('#modal-live-off');
    if (off) {
      off.hidden = !!webURL(p.live) || !p.liveNote;
      off.textContent = p.liveNote || '';
    }
    setLink($('#modal-repo'), p.repo);
    setLink($('#modal-demo'), p.demoUrl);
    stopLook(); dialog.showModal(); dialog.scrollTop = 0; gallery.scrollLeft = 0;
  }
    document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('[data-stop]')) return;
      openProject(card);
    });
    card.addEventListener('keydown', e => {
      if (e.target !== card) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card); }
    });
  });

  /* Card slideshows + action links */
  document.querySelectorAll('[data-project]').forEach(card => {
    const p = config.projects?.[card.dataset.project];
    const art = card.querySelector('.project-art');
    if (!p || !art) return;
    const shots = p.screenshots || [];

    if (shots.length) {
      const slider = document.createElement('div');
      slider.className = 'card-slider';
      const slides = shots.map((s, k) => {
        const img = document.createElement('img');
        img.src = s.src; img.alt = s.alt || `${p.title} screenshot`;
        img.loading = k ? 'lazy' : 'eager'; img.decoding = 'async';
        img.addEventListener('error', () => img.remove(), { once: true });
        if (!k) img.className = 'on';
        slider.append(img);
        return img;
      });
      let i = 0, hold = false;
      const go = n => {
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle('on', k === i));
      };
      if (slides.length > 1) {
        [['prev', '←', -1], ['next', '→', 1]].forEach(([cls, label, d]) => {
          const b = document.createElement('button');
          b.type = 'button'; b.className = `slider-btn ${cls}`; b.textContent = label;
          b.dataset.stop = ''; b.setAttribute('aria-label', d < 0 ? 'Previous picture' : 'Next picture');
          b.addEventListener('click', () => go(i + d));
          slider.append(b);
        });
        if (!motion.matches) {
          setInterval(() => { if (!hold && !document.hidden && !dialog.open) go(i + 1); }, 3500);
        }
        card.addEventListener('pointerenter', () => hold = true);
        card.addEventListener('pointerleave', () => hold = false);
        card.addEventListener('focusin', () => hold = true);
        card.addEventListener('focusout', () => hold = false);
      }
      art.append(slider);
    }

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const url = webURL(p.live);
    if (url) {
      const a = document.createElement('a');
      a.className = 'card-link'; a.href = url; a.target = '_blank';
      a.rel = 'noopener noreferrer'; a.dataset.stop = '';
      a.textContent = 'Visit the project ↗';
      actions.append(a);
    }
    if (shots.length) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'card-link'; b.dataset.stop = '';
      b.textContent = 'See the pics ↓';
      b.addEventListener('click', () => {
        openProject(card);
        requestAnimationFrame(() => $('#modal-gallery-section')?.scrollIntoView({ block: 'start' }));
      });
      actions.append(b);
    }
    card.append(actions);
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
    gallery.scrollBy({ left: direction * (step + 16), behavior: motion.matches ? 'auto' : 'smooth' });
  }
  $('#gallery-prev').addEventListener('click', () => moveGallery(-1));
  $('#gallery-next').addEventListener('click', () => moveGallery(1));
  gallery.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); moveGallery(e.key === 'ArrowLeft' ? -1 : 1); }
  });
})();
