const activeTab = {id:1};
let layer = new Layers();


function initLayers() {
  const tabContentsElem = document.querySelector("#tab-1");

  tabContentsElem.addEventListener("click", function() {
    let target = event.target;
    if(target.closest('.add-layer')) {
      const tabContentActiveElem = document.querySelector(".layers");
      const layerElem = tabContentActiveElem.querySelector(".layers");
      let newCanvas = layer.add(tabContentActiveElem, layerElem);
      return;
    }
    if(target.closest('.layer__delete')) {
      layer.delete(target.closest('.layer__delete').parentElement, tabContentsElem);
      return;
    }
    if(target.closest('.layer') && !target.closest('.layer__delete')) {
      const tabContentActiveElem = document.querySelector(".tabcontent.active");
      const allLayers = tabContentActiveElem.querySelectorAll(".layer");
      const arrayOfCanvas = tabContentActiveElem.querySelectorAll(".canvas");
      let activeTabId = tabContentActiveElem.id;
      let activeLayerId = target.closest('.layer').dataset.id;
      let canvasId = "canvas-" + activeTabId + "__layer-" + activeLayerId;
      const activeCanvas = document.getElementById(canvasId);

      for (let i = 0; i < arrayOfCanvas.length; i++) {
        arrayOfCanvas[i].classList.remove("active");
      }
      activeCanvas.classList.add("active");
      for (let i = 0; i < allLayers.length; i++) {
        allLayers[i].classList.remove("active");
      }
      target.closest('.layer').classList.add("active");
      return;
    }
  });
}

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

  this.delete = function(layerElem, tabContentsElem) {
    const activeTabContent = tabContentsElem.querySelector(".tabcontent.active");
    const layerBlock = document.querySelector(".layers-block__layers");
    deleteCanvas(layerElem.dataset.id, activeTabContent);
    layerElem.remove();
    if (!layerBlock.lastChild) return;
    layerBlock.lastChild.classList.add("active");
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
/////////////////////////////////////////////////////////
  function deleteCanvas(id, activeTabContent) {
    const canvasId = "canvas-" + activeTab.id + "__layer-" + 1;
    document.getElementById(canvasId).remove();
    activeTabContent.lastChild.classList.add("active");
  }
}

function initPaint() {
  addEventListeners();
}

function addEventListeners() {
  const tabContentsElem = document.getElementById("tab-1");
  let canvasCoordXElem = document.getElementById("canvasCoordX");
  let canvasCoordYElem = document.getElementById("canvasCoordY");
  let rngElem = document.getElementById('size');
  let colorElem = document.getElementById("btnColor");

  // function getActiveCanvas() {
  //   return tabContentsElem.querySelector(".tabcontent.active canvas.active");
  // }

  // function getActiveTab() {
  //   return tabContentsElem.querySelector(".tabcontent.active");
  // }

  tabContentsElem.addEventListener('mousemove', function(event) {
    if (event.target.tagName !== "CANVAS") return;
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

function getLayers(array) {
  let arrayOfLayers = [];
  for (let i = 0; i < array.length; i++) {
    let layer = {
      id: array[i].dataset.id,
      image: array[i].toDataURL(),
    };
    arrayOfLayers.push(layer);
  }
  return arrayOfLayers;
}



