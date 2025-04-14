const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to detect if the game is being played on a mobile device
function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}

// Adjust canvas size based on the platform
function adjustCanvasSize() {
    const margin = 0.05; // 5% margin
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  if (isMobile()) {
        canvasWidth = screenWidth - ((2 * margin * screenWidth) * 1.5); // 972
        canvasHeight = screenHeight - ((2 * margin * screenHeight) * 2.5); // 1728
  } else {
    canvasWidth = 1280; // Your default canvas width for desktop
    canvasHeight = 648; // Your default canvas height for desktop
  }
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

// Game settings
const gravity = 0.5;
const jumpPower = 8;
const playerWidth = 20;
const playerHeight = 20;
const obstacleWidth = 20;
const obstacleHeight = 20;
const minObstacleSpacing = 200;
const maxObstacleSpacing = 400;
let obstacleSpacing = Math.floor(Math.random() * (maxObstacleSpacing - minObstacleSpacing + 1)) + minObstacleSpacing;
const groundHeight = 50;
const initialLives = 3;
const powerUpDuration = 300; // Frames
const gapWidth = 30;
const minGapSpacing = 300;
const maxGapSpacing = 500;
let gapSpacing = Math.floor(Math.random() * (maxGapSpacing - minGapSpacing + 1)) + minGapSpacing;
const gapFrequency = 0.1; // 10% chance of gap
const obstaclePoolSize = 10; // Number of obstacles to pre-generate
const gapPoolSize = 10; // Number of gaps to pre-generate

let player, obstacles, powerUps, gaps, score, lives, isJumping, isGameOver, isInvincible, invincibleCounter, rotationAngle;

function init() {
  adjustCanvasSize();
  player = { x: 50, y: canvas.height - playerHeight - groundHeight, vy: 0 };
  obstacles = [];
  powerUps = [];
  gaps = [];
  score = 0;
  lives = initialLives;
  isJumping = false;
  isGameOver = false;
  isInvincible = false;
  invincibleCounter = 0;
  rotationAngle = 0;
  generateObstacles();
  generatePowerUps();
  generateGaps();
  updateUI();
  requestAnimationFrame(gameLoop);
}

function generateObstacles() {
  for (let i = 0; i < obstaclePoolSize; i++) {
    const newObstacle = createObstacle(canvas.width + i * obstacleSpacing);
    if (newObstacle) {
      obstacles.push(newObstacle);
    }
  }
}

function createObstacle(x) {
  const types = ['standard', 'spike', 'moving'];
  const type = types[Math.floor(Math.random() * types.length)];
  const proposedObstacle = { x, y: canvas.height - obstacleHeight - groundHeight, type, direction: Math.random() > 0.5 ? 1 : -1 };

  // Check if proposed obstacle overlaps with any gaps
  for (let gap of gaps) {
    if (proposedObstacle.x < gap.x + gapWidth && proposedObstacle.x + obstacleWidth > gap.x) {
      return null; // Overlaps with gap, skip creating obstacle
    }
  }

  return proposedObstacle;
}

function generatePowerUps() {
  // Create a power-up roughly every 5 obstacles
  const numberOfPowerUps = Math.floor(obstacles.length / 5);
  for (let i = 0; i < numberOfPowerUps; i++) {
    const obs = obstacles[i * 5];
    powerUps.push({ x: obs.x + Math.random() * obstacleSpacing, y: canvas.height - obstacleHeight - groundHeight - 50 });
  }
}

function generateGaps() {
  for (let i = 0; i < gapPoolSize; i++) {
    const newGap = createGap(canvas.width + i * gapSpacing);
    if (newGap) {
      gaps.push(newGap);
    }
  }
}

function createGap(x) {
  const proposedGap = { x };
  // Check if proposed gap overlaps with any obstacles
  for (let obs of obstacles) {
    if (proposedGap.x < obs.x + obstacleWidth && proposedGap.x + gapWidth > obs.x) {
      return null; // Overlaps with obstacle, skip creating gap
    }
  }
  return proposedGap;
}

function gameLoop() {
  if (isGameOver) return;

  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Update player
  player.vy += gravity;
  player.y += player.vy;

  if (player.y > canvas.height - playerHeight - groundHeight) {
    player.y = canvas.height - playerHeight - groundHeight;
    player.vy = 0;
    isJumping = false;
    rotationAngle = 0; // Reset rotation angle when landing
  } else if (isJumping) {
    rotationAngle += 10; // Increment rotation angle during jump
  }

  // Move obstacles
  for (let obs of obstacles) {
    obs.x -= 5;
    if (obs.type === 'moving') {
      obs.y += 3 * obs.direction;
      if (obs.y > canvas.height - obstacleHeight - groundHeight || obs.y < canvas.height - obstacleHeight - groundHeight - 100) {
        obs.direction *= -1;
      }
    }
  }

  // Move power-ups
  for (let powerUp of powerUps) {
    powerUp.x -= 5;
  }

  // Move gaps
  for (let gap of gaps) {
    gap.x -= 5;
  }

  // Check for collisions
  if (!isInvincible) {
    for (let obs of obstacles) {
      if (obs.type === 'spike') {
        if (
          player.x < obs.x + obstacleWidth &&
          player.x + playerWidth > obs.x &&
          player.y < obs.y + obstacleHeight &&
          player.y + playerHeight > obs.y &&
          isCollidingWithSpike(player, obs)
        ) {
          lives--;
          if (lives <= 0) {
            isGameOver = true;
            showGameOver();
          } else {
            resetPlayer();
          }
        }
      } else {
        // Allow player to land on top of obstacles
        if (
          player.x < obs.x + obstacleWidth &&
          player.x + playerWidth > obs.x &&
          player.y + playerHeight > obs.y &&
          player.y + playerHeight < obs.y + obstacleHeight &&
          player.vy > 0
        ) {
          player.y = obs.y - playerHeight;
          player.vy = 0;
          isJumping = false;
          rotationAngle = 0;
        }
        // Prevent the player from running into the side of obstacles
        else if (
          player.x < obs.x + obstacleWidth &&
          player.x + playerWidth > obs.x &&
          player.y < obs.y + obstacleHeight &&
          player.y + playerHeight > obs.y
        ) {
          lives--;
          if (lives <= 0) {
            isGameOver = true;
            showGameOver();
          } else {
            resetPlayer();
          }
        }
        // Prevent moving obstacles from landing on the player
        else if (
          obs.type === 'moving' &&
          player.x < obs.x + obstacleWidth &&
          player.x + playerWidth > obs.x &&
          player.y < obs.y + obstacleHeight &&
          player.y + playerHeight > obs.y &&
          obs.y + obstacleHeight > player.y + playerHeight
        ) {
          lives--;
          if (lives <= 0) {
            isGameOver = true;
            showGameOver();
          } else {
            resetPlayer();
          }
        }
      }
    }
  }

  // Check for power-up collection
  for (let i = 0; i < powerUps.length; i++) {
    const powerUp = powerUps[i];
    if (
      player.x < powerUp.x + 20 &&
      player.x + playerWidth > powerUp.x &&
      player.y < powerUp.y + 20 &&
      player.y + playerHeight > powerUp.y
    ) {
      powerUps.splice(i, 1);
      activatePowerUp();
    }
  }

  // Check for gaps
  for (let gap of gaps) {
    if (
      player.x + playerWidth > gap.x &&
      player.x < gap.x + gapWidth &&
      player.y + playerHeight >= canvas.height - groundHeight
    ) {
      lives--;
      if (lives <= 0) {
        isGameOver = true;
        showGameOver();
      } else {
        resetPlayer();
      }
    }
  }

  // Handle invincibility
  if (isInvincible) {
    invincibleCounter++;
    if (invincibleCounter > powerUpDuration) {
      isInvincible = false;
    }
  }

  // Recycle obstacles, power-ups, and gaps
  if (obstacles.length > 0 && obstacles[0].x < -obstacleWidth) {
    obstacles.shift();
    if (obstacles.length > 0) {
      const newObstacle = createObstacle(obstacles[obstacles.length - 1].x + obstacleSpacing);
      if (newObstacle) {
        obstacles.push(newObstacle);
      }
    } else {
      // Add more obstacles when the array is empty
      for (let i = 0; i < obstaclePoolSize; i++) {
        const newObstacle = createObstacle(canvas.width + i * obstacleSpacing);
        if (newObstacle) {
          obstacles.push(newObstacle);
        }
      }
    }
  }

  if (powerUps.length && powerUps[0].x < -20) {
    powerUps.shift();
    generatePowerUps();
  }

  if (gaps.length && gaps[0].x < -gapWidth) {
    gaps.shift();
    const newGap = createGap(gaps[gaps.length - 1].x + gapSpacing);
    if (newGap) {
      gaps.push(newGap);
    }
  }

  // Update score
  score++;
  updateUI();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground and gaps
  ctx.fillStyle = 'brown';
  let lastX = 0;
  for (let gap of gaps) {
    ctx.fillRect(lastX, canvas.height - groundHeight, gap.x - lastX, groundHeight);
    lastX = gap.x + gapWidth;
  }
  ctx.fillRect(lastX, canvas.height - groundHeight, canvas.width - lastX, groundHeight);

  // Draw player with rotation for backflip
  ctx.save();
  ctx.translate(player.x + playerWidth / 2, player.y + playerHeight / 2);
  ctx.rotate(rotationAngle * Math.PI / 180);
  ctx.translate(-playerWidth / 2, -playerHeight / 2);
  ctx.fillStyle = isInvincible ? 'yellow' : 'red';
  ctx.fillRect(0, 0, playerWidth, playerHeight);
  ctx.restore();

  // Draw obstacles with white border
  for (let obs of obstacles) {
    if (obs.type === 'spike') {
      ctx.fillStyle = 'purple';
      drawTriangle(obs.x, obs.y, obstacleWidth, obstacleHeight);
    } else {
      switch (obs.type) {
        case 'standard':
          ctx.fillStyle = 'blue';
          break;
        case 'moving':
          ctx.fillStyle = 'green';
          break;
      }
      ctx.fillRect(obs.x, obs.y, obstacleWidth, obstacleHeight);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obstacleWidth, obstacleHeight);
    }
  }

  // Draw power-ups
  ctx.fillStyle = 'orange';
  for (let powerUp of powerUps) {
    ctx.fillRect(powerUp.x, powerUp.y, 20, 20);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(powerUp.x, powerUp.y, 20, 20);
  }

  // Draw UI
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 30);

  // Draw Game Over screen
  if (isGameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Click to Restart', canvas.width / 2 - 70, canvas.height / 2 + 20);
  }
}

function drawTriangle(x, y, width, height) {
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x + width, y + height);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function isCollidingWithSpike(player, spike) {
  const spikeTipX = spike.x + obstacleWidth / 2;
  const spikeTipY = spike.y;
  const playerBottomY = player.y + playerHeight;
  const playerRightX = player.x + playerWidth;

  // Simple triangle collision detection
  return (
    player.x < spikeTipX &&
    playerRightX > spike.x &&
    playerBottomY > spike.y &&
    player.y < spike.y + obstacleHeight
  );
}

function resetPlayer() {
  player.x = 50;
  player.y = canvas.height - playerHeight - groundHeight;
  player.vy = 0;
  isJumping = false;
  rotationAngle = 0; // Reset rotation angle
}

function activatePowerUp() {
  isInvincible = true;
  invincibleCounter = 0;
}

function showGameOver() {
  isGameOver = true;
  canvas.addEventListener('click', restartGame, { once: true });
}

function restartGame() {
  init();
}

function updateUI() {
  // UI is now drawn directly on the canvas in the draw() function
}

// Input handling
if (isMobile()) {
  window.addEventListener('touchstart', () => {
    if (!isJumping) {
      player.vy = -jumpPower;
      isJumping = true;
    }
  });
} else {
  window.addEventListener('mousedown', () => {
    if (!isJumping) {
      player.vy = -jumpPower;
      isJumping = true;
    }
  });
}

// Adjust canvas size on window resize
window.addEventListener('resize', adjustCanvasSize);

init();
