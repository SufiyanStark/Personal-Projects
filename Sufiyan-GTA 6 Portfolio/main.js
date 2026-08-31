/* ============================================================
   CINEMATIC DUAL-SEQUENCE SCROLL ENGINE — FULL TRANSITION (632 FRAMES)
   ------------------------------------------------------------
   - Sequence 1: 224 frames from Create_a_short_cinematic_loopi.MP4 (assets/sequence/frame_XXXX.webp)
     * Plays for Hero, Career, and Projects overlay panels!
   - Sequence 2: 408 frames from Extend_this_video_The_walking.mp4 (assets/sequence2/frame2_XXXX.webp)
     * Starts at frame 225 right at LET'S BUILD TOGETHER!
     * Drives smoothly into the cyan/magenta laser speed tunnel and loops all the way down to footer!
   - Glitch Scanline Transition Effect at frame 224 before Let's Build Together.
   - Clamped 3D Perspective Card Tilt (Subtle ±5° max rotation).
   - Custom Vice City Neon Crosshair Cursor Follower.
   - Lenis drives smooth scroll physics; GSAP ticker synced to Lenis.
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // CONFIGURATION — DUAL SEQUENCE SETTINGS
  // ----------------------------------------------------------
  const SEQ1_COUNT       = 224; // 224 WebP frames in assets/sequence
  const SEQ2_COUNT       = 408; // 408 WebP frames in assets/sequence2
  const TOTAL_BASE_FRAMES = SEQ1_COUNT + SEQ2_COUNT; // 632 frames total

  const LOAD_CONCURRENCY = 8;      // max parallel image loads
  const MAX_DPR          = 1.75;   // cap device pixel ratio for smooth performance

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

  // ----------------------------------------------------------
  // 1. PRELOADER — Bounded Concurrency Queue for 632 Frames
  // ----------------------------------------------------------
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
    // Load Frame 1 FIRST so background is immediately visible
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

  // ----------------------------------------------------------
  // 2. CANVAS SIZING & NATURAL CINEMATIC DRAWING ENGINE
  // ----------------------------------------------------------
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    drawFrame(currentFrameIndex >= 0 ? currentFrameIndex : 0, true);
  }

  // Procedural Vice City Synthwave Fallback Canvas
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

    ctx.strokeStyle = 'rgba(49, 230, 255, 0.35)';
    ctx.lineWidth = Math.max(1, Math.round(dpr));

    const horizonY = ch * 0.58;
    const lines = 18;
    const scrollOffset = (progress * 150) % 30;

    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(cw, horizonY);
    ctx.stroke();

    for (let i = -lines; i <= lines; i++) {
      const xStart = cw / 2 + (i * cw * 0.08);
      ctx.beginPath();
      ctx.moveTo(cw / 2, horizonY);
      ctx.lineTo(xStart, ch);
      ctx.stroke();
    }

    for (let y = horizonY + scrollOffset; y < ch; y += 28 * dpr) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cw, y);
      ctx.stroke();
    }
  }

  // Cover-fit WebP Frame Draw with Dual Sequence Transition Routing
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
        // Loop ONLY high-speed laser streak tunnel frames [121..408]
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

      // Sequence Transition Glitch FX (At frame SEQ1_COUNT right as Sequence 2 starts!)
      if (index >= SEQ1_COUNT - 6 && index <= SEQ1_COUNT + 6) {
        const transProgress = Math.abs(index - SEQ1_COUNT) / 6;
        const flashAlpha = (1 - transProgress) * 0.5;

        // White flash glitch overlay
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, cw, ch);

        // Cyan / Magenta scanline flash
        ctx.fillStyle = `rgba(49, 230, 255, ${flashAlpha * 0.7})`;
        ctx.fillRect(0, ch * 0.38, cw, 7 * dpr);
        ctx.fillStyle = `rgba(255, 47, 158, ${flashAlpha * 0.7})`;
        ctx.fillRect(0, ch * 0.62, cw, 7 * dpr);
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

  // ----------------------------------------------------------
  // 3. LENIS SMOOTH SCROLL DRIVER
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // 4. GSAP SCROLLTRIGGER SCRUB ENGINE FOR ENTIRE DOCUMENT
  // ----------------------------------------------------------
  function initScrollScrub() {
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      drawFrame(TOTAL_BASE_FRAMES - 1, true);
      document.querySelectorAll('.overlay-panel').forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0, position: 'relative' });
      });
      if (pinWrap) pinWrap.style.height = 'auto';
      if (scrubContainer) scrubContainer.style.height = 'auto';
      return;
    }

    const frameProxy = { frame: 0 };
    const MAX_SCRUB_TARGET = TOTAL_BASE_FRAMES - 1; // 631

    // Global ScrollTrigger for background canvas scrub across ENTIRE document height
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

    // Pinned container ScrollTrigger for HTML overlay panels
    ScrollTrigger.create({
      trigger: scrubContainer,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinWrap,
      anticipatePin: 1,
    });

    // ------------------------------------------------------
    // 5. SECONDARY OVERLAY PANEL SCRUB RANGES & STAGGER ANIMATIONS
    // Sequence 1 is 224 frames (~35% of scroll). Sequence 2 starts at frame 225 (~35% progress)!
    // ------------------------------------------------------
    const panelRanges = {
      hero:     [0.00, 0.10], // Sequence 1
      career:   [0.12, 0.24], // Sequence 1
      projects: [0.26, 0.34], // Sequence 1
      outro:    [0.38, 0.65], // Appears right at frame 225 inside Sequence 2 Neon Laser Tunnel!
    };

    Object.entries(panelRanges).forEach(([key, [startPct, endPct]]) => {
      const el = document.querySelector(`[data-panel="${key}"]`);
      if (!el) return;

      const animatedChildren = el.querySelectorAll('[data-animate]');
      
      if (key === 'hero') {
        gsap.set(el, { opacity: 1 });
        if (animatedChildren.length > 0) {
          gsap.set(animatedChildren, { opacity: 1, y: 0, scale: 1 });
        }
      } else {
        gsap.set(el, { opacity: 0 });
        if (animatedChildren.length > 0) {
          gsap.set(animatedChildren, { opacity: 0, y: 25, scale: 0.97 });
        }
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

  // ----------------------------------------------------------
  // 6. CLAMPED 3D PERSPECTIVE CARD TILT (Strict Max ±5° Tilt Angle)
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // 7. CUSTOM VICE CITY NEON CURSOR FOLLOWER
  // ----------------------------------------------------------
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

    const hoverTargets = document.querySelectorAll('a, button, .btn, [data-tilt]');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        cursorRing.style.width = '54px';
        cursorRing.style.height = '54px';
        cursorRing.style.borderColor = 'var(--cyan)';
        cursorRing.style.boxShadow = '0 0 25px var(--cyan)';
      });
      target.addEventListener('mouseleave', () => {
        cursorRing.style.width = '32px';
        cursorRing.style.height = '32px';
        cursorRing.style.borderColor = 'var(--magenta)';
        cursorRing.style.boxShadow = '0 0 15px rgba(255,47,158,0.5)';
      });
    });
  }

  // ----------------------------------------------------------
  // 8. NORMAL-FLOW SECTION REVEALS
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // BOOTSTRAP ENGINE
  // ----------------------------------------------------------
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
