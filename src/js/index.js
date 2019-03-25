window.onload = () => {
  init();
  initPaint();
};

const btnBrush = document.getElementById("btnBrush");
const btnBlur = document.getElementById("btnBlur");
const btnAddLayer = document.getElementById("btnLayerAdd");
const btnSquare = document.getElementById("btnSquare");
const btnHexagon = document.getElementById("btnHexagon");
const btnCircle = document.getElementById("btnCircle");
const divLayers = document.getElementById("layers");
const size = document.getElementById('size');

let btnDel;
let radios;
let countLayer = 0;

function init() {
  btnBrush.addEventListener("click", changeActiveBrush);
  btnBlur.addEventListener("click", changeActiveBlur);
  btnAddLayer.addEventListener("click", addLayer);
  btnSquare.addEventListener("click", changeActiveFigure);
  btnCircle.addEventListener("click", changeActiveFigure);
  btnHexagon.addEventListener("click", changeActiveFigure);
}

function changeOffTools() {
  const allBtnFigure = document.querySelectorAll(".figures__btn");
  allBtnFigure.forEach(btn => {
    btn.dataset.flag = "off";
    btn.classList.remove("button-wrapper__btn--active");
    btnBrush.dataset.flag = "off";
    btnBrush.classList.remove("button-wrapper__btn--active");
  });
}

function changeActiveFigure(e) {
  changeOffTools(e);
  if (e.target.dataset.flag === "off") {
    e.target.dataset.flag = "on";
    e.target.classList.add("button-wrapper__btn--active");
    paintOptions.setMode("figure");
    paintOptions.getCursor(e.target.dataset.id);
  } else {
    e.target.dataset.flag = "off";
    e.target.classList.remove("button-wrapper__btn--active");
  }
}

function changeActiveBrush(e) {
  changeOffTools(e);
  if (btnBrush.dataset.flag === "off") {
    btnBrush.dataset.flag = "on";
    btnBrush.classList.add("button-wrapper__btn--active");
    paintOptions.figure = '';
  } else {
    btnBrush.dataset.flag = "off";
    btnBrush.classList.toggle("button-wrapper__btn--active");
  }
}

function changeActiveBlur() {
  if (btnBlur.dataset.flag === "off") {
    btnBlur.dataset.flag = "on";
    btnBlur.classList.add("button-wrapper__btn--active");
    paintOptions.filter = 'blur(2px)';

  } else {
    btnBlur.dataset.flag = "off";
    btnBlur.classList.toggle("button-wrapper__btn--active");
    paintOptions.filter = 'none';
  }
}

function addLayer() {
  addCurrentLayerButton(countLayer);
  radios = document.querySelectorAll('input[type=radio][name="radioLayer"]');
  btnDel = document.querySelectorAll(".current-button-delete-layer");
  const tabContentActiveElem = document.querySelector(".layers");
  let newCanvas = layer.add(tabContentActiveElem);
  radios.forEach(el => {
    el.addEventListener("click", getCurrentLayer);
  });
  btnDel.forEach(el => {
    el.addEventListener("click", deleteCurrentLayer);
  });
}

function deleteCurrentLayer(e) {
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
}

function getCurrentLayer(e) {
  const allCanvas = document.querySelectorAll(".canvas");
  allCanvas.forEach(el=>{
    el.classList.remove('active');
    if(e.target.id === el.dataset.id) {
      el.classList.add("active");
    }
  });
}

function addCurrentLayerButton(count) {
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
    // curInputRadio.id = count;
    // curLabelNameLayer.innerHTML = 'Canvas layer';
  } else {
    curInputRadio.checked = false;
  }
  curInputRadio.id = count;
  curLabelNameLayer.innerHTML = 'Canvas layer';
  curLabelNameLayer.dataset.lang = 'Canvas layer';
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

