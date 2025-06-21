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

// Handle storage changes to update existing entries with isRegex property
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(STORAGE_KEY, (data) => {
        if (data.hosts) {
            let updated = false;
            const hosts = data.hosts;
            
            // Add isRegex property to existing entries that don't have it
            for (const [host, config] of Object.entries(hosts)) {
                if (config.isRegex === undefined) {
                    hosts[host].isRegex = false;
                    updated = true;
                }
            }
            
            // Save updated data if changes were made
            if (updated) {
                chrome.storage.sync.set({ [STORAGE_KEY]: hosts });
            }
        }
    });
});