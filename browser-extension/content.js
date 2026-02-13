// Conference Calendar Helper - Content Script
// Adds calendar buttons to conference session pages

(function() {
    'use strict';

    let buttonContainer = null;
    let sessionData = null;
    let inlineParent = null;

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        addCalendarButton();
        handleResponsiveLayout();
        window.addEventListener('resize', handleResponsiveLayout);
    }

    function addCalendarButton() {
        // Find the session info section
        const sessionInfoSection = document.querySelector('.row.sessie-speaker');

        if (!sessionInfoSection) {
            console.log('[Calendar Helper] Session info section not found');
            return;
        }

        // Extract session data
        sessionData = extractSessionData();

        if (!sessionData.title) {
            console.log('[Calendar Helper] Could not extract session data');
            return;
        }

        console.log('[Calendar Helper] Successfully extracted session data:', sessionData);

        // Create button container
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'calendar-helper-buttons';
        buttonContainer.style.cssText = `
            padding: 15px;
            background-color: #f7b500;
            border-radius: 5px;
            text-align: center;
        `;

        // Create Google Calendar button
        const googleButton = createButton(
            '📅 Add to Google Calendar',
            generateGoogleCalendarUrl(sessionData),
            '#4285f4'
        );

        // Create iCal download button
        const icalButton = createButton(
            '📆 Download .ics file',
            '#',
            '#8fff00'
        );
        icalButton.addEventListener('click', function(e) {
            e.preventDefault();
            downloadICalFile(sessionData);
        });

        // Add buttons to container
        buttonContainer.appendChild(googleButton);
        buttonContainer.appendChild(document.createTextNode(' '));
        buttonContainer.appendChild(icalButton);

        // Store the inline parent location
        inlineParent = sessionInfoSection.querySelector('.col-6:last-child .sessie-speaker-info');
    }

    function handleResponsiveLayout() {
        if (!buttonContainer || !inlineParent) return;

        const isWideScreen = window.innerWidth > 1300;

        if (isWideScreen) {
            // Switch to floating sidebar
            if (buttonContainer.parentElement !== document.body) {
                buttonContainer.remove();
                document.body.appendChild(buttonContainer);
            }

            buttonContainer.style.cssText = `
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                padding: 20px;
                background-color: #f7b500;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                max-width: 250px;
                text-align: center;
            `;

            // Update buttons for vertical layout
            const buttons = buttonContainer.querySelectorAll('a');
            buttons.forEach(button => {
                button.style.display = 'block';
                button.style.width = '100%';
                button.style.marginBottom = '10px';
            });
        } else {
            // Switch to inline display
            if (buttonContainer.parentElement === document.body) {
                buttonContainer.remove();
                inlineParent.appendChild(buttonContainer);
            }

            buttonContainer.style.cssText = `
                margin-top: 20px;
                padding: 15px;
                background-color: #f7b500;
                border-radius: 5px;
                text-align: center;
            `;

            // Update buttons for horizontal layout
            const buttons = buttonContainer.querySelectorAll('a');
            buttons.forEach(button => {
                button.style.display = 'inline-block';
                button.style.width = 'auto';
                button.style.marginBottom = '0';
            });
        }
    }

    function extractSessionData() {
        const data = {
            title: '',
            description: '',
            location: 'Amsterdam, Netherlands',
            date: '',
            startTime: '',
            endTime: '',
            speaker: '',
            url: window.location.href
        };

        // Extract title
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            data.title = titleElement.textContent.trim();
        }

        // Extract description (first paragraph after title)
        const descriptionElement = document.querySelector('.container.sessie p');
        if (descriptionElement) {
            data.description = descriptionElement.textContent.trim();
        }

        // Extract date and time from the sessie-speaker-info section
        const sessionInfo = document.querySelector('.sessie-speaker-info');
        if (sessionInfo) {
            const dateParagraph = Array.from(sessionInfo.querySelectorAll('p'))
                .find(p => p.innerHTML.includes('<strong>Date:</strong>'));
            if (dateParagraph) {
                const dateText = dateParagraph.textContent.replace('Date:', '').trim();
                data.date = dateText;
            }

            const timeParagraph = Array.from(sessionInfo.querySelectorAll('p'))
                .find(p => p.innerHTML.includes('<strong>Time:</strong>'));
            if (timeParagraph) {
                const timeText = timeParagraph.textContent.replace('Time:', '').trim();
                const [start, end] = timeText.split('-').map(t => t.trim());
                data.startTime = start;
                data.endTime = end;
            }

            const speakerParagraph = Array.from(sessionInfo.querySelectorAll('p'))
                .find(p => p.innerHTML.includes('<strong>Speaker:'));
            if (speakerParagraph) {
                const speakerLink = speakerParagraph.querySelector('a');
                if (speakerLink) {
                    data.speaker = speakerLink.textContent.trim();
                }
            }
        }

        return data;
    }

    function parseDateTime(dateStr, timeStr) {
        // Parse date like "12 March 2026"
        const months = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3,
            'May': 4, 'June': 5, 'July': 6, 'August': 7,
            'September': 8, 'October': 9, 'November': 10, 'December': 11
        };

        const dateParts = dateStr.match(/(\d+)\s+(\w+)\s+(\d+)/);
        if (!dateParts) return null;

        const day = parseInt(dateParts[1]);
        const month = months[dateParts[2]];
        const year = parseInt(dateParts[3]);

        // Parse time like "09:55"
        const timeParts = timeStr.match(/(\d+):(\d+)/);
        if (!timeParts) return null;

        const hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);

        const date = new Date(year, month, day, hours, minutes);
        return date;
    }

    function formatDateForCalendar(date) {
        // Format: YYYYMMDDTHHmmss
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = '00';

        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    }

    function generateGoogleCalendarUrl(sessionData) {
        const startDate = parseDateTime(sessionData.date, sessionData.startTime);
        const endDate = parseDateTime(sessionData.date, sessionData.endTime);

        if (!startDate || !endDate) {
            alert('Could not parse date/time information');
            return '#';
        }

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: sessionData.title,
            details: `${sessionData.description}\n\nSpeaker: ${sessionData.speaker}\n\nMore info: ${sessionData.url}`,
            location: sessionData.location,
            dates: `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    }

    function downloadICalFile(sessionData) {
        const startDate = parseDateTime(sessionData.date, sessionData.startTime);
        const endDate = parseDateTime(sessionData.date, sessionData.endTime);

        if (!startDate || !endDate) {
            alert('Could not parse date/time information');
            return;
        }

        const hostname = window.location.hostname;
        const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Conference Calendar Helper//EN
BEGIN:VEVENT
UID:${Date.now()}@${hostname}
DTSTAMP:${formatDateForCalendar(new Date())}
DTSTART:${formatDateForCalendar(startDate)}
DTEND:${formatDateForCalendar(endDate)}
SUMMARY:${sessionData.title}
DESCRIPTION:${sessionData.description.replace(/\n/g, '\\n')}\\n\\nSpeaker: ${sessionData.speaker}\\n\\nMore info: ${sessionData.url}
LOCATION:${sessionData.location}
URL:${sessionData.url}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

        // Create blob and download
        const blob = new Blob([icalContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sessionData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function createButton(text, href, bgColor) {
        const button = document.createElement('a');
        button.textContent = text;
        button.href = href;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.style.cssText = `
            display: inline-block;
            padding: 10px 20px;
            background-color: ${bgColor};
            color: #000835;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
            margin: 5px;
            transition: opacity 0.3s;
        `;
        button.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        button.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
        return button;
    }
})();
