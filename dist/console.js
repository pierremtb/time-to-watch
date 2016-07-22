'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispStep = dispStep;
exports.dispText = dispText;
exports.dispInfo = dispInfo;
exports.dispWarn = dispWarn;
exports.dispResult = dispResult;
exports.jumpLine = jumpLine;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispStep(text) {
  console.log(_colors2.default.white.bold('\n=> ' + text));
}

function dispText(text) {
  console.log(text);
}

function dispInfo(text) {
  console.log(_colors2.default.yellow('' + text));
}

function dispWarn(text) {
  console.log(_colors2.default.red('' + text));
}

function dispResult(text) {
  console.log(_colors2.default.green.bold('\n' + text));
}

function jumpLine() {
  console.log('\n');
}