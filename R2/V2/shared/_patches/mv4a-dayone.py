# MV-4a · DayOne create flows: the keyboard reservation follows the keyboard, not
# the form's own `.up` bookkeeping. CSS only, appended to css/v1-vault-add.css.
import io, sys
p = sys.argv[1]; t = io.open(p, encoding='utf-8').read()
assert 'MV-4a' not in t
t = t.rstrip('\n') + """

/* ══ MV-4a · the reservation follows the KEYBOARD, not the form's `.up` ═══════
   Yuan, 18 Sep: on DC-01 (#d1jForm), DC-04 (#d1jAephone) and DC-05 (#d1jAeemail),
   "当我填完了 form，无法往上滑，所以滑不到 button 处… 不是每次都会有 bug".
   Two owners of "the keyboard is up" (CLAUDE.md): the keys themselves are the
   app's — #kbd.on, pinned by kbdPin('form') so they stay for the whole form —
   but the ROOM the form leaves for them was keyed on its own `.kbf.up`, which
   focusin adds and focusout removes 60ms later. Tap anywhere that is not a
   field and `.up` is gone: the scroller grows back to full height while the
   keys stay painted over its bottom 291px, and Continue is under them with
   nothing left to scroll. Swipe without ever blurring and it works — hence
   "偶尔又是对的".
   Every `.kbf.up` reservation below has a twin keyed on the fact instead:
   `.phone-frame:has(#kbd.on)`. Same declarations, so the two never disagree;
   the `.up` rules stay for the frame before the keys have been asked for. */
.phone-frame:has(#kbd.on) .d1j-wzs.kbf .d1j-fhead { padding-top: 120px; }
.phone-frame:has(#kbd.on) .d1j-wzs.kbf .d1j-foot { bottom: calc(var(--d1-kbh) + 20px); }
.phone-frame:has(#kbd.on) .d1j-wzs.kbf .d1j-fm-body.rows { bottom: var(--d1-kbh); padding-bottom: 24px; }
.phone-frame:has(#kbd.on) .d1j-flow:has(> .d1j-sug.on) .d1j-wzs.kbf .d1j-fm-body.rows {
  bottom: calc(var(--d1-kbh) + 56px);
}
.phone-frame:has(#kbd.on) .d1j-ae .d1j-wzs.kbf {
  bottom: var(--d1-kbh);
  overflow-x: hidden; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding-bottom: 24px;
}
.phone-frame:has(#kbd.on) .d1j-ae .d1j-wzs.kbf .d1j-kb { display: none; }
.phone-frame:has(#kbd.on) .d1j-ae .d1j-wzs.kbf .d1j-ae-next { top: 675px; bottom: auto; z-index: 3; }
.phone-frame:has(#kbd.on) .d1j-ae .d1j-wzs.kbf.words::after { display: none; }
"""
io.open(p, 'w', encoding='utf-8').write(t); print('MV-4a applied')
