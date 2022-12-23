const goButton = document.getElementById("go");

const draw = async (searchResult) => {

    // console.log("Param is: ", searchResult)

    let def = document.getElementById('definitions');

    // Clean the previous results if they exist 
    if (def) {
        def.innerHTML = "";
    }
    else {
        def = document.createElement('div');
        def.setAttribute('id', 'definitions');
        document.getElementById('main').appendChild(def);
    }

    // Create the list of search result entries and populate them
    searchResult.forEach((i, index) => {

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

        if (i.kanji.length) {
            i.kanji.forEach(x => {
                pre.innerText += x.join(', ');
                pre.innerText += ', ';
            });
            pre.innerText += "\n";
            pre.innerText = pre.innerText.slice(0, pre.innerText.length - 1);
        }

        i.reading.forEach(x => {
            pre.innerText += x.join(', ');
            pre.innerText += ', ';
            pre.innerText = pre.innerText.slice(0, pre.innerText.length - 1);
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

    });

    // Add event listener on Plus button for adding words
    document.querySelectorAll('.plus').forEach(x => {
        x.addEventListener('click', function () {
            // console.log(searchResult[parseInt(this.dataset.i)]);
            localStorage.setItem('word', JSON.stringify(searchResult[parseInt(this.dataset.i)]));
            return window.location.assign("/word/add");
        });
    });
}

// displays last searched word results
if (JSON.parse(localStorage.getItem('searchResult'))) {
    lastSearch = JSON.parse(localStorage.getItem('searchResult'));
    // console.log("FOund last word: ", lastSearch)
    draw(lastSearch);
}

// Launches the search ie a post request to /search with query param
goButton.addEventListener('click', async () => {

    const query = document.getElementById('queryString').value.toLowerCase();
    // console.log("query text: ", query)

    // Dim the current results if they exist
    const searchResults = document.getElementById('definitions');
    if (searchResults)
        blur(searchResults);
    goButton.setAttribute('style', 'background-color: cornsilk;');

    // fetch request to /search here
    const response = await fetch('/word/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(`query=${query}`)
    }).then(res => res.json());

    // console.log(response);
    if (response.results && response.results.length) {
        localStorage.setItem('searchResult', JSON.stringify(response.results));
        draw(response.results);
    }
    else {
        immediateFlash('alertFlash', `No results found for: ${response.query} `);
        // searchResults.insertAdjacentHTML('beforebegin', `<div class="alertFlash" role="alert"><button class="hide" onclick="closeButton(this)"><span>&times;</span></button></div>`);
    }

    // Undim
    if (searchResults)
        unblur(searchResults)
    goButton.removeAttribute('style');
});