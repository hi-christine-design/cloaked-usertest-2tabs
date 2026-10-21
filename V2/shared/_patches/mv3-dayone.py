# MV-3 · DayOne Vault list + item detail on the av-rule (the MV-1 port), plus:
#   · Primary Phone keeps its AT&T mark (the day-1 override to a teal glyph goes)
#   · the ID-card intro's tab bar is dark by declaration, not by sampling
#   python3 mv3-dayone.py <V2/DayOne dir>
import io, sys, os
d = sys.argv[1]
J = os.path.join(d, 'js', 'day01.js'); C = os.path.join(d, 'css', 'v1-vault-add.css')
t = io.open(J, encoding='utf-8').read(); orig = t
assert 'MV-3' not in t
def rep(old, new):
    global t
    assert t.count(old) == 1, ('anchor', t.count(old), old[:80]); t = t.replace(old, new)

# ── 1 · avatarHTML(ic, it, opts): the rule draws persona/property discs and empties
rep("""  function avatarHTML(ic) {
    if (!ic) return '<span class="vt-av" style="background:#e0ddd6"></span>';""",
"""  /* ── MV-3 · the rule decides a Vault item's avatar (MV-1 on Day30) ──────
     alias per kind: login → uses an alias mailbox (`login.cloaked`); card →
     Virtual card; phone → not `own`; email → not `own` and not a real address.
     Cached on the item so a repaint never changes a colour. */
  function avAliasOf(it) {
    var g = it._group;
    if (g === 'login') return !!(it.login && it.login.cloaked);
    if (g === 'card') return it.kind === 'Virtual card';
    if (g === 'phone') return !it.own;
    if (g === 'email') return !it.own && (!/@/.test(it.desc || '') || window.AV.isAliasValue(it.desc));
    return false;
  }
  function avDecideItem(it) {
    if (it._av) return it._av;
    var L = it.login || {};
    it._av = window.AV.decide({
      title: it.title, kind: it._group === 'login' ? 'login' : it._group,
      site: L.site || it.site || '', user: L.email || '', value: it.desc || '',
      alias: avAliasOf(it)
    });
    return it._av;
  }
  /* art the rule owns: the baked persona / property discs, or nothing at all */
  function avRuled(ic) {
    return !ic || (!ic.raw && !ic.made && !ic.card && !ic.letter &&
                   (!ic.img || /avatar-Vault item\\//.test(ic.img)));
  }
  function avatarHTML(ic, it, opts) {
    if (it && window.AV && avRuled(ic)) {
      var dec = avDecideItem(it);
      return window.AV.avatarHTML(dec, { cls: 'vt-av', dark: !!(opts && opts.dark) });
    }
    if (!ic) return '<span class="vt-av" style="background:#e0ddd6"></span>';""")
# the old img branch carries the whiten verdict on a dark top
rep("""      var mark = /(^|\\/)logo\\//.test(ic.img) && !ic.card;""",
"""      var mark = /(^|\\/)logo\\//.test(ic.img) && !ic.card;
      /* MV-3 · a brand mark whose ink is too dark for the alias detail's dark
         top turns pure white; the rule decides, this branch carries the class */
      var whiten = mark && it && opts && opts.dark && window.AV && avDecideItem(it).whiten;""")
rep("""      return '<span class="vt-av pic' + card + item + (mark ? ' mark' : '') +""",
"""      return '<span class="vt-av pic' + card + item + (mark ? ' mark' : '') + (whiten ? ' av-whiten' : '') +""")

# ── 2 · the list row
rep("""    return '<button class="vt-row" data-vault="' + vaultId + '" data-item="' + it.id + '">' +
      avatarHTML(it.icon) +""",
"""    return '<button class="vt-row" data-vault="' + vaultId + '" data-item="' + it.id + '">' +
      avatarHTML(it.icon, it) +""")

# ── 3 · the detail: dark top for an alias; every hero avatar drawn for its ground
rep("""    if (_avInk) $('vtL3Scroll').style.setProperty('--cg-ink', _avInk);
    else $('vtL3Scroll').style.removeProperty('--cg-ink');""",
"""    if (_avInk) $('vtL3Scroll').style.setProperty('--cg-ink', _avInk);
    else $('vtL3Scroll').style.removeProperty('--cg-ink');
    /* MV-3 · an alias item's detail is dark on top and light from the activity
       section down; a Virtual card keeps its own wall. */
    var _dec = (window.AV && it.kind !== 'Virtual card') ? avDecideItem(it) : null;
    $('vtL3').classList.toggle('vt-dark', !!(_dec && _dec.alias));""")
rep("""        '<div class="vt-hero logo-only"><div class="vt-hero-av">' + avatarHTML(it.icon) + '</div></div>' +
        valueRowHTML(ROW_LABEL(g), it.desc || '', 'Address copied') +""",
"""        '<div class="vt-hero logo-only"><div class="vt-hero-av">' + avatarHTML(it.icon, it, { dark: avDecideItem(it).alias }) + '</div></div>' +
        valueRowHTML(ROW_LABEL(g), it.desc || '', 'Address copied') +""")
rep("""        : it.fields
        ? '<div class="vt-hero">' +
            '<div class="vt-hero-av">' + avatarHTML(it.icon) + '</div>' +""",
"""        : it.fields
        ? '<div class="vt-hero">' +
            '<div class="vt-hero-av">' + avatarHTML(it.icon, it, { dark: avDecideItem(it).alias }) + '</div>' +""")
rep("""        : '<div class="vt-hero logo-only"><div class="vt-hero-av">' + avatarHTML(it.icon) + '</div></div>' +
          valueRowHTML(ROW_LABEL(g), it.desc || '', ROW_LABEL(g) + ' copied')) +""",
"""        : '<div class="vt-hero logo-only"><div class="vt-hero-av">' + avatarHTML(it.icon, it, { dark: avDecideItem(it).alias }) + '</div></div>' +
          valueRowHTML(ROW_LABEL(g), it.desc || '', ROW_LABEL(g) + ' copied')) +""")
rep("""      '<div class="vt-hero">' +
        '<div class="vt-hero-av">' + avatarHTML(it.icon) + '</div>' +
        '<div class="vt-hero-title">' + esc(it.title) + '</div>' +
      '</div>' +
      '<div class="vt-fields">' +""",
"""      '<div class="vt-hero">' +
        '<div class="vt-hero-av">' + avatarHTML(it.icon, it, { dark: avDecideItem(it).alias }) + '</div>' +
        '<div class="vt-hero-title">' + esc(it.title) + '</div>' +
      '</div>' +
      '<div class="vt-fields">' +""")
# the day-1 Guard-off page draws the same avatar as the row
rep("""        av: avatarHTML(it.icon),""", """        av: avatarHTML(it.icon, it),""")

# ── 4 · Primary Phone keeps the carrier's mark (Yuan, 18 Sep: "primary phone icon 可否用 ATT")
rep("""      phone.guardOff = true;
      phone.icon = { glyph: 'phone', bg: '#12b3a6' };""",
"""      phone.guardOff = true;
      /* MV-3 · the seed's AT&T mark stays — Yuan, 18 Sep. (A teal phone glyph
         used to be written over it here.) */""")
io.open(J, 'w', encoding='utf-8').write(t); print('MV-3 js applied; +%d' % (len(t) - len(orig)))

# ── CSS ──────────────────────────────────────────────────────────────────────
c = io.open(C, encoding='utf-8').read(); assert 'MV-3' not in c
c = c.rstrip('\n') + """

/* ══ MV-3 · av-rule avatars in the Vault, the alias detail's dark top (MV-1's
   sheet, ported), and the ID-card intro's dark tab bar ═══════════════════════ */
.vt-av.av-rule.av-mark > svg { width: 100%; height: 100%; }
.vt-hero-av .vt-av.av-rule > svg { width: 100%; height: 100%; }
.vt-av.av-rule.av-logo { border-radius: 0; overflow: visible; background: none; }
.vt-av.av-rule.av-logo > img { width: 100%; height: 100%; object-fit: contain; }
.vt-av.av-rule.av-logo.av-whiten > img { filter: brightness(0) invert(1); }
.vt-av.av-rule.av-mark.av-outline { box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
#vtL3.vt-dark {
  --vt-bg: #141410; --vt-surface: #141410;
  --vt-ink: #f3f1ed; --vt-ink-2: rgba(243,241,237,.62); --vt-line: rgba(255,255,255,.12);
}
#vtL3.vt-dark .vt-scroll { background: #fff; color: var(--vt-ink); }
#vtL3.vt-dark .vt-hero-title, #vtL3.vt-dark .vt-hero-val { color: var(--vt-ink); }
#vtL3.vt-dark .vt-hero-val { color: var(--vt-ink-2); }
#vtL3.vt-dark .lgm-see, #vtL3.vt-dark .lgm-row { background: var(--vt-surface); color: var(--vt-ink); border-color: var(--vt-line); }
#vtL3.vt-dark .lgm-see:active, #vtL3.vt-dark .lgm-row:active { background: rgba(255,255,255,.06); }
#vtL3.vt-dark .lgm-l, #vtL3.vt-dark .lgm-k { color: var(--vt-ink); }
#vtL3.vt-dark .lgm-v { color: var(--vt-ink-2); }
#vtL3.vt-dark .vt-av.mark.av-whiten { filter: brightness(0) invert(1); }
#vtL3.vt-dark .cg-sec:not(.flush) {
  --vt-bg: #f3f1ed; --vt-surface: #ffffff;
  --vt-ink: #141410; --vt-ink-2: #84827e; --vt-line: #e0ddd6;
  color: #141410;
}
#vtL3.vt-dark .cg-sec:not(.flush) + .cg-gap, #vtL3.vt-dark .cg-sec:not(.flush) ~ .vt-tail { background: #f3f1ed; }
#vtL3.vt-dark .vt-bar-btn { color: #f3f1ed; background: rgba(255,255,255,.1); }
#vtL3.vt-dark .vt-bar #vtL3Star.on { color: #f3f1ed; }
#vtL3.vt-dark .cg-value:active { background: rgba(255,255,255,.06); }
#vtL3.vt-dark .cg-sw[aria-checked="false"] { background: rgba(255,255,255,.22); }
/* IC-01…03 · the day-one intro is a dark page, so its tab bar is dark by
   DECLARATION (Yuan, 18 Sep: "整个页面是 darkmode，所以 navigation 也应该是 dark
   mode"). The scroll-sampled theme already said `video` here most of the time;
   this stops it depending on a sample landing. */
body.idcard-open:has(#idcardScreen.empty.open) .bottom-nav {
  background: #0b0b0a; border-top-color: transparent;
  backdrop-filter: none; -webkit-backdrop-filter: none;
}
body.idcard-open:has(#idcardScreen.empty.open) .bottom-nav .nav-item { color: rgba(255,255,255,.5); }
body.idcard-open:has(#idcardScreen.empty.open) .bottom-nav .nav-item.active { color: #fff; }
"""
io.open(C, 'w', encoding='utf-8').write(c); print('MV-3 css applied')
