/* ════════════════════════════════════════
   CATALOGO.JS — Carrusel de películas

   Navegación: drag-to-scroll + arrow 

   ARQUITECTURA:
   - Estado: drag (mousedown/move/up)
   - Scroll: arrows o movimiento manual
   - Validación: detecta drag vs click
   - Navegación: redirige a ficha.html?film=ID
════════════════════════════════════════ */

(function initCatCarousel() {
  const track   = document.getElementById('cat-track');
  const prevBtn = document.getElementById('cat-prev');
  const nextBtn = document.getElementById('cat-next');
  if (!track) return;

  track.scrollLeft = 0;

  /* ESTADO DE DRAG: controla el arrastre del ratón */
  let isDown    = false;   
  let startX    = 0;       
  let scrollRef = 0;       
  let dragDelta = 0;       

  /* ARROWS: actualiza estado (habilitado/deshabilitado) */
  function updateArrows() {
    if (!prevBtn || !nextBtn) return;
    const max = track.scrollWidth - track.clientWidth;
    /* Deshabilita prev si está al inicio, next si está al final */
    prevBtn.disabled = track.scrollLeft <= 1;
    nextBtn.disabled = track.scrollLeft >= max - 1;
  }

  /* SCROLL: avanza/retrocede por item al pulsar arrow
     Calcula tamaño basado en ancho de item + gap */
  function scrollBy(dir) {
    const item   = track.querySelector('.cat-item');
    const gap    = parseFloat(getComputedStyle(track).gap) || 19;
    const amount = item ? (item.offsetWidth + gap) * dir : 230 * dir;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  }

  /* ARROWS */
  if (prevBtn) prevBtn.addEventListener('click', () => scrollBy(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollBy(1));

  track.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();

  /* DRAG */
  track.addEventListener('mousedown', e => {
    isDown    = true;
    dragDelta = 0;
    track.classList.add('is-dragging');  /* Activa estilo visual */
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

  /* MOVIMIENTO: calcula scroll basado en distancia de drag */
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    dragDelta  = Math.abs(walk);
    track.scrollLeft = scrollRef - walk;
  });

  /* CLICK: detecta si fue click real (dragDelta < 6px)
     Si fue click en poster, navega a ficha */
  track.addEventListener('click', e => {
    if (dragDelta > 6) return;  /* Si arrastraste >6px, ignora */
    const item = e.target.closest('.cat-item[data-film]');
    if (!item) return;
    window.location.href = `ficha.html?film=${item.dataset.film}`;
  });
})();
