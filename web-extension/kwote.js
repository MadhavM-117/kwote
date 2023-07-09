(() => {
    if (window.hasRun) {
        return;
    }

    window.hasRun = true;


    let selectionPopup = null;
    const createPopup = (buttonCallback) => {

        const popup = document.createElement('div');

        const popupButton = document.createElement('button');
        popupButton.style.padding = '8px';
        popupButton.style.backgroundColor = '#191919';
        popupButton.style.color = '#fff';
        popupButton.style.marginBottom = '4px';
        popupButton.style.borderRadius = '4px';
        popupButton.style.border = '1px solid #4d4d4d'
        popupButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.25)';
        popupButton.textContent = 'Kwote This!';
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


    const checkEntries = async () => {
        const entryIds = await getData('entryIds') || [];
        for (const entryId of entryIds) {
            const entry = await getData(entryId);
            console.log(entryId, entry);
        }
    }

    // Function to save data to local storage
    const saveData = async (key, value) => {
        const data = {};
        data[key] = value;

        await browser.storage.local.set(data)
            .catch(error => {
                console.error('Error saving data:', error);
            });
    }

    // Function to retrieve data from local storage
    const getData = async (key) => {
        return await browser.storage.local.get(key)
            .then(result => {
                return result[key];
            })
            .catch(error => {
                console.error('Error retrieving data:', error);
            });
    }

    // function to save the quote
    const saveQuote =  async () => {
        let entryIds = await getData('entryIds')|| [];

        if (!Array.isArray(entryIds)) {
            console.error("entryIds is not an array.", entryIds);
            entryIds = [];
        }

        const uuid = window.crypto.randomUUID();
        const quote = window.getSelection().toString();

        entryIds.unshift(uuid);
        await saveData('entryIds', entryIds);
        await saveData(uuid, quote);
    }

    // Function to handle text selection
    const handleSelection = () => {
        const selectedText = window.getSelection().toString();

        // TODO: add logic to update popup position on selection change
        // preventing multiple popups if one already exists
        if (selectedText && !selectionPopup) {
            createPopup(async () => {
                await saveQuote();
                window.getSelection().empty();
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


