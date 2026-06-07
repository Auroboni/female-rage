/* ════════════════════════════════════════
   CATALOGO.JS
   · Drag-to-scroll en el carrusel
   · Arrow buttons prev / next
   · Click en poster → ficha de película
════════════════════════════════════════ */

(function initCatCarousel() {
  const track   = document.getElementById('cat-track');
  const prevBtn = document.getElementById('cat-prev');
  const nextBtn = document.getElementById('cat-next');
  if (!track) return;

  /* ── Garantizar que empieza desde el inicio ── */
  track.scrollLeft = 0;

  /* ── Estado de drag ── */
  let isDown    = false;
  let startX    = 0;
  let scrollRef = 0;
  let dragDelta = 0;

  /* ── Actualizar estado de arrows según posición ── */
  function updateArrows() {
    if (!prevBtn || !nextBtn) return;
    const max = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft <= 1;
    nextBtn.disabled = track.scrollLeft >= max - 1;
  }

  /* ── Scroll por item al pulsar arrow ── */
  function scrollBy(dir) {
    const item   = track.querySelector('.cat-item');
    const gap    = parseFloat(getComputedStyle(track).gap) || 19;
    const amount = item ? (item.offsetWidth + gap) * dir : 230 * dir;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => scrollBy(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollBy(1));

  track.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows(); /* estado inicial */

  /* ── Drag ── */
  track.addEventListener('mousedown', e => {
    isDown    = true;
    dragDelta = 0;
    track.classList.add('is-dragging');
    startX    = e.pageX - track.offsetLeft;
    scrollRef = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('is-dragging');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('is-dragging');
  });

  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    dragDelta  = Math.abs(walk);
    track.scrollLeft = scrollRef - walk;
  });

  /* ── Click en poster → ficha ── */
  track.addEventListener('click', e => {
    if (dragDelta > 6) return;
    const item = e.target.closest('.cat-item[data-film]');
    if (!item) return;
    window.location.href = `ficha.html?film=${item.dataset.film}`;
  });
})();
