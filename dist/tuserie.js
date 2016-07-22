'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _unshorten = require('unshorten');

var _unshorten2 = _interopRequireDefault(_unshorten);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doUnshorten(shortUrl) {
  return new Promise(function (resolve) {
    (0, _unshorten2.default)(shortUrl, function (url) {
      resolve(url);
    });
  });
}

var TuSerie = {
  search: function search(query, callback) {
    (0, _got2.default)('http://tuserie.com/?s=' + query).then(function (data) {
      var $ = _cheerio2.default.load(data.body);
      var episodes = [];

      $('.content-main .content .post-main h2 a').each(function () {
        episodes.push($(this).attr('href'));
      });
      callback(null, episodes);
    }).catch(function (err) {
      callback(err);
    });
  },
  getMegaLinks: function getMegaLinks(episode, callback) {
    (0, _got2.default)(episode).then(function (data) {
      var $ = _cheerio2.default.load(data.body);
      var promises = [];
      $('.content-main .post-main .post p strong a').each(function el() {
        if ($(this).contents()[0].data.indexOf('MEGA') === -1) {
          return;
        }
        promises.push(doUnshorten($(this).attr('href')));
      });

      Promise.all(promises).then(function (links) {
        callback(null, links);
      });
    }).catch(function (err) {
      callback(err);
    });
  }
};

exports.default = TuSerie;