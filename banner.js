/* ============================================================
   Tech Flavor — Bannière Shopify
   Carrousel produit animé (GSAP) — version autonome vanilla JS
   Reproduit fidèlement la version plein écran, adaptée bannière :
   autoplay 6,5 s, pause en arrière-plan, support reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var gsap = window.gsap;

  var CHIP_POS = [
    { cls: "left:14%;top:25%",  rot: -4 },
    { cls: "left:6%;top:37%",   rot: -8 },
    { cls: "left:10%;top:50%",  rot: -10 }
  ];
  var BADGE_POS = [
    { cls: "right:7%;top:38%",  size: 44 },
    { cls: "right:9%;top:58%",  size: 36 }
  ];
  var FLOAT_LEFT  = "left:18%;top:60%";
  var FLOAT_RIGHT = "right:10%;top:24%";

  var PRODUCTS = [
    {
      id: "keyboard", wordLines: ["NEON", "KEYS"],
      description: "Hot-swappable mechanical keyboards with per-key RGB, creamy switches and a pro-grade aluminium build.",
      chips: ["Tactile", "Hot-swap", "RGB"], orderLabel: "Order Now →",
      hero: "./tech/hero-keyboard.png", heroTilt: -3,
      colors: { bgBase:"#0B0722", bgGlow:"#31227E", bgDeep:"#060417", word:"#9D6BFF", accent:"#8B5CF6", onAccent:"#150A33", banner:"#7C3AED", bannerText:"#FFFFFF", chipBg:"rgba(19,11,46,0.75)", chipText:"#C4B5FD", badgeBg:"#241354" },
      badges: [ "./tech/acc-keycap.png", "./tech/acc-switch.png" ],
      floatAsset: { img: "./tech/acc-coil-violet.png", pos: FLOAT_LEFT, width: 46, rotation: -12 }
    },
    {
      id: "mouse", wordLines: ["SWIFT", "CLICK"],
      description: "Ultralight wireless mice with a 16K DPI optical sensor, crisp clicks and marathon battery life.",
      chips: ["Lightweight", "16K DPI", "Wireless"], orderLabel: "Order It",
      hero: "./tech/hero-mouse.png", heroTilt: 0,
      colors: { bgBase:"#03151A", bgGlow:"#0B4F61", bgDeep:"#020D11", word:"#2DD4EE", accent:"#22D3EE", onAccent:"#04252C", banner:"#0891B2", bannerText:"#FFFFFF", chipBg:"rgba(4,28,34,0.72)", chipText:"#67E8F9", badgeBg:"#0A3D49" },
      badges: [ "./tech/acc-battery-cyan.png", "./tech/acc-cable-cyan.png" ],
      floatAsset: { img: "./tech/acc-dongle.png", pos: FLOAT_RIGHT, width: 58, rotation: 14 }
    },
    {
      id: "headset", wordLines: ["PURE", "SOUND"],
      description: "Immersive over-ear headsets with active noise cancelling, studio-tuned drivers and plush comfort.",
      chips: ["ANC", "Hi-Res", "40h"], orderLabel: "Contact Us",
      hero: "./tech/hero-headset.png", heroTilt: -3,
      colors: { bgBase:"#1E0508", bgGlow:"#6E1120", bgDeep:"#140203", word:"#FF4757", accent:"#F43F5E", onAccent:"#2E0509", banner:"#E11D48", bannerText:"#FFFFFF", chipBg:"rgba(40,6,10,0.72)", chipText:"#FB7185", badgeBg:"#4C0A14" },
      badges: [ "./tech/acc-jack.png", "./tech/acc-earpad.png" ],
      floatAsset: { img: "./tech/acc-earbud.png", pos: FLOAT_LEFT, width: 42, rotation: -9 }
    },
    {
      id: "controller", wordLines: ["PRO", "GRIP"],
      description: "Pro controllers with Hall Effect sticks, anti-drift precision and tournament-ready hair triggers.",
      chips: ["Hall Effect", "Anti-drift", "Turbo"], orderLabel: "Order It",
      hero: "./tech/hero-controller.png", heroTilt: 0,
      colors: { bgBase:"#061409", bgGlow:"#14532D", bgDeep:"#030D06", word:"#4ADE80", accent:"#22C55E", onAccent:"#052312", banner:"#16A34A", bannerText:"#FFFFFF", chipBg:"rgba(6,26,13,0.72)", chipText:"#86EFAC", badgeBg:"#0B3A1E" },
      badges: [ "./tech/acc-battery-green.png", "./tech/acc-cable-green.png" ],
      floatAsset: { img: "./tech/acc-thumbstick.png", pos: FLOAT_RIGHT, width: 44, rotation: 10 }
    },
    {
      id: "speaker", wordLines: ["BASS", "BOX"],
      description: "Room-filling 360° speakers with deep bass, waterproof shells and all-day playback freedom.",
      chips: ["360° Sound", "Deep Bass", "IPX7"], orderLabel: "Contact Us",
      hero: "./tech/hero-speaker.png", heroTilt: 0,
      colors: { bgBase:"#E8940A", bgGlow:"#FFC22E", bgDeep:"#A96A00", word:"#E8480C", accent:"#EA580C", onAccent:"#3A1400", banner:"#FFB300", bannerText:"#4A2C00", chipBg:"rgba(74,42,2,0.78)", chipText:"#FFD08A", badgeBg:"#4F2C02" },
      badges: [ "./tech/acc-mini-speaker.png", "./tech/acc-led.png" ],
      floatAsset: { img: "./tech/acc-jackcable.png", pos: FLOAT_LEFT, width: 48, rotation: -14 }
    },
    {
      id: "mic", wordLines: ["VOX", "STUDIO"],
      description: "Broadcast-grade USB microphones with cardioid pickup, zero-latency monitoring and crystal clarity.",
      chips: ["Cardioid", "Studio", "24-bit"], orderLabel: "Order Now →",
      hero: "./tech/hero-mic.png", heroTilt: 0,
      colors: { bgBase:"#200726", bgGlow:"#701A63", bgDeep:"#140416", word:"#F472B6", accent:"#EC4899", onAccent:"#33071F", banner:"#DB2777", bannerText:"#FFFFFF", chipBg:"rgba(44,8,34,0.75)", chipText:"#F9A8D4", badgeBg:"#4A0E38" },
      badges: [ "./tech/acc-shockmount.png", "./tech/acc-xlr.png" ],
      floatAsset: { img: "./tech/acc-popfilter.png", pos: FLOAT_RIGHT, width: 46, rotation: 8 }
    }
  ];

  var COUNT = PRODUCTS.length;
  var AUTOPLAY_DELAY = 6500;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- État ---------- */
  var layers = [0, 1];            // produit affiché par slot
  var current = 0;                // index produit courant
  var activeProduct = 0;
  var activeSlot = 0;
  var isTransitioning = false;
  var pending = null;             // { dir, target }
  var queuedDir = 0;
  var dir = 1;
  var displayProduct = PRODUCTS[0];

  var floatTweens = [];
  var transitionTl = null;

  /* ---------- DOM ---------- */
  var barBg = document.querySelector(".tf-bar-bg");
  var barSlide = document.querySelector(".tf-bar-slide");
  var barText = document.querySelector(".tf-bar-text");
  var ctaBtn = document.querySelector(".tf-cta");
  var ctaLabel = document.querySelector(".tf-cta-label");
  var descEl = document.querySelector(".tf-desc");
  var btnMenu = document.querySelector(".tf-btn-menu");
  var btnFind = document.querySelector(".tf-btn-find");
  var stage = document.querySelector(".tf-stage");
  var layerEls = [
    document.querySelector('.tf-layer[data-slot="0"]'),
    document.querySelector('.tf-layer[data-slot="1"]')
  ];
  var arrowPrev = document.querySelector(".tf-arrow-prev");
  var arrowNext = document.querySelector(".tf-arrow-next");

  descEl.innerHTML = '<span></span>';
  var descSpan = descEl.querySelector("span");

  /* ---------- Construction d'une couche ---------- */
  function el(tag, className, style) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (style) e.setAttribute("style", style);
    return e;
  }

  function applyPos(elm, posStr) {
    // "left:18%;top:60%" -> style positions
    posStr.split(";").forEach(function (p) {
      var kv = p.split(":");
      elm.style[kv[0].trim()] = kv[1].trim();
    });
  }

  function buildLayerFull(container, product) {
    while (container.firstChild) container.removeChild(container.firstChild);
    var c = product.colors;
    var refs = { chips: [], badges: [], wordLines: [] };

    /* Fond */
    refs.bg = el("div", "tf-bg");
    refs.bg.style.background =
      "radial-gradient(ellipse 62% 56% at 50% 46%, " + c.bgGlow + " 0%, transparent 72%), " +
      "radial-gradient(ellipse 120% 110% at 50% 50%, transparent 55%, " + c.bgDeep + " 100%), " +
      "linear-gradient(180deg, " + c.bgBase + " 0%, " + c.bgDeep + " 100%)";
    container.appendChild(refs.bg);

    /* Mot géant */
    refs.word = el("div", "tf-word");
    product.wordLines.forEach(function (line) {
      var s = el("span");
      s.textContent = line;
      s.style.color = c.word;
      refs.word.appendChild(s);
      refs.wordLines.push(s);
    });
    container.appendChild(refs.word);

    /* Élément flottant libre */
    refs.free = el("div", "tf-free");
    applyPos(refs.free, product.floatAsset.pos);
    refs.free.style.width = product.floatAsset.width + "px";
    var freeImg = el("img");
    freeImg.src = product.floatAsset.img;
    freeImg.alt = "";
    freeImg.draggable = false;
    freeImg.style.transform = "rotate(" + product.floatAsset.rotation + "deg)";
    refs.free.appendChild(freeImg);
    container.appendChild(refs.free);

    /* Badges */
    product.badges.forEach(function (src, i) {
      var b = el("div", "tf-badge");
      applyPos(b, BADGE_POS[i].cls);
      b.style.width = BADGE_POS[i].size + "px";
      b.style.height = BADGE_POS[i].size + "px";
      var inner = el("div", "tf-badge-inner");
      inner.style.background = c.badgeBg;
      inner.style.borderColor = c.accent;
      var img = el("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      inner.appendChild(img);
      b.appendChild(inner);
      container.appendChild(b);
      refs.badges.push(b);
    });

    /* Produit principal */
    refs.hero = el("div", "tf-hero");
    var heroImg = el("img");
    heroImg.src = product.hero;
    heroImg.alt = product.wordLines.join(" ");
    heroImg.draggable = false;
    heroImg.style.transform = "rotate(" + product.heroTilt + "deg)";
    refs.hero.appendChild(heroImg);
    refs.shadow = el("div", "tf-shadow");
    refs.hero.appendChild(refs.shadow);
    container.appendChild(refs.hero);

    /* Chips */
    product.chips.forEach(function (chip, i) {
      var w = el("div", "tf-chip");
      applyPos(w, CHIP_POS[i].cls);
      var inner = el("div", "tf-chip-inner");
      inner.textContent = chip;
      inner.style.transform = "rotate(" + CHIP_POS[i].rot + "deg)";
      inner.style.background = c.chipBg;
      inner.style.borderColor = c.accent;
      inner.style.color = c.chipText;
      inner.style.boxShadow = "0 10px 24px rgba(0,0,0,0.35), 0 0 22px " + c.accent + "33";
      w.appendChild(inner);
      container.appendChild(w);
      refs.chips.push(w);
    });

    return refs;
  }

  var layerRefs = [null, null];

  /* ---------- Utilitaires GSAP ---------- */
  function positional(r) {
    return r.chips.concat(r.badges, [r.free]).filter(Boolean);
  }
  function allTargets(r) {
    return [r.bg, r.word, r.hero, r.shadow].concat(positional(r)).filter(Boolean);
  }

  function getCenter() {
    var rect = stage.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.46
    };
  }

  function offsetToCenter(elm) {
    var r = elm.getBoundingClientRect();
    var c = getCenter();
    return { x: c.x - (r.left + r.width / 2), y: c.y - (r.top + r.height / 2) };
  }

  function resetLayer(r) {
    gsap.set(r.bg, { opacity: 0, x: 0, xPercent: 0, scale: 1, zIndex: 0, boxShadow: "none" });
    gsap.set(r.word, { opacity: 0, x: 0, scale: 1, zIndex: 10 });
    gsap.set(r.hero, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1 });
    gsap.set(r.shadow, { opacity: 0, scale: 1 });
    gsap.set(positional(r), { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1 });
  }

  function killAllFloats() {
    floatTweens.forEach(function (t) { t.kill(); });
    floatTweens = [];
  }

  function startFloats() {
    killAllFloats();
    if (reduced) return;
    var r = layerRefs[activeSlot];
    if (!r) return;

    r.chips.forEach(function (chip, i) {
      if (chip) floatTweens.push(gsap.to(chip, { y: "+=3", rotation: "+=1", duration: 4 + i * 0.6, delay: i * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    });
    r.badges.forEach(function (badge, i) {
      if (badge) floatTweens.push(gsap.to(badge, { y: "+=4", rotation: "+=1.2", duration: 4.5 + i * 0.8, delay: 0.3 + i * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    });
    if (r.free) floatTweens.push(gsap.to(r.free, { y: "+=4", rotation: "+=1.2", duration: 5.5, delay: 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    if (r.hero) floatTweens.push(gsap.to(r.hero, { y: "+=2", duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 }));
  }

  /* ---------- Bandeau + CTA ---------- */
  function applyChromeInstant() {
    barBg.style.background = displayProduct.colors.banner;
    barText.style.color = displayProduct.colors.bannerText;
    ctaBtn.style.background = displayProduct.colors.accent;
    ctaBtn.style.color = displayProduct.colors.onAccent;
    ctaLabel.textContent = displayProduct.orderLabel;
    btnMenu.style.background = displayProduct.colors.accent;
    btnMenu.style.color = displayProduct.colors.onAccent;
  }

  function animateChrome(targetProduct, d, done) {
    var s = reduced ? 0.01 : 1;
    gsap.killTweensOf([barSlide, barText, ctaBtn, ctaLabel]);

    if (reduced) {
      gsap.fromTo(barSlide, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.1, ease: "power1.inOut", onComplete: function () {
        barBg.style.background = targetProduct.colors.banner;
        gsap.set(barSlide, { opacity: 0 });
      }});
    } else {
      gsap.fromTo(barSlide,
        { xPercent: 100 * d, opacity: 1 },
        { xPercent: 0, duration: 0.8, delay: 0.35 * s, ease: "power3.inOut", onComplete: function () {
          barBg.style.background = targetProduct.colors.banner;
          gsap.set(barSlide, { opacity: 0 });
        }}
      );
    }

    gsap.to(barText, { color: targetProduct.colors.bannerText, duration: 0.8 * s, delay: 0.35 * s, ease: "power1.inOut" });
    gsap.to(ctaBtn, { backgroundColor: targetProduct.colors.accent, color: targetProduct.colors.onAccent, duration: 0.6 * s, delay: 0.45 * s, ease: "power1.inOut" });
    gsap.to(btnMenu, { backgroundColor: targetProduct.colors.accent, color: targetProduct.colors.onAccent, duration: 0.6 * s, delay: 0.45 * s, ease: "power1.inOut" });

    var tl = gsap.timeline();
    tl.to(ctaLabel, { y: -8, opacity: 0, duration: 0.18 * s, ease: "power2.in" }, 0.45 * s)
      .call(function () {
        ctaLabel.textContent = targetProduct.orderLabel;
        gsap.set(ctaLabel, { y: 8 });
      })
      .to(ctaLabel, { y: 0, opacity: 1, duration: 0.22 * s, ease: "power2.out" });

    if (done) done();
  }

  /* ---------- Transition principale ---------- */
  function finishTransition(pend, out, inSlot) {
    activeProduct = pend.target;
    activeSlot = inSlot;          // le slot entrant devient actif
    if (out) resetLayer(out);     // on reset l'ancien slot (sortant)
    isTransitioning = false;
    setArrows(false);
    startFloats();
    if (queuedDir) {
      var q = queuedDir;
      queuedDir = 0;
      goTo(q);
    }
  }

  function setArrows(disabled) {
    arrowPrev.classList.toggle("is-disabled", disabled);
    arrowNext.classList.toggle("is-disabled", disabled);
  }

  function goTo(d) {
    if (pending) { queuedDir = d; return; }
    isTransitioning = true;
    setArrows(true);
    dir = d;
    killAllFloats();
    if (transitionTl) transitionTl.kill();

    var target = (activeProduct + d + COUNT) % COUNT;
    pending = { dir: d, target: target };
    var freeSlot = 1 - activeSlot;
    layers[freeSlot] = target;
    current = target;

    /* Le produit du slot libre change -> reconstruire la couche */
    layerRefs[freeSlot] = buildLayerFull(layerEls[freeSlot], PRODUCTS[target]);
    resetLayer(layerRefs[freeSlot]);
    prepLayer(layerRefs[freeSlot]);

    runTransition(pending);
  }

  function prepLayer(r) {
    if (r.hero) gsap.set(r.hero, { xPercent: -50, yPercent: -50 });
    gsap.set(positional(r), { xPercent: -50, yPercent: -50 });
  }

  function runTransition(pend) {
    var d = pend.dir;
    var targetProduct = PRODUCTS[pend.target];
    var outSlot = activeSlot;
    var inSlot = 1 - outSlot;
    var out = layerRefs[outSlot];
    var incoming = layerRefs[inSlot];

    var tl = gsap.timeline({ onComplete: function () { pending = null; finishTransition(pend, out, inSlot); } });
    transitionTl = tl;

    if (reduced) {
      gsap.set(incoming.hero, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0 });
      gsap.set(incoming.shadow, { scale: 1, opacity: 0 });
      gsap.set(incoming.word, { x: 0, scale: 1, opacity: 0 });
      gsap.set(incoming.bg, { x: 0, xPercent: 0, scale: 1, opacity: 0 });
      gsap.set(positional(incoming), { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0 });

      tl.to(out.word, { opacity: 0, duration: 0.4 }, 0)
        .to(out.hero, { opacity: 0, duration: 0.4 }, 0)
        .to(positional(out), { opacity: 0, duration: 0.4 }, 0)
        .to(out.shadow, { opacity: 0, duration: 0.4 }, 0)
        .to(incoming.bg, { opacity: 1, duration: 0.4, ease: "power1.inOut" }, 0)
        .to(incoming.word, { opacity: 1, duration: 0.4 }, 0)
        .to(incoming.hero, { opacity: 1, duration: 0.4 }, 0)
        .to(incoming.shadow, { opacity: 1, duration: 0.4 }, 0)
        .to(positional(incoming), { opacity: 1, duration: 0.4 }, 0);

      tl.to(descEl, { opacity: 0, duration: 0.15 }, 0)
        .call(function () { descSpan.textContent = targetProduct.description; }, null, 0.2)
        .to(descEl, { opacity: 1, duration: 0.2 }, 0.2);
    } else {
      /* Sortie des chips / badges / accessoire */
      out.chips.forEach(function (chip, i) {
        if (!chip) return;
        var off = offsetToCenter(chip);
        tl.to(chip, { x: off.x * 0.6, y: off.y * 0.6, scale: 0.7, opacity: 0, rotation: "+=" + (8 * d), duration: 0.3, ease: "power2.in" }, i * 0.05);
      });
      out.badges.forEach(function (badge, i) {
        if (!badge) return;
        var off = offsetToCenter(badge);
        tl.to(badge, { x: off.x * 0.6, y: off.y * 0.6, scale: 0.7, opacity: 0, rotation: "+=" + (8 * d), duration: 0.3, ease: "power2.in" }, 0.11 + i * 0.06);
      });
      if (out.free) {
        var offFree = offsetToCenter(out.free);
        tl.to(out.free, { x: offFree.x * 0.6, y: offFree.y * 0.6, scale: 0.7, opacity: 0, rotation: "+=" + (8 * d), duration: 0.3, ease: "power2.in" }, 0.23);
      }

      /* Sortie du produit */
      tl.to(out.hero, { y: -26, scale: 1.03, duration: 0.35, ease: "power2.out" }, 0.1)
        .to(out.shadow, { scale: 0.86, opacity: 0.63, duration: 0.35, ease: "power2.out" }, 0.1)
        .to(out.hero, { rotation: -8 * d, duration: 0.35, ease: "power2.inOut" }, 0.25)
        .to(out.hero, { x: (-120 * d) + "vw", scale: 0.92, duration: 0.6, ease: "power3.in", overwrite: "auto" }, 0.4)
        .to(out.shadow, { opacity: 0, duration: 0.25 }, 0.4)
        .to(out.hero, { opacity: 0, duration: 0.15 }, 0.85);

      /* Description */
      tl.to(descEl, { y: -10, opacity: 0, duration: 0.25, ease: "power2.in" }, 0.3)
        .call(function () { descSpan.textContent = targetProduct.description; }, null, 0.7)
        .fromTo(descEl, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out", immediateRender: false }, 1.1);

      /* Nouveau fond glisse par-dessus */
      gsap.set(incoming.bg, {
        opacity: 1, scale: 1, x: 0, xPercent: 100 * d, zIndex: 15,
        boxShadow: d === 1 ? "-60px 0 90px rgba(0,0,0,0.38)" : "60px 0 90px rgba(0,0,0,0.38)"
      });
      gsap.set(out.bg, { xPercent: 0, zIndex: 0 });
      gsap.set(incoming.word, { opacity: 0, scale: 0.98, x: (14 * d) + "vw", zIndex: 16 });
      gsap.set(out.word, { zIndex: 10 });
      gsap.set(incoming.hero, { x: (110 * d) + "vw", y: -14, rotation: 8 * d, scale: 0.95, opacity: 0.85, zIndex: 41 });
      gsap.set(out.hero, { zIndex: 40 });
      gsap.set(incoming.shadow, { opacity: 0, scale: 0.7 });

      tl.to(incoming.bg, { xPercent: 0, duration: 0.8, ease: "power3.inOut" }, 0.35)
        .to(out.bg, { xPercent: -4 * d, scale: 1.1, duration: 0.8, ease: "power3.inOut" }, 0.35);

      /* Swap du mot géant */
      tl.to(out.word, { x: (-14 * d) + "vw", scale: 0.98, opacity: 0, duration: 0.55, ease: "power2.in" }, 0.45)
        .to(incoming.word, { x: 0, scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.6);

      /* Entrée du produit avec rebond */
      tl.to(incoming.hero, { x: 0, scale: 0.96, opacity: 1, duration: 0.7, ease: "power3.out" }, 0.55)
        .to(incoming.hero, {
          keyframes: [
            { rotation: 2.5 * d, scale: 1.01, y: -4, duration: 0.22 },
            { rotation: 0, scale: 1, y: 0, duration: 0.23 }
          ],
          ease: "power2.inOut"
        }, 0.9);

      tl.to(incoming.shadow, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, 0.95);

      /* Entrée des chips / badges / accessoire */
      function enter(elm, at) {
        var off = offsetToCenter(elm);
        gsap.set(elm, { x: off.x, y: off.y, scale: 0.75, opacity: 0, rotation: -6 * d });
        tl.to(elm, { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, duration: 0.4, ease: "back.out(1.3)" }, at);
      }
      incoming.chips.forEach(function (chip, i) { if (chip) enter(chip, 1.05 + i * 0.06); });
      incoming.badges.forEach(function (badge, i) { if (badge) enter(badge, 1.23 + i * 0.06); });
      if (incoming.free) enter(incoming.free, 1.35);
    }

    /* Chrome (bandeau / CTA / bouton menu) */
    animateChrome(targetProduct, d);
  }

  /* ---------- Entrée initiale ---------- */
  function initialEnter() {
    layerRefs[0] = buildLayerFull(layerEls[0], PRODUCTS[0]);
    prepLayer(layerRefs[0]);
    var first = layerRefs[0];
    resetLayer(layerRefs[1] = buildLayerFull(layerEls[1], PRODUCTS[1]));
    applyChromeInstant();
    descSpan.textContent = PRODUCTS[0].description;

    if (reduced) {
      gsap.set([first.bg, first.word, first.hero, first.shadow], { opacity: 1 });
      gsap.set(positional(first), { opacity: 1 });
      startFloats();
      scheduleAutoplay();
      return;
    }

    var tl = gsap.timeline({ onComplete: function () { startFloats(); scheduleAutoplay(); } });
    transitionTl = tl;

    tl.fromTo(first.bg, { scale: 1.06, opacity: 0.85 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power1.out" }, 0)
      .fromTo(first.wordLines, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 0.1)
      .fromTo(first.hero, { y: 46, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.25)
      .fromTo(first.shadow, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.35);

    first.chips.forEach(function (chip, i) {
      if (!chip) return;
      var off = offsetToCenter(chip);
      var dist = Math.hypot(off.x, off.y) || 1;
      tl.fromTo(chip,
        { x: (off.x / dist) * 20, y: (off.y / dist) * 20, scale: 0.7, opacity: 0 },
        { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)" },
        0.55 + i * 0.07
      );
    });

    first.badges.concat([first.free]).forEach(function (elm, i) {
      if (!elm) return;
      tl.fromTo(elm, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, 0.65 + i * 0.08);
    });

    tl.fromTo([descEl, document.querySelector(".tf-actions")],
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.06, ease: "power2.out" }, 0.8)
      .fromTo([arrowPrev, arrowNext], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" }, 0)
      .fromTo([document.querySelector(".tf-nav"), ctaBtn], { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0);
  }

  /* ---------- Autoplay ---------- */
  var autoplayTimer = null;

  function scheduleAutoplay() {
    if (autoplayTimer) clearTimeout(autoplayTimer);
    if (reduced) return;
    autoplayTimer = setTimeout(function () {
      if (document.hidden || isTransitioning || pending) { scheduleAutoplay(); return; }
      goTo(1);
      scheduleAutoplay();
    }, AUTOPLAY_DELAY);
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) scheduleAutoplay();
  });

  /* ---------- Interactions ---------- */
  arrowNext.addEventListener("click", function () { goTo(1); scheduleAutoplay(); });
  arrowPrev.addEventListener("click", function () { goTo(-1); scheduleAutoplay(); });

  window.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { goTo(1); scheduleAutoplay(); }
    else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { goTo(-1); scheduleAutoplay(); }
  });

  var touchX = 0, touchY = 0;
  stage.addEventListener("touchstart", function (e) {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) {
      goTo(dx < 0 ? 1 : -1);
      scheduleAutoplay();
    }
  });

  [btnMenu, btnFind, ctaBtn].forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); });
  });
  Array.prototype.forEach.call(document.querySelectorAll(".tf-nav-link"), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* ---------- Préchargement ---------- */
  function preloadAll() {
    PRODUCTS.forEach(function (p) {
      [p.hero, p.floatAsset.img].concat(p.badges).forEach(function (src) {
        var i = new Image();
        i.src = src;
      });
    });
  }

  /* ---------- Boot ---------- */
  preloadAll();
  initialEnter();
})();
