import { Ball } from "./Ball";
import { Goalkeeper } from "./Goalkeeper";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private goalkeeper: Goalkeeper;
  private ball: Ball;
  private score: number;
  private gameOver: boolean;
  private gameStarted: boolean;
  private isPaused: boolean;
  private scoreDisplay: HTMLElement | null;
  private animationFrameId: number | null = null;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 300;
    this.canvas.height = 500;
    this.canvas.style.backgroundColor = "#2B382C";
    this.ctx = this.canvas.getContext("2d")!;

    this.goalkeeper = new Goalkeeper(100, 450);
    this.ball = new Ball(150, 0);
    this.score = 0;
    this.gameOver = false;
    this.gameStarted = false;
    this.isPaused = false;
    this.scoreDisplay = null;

    document.querySelector("#app")!.appendChild(this.canvas);
    this.setupControls();
    this.setupKeyboardControls();
  }

  private waitForImages(callback: () => void) {
    if (this.goalkeeper.isImageLoaded() && this.ball.isImageLoaded()) {
      this.gameStarted = true;
      callback();
    } else {
      setTimeout(() => this.waitForImages(callback), 100);
    }
  }

  private setupControls() {
    const controls = document.createElement("div");
    controls.className = "fixed right-0 top-0 h-full w-64 bg-side p-4";

    const scoreContainer = document.createElement("div");
    scoreContainer.className = "mb-8";

    const scoreDisplay = document.createElement("div");
    scoreDisplay.className = "text-white text-xl font-semibold";
    scoreDisplay.id = "score-display";
    scoreDisplay.textContent = `Score : ${this.score}`;
    scoreContainer.appendChild(scoreDisplay);

    this.scoreDisplay = scoreDisplay;

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "flex flex-col gap-2";

    const buttons = [
      { 
        text: "Jouer", 
        onClick: () => {
          if (!this.gameStarted) {
            this.waitForImages(() => this.start());
          } else {
            this.restart();
          }
        }
      },
      { text: "Pause", onClick: () => this.pauseGame() },
      { text: "Play", onClick: () => this.resumeGame() },
      { text: "Meilleur Score", onClick: () => {} },
      { text: "Activer/Désactiver le son", onClick: () => {} },
      { text: "Aide", onClick: () => {} },
    ];

    buttons.forEach(({ text, onClick }) => {
      const button = document.createElement("button");
      button.textContent = text;
      button.addEventListener("click", onClick);
      button.className =
        "w-full p-3 button text-white border rounded transition-colors border-none shadow-md";
      buttonsContainer.appendChild(button);
    });

    controls.appendChild(scoreContainer);
    controls.appendChild(buttonsContainer);
    document.querySelector("#app")!.appendChild(controls);
  }

  private setupKeyboardControls() {
    document.addEventListener("keydown", (event) => {
      if (this.gameOver) return;

      switch (event.key) {
        case "ArrowLeft":
          this.goalkeeper.moveLeft();
          break;
        case "ArrowRight":
          this.goalkeeper.moveRight();
          break;
      }
    });
  }

  update() {
    if (this.gameOver || this.isPaused) return;

    this.goalkeeper.update();
    this.ball.update();

    if (this.ball.checkCollision(this.goalkeeper)) {
      this.score++;
      this.updateScoreDisplay();
      this.resetBall();
    }

    if (this.ball.getPosition().y > 600) {
      this.gameOver = true;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = "#0D2F28";
    this.ctx.lineWidth = 4;
    for (let i = 1; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * 100, 0);
      this.ctx.lineTo(i * 100, this.canvas.height);
      this.ctx.stroke();
    }

    if (!this.gameStarted) return;
    const keeperPos = this.goalkeeper.getPosition();
    const ballPos = this.ball.getPosition();

    if (this.goalkeeper.isImageLoaded()) {
      this.ctx.drawImage(
        this.goalkeeper.getElement(),
        keeperPos.x,
        keeperPos.y
      );
    }

    if (this.ball.isImageLoaded()) {
      this.ctx.drawImage(this.ball.getElement(), ballPos.x, ballPos.y);
    }

    if (this.gameOver) {
      alert("Game Over!");
      this.restart();
      return;
    }
  }

  private resetBall() {
    this.ball = new Ball(0, 0);
  }

  restart() {
    this.score = 0;
    this.gameOver = false;
    this.goalkeeper = new Goalkeeper(100, 450);
    this.resetBall();
    this.updateScoreDisplay();
  }

  private pauseGame() {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private resumeGame() {
    this.isPaused = false;
    this.start();
  }

  private updateScoreDisplay() {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = `Score : ${this.score}`;
    }
  }

  start() {
    if (this.isPaused) return;
    
    const gameLoop = () => {
      if (!this.isPaused) {
        this.update();
        this.draw();
      }
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    gameLoop();
  }
}