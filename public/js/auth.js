const loginForm = document.querySelector("#authForm");

const switchAuth = document.querySelector("#prompt a");
const switchFunc = function () {
    let formNode = document.querySelector("#credentials form button");

    if (formNode.innerText == "Log in") {
        document.cookie = 'auth=register;sameSite=strict';
        console.log(document.cookie);

        formNode.innerText = "Register";
        formNode.parentElement.setAttribute('action', '/register')

        formNode = document.querySelector("#credentials form");

        const emailLabel = document.createElement('label');
        emailLabel.setAttribute('for', 'email');
        emailLabel.innerText = "Email";

        const emailInput = document.createElement('input');
        emailInput.setAttribute('type', 'email');
        emailInput.setAttribute('id', 'email');
        emailInput.setAttribute('name', 'email');
        formNode.prepend(emailInput);
        formNode.prepend(emailLabel);

        document.querySelector("#credentials #prompt a").innerText = "Or Log in here";
    }
    else {

        document.cookie = 'auth=login;sameSite=strict';
        console.log(document.cookie);

        formNode.innerText = "Log in";
        formNode.parentElement.setAttribute('action', '/auth')

        formNode = document.querySelector("#credentials form label");
        formNode.parentNode.removeChild(formNode);
        formNode = document.querySelector("#credentials form input");
        formNode.parentNode.removeChild(formNode);

        document.querySelector("#credentials #prompt a").innerText = "New User? Register here";
    }
}

switchAuth.addEventListener('click', switchFunc)

function urlencodeFormData(fd) {
    var s = '';
    function encode(s) { return encodeURIComponent(s).replace(/%20/g, '+'); }
    for (var pair of fd.entries()) {
        if (typeof pair[1] == 'string') {
            s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
        }
    }
    return s;
}

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;

    try {
        const fetchOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                Accept: "*/*",
            },
            body: urlencodeFormData(new FormData(form)),
        };

        const response = await fetch(url, fetchOptions);
        console.log(response);

        window.location.reload();
    }
    catch (error) {
        console.log(error);
        window.location.reload();
    }

});

function checkCookieHasASpecificValue() {
    if (document.cookie.split(';').some((item) => item.includes('auth=register'))) {
        switchFunc();
    }
}

checkCookieHasASpecificValue();