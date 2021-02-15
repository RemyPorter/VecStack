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
        let a = this.pop(1);
        this.push(a * 180 / Math.PI);
    },
    "rad": function () {
        let a = this.pop(1);
        this.push(a * Math.PI / 180);
    },
    "sin": function () {
        this.push(Math.sin(parseFloat(this.pop(1))));
    },
    "cos": function () {
        this.push(Math.cos(parseFloat(this.pop(1))));
    },
    "tan": function () {
        this.push(Math.tan(parseFloat(this.pop(1))));
    }

}