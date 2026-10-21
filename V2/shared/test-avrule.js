// MV-0 verification · node test-avrule.js
// Every case states the rule it checks; a failure prints the case and the field.
const AV = require('./av-rule.js');
let fails = 0, n = 0;
function eq(name, got, want) { n++; if (JSON.stringify(got) !== JSON.stringify(want)) { fails++; console.log('FAIL', name, '\n   got ', JSON.stringify(got), '\n   want', JSON.stringify(want)); } }
function ok(name, cond, note) { n++; if (!cond) { fails++; console.log('FAIL', name, note || ''); } }

// ── palette integrity: every family's 01 vs 02 ≥ 3:1, every 01 on black ≥ 3:1
AV.FAMILIES.forEach(f => {
  ok(`palette ${f.name} 01/02 ≥3:1`, AV.contrast(f.light, f.dark) >= 3, AV.contrast(f.light, f.dark).toFixed(2));
  ok(`palette ${f.name} 01 on black ≥3:1`, AV.contrast(f.light, AV.BLACK) >= 3, AV.contrast(f.light, AV.BLACK).toFixed(2));
});

// ── alias detection: one test for every domain the builds mint
['a@cloaked.id', 'x@mycloaked.id', 'y@myclkd.id', 'hinge.dog.clkd.id', 'z@stayclkd.com', 'w@usecloaked.com', 'q@clokd.email', 'google.spiderman@cloaked.id']
  .forEach(v => ok(`alias ${v}`, AV.isAliasValue(v) === true));
['margaret611@gmail.com', 'cloaklover@gmail.com', 'me@notcloaked.com', '523-256-2345', 'https://hinge.co']
  .forEach(v => ok(`not alias ${v}`, AV.isAliasValue(v) === false));

// ── glyph priority
let d;
d = AV.decide({ title: 'Dating', site: 'hinge.co', kind: 'login', value: 'Dating152@cloaked.com' });
eq('brand beats persona (Hinge + "Dating")', [d.glyph.type, d.glyph.key], ['logo', 'hinge']);
d = AV.decide({ title: 'Google', kind: 'login', value: 'google.spiderman@cloaked.id', user: 'google.spiderman@cloaked.id' });
eq('brand from title', [d.glyph.type, d.glyph.key, d.alias], ['logo', 'google', true]);
d = AV.decide({ title: 'My stuff', user: 'margaret@apple.com', kind: 'login', value: 'pw' , alias: false });
eq('brand from username host', d.glyph.key, 'apple');
d = AV.decide({ title: 'Personal', kind: 'email', value: 'margaret@gmail.com' });
eq('brand from the value host (non-alias)', [d.glyph.key, d.alias], ['google', false]);
d = AV.decide({ title: 'Personal', kind: 'email', value: 'gmail.margaret@cloaked.id' });
eq('alias value host is NOT a brand', [d.glyph.type, d.glyph.key], ['prop', 'email']);
d = AV.decide({ title: 'Cancun trip', kind: 'email', value: 'trip@cloaked.id' });
eq('persona from title', [d.glyph.type, d.glyph.key], ['persona', 'travel']);
d = AV.decide({ title: 'My network', kind: 'phone', alias: true });
eq('"network" does not fire "work"', d.glyph.type, 'prop');
d = AV.decide({ title: 'test', kind: 'password', alias: false });
eq('property fallback · password -> logins', d.glyph.key, 'logins');
d = AV.decide({ title: 'test', kind: 'card', alias: false });
eq('property fallback · card', d.glyph.key, 'card');
d = AV.decide({ title: 'Cancun trip', kind: 'email', value: 'trip@cloaked.id', photo: 'assets/Avatar/avatar-image/cancun trip.png' });
eq('photo beats everything', [d.glyph.type, d.ground, d.bg], ['photo', AV.PAPER, null]);

// ── colour
d = AV.decide({ title: 'Dating', kind: 'phone', alias: true });
const fam = AV.FAMILIES.find(f => f.name === d.family);
eq('alias · black disc, 01 mark', [d.bg, d.ink], [AV.BLACK, fam.light]);
eq('alias · detail dark, outline, generating, ground = 01', [d.mode, d.outline, d.generating, d.ground], ['dark', true, true, fam.light]);
d = AV.decide({ title: 'Dating', kind: 'phone', alias: false });
ok('non-alias · 01 with 02', (d.bg === fam.light && d.ink === fam.dark) || (d.bg === fam.dark && d.ink === fam.light), JSON.stringify([d.bg, d.ink]));
eq('non-alias · detail light, no outline, no generating, ground = disc', [d.mode, d.outline, d.generating, d.ground], ['light', false, false, d.bg]);
ok('non-alias · disc/mark ≥3:1', AV.contrast(d.bg, d.ink) >= 3);
ok('same title+kind+value -> same family (stable)', AV.decide({ title: 'Dating', kind: 'phone', alias: true }).family === d.family);
// MV-4 · three items called "test" of three kinds do not all share one family
const fams = new Set(['login', 'phone', 'email'].map(k => AV.decide({ title: 'test', kind: k, alias: false }).family));
ok('"test" × 3 kinds -> more than one family', fams.size > 1, [...fams].join(','));
// the 8 families are all reachable
const seen = new Set(); for (let i = 0; i < 400; i++) seen.add(AV.decide({ title: 'item ' + i, kind: 'email', alias: false }).family);
eq('hash spreads over all 8 families', seen.size, 8);
// swap actually happens
const discs = new Set(); for (let i = 0; i < 400; i++) { const x = AV.decide({ title: 'item ' + i, kind: 'email', alias: false }); const f = AV.FAMILIES.find(f => f.name === x.family); discs.add(x.bg === f.light ? 'L' : 'D'); }
eq('non-alias uses both 01-disc and 02-disc', [...discs].sort(), ['D', 'L']);

// ── logos
d = AV.decide({ title: 'Hinge', kind: 'login', alias: true, value: 'Dating152@cloaked.com' });
eq('Hinge · black mark whitened on dark, ground black, ink white', [d.whiten, d.ground, d.groundInk, d.groundMode, d.bg], [true, AV.BLACK, AV.WHITE, 'dark', null]);
d = AV.decide({ title: 'Google', kind: 'login', alias: true });
eq('Google · multi: not whitened, white ground, card outline, black ink', [d.whiten, d.ground, d.cardOutline, d.groundInk, d.groundMode], [false, AV.WHITE, true, AV.BLACK, 'light']);
d = AV.decide({ title: 'Delta', kind: 'email', alias: false });
// #f91c40 is bright: black 4.6:1 beats white 4.3:1, so the rule picks black (Figma's example used a darker red)
eq('Delta · one colour: ground = tint, ink by contrast, not whitened', [d.ground, d.groundInk, d.whiten], ['#f91c40', AV.BLACK, false]);
ok('Delta · chosen ink has the higher contrast', AV.contrast(d.ground, d.groundInk) >= AV.contrast(d.ground, d.groundInk === AV.BLACK ? AV.WHITE : AV.BLACK));
d = AV.decide({ title: 'Spotify', kind: 'login', alias: false });
eq('Spotify green · black ink on it', d.groundInk, AV.BLACK);
d = AV.decide({ title: "McDonald's order", kind: 'email', alias: true });
eq("McDonald's · apostrophe and domain", [d.glyph.key, d.brand.domain], ['mcdonald', 'mcdonalds.com']);
eq('T-Mobile domain', AV.brand('tmobile').domain, 't-mobile.com');

// ── ground ink is always ≥ 4.5:1 (text) for every family colour and every brand tint
AV.FAMILIES.forEach(f => [f.light, f.dark].forEach(c => ok(`ink on ${c}`, AV.contrast(c, AV.inkOn(c)) >= 4.5, AV.contrast(c, AV.inkOn(c)).toFixed(2))));
Object.keys(AV.BRANDS).forEach(k => { const b = AV.brand(k); ok(`ink on ${k} tint`, AV.contrast(b.tint, AV.inkOn(b.tint)) >= 3, AV.contrast(b.tint, AV.inkOn(b.tint)).toFixed(2)); });

// ── rendering helper
const html = AV.avatarHTML(AV.decide({ title: 'Dating', kind: 'phone', alias: true }), { dark: true });
ok('avatarHTML · mark on dark carries outline + colours', /av-outline/.test(html) && /background:#141410/.test(html) && /<svg/.test(html));
const lh = AV.avatarHTML(AV.decide({ title: 'Hinge', kind: 'login', alias: true }), { dark: true });
ok('avatarHTML · Hinge on dark is whitened, bare', /av-whiten/.test(lh) && !/background:/.test(lh) && /logo\/Hinge.svg/.test(lh));
ok('avatarHTML · Hinge on light is NOT whitened', !/av-whiten/.test(AV.avatarHTML(AV.decide({ title: 'Hinge', kind: 'login', alias: false }))));
ok('markSVG · shopping uses evenodd (holes)', /evenodd/.test(AV.markSVG('shopping')));
ok('all 12 marks present', ['trial','business','dating','travel','shopping','email','phone','address','logins','card','bank','hide'].every(k => AV.MARKS[k] && AV.MARKS[k].length > 40));

console.log(`${n - fails}/${n} checks passed` + (fails ? ` — ${fails} FAILED` : ''));
process.exit(fails ? 1 : 0);
