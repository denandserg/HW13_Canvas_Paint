const btnBrush = document.getElementById("btnBrush");
const btnBlur = document.getElementById("btnBlur");
const btnAddLayer = document.getElementById("btnLayerAdd");
const btnSquare = document.getElementById("btnSquare");
const btnHexagon = document.getElementById("btnHexagon");
const btnCircle = document.getElementById("btnCircle");
const divLayers = document.getElementById("layers");

let btnDel;
let radios;
let countLayer = 0;

function initViewController() {
  const viewController = new ViewController();
  btnBrush.addEventListener("click", viewController.changeActiveBrush);
  btnBlur.addEventListener("click", viewController.changeActiveBlur);
  btnAddLayer.addEventListener("click", viewController.addLayerCanvas);
  btnSquare.addEventListener("click", viewController.changeActiveFigure);
  btnCircle.addEventListener("click", viewController.changeActiveFigure);
  btnHexagon.addEventListener("click", viewController.changeActiveFigure);
}

function ViewController () {
  let that = this;
  this.changeOffTools = function () {
    const allBtnFigure = document.querySelectorAll(".figures__btn");
    allBtnFigure.forEach(btn => {
      btn.dataset.flag = "off";
      btn.classList.remove("button-wrapper__btn--active");
      btnBrush.dataset.flag = "off";
      btnBrush.classList.remove("button-wrapper__btn--active");
    });
  };

  this.changeActiveFigure = function (e) {
    that.changeOffTools();
    if (e.target.dataset.flag === "off") {
      e.target.dataset.flag = "on";
      e.target.classList.add("button-wrapper__btn--active");
      paintOptions.setMode("figure");
      paintOptions.getCursor(e.target.dataset.id);
    } else {
      e.target.dataset.flag = "off";
      e.target.classList.remove("button-wrapper__btn--active");
    }
  };

  this.changeActiveBrush = function (e) {
    that.changeOffTools();
    if (btnBrush.dataset.flag === "off") {
      btnBrush.dataset.flag = "on";
      btnBrush.classList.add("button-wrapper__btn--active");
      paintOptions.figure = '';
    } else {
      btnBrush.dataset.flag = "off";
      btnBrush.classList.toggle("button-wrapper__btn--active");
    }
  };

  this.changeActiveBlur = function () {
    if (btnBlur.dataset.flag === "off") {
      btnBlur.dataset.flag = "on";
      btnBlur.classList.add("button-wrapper__btn--active");
      paintOptions.filter = 'blur(2px)';

    } else {
      btnBlur.dataset.flag = "off";
      btnBlur.classList.toggle("button-wrapper__btn--active");
      paintOptions.filter = 'none';
    }
  };

  this.addLayerCanvas = function() {
    that.addCurrentLayerCanvasButton();
    radios = document.querySelectorAll('input[type=radio][name="radioLayer"]');
    btnDel = document.querySelectorAll(".current-button-delete-layer");
    const currentCanvas = layer.add();
    radios.forEach(el => {
      el.addEventListener("click", that.getCurrentLayerCanvas);
    });
    btnDel.forEach(el => {
      el.addEventListener("click", that.deleteCurrentLayerCanvas);
    });
    return currentCanvas;
  };

  this.deleteCurrentLayerCanvas = function (e) {
    const allCanvas = document.querySelectorAll(".canvas");
    const allLayers = document.querySelectorAll(".layers__curLayer");
    allCanvas.forEach(el=>{
      if(e.target.value === el.dataset.id) {
        el.remove();
      }
    });
    allLayers.forEach(el=>{
      if(e.target.value === el.dataset.flag) {
        el.remove();
      }
    });
    countLayer--;
  };

  this.getCurrentLayerCanvas = function (e) {
    const allCanvas = document.querySelectorAll(".canvas");
    allCanvas.forEach(el=>{
      el.classList.remove('active');
      if(e.target.id === el.dataset.id) {
        el.classList.add("active");
      }
    });
  };

  this.addCurrentLayerCanvasButton = function () {
    const curAddLayer = document.createElement("div");
    const curLabel = document.createElement("label");
    const curInputRadio = document.createElement("input");
    const curLabelNameLayer = document.createElement("label");
    const curButtonDelLayer = document.createElement("button");
    curAddLayer.dataset.flag = countLayer;
    curInputRadio.type = "radio";
    curInputRadio.name = "radioLayer";
    curInputRadio.checked = false;
    curInputRadio.id = countLayer;
    curLabelNameLayer.innerHTML = 'Canvas layer';
    curLabelNameLayer.setAttribute('for', countLayer);
    curLabelNameLayer.dataset.lang = 'Canvas layer';
    curLabel.innerHTML = countLayer;
    curAddLayer.classList.add("layers__curLayer");
    curButtonDelLayer.classList.add("current-button-delete-layer");
    curButtonDelLayer.value = countLayer;
    curAddLayer.appendChild(curLabel);
    curAddLayer.appendChild(curInputRadio);
    curAddLayer.appendChild(curLabelNameLayer);
    curAddLayer.appendChild(curButtonDelLayer);
    divLayers.appendChild(curAddLayer);
  };
}

if (typeof module !== 'undefined') {
  module.exports = {
    initViewController,
    ViewController
  };
}
