/**
 *
 * @param savedQuote {{quote: string, url: string, title: string}}
 * @param onDelete
 * @returns {HTMLDivElement}
 */
const createSelectionPreview = (savedQuote, onDelete) => {
    const contentContainer = document.getElementById('preview-container');

    const previewContainer = document.createElement('div');
    previewContainer.classList.add('selection-preview-container');

    const previewHeader = document.createElement('div');
    previewHeader.classList.add('selection-preview-header');
    previewContainer.appendChild(previewHeader);

    const previewTitle = document.createElement('h3');
    previewHeader.appendChild(previewTitle);
    previewTitle.classList.add('selection-preview-title');
    previewTitle.textContent = savedQuote.title;

    const previewSource = document.createElement('span');
    previewHeader.appendChild(previewSource);

    const sourceLink = document.createElement('a');
    sourceLink.href = savedQuote.url;
    sourceLink.target = '_blank';
    sourceLink.textContent = 'Source URL';

    previewSource.appendChild(sourceLink);

    const deleteButton = document.createElement('button');
    previewHeader.appendChild(deleteButton);

    deleteButton.classList.add('selection-preview-delete');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', onDelete);

    const preview = document.createElement('div');
    previewContainer.appendChild(preview);

    preview.classList.add('selection-preview-content');
    preview.textContent = savedQuote.quote;

    contentContainer.appendChild(previewContainer);

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

