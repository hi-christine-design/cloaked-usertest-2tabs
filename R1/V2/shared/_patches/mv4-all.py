# MV-4 · DayOne create flows on the av-rule; Day30 nq-created items file into the Vault.
#   python3 mv4-all.py <V2 dir>
# 1 av-rule.src.js: the family hash seeds on title + kind + value, so three items
#   named "test" no longer share one colour (then: build-avrule.py, test-avrule.js)
# 2 DayOne: avatarFor() answers from the rule (mark with colour on the rule's disc,
#   or the brand logo); the confirmation floods the rule's ground; the Vault row and
#   the item's detail page draw the same decision
# 3 Day30: nqFinish files the created item into VAULTS (was: Done → detail only)
import io, sys, os
V2 = sys.argv[1]
def patch(path, fn):
    t = io.open(path, encoding='utf-8').read(); o = t
    t = fn(t); io.open(path, 'w', encoding='utf-8').write(t)
    print('%-28s +%d' % (os.path.relpath(path, V2), len(t) - len(o)))
def R(t, old, new):
    assert t.count(old) == 1, ('anchor', t.count(old), old[:80]); return t.replace(old, new)

# ── 1 · the rule ─────────────────────────────────────────────────────────────
def src(t):
    assert 'MV-4' not in t
    return R(t, """    var seed = title || String(o.value || '') || kind;""",
"""    /* MV-4 · title AND kind AND value: three items all called "test" used to
       share one family (Yuan, 18 Sep: "3 个 ground 都是同样的颜色"). The same item
       still hashes the same, wherever it is drawn. */
    var seed = title + '|' + kind + '|' + String(o.value || '');""")
patch(os.path.join(V2, 'shared', 'av-rule.src.js'), src)
def tst(t):
    return R(t, """ok('same title -> same family (stable)', AV.decide({ title: 'Dating', kind: 'email', alias: true }).family === d.family);""",
"""ok('same title+kind+value -> same family (stable)', AV.decide({ title: 'Dating', kind: 'phone', alias: true }).family === d.family);
// MV-4 · three items called "test" of three kinds do not all share one family
const fams = new Set(['login', 'phone', 'email'].map(k => AV.decide({ title: 'test', kind: k, alias: false }).family));
ok('"test" × 3 kinds -> more than one family', fams.size > 1, [...fams].join(','));""")
patch(os.path.join(V2, 'shared', 'test-avrule.js'), tst)

# ── 2 · DayOne ───────────────────────────────────────────────────────────────
def d1(t):
    assert 'MV-4 ·' not in t
    # avatarFor: the rule answers first
    t = R(t, """    function avatarFor(title, kind, fallbackTone, site) {
      var t = (title || '').trim();""",
"""    function avatarFor(title, kind, fallbackTone, site, o) {
      var t = (title || '').trim();
      /* MV-4 · the rule answers: a brand logo (site · username host · value host
         · title), else a persona / property MARK in the family's colour on the
         family's disc — alias: black disc + 01 mark; yours: the 01/02 pair, deep
         or pale by hash. `tone` is the ground the confirmation floods. The disc
         files below are the fallback for a page without the rule. */
      if (window.AV && typeof window.AV.decide === 'function') {
        o = o || {};
        var dec = window.AV.decide({
          title: t, kind: kind === 'password' ? 'login' : kind, site: String(site || ''),
          user: String(o.user || ''), value: String(o.value || ''), alias: !!o.alias
        });
        if (dec.glyph.type === 'logo') {
          return { glyph: '<img src="' + dec.glyph.src.replace(/ /g, '%20') + '" alt="">',
                   tone: dec.ground, art: true, brand: true, dec: dec };
        }
        return { glyph: window.AV.markSVG(dec.glyph.key), tone: dec.ground, art: false, rule: true, dec: dec };
      }""")
    # AE reveal
    t = R(t, """        if (!st.custom) {
          var pk = avatarFor(name, kind, K.tone);
          st.glyph = pk.glyph; st.tone = pk.tone || K.tone; st.art = !!pk.art;
        }""",
"""        if (!st.custom) {
          var pk = avatarFor(name, kind, K.tone, '', { value: st.addr, alias: true });   /* MV-4 */
          st.glyph = pk.glyph; st.tone = pk.tone || K.tone; st.art = !!pk.art;
          st.rule = !!pk.rule; st.dec = pk.dec || null;
        }""")
    t = R(t, """        gav.classList.toggle('art', st.art);""",
"""        gav.classList.toggle('art', st.art);
        gav.classList.toggle('rule', !!st.rule);                                          /* MV-4 */
        gen.classList.toggle('dkg', !!(st.dec && st.dec.groundMode === 'dark'));
        f.style.setProperty('--d1-av-bg', st.dec ? st.dec.bg || 'transparent' : 'transparent');
        f.style.setProperty('--d1-av-ink', st.dec ? st.dec.ink || '#141410' : '#141410');""")
    t = R(t, """        st.custom = true; st.tone = tone; st.glyph = glyph; st.art = false;
        f.style.setProperty('--d1-tone', tone);
        var g = end.querySelector('.d1j-gav');
        g.classList.remove('art');""",
"""        st.custom = true; st.tone = tone; st.glyph = glyph; st.art = false;
        st.rule = false; st.dec = null;                                                   /* MV-4 */
        f.style.setProperty('--d1-tone', tone);
        var g = end.querySelector('.d1j-gav');
        g.classList.remove('art', 'rule');""")
    t = R(t, """            tone: st.tone, glyph: st.glyph, section: K.section, vlab: K.vlab,""",
"""            tone: st.tone, glyph: st.glyph, section: K.section, vlab: K.vlab, dec: st.dec || null,""")
    # form reveal
    t = R(t, """          var pick = avatarFor(name, cur, '#b3a266', val('site'));
          st.glyph = pick.glyph; st.tone = gwGround(pick);
          st.art = !!pick.art; st.brand = !!pick.brand;""",
"""          var pick = avatarFor(name, cur, '#b3a266', val('site'), {                   /* MV-4 */
            user: val('user'), value: value,
            alias: cur === 'password' && !!(window.AV && window.AV.isAliasValue(val('user')))
          });
          st.glyph = pick.glyph; st.tone = gwGround(pick);
          st.art = !!pick.art; st.brand = !!pick.brand;
          st.rule = !!pick.rule; st.dec = pick.dec || null;""")
    t = R(t, """        gav.classList.toggle('brand', !!st.brand);""",
"""        gav.classList.toggle('brand', !!st.brand);
        gav.classList.toggle('rule', !!st.rule);                                          /* MV-4 */
        gen.classList.toggle('dkg', !!(st.dec && st.dec.groundMode === 'dark'));
        f.style.setProperty('--d1-av-bg', st.dec ? st.dec.bg || 'transparent' : 'transparent');
        f.style.setProperty('--d1-av-ink', st.dec ? st.dec.ink || '#141410' : '#141410');""")
    t = R(t, """        st.custom = true; st.tone = tone; st.glyph = glyph;
        f.style.setProperty('--d1-tone', tone);
        gav.innerHTML = glyph;""",
"""        st.custom = true; st.tone = tone; st.glyph = glyph;
        st.rule = false; st.dec = null; gav.classList.remove('rule');                    /* MV-4 */
        f.style.setProperty('--d1-tone', tone);
        gav.innerHTML = glyph;""")
    t = R(t, """            kind: cur, name: gname.textContent, value: gval.textContent,
            tone: st.tone, glyph: st.glyph,""",
"""            kind: cur, name: gname.textContent, value: gval.textContent,
            tone: st.tone, glyph: st.glyph, dec: st.dec || null,""")
    # the Vault row draws the same decision
    t = R(t, """    var ink = m.tone ? '#141410' : '#f3f1ed';
    var it = {
      id: 'made' + (++madeN), title: m.name, desc: m.value || '', made: m,
      icon: { raw: '<span class="d1j-madeav" style="color:' + ink + '">' + (m.glyph || '') + '</span>',
              bg: m.tone || '#232321' }
    };""",
"""    var ink = m.tone ? '#141410' : '#f3f1ed';
    var it = {
      id: 'made' + (++madeN), title: m.name, desc: m.value || '', made: m,
      icon: { raw: '<span class="d1j-madeav" style="color:' + ink + '">' + (m.glyph || '') + '</span>',
              bg: m.tone || '#232321' }
    };
    /* MV-4 · a rule-decided item carries its decision; the row is drawn from it
       (avatarHTML → avRuled(undefined) → AV.avatarHTML). A custom avatar keeps
       the flow's own art above. */
    if (m.dec) { it._av = m.dec; it.icon = undefined; it.own = !m.dec.alias; }""")
    # the created item's detail page
    t = R(t, """      var av = $('d1jDetAv');
      av.innerHTML = item.glyph;
      av.style.background = item.tone || '#232321';
      av.style.color = item.tone ? '#141410' : '#f3f1ed';""",
"""      var av = $('d1jDetAv');
      av.innerHTML = item.glyph;
      av.style.background = item.tone || '#232321';
      av.style.color = item.tone ? '#141410' : '#f3f1ed';
      /* MV-4 · the rule's disc and ink; a logo sits bare */
      av.classList.toggle('rule', !!(item.dec && item.dec.glyph.type !== 'logo'));
      av.classList.toggle('logo', !!(item.dec && item.dec.glyph.type === 'logo'));
      if (item.dec) {
        av.style.background = item.dec.glyph.type === 'logo' ? 'transparent' : item.dec.bg;
        av.style.color = item.dec.ink || '#141410';
      }""")
    return t
patch(os.path.join(V2, 'DayOne', 'js', 'day01.js'), d1)
def d1css(t):
    assert 'MV-4 ·' not in t
    return t.rstrip('\n') + """

/* ══ MV-4 · the rule's mark on the confirmation card and the detail page ═════
   --d1-av-bg / --d1-av-ink are set by reveal() from AV.decide(); the disc keeps
   them through `.lit` (the tone rule below used to repaint the disc in the
   flood colour, which for an alias would erase the black disc). */
.d1j-gav.rule, .d1j-gen.lit .d1j-gav.rule {
  border-color: transparent; background: var(--d1-av-bg, transparent); color: var(--d1-av-ink, #141410);
}
.d1j-gav.rule svg { width: 100%; height: 100%; }
.d1j-det-av.rule svg { width: 100%; height: 100%; }
.d1j-det-av.logo { background: transparent !important; }
.d1j-det-av.logo img { width: 100%; height: 100%; object-fit: contain; }
/* a DARK ground (Hinge's black, a deep 02 disc) takes light ink on the page;
   the card itself is white in `.lit`, so its text stays dark */
.d1j-gen.lit.dkg .d1j-h1, .d1j-gen.lit.dkg .d1j-cta.ghost { color: #f3f1ed; }
"""
patch(os.path.join(V2, 'DayOne', 'css', 'v1-vault-add.css'), d1css)

# ── 3 · Day30: the created item goes into the Vault ─────────────────────────
def d30(t):
    assert 'MV-4 ·' not in t
    t = R(t, """  window.vtRefresh = function () { renderL2Body(true); };""",
"""  window.vtRefresh = function () { renderL2Body(true); };
  /* ── MV-4 · a created item files into the vault the list is painted from ──
     Called by the nq flow's Done. The item carries the flow's av-rule decision
     (`_av`), so the row and the detail wear the confirmation's colours. */
  var madeN = 0;
  window.vtAddMade = function (m) {
    var v = findVault(l2Vault) || VAULTS[0]; if (!v || !m) return null;
    var key = m.kind === 'password' ? 'login' : m.kind, g = null;
    v.groups.forEach(function (x) { if (x.key === key) g = x; });
    if (!g) return null;
    var it = { id: 'made' + (++madeN), title: m.title || m.value || 'Untitled', desc: m.value || '',
               own: !m.alias, made: true, log: [] };
    if (key === 'login') {
      it.login = { user: m.user || '', email: m.user || '', cloaked: !!m.alias, pass: m.pass || '',
                   strength: 3, otp: false, site: m.site || '', created: 'Just now', modified: 'Just now' };
    }
    if (key === 'card') { it.kind = 'Payment card'; it.fields = [['Card', m.value || '']]; }
    if (key === 'bank') { it.fields = [['Account', m.value || '']]; }
    if (m.dec) it._av = m.dec;
    g.items.push(it);
    renderL2Tabs(); renderL2Body(true);
    return it;
  };""")
    t = R(t, """      var g = $('nqGen'), d = $('nqDetail');
      d.classList.add('instant');
      openDetail();""",
"""      var g = $('nqGen'), d = $('nqDetail');
      d.classList.add('instant');
      openDetail();
      /* MV-4 · into the Vault as well — the value the detail just printed */
      if (typeof window.vtAddMade === 'function') {
        window.vtAddMade({ kind: S.kind, alias: !!S.alias, title: S.title, value: $('nqDV').textContent,
                           dec: S.dec || null, user: S.user, site: S.site, pass: S.pass });
      }""")
    return t
patch(os.path.join(V2, 'Day30', 'app.html'), d30)
print('MV-4 applied')
