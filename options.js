const COLOURS = ["red", "orange", "green", "blue", "pink", "purple", "black"]

chrome.storage.sync.get(
    'hosts', hosttable
);

function get_colour_dropdown(start_colour) {
    // Creates colour picker dropdown
    var dropdown = document.createElement('select');
    for (colour of COLOURS) {
        var option = document.createElement('option');
        option.text = colour;
        dropdown.add(option);
        dropdown.value = start_colour;
        dropdown.style.backgroundColor = start_colour;
        dropdown.style.color = "white";
        dropdown.addEventListener("change", function () {
            dropdown.style.backgroundColor = dropdown.value;
        })
    }
    return dropdown;
}

function get_display_dropdown(start_value) {
    // creates display option dropdown
    var dropdown = document.createElement('select');
    for (choice of ["insert", "on top"]) {
        var option = document.createElement('option');
        option.text = choice;
        dropdown.add(option);
    }
    dropdown.value = start_value;
    return dropdown;
}

function banner_text() {
    // creates banner text input
    var banner_text_input = document.createElement('input');
    banner_text_input.type = "text";
    banner_text_input.style.width = "300px";
    banner_text_input.placeholder = "Enter text to be displayed on banner";
    return banner_text_input
}

function add_host_row(data) {
    // creates row in table for user to add a new host
    var new_row = document.createElement('tr');
    // create text input cell for user to enter new host
    var new_host_cell = document.createElement('td');
    var new_host_text = document.createElement('input');
    new_host_text.style.width = "250px";
    new_host_text.type = "text";
    new_host_text.placeholder = "Enter host or URL";
    new_host_cell.appendChild(new_host_text);
    // create text input cell for user to enter banner text
    var banner_text_cell = document.createElement('td');
    banner_text_cell.appendChild(banner_text());
    // create dropdown for user to select banner colour
    var colour_cell = document.createElement('td');
    colour_cell.appendChild(get_colour_dropdown(COLOURS[0]));
    // create dropdown for user to select banner display style
    var display_cell = document.createElement('td');
    display_cell.appendChild(get_display_dropdown("insert"));
    // create button for user add the new host
    var button_cell = document.createElement('td');
    var button = document.createElement('button');
    button.innerText = "\u2713";
    button.style.color = "green";
    // add event listener to save new host config when clicked
    button.addEventListener('click', function () {
        // extract host from url
        var new_host = new_host_text.value.replace(/(http:\/\/|https:\/\/)/, "").match(/([A-Za-z0-9-\.:]+)/)[0];
        if (new_host) {
            // save new host to hosts config
            data.hosts[new_host] = {
                "text": banner_text_cell.children[0].value,
                "colour": colour_cell.children[0].value,
                "display": display_cell.children[0].value.replace(" ", "_")
            };
            chrome.storage.sync.set({ hosts: data.hosts }, function () {
                console.log("hosts set to " + data.hosts);
            })
            // refresh the page so new host appears in table
            location.reload();
        }
    });
    button_cell.appendChild(button);
    // add elements to new row
    new_row.appendChild(new_host_cell);
    new_row.appendChild(colour_cell);
    new_row.appendChild(banner_text_cell);
    new_row.appendChild(display_cell);
    new_row.appendChild(button_cell);
    return new_row;  
}

function edit_host_row(host, data) {
    // creates row in table for user to edit config for existing host 
    var host_row = document.createElement('tr');
    // create cell to display the host
    var host_cell = document.createElement('td');
    host_cell.innerText = host;
    // create dropdown for user to change banner colour
    var colour_cell = document.createElement('td');
    var colour_dropdown = get_colour_dropdown(data.hosts[host]["colour"]);
    colour_dropdown.addEventListener("change", function () {
        data.hosts[host]["colour"] = colour_dropdown.value;
        chrome.storage.sync.set({ hosts: data.hosts }, function () {
            console.log("hosts set to " + data.hosts);
        })
    })
    colour_cell.appendChild(colour_dropdown);
    // create dropdown for user to change banner display option
    var display_cell = document.createElement('td');
    var display_dropdown = get_display_dropdown(data.hosts[host]["display"].replace("_", " "));
    display_dropdown.addEventListener("change", function () {
        data.hosts[host]["display"] = display_dropdown.value.replace(" ", "_");
        chrome.storage.sync.set({ hosts: data.hosts }, function () {
            console.log("hosts set to " + data.hosts);
        })
    })
    display_cell.appendChild(display_dropdown);
    // create text input for user to edit the banner text
    var banner_text_cell = document.createElement('td');
    var banner_text_input = document.createElement('input');
    banner_text_input = banner_text();
    banner_text_input.value = data.hosts[host]["text"];
    banner_text_input.addEventListener("blur", function () {
        data.hosts[host]["text"] = banner_text_input.value;
        chrome.storage.sync.set({ hosts: data.hosts }, function () {
            console.log("hosts set to " + data.hosts);
        })
    })
    banner_text_cell.appendChild(banner_text_input);
    // create button for user to remove the host
    var button_cell = document.createElement('td');
    var button = document.createElement('button');
    button.innerText = "X";
    button.style.color = "red";
    button.addEventListener('click', function () {
        delete data.hosts[host];
        chrome.storage.sync.set({ hosts: data.hosts }, function () {
            console.log("hosts set to " + data.hosts);
        })
        // refresh the page so deleted host is not shown in table
        location.reload();
    });
    button_cell.appendChild(button);
    // add elements to new row
    host_row.appendChild(host_cell);
    host_row.appendChild(colour_cell);
    host_row.appendChild(banner_text_cell);
    host_row.appendChild(display_cell);
    host_row.appendChild(button_cell);
    return host_row;
}

function hosttable(data) {
        var host_table = document.getElementById("host-table");
        // for each host, display a row in the table that allows user to see and edit the config
        for (host in data.hosts) {
            host_table.appendChild(edit_host_row(host, data));
        }
        // add a row to bottom of table where user can create a banner for a new host
        host_table.appendChild(add_host_row(data));
    }