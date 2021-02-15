const ConditionalModule = {
    "gt": function() {
        let [b, a] = this.pop(2);
        this.push(a > b);
    },
    "lt": function() {
        let [b, a] = this.pop(2);
        this.push(a < b);
    },
    "eq": function() {
        let [b, a] = this.pop(2);
        this.push(a == b);
    },
    "lte": function() {
        let [b, a] = this.pop(2);
        this.push(a <= b);
    },
    "gte": function() {
        let [b, a] = this.pop(2);
        this.push(a >= b);
    },
    "if": function() {
        let [cond, iif] = this.pop(2);
        let f = false;
        if (Array.isArray(cond)) { //this is a block
            this.execute(cond); //run the block
            f = this.pop(1)[0]; //assume it puts something atop the stack
        } else { //this is just a value
            f = cond == "true" || cond == "1" || cond == true;
        }
        if (f) {
            this.execute(iif);
        }
    }
}