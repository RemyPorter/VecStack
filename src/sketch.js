function setup() {
  createCanvas(400, 400);
  document.getElementById("runprogram").addEventListener("click", () => {
    program = document.getElementById("program").value;
  });
}

let program = document.getElementById("program").value;

function draw() {
  let vm = new StackVM();
  execute(vm, program);
}

