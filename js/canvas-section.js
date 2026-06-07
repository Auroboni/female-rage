/* ════════════════════════════════════════
   CANVAS SECTION
   Interacción final: escribe y rompe palabras
════════════════════════════════════════ */

(function () {
  'use strict';

  const CONFIG = {
    W: 720,
    H: 360,
    CANVAS_PARENT: 'p5-canvas-wrap',
    INPUT_ID: 'canvas-rage-input',
    BTN_ID: 'canvas-send-btn',
    HISTORY_ID: 'canvas-history',
    SPD_ID: 'canvas-spd',
    SPD_VAL_ID: 'canvas-val-spd',
    COL_BTN_CLASS: 'canvas-col-btn',
    HIST_TAG_CLASS: 'canvas-hist-tag',
    SHOW_FADE_IN: 25,
    SHOW_HOLD: 50,
    SHOW_SHAKE: 75,
    SHOW_BREAK: 95,
    HISTORY_DISSOLVE_MS: 3500,
  };
//Las variables que se modifican
  let userCol = '#D81E5B';
  let userSpd = 6;
  let wordHistory = [];

  const sketch = (p) => {
    let shards = [];
    let debris = [];
    let flashes = [];
    let cracks = [];
    let wordCracks = [];

    let phase = 'idle';
    let currentWord = '';
    let showTimer = 0;
    let crackTimer = 0;
    let wordAlpha = 0;

    p.setup = () => {
      const container = document.getElementById(CONFIG.CANVAS_PARENT);
      const w = container ? container.clientWidth : CONFIG.W;
      const h = Math.round(w / 2);

      const cnv = p.createCanvas(w, h);
      cnv.parent(CONFIG.CANVAS_PARENT);
      p.pixelDensity(1);
    };

    p.windowResized = () => {
      if (document.body.classList.contains('clean') || document.body.classList.contains('rage')) {
        const container = document.getElementById(CONFIG.CANVAS_PARENT);
        if (container && container.clientWidth > 0) {
          const w = container.clientWidth;
          const h = Math.round(w / 2);
          p.resizeCanvas(w, h);
        }
      }
    };

    function startWord(txt) {
      phase = 'showing';
      currentWord = txt.toUpperCase();
      showTimer = 0;
      wordAlpha = 0;
      wordCracks = [];
      shards = [];
      debris = [];
      flashes = [];
      cracks = [];
      setInputEnabled(false);
    }

    function startCracking() {
      phase = 'cracking';
      crackTimer = 0;
      const cx = p.width / 2;
      const cy = p.height / 2;
      const n = 6 + Math.floor((userSpd / 10) * 8);

      for (let i = 0; i < n; i++) {
        const angle = p.random(p.TWO_PI);
        const len = p.random(20, 80) * (0.4 + userSpd * 0.07);
        const segs = Math.floor(p.random(2, 4));
        const pts = [{ x: cx + p.random(-60, 60), y: cy + p.random(-20, 20) }];
        let lx = pts[0].x, ly = pts[0].y;

        for (let s = 0; s < segs; s++) {
          const a = angle + p.random(-0.5, 0.5);
          lx += Math.cos(a) * len / segs;
          ly += Math.sin(a) * len / segs;
          pts.push({ x: lx, y: ly });
        }
        wordCracks.push({ pts, life: 255, delay: i * 3 });
      }
    }

    function breakWord() {
      phase = 'breaking';
      const cx = p.width / 2;
      const cy = p.height / 2;
      const col = p.color(userCol);
      const r = p.red(col), g = p.green(col), b = p.blue(col);
      const intensity = userSpd / 10;

      flashes.push({
        x: cx, y: cy, r: 0,
        maxR: 120 + intensity * 80,
        life: 1,
      });

      const nCracks = 6 + Math.floor(intensity * 8);
      for (let i = 0; i < nCracks; i++) {
        const angle = p.random(p.TWO_PI);
        const len = p.random(50, 160) * intensity;
        const segs = Math.floor(p.random(3, 6));
        const pts = [{ x: cx, y: cy }];
        let cx2 = cx, cy2 = cy;

        for (let s = 0; s < segs; s++) {
          const a2 = angle + p.random(-0.4, 0.4);
          cx2 += Math.cos(a2) * len / segs;
          cy2 += Math.sin(a2) * len / segs;
          pts.push({ x: cx2, y: cy2 });
        }
        cracks.push({ pts, life: 255, col: { r, g, b } });
      }

      const nShards = 8 + Math.floor(intensity * 16);
      for (let i = 0; i < nShards; i++) {
        const angle = p.random(p.TWO_PI);
        const spd = p.random(2, 8) * (0.3 + intensity * 0.9);
        const size = p.random(8, 28) * (0.4 + intensity * 0.7);
        const nv = Math.floor(p.random(3, 5));
        const verts = [];

        for (let v = 0; v < nv; v++) {
          const va = (p.TWO_PI / nv) * v + p.random(-0.5, 0.5);
          const vr = size * p.random(0.4, 1);
          verts.push({ x: Math.cos(va) * vr, y: Math.sin(va) * vr });
        }

        shards.push({
          x: cx + p.random(-50, 50),
          y: cy + p.random(-20, 20),
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - p.random(1, 4) * intensity,
          rot: p.random(p.TWO_PI),
          rotV: p.random(-0.12, 0.12) * (0.5 + intensity),
          life: 255,
          decay: p.random(2, 4),
          gravity: p.random(0.06, 0.18),
          verts, r, g, b,
        });
      }

      const nDebris = 60 + Math.floor(intensity * 80);
      for (let i = 0; i < nDebris; i++) {
        const angle = p.random(p.TWO_PI);
        const spd = p.random(0.5, 8) * (0.3 + intensity * 0.9);
        debris.push({
          x: cx + p.random(-40, 40),
          y: cy + p.random(-20, 20),
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - p.random(0, 4) * intensity,
          life: p.random(120, 220),
          decay: p.random(3, 6),
          size: p.random(1, 4),
          gravity: p.random(0.04, 0.16),
          r: p.random() < 0.6 ? r : 255,
          g: p.random() < 0.6 ? g : 255,
          b: p.random() < 0.6 ? b : 255,
        });
      }

      addToHistory(currentWord);
    }

    p.draw = () => {
      p.background(10, 10, 10, 250);

      drawIdleMessage();
      drawWord();
      drawWordCracks();
      drawFlashes();
      drawFinalCracks();
      drawShards();
      drawDebris();
      checkBreakDone();
    };

    function drawIdleMessage() {
      if (phase !== 'idle' || wordHistory.length > 0) return;
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(14);
      p.noStroke();
      p.fill(40);
      p.textFont('Inconsolata, monospace');
      p.text('ESCRIBE LO QUE NO PUEDES DECIR EN VOZ ALTA', p.width / 2, p.height / 2 - 6);
      p.textSize(9);
      p.fill(25);
      p.text('pulsa enter o haz clic en romper', p.width / 2, p.height / 2 + 12);
    }

    function drawWord() {
      if (phase !== 'showing' && phase !== 'cracking') return;

      showTimer++;

      if (showTimer < CONFIG.SHOW_FADE_IN) {
        wordAlpha = Math.min(255, (showTimer / CONFIG.SHOW_FADE_IN) * 255);
      } else {
        wordAlpha = 255;
      }

      if (showTimer === CONFIG.SHOW_HOLD && phase === 'showing') startCracking();
      if (showTimer > CONFIG.SHOW_SHAKE) {
        const shakeMag = (showTimer - CONFIG.SHOW_SHAKE) / 25;
        p.translate(p.random(-1.5, 1.5) * shakeMag, p.random(-0.8, 0.8) * shakeMag);
      }
      if (showTimer >= CONFIG.SHOW_BREAK) {
        breakWord();
        return;
      }

      p.textAlign(p.CENTER, p.CENTER);
      /* Tamaño de fuente responsivo basado en ancho disponible */
      const maxWidth = p.width * 0.85;
      const baseSize = p.map(p.width, 280, 720, 24, 80);
      const fs = Math.max(16, Math.min(baseSize, maxWidth / (currentWord.length * 0.65)));
      p.textSize(fs);
      p.noStroke();
      p.textFont('Boldonse, sans-serif');
      const col = p.color(userCol);
      p.fill(p.red(col), p.green(col), p.blue(col), wordAlpha);
      p.text(currentWord, p.width / 2, p.height / 2);
    }

    function drawWordCracks() {
      if (phase !== 'cracking' && phase !== 'showing') return;

      crackTimer++;
      for (const ck of wordCracks) {
        const elapsed = crackTimer - ck.delay;
        if (elapsed < 0) continue;
        p.stroke(255, 255, 255, Math.min(200, elapsed * 15));
        p.strokeWeight(0.7);
        p.noFill();
        p.beginShape();
        for (const pt of ck.pts) p.vertex(pt.x, pt.y);
        p.endShape();
      }
    }

    function drawFlashes() {
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.r += 14;
        f.life -= 0.08;
        if (f.life <= 0 || f.r > f.maxR) { flashes.splice(i, 1); continue; }

        const col = p.color(userCol);
        p.noStroke();
        p.fill(p.red(col), p.green(col), p.blue(col), f.life * 50);
        p.circle(f.x, f.y, f.r * 2);
        p.fill(255, 255, 255, f.life * 80);
        p.circle(f.x, f.y, f.r * 0.3);
      }
    }

    function drawFinalCracks() {
      for (let i = cracks.length - 1; i >= 0; i--) {
        const ck = cracks[i];
        ck.life -= 2.2;
        if (ck.life <= 0) { cracks.splice(i, 1); continue; }
        p.stroke(ck.col.r, ck.col.g, ck.col.b, ck.life * 0.5);
        p.strokeWeight(1.2);
        p.noFill();
        p.beginShape();
        for (const pt of ck.pts) p.vertex(pt.x, pt.y);
        p.endShape();
      }
    }

    function drawShards() {
      for (let i = shards.length - 1; i >= 0; i--) {
        const s = shards[i];
        s.x += s.vx; s.y += s.vy;
        s.vy += s.gravity; s.vx *= 0.99;
        s.rot += s.rotV;
        s.life -= s.decay;
        if (s.life <= 0) { shards.splice(i, 1); continue; }

        p.push();
        p.translate(s.x, s.y);
        p.rotate(s.rot);
        p.noStroke();

        const a = Math.min(255, s.life);
        p.fill(s.r, s.g, s.b, a);
        p.beginShape();
        for (const v of s.verts) p.vertex(v.x, v.y);
        p.endShape(p.CLOSE);

        p.stroke(255, 255, 255, a * 0.3);
        p.strokeWeight(0.5);
        p.noFill();
        p.beginShape();
        for (const v of s.verts) p.vertex(v.x, v.y);
        p.endShape(p.CLOSE);

        p.pop();
      }
    }

    function drawDebris() {
      for (let i = debris.length - 1; i >= 0; i--) {
        const d = debris[i];
        d.x += d.vx; d.y += d.vy;
        d.vy += d.gravity; d.vx *= 0.98;
        d.life -= d.decay;
        if (d.life <= 0) { debris.splice(i, 1); continue; }
        p.noStroke();
        p.fill(d.r, d.g, d.b, d.life);
        p.circle(d.x, d.y, d.size);
      }
    }

    function checkBreakDone() {
      if (phase === 'breaking' &&
          shards.length === 0 &&
          debris.length === 0 &&
          flashes.length === 0) {
        phase = 'idle';
        setInputEnabled(true);
      }
    }


    p.fireWord = (txt) => {
      if (!txt || !txt.trim()) return;
      startWord(txt.trim());
    };
  };

  function addToHistory(word) {
    wordHistory.push(word);
    const hist = document.getElementById(CONFIG.HISTORY_ID);
    if (!hist) return;
    const tag = document.createElement('div');
    tag.className = CONFIG.HIST_TAG_CLASS;
    tag.textContent = word;
    hist.appendChild(tag);
    setTimeout(() => tag.classList.add('dissolved'), CONFIG.HISTORY_DISSOLVE_MS);
  }

  function setInputEnabled(enabled) {
    const btn = document.getElementById(CONFIG.BTN_ID);
    const inp = document.getElementById(CONFIG.INPUT_ID);
    if (btn) btn.disabled = !enabled;
    if (inp) {
      inp.disabled = !enabled;
      if (enabled) inp.focus();
    }
  }

  function fire(sketchRef) {
    const inp = document.getElementById(CONFIG.INPUT_ID);
    if (!inp || inp.disabled) return;
    const val = inp.value.trim();
    if (!val) return;
    sketchRef.fireWord(val);
    inp.value = '';
  }

  function initSketch() {
    let sketchRef = null;
    new p5((p) => {
      sketch(p);
      sketchRef = p;
    });

    const inp = document.getElementById(CONFIG.INPUT_ID);
    if (inp) {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') fire(sketchRef);
      });
    }

    const btn = document.getElementById(CONFIG.BTN_ID);
    if (btn) {
      btn.addEventListener('click', () => fire(sketchRef));
    }

    const spdSlider = document.getElementById(CONFIG.SPD_ID);
    if (spdSlider) {
      spdSlider.addEventListener('input', function () {
        userSpd = +this.value;
        const valEl = document.getElementById(CONFIG.SPD_VAL_ID);
        if (valEl) valEl.textContent = this.value;
      });
    }

    document.querySelectorAll('.' + CONFIG.COL_BTN_CLASS).forEach((btn) => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.' + CONFIG.COL_BTN_CLASS)
          .forEach((b) => b.classList.remove('active'));
        this.classList.add('active');
        userCol = this.dataset.col;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSketch);
  } else {
    initSketch();
  }

})();
