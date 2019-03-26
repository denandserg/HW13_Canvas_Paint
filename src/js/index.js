window.onload = () => {
  initViewController();
  initPaint();
};

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

if (typeof module !== 'undefined') {
  module.exports = {
    countLayer
  };
}

