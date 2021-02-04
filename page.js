chrome.storage.sync.get('hosts', addBanner);

function addBanner(data) {
  if (location.host in data.hosts) {
    // create the banner
    var banner = document.createElement("div");
    banner.className = "banner-alert";
    banner.id = "banner";
    banner.innerText = data.hosts[location.host]["text"];
    banner.style.backgroundColor = data.hosts[location.host]["colour"];
    // insert banner at top of the page
    document.body.insertBefore(banner, document.body.childNodes[0]);
    if (data.hosts[location.host]["display"] === "insert") {
      insert_banner(document.getElementById("banner"));
    } else if (data.hosts[location.host]["display"] === "on_top") {
      overlay_banner(document.getElementById("banner"));
    }
  }
}

function insert_banner(banner) {
  // Get the offset position of the banner
  var sticky = banner.offsetTop;
  // When the user scrolls the page, execute stickyBanner so banner remains visible (see https://www.w3schools.com/howto/howto_js_sticky_header.asp)
  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  window.onscroll = function () {
    if (window.pageYOffset > sticky) {
      banner.classList.add("sticky");
    } else {
      banner.classList.remove("sticky");
    }
  }
}

function overlay_banner(banner) {
  // add sticky class to fix at top
  banner.classList.add("sticky");
  // get the banner height from top of page
  var height = banner.offsetHeight;
  // When mouse over the banner, move the banner to the bottom
  var at_top = true;
  document.body.onmousemove = function (e) {
    if (at_top && e.pageY < (height + window.pageYOffset)) {
      banner.style.top = "auto";
      banner.style.bottom = 0;
      at_top = false;
    }
    else if (!at_top && e.pageY > (height + window.pageYOffset)) {
      banner.style.top = 0;
      banner.style.bottom = "auto";
      at_top = true;
    }
  }
}