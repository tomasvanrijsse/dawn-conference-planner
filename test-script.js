#!/usr/bin/env node

/**
 * Automated test script for Conference Calendar Helper
 * Tests the core date/time parsing and URL generation logic
 */

// Copy the core functions from the userscript
function parseDateTime(dateStr, timeStr) {
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

    const timeParts = timeStr.match(/(\d+):(\d+)/);
    if (!timeParts) return null;

    const hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);

    const date = new Date(year, month, day, hours, minutes);
    return date;
}

function formatDateForCalendar(date) {
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
        return null;
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

// Test runner
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ PASS: ${name}`);
        testsPassed++;
    } catch (error) {
        console.log(`❌ FAIL: ${name}`);
        console.log(`   Error: ${error.message}`);
        testsFailed++;
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}\n   Expected: ${expected}\n   Actual: ${actual}`);
    }
}

function assertNotNull(value, message) {
    if (value === null || value === undefined) {
        throw new Error(message);
    }
}

function assertContains(str, substring, message) {
    if (!str.includes(substring)) {
        throw new Error(`${message}\n   String does not contain: ${substring}`);
    }
}

// Run tests
console.log('\n🧪 Running Conference Calendar Helper Tests\n');
console.log('='.repeat(50));

// Test 1: Date parsing - standard format
test('Parse standard date format', () => {
    const date = parseDateTime('12 March 2026', '09:55');
    assertNotNull(date, 'Date should be parsed');
    assertEquals(date.getFullYear(), 2026, 'Year should be 2026');
    assertEquals(date.getMonth(), 2, 'Month should be March (2)');
    assertEquals(date.getDate(), 12, 'Day should be 12');
    assertEquals(date.getHours(), 9, 'Hour should be 9');
    assertEquals(date.getMinutes(), 55, 'Minutes should be 55');
});

// Test 2: Date parsing - single digit day
test('Parse date with single digit day', () => {
    const date = parseDateTime('5 January 2026', '14:30');
    assertNotNull(date, 'Date should be parsed');
    assertEquals(date.getDate(), 5, 'Day should be 5');
    assertEquals(date.getMonth(), 0, 'Month should be January (0)');
});

// Test 3: Date parsing - different months
test('Parse different months correctly', () => {
    const dateJan = parseDateTime('1 January 2026', '10:00');
    const dateDec = parseDateTime('31 December 2026', '23:59');

    assertEquals(dateJan.getMonth(), 0, 'January should be 0');
    assertEquals(dateDec.getMonth(), 11, 'December should be 11');
});

// Test 4: Time parsing - various formats
test('Parse different time formats', () => {
    const morning = parseDateTime('15 June 2026', '09:00');
    const afternoon = parseDateTime('15 June 2026', '14:45');
    const evening = parseDateTime('15 June 2026', '23:30');

    assertEquals(morning.getHours(), 9, 'Morning hour should be 9');
    assertEquals(afternoon.getHours(), 14, 'Afternoon hour should be 14');
    assertEquals(evening.getHours(), 23, 'Evening hour should be 23');
    assertEquals(afternoon.getMinutes(), 45, 'Minutes should be 45');
});

// Test 5: Calendar format output
test('Format date for calendar correctly', () => {
    const date = new Date(2026, 2, 12, 9, 55); // March 12, 2026, 09:55
    const formatted = formatDateForCalendar(date);
    assertEquals(formatted, '20260312T095500', 'Should format as YYYYMMDDTHHmmss');
});

// Test 6: Calendar format with padding
test('Format date with proper zero padding', () => {
    const date = new Date(2026, 0, 5, 8, 5); // January 5, 2026, 08:05
    const formatted = formatDateForCalendar(date);
    assertEquals(formatted, '20260105T080500', 'Should pad single digits with zeros');
});

// Test 7: Google Calendar URL generation
test('Generate valid Google Calendar URL', () => {
    const sessionData = {
        title: 'Test Session',
        description: 'Test description',
        location: 'Amsterdam, Netherlands',
        date: '12 March 2026',
        startTime: '09:55',
        endTime: '10:40',
        speaker: 'Dr. Test Speaker',
        url: 'https://test.com/session/123'
    };

    const url = generateGoogleCalendarUrl(sessionData);
    assertNotNull(url, 'URL should be generated');
    assertContains(url, 'calendar.google.com', 'Should be Google Calendar URL');
    assertContains(url, 'action=TEMPLATE', 'Should have TEMPLATE action');
    assertContains(url, 'Test+Session', 'Should include encoded title');
});

// Test 8: URL contains correct date range
test('Google Calendar URL has correct date range', () => {
    const sessionData = {
        title: 'Test',
        description: 'Test',
        location: 'Amsterdam',
        date: '12 March 2026',
        startTime: '09:55',
        endTime: '10:40',
        speaker: 'Speaker',
        url: 'https://test.com'
    };

    const url = generateGoogleCalendarUrl(sessionData);
    assertContains(url, '20260312T095500', 'Should include start date/time');
    assertContains(url, '20260312T104000', 'Should include end date/time');
});

// Test 9: Invalid date handling
test('Handle invalid date gracefully', () => {
    const invalidDate = parseDateTime('Invalid Date', '09:00');
    assertEquals(invalidDate, null, 'Should return null for invalid date');
});

// Test 10: Invalid time handling
test('Handle invalid time gracefully', () => {
    const invalidTime = parseDateTime('12 March 2026', 'invalid');
    assertEquals(invalidTime, null, 'Should return null for invalid time');
});

// Test 11: URL encoding special characters
test('URL encodes special characters in title', () => {
    const sessionData = {
        title: 'AI & ML: A Deep-Dive',
        description: 'Description',
        location: 'Amsterdam',
        date: '12 March 2026',
        startTime: '09:00',
        endTime: '10:00',
        speaker: 'Speaker',
        url: 'https://test.com'
    };

    const url = generateGoogleCalendarUrl(sessionData);
    assertContains(url, 'AI+%26+ML', 'Should encode special characters');
});

// Test 12: Multiple time ranges
test('Handle different session durations', () => {
    const shortSession = parseDateTime('12 March 2026', '09:00');
    const shortSessionEnd = parseDateTime('12 March 2026', '09:30');
    const longSession = parseDateTime('12 March 2026', '14:00');
    const longSessionEnd = parseDateTime('12 March 2026', '16:00');

    const shortDuration = (shortSessionEnd - shortSession) / 60000; // minutes
    const longDuration = (longSessionEnd - longSession) / 60000; // minutes

    assertEquals(shortDuration, 30, 'Short session should be 30 minutes');
    assertEquals(longDuration, 120, 'Long session should be 120 minutes');
});

// Print results
console.log('='.repeat(50));
console.log(`\n📊 Test Results:`);
console.log(`   Passed: ${testsPassed}`);
console.log(`   Failed: ${testsFailed}`);
console.log(`   Total:  ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
} else {
    console.log('\n⚠️  Some tests failed!\n');
    process.exit(1);
}
