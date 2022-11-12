const list = ["तांगो", "તાંગો", "単語", "tango", "たんご", "タンゴ"];

let i;
if (!isNaN(parseInt(localStorage.getItem('titleIndex')))) {
    i = parseInt(localStorage.getItem('titleIndex'));
    document.querySelector("h1").innerText = list[i];
}
else {
    i = 2;
}

const changeH1 = () => () => {
    ++i;
    if (i >= list.length) { i = 0; }
    document.querySelector("h1#title").innerText = list[i];
    localStorage.setItem('titleIndex', i);
};

setInterval(changeH1(), 7000);
