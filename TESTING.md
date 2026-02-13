# Testing Guide for Conference Calendar Helper

## Testing the Tampermonkey Script

### Method 1: Local HTML Test (Recommended for Quick Testing)

1. **Open the test page**:
   - Navigate to the project directory
   - Open `test-session-page.html` in your web browser
   - You can do this by:
     - Double-clicking the file
     - Or running: `open test-session-page.html` (macOS) or `xdg-open test-session-page.html` (Linux)

2. **What to verify**:
   - ✅ **Responsive behavior** (resize your browser window to test):
     - **Wide screens (>1300px)**: Buttons appear as a floating sidebar on the right side
     - **Narrow screens (≤1300px)**: Buttons appear inline below the session info
     - The layout should automatically adjust when resizing
   - ✅ Two buttons should appear:
     - "📅 Add to Google Calendar" (blue button)
     - "📆 Download .ics file" (green button)
   - ✅ The buttons should be in a yellow/gold container
   - ✅ Hovering over buttons should change their opacity

3. **Test Google Calendar button**:
   - Click the "Add to Google Calendar" button
   - It should open Google Calendar with pre-filled event details:
     - Title: "AI-Powered Healthcare: Transforming Patient Care"
     - Date: March 12, 2026
     - Time: 09:55 - 10:40
     - Location: Amsterdam, Netherlands
     - Description with speaker info

4. **Test iCal download**:
   - Click the "Download .ics file" button
   - A file should download (e.g., `ai_powered_healthcare_transforming_patient_care.ics`)
   - Open the .ics file with your calendar app to verify it contains correct data

5. **Check browser console**:
   - Open Developer Tools (F12)
   - Check the Console tab for any errors
   - You should see a log: "Extracted session data: ..." with the session details

### Method 2: Live Website Test with Tampermonkey

1. **Install Tampermonkey**:
   - Chrome: Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - Edge: Install from [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **Install the script**:
   - Click the Tampermonkey icon in your browser
   - Click "Create a new script"
   - Delete the default content
   - Copy and paste the content from `conference-calendar-helper.user.js`
   - Save (Ctrl+S or Cmd+S)

3. **Visit a conference session page**:
   - Go to any supported conference session page:
     - https://aiconference.nl/session/* (Dutch AI Conference)
     - https://phpconference.nl/session/* (PHP Conference)
   - The calendar buttons should appear automatically

4. **Verify functionality**:
   - Test both the Google Calendar and iCal download buttons
   - Verify the extracted data matches the session page content

### Method 3: Automated Testing

Run the automated test script:

```bash
node test-script.js
```

This will verify:
- Date parsing logic
- Time parsing logic
- Calendar URL generation
- iCal file format generation

## Testing Different Scenarios

### Test Case 1: Responsive Layout
Test the responsive behavior:
1. Open `test-session-page.html` in your browser
2. Make your browser window wide (>1300px):
   - Buttons should appear as a floating sidebar on the right
   - Buttons should be stacked vertically
   - Container should have a shadow effect
3. Make your browser window narrow (≤1300px):
   - Buttons should appear inline below the session info
   - Buttons should be side-by-side horizontally
4. Resize back and forth to ensure smooth transitions

### Test Case 2: Different Date Formats
Edit `test-session-page.html` and change the date to test different formats:
- "1 January 2026"
- "25 December 2026"
- "15 June 2026"

### Test Case 3: Different Time Ranges
Test with various time formats:
- "09:00 - 10:00"
- "14:30 - 15:45"
- "23:00 - 23:59"

### Test Case 4: Special Characters in Title
Test titles with special characters:
- "AI & Machine Learning: A Deep-Dive"
- "Building RAG Systems (Practical Guide)"

### Test Case 5: Long Descriptions
Test with multi-paragraph descriptions to ensure proper formatting in calendar events.

## Common Issues and Troubleshooting

### Issue: Buttons don't appear
- Check you're on a supported session page (aiconference.nl/session/* or phpconference.nl/session/*)
- Check browser console for errors
- Verify the DOM structure matches expected selectors
- Ensure JavaScript is enabled
- Verify Tampermonkey is enabled and the script is active

### Issue: Date parsing fails
- Check date format matches: "DD Month YYYY"
- Check time format matches: "HH:MM - HH:MM"

### Issue: iCal download doesn't work
- Check browser's download settings
- Verify the browser allows downloads
- Check browser console for errors

### Issue: Google Calendar link doesn't work
- Verify you're logged into Google
- Check if popup blockers are interfering
- Try copying the URL and pasting it in a new tab

## Expected Behavior

When the script runs successfully:
1. It waits for the page to fully load
2. It locates the session info section
3. It extracts: title, description, date, time, speaker, location
4. It creates two styled buttons
5. It inserts them into the page
6. Buttons are interactive and functional
