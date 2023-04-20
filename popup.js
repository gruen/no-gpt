const toggleSwitch = document.getElementById('toggleSwitch');

function updateToggleState() {
  chrome.storage.local.get(['filterEnabled'], (result) => {
    if (result.hasOwnProperty('filterEnabled')) {
      toggleSwitch.checked = result.filterEnabled;
    } else {
      toggleSwitch.checked = true;
    }
  });
}

toggleSwitch.addEventListener('change', () => {
  const newFilterEnabled = toggleSwitch.checked;
  chrome.storage.local.set({ filterEnabled: newFilterEnabled }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleFilter', filterEnabled: newFilterEnabled });
    });
  });
});

updateToggleState();
