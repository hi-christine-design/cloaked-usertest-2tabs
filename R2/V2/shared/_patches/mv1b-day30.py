# MV-1b · refinements after the first render: value rows / See Details stay dark,
# hero text takes the ink token, a brand mark on the dark top is whitened.
import io, sys
p = sys.argv[1]; t = io.open(p, encoding='utf-8').read(); orig = t
def rep(old, new):
    global t
    assert t.count(old) == 1, ('anchor', t.count(old), old[:70]); t = t.replace(old, new)

# the activity / next-step sections flip back to light; the `flush` value rows do not
rep("""#vtL3.vt-dark .vt-scroll { background: #fff; }
#vtL3.vt-dark .cg-sec {""",
"""#vtL3.vt-dark .vt-scroll { background: #fff; color: var(--vt-ink); }
#vtL3.vt-dark .vt-hero-title, #vtL3.vt-dark .vt-hero-val { color: var(--vt-ink); }
#vtL3.vt-dark .vt-hero-val { color: var(--vt-ink-2); }
/* the "See Details" / lock / notes rows under the value are part of the dark top */
#vtL3.vt-dark .lgm-see, #vtL3.vt-dark .lgm-row { background: var(--vt-surface); color: var(--vt-ink); border-color: var(--vt-line); }
#vtL3.vt-dark .lgm-see:active, #vtL3.vt-dark .lgm-row:active { background: rgba(255,255,255,.06); }
#vtL3.vt-dark .lgm-l, #vtL3.vt-dark .lgm-k { color: var(--vt-ink); }
#vtL3.vt-dark .lgm-v { color: var(--vt-ink-2); }
/* a brand mark drawn by the old branch, on the dark top, too dark to read: whitened */
#vtL3.vt-dark .vt-av.mark.av-whiten { filter: brightness(0) invert(1); }
#vtL3.vt-dark .cg-sec:not(.flush) {""")
rep("""#vtL3.vt-dark .cg-sec + .cg-gap, #vtL3.vt-dark .cg-sec ~ .vt-tail { background: #f3f1ed; }""",
"""#vtL3.vt-dark .cg-sec:not(.flush) + .cg-gap, #vtL3.vt-dark .cg-sec:not(.flush) ~ .vt-tail { background: #f3f1ed; }""")

# old `img` branch: carry the rule's whiten verdict when drawing for the dark top
rep("""      var mark = /(^|\\/)logo\\//.test(ic.img) && !ic.card;""",
"""      var mark = /(^|\\/)logo\\//.test(ic.img) && !ic.card;
      /* MV-1 · on the alias detail's dark top a brand mark whose own ink is too
         dark for #141410 turns pure white (Figma 12613:119053, Hinge). The rule
         decides; this branch only carries the class. */
      var whiten = mark && it && opts && opts.dark && window.AV && avDecideItem(it).whiten;""")
rep("""      return '<span class="vt-av pic' + card + item + (mark ? ' mark' : '') +
             '" style="' + (ic.bg ? 'background-color:' + ic.bg + ';' : '') +""",
"""      return '<span class="vt-av pic' + card + item + (mark ? ' mark' : '') + (whiten ? ' av-whiten' : '') +
             '" style="' + (ic.bg ? 'background-color:' + ic.bg + ';' : '') +""")
io.open(p, 'w', encoding='utf-8').write(t); print('MV-1b applied; +%d' % (len(t) - len(orig)))
