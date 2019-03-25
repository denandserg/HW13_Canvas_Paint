function initPaint() {
  addEventListeners();
}

function addEventListeners() {
  const canvasModule = document.getElementById("allCanvasModule");
  const btnBrush = document.getElementById("btnBrush");
  const canvasCoordXElem = document.getElementById("canvasCoordX");
  const canvasCoordYElem = document.getElementById("canvasCoordY");
  const rngElem = document.getElementById('size');
  const colorElem = document.getElementById("btnColor");

  canvasModule.addEventListener('mousemove', function(event) {
    if (event.target.tagName !== "canvas") return;
    canvasCoordXElem.innerHTML = event.offsetX;
    canvasCoordYElem.innerHTML = event.offsetY;
  });

  colorElem.addEventListener('input', function() {
    paintOptions.setColor(colorElem.value);
  });

  rngElem.addEventListener('input', function() {
    paintOptions.setSize(rngElem.value);
  });

  btnBrush.addEventListener('click', function() {
    paintOptions.setMode("brush");
  });
}

const paintOptions = new PaintOptions();

function PaintOptions() {
  this.fillColor = "#000000";
  this.mode = "";
  this.figure = "";
  this.size = 15;
  this.filter = "";
  this.cursor = "auto";
  this.image = "";
  this.paintings = [];

  let self = this;

  this.setSize = function(size) {
    this.size = +size;
    getFigureForCursor();
  };

  this.setColor = function(fillColor) {
    this.fillColor = fillColor;
    getFigureForCursor();
  };

  this.setMode = function(mode) {
    this.mode = mode;
    this.setCursor('auto');
  };

  this.setCursor = function(cursor) {
    self.cursor = cursor;

    self.paintings.forEach((paint) => {
      let canvas = paint.canvas;

      if (cursor === "auto") {
        canvas.style.cursor = cursor;
        return;
      }
      canvas.style.cursor = 'url(' + cursor + '), auto';
    });
  };

  this.getCursor = function(figure) {
    this.mode = "figure";
    this.figure = figure;
    getFigureForCursor();
  };

  function getFigureForCursor() {
    if (self.mode !== "figure") return;
    let cursor = document.createElement('canvas');
    let ctxCurs = cursor.getContext('2d');
    cursor.width = self.size+2;
    cursor.height = self.size+2;
    ctxCurs.strokeStyle = self.fillColor;
    getFigure(ctxCurs, self.size, self.figure, 1, 1);
    self.setCursor(cursor.toDataURL());
  }
}

function Paint(canvas, options) {
  this.canvas = canvas;
  this.options = options;
  options.paintings.push(this);
  options.setCursor(options.cursor);

  let self = this;

  canvas.addEventListener('mousedown', function(event) {
    self.mouseMoveHandler(event);
    self.drawFigure(event);
  });

  this.clear = function(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  this.drawFigure = function(event) {
    if (self.options.mode !== "figure") return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = self.options.fillColor;
    ctx.fillStyle = self.options.fillColor;
    ctx.filter = self.options.filter;
    getFigure(ctx, self.options.size, self.options.figure, event.offsetX, event.offsetY);
  };

  this.mouseMoveHandler = function(event) {
    if (self.options.mode !== "brush") return;
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = self.options.fillColor;
      ctx.filter = paintOptions.filter;
      canvas.onmousemove = function(event) {
        ctx.fillRect(event.offsetX - self.options.size / 2, event.offsetY - self.options.size / 2, self.options.size, self.options.size);
      };
      canvas.onmouseup = function() {
        canvas.onmousemove = null;
      }
    }
  }
}

function getFigure(ctx, size, figure, x, y) {

  let side = Math.sqrt(Math.pow(size / 2, 2) - Math.pow(size / 4, 2));

  switch (figure) {
    case "circle":
      ctx.beginPath();
      ctx.lineWidth = paintOptions.size/3;
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 13 * Math.PI / 2);
      ctx.stroke();
      ctx.lineWidth = 1;
      break;
    case "square":
      ctx.beginPath();
      ctx.strokeRect(x, y, size, size);
      break;
    case "hexagon":
      ctx.beginPath();
      ctx.moveTo(x + size / 4, y - side  + size / 2);
      ctx.lineTo(x, y + size / 2);
      ctx.lineTo(x + size / 4, y + side  + size / 2);
      ctx.lineTo(x + size / 4 + size / 2, y + side  + size / 2);
      ctx.lineTo(x + size, y  + size / 2);
      ctx.lineTo(x + size / 4 + size / 2, y - side  + size / 2);
      ctx.lineTo(x + size / 4, y - side  + size / 2);
      ctx.stroke();
      break;
  }
  return ctx;
}

if (typeof module !== 'undefined') {
  module.exports = {
    Paint,
    PaintOptions,
    getFigure,
    initPaint
  };
}