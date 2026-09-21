/* ============================================================
   CENTRAL HERO CHARACTER
   Original Himmel-inspired fantasy hero
   ------------------------------------------------------------
   Behaviour:
   - Eyes follow cursor
   - Head follows cursor very subtly
   - Hair ornament follows cursor
   - Eyebrows react slightly
   - Smooth spring-like movement
   - Returns to neutral when cursor leaves
   - Respects prefers-reduced-motion
   ============================================================ */

(() => {
  "use strict";


  /* ==========================================================
     ELEMENTS
     ========================================================== */

  const hero = document.getElementById("heroCharacter");

  const svg = document.getElementById("heroCharacterSvg");

  const head = document.getElementById("heroHead");

  const face = document.getElementById("heroFace");

  const eyeL = document.getElementById("heroEyeL");

  const eyeR = document.getElementById("heroEyeR");

  const browL = document.getElementById("heroBrowL");

  const browR = document.getElementById("heroBrowR");

  const ornament = document.getElementById("heroOrnament");

  const sword = document.getElementById("heroSword");


  /* ==========================================================
     SAFETY CHECK
     ========================================================== */

  if (
    !hero ||
    !svg ||
    !head ||
    !eyeL ||
    !eyeR ||
    !ornament
  ) {
    console.warn(
      "[Hero Character] Required SVG elements were not found."
    );

    return;
  }


  /* ==========================================================
     REDUCED MOTION
     ========================================================== */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


  /* ==========================================================
     POINTER STATE
     ========================================================== */

  const pointer = {
    targetX: 0,
    targetY: 0,

    currentX: 0,
    currentY: 0,

    active: false
  };


  /* ==========================================================
     CONFIGURATION
     ========================================================== */

  const CONFIG = {

    /*
     * Maximum eye movement.
     *
     * Keep this small.
     * The goal is "quietly watching you",
     * not cartoon googly eyes.
     */

    eyeX: 6.5,
    eyeY: 4.5,


    /*
     * Head movement is intentionally tiny.
     */

    headX: 2.8,
    headY: 1.8,


    /*
     * Hair ornament movement.
     */

    ornamentX: 3.5,
    ornamentY: 2.0,


    /*
     * Eyebrow movement.
     */

    browX: 1.5,
    browY: 0.8,


    /*
     * Sword movement is almost imperceptible.
     */

    swordX: 0.7,
    swordY: 0.4,


    /*
     * Smoothness.
     *
     * Higher = faster response.
     * Lower = more floaty.
     */

    smoothing: 0.075
  };


  /* ==========================================================
     UTILITY FUNCTIONS
     ========================================================== */

  function clamp(value, min, max) {
    return Math.min(
      Math.max(value, min),
      max
    );
  }


  function lerp(current, target, amount) {
    return current + (
      target - current
    ) * amount;
  }


  /*
   * Convert viewport pointer coordinates into:
   *
   *      -1 ........ 0 ........ +1
   *
   * X:
   * left = -1
   * center = 0
   * right = +1
   *
   * Y:
   * top = -1
   * center = 0
   * bottom = +1
   */

  function normalizePointer(event) {

    const x =
      (event.clientX / window.innerWidth) * 2 - 1;

    const y =
      (event.clientY / window.innerHeight) * 2 - 1;

    pointer.targetX = clamp(x, -1, 1);

    pointer.targetY = clamp(y, -1, 1);

    pointer.active = true;
  }


  /* ==========================================================
     POINTER EVENTS
     ========================================================== */

  window.addEventListener(
    "pointermove",
    normalizePointer,
    {
      passive: true
    }
  );


  window.addEventListener(
    "pointerleave",
    () => {
      pointer.active = false;

      pointer.targetX = 0;
      pointer.targetY = 0;
    },
    {
      passive: true
    }
  );


  /*
   * On touch devices there isn't really a cursor to follow.
   * Keep the character looking forward.
   */

  window.addEventListener(
    "touchstart",
    () => {
      pointer.active = false;

      pointer.targetX = 0;
      pointer.targetY = 0;
    },
    {
      passive: true
    }
  );


  /* ==========================================================
     BASE TRANSFORMS
     ========================================================== */

  /*
   * Eyes originally live at:
   *
   * Left  = 222,190
   * Right = 278,190
   */

  const EYE_L_BASE = {
    x: 222,
    y: 190
  };

  const EYE_R_BASE = {
    x: 278,
    y: 190
  };


  /*
   * Ornament.
   */

  const ORNAMENT_BASE = {
    x: 250,
    y: 68
  };


  /* ==========================================================
     ANIMATION LOOP
     ========================================================== */

  function animate() {

    /*
     * Reduced-motion mode:
     * Keep everything centered.
     */

    if (reducedMotion.matches) {

      pointer.currentX = 0;
      pointer.currentY = 0;

    } else {

      pointer.currentX = lerp(
        pointer.currentX,
        pointer.targetX,
        CONFIG.smoothing
      );

      pointer.currentY = lerp(
        pointer.currentY,
        pointer.targetY,
        CONFIG.smoothing
      );

    }


    const x = pointer.currentX;

    const y = pointer.currentY;


    /* ========================================================
       EYES
       ======================================================== */

    const eyeDX =
      x * CONFIG.eyeX;

    const eyeDY =
      y * CONFIG.eyeY;


    eyeL.setAttribute(
      "transform",
      `translate(
        ${EYE_L_BASE.x + eyeDX},
        ${EYE_L_BASE.y + eyeDY}
      )`
    );


    eyeR.setAttribute(
      "transform",
      `translate(
        ${EYE_R_BASE.x + eyeDX},
        ${EYE_R_BASE.y + eyeDY}
      )`
    );


    /* ========================================================
       HEAD
       ======================================================== */

    /*
     * The head should follow the cursor,
     * but much less than the eyes.
     *
     * A tiny rotation creates the feeling
     * that the character is actually looking at you.
     */

    const headDX =
      x * CONFIG.headX;

    const headDY =
      y * CONFIG.headY;

    const headRotation =
      x * 1.15;


    head.setAttribute(
      "transform",
      `
        translate(${headDX} ${headDY})
        rotate(${headRotation} 250 205)
      `
    );


    /* ========================================================
       EYEBROWS
       ======================================================== */

    if (browL && browR) {

      const browDX =
        x * CONFIG.browX;

      const browDY =
        y * CONFIG.browY;


      browL.setAttribute(
        "transform",
        `translate(${browDX} ${browDY})`
      );


      browR.setAttribute(
        "transform",
        `translate(${browDX} ${browDY})`
      );
    }


    /* ========================================================
       HAIR ORNAMENT
       ======================================================== */

    const ornamentDX =
      x * CONFIG.ornamentX;

    const ornamentDY =
      y * CONFIG.ornamentY;


    ornament.setAttribute(
      "transform",
      `
        translate(${ornamentDX} ${ornamentDY})
        rotate(${x * 3} 250 68)
      `
    );


    /* ========================================================
       SWORD
       ======================================================== */

    if (sword) {

      const swordDX =
        x * CONFIG.swordX;

      const swordDY =
        y * CONFIG.swordY;


      sword.setAttribute(
        "transform",
        `translate(${swordDX} ${swordDY})`
      );
    }


    requestAnimationFrame(animate);
  }


  /* ==========================================================
     START
     ========================================================== */

  animate();


  /* ==========================================================
     OPTIONAL DEBUG
     ========================================================== */

  /*
   * Uncomment while tuning:
   *
   * console.log(
   *   pointer.currentX,
   *   pointer.currentY
   * );
   */

})();