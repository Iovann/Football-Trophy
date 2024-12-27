import { Moveable } from './Moveable';
import { Goalkeeper } from './Goalkeeper';

export class Ball extends Moveable {
    private velocityY: number;
    private lane: number;

    constructor(x: number, y: number) {
        super(x, y, '/ball.svg');
        this.velocityY = 2;
        this.lane = Math.floor(Math.random() * 3);
        this.x = 30 + (this.lane * 100);
        this.y = 0;
    }

    update(): void {
        this.y += this.velocityY;
    }

    isOutOfBounds(): boolean {
        return this.y > 600;
    }

    checkCollision(goalkeeper: Goalkeeper): boolean {
        const ballPos = this.getPosition();
        const keeperPos = goalkeeper.getPosition();
        
        return (
            ballPos.x < keeperPos.x + 50 &&
            ballPos.x + 30 > keeperPos.x &&
            ballPos.y < keeperPos.y + 60 &&
            ballPos.y + 30 > keeperPos.y
        );
    }
} 