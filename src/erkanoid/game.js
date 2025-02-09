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

const emojiStart = 0x1f600;
const emojiEnd = 0x1f64f;

function randomEmoji() {
  const emoji = String.fromCodePoint(
    emojiStart + Math.floor(Math.random() * (emojiEnd - emojiStart)),
  );
  return emoji;
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
    this.ballDirection = { x: 1, y: 1 };
    this.ballPosition = { x: 0, y: 0 };
    this.ballSpeed = 8;
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
    this.gameOver = true;
    this.gamePaused = true;

    this.setupEventListers();
    this.setupInterval();
    this.createBricks();
    this.render();
    this.startPositions();
  }

  setupEventListers() {
    this.game.addEventListener("mousemove", (event) => {
      this.paddlePosition =
        event.clientX - this.game.offsetLeft - this.paddle.offsetWidth / 2;
    });
    this.game.addEventListener("mousedown", () => {
      if (this.gameOver) {
        this.startGame();
      } else {
        this.gamePaused = false;
      }
    });
  }

  setupInterval() {
    const cancelId = setInterval(() => {
      this.render();
      if (this.gamePaused || this.gameOver) {
        return;
      }
      this.moveBall();
      this.checkCollisions();
      this.checkWin();
      this.checkGameOver();
    }, 1000 / 60);
  }

  createBricks() {
    for (const brick of this.bricks) {
      this.game.removeChild(brick);
    }
    this.bricks = [];

    for (let y = 0; y < this.brickRows; y++) {
      for (let x = 0; x < this.brickColumns; x++) {
        const brick = document.createElement("div");
        brick.innerText = randomEmoji();
        brick.className = "brick";
        brick.style.width = `${this.brickSize.x}px`;
        brick.style.height = `${this.brickSize.y}px`;
        brick.style["font-size"] = `${this.brickSize.y - 10}px`;
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
    this.ball.style.left = `${this.ballPosition.x}px`;
    this.ball.style.top = `${this.ballPosition.y}px`;
  }

  startPositions() {
    this.ballPosition = {
      x: this.game.offsetWidth / 2 - this.ballSize / 2,
      y: this.game.offsetHeight / 2 - this.ballSize / 2,
    };
    this.ballDirection = { x: -1, y: 1 };
  }

  moveBall() {
    this.ballPosition.x += this.ballSpeed * this.ballDirection.x;
    this.ballPosition.y += this.ballSpeed * this.ballDirection.y;
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
      this.ballDirection.y = Math.abs(this.ballDirection.y) * -1.05;
      const paddleCenter = this.paddlePosition + this.paddle.offsetWidth / 2;
      const ballCenter = this.ballPosition.x + this.ballSize / 2;
      const diff = (ballCenter - paddleCenter) / (this.paddle.offsetWidth / 2);
      this.ballDirection.x = diff;
      playBoop();
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    this.bricks.forEach((brick) => {
      if (!brick.className.includes("hide")) {
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
          brick.className = "brick hide";
          this.score++;
          playBoop(2);
          const brickColor = brick.style.backgroundColor;

          switch (brickColor) {
            case "red":
              this.paddleSize *= 1.2;
              break;
            case "green":
              this.paddleSize *= 0.9;
              break;
            case "blue":
            case "yellow":
            case "purple":
              this.ballSpeed *= 1.01;
              break;
          }
        }
      }
    });
  }

  checkWin() {
    if (this.score === this.brickRows * this.brickColumns) {
      this.gameOver = true;
      alert("🎉 You won Erkanoid 🎉");
      this.createBricks();
      this.startPositions();
    }
  }

  checkGameOver() {
    if (this.ballPosition.y >= this.game.offsetHeight - this.ballSize) {
      this.lives--;
      this.startPositions();
      if (this.lives <= 0) {
        this.gameOver = true;
        alert("You lost Erkanoid 🤭 Try again! ");
        this.createBricks();
      } else {
        this.gamePaused = true;
      }
    }
  }

  startGame() {
    this.gameOver = false;
    this.gamePaused = false;
    this.score = 0;
    this.lives = 3;
    this.ballSpeed = 8;
    this.ballSize = 20;
    this.paddleSize = 200;
    this.startPositions();
  }
}

const erkanoid = new Erkanoid(/** @type {HTMLDivElement} */ (game));
