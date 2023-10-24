/* Constants */
const missileAudio = new Audio('./sounds/missile.wav');
const gameOverAudio = new Audio('./sounds/gameover.mp3');
const winAudio = new Audio('./sounds/win.wav');

/* Declare variables */
let resetalienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];
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
const startGameEl = document.querySelector('.start');

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
            // console.log(squaresArray[alienInvaders[i]]);
        }
    }

    squaresArray[shooterIndex].classList.add('shooter');
}

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
    const rowBottomReached = alienInvaders.some((invader) => invader >= 210);
    // Ending the game if invaders come all the way down

    if (rowBottomReached) {
        scoreDisplay.innerHTML =
            '<span class="gameover">GAME OVER</span> <br /> Aliens invaded your planet!';
        squaresArray[shooterIndex].classList.add('collide');
        gameOverAudio.play();
        clearInterval(moveInvaderId);
        window.removeEventListener('keydown', moveShooter);
        window.removeEventListener('keydown', shootMissiles);
        return; // End the function if any invader reached the bottom row
    }
    if (alienInvaders[0] % 15 === 0 && movingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            direction = 1;
            alienInvaders[i] += 14;
            movingRight = false;
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

        scoreDisplay.innerHTML =
            '<span class="gameover">GAME OVER</span> <br /> Aliens invaded your planet!';
        gameOverAudio.play();
        clearInterval(moveInvaderId);
        window.removeEventListener('keydown', moveShooter);
        window.removeEventListener('keydown', shootMissiles);
    }
}

// Adding Missiles
function shootMissiles(event) {
    if (event.key === ' ') {
        event.preventDefault(); // Prevent the default behavior (e.g., scrolling the page)
        let missileIdx;
        let moveMissilesId;

        function moveMissiles() {
            try {
                squaresArray[missileIdx].classList.remove('missile');
            } catch (err) {}
            missileIdx -= 15;
            try {
                squaresArray[missileIdx].classList.add('missile');
            } catch (err) {}
            if (squaresArray[missileIdx].classList.contains('invader')) {
                squaresArray[missileIdx].classList.remove('invader');
                squaresArray[missileIdx].classList.remove('missile');
                squaresArray[missileIdx].classList.add('collide');
                score++;
                scoreDisplay.innerHTML = `Score: ${score}`;

                setTimeout(
                    () => squaresArray[missileIdx].classList.remove('collide'),
                    100
                );

                clearInterval(moveMissilesId);
                killedInvaders.push(alienInvaders.indexOf(missileIdx));

                // Game Win logic
                if (alienInvaders.length === killedInvaders.length) {
                    scoreDisplay.innerHTML = `<span class="gamewon">Congratulations!!</span> <br />You defeated all the Invaders!`;
                    winAudio.play();
                    window.removeEventListener('keydown', moveShooter);
                    window.removeEventListener('keydown', shootMissiles);
                }
            }
        }
        missileIdx = shooterIndex;
        moveMissilesId = setInterval(moveMissiles, 100);
        missileAudio.currentTime = 0;
        missileAudio.play();
    }
}

// moveInvaderId = setInterval(moveInvaders, 500);
// Event Listeners

window.addEventListener('keydown', moveShooter);
window.addEventListener('keydown', shootMissiles);
startGameEl.addEventListener('click', init);

let gameRunning = false;

function init(e) {
    if (gameRunning) {
        // If the game is running, stop it and reset
        clearInterval(moveInvaderId);
        window.removeEventListener('keydown', moveShooter);
        window.removeEventListener('keydown', shootMissiles);
        gameRunning = false;
        killedInvaders = [];
        alienInvaders = [...resetalienInvaders];
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        squaresArray.forEach((square) => {
            square.classList.remove('invader', 'shooter', 'missile', 'collide');
        });
    }

    // Start a new game loop for moving invaders
    moveInvaderId = setInterval(moveInvaders, 500);
    window.addEventListener('keydown', moveShooter);
    window.addEventListener('keydown', shootMissiles);

    gameRunning = true; // Set the game to running
    startGameEl.textContent = 'Restart Game';
}
