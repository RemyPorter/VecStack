const DrawingModule = {
    "c": function () {
        let [r, y, x] = this.pop(3);
        ellipse(x, y, r, r);
    },
    "r": function () {
        let [h, w, y, x] = this.pop(4);
        rect(x, y, w, h);
    },
    "l": function () {
        let [y1, x1, y0, x0] = this.pop(4);
        line(x0, y0, x1, y1);
    }, 
    "e": function () {
        let [ry, rx, y, x] = this.pop(4);
        ellipse(x, y, rx, ry);
    },
    "path": function () {
        let [n, closed] = this.pop(2);
        n = parseInt(n);
        closed = closed == "true" || closed == "1";
        beginShape();
        for (let i = 0; i < n; i++) {
            let [y,x] = this.pop(2);
            vertex(x, y);
        }
        if (closed) {
            endShape(CLOSE);
        } else {
            endShape();
        }
    },
    "bg": function () {
        let f = this.pop(1)[0];
        background(f);
    }
}