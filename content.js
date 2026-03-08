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
      bottom: 0;
      left: 50%;
      transform-origin: bottom center;
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
    const maxDist = (rect.width / 2) - 12;
    const ratio = Math.min(1, maxDist / (dist || 1));
    const tx = dx * ratio;
    const ty = dy * ratio;
    pupilEl.style.transform = `translate(${tx}px, ${ty}px)`;

    // Eyelid reacts to vertical gaze: looking up -> lid opens (lifts)
    const normalizedY = ty / maxDist; // -1 (up) to +1 (down)
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
    const light = lightenColor(color, 40);
    const bg = `radial-gradient(circle at 35% 30%, ${light} 0%, ${color} 70%)`;
    left.pupil.style.background = bg;
    right.pupil.style.background = bg;
  }

  // Load saved pupil color
  chrome.storage.local.get(['pupilColor'], (result) => {
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
  });
})();
