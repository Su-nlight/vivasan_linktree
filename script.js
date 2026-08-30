/* ================================================================
   EDIT ME — everything on the page is generated from the three
   blocks below. To add a link, just add another object to LINKS.
   No HTML editing required.
   ================================================================ */

// ---- Your profile ------------------------------------------------
const PROFILE = {
  name: "Vivacious San",
  tagline: "Architecture Student · Design Enthusiast",
  // Leave avatarUrl empty to show initials instead of a photo.
  // To use your own photo, put the file next to this one and set
  // avatarUrl: "me.jpg"
  avatarUrl: "./image/avatar.png",
  initials: "VS",
};

// ---- Social icon row (small circular pills) -----------------------
// "icon" accepts any emoji or short glyph. Order = display order.
const SOCIALS = [
  { label: "Instagram", url: "https://www.instagram.com/vivacious_san/", icon: "https://img.icons8.com/fluency/64/instagram-new.png" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/sanjana-kumari-54a2b5306/", icon: "https://img.icons8.com/color/64/linkedin.png" },
  // { label: "Dribbble", url: "#", icon: "🏀" },
  // { label: "YouTube", url: "", icon: "▶" },
];

// ---- Main link list (the big glass cards) --------------------------
// "sub" is optional small caption text under the label.
const LINKS = [
  {
    label: "Portfolio",
    sub: "Selected work, 2023–2026",
    url: "#",
    icon: "✦",
  },
  {
    label: "Print Shop",
    sub: "Signed limited-edition prints",
    url: "#",
    icon: "🛒",
  },
  {
    label: "Commission Inquiries",
    sub: "Open for new projects",
    url: "#",
    icon: "✉",
  },
  {
    label: "Behance",
    sub: "Case studies & process",
    url: "#",
    icon: "🎨",
  },
  {
    label: "Newsletter",
    sub: "Monthly studio notes",
    url: "#",
    icon: "◈",
  },
];

/* ================================================================
   RENDERING — you shouldn't need to touch anything below this line.
   ================================================================ */
 
function renderProfile() {
  const el = document.getElementById("profile");
  const avatarInner = PROFILE.avatarUrl
    ? `<img src="${PROFILE.avatarUrl}" alt="${PROFILE.name}" />`
    : PROFILE.initials;
 
  el.innerHTML = `
    <div class="avatar-ring">
      <div class="avatar">${avatarInner}</div>
    </div>
    <h1 class="name">${PROFILE.name}</h1>
    <p class="tagline">${PROFILE.tagline}</p>
  `;
}
 
// If "icon" looks like a file path (svg/png/jpg/webp), render it as an
// <img>. Otherwise treat it as an emoji/glyph and render as plain text.
function isImagePath(icon) {
  return /\.(svg|png|jpe?g|webp)$/i.test(icon);
}
 
function renderIcon(icon, label) {
  return isImagePath(icon)
    ? `<img src="${icon}" alt="" />`
    : `<span aria-hidden="true">${icon}</span>`;
}
 
function renderSocials() {
  const el = document.getElementById("socials");
  el.innerHTML = SOCIALS.map(
    (s) => `
    <a class="social-pill" href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}">
      ${renderIcon(s.icon, s.label)}
    </a>`
  ).join("");
}
 
function renderLinks() {
  const el = document.getElementById("links");
  el.innerHTML = LINKS.map(
    (l) => `
    <a class="link-card" href="${l.url}" target="_blank" rel="noopener noreferrer">
      <span class="link-icon">${renderIcon(l.icon || "→", l.label)}</span>
      <span class="link-text">
        <span class="link-label">${l.label}</span>
        ${l.sub ? `<span class="link-sub">${l.sub}</span>` : ""}
      </span>
      <span class="link-arrow" aria-hidden="true">→</span>
    </a>`
  ).join("");
 
  attachLightTracking();
}
 
/* Signature interaction: the specular highlight on each glass card
   follows the pointer, mimicking light moving across real glass. */
function attachLightTracking() {
  const cards = document.querySelectorAll(".link-card");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });
}
 
/* Fun 3D element: the gem tilts toward the pointer while it
   continuously spins and floats on its own. */
function attachGemParallax() {
  const stage = document.getElementById("gemStage");
  const tilt = document.getElementById("gemTilt");
  if (!stage || !tilt) return;
 
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;
 
  stage.addEventListener("pointermove", (e) => {
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const maxTilt = 18;
    tilt.style.transform = `rotateY(${px * maxTilt}deg) rotateX(${-py * maxTilt}deg)`;
  });
 
  stage.addEventListener("pointerleave", () => {
    tilt.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

// ---- Draggable 3D card images -------------------------------------
// Put your two PNGs in the same folder as this file and set the names here.
const CARD = {
  frontImage: "image/card/front.png",
  backImage: "image/card/back.png",
};

function renderCard() {
  const front = document.getElementById("cardFrontImg");
  const back = document.getElementById("cardBackImg");
  if (front) front.src = CARD.frontImage;
  if (back) back.src = CARD.backImage;
}

/* Free-drag 3D rotation on both axes, with real thickness edges. */
function attachCardDrag() {
  const tilt = document.getElementById("cardTilt");
  const flipCard = document.getElementById("flipCard");
  if (!tilt || !flipCard) return;

  let rotX = -12, rotY = 18;
  let dragging = false, lastX = 0, lastY = 0;
  let resumeTimer = null;
  const idleSpeed = 0.12; // degrees per frame — tweak for faster/slower spin

  function updateCardSize() {
    const rx = (rotX * Math.PI) / 180;
    const ry = (rotY * Math.PI) / 180;
    const facingFront = Math.cos(rx) * Math.cos(ry) > 0;
    flipCard.style.width = facingFront ? "300px" : "210px";
    flipCard.style.height = facingFront ? "210px" : "300px";
  }

  function apply() {
    tilt.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    updateCardSize();
  }
  apply();

  function idleLoop() {
    if (!dragging) {
      rotY += idleSpeed;
      apply();
    }
    requestAnimationFrame(idleLoop);
  }
  idleLoop();

  tilt.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragging = true;
    clearTimeout(resumeTimer);
    lastX = e.clientX; lastY = e.clientY;
    tilt.setPointerCapture(e.pointerId);
  });

  tilt.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    rotY += dx * 0.5;
    rotX -= dy * 0.5;
    apply();
    lastX = e.clientX; lastY = e.clientY;
  });

  function release() {
    dragging = false;
    // idleLoop resumes spinning on its own right away; no extra work needed
  }
  tilt.addEventListener("pointerup", release);
  tilt.addEventListener("pointercancel", release);

  tilt.addEventListener("dblclick", () => {
    rotX = -12; rotY = 18;
    apply();
  });
}

// ---- Custom animated cursor system --------------------------------
// Maps each CSS-cursor "role" you had to its icon. Update paths to
// match wherever your /icons/cursor folder actually lives.
const CURSOR_ICONS = {
  normal:     "./icons/cursor/normal.apng",
  link:       "./icons/cursor/link.apng",
  text:       "./icons/cursor/text.apng",
  notAllowed: "./icons/cursor/unavailable.apng",
  help:       "./icons/cursor/help.apng",
  loading:    "./icons/cursor/busy.apng",
  move:       "./icons/cursor/move.apng",
};

function initCustomCursor() {
  const cursorImg = document.createElement("img");
  cursorImg.id = "customCursor";
  cursorImg.src = CURSOR_ICONS.normal;
  cursorImg.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 32px; height: 32px;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(cursorImg);

  let currentKey = "normal";
  let forcedDragging = false;

  // Priority order matches the specificity your old CSS rules implied —
  // most "blocking" states win over generic ones.
  function pickCursorKey(target) {
    if (target.closest("[disabled], .disabled, .not-allowed")) return "notAllowed";
    if (target.closest(".help-trigger, help")) return "help";
    if (target.closest(".loading-state")) return "loading";
    if (forcedDragging || target.closest(".draggable, .card-tilt, .gem-tilt")) return "move";
    if (target.closest("a, span, button, [role='button'], input[type='submit']")) return "link";
    if (target.closest("p, h1, h2, h3, input[type='text'], textarea")) return "text";
    return "normal";
  }

  function shouldEnableEnhancedCursor() {
    return window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 821px)").matches;
  }

  function setCursor(key) {
    if (key === currentKey) return;
    currentKey = key;
    cursorImg.src = CURSOR_ICONS[key];
  }

  window.addEventListener("pointermove", (e) => {
    cursorImg.style.left = `${e.clientX}px`;
    cursorImg.style.top = `${e.clientY}px`;
    setCursor(pickCursorKey(e.target));
  });

  window.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".card-tilt, .gem-tilt, .draggable")) {
      forcedDragging = true;
      setCursor("move");
    }
  });
  window.addEventListener("pointerup", () => { forcedDragging = false; });

  document.addEventListener("mouseleave", () => { cursorImg.style.display = "none"; });
  document.addEventListener("mouseenter", () => { cursorImg.style.display = "block"; });
}

/* Liquid cursor trail: three blobs chase the pointer at different
   speeds; the SVG goo filter melts overlapping ones together. */
function initGooCursor() {
  const blobMain = document.getElementById("blobMain");
  const blobTrail1 = document.getElementById("blobTrail1");
  const blobTrail2 = document.getElementById("blobTrail2");
  if (!blobMain || !blobTrail1 || !blobTrail2) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let mx = mouseX, my = mouseY, t1x = mouseX, t1y = mouseY, t2x = mouseX, t2y = mouseY;

  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
  });

  const lerp = (a, b, n) => a + (b - a) * n;

  function raf() {
    mx = lerp(mx, mouseX, 0.25); my = lerp(my, mouseY, 0.25);
    t1x = lerp(t1x, mx, 0.18); t1y = lerp(t1y, my, 0.18);
    t2x = lerp(t2x, t1x, 0.12); t2y = lerp(t2y, t1y, 0.12);

    blobMain.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    blobTrail1.style.transform = `translate(${t1x}px, ${t1y}px) translate(-50%, -50%)`;
    blobTrail2.style.transform = `translate(${t2x}px, ${t2y}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  raf();
}
 
document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderSocials();
  renderCard();
  renderLinks();
  attachGemParallax();
  attachCardDrag();

  if (shouldEnableEnhancedCursor()) {
    document.body.classList.add("custom-cursor-enabled");
    initCustomCursor();
    initGooCursor();
  } else {
    document.body.classList.remove("custom-cursor-enabled");
  }
});