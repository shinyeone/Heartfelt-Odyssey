import Sprite from "./Sprite.js";
import Missile from "./Missile.js";


class Subject extends Sprite {
    constructor(imgsrc, x, y, width, height) {
        super(imgsrc, x, y, width, height, 0, 0);
        this.displacement = 7;
        document.addEventListener("keydown", this.keyDownHandler.bind(this));
        document.addEventListener("keyup", this.keyUpHandler.bind(this));
    }

    move(canvasWidth) {
        super.move();
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        }
    }

    keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            this.dx = this.displacement;

        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            this.dx = -this.displacement;
        }
    }

    keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            this.dx = 0;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            this.dx = 0;
        }
    }
}

export default Subject;