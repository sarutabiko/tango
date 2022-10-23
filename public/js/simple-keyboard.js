let Keyboard = window.SimpleKeyboard.default;
const KeyboardLayouts = window.SimpleKeyboardLayouts.default;
const layout = new KeyboardLayouts().get("japanese");

let letterCount = 0;
let wordSize = 5;
let currentRow = 0;
let gameover = false;


let keyboard = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    ...layout
});
/**
 * Update simple-keyboard when input is changed directly
 */
document.querySelector(".input").addEventListener("input", event => {
    keyboard.setInput(event.target.value);
});

console.log(keyboard);

function onChange(input) {
    document.querySelector(".input").value = input;
    console.log("Input changed", input);
}

function onKeyPress(button) {
    console.log("Button pressed", button);
    if (!(gameover)) {
        if (button === "{bksp}") {
            console.log("backuspace!")
            const emp = document.querySelectorAll(".currentRow .filled");
            if (emp.length) {
                emp[emp.length - 1].innerText = "";
                emp[emp.length - 1].classList.replace("filled", "empty")
                letterCount--;
            }
        }
        else if (button === "{enter}") {
            console.log("Enerera!")
            if (letterCount === 5) {
                letterCount = 0;
                const row = document.querySelector(".currentRow");
                for (let i of row.children)
                    i.classList.replace('filled', 'locked');
                currentRow++;
                if (currentRow < 6) {
                    row.nextElementSibling.classList.add("currentRow");
                    row.classList.remove("currentRow")
                }
                else
                    gameover = true;
            }
        }
        else if (letterCount < wordSize) {
            const ele = document.querySelector('.empty');
            if (ele) {
                if (button) {
                    letterCount++;
                    ele.innerText = button;
                    console.log(button);
                    ele.classList.replace('empty', 'filled')
                }
            }
        }

    }
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") handleShift();
}

function handleShift() {
    let currentLayout = keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    keyboard.setOptions({
        layoutName: shiftToggle
    });
}
