/**
 * portfolio.js — Headless Portfolio Renderer
 * Fetches config.json and dynamically builds every section of the page.
 * To update content, edit config.json only — never touch this file for copy changes.
 */

(function () {
  'use strict';

  /* ─── Helpers ─────────────────────────────────────────────────── */

  /** Render an icon: if value starts with "http" use an <img>, otherwise a <i> */
  function iconEl(icon, label) {
    if (icon && icon.startsWith('http')) {
      return `<img src="${icon}" alt="${label}" class="skill-img-icon" loading="lazy">`;
    }
    return `<i class="${icon}" aria-hidden="true"></i>`;
  }

  /** Badge chip for tech-stack tags */
  function techBadge(tag) {
    return `<span class="tech-badge">${tag}</span>`;
  }

  /* ─── Section Renderers ───────────────────────────────────────── */

  function renderNav(p) {
    const nav = document.getElementById('nav');
    if (!nav) return;
    nav.innerHTML = `
      <a href="#home" class="nav__logo">
        <img src="${p.logo_url}" alt="${p.name}" width="48">
      </a>
      <ul class="nav__list" id="nav-menu">
        <li><a href="#home"         class="nav__link">Home</a></li>
        <li><a href="#pillars"      class="nav__link">Pillars</a></li>
        <li><a href="#skills"       class="nav__link">Skills</a></li>
        <li><a href="#timeline"     class="nav__link">Timeline</a></li>
        <li><a href="#projects"     class="nav__link">Projects</a></li>
        <li><a href="#certs"        class="nav__link">Certs</a></li>
        <li><a href="#blog"         class="nav__link">Blog</a></li>
        <li><a href="#contact"      class="nav__link">Contact</a></li>
      </ul>
      <button class="nav__toggle" id="nav-toggle" aria-label="Toggle menu">
        <i class="fas fa-bars"></i>
      </button>`;
  }

  function renderHero(p) {
    const sec = document.getElementById('home');
    if (!sec) return;
    const { name, target_role, hero_headline, aspiration_statement, avatar_url, resume_url, social } = p;
    sec.innerHTML = `
      <div class="hero__content">
        <p class="hero__eyebrow">Hello, I'm</p>
        <h1 class="hero__name">${name}</h1>
        <h2 class="hero__role">${target_role}</h2>
        <h3 class="hero__headline">${hero_headline}</h3>
        <p class="hero__bio">${aspiration_statement}</p>
        <div class="hero__actions">
          <a href="${resume_url}" target="_blank" rel="noopener" class="btn btn--primary">
            <i class="fas fa-download"></i> Resume
          </a>
          <a href="#projects" class="btn btn--outline">View Projects</a>
        </div>
        <div class="hero__social">
          ${social.linkedin  ? `<a href="${social.linkedin}"  target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
          ${social.github    ? `<a href="${social.github}"    target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>` : ''}
          ${social.medium    ? `<a href="${social.medium}"    target="_blank" rel="noopener" aria-label="Medium"><i class="fab fa-medium"></i></a>` : ''}
          ${social.kaggle    ? `<a href="${social.kaggle}"    target="_blank" rel="noopener" aria-label="Kaggle"><i class="fas fa-database"></i></a>` : ''}
          ${social.twitter   ? `<a href="${social.twitter}"   target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
          ${social.instagram ? `<a href="${social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
        </div>
      </div>
      <div class="hero__image">
        <div class="hero__img-frame">
          <img src="${avatar_url}" alt="${name}" loading="lazy">
        </div>
      </div>`;
  }

  function renderPillars(pillars) {
    const grid = document.getElementById('pillars-grid');
    if (!grid) return;
    grid.innerHTML = pillars.map(p => `
      <div class="bento-card pillar-card" id="${p.id}">
        <div class="pillar-card__icon"><i class="${p.icon}"></i></div>
        <h3 class="pillar-card__title">${p.title}</h3>
        <p class="pillar-card__desc">${p.description}</p>
        <a href="${p.cta_href}" class="pillar-card__cta">${p.cta_label} <i class="fas fa-arrow-right"></i></a>
      </div>`).join('');
  }

  function renderSkills(skills) {
    const renderCategory = (items) =>
      `<ul class="skill-list">${items.map(s => `
        <li class="skill-item">
          <span class="skill-item__icon">${iconEl(s.icon, s.name)}</span>
          <span class="skill-item__name">${s.name}</span>
        </li>`).join('')}
      </ul>`;

    const containers = {
      'skills-engineering': skills.engineering,
      'skills-science':     skills.science,
      'skills-leadership':  skills.leadership,
    };

    Object.entries(containers).forEach(([id, items]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = renderCategory(items);
    });
  }

  function renderTimeline(entries) {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    const typeLabel = { science: 'Research', analytics: 'Analytics', engineering: 'Engineering', target: 'Target Role' };
    container.innerHTML = entries.map((e, i) => `
      <div class="tl-item tl-item--${e.type}" style="--i:${i}">
        <div class="tl-dot"><i class="fas fa-${e.type === 'target' ? 'star' : e.type === 'engineering' ? 'cogs' : e.type === 'analytics' ? 'chart-line' : 'flask'}"></i></div>
        <div class="tl-card">
          <span class="tl-badge tl-badge--${e.type}">${typeLabel[e.type] || e.type}</span>
          <p class="tl-period">${e.period}</p>
          <h4 class="tl-role">${e.role}</h4>
          <p class="tl-org">${e.organisation}</p>
          <p class="tl-desc">${e.description}</p>
        </div>
      </div>`).join('');
  }

  function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Category filter buttons
    const categories = ['all', ...new Set(projects.map(p => p.category))];
    const filterBar = document.getElementById('projects-filter');
    if (filterBar) {
      filterBar.innerHTML = categories.map(c =>
        `<button class="filter-btn ${c === 'all' ? 'filter-btn--active' : ''}" data-cat="${c}">
          ${c.charAt(0).toUpperCase() + c.slice(1)}
        </button>`).join('');

      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
        btn.classList.add('filter-btn--active');
        const cat = btn.dataset.cat;
        grid.querySelectorAll('.project-card').forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
        });
      });
    }

    grid.innerHTML = projects.map(p => `
      <div class="project-card bento-card" data-cat="${p.category}">
        <div class="project-card__img">
          <img src="${p.image_url}" alt="${p.title}" loading="lazy">
          <div class="project-card__overlay">
            <a href="${p.link}" target="_blank" rel="noopener" class="btn btn--sm btn--primary">
              <i class="fab fa-github"></i> Source
            </a>
          </div>
        </div>
        <div class="project-card__body">
          <h4 class="project-card__title">${p.title}</h4>
          <p class="project-card__desc">${p.description}</p>
          <div class="project-card__stack">${p.tech_stack.map(techBadge).join('')}</div>
        </div>
      </div>`).join('');
  }

  function renderCertifications(certs) {
    const grid = document.getElementById('certs-grid');
    if (!grid) return;
    grid.innerHTML = certs.map(c => `
      <a href="${c.link}" target="_blank" rel="noopener" class="cert-card bento-card" title="${c.title}">
        <img src="${c.image_url}" alt="${c.title}" loading="lazy">
        <p class="cert-card__title">${c.title}</p>
      </a>`).join('');
  }

  function renderBlog(posts) {
    const list = document.getElementById('blog-list');
    if (!list) return;
    list.innerHTML = posts.map(p => `
      <article class="blog-card bento-card">
        <div class="blog-card__header">
          <span class="blog-card__status blog-card__status--${p.status.toLowerCase()}">${p.status}</span>
          <span class="blog-card__date">${p.date}</span>
        </div>
        <h4 class="blog-card__title">
          <a href="${p.link}">${p.title}</a>
        </h4>
        <p class="blog-card__summary">${p.summary}</p>
        <div class="blog-card__tags">${p.tags.map(techBadge).join('')}</div>
      </article>`).join('');
  }

  function renderContact(contact, social) {
    const sec = document.getElementById('contact-info');
    if (!sec) return;
    sec.innerHTML = `
      <div class="contact-item">
        <i class="fas fa-envelope"></i>
        <a href="mailto:${contact.email}">${contact.email}</a>
      </div>
      <div class="contact-item">
        <i class="fas fa-phone"></i>
        <span>${contact.phone}</span>
      </div>
      <div class="contact-item">
        <i class="fas fa-map-marker-alt"></i>
        <span>${contact.location}</span>
      </div>
      <div class="hero__social contact-social">
        ${social.linkedin  ? `<a href="${social.linkedin}"  target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
        ${social.github    ? `<a href="${social.github}"    target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>` : ''}
        ${social.medium    ? `<a href="${social.medium}"    target="_blank" rel="noopener" aria-label="Medium"><i class="fab fa-medium"></i></a>` : ''}
      </div>`;
  }

  /* ─── Interactions ────────────────────────────────────────────── */

  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => menu.classList.toggle('nav__list--open'));
      menu.querySelectorAll('.nav__link').forEach(link =>
        link.addEventListener('click', () => menu.classList.remove('nav__list--open')));
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const onScroll = () => {
      const scrollY = window.scrollY;
      sections.forEach(sec => {
        const top = sec.offsetTop - 80;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav__link[href="#${id}"]`);
        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            link.classList.add('nav__link--active');
          } else {
            link.classList.remove('nav__link--active');
          }
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initScrollReveal() {
    if (typeof ScrollReveal === 'undefined') return;
    ScrollReveal({ origin: 'bottom', distance: '40px', duration: 700, delay: 100, reset: false })
      .reveal('.hero__content, .hero__image, .section-title, .bento-card, .tl-item, .blog-card, .cert-card', {
        interval: 80
      });
  }

  /* ─── Bootstrap ───────────────────────────────────────────────── */

  function init(config) {
    renderNav(config.profile);
    renderHero(config.profile);
    renderPillars(config.pillars);
    renderSkills(config.skills);
    renderTimeline(config.timeline);
    renderProjects(config.projects);
    renderCertifications(config.certifications);
    renderBlog(config.blog);
    renderContact(config.contact, config.profile.social);
    initNav();
    initScrollReveal();
  }

  fetch('config.json')
    .then(r => {
      if (!r.ok) throw new Error('Failed to load config.json: ' + r.status);
      return r.json();
    })
    .then(init)
    .catch(err => {
      console.error('[Portfolio] Could not load config.json:', err);
      document.body.insertAdjacentHTML('afterbegin',
        `<div style="background:#c0392b;color:#fff;padding:1rem;text-align:center;">
          ⚠️ Portfolio config not found. Please ensure <code>config.json</code> is in the root directory.
        </div>`);
    });
})();
