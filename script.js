/* ============================================
   HELENA PAREDES — Personal Web · script.js
   ============================================ */

(function () {
  'use strict';

  /* ── 1. Navbar scroll effect ─────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── 2. Mobile nav toggle ────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── 3. Scroll-reveal (IntersectionObserver) ── */
  const fadeEls = document.querySelectorAll('.fade-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling cards
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => revealObserver.observe(el));

  /* ── 4. Active nav link highlight ───────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchs = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchs.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${id}`
              ? 'var(--purple)'
              : '';
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ── 5. Experience toggles ───────────────── */
  document.querySelectorAll('.exp-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      const panel    = document.getElementById(targetId);
      const isOpen   = panel.classList.toggle('visible');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.querySelector('.chevron').textContent = isOpen ? '▴' : '▾';
    });
  });

  /* ── 6. Animated counter for stats ──────── */
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);

        const el  = entry.target;
        const raw = el.textContent.trim();          // e.g. "+10" "30" "12" "6+"
        const prefix = raw.match(/^[+]/) ? '+' : '';
        const suffix = raw.match(/[+]$/) ? '+' : '';
        const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);

        if (isNaN(target)) return;

        let start = 0;
        const duration = 1200;
        const startTime = performance.now();

        function tick(now) {
          const elapsed  = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out quad
          const eased = 1 - (1 - progress) ** 3;
          const current = Math.round(eased * target);
          el.textContent = `${prefix}${current}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(el => counterObserver.observe(el));

  /* ── 7. Cursor glow (desktop only) ──────── */
  if (!window.matchMedia('(hover: none)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.4s ease;
      top: 0; left: 0;
    `;
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX  = 0, glowY  = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    (function animate() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = `${glowX}px`;
      glow.style.top  = `${glowY}px`;
      requestAnimationFrame(animate);
    })();
  }

  /* ── 8. Smooth scroll polyfill for older browsers ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 9. Project card tilt effect (desktop) ─────── */
  if (!window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });
  }

  /* ── 10. Copy email to clipboard ────────── */
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', e => {
      const email = link.getAttribute('href').replace('mailto:', '');
      if (navigator.clipboard) {
        e.preventDefault();
        navigator.clipboard.writeText(email).then(() => {
          const original = link.innerHTML;
          link.innerHTML = link.innerHTML.replace(/(Email|✉️ Email)/g, '✅ ¡Copiado!');
          setTimeout(() => { link.innerHTML = original; }, 2000);
        }).catch(() => { /* fallback: let default mailto open */ });
      }
    });
  });

  /* ── 11. Page load reveal ────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'translateY(30px)';
      requestAnimationFrame(() => {
        hero.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      });
    }
  });

})();
