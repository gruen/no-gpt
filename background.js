chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get(['filterEnabled'], (result) => {
        const newFilterEnabled = !result.filterEnabled;
        chrome.storage.local.set({ filterEnabled: newFilterEnabled }, () => {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleFilter', filterEnabled: newFilterEnabled });
        });
    });
});
