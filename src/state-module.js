const StateModule = {
    "tr": function () {
        let [y, x] = this.pop(2);
        translate(x,y);
    },
    "psh": function() {
        this.transPush();
    },
    "p": function () {
        this.transPop();
    },
    "pp": function () {
        let [n] = this.pop(1);
        for (let i = 0; i < n; i++) {
            pop();
        }
    },
    "ppp": function() {
        while (this.stateBag.transformLevel > 0) {
            this.transPop();
        }
    },
    "sc": function () {
        let [y, x] = this.pop(2);
        scale(x, y);
    },
    "rt": function () {
        let [r] = this.pop(1);
        rotate(r);
    },
    "f": function () {
        let [f] = this.pop(1);
        fill(f);
    },
    "st": function () {
        let [s] = this.pop(1);
        stroke(s);
    },
    "stw": function () {
        let [sw] = this.pop(1);
        strokeWeight(sw);
    },
    "ns": function() {
        noStroke();
    },
    "nf": function () {
        noFill();
    },
    "sz": function () {
        let [h, w] = this.pop(2);
        resizeCanvas(w, h, true);
    }
}