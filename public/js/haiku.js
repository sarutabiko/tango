const textarea = document.querySelector('textarea');
const haikuDisplayJP = document.querySelector('#haikuDisplay #JPpoem');
const haikuDisplayEN = document.querySelector('#haikuDisplay #ENpoem');

const lineBreak = document.getElementById('lineBreak');
const furigana = document.getElementById('furigana');
const langSwitch = document.getElementById('switchLang');

let langFlag = true;
let JPhtml = '';
let ENhtml = '';

function strip_tags(html, ...args) {
    return html.replace(/<(\/?)(\w+)[^>]*\/?>/g, (_, endMark, tag) => {
        return args.includes(tag) ? '<' + endMark + tag + '>' : '';
    }).replace(/<!--.*?-->/g, '');
}

function wrapRubyRT(html) {
    let found;
    while ((found = html.indexOf('(')) !== -1) {
        const sp1 = html.indexOf('[');
        const sp2 = html.indexOf(']');

        const rt = `<rt>` + html.substring(sp1 + 1, sp2) + `</rt>`;

        const rp2 = html.indexOf(')');
        html = html.slice(0, rp2) + rt + html.slice(sp2);
        html = html.replace(']', '</ruby>');
        html = html.replace('(', '<ruby>');
    }
    return html;
}

const render = function () {
    // const text = wrapRubyRT(strip_tags(textarea.value, 'br'));
    // if (langFlag) {
    // JPhtml = text;
    haikuDisplayJP.innerHTML = JPhtml;
    document.cookie = "jpHaiku=" + encodeURIComponent(JPhtml) + ';sameSite=strict';
    // }
    // else {
    // ENhtml = text;
    haikuDisplayEN.innerHTML = ENhtml;
    document.cookie = 'enHaiku=' + encodeURIComponent(ENhtml) + ';sameSite=strict';
    // }
}

textarea.addEventListener('input', render);

furigana.addEventListener('click', () => {
    // Put parens around selected text and [] just after that. Move cursor between []
    const myField = textarea;
    if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + `(${myField.value.substring(startPos, endPos)})[]`
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += '()[]';
    }

});
lineBreak.addEventListener('click', () => {
    // Just add <br> tag. optionally /n 
    const myValue = "<br>\n";
    const myField = textarea;
    if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
    const event = new Event('input');
    textarea.dispatchEvent(event);
    textarea.focus();
});

langSwitch.addEventListener('click', (x) => {
    // console.log(x.target.innerHTML);
    if (langFlag) {
        x.target.innerHTML = "Write in JP";
        textarea.value = ENhtml;
    }
    else {
        x.target.innerHTML = "Write in EN";
        textarea.value = JPhtml;
    }
    langFlag = !langFlag;
})

const retrieveHaikuFromCookie = function () {
    if (checkCookieHasASpecificValue('enHaiku')) {
        ENhtml = decodeURIComponent(document.cookie
            .split('; ')
            .find((row) => row.startsWith('enHaiku='))
            ?.split('=')[1])
    }
    if (checkCookieHasASpecificValue('jpHaiku')) {
        JPhtml = decodeURIComponent(document.cookie
            .split('; ')
            .find((row) => row.startsWith('jpHaiku='))
            ?.split('=')[1])
    }

    langFlag ? textarea.value = JPhtml : textarea.value = ENhtml;
}

retrieveHaikuFromCookie();
render();
//なぜそなたは通り過ぎて
// われらを置き去りにするのか。
// このほのかな空虚で荒涼たる
// 巨大な涙の谷に…。
