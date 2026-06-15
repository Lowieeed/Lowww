/* ============================================
   LOWWW — Motion Interactions
   Drop this file into your project and add:
   <script src="motion-interactions.js" defer></script>
   just before </body> in your HTML.
   ============================================ */

/* ─── 1. CUSTOM CURSOR ─────────────────────── */
const dot   = document.createElement('div');
const ring  = document.createElement('div');
dot.id  = 'cursor-dot';
ring.id = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateRing);
})();

// Expand ring on hoverable elements
document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('cursor-expand'));
  el.addEventListener('mouseleave', () => ring.classList.remove('cursor-expand'));
});

/* ─── 2. HERO TEXT REVEAL ───────────────────── */
function splitAndReveal(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const words = el.innerText.split(' ');
  el.innerHTML = words
    .map((w, i) => `<span class="word-wrap"><span class="word" style="transition-delay:${i * 120}ms">${w}</span></span>`)
    .join(' ');
  requestAnimationFrame(() => {
    el.querySelectorAll('.word').forEach(w => w.classList.add('word-visible'));
  });
}

// Trigger after a short delay so page loads first
window.addEventListener('load', () => {
  setTimeout(() => splitAndReveal('h1'), 300);
});

/* ─── 3. SCROLL REVEAL ──────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children
      const children = entry.target.querySelectorAll('[data-reveal-child]');
      if (children.length) {
        children.forEach((child, idx) => {
          setTimeout(() => child.classList.add('revealed'), idx * 100);
        });
      } else {
        entry.target.classList.add('revealed');
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});

/* ─── 4. STICKY NAV BLUR ────────────────────── */
const nav = document.querySelector('nav') || document.querySelector('header');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });
}

/* ─── 5. PROJECT CARD GOLD BORDER DRAW ─────── */
document.querySelectorAll('.project-card, [data-card]').forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('card-hover'));
  card.addEventListener('mouseleave', () => card.classList.remove('card-hover'));
});

/* ─── 6. PAGE TRANSITION (fade between pages) ─ */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  // Only internal page links, not anchors
  if (href && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('http')) {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => window.location.href = href, 400);
    });
  }
});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-exit');
  document.body.classList.add('page-enter');
  setTimeout(() => document.body.classList.remove('page-enter'), 600);
});
