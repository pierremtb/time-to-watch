import { dispInfo, dispText } from './console';

export function getNames(episodes) {
  const names = [];
  dispText('To-watch episodes:');
  episodes.map(ep => {
    const show = ep.show.name.replace(/ /g, '+');
    const season = ep.season_number > 9 ? `S${ep.season_number}` : `S0${ep.season_number}`;
    const episode = ep.number > 9 ? `E${ep.number}` : `E0${ep.number}`;
    const name = `${show}+${season}${episode}`;
    names.push(name);
    dispInfo(`* ${name.replace(/\+/g, ' ')}`);
    return ep;
  });
  return names;
}
