var inputBox = document.getElementById('ime');
wanakana.bind(inputBox);

let str = "";
let letterCount = 0;
let isGameOver = false;
let currentRow = 0;
let wordSize = 5;
let tries = 5;

//generate grid, optional arg word length and no. of rows (tries)
function generateRows(word = 5, row = 1) {

    const main = document.querySelector("#grid");

    for (let i = 0; i < row; i++) {
        const row = document.createElement('div');
        row.classList.add("row")
        if (!(i))
            row.classList.add("currentRow")
        for (let j = 0; j < word; j++) {
            const col = document.createElement('div');
            col.classList.add("box")
            col.classList.add("empty")
            row.append(col);
        }
        main.appendChild(row);
    }
}

generateRows(wordSize, tries);

// funciton that enters kana chars into divs
const insertKana = function (kana) {

    console.log('kana is ', kana);
    for (let i = 0; i < kana.length; i++) {
        const ele = document.querySelector('.currentRow .empty');

        if (ele) {
            ele.innerText = kana[i];
            // console.log(kana[i]);
            ele.classList.replace('empty', 'filled');
            letterCount++;
        }
    }
}

//
const gameOver = function (result) {
    popup('gameFinish');
    isGameOver = true;
    inputBox.setAttribute('disabled', true);

    const retryButton = document.createElement('a');
    retryButton.innerText = "New Game";
    retryButton.classList.add('submitButton');
    // retryButton.setAttribute('href','/wordle');
    document.getElementById('main').appendChild(retryButton);
}
// event listeners that checks for kana on every keyup event
inputBox.addEventListener('keyup', (e) => {
    // console.log(e);
    if (!(isGameOver)) {
        if (e.key === 'Backspace') {
            if (!inputBox.value.length) {

                const del = document.querySelectorAll(".currentRow .filled");

                if (del.length) {
                    del[del.length - 1].innerText = "";
                    del[del.length - 1].classList.replace("filled", "empty")
                    letterCount--;
                }
                str = str.slice(0, str.length - 1);
                console.log("string: ", str);
                return;
            }
            else
                return;
        }

        if (e.key === 'Enter') {
            if (letterCount === wordSize) {
                letterCount = 0;
                const result = checkWord(str);
                console.log("Result is: ", result);
                const row = document.querySelector(".currentRow");
                [...row.children].forEach((element, index) => {
                    element.classList.replace('filled', 'locked');
                    element.classList.add(result.result[index]);
                });

                currentRow++;
                if (result.win || !(currentRow < tries)) {
                    gameOver(result);

                } else {
                    row.nextElementSibling.classList.add("currentRow");
                    row.classList.remove("currentRow")
                }
                str = '';
            }
            else {
                inputBox.value = wanakana.toHiragana(inputBox.value);
                const event = new Event('keyup');
                inputBox.dispatchEvent(event);
            }
            return;
        }

        const tempStr = inputBox.value;
        if (letterCount < wordSize) {
            if (wanakana.isKana(tempStr.substr(tempStr.length - 1))) {
                if (wanakana.isKana(tempStr)) {
                    str = str.concat(wanakana.toHiragana(tempStr));
                    insertKana(tempStr);
                    // console.log("entered: ", tempStr);
                }
                else {
                    str = str.concat(wanakana.toHiragana(tempStr.substr(tempStr.length - 1)));
                    insertKana(tempStr.substr(tempStr.length - 1));
                    // console.log("entered: ", tempStr.substr(tempStr.length - 1));
                }

                inputBox.value = '';
                // console.log("string: ", str);
            }
            return;
        }
        else {
            inputBox.value = '';
        }
        // console.log('Last char isKana: ', wanakana.isKana(inputBox.value.substr(inputBox.value.length - 1)));
    }
})

// wordle functionality
let answer = "おにいさん";
let answerArray = [...answer];

const specialChars = {
    'つ': 'っ',
    'や': 'ゃ',
    'ゆ': 'ゅ',
    'よ': 'ょ',
    'ゃ': 'や',
    'っ': 'つ',
    'ゅ': 'ゆ',
    'ょ': 'よ',
};

const checkWord = function (word) {
    console.log("Answer is: ", answer);
    let answerMarked = [...answer].map(x => false);
    const result = Array(word.length);
    let correct = 0;
    let win = false;

    // first check for green
    for (let i = 0; i < word.length; i++) {
        // console.log("Answer[i]: ", answer[i]);
        // console.log("Word[i]: ", word[i]);
        if ((word[i] === answer[i] || specialChars[word[i]] === answer[i]) && !answerMarked[i]) {
            result[i] = 'Green';
            answerMarked[i] = true;
            correct++;
            continue;
        }
    }
    // then for yellow
    for (let i = 0; i < word.length; i++) {
        let found = answerArray.indexOf(word[i]);
        found === -1 ? found = answerArray.indexOf(specialChars[word[i]]) : {};
        if ((found !== -1) && !answerMarked[found]) {
            result[i] = 'Yellow';
            answerMarked[i] = true;
            continue;
        }
        else {
            result[i] ? {} : result[i] = 'No';
            continue;
        }
    }
    if (correct === wordSize)
        win = true;
    return { result, win };
}