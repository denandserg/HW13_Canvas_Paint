const btnBrush = document.getElementById("btnBrush");
const btnBlur = document.getElementById("btnBlur");
const btnAddLayer = document.getElementById("btnLayerAdd");
const btnSquare = document.getElementById("btnSquare");
const btnHexagon = document.getElementById("btnHexagon");
const btnCircle = document.getElementById("btnCircle");
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
btnSquare.addEventListener("click", changeActive);
btnCircle.addEventListener("click", changeActive);
btnHexagon.addEventListener("click", changeActive);

function changeActiveTools() {
  const allBtnFigure = document.querySelectorAll(".figures__btn");
  allBtnFigure.forEach(btn => {
    btn.dataset.flag = "off";
    btn.classList.remove("button-wrapper__btn--active");
    btnBrush.dataset.flag = "off";
    btnBrush.classList.remove("button-wrapper__btn--active");
  });
}

function changeActive (e) {
  changeActiveTools(e);
  if (e.target.dataset.flag === "off") {
    e.target.dataset.flag = "on";
    e.target.classList.add("button-wrapper__btn--active");
  } else {
    e.target.dataset.flag = "off";
    e.target.classList.remove("button-wrapper__btn--active");
  }
}

function getCurrentLayer(event) {
  currentActiveLayer = +event.target.id;
  myCanvas.getLayer(currentActiveLayer);
}


function changeActiveBrush(e) {
  changeActiveTools(e);
  if (btnBrush.dataset.flag === "off") {
    btnBrush.dataset.flag = "on";
    btnBrush.classList.add("button-wrapper__btn--active");
  } else {
    btnBrush.dataset.flag = "off";
    btnBrush.classList.toggle("button-wrapper__btn--active");
  }
}

function changeActiveBlur() {
  if (btnBlur.dataset.flag === "off") {
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
    ctx.strokeStyle = btnColor.value;
    ctx.lineWidth = size.value;
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  };
  myCanvas.render();
}

