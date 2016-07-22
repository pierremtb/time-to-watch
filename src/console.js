import colors from 'colors';

export function dispStep(text) {
  console.log(colors.white.bold(`\n=> ${text}`));
}

export function dispText(text) {
  console.log(text);
}

export function dispInfo(text) {
  console.log(colors.yellow(`${text}`));
}

export function dispWarn(text) {
  console.log(colors.red(`${text}`));
}

export function dispResult(text) {
  console.log(colors.green.bold(`\n${text}`));
}

export function jumpLine() {
  console.log('\n');
}
