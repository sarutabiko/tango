function generateRows(word = 5) {

    const main = document.querySelector("#grid");

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


setInterval(changeH1(0, ["単語", "tango", "たんご", "タンゴ"]), 5000);
generateRows();


