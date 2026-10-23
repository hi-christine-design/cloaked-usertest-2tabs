# MV-2 · Day30 create flow (nq — the live one behind the Vault's "+") on the av-rule:
#   avatar + confirmation ground from AV.decide(); generating beat for an alias only;
#   no Math.random / PROP_TINTS / ICON_WALL in the decision; the detail's avatar is
#   the same decision.  (mk* is shadowed by the capture-phase nq handler and is not
#   touched; the ID-card mint keeps the card presets.)
#   python3 mv2-day30.py <V2/Day30/app.html>
import io, sys
p = sys.argv[1]; t = io.open(p, encoding='utf-8').read(); orig = t
assert 'MV-2' not in t
def rep(old, new):
    global t
    assert t.count(old) == 1, ('anchor', t.count(old), old[:80]); t = t.replace(old, new)

# ── 1 · resolveArt: the rule answers ─────────────────────────────────────────
rep("""  function resolveArt() {
    var t = String(S.title || '').toLowerCase();
    var v = String(S.value || '').toLowerCase();""",
"""  /* MV-2 · av-rule. One decision for the card, the ground and the detail:
     photo → logo (site · user host · non-alias value host · title) → persona →
     property, colours by family hash (no Math.random), multi-colour marks on
     white (the rule's own `multi`, so ICON_WALL is no longer asked). The old
     table walk below is kept as the fallback for a page without the rule. */
  function resolveArt() {
    if (window.AV && typeof window.AV.decide === 'function') {
      var dec = window.AV.decide({
        title: S.title || '', kind: S.kind, site: S.site || '', user: S.user || '',
        value: S.alias ? addr() : (S.value || ''), alias: !!S.alias
      });
      S.dec = dec;
      if (dec.glyph.type === 'logo') return { src: dec.glyph.src, tint: dec.ground, logo: true, dec: dec };
      return { src: '', mark: dec.glyph.key, tint: dec.ground, logo: false, dec: dec };
    }
    var t = String(S.title || '').toLowerCase();
    var v = String(S.value || '').toLowerCase();""")

# ── 2 · the ground is the rule's ground; ink from its mode ───────────────────
rep("""  function genGround(tint, src) {
    return genMulti(src) ? '#f3f1ed' : tint;
  }""",
"""  function genGround(tint, src) {
    if (S.dec) return S.dec.ground;          /* MV-2 */
    return genMulti(src) ? '#f3f1ed' : tint;
  }""")
rep("""    var g = $('nqGen'), ground = genGround(S.art.tint, S.art.src), light = isLight(ground);""",
"""    var g = $('nqGen'), ground = genGround(S.art.tint, S.art.src);
    var light = S.dec ? S.dec.groundMode === 'light' : isLight(ground);   /* MV-2 */""")

# ── 3 · the card's disc: the rule's mark on the rule's disc ──────────────────
rep("""    var _av = $('nqGenAv');
    _av.className = 'nq-card-av' + (S.art.logo ? ' logo' : '');
    _av.innerHTML = '<img src="' + enc(S.art.src) + '" alt="">';""",
"""    var _av = $('nqGenAv');
    _av.className = 'nq-card-av' + (S.art.logo ? ' logo' : '');
    _av.innerHTML = S.art.logo || !S.art.dec
      ? '<img src="' + enc(S.art.src) + '" alt="">'
      : window.AV.markSVG(S.art.mark);                                 /* MV-2 */
    _av.style.color = '';""")
rep("""    if (S.art.logo) { _av.style.background = ''; }
    else {
      _av.style.background = ground;
      _av.classList.add('flat');
      _av.classList.toggle('lit', isLight(ground));
    }""",
"""    if (S.art.logo) { _av.style.background = ''; }
    else if (S.art.dec) {
      /* MV-2 · the disc is the rule's: alias = black disc + family 01 mark
         (the page floods that 01), yours = the family pair. The card is white,
         so no outline is needed here. */
      _av.style.background = S.art.dec.bg;
      _av.style.color = S.art.dec.ink;
    }
    else {
      _av.style.background = ground;
      _av.classList.add('flat');
      _av.classList.toggle('lit', isLight(ground));
    }""")

# ── 4 · the generating beat is for an alias only ─────────────────────────────
rep("""      $('nqMorph').textContent = (S.kind === 'password') ? S.user : (S.value || addr());
      /* 2200, not 1500 — Yuan, 27 Aug: "can you make the process slower really
         show the color fill in". V0 and V1 were slowed on the same day; this
         build was not. */
      setTimeout(settle, 2200);
      return;""",
"""      $('nqMorph').textContent = (S.kind === 'password') ? S.user : (S.value || addr());
      /* MV-2 · nothing was generated, so nothing is "generating" (the rule,
         18 Sep: the beat is for an alias). The screen arrives on its ground. */
      if (S.dec) {
        g.style.background = ground;
        g.classList.toggle('light', light);
        $('nqGenH').textContent = saved;
        setTimeout(function () { g.classList.add('done'); }, 500);
        return;
      }
      /* 2200, not 1500 — Yuan, 27 Aug: "can you make the process slower really
         show the color fill in". V0 and V1 were slowed on the same day; this
         build was not. */
      setTimeout(settle, 2200);
      return;""")

# ── 5 · the detail's avatar is the same decision ─────────────────────────────
rep("""    $('nqDAv').className = 'nq-dav' + (a.logo ? ' logo' : '');
    $('nqDAv').innerHTML = '<img src="' + enc(a.src) + '" alt="">';""",
"""    $('nqDAv').className = 'nq-dav' + (a.logo ? ' logo' : '');
    if (a.logo || !a.dec) {
      $('nqDAv').innerHTML = '<img src="' + enc(a.src) + '" alt="">';
      $('nqDAv').style.background = ''; $('nqDAv').style.color = '';
    } else {                                                            /* MV-2 */
      $('nqDAv').innerHTML = window.AV.markSVG(a.mark);
      $('nqDAv').style.background = a.dec.bg; $('nqDAv').style.color = a.dec.ink;
    }""")

# ── CSS: the mark fills the disc ─────────────────────────────────────────────
rep("""  .nq-card-av.logo img { object-fit: contain; }""",
"""  .nq-card-av.logo img { object-fit: contain; }
  /* MV-2 · the rule's mark (40×40 currentColor) on its disc */
  .nq-card-av > svg, .nq-dav > svg { width: 100%; height: 100%; display: block; }""")
io.open(p, 'w', encoding='utf-8').write(t); print('MV-2 applied; +%d' % (len(t) - len(orig)))
