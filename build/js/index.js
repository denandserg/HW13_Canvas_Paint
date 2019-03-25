"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Generated by CoffeeScript 1.12.7

/*

MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
(function () {
  'use strict';

  var bind = function bind(fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };

  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define([], function () {
        return root.i18n = factory();
      });
    } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
      return module.exports = factory();
    } else {
      return root.i18n = factory();
    }
  })(typeof self !== "undefined" && self !== null ? self : this, function () {
    var Translator, i18n, translator;

    Translator = function () {
      function Translator() {
        this.translate = bind(this.translate, this);
        this.data = {
          values: {},
          contexts: []
        };
        this.globalContext = {};
      }

      Translator.prototype.translate = function (text, defaultNumOrFormatting, numOrFormattingOrContext, formattingOrContext, context) {
        var defaultText, formatting, isObject, num;

        if (context == null) {
          context = this.globalContext;
        }

        isObject = function isObject(obj) {
          var type;
          type = _typeof(obj);
          return type === "function" || type === "object" && !!obj;
        };

        if (isObject(defaultNumOrFormatting)) {
          defaultText = null;
          num = null;
          formatting = defaultNumOrFormatting;
          context = numOrFormattingOrContext || this.globalContext;
        } else {
          if (typeof defaultNumOrFormatting === "number") {
            defaultText = null;
            num = defaultNumOrFormatting;
            formatting = numOrFormattingOrContext;
            context = formattingOrContext || this.globalContext;
          } else {
            defaultText = defaultNumOrFormatting;

            if (typeof numOrFormattingOrContext === "number") {
              num = numOrFormattingOrContext;
              formatting = formattingOrContext;
              context = context;
            } else {
              num = null;
              formatting = numOrFormattingOrContext;
              context = formattingOrContext || this.globalContext;
            }
          }
        }

        if (isObject(text)) {
          if (isObject(text['i18n'])) {
            text = text['i18n'];
          }

          return this.translateHash(text, context);
        } else {
          return this.translateText(text, num, formatting, context, defaultText);
        }
      };

      Translator.prototype.add = function (d) {
        var c, i, k, len, ref, ref1, results, v;

        if (d.values != null) {
          ref = d.values;

          for (k in ref) {
            v = ref[k];
            this.data.values[k] = v;
          }
        }

        if (d.contexts != null) {
          ref1 = d.contexts;
          results = [];

          for (i = 0, len = ref1.length; i < len; i++) {
            c = ref1[i];
            results.push(this.data.contexts.push(c));
          }

          return results;
        }
      };

      Translator.prototype.setContext = function (key, value) {
        return this.globalContext[key] = value;
      };

      Translator.prototype.clearContext = function (key) {
        return this.lobalContext[key] = null;
      };

      Translator.prototype.reset = function () {
        this.data = {
          values: {},
          contexts: []
        };
        return this.globalContext = {};
      };

      Translator.prototype.resetData = function () {
        return this.data = {
          values: {},
          contexts: []
        };
      };

      Translator.prototype.resetContext = function () {
        return this.globalContext = {};
      };

      Translator.prototype.translateHash = function (hash, context) {
        var k, v;

        for (k in hash) {
          v = hash[k];

          if (typeof v === "string") {
            hash[k] = this.translateText(v, null, null, context);
          }
        }

        return hash;
      };

      Translator.prototype.translateText = function (text, num, formatting, context, defaultText) {
        var contextData, result;

        if (context == null) {
          context = this.globalContext;
        }

        if (this.data == null) {
          return this.useOriginalText(defaultText || text, num, formatting);
        }

        contextData = this.getContextData(this.data, context);

        if (contextData != null) {
          result = this.findTranslation(text, num, formatting, contextData.values, defaultText);
        }

        if (result == null) {
          result = this.findTranslation(text, num, formatting, this.data.values, defaultText);
        }

        if (result == null) {
          return this.useOriginalText(defaultText || text, num, formatting);
        }

        return result;
      };

      Translator.prototype.findTranslation = function (text, num, formatting, data) {
        var a, b, c, d, e, i, len, result, triple, value;
        value = data[text];

        if (value == null) {
          return null;
        }

        if (num == null && !Array.isArray(value)) {
          if (typeof value === "string") {
            return this.applyFormatting(value, num, formatting);
          }
        } else {
          if (value instanceof Array || value.length) {
            a = num === null;

            for (i = 0, len = value.length; i < len; i++) {
              triple = value[i];
              b = triple[0] === null;
              c = triple[1] === null;
              d = num >= triple[0];
              e = num <= triple[1];

              if (a && b && c || !a && (!b && d && (c || e) || b && !c && e)) {
                result = this.applyFormatting(triple[2].replace("-%n", String(-num)), num, formatting);
                return this.applyFormatting(result.replace("%n", String(num)), num, formatting);
              }
            }
          }
        }

        return null;
      };

      Translator.prototype.getContextData = function (data, context) {
        var c, equal, i, key, len, ref, ref1, value;

        if (data.contexts == null) {
          return null;
        }

        ref = data.contexts;

        for (i = 0, len = ref.length; i < len; i++) {
          c = ref[i];
          equal = true;
          ref1 = c.matches;

          for (key in ref1) {
            value = ref1[key];
            equal = equal && value === context[key];
          }

          if (equal) {
            return c;
          }
        }

        return null;
      };

      Translator.prototype.useOriginalText = function (text, num, formatting) {
        if (num == null) {
          return this.applyFormatting(text, num, formatting);
        }

        return this.applyFormatting(text.replace("%n", String(num)), num, formatting);
      };

      Translator.prototype.applyFormatting = function (text, num, formatting) {
        var ind, regex;

        for (ind in formatting) {
          regex = new RegExp("%{" + ind + "}", "g");
          text = text.replace(regex, formatting[ind]);
        }

        return text;
      };

      return Translator;
    }();

    translator = new Translator();
    i18n = translator.translate;
    i18n.translator = translator;

    i18n.create = function (data) {
      var trans;
      trans = new Translator();

      if (data != null) {
        trans.add(data);
      }

      trans.translate.create = i18n.create;
      return trans.translate;
    };

    return i18n;
  });
}).call(void 0);
"use strict";

window.onload = function () {
  init();
  initPaint();
};

var btnBrush = document.getElementById("btnBrush");
var btnBlur = document.getElementById("btnBlur");
var btnAddLayer = document.getElementById("btnLayerAdd");
var btnSquare = document.getElementById("btnSquare");
var btnHexagon = document.getElementById("btnHexagon");
var btnCircle = document.getElementById("btnCircle");
var divLayers = document.getElementById("layers");
var size = document.getElementById('size');
var btnDel;
var radios;
var countLayer = 0;

function init() {
  btnBrush.addEventListener("click", changeActiveBrush);
  btnBlur.addEventListener("click", changeActiveBlur);
  btnAddLayer.addEventListener("click", addLayer);
  btnSquare.addEventListener("click", changeActiveFigure);
  btnCircle.addEventListener("click", changeActiveFigure);
  btnHexagon.addEventListener("click", changeActiveFigure);
}

function changeOffTools() {
  var allBtnFigure = document.querySelectorAll(".figures__btn");
  allBtnFigure.forEach(function (btn) {
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
  var tabContentActiveElem = document.querySelector(".layers");
  var newCanvas = layer.add(tabContentActiveElem);
  radios.forEach(function (el) {
    el.addEventListener("click", getCurrentLayer);
  });
  btnDel.forEach(function (el) {
    el.addEventListener("click", deleteCurrentLayer);
  });
}

function deleteCurrentLayer(e) {
  var allCanvas = document.querySelectorAll(".canvas");
  var allLayers = document.querySelectorAll(".layers__curLayer");
  allCanvas.forEach(function (el) {
    if (e.target.value === el.dataset.id) {
      el.remove();
    }
  });
  allLayers.forEach(function (el) {
    if (e.target.value === el.dataset.flag) {
      el.remove();
    }
  });
  countLayer--;
}

function getCurrentLayer(e) {
  var allCanvas = document.querySelectorAll(".canvas");
  allCanvas.forEach(function (el) {
    el.classList.remove('active');

    if (e.target.id === el.dataset.id) {
      el.classList.add("active");
    }
  });
}

function addCurrentLayerButton(count) {
  var curAddLayer = document.createElement("div");
  var curLabel = document.createElement("label");
  var curInputRadio = document.createElement("input");
  var curLabelNameLayer = document.createElement("label");
  var curButtonDelLayer = document.createElement("button");
  curAddLayer.dataset.flag = count;
  curInputRadio.type = "radio";
  curInputRadio.name = "radioLayer";

  if (count === 0) {
    curInputRadio.checked = true; // curInputRadio.id = count;
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
"use strict";

var activeTab = {
  id: 1
};
var layer = new Layers();

function Layers() {
  this.add = function (layerElem, id) {
    var tab1 = document.getElementById('tab-1');
    var allLayers = document.querySelectorAll(".layer");
    var allCanvases = document.querySelectorAll(".canvas");
    var count = this.getId(id, allLayers);
    var canvas = createCanvas(activeTab.id, countLayer);
    this.makeActive(canvas, allCanvases);
    tab1.appendChild(canvas);
    canvas.paintObj = new Paint(canvas, paintOptions);
    countLayer++;
    return canvas;
  };

  this.getId = function (id, allLayers) {
    var count;

    if (id === undefined) {
      if (allLayers.length === 0) {
        count = 1;
      } else {
        count = allLayers[allLayers.length - 1].dataset.id;
        count++;
      }
    } else {
      count = id;
    }

    return count;
  };

  this.makeActive = function (elem, collection) {
    for (var i = 0; i < collection.length; i++) {
      collection[i].classList.remove("active");
    }

    elem.classList.add("active");
  };

  function createCanvas(id, count) {
    var canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    canvas.id = "canvas-" + id + "__layer-" + count;
    canvas.dataset.id = count;
    canvas.dataset.tabId = id;
    canvas.width = 800;
    canvas.height = 500;
    return canvas;
  }
}
"use strict";

function initPaint() {
  addEventListeners();
}

function addEventListeners() {
  var tabContentsElem = document.getElementById("tab-1");
  var canvasCoordXElem = document.getElementById("canvasCoordX");
  var canvasCoordYElem = document.getElementById("canvasCoordY");
  var rngElem = document.getElementById('size');
  var colorElem = document.getElementById("btnColor");
  tabContentsElem.addEventListener('mousemove', function (event) {
    if (event.target.tagName !== "canvas") return;
    canvasCoordXElem.innerHTML = event.offsetX;
    canvasCoordYElem.innerHTML = event.offsetY;
  });
  colorElem.addEventListener('input', function () {
    paintOptions.setColor(colorElem.value);
  });
  rngElem.addEventListener('input', function () {
    paintOptions.setSize(rngElem.value);
  });
  btnBrush.addEventListener('click', function () {
    paintOptions.setMode("brush");
  });
}

var paintOptions = new PaintOptions();

function PaintOptions() {
  this.fillColor = "#000000";
  this.mode = "";
  this.figure = "";
  this.size = 15;
  this.filter = "";
  this.cursor = "auto";
  this.image = "";
  this.paintings = [];
  var self = this;

  this.setSize = function (size) {
    this.size = +size;
    getFigureForCursor();
  };

  this.setColor = function (fillColor) {
    this.fillColor = fillColor;
    getFigureForCursor();
  };

  this.setMode = function (mode) {
    this.mode = mode;
    this.setCursor('auto');
  };

  this.setCursor = function (cursor) {
    self.cursor = cursor;
    self.paintings.forEach(function (paint) {
      var canvas = paint.canvas;

      if (cursor === "auto") {
        canvas.style.cursor = cursor;
        return;
      }

      canvas.style.cursor = 'url(' + cursor + '), auto';
    });
  };

  this.getCursor = function (figure) {
    this.mode = "figure";
    this.figure = figure;
    getFigureForCursor();
  };

  function getFigureForCursor() {
    if (self.mode !== "figure") return;
    var cursor = document.createElement('canvas');
    var ctxCurs = cursor.getContext('2d');
    cursor.width = self.size + 2;
    cursor.height = self.size + 2;
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
  var self = this;
  canvas.addEventListener('mousedown', function (event) {
    self.mouseMoveHandler(event);
    self.drawFigure(event);
  });
  window.addEventListener('mouseup', function () {
    canvas.onmousemove = null;
  });

  this.clear = function (canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  this.drawFigure = function (event) {
    if (self.options.mode !== "figure") return;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = self.options.fillColor;
    ctx.fillStyle = self.options.fillColor;
    ctx.filter = self.options.filter;
    getFigure(ctx, self.options.size, self.options.figure, event.offsetX, event.offsetY);
  };

  this.mouseMoveHandler = function (event) {
    if (self.options.mode !== "brush") return;

    if (canvas && canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = self.options.fillColor;

      canvas.onmousemove = function (event) {
        ctx.fillRect(event.offsetX - self.options.size / 2, event.offsetY - self.options.size / 2, self.options.size, self.options.size);
      };

      canvas.onmouseup = function () {
        canvas.onmousemove = null;
      };
    }
  };
}

function getFigure(ctx, size, figure, x, y) {
  var side = Math.sqrt(Math.pow(size / 2, 2) - Math.pow(size / 4, 2));

  switch (figure) {
    case "circle":
      ctx.beginPath();
      ctx.lineWidth = paintOptions.size / 3;
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
      ctx.moveTo(x + size / 4, y - side + size / 2);
      ctx.lineTo(x, y + size / 2);
      ctx.lineTo(x + size / 4, y + side + size / 2);
      ctx.lineTo(x + size / 4 + size / 2, y + side + size / 2);
      ctx.lineTo(x + size, y + size / 2);
      ctx.lineTo(x + size / 4 + size / 2, y - side + size / 2);
      ctx.lineTo(x + size / 4, y - side + size / 2);
      ctx.stroke();
      break;
  }

  return ctx;
}

if (typeof module !== 'undefined') {
  module.exports = {
    Paint: Paint,
    PaintOptions: PaintOptions,
    getFigure: getFigure
  };
}
"use strict";

var contentDropDownThemeElem = document.querySelector(".dropdown-content_theme");
var contentDropDownLangElem = document.querySelector(".dropdown-content_lang");
var btnDropDownElem = document.querySelector(".dropbtn-settings");
var DropDownSetElem = document.querySelector(".dropdown-content-settings");
var langObj;
DropDownSetElem.addEventListener("click", function (event) {
  var DropDownContentThemeElem = document.querySelector(".dropdown-content_theme");
  var target = event.target;

  if (target.dataset.id === "theme") {
    contentDropDownThemeElem.classList.toggle("active");
    contentDropDownLangElem.classList.remove("active");
    DropDownContentThemeElem.addEventListener("click", function (event) {
      var target = event.target;

      if (target.dataset.id === "dark") {
        changeTheme('./css/dark-theme.css');
      }

      if (target.dataset.id === "light") {
        changeTheme('./css/light-theme.css');
      }
    });
  }

  if (target.dataset.id === "lang") {
    contentDropDownLangElem.classList.toggle("active");
    contentDropDownThemeElem.classList.remove("active");
    document.querySelector(".dropdown-content_lang").addEventListener("click", function (event) {
      var target = event.target;

      if (target.dataset.id === "eng") {
        langObj = i18n.create({
          values: {}
        });
        changeLange();
      }

      if (target.dataset.id === "rus") {
        langObj = i18n.create({
          values: {
            "Settings": "Настройки",
            "Theme": "Тема",
            "Language": "Язык",
            "Dark": "Темная",
            "Light": "Светлая",
            "English": "Английский",
            "Russian": "Русский",
            "Size:": "Размер:",
            "Paint on Canvas": "Рисунок на холсте)",
            "Brush": "Кисть",
            "Blur": "Размытие",
            "Layout panel": "Слои",
            "Add layer": "Добавить слой",
            "Figures panel": "Фигуры",
            "Canvas layer": "Слой"
          }
        });
        changeLange();
      }
    });
  }
});
document.addEventListener("click", function (event) {
  var dropdownBlock = DropDownSetElem.parentElement;

  if (dropdownBlock.classList.contains("active")) {
    var isClosestActive = event.target.closest(".dropdown.active");

    if (!isClosestActive) {
      dropdownBlock.classList.remove("active");
      contentDropDownThemeElem.classList.remove("active");
      contentDropDownLangElem.classList.remove("active");
    }
  }
});

function changeLange() {
  var langElems = document.querySelectorAll("[data-lang]");
  langElems.forEach(function (elem) {
    elem.innerHTML = langObj(elem.dataset.lang);
  });
}

function changeTheme(href) {
  var head = document.getElementsByTagName('head')[0];
  var cssId = 'theme';

  if (document.getElementById(cssId)) {
    head.removeChild(document.getElementById(cssId));
  }

  if (!document.getElementById(cssId)) {
    var link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    link.media = 'all';
    head.appendChild(link);
  }
}

btnDropDownElem.addEventListener("click", function (event) {
  event.target.closest(".dropdown").classList.toggle("active");
  contentDropDownThemeElem.classList.remove("active");
  contentDropDownLangElem.classList.remove("active");
});