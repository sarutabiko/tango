
const tableNode = document.querySelector('#right table');
const addButton = document.querySelector('#addToListButton');

const selectedCells = [];

const addButtonToggler = function (NofSelectedWords) {
    if (NofSelectedWords)
        addButton.removeAttribute('disabled');
    else {
        addButton.setAttribute('disabled', true);
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

if (tableNode) {
    const tableCells = document.querySelectorAll('#right table tbody tr td');

    tableCells.forEach(cell => cell.addEventListener('click', selectWord));
}

if (addButton) {
    addButton.addEventListener('click', () => {
        // send request with body containing index of these selected words and id of the wordlist
        const selection = selectedCells.map(i => document.querySelector(`td[data-i="${i}"   ]`));
        console.log(selection);
    })
}