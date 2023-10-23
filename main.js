/* Constants */

/* Declare variables */
let alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];
let shooterIndex = 217;
let direction = 1;
let movingRight = true;
let moveInvaderId;
let moveMissilesId;
let missileIdx;
let removeCollideId;
let killedInvaders = [];
/* Cached HTML elements */
const boardEl = document.querySelector('.board');
const scoreDisplay = document.querySelector('.score-display');

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

// Draw shooter and alien Invaders on board
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!killedInvaders.includes(alienInvaders[i])) {
            squaresArray[alienInvaders[i]].classList.add('invader');
        }
    }
    squaresArray[shooterIndex].classList.add('shooter');
}

draw();

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squaresArray[alienInvaders[i]].classList.remove('invader');
    }
    squaresArray[shooterIndex].classList.remove('shooter');
}

// Move the shooter
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
// Move Invaders
function moveInvaders() {
    remove();
    if (alienInvaders[0] % 15 === 0 && movingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += 14;

            movingRight = false;
            direction = 1;
        }
    } else if (alienInvaders[32] % 15 === 14 && !movingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += 16;
            direction = -1;
            movingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }
    draw();

    // Ending the game if invaders come all the way down and touch the shooter

    if (squaresArray[shooterIndex].classList.contains('invader')) {
        squaresArray[shooterIndex].classList.add('collide');

        scoreDisplay.innerHTML = 'GAME OVER';
        clearInterval(moveInvaderId);

        // squaresArray[shooterIndex].classList.remove('collide');
    }
}

function removeCollide() {
    squaresArray[missileIdx].classList.remove('collide');
}

// Adding Missiles
function shootMissiles(event) {
    function moveMissiles() {
        squaresArray[missileIdx].classList.remove('missile');
        missileIdx -= 15;
        squaresArray[missileIdx].classList.add('missile');
        if (squaresArray[missileIdx].classList.contains('invader')) {
            squaresArray[missileIdx].classList.remove('invader');
            // squaresArray[alienInvaders[missileIdx]] = null;
            // console.log(alienInvaders[missileIdx]);
            // alienInvaders[missileIdx] = null;
            killedInvaders.push(squaresArray.indexOf(squaresArray[missileIdx]));
            console.log(killedInvaders);
            // console.log(alienInvaders);
            squaresArray[missileIdx].classList.add('collide');
            squaresArray[missileIdx].classList.remove('missile');

            setTimeout(removeCollide, 100);
            // console.log('hi');

            clearInterval(moveMissilesId);
        }
    }
    switch (event.key) {
        case ' ':
            missileIdx = shooterIndex;
            moveMissilesId = setInterval(moveMissiles, 100);
    }
}

moveInvaderId = setInterval(moveInvaders, 500);

// Event Listeners

window.addEventListener('keydown', moveShooter);
document.addEventListener('keydown', shootMissiles);
