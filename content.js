let filterEnabled = false;

chrome.storage.local.get(['filterEnabled'], (result) => {
    if (result.hasOwnProperty('filterEnabled')) {
        filterEnabled = result.filterEnabled;
    } else {
        chrome.storage.local.set({ filterEnabled: true });
    }
    filterPageMessages();
});

function filterGPTMessages(messages) {
    const gptPattern = /(?:I|we)\s+(?:asked|requested|consulted)\s+(?:GPT|ChatGPT|GPT-4|GPT4|chat-GPT|chatGPT|gpt4|gpt-4|chat-gpt)\s+(?:to\s+write|for|to\s+create|to\s+generate|to\s+come\s+up\s+with)/gi;
    return messages.filter((message) => gptPattern.test(message));
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
            let newPostsDetected = false;

            mutation.addedNodes.forEach(node => {
                if (node.querySelector && (
                    node.querySelector('.feed-shared-update-v2__description') ||
                    node.querySelector('.artdeco-loader'))) {
                    newPostsDetected = true;
                }
            });

            if (newPostsDetected) {
                setTimeout(() => {
                    filterPageMessages();
                }, 1000);
            }
        }
    }
};

const observer = new MutationObserver(observerCallback);
observer.observe(targetNode, config);

filterPageMessages();