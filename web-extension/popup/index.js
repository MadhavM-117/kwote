// Function to send a message to the background script
function sendMessageToBackgroundScript(message) {
    chrome.runtime.sendMessage(message)
        .then(response => {
            console.log('Message sent to background script:', message);
        })
        .catch(error => {
            console.error('Error sending message to background script:', error);
        });
}

    // Function to handle button click in the popup
function handleButtonClick() {
    // Send a message to the background script to open a new tab
    sendMessageToBackgroundScript({ action: 'openNewTab' });
}

    // Attach event listener to the button
document.getElementById('preview').addEventListener('click', handleButtonClick);
