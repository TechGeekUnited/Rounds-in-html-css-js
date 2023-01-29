// Add event listeners for arrow keys
document.addEventListener("keydown", movePlayer);

function movePlayer(event) {
  // Get player element
  var player = document.getElementById("player");
  
  // Check for arrow key presses
  if (event.keyCode === 37) { // left arrow
    player.style.left = player.offsetLeft - 10 + "px";
  } else if (event.keyCode === 38) { // up arrow
    player.style.top = player.offsetTop - 10 + "px";
  } else if (event.keyCode === 39) { // right arrow
    player.style.left = player.offsetLeft + 10 + "px";
  } else if (event.keyCode === 40) { // down arrow
    player.style.top = player.offsetTop + 10 + "px";
  }
}

// Add event listener for spacebar
document.addEventListener("keydown", fireBullet);

function fireBullet(event) {
  // Check if spacebar was pressed
  if (event.keyCode === 32) {
    // Get bullet and player elements
    var bullet = document.getElementById("bullet");
    var player = document.getElementById("player");
    
    // Position bullet at the right of the player
    bullet.style.left = player.offsetLeft + player.clientWidth + "px";
    bullet.style.top = player.offsetTop + (player.clientHeight / 2) - (bullet.clientHeight / 2) + "px";
    
    // Move bullet to the right
    var bulletInterval = setInterval(function() {
      bullet.style.left = bullet.offsetLeft + 10 + "px";
      
      // Check if bullet hits NPC
      if (bullet.offsetLeft + bullet.clientWidth >= document.getElementById("npc").offsetLeft) {
        clearInterval(bulletInterval);
        bullet.style.left = "-10px";
        
        // Increase player's score
        var score = document.getElementById("score");
        score.innerHTML = parseInt(score.innerHTML) + 1;
        
        // Check if player has won all rounds
        if (score.innerHTML === "3") {
          alert("You won! Collect your prize at the store.");
        }
      }
    }, 10);
  }
}
// Update player's health when hit by enemy
if (bullet.offsetLeft + bullet.clientWidth >= document.getElementById("player").offsetLeft) {
  var playerHealth = document.getElementById("player-health");
  playerHealth.innerHTML = parseInt(playerHealth.innerHTML) - 10;
  
  // Check if player has no more health
  if (playerHealth.innerHTML === "0") {
    alert("You lost! Try again.");
  }
}

// Update enemy's health when hit by player
if (bullet.offsetLeft + bullet.clientWidth >= document.getElementById("npc").offsetLeft) {
  var enemyHealth = document.getElementById("enemy-health");
  enemyHealth.innerHTML = parseInt(enemyHealth.innerHTML) - 10;
  
  // Check if enemy has no more health
  if (enemyHealth.innerHTML === "0") {
    clearInterval(bulletInterval);
    bullet.style.left = "-10px";
    
    // Increase player's score
    var score = document.getElementById("score");
    score.innerHTML = parseInt(score.innerHTML) + 1;
    
    // Check if player has won all rounds
    if (score.innerHTML === "3") {
      alert("You won! Collect your prize at the store.");
    }
  }
}
