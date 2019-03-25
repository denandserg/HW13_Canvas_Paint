const activeTab = {id:1};
let layer = new Layers();
let canvasPaint;

function Layers() {
  this.add = function(layerElem, id) {
    const tab1 = document.getElementById('tab-1');
    const allLayers = document.querySelectorAll(".layer");
    const allCanvases = document.querySelectorAll(".canvas");
    let count = this.getId(id, allLayers);
    let canvas = createCanvas(activeTab.id, countLayer);
    this.makeActive(canvas, allCanvases);
    tab1.appendChild(canvas);
    canvas.paintObj = new Paint(canvas, paintOptions);
    canvasPaint = canvas.paintObj;
    countLayer++;
    return canvas;
  };

  this.getId = function(id, allLayers) {
    let count;
    if (id === undefined) {
      if (allLayers.length === 0) {
        count = 1;
      }
      else {
        count = allLayers[allLayers.length - 1].dataset.id;
        count++;
      }
    }
    else {
      count = id;
    }
    return count;
  };

  this.makeActive = function(elem, collection) {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove("active");
    }
    elem.classList.add("active");
  };

  function createCanvas(id, count) {
    let canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    canvas.id = "canvas-" + id + "__layer-" + count;
    canvas.dataset.id = count;
    canvas.dataset.tabId = id;
    canvas.width = 800;
    canvas.height = 500;
    return canvas;
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    Layers,
    layer,
    canvasPaint
  };
}


