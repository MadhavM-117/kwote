const createSelectionPreview = (selectionText) => {
    const preview = document.createElement('div');
    preview.classList.add('selection-preview');
    preview.textContent = selectionText;
    document.body.appendChild(preview);
    return preview;
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

const previewContainers = [];

// clear all previews
const clearPreviews = () => {
    previewContainers.forEach(container => {
        container.remove();
    });
}

// fetch all entries and display on the page
const checkEntries = async () => {
    clearPreviews();
    const entryIds = await getData('entryIds') || [];
    for (const entryId of entryIds) {
        const entry = await getData(entryId);
        previewContainers.push(createSelectionPreview(entry));
    }
}


document.getElementById('sync').addEventListener('click', checkEntries);


