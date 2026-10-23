# MV-4c · the alias page (DC-04 #d1jAephone / DC-05 #d1jAeemail) scrolls in EVERY
# state, and Save stays on the page while the special-words box is open.
#   python3 mv4c-dayone.py <V2 dir>
# Also: the debug badge gets a live keyboard/scroll probe line (L2 panel + Copy).
import io, sys, os
V2 = sys.argv[1]
C = os.path.join(V2, 'DayOne', 'css', 'v1-vault-add.css')
R = os.path.join(V2, 'badge', 'badge-runtime.js')

c = io.open(C, encoding='utf-8').read(); assert 'MV-4c' not in c
c = c.rstrip('\n') + """

/* ══ MV-4c · the alias page scrolls in EVERY state ════════════════════════════
   Yuan, 18 Sep, after MV-4a: DC-04 "还是有滑不动页面的情况". MV-4a made the
   keyboard's ROOM follow the keyboard, but this page was still scrollable
   only WHILE a keyboard state held (`.kbf.up` or `#kbd.on`) and fell back to
   the section's `overflow: clip` the moment both dropped — a pinned layout
   whose Save ends at 731px, inside a box that may be shorter than that (a
   phone with Safari's bars out, a 13 mini, the hub's iframe). The password
   form never had this: its scroller is `overflow-y: auto` unconditionally.
   So is this one now. The only thing the section kept the clip for was its
   own drawn keyboard, `.d1j-kb`, parked below the fold with a transform (a
   transformed child extends the scrollable area); on this page it is never
   the keyboard you see — `#kbd` is — so it stands down for good. The
   `#kbd.on` rule above still shortens the box while the keys are up. */
.d1j-ae .d1j-wzs.kbf {
  overflow-x: hidden; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding-bottom: 24px;
}
.d1j-ae .d1j-wzs.kbf .d1j-kb { display: none; }
/* Save no longer hides while the words box is open (Yuan, 18 Sep: "当我点了
   include special words, continue button 就不见了"). The hide dates from when
   Save was bottom-anchored 53px short of the keys and would have covered the
   checkbox; it travels with the rows now — `top: 675px + var(--ae-wbox)`,
   declared above — so it simply moves down with them. */
.d1j-ae .d1j-wzs.words .d1j-ae-next { display: flex; }
"""
io.open(C, 'w', encoding='utf-8').write(c); print('MV-4c css applied')

# ── badge probe ──────────────────────────────────────────────────────────────
r = io.open(R, encoding='utf-8').read(); assert 'MV-4c' not in r
def rep(old, new):
    global r
    assert r.count(old) == 1, ('anchor', r.count(old), old[:80]); r = r.replace(old, new)
rep("""  var BUILD = '__BUILD__';""",
"""  var BUILD = '__BUILD__';
  /* MV-4c · a live line about the create flows' keyboard and scroll state, so
     "the page will not scroll" can be read off a screenshot instead of guessed:
     which flow · its open section · up/kbd/words · section clientH/scrollH@top
     and its overflow-y · app scrollTop · window.scrollY · visualViewport height. */
  function probe() {
    var f = document.querySelector('.d1j-flow.on');
    if (!f) return '';
    var sec = f.querySelector('.d1j-wzs.on') || f.querySelector('.d1j-fm-body');
    var kbd = document.getElementById('kbd');
    var app = document.querySelector('.app');
    var o = ['#' + (f.id || f.className.split(' ')[0])];
    if (sec) {
      var cs = getComputedStyle(sec);
      o.push('up' + (sec.classList.contains('up') ? '\\u2713' : '\\u2717'),
             'kbd' + (kbd && kbd.classList.contains('on') ? '\\u2713' : '\\u2717'),
             'words' + (sec.classList.contains('words') ? '\\u2713' : '\\u2717'),
             'sec ' + sec.clientHeight + '/' + sec.scrollHeight + '@' + Math.round(sec.scrollTop) + ' ' + cs.overflowY);
    }
    o.push('app@' + (app ? Math.round(app.scrollTop) : '-'), 'win@' + Math.round(window.scrollY || 0),
           'vv ' + (window.visualViewport ? Math.round(window.visualViewport.height) : '-') + '/' + window.innerHeight);
    return o.join(' \\u00b7 ');
  }
  var lastProbe = '';
  function paintProbe() {
    var p = probe(), el = document.getElementById('dbgProbe');
    if (!el) return;
    if (p !== lastProbe) { lastProbe = p; el.textContent = p; el.style.display = p ? '' : 'none'; }
  }""")
rep("""         '<div class="foot" style="margin-top:4px">' + esc(BUILD) + ' · layers not listed are not open · D closes · or triple-tap top-right</div>';""",
"""         '<div class="foot" style="margin-top:4px">' + esc(BUILD) + ' · layers not listed are not open · D closes · or triple-tap top-right</div>' +
         '<div class="foot" id="dbgProbe" style="margin-top:4px;display:none;font-variant-numeric:tabular-nums"></div>';""")
rep("""    if (sig !== lastSig) { lastSig = sig; paint(rows); }
  }""",
"""    if (sig !== lastSig) { lastSig = sig; lastProbe = ''; paint(rows); }
    paintProbe();
  }""")
rep("""      var t = [BUILD].concat(rows.map(function (r) {""",
"""      var t = [BUILD, probe()].filter(Boolean).concat(rows.map(function (r) {""")
io.open(R, 'w', encoding='utf-8').write(r); print('MV-4c badge probe applied')
