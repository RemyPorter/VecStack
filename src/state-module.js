const StateModule = {
    "tr": function () {
        let [y, x] = this.pop(2);
        push();
        translate(x,y);
    },
    "p": function () {
        pop();
    },
    "pp": function () {
        let n = this.pop(1);
        for (let i = 0; i < n; i++) {
            pop();
        }
    },
    "sc": function () {
        let [y, x] = this.pop(2);
        push();
        scale(x, y);
    },
    "rt": function () {
        let r = this.pop(1);
        this.push();
        rotate(r);
    },
    "f": function () {
        push();
        let f = this.pop(1);
        fill(f);
    },
    "nf": function () {
        push();
        noFill();
    },
    "sz": function () {
        let [h, w] = this.pop(2);
        resizeCanvas(w, h, true);
    }
}