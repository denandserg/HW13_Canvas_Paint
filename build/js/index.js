"use strict";

var btnBrush = document.getElementById("btnBrush");
var btnBlur = document.getElementById("btnBlur");
var btnAddLayer = document.getElementById("btnLayerAdd");
var divLayers = document.getElementById("layers");
var btnDel;
var radios;
var countLayer = 0;
var nameLayer = [{
  key: 0,
  value: "Background layer"
}, {
  key: 1,
  value: "First layer"
}, {
  key: 2,
  value: "Second layer"
}, {
  key: 3,
  value: "Third layer"
}];
btnBrush.addEventListener("click", changeActiveBrush);
btnBlur.addEventListener("click", changeActiveBlur);
btnAddLayer.addEventListener("click", addLayer);

function getCurrentLayer(event) {
  console.log(event.target);
  myCanvas.getLayer(+event.target.id);
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

  var extend = function extend(defaults, options) {
    var extended = {},
        prop;

    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) extended[prop] = defaults[prop];
    }

    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) extended[prop] = options[prop];
    }

    return extended;
  };

  this.addLayer = function (obj) {
    var layer = extend({
      id: Math.random().toString(36).substr(2, 5),
      show: true,
      render: function render(canvas, ctx) {}
    }, obj);

    if (this.getLayer(layer.id) !== false) {
      console.log("Layer already exists");
      console.log(obj);
      return false;
    }

    this.layers.push(layer);
    return this;
  };

  this.getLayer = function (id) {
    var length = this.layers.length;

    for (var i = 0; i < length; i++) {
      if (this.layers[i].id === id) return this.layers[i];
    }

    return false;
  };

  this.removeLayer = function (id) {
    var length = this.layers.length;

    for (var i = 0; i < length; i++) {
      if (this.layers[i].id === id) {
        var removed = this.layers[i];
        this.layers.splice(i, 1);
        return removed;
      }
    }

    return false;
  };

  this.render = function () {
    var canvas = this.canvas;
    var ctx = this.ctx2d;
    this.layers.forEach(function (item, index, array) {
      if (item.show) item.render(canvas, ctx);
    });
  };

  this.canvas = document.getElementById(id);
  this.ctx2d = this.canvas.getContext("2d");
}

function addLayer() {
  addCurrentLayerButton(countLayer, nameLayer);
  radios = document.querySelectorAll('input[type=radio][name="radioLayer"]');
  btnDel = document.querySelectorAll('.current-button-delete-layer');
  myCanvas.addLayer({
    id: countLayer++,
    render: function render(canvas, ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  });
  myCanvas.render();
  radios.forEach(function (el) {
    el.addEventListener('click', getCurrentLayer);
  });
  btnDel.forEach(function (el) {
    el.addEventListener('click', deleteCurrentLayer);
  });
}

function deleteCurrentLayer(e) {
  var curLayers = document.getElementsByClassName('layers__curLayer');

  for (var i = 0; i < curLayers.length; i++) {
    if (curLayers[i].dataset.flag === e.target.value) {
      divLayers.removeChild(curLayers[i]);
    }
  }

  myCanvas.removeLayer(+e.target.value);
}

function addCurrentLayerButton(count, arrName) {
  var curAddLayer = document.createElement('div');
  var curLabel = document.createElement('label');
  var curInputRadio = document.createElement('input');
  var curLabelNameLayer = document.createElement('label');
  var curButtonDelLayer = document.createElement('button');
  curAddLayer.dataset.flag = count;
  curInputRadio.type = 'radio';
  curInputRadio.name = 'radioLayer';

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
  curAddLayer.classList.add('layers__curLayer');
  curButtonDelLayer.classList.add('current-button-delete-layer');
  curButtonDelLayer.innerHTML = 'Del';
  curButtonDelLayer.value = count;
  curAddLayer.appendChild(curLabel);
  curAddLayer.appendChild(curInputRadio);
  curAddLayer.appendChild(curLabelNameLayer);
  curAddLayer.appendChild(curButtonDelLayer);
  divLayers.appendChild(curAddLayer);
}

var myCanvas = new LayeredCanvas("paint"); // myCanvas
//   .addLayer({
//     id: "background",
//     render: function(canvas, ctx) {
//       ctx.fillStyle = "black";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//     }
//   })
//   .addLayer({
//     id: "squares",
//     render: function(canvas, ctx) {
//       ctx.fillStyle = "#E5E059";
//       ctx.fillRect(50, 50, 150, 150);
//
//       ctx.fillStyle = "#BDD358";
//       ctx.fillRect(350, 75, 150, 150);
//
//       ctx.fillStyle = "#E5625E";
//       ctx.fillRect(50, 250, 100, 250);
//     }
//   })
//   .addLayer({
//     id: "circles",
//     render: function(canvas, ctx) {
//       ctx.fillStyle = "#558B6E";
//       ctx.beginPath();
//       ctx.arc(75, 75, 80, 0, 2 * Math.PI);
//       ctx.fill();
//
//       ctx.beginPath();
//       ctx.fillStyle = "#88A09E";
//       ctx.arc(275, 275, 150, 0, 2 * Math.PI);
//       ctx.fill();
//
//       ctx.beginPath();
//       ctx.fillStyle = "#704C5E";
//       ctx.arc(450, 450, 50, 0, 2 * Math.PI);
//       ctx.fill();
//     }
//   })
//   .addLayer({
//     id: "triangles",
//     render: function(canvas, ctx) {
//       ctx.fillStyle = "#DAF7A6";
//       ctx.beginPath();
//       ctx.moveTo(120, 400);
//       ctx.lineTo(250, 300);
//       ctx.lineTo(300, 500);
//       ctx.closePath();
//       ctx.fill();
//
//       ctx.fillStyle = "#FFC300";
//       ctx.beginPath();
//       ctx.moveTo(400, 100);
//       ctx.lineTo(350, 300);
//       ctx.lineTo(230, 200);
//       ctx.closePath();
//       ctx.fill();
//
//       ctx.fillStyle = "#C70039";
//       ctx.beginPath();
//       ctx.moveTo(100, 100);
//       ctx.lineTo(100, 300);
//       ctx.lineTo(300, 300);
//       ctx.closePath();
//       ctx.fill();
//     }
//   });
//
// myCanvas.render();