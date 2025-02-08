// @ts-check

const game = document.getElementById("erkanoid");

const context = new window.AudioContext();

function playBoop(multiplier = 1) {
  const osc = context.createOscillator();
  osc.frequency.value = 110 * multiplier;
  osc.type = "sawtooth";
  osc.connect(context.destination);
  osc.start(context.currentTime);
  osc.stop(context.currentTime + 0.05);
}

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
    this.ballSpeed = 10;
    this.ballDirection = { x: 1, y: 1 };
    this.ballPosition = { x: 0, y: 0 };
    this.ballSize = 20;
    this.paddleSize = 200;
    this.paddleSpeed = 10;
    this.paddlePosition = 0;

    // Brinks
    this.bricks = [];
    this.brickRows = 5;
    this.brickColumns = 10;
    this.brickGap = 10;

    const widthAvailable =
      this.game.clientWidth - (this.brickColumns + 1) * this.brickGap;
    const widthPerBrick = Math.floor(widthAvailable / this.brickColumns);
    const heightPerBrick = Math.floor(widthAvailable / this.brickColumns / 3);

    this.brickSize = { x: widthPerBrick, y: heightPerBrick };
    this.brickColors = [
      "red",
      "green",
      "blue",
      "yellow",
      "purple",
      "orange",
      "pink",
      "cyan",
      "brown",
      "magenta",
    ];
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
        brick.style.left = `${this.brickGap + x * (this.brickSize.x + this.brickGap)}px`;
        brick.style.top = `${this.brickGap + y * (this.brickSize.y + this.brickGap)}px`;
        brick.style.backgroundColor =
          this.brickColors[y % this.brickColors.length];
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
    this.ballDirection = { x: -1, y: 1 };
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
      playBoop();
    }

    if (this.ballPosition.y <= 0) {
      this.ballDirection.y = 1;
      playBoop();
    }

    if (
      this.ballPosition.y >= this.paddle.offsetTop - this.ballSize &&
      this.ballPosition.x >= this.paddlePosition &&
      this.ballPosition.x <=
        this.paddlePosition + this.paddle.offsetWidth - this.ballSize
    ) {
      this.ballDirection.y = -1;
      playBoop();
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
          playBoop(2);
        }
      }
    });
  }

  checkWin() {
    if (this.score === this.brickRows * this.brickColumns) {
      this.gameOver = true;
      alert("You win!");
      // play winning sound
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
