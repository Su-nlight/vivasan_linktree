/* ================================================================
   AMBIENT BACKGROUND — powered by liquid-gooey
   https://github.com/Jakubantalik/Libraries/tree/main/packages/liquid-gooey

   Replaces the old always-on SVG-filter blob layer (#gooBackdrop), which
   ran an expensive feGaussianBlur/feColorMatrix filter over big shapes on
   every device, all the time — one of the main causes of the throttling
   on mobile. liquid-gooey keeps the same "gooey blobs drifting behind the
   page" look, but the goo filter only ever runs over a small silhouette
   layer (not the real DOM), and its measurement loop sleeps when the
   blobs aren't moving — so it's cheap enough to leave on everywhere,
   phones included.

   This file is loaded as a plain ES module (see the <script type="module">
   + <script type="importmap"> in index.html) — no bundler/build step
   needed. liquid-gooey itself is vendored locally in
   /vendor/liquid-gooey/index.js (built from the repo above), so the
   effect doesn't depend on a third party CDN compiling the source at
   request time — only React itself is pulled from a CDN, which is a
   much safer bet.
   ================================================================ */

import { createElement as h, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Liquid } from "liquid-gooey";

// Same palette as the rest of the page (--aurora-1..4 in style.css).
const PALETTE = ["#ff2e9a", "#7c5cff", "#2fe6d6", "#ffb84d"];

// Slow-drifting anchor points for each blob, expressed as a fraction of
// the viewport so they scale sensibly at any screen size. Kept far apart
// on purpose — these are meant to glow softly in the corners, not merge.
const BLOB_SPOTS = [
  { left: "8%", top: "10%", size: 340, color: PALETTE[0] },
  { left: "82%", top: "16%", size: 300, color: PALETTE[1] },
  { left: "12%", top: "78%", size: 320, color: PALETTE[2] },
  { left: "86%", top: "74%", size: 260, color: PALETTE[3] },
];

function makeOffsets() {
  // Small random drift so the blobs feel alive without traveling far
  // enough to actually merge (that's the "morph" effect's job, not
  // this ambient layer's).
  return BLOB_SPOTS.map(() => ({
    x: (Math.random() - 0.5) * 46,
    y: (Math.random() - 0.5) * 46,
  }));
}

function LiquidBackdrop() {
  const [offsets, setOffsets] = useState(makeOffsets);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setOffsets(makeOffsets()), 7000);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return h(
    Liquid,
    {
      blur: 26,
      contrast: 14,
      fill: "rgba(255,255,255,0.5)",
      waviness: 16,
      className: "liquid-bg",
    },
    BLOB_SPOTS.map((spot, i) =>
      h(
        Liquid.Item,
        {
          key: i,
          x: offsets[i].x,
          y: offsets[i].y,
          transition: reducedMotion ? { duration: 0 } : "smooth",
        },
        h("div", {
          className: "liquid-bg-blob",
          style: {
            left: spot.left,
            top: spot.top,
            width: `${spot.size}px`,
            height: `${spot.size}px`,
            background: `radial-gradient(circle, ${spot.color}, transparent 72%)`,
          },
        })
      )
    )
  );
}

function mount() {
  const container = document.getElementById("liquidBgRoot");
  if (!container) return;
  try {
    createRoot(container).render(h(LiquidBackdrop));
  } catch (err) {
    // Fail quietly — this layer is purely decorative. If the CDN React
    // import or the library fails to load (offline, blocked, etc.) the
    // page still works fine without it.
    console.warn("liquid-gooey background failed to start:", err);
  }
}

mount();
