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
            "tr": this.translate,
            "p": this.popMatrix,
            "pp": this.multiPopMatrix,
            "..": this.cloneTop,
            "sc": this.scale,
            "rt": this.rotate,
            "nf": this.noFill,
            "f": this.fill,
            "bg": this.background
        };
        this.defineTable = {};
        Object.keys(this.symbolTable).forEach((k) => {
            this.defineTable[k] = () => this.symbolStack.push(k);
        });
        this.symbolTable[":"] = this.startDefine;
        this.defineTable[";"] = this.endDefine;
        this.symbolStack = [];
        this.defining = false;
        this.originalTable = this.symbolTable;
    }
    startDefine() {
        this.symbolTable = this.defineTable;
        this.defining = true;
    }
    endDefine() {
        this.symbolTable = this.originalTable;
        let [symbol, ...stack] = this.symbolStack;
        this.symbolTable[symbol] = () => this.execute(stack);
        this.symbolStack = [];
        this.defining = false;
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
                if (this.defining) {
                    this.symbolStack.push(token);
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