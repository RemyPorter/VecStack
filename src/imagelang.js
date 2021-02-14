class StackVM {
    constructor() {
        this.stack = []
        this.symbolTable = {
            "c": this.circle,
            "e": this.ellipse,
            "r": this.rect,
            "path": this.path,
            "l": this.line,
            "+": this.add,
            "-": this.sub,
            "*": this.mult,
            "**": this.pow,
            "PI": this.pi,
            "/": this.div,
            "deg": this.deg,
            "rad": this.rad,
            "sin": this.sin,
            "cos": this.cos,
            "tan": this.tan,
            "tr": this.translate,
            "p": this.popMatrix,
            "pp": this.multiPopMatrix,
            "..": this.cloneTop,
            "sc": this.scale,
            "rt": this.rotate,
            "nf": this.noFill,
            "f": this.fill,
            "bg": this.background,
            "{": this.startBlock,
            "exe": this.runBlock,
            "rep": this.repeat,
            "proc": this.proc
        };
        this.blockTable = {};
        this.blockTable["}"] = this.endBlock;
        this.symbolStack = [];
        this.blockStack = [];
        this.blocking = false;
        this.originalTable = this.symbolTable;
    }
    runBlock() {
        let block = this.pop(1)[0];
        this.execute(block);
    }
    proc() {
        let [name, block] = this.pop(2);
        this.symbolTable[name] = () => this.execute(block);
    }
    repeat() {
        let [times, block] = this.pop(2);
        for (let i = 0; i < times; i++) {
            this.execute(block);
        }
        this.push(times);
    }
    startBlock() {
        this.symbolTable = this.blockTable;
        this.blocking = true;
        this.blockStack = [];
    }
    endBlock() {
        this.symbolTable = this.originalTable;
        this.blocking = false;
        this.push(this.blockStack);
    }
    push() {
        for (let i = arguments.length - 1; i >= 0; i--) {
            this.stack.push(arguments[i]);
        }
    }
    pop(n) {
        let res = [];
        for (let i = 0; i < n; i++)
            res.push(this.stack.pop());
        return res;
    }
    background() {
        let f = this.pop(1);
        background(f);
    }
    noFill() {
        push();
        noFill();
    }
    fill() {
        push();
        let f = this.pop(1);
        fill(f);
    }
    circle() {
        let [r, y, x] = this.pop(3);
        ellipse(x, y, r, r);
    }
    ellipse() {
        let [ry, rx, y, x] = this.pop(4);
        ellipse(x, y, r, r);
    }
    path() {
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
    }
    line() {
        let [y1, x1, y0, x0] = this.pop(4);
        line(x0, y0, x1, y1);
    }
    rect() {
        let [h, w, y, x] = this.pop(4);
        rect(x, y, w, h);
    }
    add() {
        let [b, a] = this.pop(2);
        this.push(parseFloat(a) + parseFloat(b));
    }
    sub() {
        let [b, a] = this.pop(2);
        this.push(parseFloat(a) - parseFloat(b));
    }
    mult() {
        let [b, a] = this.pop(2);
        this.push(parseFloat(a) * parseFloat(b));
    }
    div() {
        let [b, a] = this.pop(2);
        this.push(parseFloat(a) / parseFloat(b));
    }
    pow() {
        let [b, a] = this.pop(2);
        this.push(Math.pow(parseFloat(a), parseFloat(b)));
    }
    deg() {
        let a = this.pop(1);
        this.push(a * 180 / Math.PI);
    }
    rad() {
        let a = this.pop(1);
        this.push(a * Math.PI / 180);
    }
    pi() {
        this.push(Math.PI);
    }
    sin() {
        this.push(Math.sin(parseFloat(this.pop(1))));
    }
    cos() {
        this.push(Math.cos(parseFloat(this.pop(1))));
    }
    tan() {
        this.push(Math.tan(parseFloat(this.pop(1))));
    }
    translate() {
        let [y, x] = this.pop(2);
        push();
        translate(x,y);
    }
    rotate() {
        let r = this.pop(1);
        this.push();
        rotate(r);
    }
    popMatrix() {
        pop();
    }
    multiPopMatrix() {
        let n = this.pop(1);
        for (let i = 0; i < n; i++) {
            pop();
        }
    }
    cloneTop() {
        let a = this.pop(1);
        this.push(a); this.push(a);
    }
    scale() {
        let [y, x] = this.pop(2);
        push();
        scale(x, y);
    }
    execute(tokens) {
        tokens.forEach((token) => {
            if (token in this.symbolTable) {
                this.symbolTable[token].call(this);
            } else {
                if (this.blocking) {
                    this.blockStack.push(token);
                } else {
                    this.push(token);
                }
            }
        });
    }
}

function execute(stack, program) {
    let tokens = program.split(/\s+/);
    stack.execute(tokens);
}