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

  const maskPath = document.querySelector("#sts-mask-path");

  const bean = document.querySelector("#sts-bean-tracker");

  const beanBody = document.querySelector("#bean-body");

  const beanCrevice = document.querySelector("#bean-crevice");

  const trackIcons = document.querySelectorAll(".sts-track-icon-item");

  const stageCards = document.querySelectorAll(".sts-stage-card");

  const cupRipple = document.querySelector("#cup-ripple");


  if (!maskPath || !bean) return;


  const pathLength = maskPath.getTotalLength();

  maskPath.style.strokeDasharray = pathLength;

  maskPath.style.strokeDashoffset = pathLength;


  // Milestone target progress values for 5 stages (Sprout -> Cherry -> Roast -> Grind -> Cup)

  const stageProgressMap = [0.12, 0.35, 0.58, 0.80, 0.96];


  // Isolate timeline completely via GSAP Pinning

  ScrollTrigger.create({

    trigger: section,

    start: "top top",

    end: "+=280%",

    pin: true,

    scrub: 0.5,

    anticipatePin: 1,

    invalidateOnRefresh: true,

    onUpdate: (self) => {

      const progress = self.progress; // strictly 0.0 (top of section) to 1.0 (end of pinned scroll)


      // 1. Draw active path stroke via mask offset

      maskPath.style.strokeDashoffset = pathLength - progress * pathLength;


      // 2. Position tracker icon along the path

      const point = maskPath.getPointAtLength(progress * pathLength);


      const svg = document.querySelector(".sts-track-svg");

      if (!svg) return;

      const svgRect = svg.getBoundingClientRect();

      const viewBox = svg.viewBox.baseVal;


      const x = (point.x / viewBox.width) * svgRect.width;

      const y = (point.y / viewBox.height) * svgRect.height;


      // Rotational rolling effect as it moves down (4 full rotations)

      const rotation = progress * 1440;

      bean.style.left = `${x}px`;

      bean.style.top = `${y}px`;


      // 3. Dynamic Color Transition:

      // 0% – 30%: Raw Green (#6b8e23)

      // 30% – 60%: Ripe Red Cherry (#c0392b)

      // 60% – 90%: Rich Roasted Brown (#4a2c11 to #2c1810)

      // 90% – 100%: Dropping into cup (#2c1810)

      let fillColor = "#6b8e23";

      let creviceColor = "#3e5314";

      let glowColor = "rgba(107, 142, 35, 0.8)";


      if (progress < 0.30) {

        // Raw Green bean

        fillColor = "#6b8e23";

        creviceColor = "#3e5314";

        glowColor = "rgba(107, 142, 35, 0.8)";

      } else if (progress < 0.60) {

        // Green -> Red interpolation (0.30 to 0.60)

        const t = (progress - 0.30) / 0.30;

        const r = Math.round(107 + (192 - 107) * t);

        const g = Math.round(142 + (57 - 142) * t);

        const b = Math.round(35 + (43 - 35) * t);

        fillColor = `rgb(${r}, ${g}, ${b})`;

        creviceColor = `rgb(${Math.round(62 + (120 - 62) * t)}, ${Math.round(83 + (30 - 83) * t)}, 20)`;

        glowColor = "rgba(192, 57, 43, 0.8)";

      } else if (progress < 0.90) {

        // Red -> Rich Roasted Brown interpolation (0.60 to 0.90)

        const t = (progress - 0.60) / 0.30;

        const r = Math.round(192 + (44 - 192) * t);

        const g = Math.round(57 + (24 - 57) * t);

        const b = Math.round(43 + (16 - 43) * t);

        fillColor = `rgb(${r}, ${g}, ${b})`;

        creviceColor = `rgb(${Math.round(120 + (21 - 120) * t)}, ${Math.round(30 + (11 - 30) * t)}, ${Math.round(20 + (6 - 20) * t)})`;

        glowColor = "rgba(212, 163, 115, 0.8)";

      } else {

        // Final Roasted Brown bean

        fillColor = "#2c1810";

        creviceColor = "#150b06";

        glowColor = "rgba(212, 163, 115, 0.9)";

      }


      if (beanBody) beanBody.setAttribute("fill", fillColor);

      if (beanCrevice) beanCrevice.setAttribute("stroke", creviceColor);

      bean.style.filter = `drop-shadow(0 0 10px ${glowColor})`;


      // Bean Scale & Drop-In at bottom into the cup

      if (progress >= 0.94) {

        const dropT = (progress - 0.94) / 0.06; // 0 to 1

        const beanScale = Math.max(0.4, 1.12 - dropT * 0.65);

        bean.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${beanScale})`;

        bean.style.opacity = (1 - dropT * 0.4).toString();


        // Animate Cup Crema Ripple

        if (cupRipple) {

          cupRipple.setAttribute("r", (2 + dropT * 18).toString());

          cupRipple.setAttribute("opacity", ((1 - dropT) * 0.9).toString());

        }

      } else {

        bean.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1.12)`;

        bean.style.opacity = "1";

        if (cupRipple) cupRipple.setAttribute("opacity", "0");

      }


      // 4. Milestone Icon Proximity & Strict Disappearance Rules

      trackIcons.forEach((icon, i) => {

        const targetP = stageProgressMap[i];

        const dist = Math.abs(progress - targetP);


        if (dist < 0.08) {

          // When bean is right next to milestone, smoothly fade in and scale up

          const ratio = 1 - dist / 0.08;

          icon.style.opacity = (ratio * 1).toFixed(3);

          icon.style.transform = `translate(-50%, -50%) scale(${0.85 + 0.33 * ratio})`;

          icon.classList.add("active-icon");

        } else {

          // Completely disappeared when bean is not at this milestone

          icon.style.opacity = "0";

          icon.style.transform = "translate(-50%, -50%) scale(0.85)";

          icon.classList.remove("active-icon");

        }

      });


      // 5. Active Stage Card Selection with Proximity Crossfade (Only active card visible)

      let activeIndex = 0;

      if (progress >= 0.88) {

        activeIndex = 4;

      } else if (progress >= 0.69) {

        activeIndex = 3;

      } else if (progress >= 0.46) {

        activeIndex = 2;

      } else if (progress >= 0.23) {

        activeIndex = 1;

      } else {

        activeIndex = 0;

      }


      stageCards.forEach((card, idx) => {

        if (idx === activeIndex) {

          const dist = Math.abs(progress - stageProgressMap[idx]);

          if (dist < 0.14) {

            const ratio = Math.min(1, (1 - dist / 0.14) * 1.5);

            card.classList.add("active");

            card.style.opacity = Math.max(0.2, ratio).toString();

            card.style.transform = `translateY(${16 * (1 - ratio)}px) scale(${0.96 + 0.04 * ratio})`;

            card.style.pointerEvents = "auto";

          } else {

            card.classList.remove("active");

            card.style.opacity = "0";

            card.style.transform = "translateY(24px) scale(0.96)";

            card.style.pointerEvents = "none";

          }

        } else {

          card.classList.remove("active");

          card.style.opacity = "0";

          card.style.transform = "translateY(24px) scale(0.96)";

          card.style.pointerEvents = "none";

        }

      });


      // 6. Background color transition easing into Little Farmer section (#1c1410 -> #1b271d)

      if (progress > 0.78) {

        const blendFactor = (progress - 0.78) / 0.22;

        const r = Math.round(28 - (28 - 27) * blendFactor);

        const g = Math.round(20 + (39 - 20) * blendFactor);

        const b = Math.round(16 + (29 - 16) * blendFactor);

        section.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

      } else {

        section.style.backgroundColor = "#1c1410";

      }

    }

  });


  window.addEventListener("resize", () => {

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