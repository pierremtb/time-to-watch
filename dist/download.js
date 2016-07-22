'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startDownload = startDownload;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _multiProgress = require('multi-progress');

var _multiProgress2 = _interopRequireDefault(_multiProgress);

var _console = require('./console');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FOLDER = 'downloads/';
var multi = new _multiProgress2.default(process.stderr);

var isFirstDownload = true;
var isNotAllDone = true;
var downloadsCount = 0;
var downloadedCount = 0;

function checkFolder() {
  _fsExtra2.default.ensureDirSync(FOLDER);
}

function fileExists(name) {
  return _fsExtra2.default.existsSync(FOLDER + name);
}

function checkAllDone() {
  if (downloadsCount === downloadedCount && isNotAllDone) {
    (0, _console.dispResult)('DONE! Check ' + _path2.default.resolve(__dirname, FOLDER));
    isNotAllDone = false;
  }
}

function handleProgress(dl, file) {
  var bar = void 0;

  dl.on('progress', function (stats) {
    if (!bar) {
      bar = multi.newBar('* ' + file.name + ' [:bar] :percent :etas', {
        total: stats.bytesTotal,
        width: 50
      });
    }
    bar.tick(stats.bytesLoaded - bar.curr);
  });

  dl.on('end', function () {
    bar.tick();
    downloadedCount++;
    checkAllDone();
  });
}

function startDownload(file, number, total) {
  checkFolder();
  if (fileExists(file.name)) {
    if (isFirstDownload) {
      (0, _console.jumpLine)();
      isFirstDownload = false;
    }
    (0, _console.dispInfo)(file.name + ' is already downloaded!');
    if (number === total) {
      checkAllDone();
    }
    return;
  }
  if (isFirstDownload) {
    isFirstDownload = false;
    (0, _console.dispStep)('Downloading...');
  }
  var dl = file.download();
  dl.pipe(_fsExtra2.default.createWriteStream(FOLDER + file.name));
  downloadsCount++;
  handleProgress(dl, file);
}