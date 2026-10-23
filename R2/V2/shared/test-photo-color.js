const assert = require('assert');
const AV = require('./av-rule.js');
// Dominant area wins, rather than an average of unrelated colours.
const pixels = [];
for (let i = 0; i < 100; i++) pixels.push(...(i < 70 ? [180, 40, 70, 255] : [30, 160, 220, 255]));
assert.strictEqual(AV.dominantColor(pixels), '#b42846');
assert.strictEqual(AV.dominantColor([255, 0, 0, 0, 22, 100, 60, 255]), '#16643c');
assert.strictEqual(AV.dominantColor([255, 0, 0, 0]), AV.PAPER);
// Sample the RGB cube, including the midtones where branded near-black fails.
let samples = 0;
for (let r = 0; r < 256; r += 17) for (let g = 0; g < 256; g += 17) for (let b = 0; b < 256; b += 17) {
  const color = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
  assert(AV.contrast(color, AV.photoInk(color)) >= 4.5, color);
  samples++;
}
console.log('Dominant colour, transparency, fallback and ' + samples + ' AA contrast checks passed.');
