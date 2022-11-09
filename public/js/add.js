let word = JSON.parse(localStorage.getItem('word'));

console.log(word);

for (let i of word.wordList) {
    const wordChecks = document.getElementById('words');
    const label = document.createElement('label');
    label.setAttribute('for', i.kanji);
    label.innerHTML = i.kanji + ` <span class='reading'>(${i.reading})</span>`;

    const checkbox = document.createElement('input');
    checkbox.setAttribute('name', i.kanji);
    checkbox.setAttribute('id', i.kanji);
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('checked', true);

    wordChecks.appendChild(document.createElement('hr'));
    wordChecks.appendChild(checkbox);
    wordChecks.appendChild(label);

    console.log(i.kanji + ` (${i.reading})`);
}

for (let i of word.english) {
    const englishDefs = document.getElementById('englishDefs');
    const label = document.createElement('label');
    label.setAttribute('for', i);
    label.innerText = i.join(', ');

    const checkbox = document.createElement('input');
    checkbox.setAttribute('name', i);
    checkbox.setAttribute('id', i);
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('checked', true);

    englishDefs.appendChild(document.createElement('hr'));
    englishDefs.appendChild(checkbox);
    englishDefs.appendChild(label);
}

// localStorage.removeItem('word');
