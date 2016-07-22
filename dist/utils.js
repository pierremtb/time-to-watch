'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNames = getNames;

var _console = require('./console');

function getNames(episodes) {
  var names = [];
  (0, _console.dispText)('To-watch episodes:');
  episodes.map(function (ep) {
    var show = ep.show.name.replace(/ /g, '+');
    var season = ep.season_number > 9 ? 'S' + ep.season_number : 'S0' + ep.season_number;
    var episode = ep.number > 9 ? 'E' + ep.number : 'E0' + ep.number;
    var name = show + '+' + season + episode;
    names.push(name);
    (0, _console.dispInfo)('* ' + name.replace(/\+/g, ' '));
    return ep;
  });
  return names;
}