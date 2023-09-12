class Block {
    constructor(imgsrc, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.img = new Image(width, height);
        this.img.src = imgsrc;
        this.imgsrc = imgsrc;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    // assume other has {x, y, width, height}
    intersects(other) {
        let tw = this.width;
        let th = this.height;
        let rw = other.width;
        let rh = other.height;
        if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
            return false;
        }
        let tx = this.x;
        let ty = this.y;
        let rx = other.x;
        let ry = other.y;
        rw += rx;
        rh += ry;
        tw += tx;
        th += ty;
        // overflow || intersect
        return (
            (rw < rx || rw > tx) &&
            (rh < ry || rh > ty) &&
            (tw < tx || tw > rx) &&
            (th < ty || th > ry)
        );
    }
}

export default Block;