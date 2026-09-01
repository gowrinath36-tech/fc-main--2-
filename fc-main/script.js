// ============================================
// FOREST CAFE — INTERACTION & SCROLL CHOREOGRAPHY
// Desktop: 4-layer parallax
// Mobile: Single image + subtle parallax
// ============================================

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


// ============================================
// NAV BACKGROUND ON SCROLL
// ============================================

const nav = document.getElementById("nav");

if (nav) {

  ScrollTrigger.create({

    start: 100,

    onUpdate: (self) => {

      if (self.scroll() > 80) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }

    }

  });

}


// ============================================
// HERO SECTION PIN & REVEAL
// ============================================

function revealHero() {

  if (typeof gsap === "undefined") return;

  const hero = document.querySelector("#hero");

  if (!hero) return;


  // ==========================================
  // DESKTOP HERO
  // ==========================================

  const desktopMedia = gsap.matchMedia();

  desktopMedia.add(
    "(min-width: 769px)",
    () => {

      // -------------------------------
      // Initial states
      // -------------------------------

      gsap.set(
        [
          "#hero-layer-2 img",
          "#hero-layer-3 img",
          "#hero-layer-4 img"
        ],
        {
          yPercent: 100
        }
      );


      gsap.set(
        ".hero-content",
        {
          opacity: 0,
          y: 50
        }
      );


      gsap.set(
        [".card-left", ".card-right"],
        {
          opacity: 0,
          y: 50
        }
      );


      // -------------------------------
      // Desktop parallax timeline
      // -------------------------------

      const tl = gsap.timeline({

        scrollTrigger: {

          trigger: "#hero",

          start: "top top",

          end: "+=250%",

          scrub: 1,

          pin: true,

          anticipatePin: 1,

          invalidateOnRefresh: true

        }

      });


      tl

        // TREELINE
        .to(
          "#hero-layer-2 img",
          {
            yPercent: 12,
            ease: "none"
          }
        )


        // CAFE
        .to(
          "#hero-layer-3 img",
          {
            yPercent: 8,
            ease: "none"
          },
          "-=0.3"
        )


        // FOREGROUND
        .to(
          "#hero-layer-4 img",
          {
            yPercent: 0,
            ease: "none"
          },
          "-=0.3"
        )


        // HERO CONTENT
        .to(
          ".hero-content",
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "-=0.1"
        )


        // LEFT CARD
        .to(
          ".card-left",
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "<"
        )


        // RIGHT CARD
        .to(
          ".card-right",
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "<"
        );

    }
  );


  // ==========================================
  // MOBILE HERO
  // ==========================================

  desktopMedia.add(
    "(max-width: 768px)",
    () => {

      const mobileImage = hero.querySelector(
        ".hero-mobile-image img"
      );

      const mobileContent = hero.querySelector(
        ".hero-content"
      );


      if (!mobileImage) return;


      // ----------------------------------------
      // Initial mobile state
      // ----------------------------------------

      gsap.set(
        mobileImage,
        {
          yPercent: 0,
          scale: 1.04
        }
      );


      if (mobileContent) {

        gsap.set(
          mobileContent,
          {
            opacity: 0,
            y: 25
          }
        );

      }


      // ----------------------------------------
      // MOBILE SUBTLE PARALLAX
      // ----------------------------------------

      const mobileTimeline = gsap.timeline({

        scrollTrigger: {

          trigger: hero,

          start: "top top",

          /*
            Smaller than desktop.
            Only a little scroll movement.
          */

          end: "+=110%",

          scrub: 0.8,

          pin: true,

          anticipatePin: 1,

          invalidateOnRefresh: true

        }

      });


      mobileTimeline

        // --------------------------------------
        // Image moves VERY SLOWLY
        // --------------------------------------

        .to(
          mobileImage,
          {
            yPercent: -6,
            scale: 1,
            ease: "none"
          }
        )


        // --------------------------------------
        // Content gently appears
        // --------------------------------------

        .to(
          mobileContent,
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "-=0.25"
        );

    }
  );

}


// ============================================
// LOADER → HERO START
// ============================================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const loader =
      document.getElementById("loader");

    const loaderVideo =
      document.getElementById("loader-video");


    let finished = false;


    function startWebsite() {

      if (finished) return;

      finished = true;


      // ----------------------------------------
      // Remove loader
      // ----------------------------------------

      if (loader) {
        loader.classList.add("hidden");
      }


      // ----------------------------------------
      // Allow scrolling
      // ----------------------------------------

      document.body.style.overflow = "auto";


      // ----------------------------------------
      // Start website
      // ----------------------------------------

      requestAnimationFrame(() => {

        // HERO
        revealHero();

        // SOIL TO SIP
        initSoilToSip();

        // PERSON BEHIND FOREST
        if (typeof initPersonBehindForest === "function") {
          initPersonBehindForest();
        }

        // Refresh GSAP
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }

      });

    }


    // ==========================================
    // REDUCED MOTION
    // ==========================================

    if (reduceMotion) {

      startWebsite();

      return;

    }


    // ==========================================
    // VIDEO LOADER
    // ==========================================

    if (loaderVideo) {


      // Make sure video starts

      loaderVideo
        .play()
        .catch(() => {});


      // Video completed

      loaderVideo.addEventListener(
        "ended",
        startWebsite,
        {
          once: true
        }
      );


      // Safety fallback

      setTimeout(
        startWebsite,
        7000
      );


    } else {


      // No video → immediately start

      startWebsite();

    }

  }
);

/* ============================================
   SOIL TO SIP — 10 CARD SCROLL JOURNEY
   ============================================ */

function initSoilToSip() {

  const section = document.querySelector("#soil-to-sip");

  if (!section) return;


  const isMobile = window.innerWidth <= 900;


  if (isMobile) {

    // On mobile, show cards normally in single vertical flow

    const cards = document.querySelectorAll(".sts-stage-card");

    cards.forEach((c) => {

      c.classList.add("active");

      c.style.opacity = "1";

      c.style.transform = "none";

    });

    return;

  }


  // Desktop scroll-driven path tracking animation with GSAP Pinning

  const stsWrap = section.querySelector(".sts-wrap");

  const maskPath = document.querySelector("#sts-mask-path");

  const bgPath = document.querySelector(".sts-line-bg");

  const activePath = document.querySelector(".sts-line-active");

  const svgEl = document.querySelector(".sts-track-svg");

  const bean = document.querySelector("#sts-bean-tracker");

  const beanBody = document.querySelector("#bean-body");

  const beanCrevice = document.querySelector("#bean-crevice");

  const trackIcons = document.querySelectorAll(".sts-track-icon-item");

  const stageCards = document.querySelectorAll(".sts-stage-card");

  const cupLandingRipple = document.querySelector("#cup-landing-ripple");


  if (!maskPath || !bean || !stsWrap) return;


  let pathLength = 0;


  // Dynamically calculate the SVG MotionPath coordinates to land directly inside STAGE 05 Cup

  function buildPath() {

    const wrapRect = stsWrap.getBoundingClientRect();

    const W = wrapRect.width || 1200;

    const H = wrapRect.height || 700;


    // Left track rail center X

    const leftTrack = section.querySelector(".sts-left-track");

    const leftTrackRect = leftTrack ? leftTrack.getBoundingClientRect() : null;

    const startX = leftTrackRect ? (leftTrackRect.left + leftTrackRect.width * 0.5 - wrapRect.left) : (W * 0.12);


    // Coffee Cup graphic/photo center inside STAGE 05 card (#cup or .stage-05-img)

    const cupImg = document.querySelector("#cup") || document.querySelector(".stage-05-img") || document.querySelector(".sts-card-4 .sts-card-img-box");

    let targetX = W * 0.45;

    let targetY = H * 0.60;


    if (cupImg) {

      const cupRect = cupImg.getBoundingClientRect();

      if (cupRect.width > 0 && cupRect.height > 0) {

        targetX = (cupRect.left + cupRect.width * 0.5) - wrapRect.left;

        targetY = (cupRect.top + cupRect.height * 0.60) - wrapRect.top;

      }

    }


    // Rail milestone coordinates

    const p0 = { x: startX, y: H * 0.05 };

    const p1 = { x: startX + 22, y: H * 0.18 }; // Sprout (~18%)

    const p2 = { x: startX - 22, y: H * 0.36 }; // Cherries (~36%)

    const p3 = { x: startX + 22, y: H * 0.54 }; // Roast (~54%)

    const p4 = { x: startX - 18, y: H * 0.70 }; // Grind (~70%)

    const p5 = { x: targetX, y: targetY };      // Terminal endpoint: Directly inside STAGE 05 • THE CUP card!


    // Position milestone icons over their respective rail coordinates

    if (trackIcons.length >= 4) {

      if (trackIcons[0]) { trackIcons[0].style.left = `${p1.x}px`; trackIcons[0].style.top = `${p1.y}px`; }

      if (trackIcons[1]) { trackIcons[1].style.left = `${p2.x}px`; trackIcons[1].style.top = `${p2.y}px`; }

      if (trackIcons[2]) { trackIcons[2].style.left = `${p3.x}px`; trackIcons[2].style.top = `${p3.y}px`; }

      if (trackIcons[3]) { trackIcons[3].style.left = `${p4.x}px`; trackIcons[3].style.top = `${p4.y}px`; }

    }


    // Smooth cubic bezier sweeping from Grind (p4) right into Stage 05 Cup (p5)

    const ctrl1X = p4.x + (targetX - p4.x) * 0.25;

    const ctrl1Y = p4.y + (targetY - p4.y) * 0.60;

    const ctrl2X = targetX - (targetX - p4.x) * 0.28;

    const ctrl2Y = targetY + 30;


    const pathData = `
      M ${p0.x} ${p0.y}
      C ${startX - 28} ${H * 0.10}, ${startX + 32} ${H * 0.12}, ${p1.x} ${p1.y}
      C ${startX + 18} ${H * 0.26}, ${startX - 32} ${H * 0.28}, ${p2.x} ${p2.y}
      C ${startX - 18} ${H * 0.44}, ${startX + 32} ${H * 0.46}, ${p3.x} ${p3.y}
      C ${startX + 18} ${H * 0.62}, ${startX - 28} ${H * 0.64}, ${p4.x} ${p4.y}
      C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${p5.x} ${p5.y}
    `;


    if (svgEl) {

      svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`);

    }

    if (maskPath) maskPath.setAttribute("d", pathData);

    if (bgPath) bgPath.setAttribute("d", pathData);

    if (activePath) activePath.setAttribute("d", pathData);


    pathLength = maskPath.getTotalLength();

    maskPath.style.strokeDasharray = pathLength;

    maskPath.style.strokeDashoffset = pathLength;

  }


  buildPath();


  // The full MotionPath particle finishes cleanly and lands in cup at 80% scroll

  const journeyEndProgress = 0.80;


  ScrollTrigger.create({

    trigger: section,

    start: "top top",

    end: "+=160%", // Pinned duration as specified

    pin: true,

    scrub: 1.2, // Smooth organic scrub

    anticipatePin: 1,

    invalidateOnRefresh: true,

    onUpdate: (self) => {

      const progress = self.progress; // 0.0 to 1.0


      // Normalize journey animation progress (0.0 to 1.0 within 0.0 -> 0.80)

      const animProgress = Math.min(1, Math.max(0, progress / journeyEndProgress));


      // 1. Draw active path stroke via mask offset

      if (pathLength > 0 && maskPath) {

        maskPath.style.strokeDashoffset = pathLength - animProgress * pathLength;

      }


      // 2. Position bean tracker along the path

      if (maskPath && pathLength > 0) {

        const point = maskPath.getPointAtLength(animProgress * pathLength);

        bean.style.left = `${point.x}px`;

        bean.style.top = `${point.y}px`;

      }


      // Rotational rolling effect (4 full rotations across the journey)

      const rotation = animProgress * 1440;


      // 3. Dynamic Color Transition:

      // 0% – 25%: Raw Green (#6b8e23)

      // 25% – 52%: Green -> Ripe Red Cherry (#c0392b)

      // 52% – 78%: Red -> Rich Roasted Brown (#4a2c11 to #2c1810)

      // 78% – 100%: Dropping into cup (#2c1810)

      let fillColor = "#6b8e23";

      let creviceColor = "#3e5314";

      let glowColor = "rgba(107, 142, 35, 0.85)";


      if (animProgress < 0.25) {

        fillColor = "#6b8e23";

        creviceColor = "#3e5314";

        glowColor = "rgba(107, 142, 35, 0.85)";

      } else if (animProgress < 0.52) {

        const t = (animProgress - 0.25) / 0.27;

        const r = Math.round(107 + (192 - 107) * t);

        const g = Math.round(142 + (57 - 142) * t);

        const b = Math.round(35 + (43 - 35) * t);

        fillColor = `rgb(${r}, ${g}, ${b})`;

        creviceColor = `rgb(${Math.round(62 + (120 - 62) * t)}, ${Math.round(83 + (30 - 83) * t)}, 20)`;

        glowColor = "rgba(192, 57, 43, 0.85)";

      } else if (animProgress < 0.78) {

        const t = (animProgress - 0.52) / 0.26;

        const r = Math.round(192 + (44 - 192) * t);

        const g = Math.round(57 + (24 - 57) * t);

        const b = Math.round(43 + (16 - 43) * t);

        fillColor = `rgb(${r}, ${g}, ${b})`;

        creviceColor = `rgb(${Math.round(120 + (21 - 120) * t)}, ${Math.round(30 + (11 - 30) * t)}, ${Math.round(20 + (6 - 20) * t)})`;

        glowColor = "rgba(212, 163, 115, 0.85)";

      } else {

        fillColor = "#2c1810";

        creviceColor = "#150b06";

        glowColor = "rgba(212, 163, 115, 0.9)";

      }


      if (beanBody) beanBody.setAttribute("fill", fillColor);

      if (beanCrevice) beanCrevice.setAttribute("stroke", creviceColor);

      bean.style.filter = `drop-shadow(0 0 12px ${glowColor})`;


      // 4. Bean Particle Visibly Dropping *INTO* the Stage 05 Cup at 100% completion

      if (animProgress >= 0.85) {

        const dropT = (animProgress - 0.85) / 0.15; // 0 to 1

        const beanScale = Math.max(0.18, 1.12 - dropT * 0.90);

        const beanOpacity = Math.max(0, 1 - dropT * 1.35);

        bean.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${beanScale})`;

        bean.style.opacity = beanOpacity.toString();


        // Crema Ripple inside Stage 05 Cup

        if (cupLandingRipple) {

          cupLandingRipple.style.opacity = (Math.sin(dropT * Math.PI) * 0.95).toFixed(3);

          cupLandingRipple.style.transform = `scale(${0.5 + dropT * 2.8})`;

        }

      } else {

        bean.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1.12)`;

        bean.style.opacity = "1";

        if (cupLandingRipple) {

          cupLandingRipple.style.opacity = "0";

          cupLandingRipple.style.transform = "scale(0.5)";

        }

      }


      // 5. Milestone Icons (Sprout: ~0.18, Cherries: ~0.36, Roast: ~0.54, Grind: ~0.70)

      const iconMilestones = [0.18, 0.36, 0.54, 0.70];

      trackIcons.forEach((icon, i) => {

        if (i < iconMilestones.length) {

          const targetP = iconMilestones[i];

          const dist = Math.abs(animProgress - targetP);

          if (dist < 0.08) {

            const ratio = 1 - dist / 0.08;

            icon.style.opacity = (ratio * 1).toFixed(3);

            icon.style.transform = `translate(-50%, -50%) scale(${0.85 + 0.33 * ratio})`;

            icon.classList.add("active-icon");

          } else {

            icon.style.opacity = "0";

            icon.style.transform = "translate(-50%, -50%) scale(0.85)";

            icon.classList.remove("active-icon");

          }

        }

      });


      // 6. Active Stage Cards:

      // Stage 0 (Sprout): 0.00 -> 0.20

      // Stage 1 (Cherries): 0.20 -> 0.40

      // Stage 2 (Roast): 0.40 -> 0.60

      // Stage 3 (Grind): 0.60 -> 0.78

      // Stage 4 (Stage 05 Cup): 0.78 -> 1.00 (stays active & visible through section exit!)

      let activeIndex = 0;

      if (animProgress >= 0.78) {

        activeIndex = 4; // Stage 05: The Perfect Sip

      } else if (animProgress >= 0.60) {

        activeIndex = 3; // Stage 04: Precision Grind

      } else if (animProgress >= 0.40) {

        activeIndex = 2; // Stage 03: Artisanal Roast

      } else if (animProgress >= 0.20) {

        activeIndex = 1; // Stage 02: Cherry Ripening

      } else {

        activeIndex = 0; // Stage 01: The Soil & Sprout

      }


      stageCards.forEach((card, idx) => {

        if (idx === activeIndex) {

          card.classList.add("active");

          card.style.opacity = "1";

          card.style.transform = "translateY(0) scale(1)";

          card.style.pointerEvents = "auto";

        } else {

          card.classList.remove("active");

          card.style.opacity = "0";

          card.style.transform = "translateY(24px) scale(0.96)";

          card.style.pointerEvents = "none";

        }

      });


      // 7. Background Color & Atmospheric Veil Transition (Smooth blend into Little Farmer)

      // Triggers ONLY AFTER the bean/particle has fully landed in the cup (progress > 0.80)

      if (progress > 0.80) {

        const blendFactor = Math.min(1, (progress - 0.80) / 0.20);

        const r = Math.round(28 + (27 - 28) * blendFactor);

        const g = Math.round(20 + (39 - 20) * blendFactor);

        const b = Math.round(16 + (29 - 16) * blendFactor);

        section.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        section.style.setProperty("--sts-veil-opacity", blendFactor.toFixed(3));

      } else {

        section.style.backgroundColor = "#1c1410";

        section.style.setProperty("--sts-veil-opacity", "0");

      }

    }

  });


  window.addEventListener("resize", () => {

    buildPath();

    ScrollTrigger.refresh();

  });

}



// ---- TINY COT PATH JOURNEY — MotionPathPlugin ----
const pathEl = document.getElementById('path-line');
const marker = document.getElementById('path-marker');
if (pathEl && marker) {
  gsap.set(marker, { motionPath: { path: pathEl, align: pathEl, alignOrigin: [0.5, 0.5], start: 0 } });
  gsap.to(marker, {
    motionPath: { path: pathEl, align: pathEl, alignOrigin: [0.5, 0.5], start: 0, end: 1 },
    ease: 'none',
    scrollTrigger: { trigger: '#tinycot-path', start: 'top top', end: 'bottom bottom', scrub: 0.6 }
  });
 
  const caps = ['#cap-1', '#cap-2', '#cap-3', '#cap-4'];
  caps.forEach((sel, i) => {
    gsap.to(sel, {
      opacity: 1,
      duration: 0.5,
      scrollTrigger: {
        trigger: '#tinycot-path',
        start: `top+=${i * 22}% top`,
        end: `top+=${i * 22 + 18}% top`,
        scrub: 0.4
      }
    });
  });
}
 
// ---- Tiny Cot camera-approach ----
if (!reduceMotion && document.getElementById('cot-visual')) {
  gsap.fromTo('#cot-visual', { scale: 0.82, opacity: 0.7 }, {
    scale: 1, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '#tinycot', start: 'top 90%', end: 'top 20%', scrub: true }
  });
}
 
// ============================================
// 07. THE PERSON BEHIND THE FOREST
// Scroll Reveal & Organic Motion
// ============================================

function initPersonBehindForest() {

  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger === "undefined") return;

  const section = document.querySelector("#person-behind-forest");

  if (!section) return;

  // ------------------------------------------
  // Respect reduced motion
  // ------------------------------------------

  if (reduceMotion) {
    gsap.set(
      [
        ".person-story",
        ".person-visual",
        ".person-philosophy",
        ".art-class-card",
        ".person-articles"
      ],
      {
        opacity: 1,
        y: 0,
        x: 0
      }
    );

    return;
  }


  // ------------------------------------------
  // Initial states
  // ------------------------------------------

  gsap.set(".person-story", {
    opacity: 0,
    x: -50
  });

  gsap.set(".person-visual", {
    opacity: 0,
    x: 50
  });

  gsap.set(".person-philosophy", {
    opacity: 0,
    y: 50
  });

  gsap.set(".art-class-card", {
    opacity: 0,
    y: 60
  });

  gsap.set(".person-articles", {
    opacity: 0,
    y: 60
  });


  // ------------------------------------------
  // Main story reveal
  // ------------------------------------------

  gsap.timeline({

    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      end: "top 30%",
      scrub: 1,
      invalidateOnRefresh: true
    }

  })

  .to(".person-story", {
    opacity: 1,
    x: 0,
    ease: "power2.out"
  })

  .to(".person-visual", {
    opacity: 1,
    x: 0,
    ease: "power2.out"
  }, "<0.15");


  // ------------------------------------------
  // Owner visual subtle parallax
  // ------------------------------------------

  const visual = section.querySelector(".person-image-frame");

  if (visual) {

    gsap.fromTo(
      visual,
      {
        y: 35
      },
      {
        y: -35,
        ease: "none",

        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2
        }
      }
    );

  }


  // ------------------------------------------
  // Creative Philosophy
  // ------------------------------------------

  gsap.to(".person-philosophy", {

    opacity: 1,
    y: 0,

    ease: "power2.out",

    scrollTrigger: {
      trigger: ".person-philosophy",
      start: "top 80%",
      end: "top 45%",
      scrub: 1
    }

  });


  // ------------------------------------------
  // Art Class Announcement
  // ------------------------------------------

  gsap.to(".art-class-card", {

    opacity: 1,
    y: 0,

    ease: "power2.out",

    scrollTrigger: {
      trigger: ".art-class-card",
      start: "top 82%",
      end: "top 48%",
      scrub: 1
    }

  });


  // ------------------------------------------
  // Articles section
  // ------------------------------------------

  gsap.to(".person-articles", {

    opacity: 1,
    y: 0,

    ease: "power2.out",

    scrollTrigger: {
      trigger: ".person-articles",
      start: "top 82%",
      end: "top 50%",
      scrub: 1
    }

  });


  // ------------------------------------------
  // Article cards stagger
  // ------------------------------------------

  gsap.fromTo(
    ".article-placeholder-card",

    {
      opacity: 0,
      y: 30
    },

    {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      ease: "power2.out",

      scrollTrigger: {
        trigger: ".articles-placeholder",
        start: "top 85%",
        end: "top 55%",
        scrub: 1
      }

    }
  );


  // ------------------------------------------
  // Refresh ScrollTrigger
  // ------------------------------------------

  ScrollTrigger.refresh();
}


 
/* ============================================
   LITTLE FARMER — SCROLL REVEAL
   ============================================ */

(function () {

  const lfRevealEls = document.querySelectorAll("#little-farmer .lf-reveal");

  if (lfRevealEls.length === 0) return;

  const lfObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("lf-visible");
          lfObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.2,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  lfRevealEls.forEach((el) => lfObserver.observe(el));

})();


/* ============================================
   AMBIENCE & MOMENTS SCROLL REVEAL
   ============================================ */

(function () {
  const ambienceCards = document.querySelectorAll(".ambience-card");
  if (ambienceCards.length === 0) return;

  if (typeof IntersectionObserver !== "undefined") {
    const ambObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            ambObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    ambienceCards.forEach((c, idx) => {
      c.style.opacity = "0";
      c.style.transform = "translateY(30px)";
      c.style.transition = `opacity 0.6s ease ${idx * 0.12}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.12}s`;
      ambObserver.observe(c);
    });
  }
})();

/* ============================================
   SOCIAL PROOF & VISIT US SCROLL REVEAL
   ============================================ */

(function () {
  const visitCols = document.querySelectorAll(".visit-reviews-col, .visit-connect-col");
  if (visitCols.length === 0) return;

  if (typeof IntersectionObserver !== "undefined") {
    const visitObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            visitObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    visitCols.forEach((col, idx) => {
      col.style.opacity = "0";
      col.style.transform = "translateY(25px)";
      col.style.transition = `opacity 0.6s ease ${idx * 0.15}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.15}s`;
      visitObserver.observe(col);
    });
  }
})();

/* ============================================
   NAV SCROLLSPY & SMOOTH SCROLL
   ============================================ */

(function () {
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");

  if (!navLinks.length || !sections.length) return;

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 150;
      const secHeight = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
})();

/* ============================================
   GLOBAL RESPONSIVE REFRESH
   ============================================ */

(function () {

  let resizeTimer;

  window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }

    }, 250);

  });

})();