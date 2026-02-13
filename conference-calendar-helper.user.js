// ==UserScript==
// @name         Dutch AI Conference - Add to Calendar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add calendar buttons to conference session pages
// @author       You
// @match        https://aiconference.nl/session/*
// @grant        none
// @icon         https://aiconference.nl/wp-content/uploads/2026/01/cropped-fav-32x32.png
// ==/UserScript==

(function() {
    'use strict';

    // Wait for page to load
    window.addEventListener('load', function() {
        addCalendarButton();
    });

    function addCalendarButton() {
        // Find the session info section
        const sessionInfoSection = document.querySelector('.row.sessie-speaker');

        if (!sessionInfoSection) {
            console.log('Session info section not found');
            return;
        }

        // Extract session data
        const sessionData = extractSessionData();

        if (!sessionData.title) {
            console.log('Could not extract session data');
            return;
        }

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            margin-top: 20px;
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

        // Insert button container after the session info
        const speakerInfo = sessionInfoSection.querySelector('.col-6:last-child .sessie-speaker-info');
        if (speakerInfo) {
            speakerInfo.appendChild(buttonContainer);
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

        const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Conference Calendar Helper//EN
BEGIN:VEVENT
UID:${Date.now()}@aiconference.nl
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
