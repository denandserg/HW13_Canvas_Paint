const btnBrush = document.getElementById("btnBrush");
const btnBlur = document.getElementById("btnBlur");
const btnAddLayer = document.getElementById("btnLayerAdd");
const divLayers = document.getElementById("layers");
const canvasAll = document.getElementById('paint');
const btnColor = document.getElementById('btnColor');
const size = document.getElementById('size');
let btnDel;
let radios;
let countLayer = 0;
let currentActiveLayer = 0;
const nameLayer = [
  { key: 0, value: "Background layer" },
  { key: 1, value: "First layer" },
  { key: 2, value: "Second layer" },
  { key: 3, value: "Third layer" }
];

const myCanvas = new LayeredCanvas("paint");
const mouse = {
  x: 0,
  y: 0
};
const mouseStart = {
  x: 0,
  y: 0
};

let draw = false;

function drawMove(e) {
  if (draw === true) {

    drawOnCurrentLayer(e);
  }
}

function drawFalse() {
  draw = false;
}

function drawTrue(e) {
  draw = true;
  mouseStart.x = e.pageX - canvasAll.offsetLeft;
  mouseStart.y = e.pageY - canvasAll.offsetTop;
}

myCanvas.canvas.addEventListener("mousedown", drawTrue);
myCanvas.canvas.addEventListener("mousemove", drawMove);
myCanvas.canvas.addEventListener("mouseup", drawFalse);
btnBrush.addEventListener("click", changeActiveBrush);
btnBlur.addEventListener("click", changeActiveBlur);
btnAddLayer.addEventListener("click", addLayer);

function getCurrentLayer(event) {
  currentActiveLayer = +event.target.id;
  myCanvas.getLayer(currentActiveLayer);
}

function changeActiveBrush() {
  if (btnBrush.dataset.flag === "off") {
    console.log(btnBrush);
    btnBrush.dataset.flag = "on";
    btnBrush.classList.add("button-wrapper__btn--active");
  } else {
    btnBrush.dataset.flag = "off";
    btnBrush.classList.toggle("button-wrapper__btn--active");
  }
}

function changeActiveBlur() {
  if (btnBlur.dataset.flag === "off") {
    console.log(btnBrush);
    btnBlur.dataset.flag = "on";
    btnBlur.classList.add("button-wrapper__btn--active");
  } else {
    btnBlur.dataset.flag = "off";
    btnBlur.classList.toggle("button-wrapper__btn--active");
  }
}

function LayeredCanvas(id) {
  this.layers = [];

  const extend = function(defaults, options) {
    let extended = {},
      prop;
    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop))
        extended[prop] = defaults[prop];
    }
    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop))
        extended[prop] = options[prop];
    }
    return extended;
  };

  this.addLayer = function(obj) {
    const layer = extend(
      {
        id: Math.random()
          .toString(36)
          .substr(2, 5),
        show: true,
        render: function(canvas, ctx) {}
      },
      obj
    );

    if (this.getLayer(layer.id) !== false) {
      console.log("Layer already exists");
      console.log(obj);
      return false;
    }

    this.layers.push(layer);
    return this;
  };

  this.getLayer = function(id) {
    const length = this.layers.length;
    for (let i = 0; i < length; i++) {
      if (this.layers[i].id === id) return this.layers[i];
    }
    return false;
  };

  this.removeLayer = function(id) {
    const length = this.layers.length;
    for (let i = 0; i < length; i++) {
      if (this.layers[i].id === id) {
        const removed = this.layers[i];
        this.layers.splice(i, 1);
        return removed;
      }
    }
    return false;
  };

  this.render = function() {
    const canvas = this.canvas;
    const ctx = this.ctx2d;
    this.layers.forEach(function(item, index, array) {
      if (item.show) item.render(canvas, ctx);
    });
  };

  this.canvas = document.getElementById(id);
  this.ctx2d = this.canvas.getContext("2d");
}



function addLayer() {
  addCurrentLayerButton(countLayer, nameLayer);
  radios = document.querySelectorAll('input[type=radio][name="radioLayer"]');
  btnDel = document.querySelectorAll(".current-button-delete-layer");
  myCanvas.addLayer({
    id: countLayer++,
    render: function(canvas, ctx) {
      if (countLayer===0) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  });
  myCanvas.render();
  radios.forEach(el => {
    el.addEventListener("click", getCurrentLayer);
  });
  btnDel.forEach(el => {
    el.addEventListener("click", deleteCurrentLayer);
  });
}

function deleteCurrentLayer(e) {
  const curLayers = document.getElementsByClassName("layers__curLayer");
  for (let i = 0; i < curLayers.length; i++) {
    if (curLayers[i].dataset.flag === e.target.value) {
      divLayers.removeChild(curLayers[i]);
    }
  }
  myCanvas.removeLayer(+e.target.value);
  countLayer--;
  myCanvas.render();
}

function addCurrentLayerButton(count, arrName) {
  const curAddLayer = document.createElement("div");
  const curLabel = document.createElement("label");
  const curInputRadio = document.createElement("input");
  const curLabelNameLayer = document.createElement("label");
  const curButtonDelLayer = document.createElement("button");
  curAddLayer.dataset.flag = count;
  curInputRadio.type = "radio";
  curInputRadio.name = "radioLayer";
  if (count === 0) {
    curInputRadio.checked = true;
    curInputRadio.id = count;
    curLabelNameLayer.innerHTML = arrName[0].value;
  } else {
    curInputRadio.checked = false;
    curInputRadio.id = count;
    curLabelNameLayer.innerHTML = arrName[count].value;
  }
  curLabel.innerHTML = count;
  curAddLayer.classList.add("layers__curLayer");
  curButtonDelLayer.classList.add("current-button-delete-layer");
  curButtonDelLayer.innerHTML = "Del";
  curButtonDelLayer.value = count;
  curAddLayer.appendChild(curLabel);
  curAddLayer.appendChild(curInputRadio);
  curAddLayer.appendChild(curLabelNameLayer);
  curAddLayer.appendChild(curButtonDelLayer);
  divLayers.appendChild(curAddLayer);
}

function drawOnCurrentLayer (e) {
  const currentLayer = myCanvas.getLayer(currentActiveLayer);
  mouse.x = e.pageX - canvasAll.offsetLeft;
  mouse.y = e.pageY - canvasAll.offsetTop;
  currentLayer.render = function (canvas, ctx) {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    ctx.strokeStyle = btnColor.value;
    ctx.lineWidth = size.value;
    ctx.lineTo(mouse.x, mouse.y);
    ctx.closePath();
    ctx.stroke();
  };
  myCanvas.render();
  console.log(currentLayer);
}

myCanvas
  .addLayer({
    id: "0",
    render: function(canvas, ctx) {

    }
  })
  .addLayer({
    id: "1",
    render: function(canvas, ctx) {


      ctx.fillStyle = "#BDD358";
      ctx.fillRect(350, 75, 150, 150);

      ctx.fillStyle = "#E5625E";
      ctx.fillRect(50, 250, 100, 250);
    }
  })
  .addLayer({
    id: "2",
    render: function(canvas, ctx) {
      ctx.fillStyle = "#558B6E";
      ctx.beginPath();
      ctx.arc(75, 75, 80, 0, 2 * Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "#88A09E";
      ctx.arc(275, 275, 150, 0, 2 * Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "#704C5E";
      ctx.arc(450, 450, 50, 0, 2 * Math.PI);
      ctx.fill();
    }
  })
  .addLayer({
    id: "3",
    render: function(canvas, ctx) {
      ctx.fillStyle = "#DAF7A6";
      ctx.beginPath();
      ctx.moveTo(120, 400);
      ctx.lineTo(250, 300);
      ctx.lineTo(300, 500);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#FFC300";
      ctx.beginPath();
      ctx.moveTo(400, 100);
      ctx.lineTo(350, 300);
      ctx.lineTo(230, 200);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#C70039";
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(100, 300);
      ctx.lineTo(300, 300);
      ctx.closePath();
      ctx.fill();
    }
  });

myCanvas.render();
