const toggle = document.getElementById('toggleEyes');
const colorPicker = document.getElementById('pupilColor');
const previewPupils = document.querySelectorAll('.preview-pupil');

// Load saved state
chrome.storage.local.get(['eyesVisible', 'pupilColor'], (result) => {
  const visible = result.eyesVisible !== false; // default true
  toggle.checked = visible;

  if (result.pupilColor) {
    colorPicker.value = result.pupilColor;
    updatePreviewPupils(result.pupilColor);
  }
});

toggle.addEventListener('change', () => {
  const visible = toggle.checked;
  chrome.storage.local.set({ eyesVisible: visible });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle', visible });
    }
  });
});

function updatePreviewPupils(color) {
  // Derive a lighter shade for the gradient highlight
  previewPupils.forEach((p) => {
    p.style.background = `radial-gradient(circle at 35% 30%, ${lighten(color, 40)}, ${color})`;
  });
}

function lighten(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent / 100));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

colorPicker.addEventListener('input', () => {
  const color = colorPicker.value;
  chrome.storage.local.set({ pupilColor: color });
  updatePreviewPupils(color);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'pupilColor', color });
    }
  });
});

// Reload button
document.getElementById('reloadBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
});
