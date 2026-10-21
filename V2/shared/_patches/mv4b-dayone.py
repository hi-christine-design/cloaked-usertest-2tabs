# MV-4b · DayOne alias flows (DC-04 #d1jAephone / DC-05 #d1jAeemail) + Done landing.
#   python3 mv4b-dayone.py <V2/DayOne dir>
# 1 finishFlow lands on the Vault tab, not the ID card tab
# 2 a created item files into the Vault's own store (this build never mounts #d1jVault)
# 3 the alias ending gets its generating beat: dark page, outlined card, the value you
#   own morphs character by character into the alias, then the flood
import io, sys, os
d = sys.argv[1]
J = os.path.join(d, 'js', 'day01.js'); C = os.path.join(d, 'css', 'v1-vault-add.css')
t = io.open(J, encoding='utf-8').read(); orig = t
assert 'MV-4b' not in t, 'already applied'
def rep(old, new):
    global t
    assert t.count(old) == 1, ('anchor count', t.count(old), old[:90]); t = t.replace(old, new)

# ── 1 · Done lands on the Vault ─────────────────────────────────────────────
rep("""      if (othPage) othPage.classList.remove('on');
      add.classList.remove('on');
      if (typeof window.goTab === 'function') window.goTab('idcard');
    }""",
"""      if (othPage) othPage.classList.remove('on');
      add.classList.remove('on');
      /* MV-4b · 'vaults', not 'idcard': in this build the ID card is its own
         tab and the Vault is #vaultsScreen — the flow was opened from the Vault's
         "+", so Done goes back to the Vault (Yuan, 18 Sep: "最后一步 done，回来就
         不在 Vault 了，而是在 ID card empty state"). */
      if (typeof window.goTab === 'function') window.goTab('vaults');
    }""")

# ── 2 · filing: the Vault's store, through the hook the VAULTS block publishes ─
rep("""      if (!$('d1jVault') && window.d1vAddMade) return window.d1vAddMade(item);""",
"""      /* MV-4b · this build never mounts #d1jVault (its list is painted from
         VAULTS), so the row used to go nowhere. The list's own module takes the
         item and repaints; the flow's record rides along as `made`, so the row
         opens the flow's detail page (d1jOpenMade) rather than a vault page
         built for seeded data. */
      if (!$('d1jVault')) {
        if (typeof window.vtAddMade === 'function') { window.vtAddMade(item); return; }
        if (window.d1vAddMade) return window.d1vAddMade(item);
        return;
      }""")
rep("""    window.d1jMadeRow = function (item) { return createdRow(item, 'd1j-row'); };""",
"""    window.d1jMadeRow = function (item) { return createdRow(item, 'd1j-row'); };
    /* MV-4b · the Vault list's row for a created item opens this page */
    window.d1jOpenMade = function (item) { openDetail(item, null); };""")
rep("""  window.vtRefresh = function () { renderL2Body(true); };""",
"""  window.vtRefresh = function () { renderL2Body(true); };
  /* ── MV-4b · a created item files into the store the list is painted from ──
     The day-1 flows hand over their own record ({kind, name, value, tone,
     glyph, section, …}); it becomes a list item whose detail is still the
     flow's page (openItem delegates through `made`). The avatar is the flow's
     disc or glyph on its tone, drawn by avatarHTML's `raw` branch. */
  var madeN = 0;
  var MADE_KEY = { 'Password': 'login', 'Phone': 'phone', 'Email': 'email',
                   'Bank account': 'bank', 'Payment card': 'card', 'Others': 'other' };
  window.vtAddMade = function (m) {
    var v = VAULTS[0]; if (!v || !m) return null;
    var key = MADE_KEY[m.section] || 'other', g = null;
    v.groups.forEach(function (x) { if (x.key === key) g = x; });
    if (!g) { g = { key: key, label: m.section || 'Others', items: [] }; v.groups.push(g); }
    var ink = m.tone ? '#141410' : '#f3f1ed';
    var it = {
      id: 'made' + (++madeN), title: m.name, desc: m.value || '', made: m,
      icon: { raw: '<span class="d1j-madeav" style="color:' + ink + '">' + (m.glyph || '') + '</span>',
              bg: m.tone || '#232321' }
    };
    g.items.push(it);
    if (typeof renderL2Tabs === 'function') renderL2Tabs();
    renderL2Body(true);
    return it;
  };""")
rep("""  function openItem(vaultId, itemId) {
    var it = findItem(vaultId, itemId); if (!it) return;""",
"""  function openItem(vaultId, itemId) {
    var it = findItem(vaultId, itemId); if (!it) return;
    /* MV-4b · a created item's page is the flow's own (see vtAddMade) */
    if (it.made && typeof window.d1jOpenMade === 'function') { window.d1jOpenMade(it.made); return; }""")

# ── 3 · the generating beat ─────────────────────────────────────────────────
# copy: the build's own, by kind — not Figma's
rep("""        fallback: 'Email alias', count: true""",
"""        fallback: 'Email alias', count: true,
        gen: 'Generating your email now...', made: 'Your email is created!'""")
rep("""        cta: 'Add contact', fallback: 'Phone alias', count: false""",
"""        cta: 'Add contact', fallback: 'Phone alias', count: false,
        gen: 'Generating phone number now...', made: 'Your phone number is created!'""")

# the morph, beside scramble (which other paths still use)
rep("""    /* ── slot scramble: characters shuffle and resolve left → right ──────── */""",
"""    /* ── MV-4b · the value morph: what you own becomes the alias ───────────
       Yuan, 18 Sep: "跟 ID card 那个 generate 动画很像… character 从 blur to clear
       and to blur 这样变化最终变成新的 email/phone", and not a sweep. The ID
       card's mint (paintReview) is the model: every character has its own
       start and its own settle, so the string never wipes left→right. It
       begins as the value already yours (K.fwd), each character blurs out on
       its own clock, churns while blurred, and sharpens into the alias's
       character. A character both strings share (the phone's hyphens) never
       moves. Trailing cells the shorter string lacks are invisible (.gap) and
       fade in or out inside the blur, so a longer alias does not jump. */
    function morph(el2, from, to, done) {
      if (RM) { el2.textContent = to; if (done) done(); return; }
      var n = Math.max(from.length, to.length), cells = [], i;
      el2.innerHTML = '';
      for (i = 0; i < n; i++) {
        var a = from.charAt(i), b = to.charAt(i);
        var s = document.createElement('span');
        s.className = 'mc' + (a ? '' : ' gap');
        s.textContent = a || b || '\\u00a0';
        el2.appendChild(s);
        var out = 5 + Math.floor(Math.random() * 14);            /* frame the blur begins */
        cells.push({ el: s, a: a, b: b, fixed: a === b, out: out,
                     set: out + 12 + Math.floor(Math.random() * 18) }); /* frame it settles */
      }
      var frame = 0, DONE = 8;
      cells.forEach(function (c) { if (!c.fixed) DONE = Math.max(DONE, c.set + 5); });
      var AZ = 'abcdefghijklmnopqrstuvwxyz';
      function churn(c) {
        var want = c.b || c.a;
        return /[0-9]/.test(want) ? String((Math.random() * 10) | 0) : AZ.charAt((Math.random() * 26) | 0);
      }
      function tick() {
        cells.forEach(function (c) {
          if (c.fixed || frame < c.out) return;                  /* still the real thing, clear */
          if (frame < c.set) {                                   /* blurred, churning */
            if (c.el.className !== 'mc roll') c.el.className = 'mc roll';
            c.el.textContent = churn(c);
            return;
          }
          if (frame < c.set + 3) {                               /* sharpening onto the alias */
            c.el.textContent = c.b || '\\u00a0';
            c.el.className = 'mc settling' + (c.b ? '' : ' gap');
            return;
          }
          c.el.textContent = c.b || '\\u00a0'; c.el.className = 'mc' + (c.b ? '' : ' gap');
        });
        frame++;
        if (frame > DONE) { el2.textContent = to; if (done) done(); return; }
        setTimeout(tick, 50);
      }
      tick();
    }

    /* ── slot scramble: characters shuffle and resolve left → right ──────── */""")

# reveal(): generating → morph → flood → created
rep("""        gen.className = 'd1j-gen';
        f.style.setProperty('--d1-tone', st.tone);
        var gav = end.querySelector('.d1j-gav');
        gav.classList.toggle('art', st.art);
        gav.innerHTML = st.glyph;
        end.querySelector('.d1j-gname').textContent = name;
        end.querySelector('.d1j-gval').textContent = st.addr;
        end.querySelector('.d1j-gval').classList.toggle('sm', st.addr.length > 22);
        carousel(end.querySelector('.d1j-h1'),
          kind === 'phone' ? 'Your phone number is created!' : 'Your email is created!', true);
        requestAnimationFrame(function () {
          gen.classList.add('card-in');
          setTimeout(function () {
            gen.classList.add('flood');
            setTimeout(function () {
              gen.classList.add('lit');
              bar(3);           /* the last segment fills as the card lands */
              setTimeout(function () { gen.classList.add('done'); }, 470);
            }, RM ? 0 : 660);
          }, RM ? 0 : 190);
        });""",
"""        /* MV-4b · the generating beat this ending skipped (Yuan, 18 Sep: "如果
           是 alias，在 generating 的时候多留一点时间，还会有一个真的 number 变成
           alias number 的动画"). Dark page, outlined card, the value you already
           own on it; the characters morph into the alias; then the flood, the
           card lights and the headline turns to "created". `dark` on the flow
           is what wizard B sets for the same beat — the progress bar and the ✕
           follow it. */
        gen.className = 'd1j-gen';
        f.classList.add('dark');
        f.style.setProperty('--d1-tone', st.tone);
        var gav = end.querySelector('.d1j-gav');
        gav.classList.toggle('art', st.art);
        gav.innerHTML = st.glyph;
        end.querySelector('.d1j-gname').textContent = name;
        var gval = end.querySelector('.d1j-gval'), h1 = end.querySelector('.d1j-h1');
        var from = K.fwd || '';
        gval.textContent = from;
        gval.classList.toggle('sm', Math.max(st.addr.length, from.length) > 22);
        carousel(h1, K.gen, true);
        requestAnimationFrame(function () {
          gen.classList.add('card-in');
          setTimeout(function () {
            morph(gval, from, st.addr, function () {
              gen.classList.add('flood');
              setTimeout(function () {
                gen.classList.add('lit');
                f.classList.remove('dark');
                carousel(h1, K.made);
                bar(3);           /* the last segment fills as the card lands */
                setTimeout(function () { gen.classList.add('done'); }, 470);
              }, RM ? 0 : 660);
            });
          }, RM ? 0 : 520);
        });""")
# reopening after a ✕ mid-animation must not keep the dark chrome
rep("""          end.querySelector('.d1j-gen').className = 'd1j-gen';
          f.classList.add('on');""",
"""          end.querySelector('.d1j-gen').className = 'd1j-gen';
          f.classList.remove('dark');   /* MV-4b · a ✕ mid-generate leaves it set */
          f.classList.add('on');""")
io.open(J, 'w', encoding='utf-8').write(t)
print('MV-4b js applied; +%d' % (len(t) - len(orig)))

# ── CSS ──────────────────────────────────────────────────────────────────────
c = io.open(C, encoding='utf-8').read(); assert 'MV-4b' not in c
c = c.rstrip('\\n') + """

/* ══ MV-4b · the alias ending's generating beat, and created rows in the list ═
   The value morph (buildAliasFlow → morph): a character mid-flight is blurred
   and takes the item's tone, like the ID card mint's rolling characters take
   the card's; it sharpens and returns to ink as it settles. Cells the shorter
   string lacks are .gap — present for layout, invisible — and fade inside the
   blur so a longer alias does not jump into place. */
.d1j-gval .mc { transition: filter .16s linear, color .16s linear, opacity .16s linear; }
.d1j-gval .mc.gap { opacity: 0; }
.d1j-gval .mc.roll {
  color: var(--d1-tone); filter: blur(2.4px); opacity: 1;
  text-shadow: 0 0 10px currentColor;
}
.d1j-gval .mc.settling { filter: blur(1.1px); opacity: 1; text-shadow: 0 0 8px var(--d1-tone); }
.d1j-gval .mc.settling.gap { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .d1j-gval .mc { transition: none; }
}
/* A created item's avatar in the Vault list: the flow's disc (an <img> of the
   vault's own 40px art) fills the slot; a glyph from the custom-avatar sheet
   sits 22px on the tone — the same two shapes .d1j-av-tone drew. */
.vt-av.raw > .d1j-madeav { display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; }
.vt-av.raw > .d1j-madeav > img { width: 100%; height: 100%; display: block; border-radius: 50%; object-fit: cover; }
.vt-av.raw > .d1j-madeav > svg { width: 22px; height: 22px; display: block; }
"""
io.open(C, 'w', encoding='utf-8').write(c)
print('MV-4b css applied')
