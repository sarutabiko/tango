const goButton = document.getElementById("go");

const draw = async (searchResult) => {

    // console.log("Param is: ", searchResult)

    let def = document.getElementById('definitions');

    if (def) {
        def.innerHTML = "";
    }
    else {
        def = document.createElement('div');
        def.setAttribute('id', 'definitions')
    }

    document.getElementById('main').appendChild(def);
    let index = 0;
    for (let i of searchResult) {

        const newUnit = document.createElement('div');
        newUnit.classList.add("Unit");
        const newDef = document.createElement('div');
        newDef.classList.add("wordunit");
        def.appendChild(newUnit);
        newUnit.appendChild(newDef);
        const pre = document.createElement('div');
        newDef.appendChild(pre);
        const plus = document.createElement('div');
        newUnit.appendChild(plus);

        plus.classList.add("plus");
        plus.setAttribute("data-i", index++);
        def.appendChild(document.createElement('hr'));

        plus.innerHTML = '+';

        i.kanji.forEach(x => {
            pre.innerText += x.join(', ');
        });

        pre.innerText += "\n";

        i.reading.forEach(x => {
            pre.innerText += x.join(', ');
        });

        pre.innerText += "\n";

        i.meaning.forEach(x => {
            if (pre.innerText.endsWith("\n"))
                pre.innerText += "* ";
            else
                pre.innerText += ", "
            pre.innerText += x.join(", ");
            pre.innerText += "\n";
        });

    }

    // Add event listener on Plus button for adding words
    document.querySelectorAll('.plus').forEach(x => {
        x.addEventListener('click', function () {
            console.log(mydata[parseInt(this.searchResult.i)]);
            localStorage.setItem('word', JSON.stringify(response[parseInt(this.searchResult.i)]));
            return window.location.replace("/add");
        });
    });
}

// displays last searched word results
if (JSON.parse(localStorage.getItem('searchResult'))) {
    lastSearch = JSON.parse(localStorage.getItem('searchResult'));
    console.log("FOund last word: ", lastSearch)
    draw(lastSearch);
}

// Launches the search ie a post request to /search with query param
goButton.addEventListener('click', async () => {
    const query = document.getElementById('queryString').value;
    // console.log("query text: ", query)

    // fetch request to /search here
    const response = await fetch('/word/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(`query=${query}`)
    }).then(res => res.json());

    if (response && response.length) {
        localStorage.setItem('searchResult', JSON.stringify(response));
        draw(response);
    }
});