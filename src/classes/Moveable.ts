export abstract class Moveable {
    protected x: number;
    protected y: number;
    protected element: HTMLImageElement;
    protected speed: number;
    protected imageLoaded: boolean;

    constructor(x: number, y: number, imageUrl: string) {
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.imageLoaded = false;
        this.element = new Image();
        this.element.onload = () => {
            this.imageLoaded = true;
        };
        this.element.src = imageUrl;
    }

    
    public getPosition() {
        return { x: this.x, y: this.y };
    }

    public getElement() {
        return this.element;
    }

    public isImageLoaded(): boolean {
        return this.imageLoaded;
    }
} 