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

generateRows(undefined, 3);


