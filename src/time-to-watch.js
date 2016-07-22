import TVSAPI from 'tvshowtime-api';
import mega from './lib/mega/mega.js';
import TuSerie from './tuserie';
import program from 'commander';
import { getNames } from './utils';
import { startDownload } from './download';
import { dispStep, dispInfo, dispWarn, dispText } from './console';

program.version('0.0.1')
    .option('-t, --token [key]', 'TVShowTime API token')
    .parse(process.argv);

if (!program.token) {
  dispText("Missing -t option. Try 'time-to-watch --help' for more information.");
  process.exit();
}

// Connect to TVShowTime API
const tvst = new TVSAPI(program.token);

// Fetch to-watch episodes names
dispStep('Fetching data from TVShowTime...');

tvst.getToWatch({}, data => {
  const names = getNames(data.episodes);
  dispStep('Looking for MEGA links...');
  names.map((name, index) => {
    TuSerie.search(name, (err, episodes) => {
      if (err) {
        return;
      }
      if (episodes.length === 0) {
        return;
      }
      TuSerie.getMegaLinks(episodes[0], (error, links) => {
        if (error || links.length === 0) {
          dispWarn(`No link found for ${name}`);
          return;
        }
        dispText(`Found link for ${name}`);
        dispInfo(links[0]);
        const file = mega.file(links[0]);

        // Load attributes of file and download it
        file.loadAttributes((e, f) => {
          if (e) {
            return;
          }
          startDownload(f, index + 1, names.length);
        });
      });
    });
    return name;
  });
});
