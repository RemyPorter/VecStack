let needsRedraw = true;
function setup() {
  createCanvas(400, 400);
  document.getElementById("runprogram").addEventListener("click", () => {
    program = document.getElementById("program").value;
    needsRedraw = true;
  });
}

let program = document.getElementById("program").value;

let vm = new Runtime();
inject(vm, DrawingModule);
inject(vm, StateModule);
inject(vm, MathModule);
inject(vm, ControlModule);
inject(vm, ConditionalModule);


function draw() {
  if (needsRedraw) {
    clear();
    vm.clearDefines();
    execute(vm, program);
    needsRedraw = false;
  }
}

