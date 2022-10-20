let letterCount = 0;
let wordSize = 5;
let currentRow = 0;
let gameover = false;

function generateRows(word = 5) {

    const main = document.querySelector("#main");

    for (let i = 0; i < 6; i++) {
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

const changeH1 = (i, list) => () => {
    document.querySelector("h1").innerText = list[i % list.length];
    i++;
    if (i === list.length)
        i = 0;
};

const keyListen = addEventListener('keyup', (e) => {
    console.log(e);
    if (!(gameover)) {
        if (e.key === "Backspace") {
            console.log("backuspace!")
            const emp = document.querySelectorAll(".currentRow .filled");
            if (emp.length) {
                emp[emp.length - 1].innerText = "";
                emp[emp.length - 1].classList.replace("filled", "empty")
                letterCount--;
            }
        }
        else if (letterCount < wordSize) {
            const ele = document.querySelector('.empty');
            if (ele) {
                if (e.key.length === 1 && e.keyCode <= 90 && e.keyCode >= 65) {
                    letterCount++;
                    ele.innerText = e.key.toUpperCase();
                    console.log(e);
                    ele.classList.replace('empty', 'filled')
                }
            }
        }
        else if (e.key === "Enter") {
            console.log("Enerera!")
            if (letterCount === 5) {
                letterCount = 0;
                const row = document.querySelector(".currentRow");
                for (let i of row.children)
                    i.classList.replace('filled', 'locked');
                currentRow++;
                if (currentRow < 6) {
                    row.nextElementSibling.classList.add("currentRow");
                    row.classList.remove("currentRow")
                }
                else
                    gameover = true;
            }
        }
    }
})

setInterval(changeH1(0, ["単語", "tango", "たんご", "タンゴ"]), 5000);
generateRows();