const loginForm = document.querySelector("#loginForm");

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

        if (!response.ok)
            if (response.status == 401) {
                return document.querySelector('#credentials .alert').innerHTML = "<b> Alert:</b> Wrong credentials. Try again";
            }
            else {
                throw new Error(errorMessage);
            }

        if (response.ok) {
            return document.getElementById('credentials').setAttribute('style', 'display:none');
        }
    }
    catch (error) {
        console.error(error);
    }

});