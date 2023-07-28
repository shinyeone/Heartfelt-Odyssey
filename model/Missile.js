import Sprite from "./Sprite.js";

class Missile extends Sprite {
    constructor(imgsrc, x, y, width, height) {
        super(imgsrc, x, y, width, height, 0, 0);
        this.visible = true;
    }

    draw(ctx) {
        if (this.visible) {
            super.draw(ctx);
        }
    }

    move() {
        this.dy = -3;
        super.move();
    }

    collides(invader) {
        if (this.visible && this.intersects(invader)) {
            this.visible = false;
            invader.collides(this);
            return true;
        }
        return false;
    }
}

export default Missile;