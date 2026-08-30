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
 
document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderSocials();
  renderLinks();
  attachGemParallax();
});