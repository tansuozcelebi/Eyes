const toggle = document.getElementById('toggleEyes');

// Load saved state
chrome.storage.local.get(['eyesVisible'], (result) => {
  const visible = result.eyesVisible !== false; // default true
  toggle.checked = visible;
});

toggle.addEventListener('change', () => {
  const visible = toggle.checked;
  chrome.storage.local.set({ eyesVisible: visible });

  // Send message to active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle', visible });
    }
  });
});
