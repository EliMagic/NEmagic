// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let canvasWidth;
let canvasHeight;

// 320 px
let laneWidth; // Divide canvas into 4 lanes
// 160 px
let lane_2_width; // Divide canvas into 2 lanes
// 320 px
let grassWidth; // Grass areas on the sides
// 640 px
let grassHeight;
// 640 px
let roadWidth;

console.log(laneWidth);
console.log(lane_2_width);
console.log(grassWidth);
console.log(grassHeight);
console.log(roadWidth);

let lane_1;
let lane_2;
let lane_3;
let lane_4;
const lanes1 = [];
const lanes2 = [];

//let car_width = 40;
//let car_height = 80;
let car_width = 60;
let car_height = 120;
let carX; // Initial X position of the car
let carY; // Y position of the car

const taxi_down = new Image();
taxi_down.src = 'res/images/cars/taxi_down.png';
const audi_down = new Image();
audi_down.src = 'res/images/cars/audi_down.png';
const viper_down = new Image();
viper_down.src = 'res/images/cars/viper_down.png';
const truck_down = new Image();
truck_down.src = 'res/images/cars/truck_down.png';

const traffic1 = [taxi_down, audi_down, viper_down, truck_down];

const taxi_up = new Image();
taxi_up.src = 'res/images/cars/taxi_up.png';
const audi_up = new Image();
audi_up.src = 'res/images/cars/audi_up.png'; 
const viper_up = new Image();
viper_up.src = 'res/images/cars/viper_up.png';
const truck_up = new Image();
truck_up.src = 'res/images/cars/truck_up.png';

const traffic2 = [taxi_up, audi_up, viper_up, truck_up];

const obstacles1 = [];
const obstacles2 = [];
let obstacleWidth = 60; // Adjusted obstacle width for lanes
let obstacleHeight = 120;

let score = 0;
let isMobile = false;

const road_image = new Image();
road_image.src = 'res/images/road_short.png';

const car1 = new Image();
car1.src = 'res/images/cars/car_1.png';


let roadOffsetY = 0;

const carSpeed = 5;
const obstacleSpeed1 = 6 * 2;
const obstacleSpeed2 = 3 * 2;
const roadSpeed = 4 * 2;

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function adjustCanvasSize() {
    const margin = 0.05; // 5% margin
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate canvas dimensions with margin
    if (isMobileDevice()) {
        // For mobile devices
        // canvasWidth = screenWidth - ((2 * margin * screenWidth) * 1.5); // 972
        // canvasHeight = screenHeight - ((2 * margin * screenHeight) * 2.5);
        canvasWidth = screenWidth - (2 * (margin - (margin * 0.05)) * screenWidth);
        canvasHeight = screenHeight - (2 * margin * screenHeight);
        
        // 640 px
        grassHeight = canvasHeight;
        // 640 px
        roadWidth = canvasWidth;
        
        carX = canvasWidth / 2; // Initial X position of the car
        carY = canvasHeight - car_height - 150; // Y position of the car
        
        lane_1 = canvasWidth * 0.21;
        lane_2 = canvasWidth * 0.36;
        lane_3 = canvasWidth * 0.52;
        lane_4 = canvasWidth * 0.67;
        lanes1.push(lane_1, lane_2);
        lanes2.push(lane_3, lane_4);
        
        car_width = 40;
        car_height = 80;
        
        obstacleWidth = 40; // Adjusted obstacle width for lanes
        obstacleHeight = 80;
        
    } else {
        // For desktop devices
        canvasWidth = 1380; // Your default canvas width for desktop
        canvasHeight = 648; // Your default canvas height for desktop
        // 320 px
        laneWidth = canvasWidth / 4; // Divide canvas into 4 lanes
        // 160 px
        lane_2_width = canvasWidth / 8; // Divide canvas into 2 lanes
        // 320 px
        grassWidth = (canvasWidth - laneWidth * 2) / 2; // Grass areas on the sides
        // 640 px
        grassHeight = canvasHeight;
        // 640 px
        roadWidth = canvasWidth - 2 * grassWidth;

        // 690 px
        carX = canvasWidth / 2; // Initial X position of the car
        // 490 px
        carY = canvasHeight - car_height - 50; // Y position of the car
        
        lane_1 = 507;
        lane_2 = 610;
        lane_3 = 720;
        lane_4 = 828;
        lanes1.push(lane_1, lane_2);
        lanes2.push(lane_4);
    }

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}


function drawGrass() {
    ctx.fillStyle = '#00cc00'; // Green color for grass
    ctx.fillRect(0, 0, grassWidth, canvasHeight);
    ctx.fillRect(canvasWidth - grassWidth, 0, grassWidth, canvasHeight);
}

function drawRoad() {
    
    if (isMobileDevice()) {
        ctx.drawImage(road_image, 0, roadOffsetY, canvasWidth, canvasHeight);
        ctx.drawImage(road_image, 0, roadOffsetY - canvasHeight,canvasWidth, canvasHeight);

        roadOffsetY += roadSpeed;
        if ( roadOffsetY >= canvasHeight){
            roadOffsetY = 0;
        }
    } else {
        
        ctx.drawImage(road_image, grassWidth, roadOffsetY, roadWidth, canvasHeight);
        ctx.drawImage(road_image, grassWidth, roadOffsetY - canvasHeight, roadWidth, canvasHeight);

        roadOffsetY += roadSpeed;
        if ( roadOffsetY >= canvasHeight){
            roadOffsetY = 0;
        }
    }
}

function drawCar() {
    ctx.drawImage(car1, carX, carY, car_width, car_height);
    console.log(carX);
            
}

function drawObstacles1() {
    obstacles1.forEach(obstacle1 => {
        ctx.drawImage(obstacle1.image, obstacle1.x, obstacle1.y, obstacleWidth, obstacleHeight);
        obstacle1.y += obstacleSpeed1;
    });
}
function drawObstacles2() {
    obstacles2.forEach(obstacle2 => {
        ctx.drawImage(obstacle2.image, obstacle2.x, obstacle2.y, obstacleWidth, obstacleHeight);
        obstacle2.y += obstacleSpeed2;
    });
}

function detectCollision1() {
    for (let i = 0; i < obstacles1.length; i++) {
        const obstacle1 = obstacles1[i];
        if (
            carX < obstacle1.x + obstacleWidth &&
            carX + car_width > obstacle1.x &&
            carY < obstacle1.y + obstacleHeight &&
            carY + car_height > obstacle1.y
        ) {
            return true;
        }
    }
    return false;
}
function detectCollision2() {
    for (let i = 0; i < obstacles2.length; i++) {
        const obstacle2 = obstacles2[i];
        if (
            carX < obstacle2.x + obstacleWidth &&
            carX + car_width > obstacle2.x &&
            carY < obstacle2.y + obstacleHeight &&
            carY + car_height > obstacle2.y
        ) {
            return true;
        }
    }
    return false;
}
function generateObstacles1() {
    drawObstacles1();
    if (Math.random() < 0.005) {
        const obstacleX1 = lanes1[Math.floor(Math.random() * lanes1.length)];
        // console.log(obstacleX1);
        const randomCarImage1 = traffic1[Math.floor(Math.random() * traffic1.length)];
        obstacles1.push({ x: obstacleX1, y: -obstacleHeight, image: randomCarImage1 });
    }
}

function generateObstacles2() {
    drawObstacles2();
    if (Math.random() < 0.005) {
        const obstacleX2 = lanes2[Math.floor(Math.random() * lanes2.length)];
        // console.log(obstacleX2);
        const randomCarImage2 = traffic2[Math.floor(Math.random() * traffic2.length)];
        obstacles2.push({ x: obstacleX2, y: -obstacleHeight, image: randomCarImage2 });
    }
}

function drawScore() {
  // Draw UI
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function gameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Click to Restart', canvas.width / 2 - 70, canvas.height / 2 + 20);
}

function resetGame() {
    obstacles1.splice(0, obstacles1.length);
    obstacles2.splice(0, obstacles2.length);
    carX = canvasWidth / 2;
    score = 0;
}

function updateGame() {
    if (isMobileDevice()) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawRoad();
        drawCar();
        drawScore();
        generateObstacles1();
        generateObstacles2();
        if (detectCollision1() || detectCollision2()) {
            alert('Game Over! Your score: ' + score);
            resetGame();
        }
        score++;
        requestAnimationFrame(updateGame);
    } else {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawGrass();
        drawRoad();
        drawCar();
        drawScore();
        generateObstacles1();
        generateObstacles2();
        if (detectCollision1() || detectCollision2()) {
            alert('Game Over! Your score: ' + score);
            resetGame();
        }
        score++;
        requestAnimationFrame(updateGame);
    }
}

document.addEventListener('keydown', (e) => {
    if (!isMobile) {
        if (e.key === 'ArrowLeft' && carX > grassWidth) {
            carX -= carSpeed;
        } else if (e.key === 'ArrowRight' && carX < grassWidth + roadWidth) {
            carX += carSpeed;
        }
    }
});

document.addEventListener('mousemove', (e) => {
    if (!isMobile) {
        const rect = canvas.getBoundingClientRect();
        carX = e.clientX - rect.left;
        if (carX < grassWidth) {
            carX = grassWidth;
        } else if (carX > grassWidth + roadWidth - car_width) {
            carX = grassWidth + roadWidth - car_width;
        }
    }
});

// Detect if the device is mobile
if (/Mobi|Android/i.test(navigator.userAgent)) {
    isMobile = true;
    canvas.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const rect = canvas.getBoundingClientRect();
        carX = touchX - rect.left;
        if (carX < grassWidth) {
            carX = grassWidth;
        } else if (carX > grassWidth + roadWidth - car_width) {
            carX = grassWidth + roadWidth - car_width;
        }
    });
}
window.addEventListener("resize", adjustCanvasSize, false);
adjustCanvasSize();
updateGame();
