/* Constants */

/* Declare variables */
let alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];
let shooterIndex = 217;
/* Cached HTML elements */
const boardEl = document.querySelector('.board');

// Create square divs on the board
for (let i = 0; i < 225; i++) {
    let squareEl = document.createElement('div');
    boardEl.appendChild(squareEl);
}

// Capturing all the squares in a variable then turn it in to an array
const squaresEl = document.querySelectorAll('.board div');
let squaresArray = Array.from(squaresEl);
// console.log(squaresArray);

// Functions

// Draw shooter and alien Invaders on
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squaresArray[alienInvaders[i]].classList.add('invader');
    }
    squaresArray[shooterIndex].classList.add('shooter');
}

draw();

function moveShooter(event) {
    squaresArray[shooterIndex].classList.remove('shooter');
    switch (event.key) {
        case 'ArrowLeft':
            if (shooterIndex >= 211) shooterIndex -= 1;
            break;

        case 'ArrowRight':
            if (shooterIndex !== 224) shooterIndex += 1;
            break;
    }
    squaresArray[shooterIndex].classList.add('shooter');
}

// Event Listeners

window.addEventListener('keydown', moveShooter);
