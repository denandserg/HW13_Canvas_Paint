const paint = require('../src/js/paint.js');
const layer = require('../src/js/layer.js');
const viewController = require('../src/js/viewController');
const assert = require('assert');
const should = require('should');
const chai = require('chai');
const jsdom = require('jsdom-global');
const sinon = require('sinon');
jsdom();
const index = require('../src/js/index');
global.Paint = paint.Paint;
global.countLayer = index.countLayer;
global.paintOptions = new paint.PaintOptions();

document.body.innerHTML = '<h2 class="title" data-lang="Paint on Canvas">Paint on Canvas</h2> <div class="button-wrapper"> <div class="dropdown"> <button class="button-wrapper__btn dropbtn dropbtn-settings" data-lang="Settings" > Settings </button> <div class="dropdown-content-settings"> <span data-id="theme" data-lang="Theme">Theme</span> <div class="dropdown-content_theme"> <span data-id="dark" data-lang="Dark">Dark</span> <span data-id="light" data-lang="Light">Light</span> </div><span data-id="lang" data-lang="Language">Language</span> <div class="dropdown-content_lang"> <span data-id="eng" data-lang="English">English</span> <span data-id="rus" data-lang="Russian">Russian</span> </div></div></div><button id="btnBrush" class="button-wrapper__btn" data-flag="off" data-lang="Brush" > Brush </button> <button id="btnBlur" class="button-wrapper__btn" data-flag="off" data-lang="Blur" > Blur </button> <div class="button-wrapper__btn"> <label for="size" data-lang="Size:">Size:</label> <input id="size" class="" type="number" min="1" max="100" value="15" placeholder="Size"/> </div><input type="color" id="btnColor" class="button-wrapper__btn"/> </div><div class="module-wrapper"> <div class="figures"> <h3 data-lang="Figures panel">Figures panel</h3> <button id="btnSquare" class="figures__btn figures__btn--square" data-flag="off" data-id="square" ></button> <button id="btnHexagon" class="figures__btn figures__btn--hexagon" data-flag="off" data-id="hexagon" ></button> <button id="btnCircle" class="figures__btn figures__btn--circle" data-flag="off" data-id="circle" ></button> </div><div id="allCanvasModule" class="canvas-module"></div><div class="layers" id="layers"> <h3 data-lang="Layout panel">Layout panel</h3> <button data-lang="Add layer" id="btnLayerAdd" class="layers__btn"> Add layer </button> </div></div><div class="canvas-coordinates" style="display: none;"> <span class="canvas-coord-x">X: <span id="canvasCoordX"></span></span> <span class="canvas-coord-y">Y: <span id="canvasCoordY"></span></span> </div>';

global.btnBrush = document.getElementById("btnBrush");
global.btnBlur = document.getElementById("btnBlur");
global.btnAddLayer = document.getElementById("btnLayerAdd");
global.btnSquare = document.getElementById("btnSquare");
global.btnHexagon = document.getElementById("btnHexagon");
global.btnCircle = document.getElementById("btnCircle");
global.divLayers = document.getElementById("layers");

function getSinonStubs() {
	const ctx = {
		beginPath: () => false,
		arc: () => "",
		stroke: () => "",
		lineTo: () => "",
		moveTo: () => "",
		strokeRect: () => ""
	};
	const ctxStub = {
		ctx: ctx,
		beginPathStub: sinon.stub(ctx, 'beginPath'),
		arcStub : sinon.stub(ctx, 'arc'),
		strokeStub : sinon.stub(ctx, 'stroke'),
		lineToStub : sinon.stub(ctx, 'lineTo'),
		moveToStub : sinon.stub(ctx, 'moveTo'),
		strokeRectStub : sinon.stub(ctx, 'strokeRect')
	};
	return ctxStub;
}

describe('getFigure', () => {
	describe('should be able to call ctx method', () => {
		it('circle', () => {
			let size = 10, 
			figure = "circle", 
			x = 15, 
			y = 20;
			let ctxStub = getSinonStubs();
			paint.getFigure(ctxStub.ctx, size, figure, x, y);
			assert.deepEqual(ctxStub.beginPathStub.calledOnce, true);
			assert.deepEqual(ctxStub.arcStub.calledOnce, true);
			assert.deepEqual(ctxStub.strokeStub.calledOnce, true);
		});
		it('square', () => {
			let size = 10, 
			figure = "square", 
			x = 15, 
			y = 23;
			let ctxStub = getSinonStubs();
			paint.getFigure(ctxStub.ctx, size, figure, x, y);
			assert.deepEqual(ctxStub.beginPathStub.calledOnce, true);
			assert.deepEqual(ctxStub.strokeRectStub.calledOnce, true);
		});
		it('hexagon', () => {
			let size = 10, 
			figure = "hexagon", 
			x = 10, 
			y = 20;
			let ctxStub = getSinonStubs();
			paint.getFigure(ctxStub.ctx, size, figure, x, y);
			assert.deepEqual(ctxStub.beginPathStub.calledOnce, true);
			assert.deepEqual(ctxStub.moveToStub.calledOnce, true);
			assert.deepEqual(ctxStub.lineToStub.callCount, 6);
			assert.deepEqual(ctxStub.strokeStub.calledOnce, true);
		});
	});
});

describe('paint constructor PaintOptions', function () {
	const option = new paint.PaintOptions();
	it('must match initial parameters', function () {
		chai.expect(option.mode).to.equal("");
		chai.expect(option.fillColor).to.equal("#000000");
		chai.expect(option.figure).to.equal("");
    chai.expect(option.filter).to.equal("");
		chai.expect(option.size).to.equal(15);
		chai.expect(option.cursor).to.equal("auto");
		chai.expect(option.image).to.equal("");
		assert.deepEqual(option.paintings, []);
});
	it('method setCursor', function () {
		option.setCursor('circle');
		chai.expect(option.cursor).to.equal("circle");
    option.setCursor('auto');
    chai.expect(option.cursor).to.equal("auto");
	});
  it('method getCursor', function () {
    option.getCursor('figure');
    chai.expect(option.figure).to.equal("figure");
    chai.expect(option.mode).to.equal("figure");
  });
	it('method setMode', function () {
		option.setMode('figure');
		chai.expect(option.mode).to.equal("figure");
		chai.expect(option.cursor).to.equal("auto");
	});
	it('method setColor', function () {
		option.setColor('#ffffff');
		chai.expect(option.fillColor).to.equal("#ffffff");
	});
	it('method setSize', function () {
		option.setSize("24");
		chai.expect(option.size).to.equal(24);
	});
});

describe('Function initPaint()', () => {
	const spy = sinon.spy(paint.initPaint);
	it('should return 1 call function, when initialize', () => {
		spy();
		chai.expect(spy.calledOnce).to.equal(true);
	});
});

describe('Constructor Paint', () => {
  const testData = [{value: 'canvas'}, {value: 'options'}];
  const mockLayer = new layer.Layers();
  const mockCanvas = mockLayer.createCanvas();
  const mockPaint = new paint.Paint(mockCanvas,paintOptions);
  testData.forEach(data => {
    const {value} = data;
    it(`should return true when Constructor has property/method - ${value}`, () => {
      const actual = mockPaint.hasOwnProperty(value);
      assert.equal(actual, true);
    });
  });
});

describe('Constructor Layer', () => {
	const testData = [{value: 'add'}, {value: 'createCanvas'}];
	const mock = new layer.Layers();
  testData.forEach(data => {
		const {value} = data;
    it(`should return true when Constructor has property/method - ${value}`, () => {
    	const actual = mock.hasOwnProperty(value);
      assert.equal(actual, true);
    });
	});
});

describe('Function Layer.add()', () => {
  const mock = new layer.Layers();
    it(`should return equal canvas with mock canvas`, () => {
      let canvas = document.createElement("canvas");
      canvas.classList.add("canvas");
      canvas.id = "canvas__layer-" + countLayer;
      canvas.dataset.id = countLayer;
      canvas.width = 800;
      canvas.height = 500;
      const actual = mock.add();
      assert.deepEqual(actual.toString(), canvas.toString());
    });
});

describe('Function Paint.clear()', () => {
  let canvas = document.createElement("canvas");
  canvas.classList.add("canvas");
  canvas.id = "canvas__layer-" + countLayer;
  canvas.dataset.id = countLayer;
  canvas.width = 800;
  canvas.height = 500;
  document.body.appendChild(canvas);
  const paintMock = new paint.Paint(canvas, paintOptions);
  const spy = sinon.spy(paintMock.clear(canvas));
  it(`should return equal canvas with mock canvas`, () => {
    spy();
    chai.expect(spy.calledOnce).to.equal(true);
  });
});

describe('Function initViewController()', () => {
  const spy = sinon.spy(viewController.initViewController);
  it('should return 1 call function, when initialize', () => {
    spy();
    chai.expect(spy.calledOnce).to.equal(true);
  });
});

describe('Constructor ViewController', () => {
  const testData = [{value: 'changeOffTools'}, {value: 'changeActiveFigure'}, {value: 'changeActiveBrush'}, {value: 'changeActiveBlur'}, {value: 'addLayerCanvas'}, {value: 'deleteCurrentLayerCanvas'}, {value: 'getCurrentLayerCanvas'}, {value: 'addCurrentLayerCanvasButton'},];
  const mockView = new viewController.ViewController();
  testData.forEach(data => {
    const {value} = data;
    it(`should return true when Constructor has property/method - ${value}`, () => {
      const actual = mockView.hasOwnProperty(value);
      assert.equal(actual, true);
    });
  });
});

HTMLCanvasElement.prototype.getContext = () => {
	return "";
};

HTMLCanvasElement.prototype.toDataURL = () => {
	return "";
};
