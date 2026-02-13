# Conference Calendar Helper

A Tampermonkey userscript and browser extension that adds calendar buttons to the Dutch AI Conference session pages, making it easy to add sessions to your calendar.

## Features

- 📅 **Google Calendar Integration** - One-click to add sessions to Google Calendar
- 📆 **iCal Download** - Download .ics files for any calendar app (Outlook, Apple Calendar, etc.)
- 🎯 **Auto-detection** - Automatically extracts session details (title, date, time, speaker, location)
- 🎨 **Native Integration** - Seamlessly integrates with the conference website design

## Quick Start

### Option 1: Tampermonkey (Easiest)

1. Install Tampermonkey browser extension:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. Click on the Tampermonkey icon → "Create a new script"

3. Copy the contents of `conference-calendar-helper.user.js` and paste it

4. Save (Ctrl+S or Cmd+S)

5. Visit any session page on https://aiconference.nl/session/* and the calendar buttons will appear!

### Option 2: Browser Extension (Coming Soon)

The browser extension version is under development in the `browser-extension/` directory.

## Testing

We've included comprehensive testing tools:

### 1. Visual Test (Recommended First Step)

Open `test-session-page.html` in your browser to see the script in action on a mock session page.

```bash
# macOS
open test-session-page.html

# Linux
xdg-open test-session-page.html

# Windows
start test-session-page.html
```

**What to check:**
- Two calendar buttons should appear in a yellow/gold container
- Google Calendar button (blue) should open Google Calendar with pre-filled event
- iCal download button (green) should download an .ics file
- Both buttons should have hover effects

### 2. Automated Tests

Run the automated test suite to verify core functionality:

```bash
node test-script.js
```

This tests:
- ✅ Date parsing (various formats)
- ✅ Time parsing
- ✅ Calendar date formatting
- ✅ Google Calendar URL generation
- ✅ Special character handling
- ✅ Error handling

### 3. Full Testing Guide

See [TESTING.md](TESTING.md) for detailed testing instructions, including:
- Live website testing with Tampermonkey
- Different test scenarios
- Troubleshooting common issues
- Expected behavior documentation

## How It Works

1. **Page Detection**: The script runs on any page matching `https://aiconference.nl/session/*`

2. **Data Extraction**: It extracts:
   - Session title from `<h1>` tag
   - Description from the first paragraph
   - Date, time, and speaker from the session info section
   - Location (defaults to "Amsterdam, Netherlands")

3. **Button Injection**: Two buttons are added to the session info area:
   - **Google Calendar**: Opens pre-filled Google Calendar event creation page
   - **iCal Download**: Generates and downloads a `.ics` file

4. **Format Handling**:
   - Dates are parsed from format: "DD Month YYYY" (e.g., "12 March 2026")
   - Times are parsed from format: "HH:MM - HH:MM" (e.g., "09:55 - 10:40")

## File Structure

```
dawn-conference-planner/
├── conference-calendar-helper.user.js  # Tampermonkey userscript
├── test-session-page.html              # Visual testing page
├── test-script.js                      # Automated test suite
├── TESTING.md                          # Detailed testing guide
├── README.md                           # This file
└── browser-extension/                  # Browser extension (in progress)
    └── manifest.json                   # Extension manifest
```

## Browser Support

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Edge
- ✅ Safari (with appropriate Tampermonkey alternative)
- ✅ Opera

## Customization

You can customize the script by editing `conference-calendar-helper.user.js`:

### Change Button Colors

```javascript
// Line 52 - Google Calendar button
const googleButton = createButton(
    '📅 Add to Google Calendar',
    generateGoogleCalendarUrl(sessionData),
    '#4285f4'  // Change this color
);

// Line 58 - iCal button background color
buttonContainer.style.cssText = `
    background-color: #f7b500;  // Change this color
`;
```

### Change Default Location

```javascript
// Line 81
location: 'Amsterdam, Netherlands',  // Change default location
```

### Modify Button Text

```javascript
// Line 49 - Change button labels
const googleButton = createButton(
    '📅 Your Custom Text',  // Customize here
    ...
);
```

## Troubleshooting

### Buttons Don't Appear
1. Check that you're on a page matching `https://aiconference.nl/session/*`
2. Open browser DevTools (F12) and check the Console for errors
3. Verify Tampermonkey is enabled
4. Make sure the script is enabled in Tampermonkey dashboard

### Date Parsing Issues
The script expects dates in format "DD Month YYYY" (e.g., "12 March 2026"). If the website uses a different format, the script may need updates.

### Calendar Events Have Wrong Time
The script assumes times are in the local timezone. Make sure your system timezone is set correctly.

## Contributing

Found a bug or have a feature request? Please open an issue or submit a pull request!

## License

MIT License - feel free to use and modify for your needs.

## Credits

Created for the Dutch AI Conference (https://aiconference.nl/) attendees who want an easy way to add sessions to their calendars.
