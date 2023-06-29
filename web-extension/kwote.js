(() => {
    if (window.hasRun) {
        return;
    }

    window.hasRun = true;


    let selectionPopup = null;
    const createPopup = (buttonCallback) => {

        const popup = document.createElement('div');
        popup.className = 'selection-popup';

        const popupButton = document.createElement('button');
        popupButton.textContent = 'Click Me!';
        popupButton.addEventListener('click', buttonCallback);

        popup.appendChild(popupButton);
        // position must be set to absolute before calculating the leftOffset. Otherwise, the offsetWidth will be full page width.
        popup.style.position = 'absolute';
        document.body.appendChild(popup);

        // Position the pop-up above the selected text
        const selectionRange = window.getSelection().getRangeAt(0);
        const boundingRect = selectionRange.getBoundingClientRect();
        const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        const topOffset = boundingRect.top + scrollOffset - popup.offsetHeight;
        const leftOffset = boundingRect.left + ((Math.abs(boundingRect.width) / 2.0) - (Math.abs(popup.offsetWidth) /2.0));

        popup.style.top = (topOffset) + 'px';
        popup.style.left = (leftOffset) + 'px';

        // Remove the pop-up when the selection changes
        selectionPopup = popup;
    }

    // function to save the quote
    const saveQuote = () => {
        console.log("saved: ", window.getSelection().toString());
    }

    // Function to handle text selection
    const handleSelection = () => {
        const selectedText = window.getSelection().toString();

        // TODO: add logic to update popup position on selection change
        // preventing multiple popups if one already exists
        if (selectedText && !selectionPopup) {
            createPopup(() => {
                saveQuote();
            });
        }
    }

    // Listen for text selection events
    document.addEventListener('mouseup', handleSelection);

    document.addEventListener('selectionchange', () => {
        if (!window.getSelection().toString() && selectionPopup) {
            selectionPopup.remove();
            selectionPopup = null;
        }
    });
})();


