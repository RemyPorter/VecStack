let needsRedraw = true;
function setup() {
  createCanvas(400, 400);
  document.getElementById("runprogram").addEventListener("click", () => {
    program = document.getElementById("program").value;
    needsRedraw = true;    
  });
}

let program = document.getElementById("program").value;

inject(Runtime, DrawingModule);
inject(Runtime, StateModule);
inject(Runtime, MathModule);
inject(Runtime, ControlModule);
/*inject(vm, ConditionalModule);
inject(vm, TextModule);*/
let vm = new Runtime();


function draw() {
  if (needsRedraw) {
    clear();
    vm.clearDefines();
    let tokens;
    try {
      tokens = parser.parse(" " + program.trim())
      vm.execute(tokens);
    } catch (ex) {
      console.log(ex.message);
    }
    needsRedraw = false;
  }
}

