const wanakana = require('wanakana');

var inputBox = document.getElementById('ime');
wanakana.bind(inputBox);

let str = "";
let letterCount = 0;
let isGameOver = false;
let currentRow = 0;
let wordSize = 5;

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

generateRows(wordSize, 5);

// funciton that enters kana chars into divs
const insertKana = function (kana) {

    console.log('kana is ', kana);
    for (let i = 0; i < kana.length; i++) {
        const ele = document.querySelector('.currentRow .empty');

        if (ele) {
            ele.innerText = kana[i];
            console.log(kana[i]);
            ele.classList.replace('empty', 'filled');
            letterCount++;
        }
    }
}

// event listeners that checks for kana on every keyup event
inputBox.addEventListener('keyup', (e) => {
    // console.log(e);
    if (!(isGameOver)) {
        if (e.key === 'Backspace') {
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

        if (e.key === 'Enter') {
            if (letterCount === 5) {
                letterCount = 0;
                const row = document.querySelector(".currentRow");
                for (let i of row.children)
                    i.classList.replace('filled', 'locked');
                currentRow++;
                if (currentRow < 3) {
                    row.nextElementSibling.classList.add("currentRow");
                    row.classList.remove("currentRow")
                }
                else
                    isGameOver = true;
                str = '';
            }
            return;
        }

        const tempStr = inputBox.value;
        if (letterCount < wordSize) {
            if (wanakana.isKana(tempStr.substr(tempStr.length - 1))) {
                if (wanakana.isKana(tempStr)) {
                    str = str.concat(wanakana.toHiragana(tempStr));
                    insertKana(tempStr);
                    console.log("entered: ", tempStr);
                }
                else {
                    str = str.concat(wanakana.toHiragana(tempStr.substr(tempStr.length - 1)));
                    insertKana(tempStr.substr(tempStr.length - 1));
                    console.log("entered: ", tempStr.substr(tempStr.length - 1));
                }

                inputBox.value = '';
                console.log("string: ", str);
            }
            return;
        }
        else {
            inputBox.value = '';
        }
        // console.log('Last char isKana: ', wanakana.isKana(inputBox.value.substr(inputBox.value.length - 1)));
    }
})