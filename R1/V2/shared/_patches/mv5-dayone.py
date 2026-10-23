# MV-5 · DayOne: a login whose username is an email alias is an alias item —
#   its confirmation ground is BLACK (Figma 12628-125159 / 125136) and its detail
#   page (DC-06 #d1jDetail) is dark on top, light from Activities down
#   (12628-124992 / 125087). The dark top applies to every alias item's detail,
#   which is the rule (MV-1) the Vault's own detail already follows.
#   python3 mv5-dayone.py <V2/DayOne dir>
import io, sys, os
d = sys.argv[1]
J = os.path.join(d, 'js', 'day01.js'); C = os.path.join(d, 'css', 'v1-vault-add.css')
t = io.open(J, encoding='utf-8').read(); assert 'MV-5' not in t
def rep(old, new):
    global t
    assert t.count(old) == 1, ('anchor', t.count(old), old[:80]); t = t.replace(old, new)
# confirmation: black ground for an alias login
rep("""          st.glyph = pick.glyph; st.tone = gwGround(pick);
          st.art = !!pick.art; st.brand = !!pick.brand;
          st.rule = !!pick.rule; st.dec = pick.dec || null;""",
"""          st.glyph = pick.glyph; st.tone = gwGround(pick);
          st.art = !!pick.art; st.brand = !!pick.brand;
          st.rule = !!pick.rule; st.dec = pick.dec || null;
          /* MV-5 · a login signed in with an alias mailbox lands on BLACK, not on
             the family colour (Figma 12628-125159 / 125136; Yuan, 18 Sep). */
          if (cur === 'password' && st.dec && st.dec.alias) st.tone = '#141410';""")
rep("""        gav.classList.toggle('brand', !!st.brand);
        gav.classList.toggle('rule', !!st.rule);                                          /* MV-4 */
        gen.classList.toggle('dkg', !!(st.dec && st.dec.groundMode === 'dark'));""",
"""        gav.classList.toggle('brand', !!st.brand);
        gav.classList.toggle('rule', !!st.rule);                                          /* MV-4 */
        gen.classList.toggle('dkg', !!(st.dec && st.dec.groundMode === 'dark') || st.tone === '#141410');""")
# detail: dark top for an alias item
rep("""      av.classList.toggle('rule', !!(item.dec && item.dec.glyph.type !== 'logo'));""",
"""      av.classList.toggle('rule', !!(item.dec && item.dec.glyph.type !== 'logo'));
      /* MV-5 · DC-06: an alias item's page is dark on top, light from Activities
         down — the same split the Vault's detail draws (MV-1/MV-3). */
      p.classList.toggle('dark', !!(item.dec && item.dec.alias));
      av.classList.toggle('whiten', !!(item.dec && item.dec.alias && item.dec.glyph.type === 'logo' && item.dec.whiten));""")
io.open(J, 'w', encoding='utf-8').write(t); print('MV-5 js applied')

c = io.open(C, encoding='utf-8').read(); assert 'MV-5' not in c
c = c.rstrip('\n') + """

/* ══ MV-5 · DC-06 #d1jDetail · an alias item's detail is dark on top ═════════
   Head (bar, avatar, name) and the value row take Cloaked Black with paper
   ink; Activities stays light. Figma 12628-124992 (alias) vs 125087 (not). */
.d1j-det.dark { background: #141410; }
.d1j-det.dark .d1j-det-head, .d1j-det.dark .d1j-det-vrow { background: #141410; border-color: rgba(255,255,255,.12); }
.d1j-det.dark .d1j-det-name, .d1j-det.dark .d1j-det-val, .d1j-det.dark .d1j-det-copy { color: #f3f1ed; }
.d1j-det.dark .d1j-det-vlab { color: rgba(243,241,237,.62); }
.d1j-det.dark .d1j-det-btn { background: rgba(255,255,255,.1); color: #f3f1ed; box-shadow: none; }
.d1j-det.dark .d1j-det-btn:active { background: rgba(255,255,255,.18); }
.d1j-det.dark .d1j-det-av.rule { box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
.d1j-det.dark .d1j-det-av.logo.whiten img { filter: brightness(0) invert(1); }
.d1j-det.dark .d1j-det-acts { background: #fff; }
"""
io.open(C, 'w', encoding='utf-8').write(c); print('MV-5 css applied')
