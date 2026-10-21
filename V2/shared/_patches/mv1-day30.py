# MV-1 · Day30 Vault list + item detail on the av-rule. Run on the device copy.
import io, sys, re
p = sys.argv[1]
t = io.open(p, encoding='utf-8').read()
orig = t
def rep(old, new, count=1):
    global t
    assert t.count(old) == count, ('anchor count', t.count(old), old[:80])
    t = t.replace(old, new)

# ── 1 · avatarHTML(ic, it, opts): items whose art is a baked persona/property disc
#        (or no art at all) are drawn by the rule; logos, photos, cards, made
#        avatars keep their own branch.
rep("""  function avatarHTML(ic) {
    if (!ic) return '<span class="vt-av" style="background:#e0ddd6"></span>';
    var card = ic.card ? ' card' : '';""",
"""  /* ── MV-1 · the rule decides a Vault item's avatar ──────────────────────
     What is `alias` for each kind, here and nowhere else:
       phone   — generated unless `own` (a number has no host to read)
       email   — generated unless `own`; a bare local part is ours too
       login   — the login USES an alias mailbox (`login.cloaked`)
       card    — a Virtual card is Cloaked Pay's; anything else you brought
       bank · address — always yours
     The decision is cached on the item; a repaint must not change a colour. */
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
    if (!ic) return '<span class="vt-av" style="background:#e0ddd6"></span>';
    var card = ic.card ? ' card' : '';""")

# ── 2 · the list row
rep("""    return '<button class="vt-row" data-vault="' + vaultId + '" data-item="' + it.id + '">' +
      avatarHTML(it.icon) +""",
"""    return '<button class="vt-row" data-vault="' + vaultId + '" data-item="' + it.id + '">' +
      avatarHTML(it.icon, it) +""")

# ── 3 · the detail: dark top for an alias, hero avatars drawn for that ground
rep("""    if (_avInk) $('vtL3Scroll').style.setProperty('--cg-ink', _avInk);
    else $('vtL3Scroll').style.removeProperty('--cg-ink');""",
"""    if (_avInk) $('vtL3Scroll').style.setProperty('--cg-ink', _avInk);
    else $('vtL3Scroll').style.removeProperty('--cg-ink');
    /* MV-1 · an alias item's detail is dark on top (bar, hero, value rows) and
       light from the activity section down; a Virtual card keeps its own wall. */
    var _dec = (window.AV && it.kind !== 'Virtual card') ? avDecideItem(it) : null;
    $('vtL3').classList.toggle('vt-dark', !!(_dec && _dec.alias));""")
# every hero avatar in the detail passes the item and the ground
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
# loginHTML hero
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

# ── 4 · the CSS: rule avatars inside .vt-av sizing, and the dark top
rep("""<!-- ============ VAULTS ============""",
"""<style id="avRuleVault">
/* ── MV-1 · av-rule avatars in the Vault, and the alias detail's dark top ─────
   Tokens, not colours: the Vault already paints everything from --vt-bg /
   --vt-surface / --vt-ink / --vt-ink-2 / --vt-line, so an alias detail is the
   same markup with those five flipped on #vtL3, and the activity sections
   (.cg-sec) flip them back. Figma 12613:121513 / 121605 / 119053. */
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
#vtL3.vt-dark .vt-scroll { background: #fff; }
#vtL3.vt-dark .cg-sec {
  --vt-bg: #f3f1ed; --vt-surface: #ffffff;
  --vt-ink: #141410; --vt-ink-2: #84827e; --vt-line: #e0ddd6;
  color: #141410;
}
#vtL3.vt-dark .cg-sec + .cg-gap, #vtL3.vt-dark .cg-sec ~ .vt-tail { background: #f3f1ed; }
#vtL3.vt-dark .vt-bar-btn { color: #f3f1ed; background: rgba(255,255,255,.1); }
#vtL3.vt-dark .vt-bar #vtL3Star.on { color: #f3f1ed; }
#vtL3.vt-dark .cg-value:active { background: rgba(255,255,255,.06); }
#vtL3.vt-dark .cg-sw[aria-checked="false"] { background: rgba(255,255,255,.22); }
</style>
<!-- ============ VAULTS ============""")

io.open(p, 'w', encoding='utf-8').write(t)
print('MV-1 applied; +%d chars' % (len(t) - len(orig)))
