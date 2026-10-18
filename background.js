// background.js - LuckyStrike OGame Helper Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
    console.log('[LS Background] LuckyStrike Service Worker installed.');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'SHOW_NOTIFICATION') {
        try {
            const notifId = 'ls-threat-' + Date.now();
            const iconUrl = chrome.runtime.getURL('icons/icon128.png');
            chrome.notifications.create(notifId, {
                type: 'basic',
                iconUrl: iconUrl,
                title: message.title || '🚨 LuckyStrike OGame Uyarısı',
                message: message.message || message.body || '',
                priority: 2,
                requireInteraction: true,
                silent: false
            }, (createdId) => {
                if (chrome.runtime.lastError) {
                    console.warn('[LS Background] Notification creation error:', chrome.runtime.lastError);
                }
            });
            sendResponse({ success: true });
        } catch (err) {
            console.error('[LS Background] Error in notification creation:', err);
            sendResponse({ success: false, error: err.message });
        }
    }
    return true;
});

// When user clicks the desktop notification, bring the OGame tab and window into focus
chrome.notifications.onClicked.addListener((notifId) => {
    try {
        chrome.tabs.query({ url: '*://*.ogame.gameforge.com/*' }, (tabs) => {
            if (tabs && tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, { active: true });
                if (tabs[0].windowId) {
                    chrome.windows.update(tabs[0].windowId, { focused: true });
                }
            }
        });
        chrome.notifications.clear(notifId);
    } catch (e) {}
});
