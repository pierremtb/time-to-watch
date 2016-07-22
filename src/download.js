import fs from 'fs-extra';
import path from 'path';
import Multiprogress from 'multi-progress';
import { dispStep, dispInfo, dispResult, jumpLine } from './console';

const FOLDER = 'downloads/';
const multi = new Multiprogress(process.stderr);

let isFirstDownload = true;
let isNotAllDone = true;
let downloadsCount = 0;
let downloadedCount = 0;

function checkFolder() {
  fs.ensureDirSync(FOLDER);
}

function fileExists(name) {
  return fs.existsSync(FOLDER + name);
}

function checkAllDone() {
  if (downloadsCount === downloadedCount && isNotAllDone) {
    dispResult(`DONE! Check ${path.resolve(__dirname, FOLDER)}`);
    isNotAllDone = false;
  }
}

function handleProgress(dl, file) {
  let bar;

  dl.on('progress', stats => {
    if (!bar) {
      bar = multi.newBar(`* ${file.name} [:bar] :percent :etas`, {
        total: stats.bytesTotal,
        width: 50,
      });
    }
    bar.tick(stats.bytesLoaded - bar.curr);
  });

  dl.on('end', () => {
    bar.tick();
    downloadedCount++;
    checkAllDone();
  });
}

export function startDownload(file, number, total) {
  checkFolder();
  if (fileExists(file.name)) {
    if (isFirstDownload) {
      jumpLine();
      isFirstDownload = false;
    }
    dispInfo(`${file.name} is already downloaded!`);
    if (number === total) {
      checkAllDone();
    }
    return;
  }
  if (isFirstDownload) {
    isFirstDownload = false;
    dispStep('Downloading...');
  }
  const dl = file.download();
  dl.pipe(fs.createWriteStream(FOLDER + file.name));
  downloadsCount++;
  handleProgress(dl, file);
}
