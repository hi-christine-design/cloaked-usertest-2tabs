# MV-5 · Day30 (nq flow): a login whose username is an alias mailbox is an alias
#   item — confirmation ground BLACK, and #nqDetail dark on top / light from
#   Activities down for every alias-decided item. Same logic as DayOne's MV-5.
#   python3 mv5-day30.py <V2/Day30/app.html>
import io, sys
p = sys.argv[1]; t = io.open(p, encoding='utf-8').read(); assert 'MV-5' not in t
def rep(old, new):
    global t
    assert t.count(old) == 1, ('anchor', t.count(old), old[:80]); t = t.replace(old, new)
rep("""      var dec = window.AV.decide({
        title: S.title || '', kind: S.kind, site: S.site || '', user: S.user || '',
        value: S.alias ? addr() : (S.value || ''), alias: !!S.alias
      });
      S.dec = dec;""",
"""      /* MV-5 · a login signed in with an alias mailbox is an alias item: black
         disc, black confirmation ground, dark detail top (Figma 12628-125159 /
         125136 / 124992; Yuan, 18 Sep). */
      var aliasLogin = S.kind === 'password' && window.AV.isAliasValue(S.user || '');
      var dec = window.AV.decide({
        title: S.title || '', kind: S.kind, site: S.site || '', user: S.user || '',
        value: S.alias ? addr() : (S.value || ''), alias: !!S.alias || aliasLogin
      });
      if (aliasLogin) {
        var d2 = {}; for (var k in dec) d2[k] = dec[k];
        d2.ground = '#141410'; d2.groundInk = '#f3f1ed'; d2.groundMode = 'dark'; dec = d2;
      }
      S.dec = dec;""")
rep("""    $('nqDAv').className = 'nq-dav' + (a.logo ? ' logo' : '');
    if (a.logo || !a.dec) {""",
"""    $('nqDAv').className = 'nq-dav' + (a.logo ? ' logo' : '');
    /* MV-5 · an alias item's page is dark on top, light from Activities down */
    $('nqDetail').classList.toggle('nq-dark', !!(a.dec && a.dec.alias));
    $('nqDAv').classList.toggle('whiten', !!(a.dec && a.dec.alias && a.logo && a.dec.whiten));
    if (a.logo || !a.dec) {""")
rep("""        window.vtAddMade({ kind: S.kind, alias: !!S.alias, title: S.title, value: $('nqDV').textContent,""",
"""        window.vtAddMade({ kind: S.kind, alias: !!(S.dec ? S.dec.alias : S.alias), title: S.title, value: $('nqDV').textContent,""")
rep("""  .nq-card-av > svg, .nq-dav > svg { width: 100%; height: 100%; display: block; }""",
"""  .nq-card-av > svg, .nq-dav > svg { width: 100%; height: 100%; display: block; }
  /* MV-5 · #nqDetail for an alias item: bar, head, value rows dark (Cloaked
     Black, paper ink); the band and Activities keep the light tokens. */
  #nqDetail.nq-dark { background: #fff;
    --vt-surface: #141410; --vt-ink: #f3f1ed; --vt-ink-2: rgba(243,241,237,.62); --vt-line: rgba(255,255,255,.12); }
  #nqDetail.nq-dark .nq-bar, #nqDetail.nq-dark .nq-dhead, #nqDetail.nq-dark .nq-drow,
  #nqDetail.nq-dark .nq-dmore, #nqDetail.nq-dark .nq-dsee { background: #141410; }
  #nqDetail.nq-dark .nq-dsee:active, #nqDetail.nq-dark .nq-drow:active { background: #1f1f1b; }
  #nqDetail.nq-dark .nq-dbtn, #nqDetail.nq-dark .nq-dedit { background: rgba(255,255,255,.1); color: #f3f1ed; }
  #nqDetail.nq-dark .nq-dav { box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  #nqDetail.nq-dark .nq-dav.logo.whiten img { filter: brightness(0) invert(1); }
  #nqDetail.nq-dark .nq-band, #nqDetail.nq-dark .nq-dsec, #nqDetail.nq-dark .nq-dempty, #nqDetail.nq-dark .nq-dcta {
    --vt-surface: #fff; --vt-ink: #141410; --vt-ink-2: #84827e; --vt-line: #e0ddd6; }""")
io.open(p, 'w', encoding='utf-8').write(t); print('MV-5 day30 applied')
