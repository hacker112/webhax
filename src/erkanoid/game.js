// @ts-check

const game = document.getElementById("erkanoid");

class Erkanoid {
  /**
   *
   * @param {HTMLDivElement} game
   */
  constructor(game) {
    this.game = game;
    this.paddle = /**  @type {HTMLDivElement} */ (
      game.querySelector(".paddle")
    );
    this.ball = /**  @type {HTMLDivElement} */ (game.querySelector(".ball"));
    this.ballSpeed = 2;
    this.ballDirection = { x: 1, y: 1 };
    this.ballPosition = { x: 0, y: 0 };
    this.ballSize = 20;
    this.paddleSize = 100;
    this.paddleSpeed = 10;
    this.paddlePosition = 0;
    this.bricks = [];
    this.brickSize = { x: 60, y: 20 };
    this.brickRows = 5;
    this.brickColumns = 10;
    this.brickGap = 10;
    this.brickColors = ["red", "green", "blue", "yellow", "purple"];
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;

    this.setupEventListers();
    this.createBricks();
    this.render();
    this.start();
  }

  setupEventListers() {
    this.game.addEventListener("mousemove", (event) => {
      this.paddlePosition =
        event.clientX - this.game.offsetLeft - this.paddle.offsetWidth / 2;
    });
  }

  createBricks() {
    for (let y = 0; y < this.brickRows; y++) {
      for (let x = 0; x < this.brickColumns; x++) {
        const brick = document.createElement("div");
        brick.className = "brick";
        brick.style.width = `${this.brickSize.x}px`;
        brick.style.height = `${this.brickSize.y}px`;
        brick.style.left = `${x * (this.brickSize.x + this.brickGap)}px`;
        brick.style.top = `${y * (this.brickSize.y + this.brickGap)}px`;
        brick.style.backgroundColor = this.brickColors[y];
        this.game.appendChild(brick);
        this.bricks.push(brick);
      }
    }
  }

  render() {
    this.paddle.style.width = `${this.paddleSize}px`;
    this.paddle.style.left = `${this.paddlePosition}px`;
    this.ball.style.width = `${this.ballSize}px`;
    this.ball.style.height = `${this.ballSize}px`;
  }

  start() {
    this.ballPosition = {
      x: this.game.offsetWidth / 2 - this.ballSize / 2,
      y: this.game.offsetHeight / 2 - this.ballSize / 2,
    };
    this.ballDirection = { x: 1, y: -1 };
  }

  moveBall() {
    this.ballPosition.x += this.ballSpeed * this.ballDirection.x;
    this.ballPosition.y += this.ballSpeed * this.ballDirection.y;

    this.ball.style.left = `${this.ballPosition.x}px`;
    this.ball.style.top = `${this.ballPosition.y}px`;
  }

  checkCollisions() {
    if (
      this.ballPosition.x <= 0 ||
      this.ballPosition.x >= this.game.offsetWidth - this.ballSize
    ) {
      this.ballDirection.x *= -1;
    }

    if (this.ballPosition.y <= 0) {
      this.ballDirection.y *= -1;
    }

    if (
      this.ballPosition.y >= this.game.offsetHeight - this.ballSize &&
      this.ballPosition.x >= this.paddlePosition &&
      this.ballPosition.x <=
        this.paddlePosition + this.paddle.offsetWidth - this.ballSize
    ) {
      this.ballDirection.y *= -1;
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    this.bricks.forEach((brick) => {
      if (brick.style.display !== "none") {
        if (
          this.ballPosition.y <=
            Number.parseInt(brick.style.top) + this.brickSize.y &&
          this.ballPosition.y + this.ballSize >=
            Number.parseInt(brick.style.top) &&
          this.ballPosition.x + this.ballSize >=
            Number.parseInt(brick.style.left) &&
          this.ballPosition.x <=
            Number.parseInt(brick.style.left) + this.brickSize.x
        ) {
          this.ballDirection.y *= -1;
          brick.style.display = "none";
          this.score++;
        }
      }
    });
  }

  checkWin() {
    if (this.score === this.brickRows * this.brickColumns) {
      this.gameOver = true;
      alert("You win!");
    }
  }

  checkGameOver() {
    if (this.ballPosition.y >= this.game.offsetHeight - this.ballSize) {
      this.lives--;
      if (this.lives <= 0) {
        this.gameOver = true;
        alert("Game over!");
      } else {
        this.start();
      }
    }
  }

  startGame() {
    this.gameOver = false;
    this.score = 0;
    this.lives = 3;
    this.start();

    const cancelId = setInterval(() => {
      this.render();
      this.moveBall();
      this.checkCollisions();
      this.checkWin();
      this.checkGameOver();
      if (this.gameOver) {
        clearInterval(cancelId);
      }
    }, 1000 / 60);
  }
}

const erkanoid = new Erkanoid(/** @type {HTMLDivElement} */ (game));

erkanoid.startGame();
