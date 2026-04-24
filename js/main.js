/* ================================================
   main.js – Navigation, Suche, Utility
   ================================================ */

// ── Jahr im Footer ──────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Burger-Menü ─────────────────────────────────
const burger  = document.getElementById('burgerBtn');
const nav     = document.getElementById('mainNav');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  burger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
});

// Schließen bei Klick auf Nav-Link (Mobile)
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
  });
});

// ── Aktiver Nav-Link beim Scrollen ───────────────
const sections  = document.querySelectorAll('.category');
const navLinks  = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ── Card-Zähler pro Kategorie ────────────────────
document.querySelectorAll('.cards-grid').forEach(grid => {
  const categoryId = grid.id.replace('grid-', '');
  const countEl    = document.getElementById(`count-${categoryId}`);
  if (countEl) {
    const count = grid.querySelectorAll('.card').length;
    countEl.textContent = `${count} Tool${count !== 1 ? 's' : ''}`;
  }
});

// ── Suche ────────────────────────────────────────
const searchInput = document.getElementById('searchInput');
const noResults   = document.getElementById('noResults');
const searchTerm  = document.getElementById('searchTerm');
const allCards    = document.querySelectorAll('.card');
const allCats     = document.querySelectorAll('.category');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  allCards.forEach(card => {
    const title    = card.dataset.title?.toLowerCase() || '';
    const desc     = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
    const matches  = !query || title.includes(query) || desc.includes(query);
    card.hidden    = !matches;
    if (matches) visibleCount++;
  });

  // Kategorien ausblenden wenn alle Cards verborgen
  allCats.forEach(cat => {
    const gridId   = `grid-${cat.id}`;
    const grid     = document.getElementById(gridId);
    if (!grid) return;
    const visible  = grid.querySelectorAll('.card:not([hidden])').length;
    cat.hidden     = visible === 0 && query.length > 0;
  });

  // Keine-Ergebnisse Meldung
  noResults.hidden  = visibleCount > 0 || !query;
  searchTerm.textContent = searchInput.value.trim();
});

// Suche leeren mit Escape
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
  }
});
