import Sprite from "./Sprite.js";

class Invader extends Sprite {
    constructor(imgsrc, x, y, width, height, slow, isHit) {
        super(imgsrc, x, y, width, height);
        this.dy = 1.5;
        this.slow = slow; // 1: slow
        this.isHit = false;
    }

    move(canvasWidth) {
        let rand = Math.random();
        // To make it jiggle
        if (rand > 0.5) {
            this.dx = Math.sin(Math.random()) + 0.4;
        } else {
            this.dx = -(Math.sin(Math.random()) + 0.4);
        }
        if (this.slow === 1) {
            this.dy = 3;
            super.move();
        } else {
            super.move();
        }
        if (this.x < 1) {
            this.x = 1;
        } else if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width - 1;
        }
    }

    collides(missile) {
        if (this.intersects(missile)) {
            return true;
        }
        return false;
    }
}
export default Invader;