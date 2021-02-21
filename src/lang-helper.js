function inject(runtime, langDef) {
    let original = runtime.prototype.buildWords;
    runtime.prototype.buildWords = function() {
        Object.keys(langDef).forEach((k) => {
            if (k in this.symbolTable) throw "Symbol already used for a word";
            this.symbolTable[k] = langDef[k];
        });
        if (original) original.call(this);
    }
}

class Runtime {
    constructor() {
        this.stack = [];
        this.symbolTable = {
            "": (token) => this.push(token)
        };
        this.definedSymbolTable = {};
        this.stateBag = {
            "transformLevel": 0
        };
        this.buildWords();
    }
    get(key) {
        return this.stateBag[key];
    }
    set(key, value) {
        this.stateBag[key] = value;
    }
    transPush() {
        this.stateBag.transformLevel++;
        push();
    }
    transPop() {
        if (this.stateBag.transformLevel > 0) {
            pop();
            this.stateBag.transformLevel--;
            return true;
        }
        return false;
    }
    transPopAll() {
        while (this.transPop());
    }
    pop(n) {
        let res = [];
        for (let i = 0; i < n; i++) {
            res.push(this.stack.pop());
        }
        return res;
    }
    push() {
        for (let i = arguments.length - 1; i >= 0; i--) {
            this.stack.push(arguments[i]);
        }
    }
    execute(tokens) {
        tokens.forEach((token) => {
            let [type, symbol] = token;
            if (["num", "str", "block"].includes(type)) {
                this.push(symbol);
            } else if (type == "word") {
                if (symbol in this.symbolTable) {
                    this.symbolTable[symbol].call(this);
                } else if (symbol in this.definedSymbolTable) {
                    this.definedSymbolTable[symbol].call(this);
                } else {
                    this.push(symbol);
                }
            }
        });
    }
    clearDefines() {
        this.definedSymbolTable = {};
    }
    createContext() {
        let ctx = new Runtime();
        ctx.definedSymbolTable = {...this.definedSymbolTable};
        return ctx;
    }
}

function execute(runtime, program) {
    let tokens = program.replace(/\/\*.*?\*\//, "").split(/\s+/);
    runtime.execute(tokens);
}