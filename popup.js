document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveBtn');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const scrollTimeInput = document.getElementById('scrollTime');
    const status = document.getElementById('status');

    // Load saved time value on popup open
    chrome.storage.sync.get(['scrollTime'], function(result) {
        if (result.scrollTime) {
            scrollTimeInput.value = result.scrollTime;
        }
    });

    // Save button functionality
    saveBtn.addEventListener('click', function() {
        const timeValue = parseInt(scrollTimeInput.value);
        
        if (timeValue && timeValue > 0) {
            chrome.storage.sync.set({scrollTime: timeValue}, function() {
                status.textContent = 'Value saved!';
                setTimeout(() => {
                    status.textContent = 'Ready';
                }, 2000);
            });
        } else {
            status.textContent = 'Please enter a valid time';
            setTimeout(() => {
                status.textContent = 'Ready';
            }, 2000);
        }
    });

    // Start button functionality
    startBtn.addEventListener('click', function() {
        const timeValue = parseInt(scrollTimeInput.value);
        
        if (timeValue && timeValue > 0) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'startScroll',
                    duration: timeValue * 1000 // Convert to milliseconds
                });
                status.textContent = 'Scrolling started...';
            });
        } else {
            status.textContent = 'Please enter a valid time';
            setTimeout(() => {
                status.textContent = 'Ready';
            }, 2000);
        }
    });

    // Stop button functionality
    stopBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'stopScroll'
            });
            status.textContent = 'Scrolling stopped';
            setTimeout(() => {
                status.textContent = 'Ready';
            }, 2000);
        });
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'scrollComplete') {
            status.textContent = 'Scroll complete!';
            setTimeout(() => {
                status.textContent = 'Ready';
            }, 2000);
        }
    });
});