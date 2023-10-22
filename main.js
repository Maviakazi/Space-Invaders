/* Constants */

/* Declare variables */

/* Cached HTML elements */
const boardEl = document.querySelector('.board');

for (let i = 0; i < 225; i++) {
    let squareEl = document.createElement('div');
    boardEl.appendChild(squareEl);
}
const squaresEl = document.querySelectorAll('.board div');
let squaresArray = Array.from(squaresEl);
console.log(squaresArray);

init();

function init() {
    let alienInvaders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 17, 18, 19, 20];
}

function drawInvaders() {}
