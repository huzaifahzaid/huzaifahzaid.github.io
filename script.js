// ── Year ──────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Header scroll class ───────────────────────────
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────────
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');
navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => mainNav.classList.remove('open')));

// ── Reveal on scroll ──────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Skill bar animations ──────────────────────────
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animated');
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.sb-fill').forEach(el => barObs.observe(el));

// ── Counter animation ─────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const nosuf  = el.dataset.nosuf !== undefined;
  const dur    = 1600;
  const start  = performance.now();

  // special case: static values like 2024
  if (nosuf || target >= 2000) {
    el.textContent = target + (nosuf ? '' : suffix);
    return;
  }

  function step(now) {
    const prog = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    const val  = Math.round(ease * target);
    el.textContent = val + suffix;
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && e.target.dataset.target) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// ── Active nav link on scroll ─────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const link = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (link && !link.classList.contains('nav-cta')) link.style.color = 'var(--cyan)';
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => activeObs.observe(s));

// ── Subtle cursor glow ────────────────────────────
const glow = Object.assign(document.createElement('div'), {});
glow.style.cssText = `
  position:fixed;width:340px;height:340px;border-radius:50%;
  background:radial-gradient(circle,rgba(0,255,200,0.045) 0%,transparent 70%);
  pointer-events:none;z-index:0;
  transform:translate(-50%,-50%);
  transition:left .18s ease,top .18s ease;
  will-change:left,top;
`;
document.body.appendChild(glow);
let mx = -500, my = -500;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  glow.style.left = mx + 'px';
  glow.style.top  = my + 'px';
}, { passive: true });

// ── Card tilt effect ──────────────────────────────
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `translateY(-4px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Smooth scroll for all anchor links ────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});