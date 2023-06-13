const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Player variables
const player1 = {
  x: 50,
  y: canvas.height / 2,
  radius: 25,
  speed: 5,
  health: 100,
  gun: {
    name: "Pistol",
    reloadSpeed: 1,
    magazineCapacity: 10,
    bullets: 10
  },
  projectiles: [],
  jumping: false,
  jumpHeight: 1500,
  jumpSpeed: 100000
};

const player2 = {
  x: canvas.width - 100,
  y: canvas.height / 2,
  radius: 25,
  speed: 5,
  health: 100,
  gun: {
    name: "Pistol",
    reloadSpeed: 1,
    magazineCapacity: 10,
    bullets: 10
  },
  projectiles: [],
  jumping: false,
  jumpHeight: 1500,
  jumpSpeed: 100000
};

// Game variables
let roundEnd = false;
const gravity = 1;
const platformHeight = 20;

// Function to handle player controls
function handleControls() {
  // Player 1 controls
  if (keys["ArrowUp"] && player1.y > player1.radius + platformHeight) {
    player1.y -= player1.speed;
  }
  if (keys["ArrowDown"] && player1.y < canvas.height - player1.radius) {
    player1.y += player1.speed;
  }
  if (keys["ArrowLeft"] && player1.x > player1.radius) {
    player1.x -= player1.speed;
  }
  if (keys["ArrowRight"] && player1.x < canvas.width / 2 - player1.radius) {
    player1.x += player1.speed;
  }
  if (keys[" "] && !roundEnd && player1.gun.bullets > 0) {
    const projectile = {
      x: player1.x,
      y: player1.y,
      radius: 5,
      speedX: 5,
      speedY: 0
    };
    player1.gun.bullets--;
    player1.projectiles.push(projectile);
  }
  if (keys["Control"] && !player1.jumping) {
    player1.jumping = true;
    jumpPlayer(player1);
  }

  // Player 2 controls
  if (keys["w"] && player2.y > player2.radius + platformHeight) {
    player2.y -= player2.speed;
  }
  if (keys["s"] && player2.y < canvas.height - player2.radius) {
    player2.y += player2.speed;
  }
  if (keys["a"] && player2.x > canvas.width / 2 + player2.radius) {
    player2.x -= player2.speed;
  }
  if (keys["d"] && player2.x < canvas.width - player2.radius) {
    player2.x += player2.speed;
  }
  if (keys["Enter"] && !roundEnd && player2.gun.bullets > 0) {
    const projectile = {
      x: player2.x,
      y: player2.y,
      radius: 5,
      speedX: -5,
      speedY: 0
    };
    player2.gun.bullets--;
    player2.projectiles.push(projectile);
  }
  if (keys["Shift"] && !player2.jumping) {
    player2.jumping = true;
    jumpPlayer(player2);
  }
}

// Function to handle player jumping
function jumpPlayer(player) {
  let jumpCount = 0;
  const jumpInterval = setInterval(() => {
    if (jumpCount >= player.jumpHeight) {
      clearInterval(jumpInterval);
      player.jumping = false;
      return;
    }
    player.y -= player.jumpSpeed;
    jumpCount += player.jumpSpeed;
  }, 10);
}

// Function to update the projectiles
function updateProjectiles() {
  // Update player 1 projectiles
  for (let i = 0; i < player1.projectiles.length; i++) {
    const projectile = player1.projectiles[i];

    projectile.x += projectile.speedX;
    projectile.y += projectile.speedY;

    // Check collision with player 2
    const dx = projectile.x - player2.x;
    const dy = projectile.y - player2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < player2.radius) {
      player2.health -= 10;
      player1.projectiles.splice(i, 1);
      i--;
    }

    // Check if projectile is out of bounds
    if (projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height) {
      player1.projectiles.splice(i, 1);
      i--;
    }
  }

  // Update player 2 projectiles
  for (let i = 0; i < player2.projectiles.length; i++) {
    const projectile = player2.projectiles[i];

    projectile.x += projectile.speedX;
    projectile.y += projectile.speedY;

    // Check collision with player 1
    const dx = projectile.x - player1.x;
    const dy = projectile.y - player1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < player1.radius) {
      player1.health -= 10;
      player2.projectiles.splice(i, 1);
      i--;
    }

    // Check if projectile is out of bounds
    if (projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height) {
      player2.projectiles.splice(i, 1);
      i--;
    }
  }
}

// Function to draw the game
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw platform
  ctx.fillStyle = "#888";
  ctx.fillRect(0, canvas.height - platformHeight, canvas.width, platformHeight);

  // Draw players as circles
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(player1.x, player1.y, player1.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(player2.x, player2.y, player2.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw player health bars
  ctx.fillStyle = "green";
  ctx.fillRect(player1.x - player1.radius, player1.y - player1.radius - 10, player1.health * 2, 5);
  ctx.fillRect(player2.x - player2.radius, player2.y - player2.radius - 10, player2.health * 2, 5);

  // Draw player projectiles
  ctx.fillStyle = "black";
  for (let projectile of player1.projectiles) {
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let projectile of player2.projectiles) {
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Function to update the game
function updateGame() {
  handleControls();
  updateProjectiles();
  drawGame();

  // Check if players are out of health
  if (player1.health <= 0 || player2.health <= 0) {
    roundEnd = true;
    if (player1.health <= 0 && player2.health <= 0) {
      console.log("Draw!");
    } else if (player1.health <= 0) {
      console.log("Player 2 wins!");
    } else {
      console.log("Player 1 wins!");
    }
  }

  // Check if players are on the platform
  if (player1.y < canvas.height - player1.radius) {
    player1.y += gravity;
  }
  if (player2.y < canvas.height - player2.radius) {
    player2.y += gravity;
  }

  // Request animation frame for next update
  if (!roundEnd) {
    requestAnimationFrame(updateGame);
  }
}

// Event listeners for key presses
const keys = {};
document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// Start the game
requestAnimationFrame(updateGame);
