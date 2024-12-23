document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const themes = document.getElementById("themes");
    const restartButton = document.getElementById("restartGame");
    const highScoresList = document.getElementById("highScores");
    
    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 0, y: 0 };
    let food = { x: 15, y: 15 };
    let score = 0;
    const gridSize = 20;
  
    const colors = {
      classic: { snake: "green", food: "red", background: "white" },
      night: { snake: "lightgreen", food: "yellow", background: "black" },
      retro: { snake: "blue", food: "pink", background: "lightyellow" }
    };
    let currentTheme = colors.classic;
  
    function drawGame() {
      ctx.fillStyle = currentTheme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.fillStyle = currentTheme.food;
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  
      snake.forEach(segment => {
        ctx.fillStyle = currentTheme.snake;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
      });
  
      moveSnake();
      checkCollision();
    }
  
    function moveSnake() {
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
      snake.unshift(head);
  
      if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
        currentTheme.snake = currentTheme.food;
      } else {
        snake.pop();
      }
    }
  
    function checkCollision() {
      const head = snake[0];
      if (
        head.x < 0 || head.x >= canvas.width / gridSize ||
        head.y < 0 || head.y >= canvas.height / gridSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        gameOver();
      }
    }
  
    function placeFood() {
      food.x = Math.floor(Math.random() * (canvas.width / gridSize));
      food.y = Math.floor(Math.random() * (canvas.height / gridSize));
    }
  
    function gameOver() {
      alert(`Game Over! Your score: ${score}`);
      saveHighScore(score);
      score = 0;
      snake = [{ x: 10, y: 10 }];
      direction = { x: 0, y: 0 };
    }
  
    function saveHighScore(score) {
      const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
      highScores.push(score);
      highScores.sort((a, b) => b - a);
      highScores.splice(5); // Keep top 5 scores
      localStorage.setItem("highScores", JSON.stringify(highScores));
      displayHighScores();
    }
  
    function displayHighScores() {
      const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
      highScoresList.innerHTML = highScores.map(score => `<li>${score}</li>`).join("");
    }
  
    themes.addEventListener("change", (e) => {
      currentTheme = colors[e.target.value];
    });
  
    restartButton.addEventListener("click", () => {
      snake = [{ x: 10, y: 10 }];
      direction = { x: 0, y: 0 };
      score = 0;
      placeFood();
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
    });
  
    placeFood();
    displayHighScores();
    setInterval(drawGame, 100);
  });
  