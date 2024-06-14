var default_hosts = {};

// On install or update,
chrome.runtime.onInstalled.addListener(function () {
    // Get existing hosts if already set from previous installation, or set as empty object if not
    chrome.storage.sync.get({ hosts: default_hosts }, function (data) {
        chrome.storage.sync.set({ hosts: data.hosts }, console.log("hosts set to " + data.hosts)
        );
    });
});