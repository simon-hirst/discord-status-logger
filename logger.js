// ==UserScript==
// @name         Discord Status Logger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Logs the status (online, offline, idle, dnd) of a specified user over time. NO self-botting, just DOM scraping.
// @author       https://github.com/simon-hirst
// @match        https://discord.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_USER_ID = 'SET ME!!!'; // <--- SET THIS :)
    const CHECK_INTERVAL_MS = 15000;
    const STORAGE_KEY = `status_log_${TARGET_USER_ID}`;

    function showLogs() {
        const logData = GM_getValue(STORAGE_KEY, '[]');
        const logs = JSON.parse(logData);

        if (logs.length === 0) {
            alert('No status logs have been recorded yet.');
            return;
        }
        const logText = logs.map(log => `${log.timestamp}: ${log.status}`).join('\n');
        alert(`--- Status History for ${TARGET_USER_ID} ---\n\n${logText}`);
    }

    const logButton = document.createElement('button');
    logButton.innerHTML = 'View Logs';
    logButton.style = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 5px; background-color: #7289DA; color: white; border: none; border-radius: 5px; cursor: pointer;';
    document.body.appendChild(logButton);
    logButton.addEventListener('click', showLogs);

    function getStatusFromMask(maskUrl) {
        if (!maskUrl) return 'offline';
        if (maskUrl.includes('online')) return 'online';
        if (maskUrl.includes('idle')) return 'idle';
        if (maskUrl.includes('dnd')) return 'dnd';
        if (maskUrl.includes('streaming')) return 'streaming';
        return 'offline';
    }

    function checkAndLogStatus() {
    let currentStatus = 'offline';

    const userAvatarElement = document.querySelector(`img[src*='/${TARGET_USER_ID}/']`);

    if (userAvatarElement) {
        const container = userAvatarElement.closest('div[role="img"][aria-label]');

        if (container) {
            const labelText = container.getAttribute('aria-label');

            if (labelText.toLowerCase().includes('online')) {
                currentStatus = 'online';
            } else if (labelText.toLowerCase().includes('idle')) {
                currentStatus = 'idle';
            } else if (labelText.toLowerCase().includes('do not disturb')) {
                currentStatus = 'dnd';
            }
        }
    }

    const logData = GM_getValue(STORAGE_KEY, '[]');
    const logs = JSON.parse(logData);
    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    const lastStatus = lastLog ? lastLog.status : null;

    if (currentStatus !== lastStatus) {
        const timestamp = new Date().toLocaleString();
        logs.push({ status: currentStatus, timestamp: timestamp });
        GM_setValue(STORAGE_KEY, JSON.stringify(logs));
    }
}

    console.log('[Status Logger] Operating in secure storage mode.');
    setInterval(checkAndLogStatus, CHECK_INTERVAL_MS);
})();
