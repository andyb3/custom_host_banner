// Constants
const COLOURS = ["red", "orange", "green", "blue", "pink", "purple", "black"];
const DISPLAY_OPTIONS = ["insert", "on top"];
const STORAGE_KEY = 'hosts';

// UI Elements
const createColourDropdown = (startColour) => {
    const dropdown = document.createElement('select');
    COLOURS.forEach(colour => {
        const option = document.createElement('option');
        option.text = colour;
        dropdown.add(option);
    });
    
    dropdown.value = startColour;
    dropdown.style.backgroundColor = startColour;
    dropdown.style.color = "white";
    
    dropdown.addEventListener("change", () => {
        dropdown.style.backgroundColor = dropdown.value;
    });
    
    return dropdown;
};

const createDisplayDropdown = (startValue) => {
    const dropdown = document.createElement('select');
    DISPLAY_OPTIONS.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.text = option;
        dropdown.add(optionElement);
    });
    dropdown.value = startValue;
    return dropdown;
};

const createBannerTextInput = (value = '') => {
    const input = document.createElement('input');
    input.type = "text";
    input.style.width = "300px";
    input.placeholder = "Enter text to be displayed on banner";
    input.value = value;
    return input;
};

// Host Management
const extractHostFromUrl = (url) => {
    try {
        return url.replace(/(http:\/\/|https:\/\/)/, "").match(/([A-Za-z0-9-\.:]+)/)[0];
    } catch (error) {
        console.error('Invalid URL format:', error);
        return null;
    }
};

const saveHosts = (hosts) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [STORAGE_KEY]: hosts }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
};

// Row Creation
const createAddHostRow = (data) => {
    const row = document.createElement('tr');
    
    const hostCell = document.createElement('td');
    const hostInput = document.createElement('input');
    hostInput.style.width = "250px";
    hostInput.type = "text";
    hostInput.placeholder = "Enter host or URL";
    hostCell.appendChild(hostInput);
    
    const bannerTextCell = document.createElement('td');
    bannerTextCell.appendChild(createBannerTextInput());
    
    const colourCell = document.createElement('td');
    colourCell.appendChild(createColourDropdown(COLOURS[0]));
    
    const displayCell = document.createElement('td');
    displayCell.appendChild(createDisplayDropdown(DISPLAY_OPTIONS[0]));
    
    const buttonCell = document.createElement('td');
    const button = document.createElement('button');
    button.innerText = "\u2713";
    button.style.color = "green";
    
    button.addEventListener('click', async () => {
        const newHost = extractHostFromUrl(hostInput.value);
        if (newHost) {
            try {
                data.hosts[newHost] = {
                    text: bannerTextCell.children[0].value,
                    colour: colourCell.children[0].value,
                    display: displayCell.children[0].value.replace(" ", "_")
                };
                await saveHosts(data.hosts);
                location.reload();
            } catch (error) {
                console.error('Failed to save host:', error);
            }
        }
    });
    
    buttonCell.appendChild(button);
    
    [hostCell, colourCell, bannerTextCell, displayCell, buttonCell].forEach(cell => row.appendChild(cell));
    return row;
};

const createEditHostRow = (host, data) => {
    const row = document.createElement('tr');
    
    const hostCell = document.createElement('td');
    hostCell.innerText = host;
    
    const colourCell = document.createElement('td');
    const colourDropdown = createColourDropdown(data.hosts[host].colour);
    colourDropdown.addEventListener("change", async () => {
        try {
            data.hosts[host].colour = colourDropdown.value;
            await saveHosts(data.hosts);
        } catch (error) {
            console.error('Failed to update colour:', error);
        }
    });
    colourCell.appendChild(colourDropdown);
    
    const bannerTextCell = document.createElement('td');
    const bannerTextInput = createBannerTextInput(data.hosts[host].text);
    bannerTextInput.addEventListener("blur", async () => {
        try {
            data.hosts[host].text = bannerTextInput.value;
            await saveHosts(data.hosts);
        } catch (error) {
            console.error('Failed to update banner text:', error);
        }
    });
    bannerTextCell.appendChild(bannerTextInput);
    
    const displayCell = document.createElement('td');
    const displayDropdown = createDisplayDropdown(data.hosts[host].display.replace("_", " "));
    displayDropdown.addEventListener("change", async () => {
        try {
            data.hosts[host].display = displayDropdown.value.replace(" ", "_");
            await saveHosts(data.hosts);
        } catch (error) {
            console.error('Failed to update display option:', error);
        }
    });
    displayCell.appendChild(displayDropdown);
    
    const buttonCell = document.createElement('td');
    const button = document.createElement('button');
    button.innerText = "X";
    button.style.color = "red";
    button.addEventListener('click', async () => {
        try {
            delete data.hosts[host];
            await saveHosts(data.hosts);
            location.reload();
        } catch (error) {
            console.error('Failed to delete host:', error);
        }
    });
    buttonCell.appendChild(button);
    
    [hostCell, colourCell, bannerTextCell, displayCell, buttonCell].forEach(cell => row.appendChild(cell));
    return row;
};

// Initialize
const initializeHostTable = (data) => {
    const hostTable = document.getElementById("host-table");
    
    Object.keys(data.hosts).forEach(host => {
        hostTable.appendChild(createEditHostRow(host, data));
    });
    
    hostTable.appendChild(createAddHostRow(data));
};

// Load initial data
chrome.storage.sync.get(STORAGE_KEY, (data) => {
    if (!data.hosts) {
        data.hosts = {};
    }
    initializeHostTable(data);
});