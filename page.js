// Constants
const STORAGE_KEY = 'hosts';
const BANNER_ID = 'host-banner';

// Banner Management
const createBanner = (text, colour) => {
    const banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.innerText = text;
    banner.style.backgroundColor = colour;
    return banner;
};

const insertBanner = (banner) => {
    const sticky = banner.offsetTop;
    
    window.onscroll = () => {
        if (window.pageYOffset > sticky) {
            banner.classList.add("sticky-banner");
        } else {
            banner.classList.remove("sticky-banner");
        }
    };
};

const overlayBanner = (banner) => {
    banner.classList.add("sticky-banner");
    const height = banner.offsetHeight;
    let atTop = true;
    
    document.body.onmousemove = (e) => {
        if (atTop && e.pageY < (height + window.pageYOffset)) {
            banner.style.top = "auto";
            banner.style.bottom = 0;
            atTop = false;
        } else if (!atTop && e.pageY > (height + window.pageYOffset)) {
            banner.style.top = 0;
            banner.style.bottom = "auto";
            atTop = true;
        }
    };
};

// Host Matching
const findMatchingHost = (hosts, currentHost) => {
    for (const [pattern, config] of Object.entries(hosts)) {
        if (config.isRegex) {
            try {
                const regex = new RegExp(pattern);
                if (regex.test(currentHost)) {
                    return config;
                }
            } catch (error) {
                console.error('Invalid regex pattern:', pattern, error);
                continue;
            }
        } else {
            // Exact match
            if (pattern === currentHost) {
                return config;
            }
        }
    }
    return null;
};

// Main Function
const addBanner = (data) => {
    try {
        if (!data.hosts || Object.keys(data.hosts).length === 0) {
            return;
        }

        const hostConfig = findMatchingHost(data.hosts, location.host);
        if (!hostConfig) {
            return;
        }

        const banner = createBanner(hostConfig.text, hostConfig.colour);
        
        document.body.insertBefore(banner, document.body.childNodes[0]);
        
        if (hostConfig.display === "insert") {
            insertBanner(banner);
        } else if (hostConfig.display === "on_top") {
            overlayBanner(banner);
        }
    } catch (error) {
        console.error('Failed to add banner:', error);
    }
};

// Initialize
chrome.storage.sync.get(STORAGE_KEY, addBanner);