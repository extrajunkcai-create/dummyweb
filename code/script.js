const gameContainer = document.querySelector('.game-container');
const ball = document.getElementById('ball');
const leftpaddle = document.getElementById('leftpaddle');
const rightpaddle = document.getElementById('rightpaddle');
const leftScoreDisplay = document.getElementById('leftscore');
const rightScoreDisplay = document.getElementById('rightscore');
const winnermessage = document.getElementById('winnermessage');
const restartButton = document.getElementById('restartButton');

/* ================= VARIABLES ================= */

let ballX, ballY, ballSpeedX, ballSpeedY;
let leftPaddleY, rightPaddleY;
let leftpaddleSpeed = 0;
let rightpaddleSpeed = 0;
let leftscore = 0;
let rightscore = 0;

const maxscore = 5;
const paddleSpeed = 6;
const paddleHeight = leftpaddle.clientHeight;

let isGameOver = false;
let speedInterval;
let animationId;

/* ================= RESET FUNCTIONS ================= */

function resetBall() {
    ballX = gameContainer.clientWidth / 2 - ball.clientWidth / 2;
    ballY = gameContainer.clientHeight / 2 - ball.clientHeight / 2;

    const direction = Math.random() < 0.5 ? -1 : 1;
    ballSpeedX = 4 * direction;
    ballSpeedY = (Math.random() * 4 - 2);
}

function resetPaddles() {
    leftPaddleY = gameContainer.clientHeight / 2 - paddleHeight / 2;
    rightPaddleY = gameContainer.clientHeight / 2 - paddleHeight / 2;
}

function updateScores() {
    leftScoreDisplay.textContent = leftscore;
    rightScoreDisplay.textContent = rightscore;
}

/* ================= GAME STATE ================= */

function checkWinner() {
    if (leftscore >= maxscore) {
        winnermessage.textContent = 'Left Player Wins!';
    } else if (rightscore >= maxscore) {
        winnermessage.textContent = 'Right Player Wins!';
    } else {
        return false;
    }

    winnermessage.style.display = 'block';
    restartButton.style.display = 'block';
    isGameOver = true;

    clearInterval(speedInterval);
    cancelAnimationFrame(animationId);
    return true;
}

function resetGame() {
    leftscore = 0;
    rightscore = 0;
    updateScores();

    winnermessage.style.display = 'none';
    restartButton.style.display = 'none';

    isGameOver = false;

    resetBall();
    resetPaddles();
    startBallSpeedIncrease();
    animationId = requestAnimationFrame(gameLoop);
}

/* ================= SPEED CONTROL ================= */

function increaseBallSpeed() {
    ballSpeedX += ballSpeedX > 0 ? 0.3 : -0.3;
    ballSpeedY += ballSpeedY > 0 ? 0.3 : -0.3;
}

function startBallSpeedIncrease() {
    clearInterval(speedInterval);
    speedInterval = setInterval(increaseBallSpeed, 5000);
}

/* ================= INPUT ================= */

document.addEventListener('keydown', e => {
    if (e.key === 'w') leftpaddleSpeed = -paddleSpeed;
    if (e.key === 's') leftpaddleSpeed = paddleSpeed;
    if (e.key === 'ArrowUp') rightpaddleSpeed = -paddleSpeed;
    if (e.key === 'ArrowDown') rightpaddleSpeed = paddleSpeed;
});

document.addEventListener('keyup', e => {
    if (['w', 's'].includes(e.key)) leftpaddleSpeed = 0;
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) rightpaddleSpeed = 0;
});

restartButton.addEventListener('click', resetGame);

/* ================= GAME LOOP ================= */

function gameLoop() {
    if (isGameOver) return;

    /* Move ball */
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    /* Wall collision */
    if (ballY <= 0 || ballY >= gameContainer.clientHeight - ball.clientHeight) {
        ballSpeedY *= -1;
    }

    /* Left paddle collision */
    if (
        ballX <= leftpaddle.clientWidth &&
        ballY + ball.clientHeight >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight
    ) {
        const hit = (ballY + ball.clientHeight / 2) - (leftPaddleY + paddleHeight / 2);
        ballSpeedY = hit * 0.08;
        ballSpeedX *= -1;
        ballX = leftpaddle.clientWidth;
    }

    /* Right paddle collision */
    if (
        ballX + ball.clientWidth >= gameContainer.clientWidth - rightpaddle.clientWidth &&
        ballY + ball.clientHeight >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight
    ) {
        const hit = (ballY + ball.clientHeight / 2) - (rightPaddleY + paddleHeight / 2);
        ballSpeedY = hit * 0.08;
        ballSpeedX *= -1;
        ballX = gameContainer.clientWidth - rightpaddle.clientWidth - ball.clientWidth;
    }

    /* Scoring */
    if (ballX < 0) {
        rightscore++;
        updateScores();
        if (!checkWinner()) resetBall();
    }

    if (ballX > gameContainer.clientWidth) {
        leftscore++;
        updateScores();
        if (!checkWinner()) resetBall();
    }

    /* Move paddles */
    leftPaddleY += leftpaddleSpeed;
    rightPaddleY += rightpaddleSpeed;

    leftPaddleY = Math.max(0, Math.min(gameContainer.clientHeight - paddleHeight, leftPaddleY));
    rightPaddleY = Math.max(0, Math.min(gameContainer.clientHeight - paddleHeight, rightPaddleY));

    /* Render */
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    leftpaddle.style.top = `${leftPaddleY}px`;
    rightpaddle.style.top = `${rightPaddleY}px`;

    animationId = requestAnimationFrame(gameLoop);
}

/* ================= START GAME ================= */

resetBall();
resetPaddles();
startBallSpeedIncrease();
animationId = requestAnimationFrame(gameLoop);
