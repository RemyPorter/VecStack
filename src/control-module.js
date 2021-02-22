const ControlModule = {
    "exe": function () {
        let block = this.pop(1)[0];
        this.execute(block);
    },
    "proc": function () {
        let [name, block] = this.pop(2);
        this.definedSymbolTable[name] = () => {
            this.execute(block);
        }
    },
    "rep": function () {
        let [times, block] = this.pop(2);
        for (let i = 0; i < times; i++) {
            this.execute(block);
        }
        this.push(times);
    },
    "for": function() {
        let [cond, inc, block] = this.pop(3);
        let [i] = this.pop(1);
        this.push(i);
        this.execute(cond);
        let [c] = this.pop(1);
        while (c == "true" || c == true || c == 1 || c == "1") {
            this.push(i);
            this.execute(block);
            this.push(i);
            this.execute(inc);
            [i] = this.pop(1);
            this.push(i);
            this.execute(cond);
            [c] = this.pop(1);
        }
    },
    "while": function() {
        let [block, c] = this.pop(2);
        while (c == "true" || c == true || c == 1 || c == "1") {
            this.execute(block);
            [c] = this.pop(1);
        }
    },
    "..": function () {
        let [a] = this.pop(1);
        this.push(a); this.push(a);
    },
    "<>": function () {
        let [b, a] = this.pop(2);
        this.push(a, b);
    },
    "--": function() { this.pop(1); },
    "d-": function() {
        let n = parseInt(this.pop(1)[0]);
        this.pop(n);
    },
    "print": function() {
        console.log({
            stack: this.stack,
            symbolTable: this.symbolTable,
            definedSymbols: this.definedSymbolTable
        });
    }
}