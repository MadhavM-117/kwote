
// Listener for messages from the popup script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('received message', message, sender, sendResponse) ;

    if (message.action === 'openNewTab') {
        // Open a new tab with the extension HTML page
        browser.tabs.create({
            url: browser.runtime.getURL('/local-preview/index.html')
        }).then(tab => {
            console.log('New tab opened with URL:', tab.url);
            sendResponse({ success: true });
        }).catch(error => {
            console.error('Error opening new tab:', error);
            sendResponse({ success: false, error });
        });

        // Inform the popup script that the action was processed
        return true;
    }
});
