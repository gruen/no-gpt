function filterGPTMessages(messages) {
    const filteredMessages = messages.filter(message => {
        const lowerCaseMessage = message.toLowerCase();
        const gptPhrases = [
            "i asked gpt to write",
            "i requested gpt to write",
            "i got gpt to write",
            "i had gpt write",
        ];

        return !gptPhrases.some(phrase => lowerCaseMessage.includes(phrase));
    });

    return filteredMessages;
}

function filterPageMessages() {
    const linkedInMessageContainers = document.querySelectorAll('.feed-shared-update-v2__description'); // LinkedIn selector
    const twitterMessageContainers = document.querySelectorAll('article div[lang]:not([style])'); // Twitter selector
    const messageContainers = [...linkedInMessageContainers, ...twitterMessageContainers];

    messageContainers.forEach(container => {
        const message = container.innerText || container.textContent;

        if (!filterGPTMessages([message]).length) {
            container.style.display = 'none';
        }
    });
}

// Observe and apply the filter when new content is added
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
