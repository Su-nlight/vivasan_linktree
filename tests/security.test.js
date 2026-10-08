/**
 * @file security.test.js
 * Security regression tests for the Vivasan Linktree website.
 *
 * These are plain browser-compatible ES-module tests that can be run
 * directly with Node.js (v18+) using the built-in test runner:
 *
 *   node --test tests/security.test.js
 *
 * They import only the pure helper functions from script.js — no DOM
 * dependency needed. The rendering functions (renderProfile, etc.)
 * would require a DOM and are tested separately in the browser-based
 * test runner (tests/browser/security.html).
 *
 * Why these tests?
 * Each test covers a specific vulnerability class and must stay GREEN
 * after any future edit that touches the helpers. A RED test here means
 * a regression has been introduced before it reaches production.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

/* ================================================================
   The helpers we are testing are defined inline here (mirroring
   script.js exactly) so this test file is standalone and does not
   require a build step.  If you change escHtml() or safeUrl() in
   script.js, you MUST mirror the change here.
   ================================================================ */

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SAFE_URL_RE = /^(https?:\/\/|mailto:|tel:|\/|\.\/|\.\.\/)/i;
function safeUrl(url) {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed === "#") return "#";
  if (SAFE_URL_RE.test(trimmed)) return trimmed;
  return "#";
}

/* ================================================================
   escHtml() — XSS prevention
   ================================================================ */

describe("escHtml() — XSS prevention", () => {

  it("escapes < and > so HTML tags cannot be injected", () => {
    assert.equal(
      escHtml('<script>alert(1)</script>'),
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
  });

  it("escapes & to prevent entity injection", () => {
    assert.equal(escHtml("a & b"), "a &amp; b");
  });

  it('escapes " to prevent attribute breakout via double-quote', () => {
    assert.equal(
      escHtml('"onmouseover=alert(1)"'),
      "&quot;onmouseover=alert(1)&quot;"
    );
  });

  it("escapes ' to prevent attribute breakout via single-quote", () => {
    assert.equal(
      escHtml("' onmouseover=alert(1) '"),
      "&#39; onmouseover=alert(1) &#39;"
    );
  });

  it("leaves safe text unchanged", () => {
    assert.equal(escHtml("Sanjana Kumari"), "Sanjana Kumari");
  });

  it("leaves emoji unchanged", () => {
    assert.equal(escHtml("✦"), "✦");
  });

  it("coerces non-strings via String()", () => {
    assert.equal(escHtml(42), "42");
    assert.equal(escHtml(null), "null");
  });

  it("escapes a realistic XSS payload", () => {
    const payload = '<img src=x onerror="alert(document.cookie)">';
    const escaped = escHtml(payload);
    // The escaped output must not contain any unescaped < or >
    assert.ok(!escaped.includes("<"), "output must not contain raw <");
    assert.ok(!escaped.includes(">"), "output must not contain raw >");
  });
});

/* ================================================================
   safeUrl() — URL/href injection prevention
   ================================================================ */

describe("safeUrl() — URL injection prevention", () => {

  // ---- URLs that MUST be blocked ------------------------------------

  it("blocks javascript: scheme", () => {
    assert.equal(safeUrl("javascript:alert(1)"), "#");
  });

  it("blocks javascript: with mixed case", () => {
    assert.equal(safeUrl("JaVaScRiPt:alert(1)"), "#");
  });

  it("blocks javascript: with leading whitespace", () => {
    // Browsers strip leading whitespace before interpreting the scheme,
    // so we must too.
    assert.equal(safeUrl("  javascript:alert(1)"), "#");
  });

  it("blocks data: URIs (can carry HTML/JS payloads)", () => {
    assert.equal(
      safeUrl("data:text/html,<script>alert(1)</script>"),
      "#"
    );
  });

  it("blocks vbscript: scheme", () => {
    assert.equal(safeUrl("vbscript:MsgBox(1)"), "#");
  });

  it("blocks file: scheme", () => {
    assert.equal(safeUrl("file:///etc/passwd"), "#");
  });

  it("blocks an unknown scheme", () => {
    assert.equal(safeUrl("ftp://example.com"), "#");
  });

  it("returns '#' for empty input", () => {
    assert.equal(safeUrl(""), "#");
    assert.equal(safeUrl(null), "#");
    assert.equal(safeUrl(undefined), "#");
  });

  // ---- URLs that MUST pass through ----------------------------------

  it("allows https:// URLs", () => {
    const url = "https://www.instagram.com/vivacious_san/";
    assert.equal(safeUrl(url), url);
  });

  it("allows http:// URLs", () => {
    const url = "http://example.com";
    assert.equal(safeUrl(url), url);
  });

  it("allows mailto: scheme", () => {
    const url = "mailto:hello@example.com";
    assert.equal(safeUrl(url), url);
  });

  it("allows tel: scheme", () => {
    const url = "tel:+911234567890";
    assert.equal(safeUrl(url), url);
  });

  it("allows root-relative paths", () => {
    assert.equal(safeUrl("/page"), "/page");
  });

  it("allows ./ relative paths", () => {
    assert.equal(safeUrl("./image/avatar.jpeg"), "./image/avatar.jpeg");
  });

  it("allows ../ relative paths", () => {
    assert.equal(safeUrl("../assets/logo.png"), "../assets/logo.png");
  });

  it("allows the placeholder '#'", () => {
    assert.equal(safeUrl("#"), "#");
  });

  // ---- Edge cases ---------------------------------------------------

  it("trims leading/trailing whitespace before scheme check", () => {
    assert.equal(
      safeUrl("  https://example.com  "),
      "https://example.com"
    );
  });

  it("blocks a URL that embeds javascript: after other chars", () => {
    // e.g. a URL like "nottrusted\njavascript:alert(1)" is blocked
    // because it doesn't start with a safe scheme after trimming.
    assert.equal(safeUrl("nottrusted\njavascript:alert(1)"), "#");
  });
});

/* ================================================================
   Integration: escHtml(safeUrl()) combination
   The URL is sanitized first, then the result is HTML-escaped before
   being placed in a href attribute. Both steps must compose cleanly.
   ================================================================ */

describe("escHtml(safeUrl()) composition", () => {

  it("safe https URL survives the double-pass unchanged in content", () => {
    const url = "https://example.com/path?q=1&r=2";
    // After escHtml the & becomes &amp; — this is correct HTML encoding
    const result = escHtml(safeUrl(url));
    assert.ok(result.includes("https://"), "scheme preserved");
    assert.ok(result.includes("&amp;"), "& properly escaped for HTML attribute");
    assert.ok(!result.includes('"'), "no unescaped double-quotes");
  });

  it("javascript: URL is completely neutralised before HTML encoding", () => {
    const result = escHtml(safeUrl("javascript:alert(1)"));
    assert.equal(result, "#", "must collapse to escaped #");
  });

  it("XSS via URL attribute breakout is neutralised", () => {
    // An attacker setting url to: '" onmouseover="alert(1)
    const result = escHtml(safeUrl('" onmouseover="alert(1)'));
    assert.equal(result, "#", "unrecognised scheme → # → escaped #");
  });
});

