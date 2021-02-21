const ControlModule = {
    "exe": function () {
        let block = this.pop(1)[0];
        let container = this.createContext();
        container.execute(block);
        container.transPopAll();
    },
    "proc": function () {
        let [name, block] = this.pop(2);
        this.definedSymbolTable[name] = () => {
            let ctx = this.createContext();
            ctx.execute(block);
            ctx.transPopAll();
        }
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