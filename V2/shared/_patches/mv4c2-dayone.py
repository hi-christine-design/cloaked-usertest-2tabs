# MV-4c (part 2, JS) · "+ Include special words" opens a box that stays open.
#   python3 mv4c2-dayone.py <V2/DayOne dir>
# Found while verifying MV-4c (DC-05 #d1jAeemail). Three handlers each did the
# right thing alone and closed the box together:
#   1 the pill is a tap outside the field, so the keyboard module's deferred
#     hide() fired after the click that opened the box, and kbdOnToggle(off)
#     closed it — the pill and its box are marked data-kbd-keep;
#   2 a keep-zone tap re-focuses the field the keyboard had ("keep the caret in
#     the field") — but the pill has already moved focus to the words field, so
#     the timer put focus back on Title, whose focusin closes the box. The
#     re-focus now yields when focus has already landed on a keyboard field;
#   3 the setup's own focusin closes the box for any focus outside it; the pill
#     (focusable, in the keep zone) is not "outside".
import io, sys, os
J = os.path.join(sys.argv[1], 'js', 'day01.js')
t = io.open(J, encoding='utf-8').read(); assert 'MV-4c' not in t
def rep(old, new):
    global t
    assert t.count(old) == 1, ('anchor', t.count(old), old[:80]); t = t.replace(old, new)
# 1 · the pill and the box are part of typing
rep("""            '<button class="d1j-cta ghost d1j-ae-words" type="button">' + esc(K.more) + '</button>' +""",
"""            /* MV-4c · data-kbd-keep: this tap opens a field, so it must not
               also count as the tap that dismisses the keyboard — the module's
               deferred hide() landed after openWords() and closed the box
               through kbdOnToggle (measured: `words` gone, keys gone, `.up`
               left standing). Same zone the family flow's Continue is in. */
            '<button class="d1j-cta ghost d1j-ae-words" type="button" data-kbd-keep="1">' + esc(K.more) + '</button>' +""")
rep("""        return '<div class="d1j-ae-wbox">' +""",
"""        return '<div class="d1j-ae-wbox" data-kbd-keep="1">' +""")
# 2 · the keep-zone re-focus yields to a field that already took focus
rep("""    if (inKeepZone(e.target)) { /* keep it up, and keep the caret in the field */
      var t = target;
      setTimeout(function () { try { t.focus({ preventScroll: true }); } catch (err) { t.focus(); } }, 0);
      return;
    }""",
"""    if (inKeepZone(e.target)) { /* keep it up, and keep the caret in the field */
      /* MV-4c · by the time this fires the tap may itself have moved focus to
         another keyboard field (the alias page's words pill opens one). Putting
         the caret back in the OLD field then blurred the new one and closed
         what the tap had opened. A field that already has focus is the answer;
         otherwise the keyboard's current field, read now rather than captured. */
      setTimeout(function () {
        var a = document.activeElement;
        if (a && a.hasAttribute && a.hasAttribute('data-kbd')) return;
        if (!target) return;
        try { target.focus({ preventScroll: true }); } catch (err) { target.focus(); }
      }, 0);
      return;
    }""")
# 3 · the setup's focusin does not treat the pill as "outside the box"
rep("""        if (tray && !tray.contains(e.target)) closeWords();""",
"""        if (tray && !tray.contains(e.target) &&
            !(e.target.closest && e.target.closest('[data-kbd-keep]'))) closeWords();   /* MV-4c */""")
io.open(J, 'w', encoding='utf-8').write(t); print('MV-4c js applied')
