// ==UserScript==
// @name         Simple Test Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Test if Tampermonkey works
// @author       You
// @match        https://aiconference.nl/*
// @match        https://phpconference.nl/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('🎉 TAMPERMONKEY IS WORKING! Script loaded successfully!');
    alert('Tampermonkey test script is running!');
})();
