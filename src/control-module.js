const ControlModule = {
    "{": function () {
        let orig = this.symbolTable;
        this.set("originalTable", orig);
        this.set("blockStack", []);
        this.symbolTable = {
            "}": ControlModule["}"],
            "": function(token) { this.get("blockStack").push(token); }
        };
    },
    "}": function () {
        this.symbolTable = this.get("originalTable");
        this.push(this.get("blockStack"));
    },
    "exe": function () {
        let block = this.pop(1)[0];
        this.execute(block);
    },
    "proc": function () {
        let [name, block] = this.pop(2);
        this.definedSymbolTable[name] = () => this.execute(block);
    },
    "rep": function () {
        let [times, block] = this.pop(2);
        for (let i = 0; i < times; i++) {
            this.execute(block);
        }
        this.push(times);
    },
    "..": function () {
        let a = this.pop(1);
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