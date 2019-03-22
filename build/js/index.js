"use strict";

var btnBrush = document.getElementById('btnBrush');
var btnBlur = document.getElementById('btnBlur');
btnBrush.addEventListener('click', changeActiveBrush);
btnBlur.addEventListener('click', changeActiveBlur);

function changeActiveBrush() {
  if (btnBrush.dataset.flag === 'off') {
    console.log(btnBrush);
    btnBrush.dataset.flag = 'on';
    btnBrush.classList.add('button-wrapper__btn--active');
  } else {
    btnBrush.dataset.flag = 'off';
    btnBrush.classList.toggle('button-wrapper__btn--active');
  }
}

function changeActiveBlur() {
  if (btnBlur.dataset.flag === 'off') {
    console.log(btnBrush);
    btnBlur.dataset.flag = 'on';
    btnBlur.classList.add('button-wrapper__btn--active');
  } else {
    btnBlur.dataset.flag = 'off';
    btnBlur.classList.toggle('button-wrapper__btn--active');
  }
}