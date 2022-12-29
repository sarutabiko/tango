// This is a javascript file for common functions I wrote (non-node modules) for use in client-side JS

const immediateFlash = function (flashType, msg) {
    clearFlash(flashType);
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

// Opacity setter ie Blur effect helper for when you're waiting for async responses and such
const blur = function (element, opacity = 0.8) {
    element.setAttribute('style', `opacity: ${opacity};`);
}

const unblur = function (element) {
    element.removeAttribute('style');
}

const disableSet = function (element) {
    element.setAttribute('disabled', true);
}
const disableUnset = function (element) {
    element.removeAttribute('disabled');
}

// popup (style display to none/block)
const popup = function (ID) {
    const ele = document.getElementById(ID);
    if (ele.getAttribute('style') === 'display: none;') {
        ele.setAttribute('style', 'display: block;');
    }
    else {
        ele.setAttribute('style', 'display: none;');
    }
}

const checkCookieHasASpecificValue = function (checkCookie) {
    if (document.cookie.split(';').some((item) => item.includes(checkCookie))) {
        return true;
    }
    return false;
}