/* ════════════════════════════════════════
   FICHA.JS
   · Datos de las 5 películas
   · Carga dinámica por URL param (?film=)
   · Cursor, toggle, progress bar
════════════════════════════════════════ */

/* ─────────────────────────────────────
   DATOS DE PELÍCULAS
   hero: imagen de escena (a añadir en img/ficha/)
   posterClean / posterRage: del catálogo
───────────────────────────────────── */
const FILMS = {

  pearl: {
    title: 'Pearl',
    year: '2022',
    eyebrow: '01 — Furia · Horror',
    posterClean: 'img/catalogo/Pearl.jpg',
    posterRage:  'img/catalogo/rage-mode/pearl-rage.png',
    sinopsis: [
      'Año 1918. Atrapada en una granja con su madre autoritaria y su marido enfermo en el frente, Pearl sueña con convertirse en bailarina y escapar hacia Hollywood. Cuando la oportunidad parece llegar, su ambición se transforma en algo más oscuro.',
      'Ti West construye el origen de uno de los personajes más aterradores del cine reciente con la estética del melodrama clásico de Hollywood. La rabia de Pearl no explota: hierve, se contiene — y cuando finalmente sale, arrasa con todo.'
    ],
    quote: {
      text: '"No aceptaré una vida que no me merezco."',
      note: 'La rabia de Pearl nace de la frustración y la obsesión por ser vista.'
    },
    tecnica: [
      ['Dirección',  'Ti West'],
      ['Guión',      'Ti West, Mia Goth'],
      ['Reparto',    'Mia Goth, David Corenswet, Tandi Wright'],
      ['País',       'Estados Unidos'],
      ['Duración',   '102 min'],
      ['Género',     'Terror · Drama · Precuela'],
    ]
  },

  killbill: {
    title: 'Kill Bill',
    year: '2003',
    eyebrow: '02 — Venganza · Artes Marciales',
    posterClean: 'img/catalogo/killbill.png',
    posterRage:  'img/catalogo/rage-mode/killbill-rage.png',
    sinopsis: [
      'La Novia despierta de un coma de cuatro años. Fue atacada el día de su boda por el asesino Bill y su escuadrón. Ahora tiene una lista. Y una katana.',
      'Tarantino convierte la venganza femenina en mitología. La rabia de La Novia no necesita justificación moral: es pura, estilizada y absolutamente devastadora. Kill Bill es la rabia femenina elevada a género cinematográfico.'
    ],
    quote: {
      text: '"Esa mujer merece su venganza, y nosotros merecemos morir."',
      note: 'Una rabia fría y calculada convertida en venganza.'
    },
    tecnica: [
      ['Dirección',  'Quentin Tarantino'],
      ['Guión',      'Quentin Tarantino'],
      ['Reparto',    'Uma Thurman, Lucy Liu, Vivica A. Fox'],
      ['País',       'Estados Unidos'],
      ['Duración',   '111 min (Vol. 1) · 137 min (Vol. 2)'],
      ['Género',     'Acción · Thriller · Artes marciales'],
    ]
  },

  furiosa: {
    title: 'Furiosa',
    year: '2024',
    eyebrow: '03 — Supervivencia · Acción Postapocalíptica',
    posterClean: 'img/catalogo/furiosa.png',
    posterRage:  'img/catalogo/rage-mode/furiosa-rage.png',
    sinopsis: [
      'Secuestrada de niña del Lugar Verde de las Muchas Madres, Furiosa cae en manos del señor de la guerra Dementus. Durante décadas, sobrevive, planea y espera para recuperar lo que le fue arrebatado.',
      'George Miller construye la rabia como motor de toda una civilización. Furiosa no tiene tiempo para el luto: tiene que sobrevivir primero. Su rabia es estrategia, paciencia, y finalmente, acción implacable.'
    ],
    quote: {
      text: '"Siempre habrá guerra. Pero para volver a casa, Furiosa luchó contra el mundo."',
      note: 'La furia contenida de alguien que sobrevivió solo para ajustar cuentas.'
    },
    tecnica: [
      ['Dirección',  'George Miller'],
      ['Guión',      'George Miller, Nico Lathouris'],
      ['Reparto',    'Anya Taylor-Joy, Chris Hemsworth, Tom Burke'],
      ['País',       'Australia'],
      ['Duración',   '148 min'],
      ['Género',     'Acción · Ciencia ficción · Postapocalíptico'],
    ]
  },

  sweetpea: {
    title: 'Sweetpea',
    year: '2024',
    eyebrow: '04 — Resentimiento · Comedia Negra',
    posterClean: 'img/catalogo/sweetpea.png',
    posterRage:  'img/catalogo/rage-mode/sweetpea-rage.png',
    sinopsis: [
      'Rhiannon es invisible. Nadie la ve, nadie la escucha, nadie la recuerda. Pero Rhiannon tiene pensamientos que nadie imaginaría. Y un día, comienza a actuar sobre ellos.',
      'La serie adapta la novela de CJ Skuse con una protagonista que encarna la rabia acumulada de toda una vida de invisibilidad. Sweetpea pregunta qué ocurre cuando una mujer decide, por fin, dejar de contener lo que siente.'
    ],
    quote: {
      text: '"La gente como tú nunca se fija en la gente como yo"',
      note: 'Rabia silenciosa nacida de años de invisibilidad.'
    },
    tecnica: [
      ['Dirección',  'Varios directores'],
      ['Guión',      'Kirstie Swain (basado en CJ Skuse)'],
      ['Reparto',    'Ella Purnell, Calam Lynch, Laura Haddock'],
      ['País',       'Reino Unido'],
      ['Duración',   '6 episodios × ~50 min'],
      ['Género',     'Thriller · Drama · Dark comedy'],
    ]
  },

  substance: {
    title: 'The Substance',
    year: '2024',
    eyebrow: '05 — Obsesión · Body Horror',
    posterClean: 'img/catalogo/the substance.png',
    posterRage:  'img/catalogo/rage-mode/the substance-rage.png',
    sinopsis: [
      'Una actriz de Hollywood en declive descubre una sustancia que promete crear una versión mejor de sí misma: más joven, más perfecta. Lo que no dice es el precio que hay que pagar.',
      'Coralie Fargeat lleva el body horror a su extremo más político. The Substance es la rabia contra el sistema que devora a las mujeres cuando dejan de ser "útiles" visualmente. Una película que sangra, literalmente, de ira.'
    ],
    quote: {
      text: '"Se debe respetar el equilibrio."',
      note: 'La ira contra el cuerpo, el tiempo y la presión de ser perfecta.'
    },
    tecnica: [
      ['Dirección',  'Coralie Fargeat'],
      ['Guión',      'Coralie Fargeat'],
      ['Reparto',    'Demi Moore, Margaret Qualley, Dennis Quaid'],
      ['País',       'Francia · Reino Unido'],
      ['Duración',   '140 min'],
      ['Género',     'Body horror · Drama · Sátira'],
    ]
  },

  handmaid: {
    title: "The Handmaid's Tale",
    year: '2017',
    eyebrow: '06 — Opresión · Distopía',
    posterClean: 'img/catalogo/handmaid.png',
    posterRage:  'img/catalogo/rage-mode/haindmade-rage.png',
    sinopsis: [
      'En la República de Gilead, un régimen teocrático totalitario ha sometido a las mujeres fértiles a la esclavitud reproductiva. Offred, conocida antes como June, navega entre la obediencia y la resistencia mientras busca a la hija que le arrebataron.',
      'Basada en la novela de Margaret Atwood, la serie convierte la rabia en supervivencia. June no grita: planifica. La rabia femenina aquí es silenciosa, estratégica y absolutamente implacable. Una de las representaciones más poderosas del control del cuerpo femenino como acto político.'
    ],
    quote: {
      text: '"Nolite te bastardes carborundorum."',
      note: 'Una resistencia llena de rabia contenida y supervivencia.'
    },
    tecnica: [
      ['Creación',   'Bruce Miller (basado en Margaret Atwood)'],
      ['Reparto',    'Elisabeth Moss, Joseph Fiennes, Yvonne Strahovski'],
      ['País',       'Estados Unidos'],
      ['Duración',   '5 temporadas'],
      ['Cadena',     'Hulu'],
      ['Género',     'Distopía · Drama · Ciencia ficción'],
    ]
  },

  arcane: {
    title: 'Arcane',
    year: '2021',
    eyebrow: '07 — Caos · Animación',
    posterClean: 'img/catalogo/arcane.png',
    posterRage:  'img/catalogo/rage-mode/arcane-rage.png',
    sinopsis: [
      'En el mundo dividido de Piltover y las Ciudades Bajas, dos hermanas —Vi y Jinx— quedan atrapadas en lados opuestos de una guerra que ellas mismas ayudaron a desencadenar. El poder, la traición y el amor se mezclan en una espiral de destrucción.',
      'Arcane redefine la animación occidental y, con ella, el arquetipo de la rabia femenina. Jinx es la rabia sin contención, fracturada por el abandono. Vi es la rabia que se convierte en fuerza. Dos caras del mismo dolor, ninguna redimida por el sistema.'
    ],
    quote: {
      text: '"Todos nos traicionan, Jinx."',
      note: 'La rabia nace del abandono y la fractura emocional.'
    },
    tecnica: [
      ['Creación',   'Christian Linke, Alex Yee'],
      ['Animación',  'Fortiche Production'],
      ['Reparto',    'Hailee Steinfeld, Ella Purnell, Katie Leung'],
      ['País',       'Francia · Estados Unidos'],
      ['Duración',   '2 temporadas · 18 episodios'],
      ['Plataforma', 'Netflix'],
      ['Género',     'Animación · Fantasía · Drama'],
    ]
  },

  promising: {
    title: 'Promising Young Woman',
    year: '2020',
    eyebrow: '08 — Rabia · Thriller psicológico',
    posterClean: 'img/catalogo/promising.png',
    posterRage:  'img/catalogo/rage-mode/promising-rage.png',
    sinopsis: [
      'Cassie abandonó su carrera en medicina tras el trauma que destruyó la vida de su mejor amiga. De día trabaja en una cafetería; de noche ejecuta una venganza meticulosa contra los hombres que se aprovechan de las mujeres vulnerables.',
      'Emerald Fennell construye un thriller que usa la estética del rosa y el pastel para envolver una rabia absolutamente letal. Promising Young Woman no pide justicia: la exige. Una de las películas más incómodas y necesarias sobre la cultura de la violación.'
    ],
    quote: {
      text: '"Te has preguntado cuál es la peor pesadilla de una mujer?"',
      note: 'Una obsesión alimentada por el dolor y la ira constante.'
    },
    tecnica: [
      ['Dirección',  'Emerald Fennell'],
      ['Guión',      'Emerald Fennell'],
      ['Reparto',    'Carey Mulligan, Bo Burnham, Laverne Cox'],
      ['País',       'Reino Unido · Estados Unidos'],
      ['Duración',   '113 min'],
      ['Género',     'Thriller · Drama · Dark comedy'],
    ]
  }

};


/* ─────────────────────────────────────
   ORDEN Y NAVEGACIÓN ENTRE FILMS
───────────────────────────────────── */
const FILM_ORDER = [
  'pearl', 'killbill', 'furiosa', 'sweetpea', 'substance',
  'handmaid', 'arcane', 'promising'
];

function updateNavigation(id) {
  const idx       = FILM_ORDER.indexOf(id);
  const prevId    = FILM_ORDER[idx - 1] || null;
  const nextId    = FILM_ORDER[idx + 1] || null;
  const prevBtn   = document.getElementById('ficha-prev');
  const nextBtn   = document.getElementById('ficha-next');
  const prevTitle = document.getElementById('prev-title');
  const nextTitle = document.getElementById('next-title');

  if (prevBtn) {
    prevBtn.classList.toggle('vis', !!prevId);
    if (prevTitle) prevTitle.textContent = prevId ? (FILMS[prevId]?.title || '') : '';
    prevBtn.onclick = prevId ? () => navigateTo(prevId) : null;
  }
  if (nextBtn) {
    nextBtn.classList.toggle('vis', !!nextId);
    if (nextTitle) nextTitle.textContent = nextId ? (FILMS[nextId]?.title || '') : '';
    nextBtn.onclick = nextId ? () => navigateTo(nextId) : null;
  }
}

/* Transición suave sin recarga de página */
function navigateTo(id) {
  gsap.to('main', {
    opacity: 0, y: -8, duration: .22, ease: 'power2.in',
    onComplete() {
      history.pushState(null, '', `ficha.html?film=${id}`);
      window.scrollTo(0, 0);
      loadFilm();
      gsap.fromTo('main',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: .32, ease: 'power2.out' }
      );
    }
  });
}


/* ─────────────────────────────────────
   CARGA DEL FILM DESDE URL PARAM
───────────────────────────────────── */
function loadFilm() {
  const id   = new URLSearchParams(window.location.search).get('film');
  const film = FILMS[id];

  if (!film) {
    document.title = 'HISTERIA — Película no encontrada';
    return;
  }

  document.title = `HISTERIA — ${film.title}`;

  /* Eyebrow */
  const eyebrow = document.getElementById('ficha-eyebrow');
  if (eyebrow) eyebrow.textContent = film.eyebrow;

  /* Título */
  const title = document.getElementById('ficha-title');
  if (title) title.textContent = film.title.toUpperCase();

  /* Sinopsis */
  const body = document.getElementById('ficha-body');
  if (body) body.innerHTML = film.sinopsis.map(p => `<p>${p}</p>`).join('');

  /* Quote */
  const quote = document.getElementById('ficha-quote');
  if (quote && film.quote) {
    quote.innerHTML = `${film.quote.text}<cite>→ ${film.quote.note}</cite>`;
  }

  /* Ficha técnica */
  const dl = document.getElementById('ficha-dl');
  if (dl) {
    dl.innerHTML = film.tecnica
      .map(([dt, dd]) => `<dt>${dt}</dt><dd>${dd}</dd>`)
      .join('');
  }

  /* Pósters */
  const pc = document.getElementById('ficha-poster-clean');
  const pr = document.getElementById('ficha-poster-rage');
  if (pc) { pc.src = film.posterClean; pc.alt = `${film.title} — póster`; }
  if (pr) { pr.src = film.posterRage;  pr.alt = `${film.title} — versión rage`; }

  /* Actualizar flechas según posición en el orden */
  updateNavigation(id);
}


/* ─────────────────────────────────────
   CURSOR
───────────────────────────────────── */
const cur = document.getElementById('cur');

document.addEventListener('mousemove', e => {
  gsap.to(cur, { x: e.clientX, y: e.clientY, duration: .1, ease: 'power2.out' });
  if (document.body.classList.contains('rage')) _spray(e.clientX, e.clientY);
});
document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button')) cur.classList.add('big');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest('a, button')) cur.classList.remove('big');
});


/* ─────────────────────────────────────
   RAGE SPRAY
───────────────────────────────────── */
const _SPRAY = ['#D81E5B', '#D4FF00', '#02E1FF', '#454ADE'];
let _si = 0, _st = 0;

function _spray(x, y) {
  const now = performance.now();
  if (now - _st < 40) return;
  _st = now;

  for (let i = 0; i < 3; i++) {
    const el    = document.createElement('div');
    const color = _SPRAY[_si++ % 4];
    const angle = Math.random() * Math.PI * 2;
    const r     = 5 + Math.random() * 10;
    const s     = 2 + Math.random() * 2.5;

    Object.assign(el.style, {
      position: 'fixed', width: s + 'px', height: s + 'px',
      borderRadius: '50%', pointerEvents: 'none', zIndex: '9998',
      background: color, boxShadow: `0 0 ${Math.round(s * 2)}px ${color}`,
      left: (x + Math.cos(angle) * r - s / 2) + 'px',
      top:  (y + Math.sin(angle) * r - s / 2) + 'px',
    });
    document.body.appendChild(el);

    gsap.to(el, {
      opacity: 0,
      x: Math.cos(angle) * (6 + Math.random() * 10),
      y: Math.sin(angle) * (6 + Math.random() * 10),
      scale: 0,
      duration: .3 + Math.random() * .15,
      ease: 'power2.out',
      onComplete() { el.remove(); }
    });
  }
}


/* ─────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────── */
window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
  document.getElementById('prog').style.width = pct + '%';
});


/* ─────────────────────────────────────
   TOGGLE CLEAN ↔ RAGE
   Versión simplificada: sin ScrollTrigger.
   Solo swap de clase + flash.
───────────────────────────────────── */
(function initToggle() {
  const btn  = document.getElementById('toggle-btn');
  const wrap = document.getElementById('toggle-wrap');
  if (!btn) return;

  /* Siempre visible en la ficha (no hay countdown) */
  if (wrap) wrap.classList.add('vis');

  let isRage = false;

  btn.addEventListener('click', () => {
    isRage = !isRage;
    document.body.classList.toggle('clean', !isRage);
    document.body.classList.toggle('rage',   isRage);

    gsap.fromTo('#flash',
      { opacity: .8 },
      { opacity: 0, duration: .5, ease: 'power2.out' }
    );
  });
})();


/* ─────────────────────────────────────
   INIT
───────────────────────────────────── */

/* Evita que el navegador restaure la posición de scroll de la página anterior */
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

loadFilm();

/* Animación de entrada al cargar la página */
gsap.from('main', { opacity: 0, y: 12, duration: .45, ease: 'power2.out', delay: .1 });
