const MathModule = {
    "+": function () {
        let [b, a] = this.pop(2);
        this.push(parseFloat(a) + parseFloat(b));
    }, 
    "-": function () {
        let [b, a] = this.pop(2);
        this.push(parseFloat(a) - parseFloat(b));
    },
    "*": function () {
        let [b, a] = this.pop(2);
        this.push(parseFloat(a) * parseFloat(b));
    },
    "**": function () {
        let [b, a] = this.pop(2);
        this.push(Math.pow(parseFloat(a), parseFloat(b)));       
    },
    "PI": function () {
        this.push(Math.PI);
    }, 
    "/": function () {
        let [b, a] = this.pop(2);
        this.push(parseFloat(a) / parseFloat(b));
    },
    "deg": function () {
        let [a] = this.pop(1);
        this.push(a * 180 / Math.PI);
    },
    "rad": function () {
        let [a] = this.pop(1);
        this.push(a * Math.PI / 180);
    },
    "sin": function () {
        let [a] = this.pop(1);
        this.push(Math.sin(a));
    },
    "cos": function () {
        let [a] = this.pop(1);
        this.push(Math.cos(a));
    },
    "tan": function () {
        let [a] = this.pop(1);
        this.push(Math.tan(a));
    },
    "|": function () {
        let [a] = this.pop(1);
        this.push(Math.abs(a));
    },
    "floor": function() {
        let [a] = this.pop(1);
        this.push(Math.floor(a));
    },
    "ceil": function() {
        let [a] = this.pop(1);
        this.push(Math.ceil(a));
    },
    "round": function() {
        let [a] = this.pop(1);
        this.push(Math.round(a));
    },
    "fract": function() {
        let [a] = this.pop(1);
        this.push(fract(a));
    }

}