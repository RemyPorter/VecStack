function inject(runtime, langDef) {
    Object.keys(langDef).forEach((k) => {
        if (k in runtime.symbolTable) throw "Symbol already used for a word";
        runtime.symbolTable[k] = langDef[k];
    });
}

class Runtime {
    constructor() {
        this.stack = [];
        this.symbolTable = {
            "": (token) => this.push(token)
        };
        this.definedSymbolTable = {};
        this.stateBag = {};
    }
    get(key) {
        return this.stateBag[key];
    }
    set(key, value) {
        this.stateBag[key] = value;
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
            if (token in this.symbolTable) {
                this.symbolTable[token].call(this);
            } else if (token in this.definedSymbolTable) {
                this.definedSymbolTable[token].call(this);
            }else {
                this.symbolTable[""].call(this, token);
            }
        });
    }
    clearDefines() {
        this.definedSymbolTable = {};
    }
}

function execute(runtime, program) {
    let tokens = program.replace(/\/\*.*?\*\//, "").split(/\s+/);
    runtime.execute(tokens);
}