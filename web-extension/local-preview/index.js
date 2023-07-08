const createSelectionPreview = (selectionText, onDelete) => {
    const container = document.getElementById('preview-container');

    const previewContainer = document.createElement('div');
    previewContainer.classList.add('selection-preview-container');

    const preview = document.createElement('div');
    previewContainer.appendChild(preview);

    preview.classList.add('selection-preview-content');
    preview.textContent = selectionText;

    const deleteButton = document.createElement('button');
    previewContainer.appendChild(deleteButton);

    deleteButton.classList.add('selection-preview-delete');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', onDelete);

    container.appendChild(previewContainer);

    return previewContainer;
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

const saveData = async (key, value) => {
    const data = {};
    data[key] = value;

    await browser.storage.local.set(data)
        .catch(error => {
            console.error('Error saving data:', error);
        });
}

const clearData = async (key) => {
    await browser.storage.local.remove(key)
        .catch(error => {
            console.error('Error clearing data:', error);
        });
}

const deleteEntry = async (entryId) => {
    const entryIds = await getData('entryIds') || [];
    const index = entryIds.indexOf(entryId);

    if (index > -1) {
        entryIds.splice(index, 1);
    }

    await saveData('entryIds', entryIds);
    await clearData(entryId);
}

// fetch all entries and display on the page
const checkEntries = async () => {
    clearPreviews();
    const entryIds = await getData('entryIds') || [];
    for (const entryId of entryIds) {
        const entry = await getData(entryId);
        previewContainers.push(
            createSelectionPreview(
                entry,
                async () => {
                    await deleteEntry(entryId);
                    await checkEntries();
                }
            )
        );
    }
}


document.getElementById('sync').addEventListener('click', checkEntries);

window.addEventListener('load', checkEntries);

