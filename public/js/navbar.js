
const changeH1 = (i, list) => () => {
    document.querySelector("h1").innerText = list[i % list.length];
    i++;
    if (i === list.length)
        i = 0;
};


setInterval(changeH1(0, ["तांगो", "તાંગો", "単語", "tango", "たんご", "タンゴ"]), 7000);
