// This is a javascript file for common functions I wrote (non-node modules) for use in client-side JS

const immediateFlash = function (flashType, msg) {
    const navbar = document.getElementById('header');
    navbar.insertAdjacentHTML('afterend', `<div class="${flashType}" role="alert">${msg} <button class="hide" onclick="closeButton(this)"><span>&times;</span></button></div>`);
}

const clearFlash = function (flashType) {
    const flash = document.querySelector(`.${flashType}`)
    if (flash)
        flash.remove();
}

// sorting callback function 
const sortDescend = function (a, b) {
    if (a > b)
        return -1;
    if (a < b)
        return 1;
    return 0;
}

// Flash message close button will call this function
const closeButton = function (target) {
    target.parentElement.remove();;
}

// For flash messages generated by connect-flash, this will add eventlistener to thei "X" button
const flashX = document.querySelectorAll(".hide");
for (let X of flashX) {
    X.addEventListener('click', function () { this.parentElement.setAttribute('style', 'display:none') })
}