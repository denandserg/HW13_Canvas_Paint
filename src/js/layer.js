let layer = new Layers();

function Layers() {
  this.add = function() {
    const canvasModule = document.getElementById('allCanvasModule');
    let canvas = this.createCanvas();
    canvasModule.appendChild(canvas);
    canvas.paintObj = new Paint(canvas, paintOptions);
    countLayer++;
    return canvas;
  };

  this.createCanvas = function () {
    let canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    canvas.id = "canvas__layer-" + countLayer;
    canvas.dataset.id = countLayer;
    canvas.width = 800;
    canvas.height = 500;
    return canvas;
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    Layers,
    layer
  };
}


