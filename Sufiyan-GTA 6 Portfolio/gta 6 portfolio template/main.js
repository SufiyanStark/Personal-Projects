/* ============================================================
   CINEMATIC DUAL-SEQUENCE SCROLL ENGINE — TEMPLATE VERSION
   ------------------------------------------------------------
   - Sequence 1: 224 frames from assets/sequence/frame_XXXX.webp
   - Sequence 2: 408 frames from assets/sequence2/frame2_XXXX.webp
   - Clamped 3D Card Tilt, Vice City Crosshair Cursor, Lenis Smooth Scroll.
   ============================================================ */

(function () {
  'use strict';

  const SEQ1_COUNT       = 224;
  const SEQ2_COUNT       = 408;
  const TOTAL_BASE_FRAMES = SEQ1_COUNT + SEQ2_COUNT; // 632 frames total

  const LOAD_CONCURRENCY = 8;
  const MAX_DPR          = 1.75;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas             = document.getElementById('scrollCanvas');
  const ctx                = canvas.getContext('2d', { alpha: false });
  const scrubContainer     = document.getElementById('scrubContainer');
  const pinWrap            = document.getElementById('pinWrap');
  const preloader          = document.getElementById('preloader');
  const preloaderFill      = document.getElementById('preloaderFill');
  const preloaderPct       = document.getElementById('preloaderPct');
  const scrubProgressLabel = document.getElementById('scrubProgressLabel');
  const scrubBarFill       = document.getElementById('scrubBarFill');
  const cursorDot          = document.getElementById('cursorDot');
  const cursorRing         = document.getElementById('cursorRing');

  const framesSeq1 = new Array(SEQ1_COUNT + 1);
  const framesSeq2 = new Array(SEQ2_COUNT + 1);
  let loadedCount = 0;
  let currentFrameIndex = -1;
  let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

  function updatePreloaderUI() {
    const pct = Math.min(100, Math.round((loadedCount / TOTAL_BASE_FRAMES) * 100));
    if (preloaderFill) preloaderFill.style.width = pct + '%';
    if (preloaderPct) preloaderPct.textContent = pct + '%';
  }

  function loadSingleFrame(seqType, frameNumber) {
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (seqType === 1) framesSeq1[frameNumber] = img;
        else framesSeq2[frameNumber] = img;

        loadedCount++;
        updatePreloaderUI();
        if (seqType === 1 && frameNumber === 1) drawFrame(0, true);
        resolve();
      };
      img.onerror = () => {
        loadedCount++;
        updatePreloaderUI();
        resolve();
      };

      if (seqType === 1) {
        img.src = `assets/sequence/frame_${String(frameNumber).padStart(4, '0')}.webp`;
      } else {
        img.src = `assets/sequence2/frame2_${String(frameNumber).padStart(4, '0')}.webp`;
      }
    });
  }

  async function preloadSequence() {
    await loadSingleFrame(1, 1);
    drawFrame(0, true);

    const queue = [];
    for (let i = 2; i <= SEQ1_COUNT; i++) queue.push({ seq: 1, num: i });
    for (let i = 1; i <= SEQ2_COUNT; i++) queue.push({ seq: 2, num: i });

    let cursor = 0;
    async function worker() {
      while (cursor < queue.length) {
        const item = queue[cursor++];
        await loadSingleFrame(item.seq, item.num);
      }
    }

    const workers = Array.from(
      { length: Math.min(LOAD_CONCURRENCY, queue.length) },
      worker
    );
    await Promise.all(workers);
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    drawFrame(currentFrameIndex >= 0 ? currentFrameIndex : 0, true);
  }

  function drawFallbackCanvas(progress) {
    const cw = canvas.width;
    const ch = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, 0, ch);
    grad.addColorStop(0, '#07040f');
    grad.addColorStop(0.5, '#190a2a');
    grad.addColorStop(0.8, '#4a0e35');
    grad.addColorStop(1, '#ff2f9e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    const sunX = cw / 2;
    const sunY = ch * 0.55;
    const sunR = Math.min(cw, ch) * 0.22;
    const sunGrad = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
    sunGrad.addColorStop(0, '#ff9e2f');
    sunGrad.addColorStop(0.5, '#ff2f9e');
    sunGrad.addColorStop(1, '#31e6ff');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFrame(rawIndex, force) {
    let index = Math.max(0, Math.round(rawIndex));
    if (index === currentFrameIndex && !force) return;
    currentFrameIndex = index;

    let img;
    let isSeq2 = false;

    if (index < SEQ1_COUNT) {
      img = framesSeq1[index + 1];
      isSeq2 = false;
    } else {
      isSeq2 = true;
      let seq2Offset = index - SEQ1_COUNT;
      let seq2Frame;
      if (seq2Offset < SEQ2_COUNT) {
        seq2Frame = seq2Offset + 1;
      } else {
        const laserStart = 121;
        const laserEnd = 408;
        const laserRange = laserEnd - laserStart + 1;
        const loopOffset = (seq2Offset - SEQ2_COUNT) % laserRange;
        seq2Frame = laserStart + loopOffset;
      }
      img = framesSeq2[seq2Frame];
    }

    if (img && img.complete && img.naturalWidth > 0) {
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const canvasRatio = cw / ch;
      const imgRatio = iw / ih;

      let sx, sy, sw, sh;
      if (imgRatio > canvasRatio) {
        sh = ih;
        sw = ih * canvasRatio;
        sx = (iw - sw) / 2;
        sy = 0;
      } else {
        sw = iw;
        sh = iw / canvasRatio;
        sx = 0;
        sy = (ih - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);

      if (index >= SEQ1_COUNT - 6 && index <= SEQ1_COUNT + 6) {
        const transProgress = Math.abs(index - SEQ1_COUNT) / 6;
        const flashAlpha = (1 - transProgress) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, cw, ch);
      }
    } else {
      const progress = (index + 1) / TOTAL_BASE_FRAMES;
      drawFallbackCanvas(progress);
    }

    if (scrubProgressLabel) {
      const seqTag = isSeq2 ? ' [LASER TUNNEL]' : ' [OCEAN DRIVE]';
      scrubProgressLabel.textContent =
        'FRAME ' + String(index + 1).padStart(3, '0') + ' / ' + TOTAL_BASE_FRAMES + seqTag;
    }
  }

  function initLenis() {
    if (reduced || typeof Lenis === 'undefined') return null;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  function initScrollScrub() {
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      drawFrame(TOTAL_BASE_FRAMES - 1, true);
      document.querySelectorAll('.overlay-panel').forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0, position: 'relative' });
      });
      return;
    }

    const frameProxy = { frame: 0 };
    const MAX_SCRUB_TARGET = TOTAL_BASE_FRAMES - 1;

    gsap.to(frameProxy, {
      frame: MAX_SCRUB_TARGET,
      ease: 'none',
      onUpdate: () => drawFrame(frameProxy.frame),
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        onUpdate: (self) => {
          if (scrubBarFill) scrubBarFill.style.width = (self.progress * 100).toFixed(1) + '%';
        },
      },
    });

    ScrollTrigger.create({
      trigger: scrubContainer,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinWrap,
      anticipatePin: 1,
    });

    const panelRanges = {
      hero:     [0.00, 0.10],
      career:   [0.12, 0.24],
      projects: [0.26, 0.34],
      outro:    [0.38, 0.65],
    };

    Object.entries(panelRanges).forEach(([key, [startPct, endPct]]) => {
      const el = document.querySelector(`[data-panel="${key}"]`);
      if (!el) return;

      const animatedChildren = el.querySelectorAll('[data-animate]');
      
      if (key === 'hero') {
        gsap.set(el, { opacity: 1 });
      } else {
        gsap.set(el, { opacity: 0 });
      }

      ScrollTrigger.create({
        trigger: scrubContainer,
        start: `${startPct * 100}% top`,
        end: `${endPct * 100}% top`,
        scrub: 0.3,
        onUpdate(self) {
          const p = self.progress;
          const fadeZone = 0.15;
          let opacityVal;
          if (p < fadeZone) opacityVal = p / fadeZone;
          else if (p > 1 - fadeZone) opacityVal = (1 - p) / fadeZone;
          else opacityVal = 1;

          gsap.set(el, { opacity: opacityVal });

          if (animatedChildren.length > 0) {
            animatedChildren.forEach((child, idx) => {
              const childProgress = Math.max(0, Math.min(1, (opacityVal - idx * 0.08) / (1 - idx * 0.08)));
              gsap.set(child, {
                opacity: childProgress,
                y: 25 * (1 - childProgress),
                scale: 0.97 + (0.03 * childProgress)
              });
            });
          }
        },
      });
    });

    ScrollTrigger.refresh();
    window.addEventListener('load', () => ScrollTrigger.refresh());
    window.addEventListener('resize', () => ScrollTrigger.refresh());
  }

  function initInteractiveTilt() {
    if (reduced || window.innerWidth < 992) return;

    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const maxTiltDeg = 5;
        const rawX = (centerY - y) / 25;
        const rawY = (x - centerX) / 40;

        const rotateX = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, rawX));
        const rotateY = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, rawY));

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px) scale3d(1.01, 1.01, 1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
      });
    });
  }

  function initCustomCursor() {
    if (reduced || !cursorDot || !cursorRing || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }, { passive: true });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(renderCursor);
    }
    renderCursor();
  }

  function initSectionReveals() {
    const reveals = document.querySelectorAll('[data-reveal]');
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  async function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    await preloadSequence();

    drawFrame(0, true);
    if (preloader) preloader.classList.add('is-done');

    initLenis();
    initScrollScrub();
    initInteractiveTilt();
    initCustomCursor();
    initSectionReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
