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
      transition: opacity 0.3s;
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
      transition: transform 0.05s linear;
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
  document.body.appendChild(container);

  // Add click animations
  left.eye.addEventListener('click', () => playClickAnimation(left.eye, left.pupil));
  right.eye.addEventListener('click', () => playClickAnimation(right.eye, right.pupil));
  container.style.pointerEvents = 'auto';

  function movePupil(eyeEl, pupilEl, mouseX, mouseY) {
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
  }

  document.addEventListener('mousemove', (e) => {
    movePupil(left.eye, left.pupil, e.clientX, e.clientY);
    movePupil(right.eye, right.pupil, e.clientX, e.clientY);
  });

  // Blink randomly
  function blink(lidEl) {
    lidEl.style.transform = 'scaleY(2.1)';
    setTimeout(() => { lidEl.style.transform = 'scaleY(1)'; }, 130);
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

  // Listen for toggle messages from popup
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'toggle') {
      container.classList.toggle('hidden', !msg.visible);
    }
  });
})();
