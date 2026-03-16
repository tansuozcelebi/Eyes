// Googly Eyes Content Script
(function () {
  if (document.getElementById('googly-eyes-container')) return;

  const style = document.createElement('style');
  style.textContent = `
    #googly-eyes-container {
      position: fixed;
      top: 24px;
      right: 24px;
      display: flex;
      gap: 10px;
      z-index: 2147483647;
      pointer-events: auto;
      user-select: none;
      filter: drop-shadow(0 4px 16px rgba(0,0,0,0.22));
      transition: opacity 0.3s, transform 0.25s cubic-bezier(.4,1.4,.6,1), filter 0.25s ease;
      cursor: grab;
    }
    #googly-eyes-container.dragging {
      cursor: grabbing;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.10));
    }
    #googly-eyes-shadow {
      position: fixed;
      display: flex;
      gap: 10px;
      z-index: 2147483646;
      pointer-events: none;
      transition: transform 0.25s cubic-bezier(.4,1.4,.6,1), opacity 0.25s ease;
      transform: scale(1);
      opacity: 0;
    }
    #googly-eyes-shadow.visible {
      opacity: 1;
      transform: scale(0.7);
    }
    .shadow-eye {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.08) 60%, transparent 100%);
      filter: blur(4px);
    }
    #googly-eyes-container.hidden {
      opacity: 0;
    }
    .googly-eye {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: radial-gradient(ellipse at 38% 32%, #fff 60%, #e8e0d8 100%);
      border: 3px solid #1a1008;
      box-shadow: inset 0 3px 10px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
    .googly-pupil {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #4a3728 0%, #1a0a00 70%);
      position: absolute;
      transition: transform 0.05s linear, background 0.3s ease;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    }
    .googly-pupil::after {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(255,255,255,0.85);
      position: absolute;
      top: 3px;
      left: 4px;
    }
    .googly-pupil::before {
      content: '';
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      position: absolute;
      top: 12px;
      left: 13px;
    }
    .eyelid {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      height: 50%;
      background: #f5c18a;
      border-radius: 52px 52px 0 0;
      border-top: 3px solid #1a1008;
      border-left: 3px solid #1a1008;
      border-right: 3px solid #1a1008;
      z-index: 2;
      transition: transform 0.25s cubic-bezier(.4,2,.6,1);
      transform-origin: top center;
    }
    .eyelash {
      position: absolute;
      top: -10px;
      left: 50%;
      width: 2px;
      border-radius: 2px;
      background: #1a1008;
      transform-origin: bottom center;
      pointer-events: none;
      z-index: 4;
    }
    .eye-wing {
      position: absolute;
      height: 3px;
      border-radius: 999px;
      pointer-events: none;
      z-index: 4;
    }
    @keyframes eyeGrow {
      0% { transform: scale(1); }
      50% { transform: scale(3); }
      100% { transform: scale(1); }
    }
    @keyframes pupilSpin {
      0% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(5px, 5px) rotate(90deg); }
      50% { transform: translate(-5px, 5px) rotate(180deg); }
      75% { transform: translate(-5px, -5px) rotate(270deg); }
      100% { transform: translate(0, 0) rotate(360deg); }
    }
    .googly-eye.clicked {
      animation: eyeGrow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .googly-pupil.spin {
      animation: pupilSpin 0.6s ease-in-out;
    }
    @keyframes catGlowPulse {
      0%, 100% {
        box-shadow: inset 0 0 10px rgba(255,255,150,0.5), 0 0 10px rgba(255,140,36,0.8), 0 0 18px rgba(255,90,10,0.55);
        filter: brightness(1);
      }
      50% {
        box-shadow: inset 0 0 14px rgba(255,255,170,0.65), 0 0 14px rgba(255,150,45,0.95), 0 0 24px rgba(255,95,12,0.78);
        filter: brightness(1.06);
      }
    }
    @keyframes catPupilGlowPulse {
      0%, 100% {
        filter: drop-shadow(0 0 1px rgba(255,180,70,0.2));
      }
      50% {
        filter: drop-shadow(0 0 4px rgba(255,210,110,0.65));
      }
    }
    .googly-eye.cat-animated {
      animation: catGlowPulse 2.2s ease-in-out infinite;
      will-change: box-shadow, filter;
    }
    .googly-eye.cat-animated .googly-pupil {
      animation: catPupilGlowPulse 2.2s ease-in-out infinite;
    }
    @keyframes bounce {
      0% { opacity: 1; }
      50% { opacity: 0.6; }
      100% { opacity: 0.2; }
    }
    @keyframes pop {
      0% { transform: scale(0.3) translateX(0) translateY(0); opacity: 0; }
      50% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1) translateX(0) translateY(0); opacity: 1; }
    }
    #googly-eyes-container.bouncing {
      animation: bounce 3s ease-in;
      pointer-events: none;
    }
    #googly-eyes-container.popping {
      animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.id = 'googly-eyes-container';

  const EYE_STYLES = {
    classic: {
      eyeWidth: 52,
      eyeHeight: 52,
      eyeRadiusLeft: '50%',
      eyeRadiusRight: '50%',
      eyeBg: 'radial-gradient(ellipse at 38% 32%, #fff 60%, #e8e0d8 100%)',
      eyeBorderWidth: 3,
      eyeBorderColor: '#1a1008',
      eyeInsetShadow: 'inset 0 3px 10px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.18)',
      pupilWidth: 22,
      pupilHeight: 22,
      pupilRadius: '50%',
      pupilShadow: '0 2px 6px rgba(0,0,0,0.4)',
      lidHeight: 50,
      lidBg: '#f5c18a',
      lidRadiusLeft: '52px 52px 0 0',
      lidRadiusRight: '52px 52px 0 0',
      lidBorderWidth: 3,
      lidBorderColor: '#1a1008',
      hideLid: false,
      lashes: null
    },
    woman: {
      eyeWidth: 78,
      eyeHeight: 34,
      eyeRadiusLeft: '82% 52% 72% 60% / 95% 78% 40% 42%',
      eyeRadiusRight: '52% 82% 60% 72% / 78% 95% 42% 40%',
      eyeBg: 'radial-gradient(ellipse at 43% 58%, #fffdf8 56%, #f4dcca 100%)',
      eyeBorderWidth: 2.5,
      eyeBorderColor: '#2c1a12',
      eyeInsetShadow: 'inset 0 2px 6px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.2)',
      pupilWidth: 18,
      pupilHeight: 14,
      pupilRadius: '52%',
      pupilShadow: '0 2px 5px rgba(0,0,0,0.35)',
      lidHeight: 67,
      lidTop: -16,
      lidBg: 'linear-gradient(180deg, #4d67c7 0%, #3653b7 62%, #2e449b 100%)',
      lidRadiusLeft: '95% 62% 0 0',
      lidRadiusRight: '62% 95% 0 0',
      lidBorderWidth: 2.5,
      lidBorderColor: '#2c1a12',
      hideLid: false,
      lashes: {
        count: 9,
        innerLength: 12,
        outerLength: 22,
        spread: 76,
        width: 2,
        color: '#1a1008',
        startX: 9,
        endX: 88,
        anchorY: -6,
        baseTilt: 0
      },
      wing: { color: '#1a1008', length: 15, top: 8, offset: -5, angle: 22 }
    },
    cat: {
      eyeWidth: 88,
      eyeHeight: 36,
      eyeRadiusLeft: '56% 44% 54% 46% / 86% 78% 22% 20%',
      eyeRadiusRight: '44% 56% 46% 54% / 78% 86% 20% 22%',
      eyeClipLeft: 'polygon(0 52%, 16% 10%, 84% 8%, 100% 50%, 84% 94%, 16% 92%)',
      eyeClipRight: 'polygon(0 50%, 16% 8%, 84% 10%, 100% 52%, 84% 92%, 16% 94%)',
      eyeBg: 'radial-gradient(ellipse at 55% 52%, #fff87a 0%, #ffe84b 38%, #ffc12b 68%, #ff7a1f 100%)',
      eyeBorderWidth: 2,
      eyeBorderColor: '#9b3f00',
      eyeInsetShadow: 'inset 0 0 10px rgba(255,255,150,0.5), 0 0 10px rgba(255,140,36,0.8), 0 0 18px rgba(255,90,10,0.55)',
      pupilWidth: 6,
      pupilHeight: 24,
      pupilRadius: '46% / 60%',
      pupilShadow: '0 0 6px rgba(0,0,0,0.5)',
      lidHeight: 40,
      lidBg: '#d9be7a',
      lidRadiusLeft: '80% 60% 0 0',
      lidRadiusRight: '60% 80% 0 0',
      lidBorderWidth: 3,
      lidBorderColor: '#241808',
      hideLid: true,
      lashes: null
    },
    dragon: {
      eyeWidth: 62,
      eyeHeight: 36,
      eyeRadiusLeft: '80% 56% 74% 58% / 88% 80% 46% 40%',
      eyeRadiusRight: '56% 80% 58% 74% / 80% 88% 40% 46%',
      eyeBg: 'radial-gradient(ellipse at 40% 32%, #f6ffb8 45%, #d7ea77 100%)',
      eyeBorderWidth: 3,
      eyeBorderColor: '#3f2f09',
      eyeInsetShadow: 'inset 0 2px 8px rgba(66,63,0,0.25), 0 2px 8px rgba(0,0,0,0.2)',
      pupilWidth: 9,
      pupilHeight: 26,
      pupilRadius: '46% / 62%',
      pupilShadow: '0 1px 5px rgba(0,0,0,0.55)',
      lidHeight: 42,
      lidBg: '#95b24e',
      lidRadiusLeft: '85% 55% 0 0',
      lidRadiusRight: '55% 85% 0 0',
      lidBorderWidth: 3,
      lidBorderColor: '#3f2f09',
      hideLid: false,
      lashes: null
    },
    donkey: {
      eyeWidth: 58,
      eyeHeight: 56,
      eyeRadiusLeft: '50%',
      eyeRadiusRight: '50%',
      eyeBg: 'radial-gradient(ellipse at 38% 30%, #ffffff 58%, #e8e1da 100%)',
      eyeBorderWidth: 3,
      eyeBorderColor: '#2c2014',
      eyeInsetShadow: 'inset 0 3px 10px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.18)',
      pupilWidth: 24,
      pupilHeight: 24,
      pupilRadius: '50%',
      pupilShadow: '0 2px 6px rgba(0,0,0,0.4)',
      lidHeight: 50,
      lidBg: '#d9bf9f',
      lidRadiusLeft: '52px 52px 0 0',
      lidRadiusRight: '52px 52px 0 0',
      lidBorderWidth: 3,
      lidBorderColor: '#2c2014',
      hideLid: false,
      lashes: null
    },
    fish: {
      eyeWidth: 62,
      eyeHeight: 62,
      eyeRadiusLeft: '50%',
      eyeRadiusRight: '50%',
      eyeBg: 'radial-gradient(ellipse at 40% 32%, #ecf8ff 45%, #c5e8ff 100%)',
      eyeBorderWidth: 2.5,
      eyeBorderColor: '#245a6b',
      eyeInsetShadow: 'inset 0 4px 10px rgba(0,55,78,0.15), 0 2px 10px rgba(0,0,0,0.2)',
      pupilWidth: 20,
      pupilHeight: 20,
      pupilRadius: '50%',
      pupilShadow: '0 2px 6px rgba(0,0,0,0.35)',
      lidHeight: 50,
      lidBg: '#8fc5da',
      lidRadiusLeft: '52px 52px 0 0',
      lidRadiusRight: '52px 52px 0 0',
      lidBorderWidth: 2.5,
      lidBorderColor: '#245a6b',
      hideLid: true,
      lashes: null
    },
    frog: {
      eyeWidth: 58,
      eyeHeight: 50,
      eyeRadiusLeft: '64% 64% 58% 58% / 80% 80% 52% 52%',
      eyeRadiusRight: '64% 64% 58% 58% / 80% 80% 52% 52%',
      eyeBg: 'radial-gradient(ellipse at 40% 30%, #e8ffd4 48%, #b9e391 100%)',
      eyeBorderWidth: 3,
      eyeBorderColor: '#29471b',
      eyeInsetShadow: 'inset 0 3px 8px rgba(0,60,0,0.16), 0 2px 8px rgba(0,0,0,0.18)',
      pupilWidth: 26,
      pupilHeight: 10,
      pupilRadius: '55%',
      pupilShadow: '0 2px 5px rgba(0,0,0,0.4)',
      lidHeight: 42,
      lidBg: '#9ec978',
      lidRadiusLeft: '52px 52px 0 0',
      lidRadiusRight: '52px 52px 0 0',
      lidBorderWidth: 3,
      lidBorderColor: '#29471b',
      hideLid: false,
      lashes: null
    }
  };

  let currentPupilColor = '#1a0a00';
  let currentEyeStyle = 'classic';

  function addLashes(lidEl, lashConfig, side) {
    if (!lashConfig || !lashConfig.count) return;

    const count = lashConfig.count;
    for (let i = 0; i < count; i++) {
      const lash = document.createElement('span');
      lash.className = 'eyelash';
      const t = count === 1 ? 0.5 : i / (count - 1);
      const outerBias = side === 'left' ? (1 - t) : t;
      const innerLength = lashConfig.innerLength || lashConfig.length || 14;
      const outerLength = lashConfig.outerLength || lashConfig.length || 14;
      const lashLength = innerLength + (outerLength - innerLength) * outerBias;

      lash.style.height = `${lashLength}px`;
      lash.style.width = `${lashConfig.width}px`;
      lash.style.background = lashConfig.color;

      const startX = lashConfig.startX === undefined ? 12 : lashConfig.startX;
      const endX = lashConfig.endX === undefined ? 88 : lashConfig.endX;
      const x = count === 1 ? 50 : (startX + ((endX - startX) * i) / (count - 1));
      const baseAngle = count === 1 ? 0 : (-lashConfig.spread / 2) + (lashConfig.spread * i) / (count - 1);
      const wing = side === 'left' ? -10 : 10;
      const extraTilt = lashConfig.baseTilt || 0;

      lash.style.left = `${x}%`;
      lash.style.top = `${lashConfig.anchorY === undefined ? -6 : lashConfig.anchorY}px`;
      lash.style.transform = `translateX(-50%) rotate(${baseAngle + wing + extraTilt}deg)`;
      lidEl.appendChild(lash);
    }
  }

  function addWing(eyeEl, wingConfig, side) {
    if (!wingConfig) return;

    const wing = document.createElement('span');
    wing.className = 'eye-wing';
    wing.style.background = wingConfig.color;
    wing.style.width = `${wingConfig.length}px`;
    wing.style.top = `${wingConfig.top}px`;

    if (side === 'left') {
      wing.style.left = `${wingConfig.offset}px`;
      wing.style.transform = `rotate(${-Math.abs(wingConfig.angle)}deg)`;
    } else {
      wing.style.right = `${wingConfig.offset}px`;
      wing.style.transform = `rotate(${Math.abs(wingConfig.angle)}deg)`;
    }

    eyeEl.appendChild(wing);
  }

  function applyPresetToEye(target, preset, side) {
    target.eye.querySelectorAll('.eyelash, .eye-wing').forEach((el) => el.remove());
    target.eye.style.width = `${preset.eyeWidth}px`;
    target.eye.style.height = `${preset.eyeHeight}px`;
    target.eye.style.borderRadius = side === 'left' ? preset.eyeRadiusLeft : preset.eyeRadiusRight;
    const eyeClipPath = side === 'left'
      ? (preset.eyeClipLeft || 'none')
      : (preset.eyeClipRight || preset.eyeClipLeft || 'none');
    target.eye.style.clipPath = eyeClipPath;
    target.eye.style.webkitClipPath = eyeClipPath;
    target.eye.style.background = preset.eyeBg;
    target.eye.style.border = `${preset.eyeBorderWidth}px solid ${preset.eyeBorderColor}`;
    target.eye.style.boxShadow = preset.eyeInsetShadow;

    target.pupil.style.width = `${preset.pupilWidth}px`;
    target.pupil.style.height = `${preset.pupilHeight}px`;
    target.pupil.style.borderRadius = preset.pupilRadius;
    target.pupil.style.boxShadow = preset.pupilShadow;

    if (preset.hideLid) {
      target.lid.style.display = 'none';
      target.lid.innerHTML = '';
      return;
    }

    target.lid.style.display = 'block';
    target.lid.style.top = `${preset.lidTop === undefined ? -2 : preset.lidTop}px`;
    target.lid.style.height = `${preset.lidHeight}%`;
    target.lid.style.background = preset.lidBg;
    target.lid.style.borderRadius = side === 'left' ? preset.lidRadiusLeft : preset.lidRadiusRight;
    target.lid.style.borderTop = `${preset.lidBorderWidth}px solid ${preset.lidBorderColor}`;
    target.lid.style.borderLeft = `${preset.lidBorderWidth}px solid ${preset.lidBorderColor}`;
    target.lid.style.borderRight = `${preset.lidBorderWidth}px solid ${preset.lidBorderColor}`;
    target.lid.innerHTML = '';
    addLashes(target.lid, preset.lashes, side);
    addWing(target.eye, preset.wing, side);
  }

  function applyEyeStyle(styleName) {
    const preset = EYE_STYLES[styleName] || EYE_STYLES.classic;
    currentEyeStyle = EYE_STYLES[styleName] ? styleName : 'classic';
    applyPresetToEye(left, preset, 'left');
    applyPresetToEye(right, preset, 'right');
    const isCat = currentEyeStyle === 'cat';
    left.eye.classList.toggle('cat-animated', isCat);
    right.eye.classList.toggle('cat-animated', isCat);
    applyPupilColor(currentPupilColor);
    positionShadow();
  }

  function playClickAnimation(eye, pupil) {
    eye.classList.add('clicked');
    pupil.classList.add('spin');
    
    setTimeout(() => {
      eye.classList.remove('clicked');
      pupil.classList.remove('spin');
    }, 600);
  }

  function createEye() {
    const eye = document.createElement('div');
    eye.className = 'googly-eye';
    const lid = document.createElement('div');
    lid.className = 'eyelid';
    const pupil = document.createElement('div');
    pupil.className = 'googly-pupil';
    eye.appendChild(lid);
    eye.appendChild(pupil);
    return { eye, pupil, lid };
  }

  const left = createEye();
  const right = createEye();
  container.appendChild(left.eye);
  container.appendChild(right.eye);

  // Shadow element (stays on the "ground" when eyes are lifted)
  const shadow = document.createElement('div');
  shadow.id = 'googly-eyes-shadow';
  const shadowLeft = document.createElement('div');
  shadowLeft.className = 'shadow-eye';
  const shadowRight = document.createElement('div');
  shadowRight.className = 'shadow-eye';
  shadow.appendChild(shadowLeft);
  shadow.appendChild(shadowRight);

  document.body.appendChild(shadow);
  document.body.appendChild(container);

  // Add click animations (only fire if not dragging)
  let wasDragged = false;
  let isAmplified = false;
  let lastClickTime = 0;
  let clickCount = 0;
  const DOUBLE_CLICK_DELAY = 300;

  function onEyeClick(e) {
    if (wasDragged) return;
    
    const now = Date.now();
    if (now - lastClickTime < DOUBLE_CLICK_DELAY) {
      clickCount++;
    } else {
      clickCount = 1;
    }
    lastClickTime = now;

    if (clickCount === 2) {
      performBounceAnimation();
      clickCount = 0;
    } else {
      playClickAnimation(left.eye, left.pupil);
      playClickAnimation(right.eye, right.pupil);
    }
  }

  function performBounceAnimation() {
    if (isAmplified) return;
    isAmplified = true;
    
    // Save original position
    const originalPos = {
      left: container.getBoundingClientRect().left,
      top: container.getBoundingClientRect().top
    };

    container.classList.add('bouncing');
    shadow.classList.remove('visible');

    // Bounce randomly around screen for 3 seconds
    const bounceInterval = setInterval(() => {
      const newX = Math.random() * (window.innerWidth - container.offsetWidth);
      const newY = Math.random() * (window.innerHeight - container.offsetHeight);
      container.style.left = newX + 'px';
      container.style.top = newY + 'px';
    }, 200);

    // Stop bouncing and return to original position after 3 seconds
    setTimeout(() => {
      clearInterval(bounceInterval);
      container.classList.remove('bouncing');
      
      // Switch to left/top positioning if needed
      container.style.right = 'auto';
      container.style.left = originalPos.left + 'px';
      container.style.top = originalPos.top + 'px';
      
      // Pop effect
      container.classList.add('popping');
      
      setTimeout(() => {
        container.classList.remove('popping');
        isAmplified = false;
        // Show shadow again
        shadow.classList.add('visible');
      }, 400);
    }, 3000);
  }

  left.eye.addEventListener('click', onEyeClick);
  right.eye.addEventListener('click', onEyeClick);
  container.style.pointerEvents = 'auto';

  // --- Drag & Drop ---
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function positionShadow() {
    const rect = container.getBoundingClientRect();
    shadow.style.left = (rect.left + rect.width * 0.15) + 'px';
    shadow.style.top = (rect.top + rect.height * 0.85) + 'px';
  }

  container.addEventListener('mousedown', (e) => {
    // Start drag
    isDragging = true;
    wasDragged = false;
    const rect = container.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    container.classList.add('dragging');
    // Switch from right-anchored to left-anchored positioning
    container.style.left = rect.left + 'px';
    container.style.top = rect.top + 'px';
    container.style.right = 'auto';
    updateTransform();
    // Show shadow at pickup position
    positionShadow();
    shadow.classList.add('visible');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    wasDragged = true;
    let newX = e.clientX - dragOffsetX;
    let newY = e.clientY - dragOffsetY;
    // Clamp to viewport
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    newX = Math.max(0, Math.min(window.innerWidth - w, newX));
    newY = Math.max(0, Math.min(window.innerHeight - h, newY));
    container.style.left = newX + 'px';
    container.style.top = newY + 'px';
    // Move shadow to follow underneath
    positionShadow();
    updateTransform();
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      container.classList.remove('dragging');
      shadow.classList.remove('visible');
      updateTransform();
      // Reset wasDragged after a tick so click event can check it
      setTimeout(() => { wasDragged = false; }, 0);
    }
  });
  // --- End Drag & Drop ---

  // --- Scroll Zoom ---
  let scale = 1;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 3;

  function updateTransform() {
    let transform = `scale(${scale})`;
    if (isDragging) {
      transform += ' scale(1.08) translateY(-6px)';
    }
    container.style.transform = transform;
    
    // Update shadow scale along with container
    shadow.style.transform = `scale(${scale * 0.7})`;
  }

  container.addEventListener('wheel', (e) => {
    if (isAmplified) return; // Don't zoom during bounce animation
    
    e.preventDefault();
    
    // Scroll up = zoom in, scroll down = zoom out
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * scaleFactor));
    updateTransform();
  }, { passive: false });

  // --- End Scroll Zoom ---

  function movePupil(eyeEl, pupilEl, lidEl, mouseX, mouseY) {
    const rect = eyeEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const pupilSize = Math.max(pupilEl.offsetWidth, pupilEl.offsetHeight);
    const maxDist = (Math.min(rect.width, rect.height) / 2) - (pupilSize / 2) - 3;
    const ratio = Math.min(1, maxDist / (dist || 1));
    const tx = dx * ratio;
    const ty = dy * ratio;
    pupilEl.style.transform = `translate(${tx}px, ${ty}px)`;

    // Eyelid reacts to vertical gaze: looking up -> lid opens (lifts)
    const normalizedY = ty / maxDist; // -1 (up) to +1 (down)
    if (lidEl.style.display === 'none') {
      return;
    }

    if (normalizedY < 0) {
      // Looking up: lift the eyelid (scale down to reveal more eye)
      const lift = Math.abs(normalizedY); // 0 to 1
      lidEl.style.transform = `scaleY(${1 - lift * 0.6})`;
    } else {
      // Looking center or down: eyelid normal or slightly droops
      const droop = normalizedY; // 0 to 1
      lidEl.style.transform = `scaleY(${1 + droop * 0.3})`;
    }
  }

  document.addEventListener('mousemove', (e) => {
    // Drag handler runs separately above
    movePupil(left.eye, left.pupil, left.lid, e.clientX, e.clientY);
    movePupil(right.eye, right.pupil, right.lid, e.clientX, e.clientY);
  });

  // Blink randomly
  let isBlinking = false;
  function blink(lidEl) {
    if (lidEl.style.display === 'none') return;
    isBlinking = true;
    const currentTransform = lidEl.style.transform || 'scaleY(1)';
    lidEl.style.transform = 'scaleY(2.1)';
    setTimeout(() => {
      lidEl.style.transform = currentTransform;
      isBlinking = false;
    }, 130);
  }

  function scheduleBlinkLeft() {
    const delay = 2000 + Math.random() * 5000;
    setTimeout(() => {
      blink(left.lid);
      scheduleBlinkLeft();
    }, delay);
  }
  function scheduleBlinkRight() {
    const delay = 2500 + Math.random() * 5000;
    setTimeout(() => {
      blink(right.lid);
      scheduleBlinkRight();
    }, delay);
  }
  scheduleBlinkLeft();
  scheduleBlinkRight();

  // Helper: lighten a hex color
  function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + Math.round(255 * percent / 100));
    const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent / 100));
    const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent / 100));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

  function applyPupilColor(color) {
    currentPupilColor = color;
    const light = lightenColor(color, 40);
    const shape = currentEyeStyle === 'cat' || currentEyeStyle === 'dragon' ? 'ellipse' : 'circle';
    const bg = `radial-gradient(${shape} at 35% 30%, ${light} 0%, ${color} 72%)`;
    left.pupil.style.background = bg;
    right.pupil.style.background = bg;
  }

  // Load saved settings
  chrome.storage.local.get(['eyesVisible', 'pupilColor', 'eyeStyle'], (result) => {
    if (result.eyesVisible === false) {
      container.classList.add('hidden');
    }

    applyEyeStyle(result.eyeStyle || 'classic');

    if (result.pupilColor) {
      applyPupilColor(result.pupilColor);
    }
  });

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'toggle') {
      container.classList.toggle('hidden', !msg.visible);
    }
    if (msg.type === 'pupilColor') {
      applyPupilColor(msg.color);
    }
    if (msg.type === 'eyeStyle') {
      applyEyeStyle(msg.style);
    }
  });
})();
