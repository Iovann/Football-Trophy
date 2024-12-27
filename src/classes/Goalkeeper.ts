import { Moveable } from './Moveable';

export class Goalkeeper extends Moveable {
    private currentLane: number;

    constructor(x: number, y: number) {
        super(x, y, '/goal-keeper.svg');
        this.currentLane = 1;
        this.x = 25 + (this.currentLane * 100);
        this.speed = 25;
    }

    moveLeft(): void {
        if (this.currentLane > 0) {
            this.currentLane--;
            this.x = 25 + (this.currentLane * 100);
        }
    }

    moveRight(): void {
        if (this.currentLane < 2) {
            this.currentLane++;
            this.x = 25 + (this.currentLane * 100);
        }
    }

    update(): void {
    }
} 