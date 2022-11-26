// Get item passed form /search
let word = JSON.parse(localStorage.getItem('word'));
// console.log(word);

// Check authentication
if (document.querySelector("#credentials #authMessage")) {
    document.querySelector("#credentials #authMessage").innerText = "You need to log-in to save words";
    document.querySelector("#credentials #authMessage").setAttribute('style', 'display:block');
}

// Form components contructor function
const divConstructor = function (title, arr) {
    const main = document.querySelector('#formBody form');

    const box = document.createElement("div");
    box.setAttribute('id', title);
    box.innerHTML = `${title}<hr>`;

    console.log("arr is: ", arr)
    console.log("title is: ", title)

    arr.forEach(i => {
        const entry = document.createElement("div");
        entry.setAttribute('class', 'entry');

        const term = document.createElement("div");
        term.setAttribute('class', 'term');

        i.forEach(str => {


            const label = document.createElement('label');
            label.setAttribute('for', `${title}.${str}`);
            label.innerHTML = str;

            const checkbox = document.createElement('input');
            checkbox.setAttribute('name', `${title}[${str}]`);
            checkbox.setAttribute('id', `${title}.${str}`);
            // checkbox.setAttribute('id', i);
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('checked', true);

            term.appendChild(checkbox);
            term.appendChild(label);
        });

        entry.append(term);
        box.appendChild(entry);
        main.appendChild(box);

    })
}

// Create form
const createForm = function () {
    if (word.kanji.length) {
        divConstructor("Kanji", word.kanji);
    }
    divConstructor("Reading", word.reading);
    divConstructor("Meaning", word.meaning);

    const button = document.createElement("button");
    button.innerText = "Add";
    button.setAttribute('form', 'termSelectorForm');
    button.setAttribute('id', 'submitButton');
    button.setAttribute('class', 'submitButton');
    document.querySelector('#formBody').appendChild(button);

}

if (word)
    createForm();