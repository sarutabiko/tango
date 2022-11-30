const tableNode = document.querySelector('#right table');
const addButton = document.querySelector('#addToListButton');
const deleteButton = document.querySelector('#deleteButton');
const selectListBox = document.getElementById('selectListBox');
const sendListButton = document.getElementById('sendListButton');
const selectDropdown = document.getElementById('list-select');
const createListButton = document.getElementById('createListButton');
const listViewSelect = document.getElementById('list-viewer');

// stores if there's a popup currently
let popup = false;

let selectedCells = [];

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

// A bunch of button disabling togglers
const addButtonToggler = function (NofSelectedWords) {
    if (NofSelectedWords) {
        addButton.removeAttribute('disabled');
    }
    else {
        addButton.setAttribute('disabled', true);
        sendListButton.setAttribute('disabled', true);
    }
}
// will prevent adding word to a list from itself (at least on the front)
const sendButtonToggler = function () {
    if (selectDropdown.value === listViewSelect.value)
        sendListButton.setAttribute('disabled', true);
    else
        sendListButton.removeAttribute('disabled');
}
const deleteButtonToggler = function (NofSelectedWords) {
    if (NofSelectedWords) {
        deleteButton.removeAttribute('disabled');
    }
    else {
        deleteButton.setAttribute('disabled', true);
    }

}

const buttonBoxToggler = function (selectedN) {
    if (addButton)
        addButtonToggler(selectedN)
    if (deleteButton)
        deleteButtonToggler(selectedN)
}
// Track selected words and toggle buttons accordingly
const selectWord = function (e) {
    // console.log('event target?: ', e.target);
    const dataI = e.target.getAttribute('data-i');
    if (e.target.classList.toggle("selectedCell")) {
        selectedCells.push(parseInt(dataI));
        selectedCells = selectedCells.sort(sortDescend);
    }
    else {
        const index = selectedCells.indexOf(parseInt(dataI))
        if (index > -1) { // only splice array when item is found
            selectedCells.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    // console.log(selectedCells);
    buttonBoxToggler(selectedCells.length);
}

// Shows input area to enter new List name, also disables current List when adding a word
const createListToggler = function () {
    // Show create list option only when "Create list" is selected
    const val = document.getElementById('list-select').value;
    console.log('val is;', val)
    if (val === 'new') {
        document.getElementById('createList').setAttribute('style', 'display:flex;');
        document.getElementById('sendListButton').setAttribute('disabled', true);
    }
    else {
        document.getElementById('createList').setAttribute('style', 'display:none;');
        document.getElementById('sendListButton').removeAttribute('disabled');
    }
}

// Will create new list in DB and update select drop-down and select it
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

// Will popup/down the selectList box and add click handler
const selectListBoxPopup = function () {
    const disableCurrent = document.querySelector(`#list-select option[value='${listViewSelect.value}']`);
    sendButtonToggler();

    if (!popup) {
        // Disable current list
        disableCurrent.setAttribute('disabled', true);

        selectListBox.setAttribute('style', 'display: block;');
        //true argument in addEventListener would ensure that the handler is executed on the event capturing phase
        //i.e a click on any element would first be captured on the document and the listener for document's click event would
        //be executed first before listener for any other element. The trick here is to stop the event from further propagation to the elements
        //below thus ending the dispatch process to make sure that the event doesn't reach the target.
        document.addEventListener('click', handler, true);
    }
    else {
        selectListBox.setAttribute('style', 'display: none;');
        disableCurrent.removeAttribute('disabled');
    }
    popup = !popup;
}

// Will add click events to words to select them, also called by table generator
const addEventListenerSelectWord = function () {
    const tableCells = document.querySelectorAll('#right table tbody tr td');
    tableCells.forEach(cell => cell.addEventListener('click', selectWord));
}
// make GET request to get all words in given list and make a table based on that data.
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
                td.innerHTML = getList.words[c + j].Kanji[0];
            else
                td.innerHTML = getList.words[c + j].Reading[0];
            tr.append(td)
        };
        table.appendChild(tr);
        c += 4;
    }

    // updateWordCount
    document.querySelector('table tr th span').innerHTML = `${getList.words.length} words`;

    addEventListenerSelectWord();
}

// Add list viewer if there are any lists available to view
if (tableNode) {
    listViewSelect.addEventListener('change', (e) => {
        generateTable(e.target.value);
        selectedCells = [];
        buttonBoxToggler(selectedCells.length);
    });
}

// If logged in (add button wouldn't appear otherise), add "select word" functionality to add/delete to own lists
// and 
if (addButton) {
    addEventListenerSelectWord();

    addButton.addEventListener('click', () => {
        // send request with body containing index of these selected words and id of the wordlist
        createListToggler();
        selectListBoxPopup();
    })

    if (deleteButton) {
        // send request with body containing index of the list the word(s) are in, selected words and id of the wordlist
        deleteButton.addEventListener('click', async () => {

            const listID = document.getElementById('list-viewer').value;

            console.log('called delete');
            const response = await fetch('/word', {
                method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    listID, selectedCells
                })  // body data type must match "Content-Type" header
            }).then(r => r.json());
            console.log(response);

            if (response) {
                selectedCells = [];
                generateTable(listID);
            }
            else
                console.log(response);
        })
    }
    // Sends the request that actually adds the words to a given list and removes it from Unlisted.
    // Removing from unlisted is only for loggedIn.self users, for others it should just add the word to their list
    sendListButton.addEventListener('click', async () => {
        const toListID = document.getElementById('list-select').value;
        const fromListID = document.querySelector('#list-viewer').value
        // console.log("SelectedCells and llistID are: ", selectedCells, listID);

        const response = await fetch(window.location.href, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                toListID, fromListID, selectedCells
            })  // body data type must match "Content-Type" header
        }).then(r => r.json());
        // console.log(response);

        location.reload(true);
    })

    // Create List toggle event listener
    selectDropdown.addEventListener('change', createListToggler);
    // Create List event listener
    createListButton.addEventListener('click', createList);
}

