# Conference Calendar Helper - Chrome Extension

A Chrome extension that adds calendar buttons to conference session pages, making it easy to add sessions to your calendar with one click.

## Features

- 📅 **Google Calendar Integration** - One-click to add sessions
- 📆 **iCal Download** - Download .ics files for any calendar app
- 🎯 **Auto-detection** - Extracts session details automatically
- 📱 **Responsive Design** - Floating sidebar on desktop, inline on mobile
- 🔒 **Privacy-focused** - No data collection, works entirely in your browser

## Supported Conferences

- Dutch AI Conference (aiconference.nl)
- PHP Conference (phpconference.nl)

## Installation

### From Chrome Web Store (Recommended)
*Coming soon - pending publication*

### Manual Installation (For Development/Testing)

1. **Clone or download this repository**

2. **Open Chrome Extensions page:**
   - Navigate to `chrome://extensions/`
   - Or click Menu → More Tools → Extensions

3. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top right

4. **Load the extension:**
   - Click "Load unpacked"
   - Select the `browser-extension` directory
   - The extension should now appear in your extensions list

5. **Test it:**
   - Visit any supported conference session page
   - Calendar buttons should appear automatically

## Files Structure

```
browser-extension/
├── manifest.json          # Extension configuration
├── content.js             # Main functionality script
├── popup.html             # Extension popup UI
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
├── icon.svg              # Source SVG icon
├── generate-icons.py     # Icon generation script
├── generate-icons.sh     # Icon generation script (bash)
├── README.md             # This file
└── PUBLISHING.md         # Chrome Web Store publishing guide
```

## Development

### Testing Locally

1. Load the extension in Developer mode (see Installation above)
2. Visit a test page: https://aiconference.nl/session/* or https://phpconference.nl/session/*
3. Open DevTools (F12) → Console to see debug messages
4. Buttons should appear automatically

### Making Changes

1. Edit the files (mainly `content.js` for functionality changes)
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload the test page to see changes

### Regenerating Icons

If you need to modify the icons:

**Using Python (recommended):**
```bash
cd browser-extension
python3 generate-icons.py
```

**Using bash (requires imagemagick, inkscape, or rsvg-convert):**
```bash
cd browser-extension
./generate-icons.sh
```

**Or edit the SVG:**
1. Edit `icon.svg` in any SVG editor
2. Run one of the generation scripts above

## Testing Checklist

Before submitting to the Chrome Web Store, test:

- [ ] Extension loads without errors
- [ ] Buttons appear on supported conference pages
- [ ] Google Calendar button opens with pre-filled data
- [ ] iCal download works and file is valid
- [ ] Responsive behavior works (resize window > 1300px and < 1300px)
- [ ] No console errors
- [ ] Extension popup opens correctly
- [ ] Icons display properly at all sizes

## Publishing

See [PUBLISHING.md](PUBLISHING.md) for detailed instructions on publishing to the Chrome Web Store.

### Quick Packaging

Create a ZIP file for Chrome Web Store submission:

```bash
cd browser-extension
zip -r conference-calendar-helper.zip manifest.json content.js popup.html *.png
```

## Version History

### v1.2.0 (Current)
- Added responsive floating sidebar for wide screens (>1300px)
- Added support for PHP Conference (phpconference.nl)
- Improved session data extraction
- Enhanced visual styling

### v1.1.0
- Added responsive layout support
- Improved button positioning

### v1.0.0
- Initial release
- Google Calendar integration
- iCal download support
- Support for Dutch AI Conference

## Browser Compatibility

- ✅ Chrome/Chromium (Manifest V3)
- ✅ Edge (Chromium-based)
- ⚠️ Firefox (requires Manifest V2 - separate package needed)
- ⚠️ Safari (requires conversion - separate package needed)

## Privacy

This extension:
- **Does NOT collect** any personal data
- **Does NOT transmit** any data to external servers
- **Does NOT require** special permissions
- **Only runs** on supported conference websites
- Works **entirely in your browser**

## Contributing

Found a bug or want to add a feature?

1. Open an issue describing the bug/feature
2. Submit a pull request with your changes
3. Make sure to test thoroughly before submitting

## License

MIT License - feel free to use and modify for your needs.

## Support

For issues or questions:
- Check existing issues in the repository
- Open a new issue with details about the problem
- Include browser version and console errors if applicable

## Roadmap

Potential future enhancements:
- [ ] Support for more conference websites
- [ ] Custom reminder settings
- [ ] Bulk add multiple sessions
- [ ] Timezone detection and conversion
- [ ] Integration with more calendar services (Office 365, etc.)

---

Made with ❤️ for conference attendees
