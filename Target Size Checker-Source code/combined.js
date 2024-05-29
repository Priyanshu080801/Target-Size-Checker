// Function to apply or remove highlights
function toggleHighlighting(enableHighlighting) {
    if (enableHighlighting) {
        applyHighlights();
    } else {
        removeHighlights();
    }
}

// Function to apply highlights
function applyHighlights() {
    // Implementation remains the same
}

// Function to remove highlights
function removeHighlights() {
    // Implementation remains the same
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'toggleHighlighting') {
        toggleHighlighting(message.enableHighlighting);
        sendResponse({ result: 'Highlighting toggled.' });
        // Return true to indicate that sendResponse will be called asynchronously
        return true;
    }
});

// Check if running in the popup context
if (typeof document !== 'undefined' && document.location.href.includes('popup.html')) {
    // Implementation remains the same
}

// Check if running in the background context
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onInstalled) {
    // Implementation remains the same
}




// Function to apply or remove highlights
function toggleHighlighting(enableHighlighting) {
    if (enableHighlighting) {
        applyHighlights();
    } else {
        removeHighlights();
    }
}

// Function to apply highlights
function applyHighlights() {
    var clickableElements = document.querySelectorAll('a, label, button, input:not([type=hidden]), select, textarea, [tabindex], [role=button], [role=checkbox], [role=link], [role=menuitem], [role=option], [role=radio], [role=switch], [role=tab]');

    clickableElements.forEach(function(element) {
        var rect = element.getBoundingClientRect();
        var width = rect.width;
        var height = rect.height;

        if (width >= 24 && height >= 24) {
            element.style.border = '2px solid green'; // Highlight control boundary with green border
        } else {
            element.style.border = '2px solid red'; // Highlight control boundary with red border
        }
    });
}

// Function to remove highlights
function removeHighlights() {
    var clickableElements = document.querySelectorAll('a, label, button, input:not([type=hidden]), select, textarea, [tabindex], [role=button], [role=checkbox], [role=link], [role=menuitem], [role=option], [role=radio], [role=switch], [role=tab]');

    clickableElements.forEach(function(element) {
        element.style.border = ''; // Remove border style
    });
}

// Check if running in the content script context
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === 'toggleHighlighting') {
            toggleHighlighting(message.enableHighlighting);
            sendResponse({ result: 'Highlighting toggled.' });
        }
    });
}

// Check if running in the popup context
if (typeof document !== 'undefined' && document.location.href.includes('popup.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const toggleButton = document.querySelector('.neon');

        toggleButton.addEventListener('change', function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs.length > 0) {
                    chrome.runtime.sendMessage({
                        tabId: tabs[0].id,
                        action: 'toggleHighlighting',
                        enableHighlighting: toggleButton.checked
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError.message);
                        } else if (response && response.result) {
                            console.log(response.result);
                        } else {
                            console.log('No response received or response is undefined.');
                        }
                    });
                } else {
                    console.error('No active tab found');
                }
            });

            // Update ARIA attribute
            toggleButton.setAttribute('aria-checked', toggleButton.checked ? 'true' : 'false');
        });
    });
}

// Check if running in the background context
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onInstalled) {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === 'toggleHighlighting') {
            chrome.scripting.executeScript({
                target: { tabId: message.tabId },
                files: ['combined.js']
            }, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    sendResponse({ result: 'Error injecting content script.' });
                    return;
                }
                chrome.tabs.sendMessage(message.tabId, {
                    action: 'toggleHighlighting',
                    enableHighlighting: message.enableHighlighting
                }, function(response) {
                    sendResponse(response);
                });
            });

            // Return true to indicate that sendResponse will be called asynchronously
            return true;
        }
    });
}
