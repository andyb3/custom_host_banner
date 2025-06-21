# Custom Host Banner

A Chrome extension that displays custom banners on web pages based on the host or regex pattern.

## Features

- **Exact Host Matching**: Display banners on specific websites
- **Regex Pattern Matching**: Use regular expressions to match multiple hosts
- **Customizable Banners**: Set custom text, colors, and display options
- **Two Display Modes**: 
  - **Insert**: Banner is inserted before page content
  - **On Top**: Banner overlays page content and moves when hovered

## Usage

### Adding Hosts

1. Click the extension icon to open the options page
2. Enter a host, URL, or regex pattern in the "Host/Pattern" field
3. Check the "Regex" checkbox if you want to use regex matching
4. Set your desired banner text, color, and display option
5. Click the green checkmark to save

### Regex Examples

- `.*\.google\.com` - Matches all Google subdomains (mail.google.com, drive.google.com, etc.)
- `.*\.github\.com` - Matches all GitHub pages
- `stackoverflow\.com` - Matches stackoverflow.com exactly
- `.*\.(com|org|net)` - Matches any domain with .com, .org, or .net TLD

### Display Options

- **Insert**: The banner is inserted at the top of the page content. This ensures page content isn't covered, but may not work on all sites.
- **On Top**: The banner overlays the page content. This works on more sites but covers some content. The banner will move out of the way when you hover over it.

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

## Development

The extension consists of:
- `manifest.json` - Extension configuration
- `service_worker.js` - Background service worker for initialization
- `options.html/js/css` - Options page for managing hosts
- `page.js/css` - Content script that displays banners
- `images/` - Extension icons

## License

See LICENSE file for details.