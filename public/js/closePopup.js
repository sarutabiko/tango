// For elements with "hide" classes, this will add eventlistener to hide it/parent div
const flashX = document.querySelectorAll(".hide");

for (let X of flashX) {
    X.addEventListener('click', function () { this.parentElement.setAttribute('style', 'display: none;') })
}
