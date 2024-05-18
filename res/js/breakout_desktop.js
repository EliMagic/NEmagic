// Get the canvas element and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define game variables
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let x = paddleX + paddleWidth / 2; // Start ball at paddle position
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const ballRadius = 10;
const speedMultiplier = 1.1; // Multiplier

const brickRowCount = 12;
let brickColumnCount = 14;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score_name = "Score: ";
let score = 0;
let lives_name = "Lives: ";
let lives = 3;


// Colors for each row of bricks
const brickColors = ["#FF0000", "#FF7F00", "#FFFF00", "#7FFF00", "#00FF00", "#00FF7F",
                    "#00FFFF", "#007FFF", "#0000FF", "#7F00FF", "#FF00FF", "#FF007F"]; // Red, Green, Blue

// Initialize bricks
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
// Detect if the user is on a mobile device
function isMobileDevice() {
    
    return /Mobi|Android/i.test(navigator.userAgent);
}

function adjustCanvasSize() {
    
    const margin = 0.05; // 5% margin
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate canvas dimensions with margin
    let canvasWidth, canvasHeight;
    if (isMobileDevice()) {
        // For mobile devices
        canvasWidth = screenWidth - ((2 * margin * screenWidth) * 1.5); // 972
        canvasHeight = screenHeight - ((2 * margin * screenHeight) * 2.5); // 1728
    } else {
        // For desktop devices
        canvasWidth = 1280; // Your default canvas width for desktop
        canvasHeight = 648; // Your default canvas height for desktop
    }

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}


// Event listeners for paddle control based on device
if (isMobileDevice()) {
    // Mobile device controls (touch events)
    brickColumnCount = 4;
    canvas.addEventListener("touchstart", touchStartHandler, false);
    canvas.addEventListener("touchmove", touchMoveHandler, false);
} else {
    // Desktop controls (keyboard)
    // Event listeners for paddle control
    
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    canvas.addEventListener("mousemove", mouseMoveHandler, false);
}

// Touch start handler
function touchStartHandler(e) {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    paddleX = touchX - paddleWidth / 2;
}

// Touch move handler
function touchMoveHandler(e) {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    paddleX = touchX - paddleWidth / 2;
}

// Keydown handler
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

// Keyup handler
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Mouse move handler
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}
// Collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += (brickRowCount - r);
                    if (score === brickRowCount * brickColumnCount * (brickRowCount + 1) / 2) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
}

// Draw bricks
function drawBricks() {
    const brickWidthTotal = brickColumnCount * ( brickWidth + brickPadding) - brickPadding;
    const offsetLeft = (canvas.width - brickWidthTotal) / 2;
    
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + offsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColors[r];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Draw score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(score_name, 8, 20);
    ctx.fillStyle = "#0095DD";
    ctx.fillText(score, 8 + ctx.measureText(score_name).width, 20);
}

// Draw lives
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(lives_name, canvas.width - 65, 20);
    ctx.fillStyle = "#ff5252";
    ctx.fillText(lives, canvas.width - 65 + ctx.measureText(lives_name).width, 20);
    
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    

    // Ball movement
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            dx *= speedMultiplier;
            dy *= speedMultiplier;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

// Function to start the game
function startGame() {
    x = paddleX + paddleWidth / 2; // Reset ball position to paddle position
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    // Other game initialization code...
}

// Call startGame function to start the game


// Event listener for window resize
window.addEventListener("resize", adjustCanvasSize, false);

// Initial adjustment on page load
adjustCanvasSize();
startGame();
draw();
