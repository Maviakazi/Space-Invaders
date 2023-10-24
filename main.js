/* Constants */
const missileAudio = new Audio('missile.wav');
const gameOverAudio = new Audio('gameover.mp3');
const winAudio = new Audio('win.wav');

/* Declare variables */
let alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];
let shooterIndex = 217;
let direction = 1;
let movingRight = true;
let moveInvaderId;
let score = 0;
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
        if (!killedInvaders.includes(i)) {
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

    // Ending the game if invaders come all the way down

    for (let i = 211; i < 226; i++) {
        if (squaresArray[i].classList.contains('invader')) {
            console.log(squaresArray[i]);
            scoreDisplay.innerHTML = 'GAME OVER';
            squaresArray[shooterIndex].classList.add('collide');
            gameOverAudio.play();
            clearInterval(moveInvaderId);
            window.removeEventListener('keydown', moveShooter);
            window.removeEventListener('keydown', shootMissiles);
        }
    }
    // Ending the game if invaders come all the way down and touch the shooter

    if (squaresArray[shooterIndex].classList.contains('invader')) {
        squaresArray[shooterIndex].classList.add('collide');

        scoreDisplay.innerHTML = 'GAME OVER';
        gameOverAudio.play();
        clearInterval(moveInvaderId);
        window.removeEventListener('keydown', moveShooter);
        window.removeEventListener('keydown', shootMissiles);
    }
}

// Adding Missiles
function shootMissiles(event) {
    let missileIdx;
    let moveMissilesId;
    function moveMissiles() {
        try {
            squaresArray[missileIdx].classList.remove('missile');
        } catch (err) {}
        missileIdx -= 15;
        squaresArray[missileIdx].classList.add('missile');
        if (squaresArray[missileIdx].classList.contains('invader')) {
            squaresArray[missileIdx].classList.remove('invader');

            squaresArray[missileIdx].classList.remove('missile');
            squaresArray[missileIdx].classList.add('collide');
            score++;
            scoreDisplay.innerHTML = `Score : ${score}`;

            setTimeout(
                () => squaresArray[missileIdx].classList.remove('collide'),
                100
            );

            clearInterval(moveMissilesId);
            killedInvaders.push(alienInvaders.indexOf(missileIdx));
            console.log(alienInvaders);
            console.log(killedInvaders);
            if (alienInvaders.length === killedInvaders.length) {
                scoreDisplay.innerHTML = `YAYY!! You defeated all the Invaders!`;
                winAudio.play();
                window.removeEventListener('keydown', moveShooter);
                window.removeEventListener('keydown', shootMissiles);
            }
        }
    }
    switch (event.key) {
        case ' ':
            missileIdx = shooterIndex;
            moveMissilesId = setInterval(moveMissiles, 100);
            missileAudio.currentTime = 0;
            missileAudio.play();
    }
}

moveInvaderId = setInterval(moveInvaders, 400);

// Event Listeners

window.addEventListener('keydown', moveShooter);
window.addEventListener('keydown', shootMissiles);
