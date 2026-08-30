/* ================================================================
   EDIT ME — everything on the page is generated from the three
   blocks below. To add a link, just add another object to LINKS.
   No HTML editing required.
   ================================================================ */

// ---- Your profile ------------------------------------------------
const PROFILE = {
  name: "Vivacious San",
  tagline: "Digital painter · motion artist",
  // Leave avatarUrl empty to show initials instead of a photo.
  // To use your own photo, put the file next to this one and set
  // avatarUrl: "me.jpg"
  avatarUrl: "",
  initials: "VS",
};

// ---- Social icon row (small circular pills) -----------------------
// "icon" accepts any emoji or short glyph. Order = display order.
const SOCIALS = [
  { label: "Instagram", url: "#", icon: "📷" },
  { label: "X / Twitter", url: "#", icon: "𝕏" },
  { label: "Dribbble", url: "#", icon: "🏀" },
  { label: "YouTube", url: "#", icon: "▶" },
];

// ---- Main link list (the big glass cards) --------------------------
// "sub" is optional small caption text under the label.
const LINKS = [
  {
    label: "Portfolio",
    sub: "Selected work, 2021–2026",
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

function renderSocials() {
  const el = document.getElementById("socials");
  el.innerHTML = SOCIALS.map(
    (s) => `
    <a class="social-pill" href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}">
      <span aria-hidden="true">${s.icon}</span>
    </a>`
  ).join("");
}

function renderLinks() {
  const el = document.getElementById("links");
  el.innerHTML = LINKS.map(
    (l) => `
    <a class="link-card" href="${l.url}" target="_blank" rel="noopener noreferrer">
      <span class="link-icon" aria-hidden="true">${l.icon || "→"}</span>
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

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderSocials();
  renderLinks();
});
