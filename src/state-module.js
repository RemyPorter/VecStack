const StateModule = {
    "tr": function () {
        let [y, x] = this.pop(2);
        this.transPush();
        translate(x,y);
    },
    "p": function () {
        this.transPop();
    },
    "pp": function () {
        let n = this.pop(1);
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
        this.transPush();
        scale(x, y);
    },
    "rt": function () {
        let r = this.pop(1);
        this.transPush();
        rotate(r);
    },
    "f": function () {
        this.transPush();
        let f = this.pop(1);
        fill(f);
    },
    "nf": function () {
        this.transPush();
        noFill();
    },
    "sz": function () {
        let [h, w] = this.pop(2);
        resizeCanvas(w, h, true);
    }
}