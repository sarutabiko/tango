const tableNode = document.querySelector('#right table');
const addButton = document.querySelector('#addToListButton');
const deleteButton = document.querySelector('#deleteButton');
const editListButton = document.querySelector('#editListButton');
const editListBox = document.querySelector('#editListBox');
const editButton = document.querySelector('#editButton');
const selectListBox = document.getElementById('selectListBox');
const sendListButton = document.getElementById('sendListButton');
const selectDropdown = document.getElementById('list-select');
const createListButton = document.getElementById('createListButton');
const listViewSelect = document.getElementById('list-viewer');
let oldListViewSelectVal = document.getElementById('list-viewer').value;

let selectedCells = [];

const handler = function (popupState, popupBox, popupFunc) {
    return function (e) {
        if (popupBox.contains(e.target))
            return;
        else if (popupState) {
            e.stopPropagation();
            e.preventDefault();
            popupFunc();
            document.removeEventListener('click', handler, true);
        }
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
    const dataI = e.target.getAttribute('data-wid');
    if (e.target.classList.toggle("selectedCell")) {
        selectedCells.push(dataI);
        // selectedCells.push(parseInt(dataI));
        // selectedCells = selectedCells.sort(sortDescend);
    }
    else {
        const index = selectedCells.indexOf(dataI);
        // const index = selectedCells.indexOf(parseInt(dataI))
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
    // console.log('val is;', val)
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
            td.setAttribute('data-wid', getList.words[c + j]._id);
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

// Reset selection
const resetSelection = function () {
    const selectedElements = document.querySelectorAll('.selectedCell');

    selectedElements.forEach((element) => {
        element.classList.remove('selectedCell')
    });

    selectedCells = [];
    buttonBoxToggler(0);

}

// Add list viewer if there are any lists available to view
if (tableNode) {
    listViewSelect.addEventListener('change', async (e) => {
        //re enable old list option
        const reEnableOld = document.querySelector(`#list-select option[value='${oldListViewSelectVal}']`);
        reEnableOld.removeAttribute('disabled');
        oldListViewSelectVal = document.getElementById('list-viewer').value;

        // wait for new data
        listViewSelect.setAttribute('style', 'background-color: lavender');
        await generateTable(e.target.value);
        resetSelection();
        listViewSelect.removeAttribute('style');
        // buttonBoxToggler(selectedCells.length);
    });
}

// If logged in (add button wouldn't appear otherise), add "select word" functionality to add/delete to own lists
if (addButton) {
    addEventListenerSelectWord();

    addButton.addEventListener('click', () => {
        // send request with body containing index of these selected words and id of the wordlist
        createListToggler();
        // disable current listview
        const disableCurrent = document.querySelector(`#list-select option[value='${listViewSelect.value}']`);
        disableCurrent.setAttribute('disabled', 'true')
        sendButtonToggler();
    })

    // deleteButton will only appear on self's profile page
    if (deleteButton) {
        // send request with body containing index of the list the word(s) are in, selected words and id of the wordlist
        deleteButton.addEventListener('click', async () => {

            const listID = document.getElementById('list-viewer').value;

            deleteButton.setAttribute('style', 'background-color: lavender');

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

            deleteButton.removeAttribute('style');

            if (response) {
                resetSelection();
                generateTable(listID);
                immediateFlash('successFlash', `Deleted ${response.words.length} word(s)`);
            }
            else
                console.log(response);
        })
    }
    // Sends the request that actually adds the words to a given list and removes it from Unlisted.
    // Removing from unlisted is only for loggedIn.self users, for others it should just add the word to their list
    sendListButton.addEventListener('click', async () => {

        blur(sendListButton);
        const toListID = selectDropdown.value;
        const fromListID = listViewSelect.value;
        // console.log("SelectedCells and llistID are: ", selectedCells, listID);

        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                toListID, fromListID, selectedCells
            })  // body data type must match "Content-Type" header
        }).then(r => r.json());
        // console.log(response);

        unblur(sendListButton);

        //close popup, redraw table if word is removed from unlisted, flash message
        const currentOption = listViewSelect.options[listViewSelect.selectedIndex];
        selectListBoxPopup();
        if (currentOption.hasAttribute('id') && currentOption.getAttribute('id') === 'unlisted') {
            generateTable(fromListID);
            immediateFlash('successFlash', `${response.wordIDArray.length} word(s) moved to list`);
        }
        else
            immediateFlash('successFlash', `${response.wordIDArray.length} word(s) added to list`);
        resetSelection();

    })

    // Create List toggle event listener
    selectDropdown.addEventListener('change', createListToggler);
    // Create List event listener
    createListButton.addEventListener('click', createList);
}

