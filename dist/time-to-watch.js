'use strict';

var _tvshowtimeApi = require('tvshowtime-api');

var _tvshowtimeApi2 = _interopRequireDefault(_tvshowtimeApi);

var _mega = require('./lib/mega/mega.js');

var _mega2 = _interopRequireDefault(_mega);

var _tuserie = require('./tuserie');

var _tuserie2 = _interopRequireDefault(_tuserie);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _utils = require('./utils');

var _download = require('./download');

var _console = require('./console');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('0.0.1').option('-t, --token [key]', 'TVShowTime API token').parse(process.argv);

if (!_commander2.default.token) {
  (0, _console.dispText)("Missing -t option. Try 'time-to-watch --help' for more information.");
  process.exit();
}

// Connect to TVShowTime API
var tvst = new _tvshowtimeApi2.default(_commander2.default.token);

// Fetch to-watch episodes names
(0, _console.dispStep)('Fetching data from TVShowTime...');

tvst.getToWatch({}, function (data) {
  var names = (0, _utils.getNames)(data.episodes);
  (0, _console.dispStep)('Looking for MEGA links...');
  names.map(function (name, index) {
    _tuserie2.default.search(name, function (err, episodes) {
      if (err) {
        return;
      }
      if (episodes.length === 0) {
        return;
      }
      _tuserie2.default.getMegaLinks(episodes[0], function (error, links) {
        if (error || links.length === 0) {
          (0, _console.dispWarn)('No link found for ' + name);
          return;
        }
        (0, _console.dispText)('Found link for ' + name);
        (0, _console.dispInfo)(links[0]);
        var file = _mega2.default.file(links[0]);

        // Load attributes of file and download it
        file.loadAttributes(function (e, f) {
          if (e) {
            return;
          }
          (0, _download.startDownload)(f, index + 1, names.length);
        });
      });
    });
    return name;
  });
});