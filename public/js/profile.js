const tableNode = document.querySelector('#right table');
const addButton = document.querySelector('#addToListButton');
const selectListBox = document.getElementById('selectListBox');
const sendListButton = document.getElementById('sendListButton');
const selectDropdown = document.getElementById('list-select');
const createListButton = document.getElementById('createListButton');
const listViewSelect = document.getElementById('list-viewer');

// stores if there's a popup currently
let popup = false;

const selectedCells = [];

const handler = function (e) {
    if (selectListBox.contains(e.target))
        return;
    else if (popup) {
        e.stopPropagation();
        e.preventDefault();
        selectListBoxPopup();
        document.removeEventListener('click', handler, true);
    }
}

const addButtonToggler = function (NofSelectedWords) {
    if (NofSelectedWords) {
        addButton.removeAttribute('disabled');
        sendListButton.removeAttribute('disabled');
    }
    else {
        addButton.setAttribute('disabled', true);
        sendListButton.setAttribute('disabled', true);
    }

}

const selectWord = function (e) {
    // console.log('event target?: ', e.target);
    const dataI = e.target.getAttribute('data-i');
    if (e.target.classList.toggle("selectedCell"))
        selectedCells.push(dataI);
    else {
        const index = selectedCells.indexOf(dataI)
        if (index > -1) { // only splice array when item is found
            selectedCells.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    // console.log(selectedCells);
    addButtonToggler(selectedCells.length);
}

const createListToggler = function () {
    const val = document.getElementById('list-select').value;
    if (val === '') {
        document.getElementById('createList').setAttribute('style', 'display:flex;');
        document.getElementById('sendListButton').setAttribute('disabled', true);
    }
    else {
        document.getElementById('createList').setAttribute('style', 'display:none;');
        document.getElementById('sendListButton').removeAttribute('disabled');
    }
}

const createList = async function () {
    const name = document.getElementById('newListName').value;

    if (name === '')
        return console.log("Name can't be empty");
    else if (name === 'Untitled')
        return console.log("Name can't be 'Untitled'")
    else {
        createListButton.setAttribute('disabled', true);

        const response = await fetch(`${window.location.href}/lists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                name
            })
        }).then(r => r.json());
        // console.log(response);

        // Add the new listName with value=_id to the dropdown
        createListButton.removeAttribute('disabled');

        if (response._id) {
            //add new option val and name and choose it
            const newlyCreated = document.createElement('option');
            newlyCreated.setAttribute('value', response._id);
            newlyCreated.setAttribute('name', 'listID');
            newlyCreated.innerHTML = response.name;
            selectDropdown.prepend(newlyCreated);
            selectDropdown.value = response._id;
            selectDropdown.dispatchEvent(new Event('change'))
        }
    }

}

const selectListBoxPopup = function () {
    if (!popup) {
        selectListBox.setAttribute('style', 'display: block;');
        //true argument in addEventListener would ensure that the handler is executed on the event capturing phase
        //i.e a click on any element would first be captured on the document and the listener for document's click event would
        //be executed first before listener for any other element. The trick here is to stop the event from further propagation to the elements
        //below thus ending the dispatch process to make sure that the event doesn't reach the target.
        document.addEventListener('click', handler, true);
    }
    else
        selectListBox.setAttribute('style', 'display: none;')
    popup = !popup;
}

const addEventListenerSelectWord = function () {
    const tableCells = document.querySelectorAll('#right table tbody tr td');
    tableCells.forEach(cell => cell.addEventListener('click', selectWord));
}
// make GET request to get all words in given list
const generateTable = async function (listID) {
    // gray out cells while request is being made
    const tableCells = document.querySelectorAll('#right table tbody tr td');
    tableCells.forEach(c => c.setAttribute('style', 'color:gray;'));

    const getList = await fetch(`/word/lists/${listID}`, {
        method: 'GET',
        credentials: "same-origin",
        headers: {
            // cache: 'no-cache',
            // 'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(r => r.json());

    tableCells.forEach(c => c.setAttribute('style', 'color:inherit;'));
    // console.log('geetlist: ', getList)


    const table = document.querySelector('table tbody');
    const toBeDeleted = document.querySelectorAll('table tr');
    toBeDeleted.forEach((tr, index) => { if (index) { tr.remove() } });

    let c = 0;
    while (c < getList.words.length) {
        let i = Math.min(4, getList.words.length - c);
        const tr = document.createElement('tr');
        for (let j = 0; j < i; j++) {
            const td = document.createElement('td');
            td.setAttribute('data-i', c + j);
            if (getList.words[c + j].Kanji.length)
                td.innerHTML = getList.words[c + j].Kanji;
            else
                td.innerHTML = getList.words[c + j].Reading;
            tr.append(td)
        };
        table.appendChild(tr);
        c += 4;
    }

    if (document.querySelector(`option[value='${listViewSelect.value}']`).id == 'unlisted') {
        addEventListenerSelectWord();
    }
}

if (tableNode) {

    addEventListenerSelectWord();

    listViewSelect.addEventListener('change', (e) => {
        generateTable(e.target.value)
    });
}

if (addButton) {
    addButton.addEventListener('click', () => {
        // send request with body containing index of these selected words and id of the wordlist
        selectListBoxPopup();
        createListToggler();
    })

    sendListButton.addEventListener('click', async () => {
        const listID = document.getElementById('list-select').value;
        const defaultID = document.querySelector('#list-select #unlisted').value;
        // console.log("SelectedCells and llistID are: ", selectedCells, listID);

        const response = await fetch(window.location.href, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                listID, defaultID, selectedCells
            })  // body data type must match "Content-Type" header
        }).then(r => r.json());

        location.reload(true);
    })

    selectDropdown.addEventListener('change', createListToggler);
    createListButton.addEventListener('click', createList)



}

