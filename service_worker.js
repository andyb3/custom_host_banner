// Constants
const STORAGE_KEY = 'hosts';

// Initialize storage if empty
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(STORAGE_KEY, (data) => {
        if (!data.hosts) {
            chrome.storage.sync.set({ [STORAGE_KEY]: {} });
        }
    });
});