let filterEnabled = true;

chrome.storage.local.get(['filterEnabled'], (result) => {
    if (result.hasOwnProperty('filterEnabled')) {
        filterEnabled = result.filterEnabled;
    } else {
        chrome.storage.local.set({ filterEnabled: true });
    }
    filterPageMessages();
});

function filterGPTMessages(messages) {
    const filteredMessages = messages.filter(message => {
        const lowerCaseMessage = message.toLowerCase();
        const gptPhrases = [
            "the",
            //   "i asked gpt to write",
            //   "i requested gpt to write",
            //   "i got gpt to write",
            //   "i had gpt write",
        ];

        return !gptPhrases.some(phrase => lowerCaseMessage.includes(phrase));
    });

    return filteredMessages;
}

function toggleMessageDisplay(container, message, platform) {
    if (platform === 'linkedin') {
      container = container.closest('.feed-shared-update-v2');
    }
  
    if (filterEnabled && !filterGPTMessages([message]).length) {
      container.style.display = 'none';
    } else {
      container.style.display = '';
    }
  }

function filterPageMessages() {
  const linkedInMessageContainers = document.querySelectorAll('.feed-shared-update-v2__description'); // LinkedIn selector
  const twitterMessageContainers = document.querySelectorAll('article div[lang]:not([style])'); // Twitter selector

  linkedInMessageContainers.forEach(container => {
    const message = container.innerText || container.textContent;
    toggleMessageDisplay(container, message, 'linkedin');
  });

  twitterMessageContainers.forEach(container => {
    const message = container.innerText || container.textContent;
    toggleMessageDisplay(container, message, 'twitter');
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleFilter') {
        filterEnabled = request.filterEnabled;
        filterPageMessages();
    }
});

const targetNode = document.body;
const config = { childList: true, subtree: true };

const observerCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            filterPageMessages();
        }
    }
};

const observer = new MutationObserver(observerCallback);
observer.observe(targetNode, config);

filterPageMessages();
