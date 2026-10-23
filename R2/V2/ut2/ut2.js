/* ─────────────────────────────────────────────────────────────────────────
   UT2 · research-round-2 changes (16 Oct 2026)

   Loaded at the end of V2/Day30/app.html and V2/DayOne/app.html. It changes
   nothing in the build's own code: it renames, reorders and adds on top, so
   ?ut2=before is the original V2 exactly as it was tested.

   URL
     ut2=after|before      default after
     ut2name=identity|folder|aliasid   what "ID card" is called (default identity)
     ut2go=c1…c4, c6, c7    open the screen for that change and ring it

   The seven changes (same ids as the launcher's slides)
     c1  Rename "ID card"
     c2  One vocabulary + a line under each section title
     c3  "Generate" leads in the email / phone tray
     c4  Your own info kept apart from aliases
     (c5 "a create button on every tab" was dropped 16 Oct: it was the
      client deck's recommendation, not something members said)
     c6  The alias option on top of "Add an item"
     c7  "Here's how it works" after creating (on the item's own page since v21)
     v20 ID cards only group Vault items
     v21 No "Your … is created!" page: creating opens the item's page
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  var MODE = (Q.get('ut2') || 'after').toLowerCase() === 'before' ? 'before' : 'after';
  var NAME = (Q.get('ut2name') || 'identity').toLowerCase();
  var TOGGLE = (Q.get('ut2cards') || 'tab').toLowerCase() === 'toggle';   /* 19: ID cards inside the Vault */
  /* 22 · Christine, 20 Oct: two onboarding options.
     inside  — Home's "Be yourself without exposing yourself" card moves into
               the Vault (where the "What's vault" banner was) and opens the
               Vault intro; Home keeps only "Your protection journey".
     outside — Home as it is; the Vault has only its one-line description.
     (first = the old page-first version, kept for the URL only.) */
  var INTRO = (Q.get('ut2intro') || 'outside').toLowerCase();   /* 21 Oct: outside is the one kept */
  if (INTRO === 'banner') INTRO = 'inside';
  var BANNER = INTRO === 'inside';
  var GO = (Q.get('ut2go') || '').toLowerCase();
  var DAY1 = /\/DayOne\//.test(location.pathname);
  var AFTER = MODE === 'after';
  /* Christine, 22 Oct: the Identity tab is Yuan's V3, whole (v3id1.js/.css, built
     by port/gen1.py from 03_UserTest_V1/V3). Our own Identities layers (r21–r27)
     stand down; they are kept in _archive/04_UserTest_V2_r28-before-V3-identity.
     ?ut2v3id=0 brings ours back. Both days (v3id1 / v3id30). */
  var V3ID = AFTER && Q.get('ut2v3id') !== '0';
  /* Christine, 22 Oct: the launcher's "Vault onboarding" tab — V1 = ours (tray +
     intro page, Figma 9822:113803), V2 = Yuan's V3 Vault intro (v3vonb*.js/.css,
     port/genvonb.py), with &ut2vonb=2 */
  var VONB2 = AFTER && Q.get('ut2vonb') !== '1';   /* round 37 (client share): Yuan's is the default; &ut2vonb=1 for ours */
  if (VONB2 && !window.UT2_V3VONB) {
    var VNV = ((document.currentScript && document.currentScript.src) || '').split('?')[1] || '';
    var VNF = '../ut2/v3vonb' + (DAY1 ? '1' : '30');
    document.documentElement.classList.add('ut2-vonb2');
    document.write('<link rel="stylesheet" href="' + VNF + '.css' + (VNV ? '?' + VNV : '') + '"><script src="' + VNF + '.js' + (VNV ? '?' + VNV : '') + '"></scr' + 'ipt>');
    /* Christine, 23 Oct: Vault onboarding V2 (Figma 9890:138727) — Yuan's tray, then our scroll page (&ut2vonb=n = V2.1, n2 = V2.2) */
    if (/^n[23]?$/.test(Q.get('ut2vonb') || '')) document.write('<link rel="stylesheet" href="../ut2/vonbn.css' + (VNV ? '?' + VNV : '') + '"><script src="../ut2/vonbn.js' + (VNV ? '?' + VNV : '') + '"></scr' + 'ipt>');
  }
  /* the launcher's Vault onboarding rows land on the Vault with its tray already up */
  if (AFTER && Q.get('ut2vonbgo') === '1') window.addEventListener('load', function () {
    setTimeout(function () {
      if (VONB2) { if (window.vtIntroTray) window.vtIntroTray(); }
      else { ONB.want = true; VTRAY.done = true; showVaultTray(); }
    }, 900);
  });
  if (V3ID && !window.UT2_V3ID) {
    var V3V = ((document.currentScript && document.currentScript.src) || '').split('?')[1] || '';
    document.documentElement.classList.add('ut2-v3id');
    var V3F = '../ut2/v3id' + (DAY1 ? '1' : '30');
    document.write('<link rel="stylesheet" href="' + V3F + '.css' + (V3V ? '?' + V3V : '') + '"><script src="' + V3F + '.js' + (V3V ? '?' + V3V : '') + '"></scr' + 'ipt>');
  }

  var NAMES = {
    identity: { one: 'identity', many: 'identities', a: 'an' },
    folder:   { one: 'folder',   many: 'folders',    a: 'a'  },
    aliasid:  { one: 'alias ID', many: 'alias IDs',  a: 'an' },  /* Christine, 21 Oct: a third name to test */
    idcard:   { one: 'ID card',  many: 'ID cards',   a: 'an' }   /* 21 Oct: 1 Tab · ID cards — "Folders" are real folders now */
  };
  var N = NAMES[NAME] || NAMES.identity;
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var REAL_EMAIL = 'Margaret611@gmail.com', REAL_PHONE = '523-256-2345';

  if (AFTER) document.documentElement.classList.add('ut2-after');
  if (AFTER && DAY1) document.documentElement.classList.add('ut2-intro-' + INTRO);
  /* 19 · Christine, 20 Oct: 1 Tab has two versions. cards = Folders is the ID
     card wallet (as before). list = ID cards are Vault items (an "Identities"
     filter beside Alias), and Folders is a list of folders (Figma 9603:70649)
     with "Favorites", where an ID card goes when you pin it. */
  var LISTV = AFTER && TOGGLE && (Q.get('ut2fold') || 'cards').toLowerCase() === 'list';
  if (LISTV) document.documentElement.classList.add('ut2-foldlist');
  if (AFTER && TOGGLE) document.documentElement.classList.add('ut2-toggle');

  /* v20 — an ID card now groups what already exists, so there is nothing to
     mint. The build's mint is one setInterval(tick, 45) of 46 frames in
     paintReview() (both days); run it at 1ms so the card lands ready, and
     hide the minting face for those few frames (ut2.css). Nothing else in the
     build uses a 45ms "tick". */
  if (AFTER) {
    var _si = window.setInterval, _ci = window.clearInterval, CLEARED = {};
    window.clearInterval = function (id) { CLEARED[id] = 1; return _ci.apply(this, arguments); };
    window.setInterval = function (fn, ms) {
      if (ms === 45 && typeof fn === 'function' && fn.name === 'tick' && !(document.documentElement.classList.contains('ut2-iccalias') && !document.documentElement.classList.contains('ut2-ghostcc'))) {
        /* 12 frames per 1ms tick; stop the moment the build clears it */
        var id = _si(function () { for (var k = 0; k < 12 && !CLEARED[id]; k++) fn(); }, 1);
        return id;
      }
      return _si.apply(this, arguments);
    };
  }
  document.documentElement.setAttribute('data-ut2', MODE);
  document.documentElement.setAttribute('data-ut2-name', NAME);

  /* ═════════ text engine (after only) ═════════
     Every visible text node and a few attributes pass through rules().
     A MutationObserver re-runs it on whatever the build renders later, and
     remembers what it wrote so its own writes don't loop.                 */
  var WROTE = new WeakMap();
  var MID = false;
  var TRIES = new WeakMap();

  /* C1 — "ID card" → the chosen name, with the article and case fixed */
  function rename(s, mid) {
    if (!/ID [Cc]ard/.test(s)) return s;
    s = s.replace(/\b([Aa])n?(\s+)(?=ID [Cc]ard)/g, function (m, A, sp) {
      return (A === 'A' ? cap(N.a) : N.a) + sp;
    });
    return s.replace(/ID [Cc]ard(s?)/g, function (m, pl, off, str) {
      var w = pl ? N.many : N.one;
      var before = str.slice(0, off);
      return ((/^\s*$/.test(before) && !mid) || /[.!?:]\s*$/.test(before)) ? cap(w) : w;
    });
  }
  /* C2 — one word for one thing, everywhere */
  var VOCAB = {
    'Vaults': 'Vault',
    'Create Identity': 'Create ' + N.one,
    'Create identity': 'Create ' + N.one,
    'Edit Identity': 'Edit ' + N.one,
    'Edit identity': 'Edit ' + N.one,
    'Identity alias': 'Aliases',
    'Show all items': 'Show all',   /* identity page (Figma 9706:64459) */
    'Total identity alias': 'Total aliases',
    'Identity created': cap(N.one) + ' created',
    'Identity deleted': cap(N.one) + ' deleted',
    'What is an identity?': 'What is ' + N.a + ' ' + N.one + '?',
    'Hide identity': 'Use an alias',
    'Hide your real identity': 'Hide your real info',
    'When should I use virtual identity?': 'When should I use an alias?',
    'Your real identity stays private. Use a different identity for every part of your life.':
      'Your real info stays private. Use ' + N.a + ' ' + N.one + ' for each part of your life.'
  };
  /* Christine, 19 Oct (Figma 9561:65816): the Vault-toggle version says
     "Vaults" — header and tab bar — so the one-word rule keeps the plural there. */
  if (TOGGLE) delete VOCAB['Vaults'];
  /* C3 · C4 — scoped to the tray rows only */
  function trayType(s) {
    var m = /phone number|phone|payment card|card|email/i.exec(s);
    return m ? m[0].toLowerCase() : 'email';
  }
  function scoped(el, s) {
    if (!el.closest) return s;
    if (el.closest('[data-nqpick="real"],[data-addemail="existing"],.d1j-tray-row[data-tray="own"]') &&
        /^\s*Add\b/i.test(s)) return 'Save my own ' + trayType(s);
    if (el.closest('[data-nqpick="alias"],[data-addemail="alias"],.d1j-tray-row[data-tray="alias"]') &&
        /(Create|Generate)/i.test(s)) return 'Generate an alias ' + trayType(s);
    if (el.closest('.d1j-tray-h') && /^\s*Add an? /i.test(s)) return cap(trayType(s));
    /* the "?" help sheet calls the thing a bare "card" */
    if (el.closest('#icHelpSheet')) s = s.replace(/\b(One|a|the|that|own) card\b/g, function (m, w) { return (w === 'a' ? N.a : w) + ' ' + N.one; });
    /* 09 — Risk level left as the build has it (Christine, 20 Oct: Home already covers it; "New" was wrong) */
    /* v20 — Day 1 ID card intro: the CTA groups too */
    if (el.closest('.ici-btn') && /^\s*Create ID [Cc]ard\s*$/.test(s)) return TOGGLE ? 'Group aliases' : 'Create ' + N.a + ' ' + N.one;   /* 2 Tabs (21 Oct): it opens openIdFlow */
    /* v20 — the ID card's pick page */
    if (el.closest('#iccTitle') && /^\s*Add items manually\s*$/.test(s)) return 'Pick from your Vault';
    /* 10 — say where the words go before asking for them */
    if (el.closest('#iccSub') && /^\s*Add words that are meaningful/i.test(s))
      return 'These words go into your new email address, like trip.river@cloaked.id. Skip to get a random one.';
    /* Christine, 22 Oct (Figma 9714:75743): the identity page's tabs read Calls · Message · Mailbox · Login */
    if (el.closest('#icTabs')) {
      if (/^\s*Messages\s*$/.test(s)) return 'Message';
      if (/^\s*Passwords?\s*$/.test(s)) return 'Login';
    }
    /* Activity (Christine, 20 Oct): the state tabs read Inbox / Urgent */
    if (el.closest('#avStickTabs')) {
      if (/^\s*Unread\s*$/.test(s)) return 'Inbox';
      if (/^\s*(Compromised|Critical)\s*$/.test(s)) return 'Urgent';
    }
    /* Christine, 22 Oct (Figma 9817:112807): the start-here step's title */
    if (el.closest('#wfFoundTitle')) {
      if (/^\s*Margaret, start here\.\s*$/.test(s)) return 'Be with yourself without';
      if (/^\s*Biggest difference\.\s*$/.test(s)) return 'exposing yourself';
    }
    /* Christine, 22 Oct: the Identities intro's title (its line under stays) */
    if (el.closest('#iciA h1') && /hands out the real you/.test(s)) return 'Create alias based on your situation';
    /* Day 30's intro bar says "ID card" (Day 01's "ID cards" → Identities already): the tab's name, plural */
    if (el.closest('.ici-brand') && /^\s*ID cards?\s*$/.test(s)) return cap(N.many);
    /* Christine, 22 Oct (later): the line under says what an identity is */
    if (el.closest('#iciA p')) {
      if (/Data removal cleans up the past|You show up differently/.test(s)) return 'Aliases grouped for one part of your life.';
      if (/stop tomorrow|you only get one you/.test(s)) return 'Use them anywhere, without giving out your real info.';
    }
    /* 14 — Day 1 opening copy (Cloaked team, 16 Oct) */
    if (el.closest('#homeGreeting')) {
      if (/^\s*Margaret, start here\.\s*$/.test(s)) return 'Every sign up hands';
      if (/^\s*Biggest difference\.\s*$/.test(s)) return 'out the real you.';
    }
    /* Christine, 22 Oct (later): Home's first card — and the start-here card's collapsed row, which lands on it — read "Create alias identity" */
    if ((el.closest('.d1j-tx') || el.closest('.wf-found-collapsed-title')) && /^\s*Create alias\s*$/.test(s)) return 'Create alias identity';
    /* Christine, 21 Oct (r16): Home's first card keeps the build's "Create alias / Hide your real ones"
       (was "Be yourself without exposing yourself / Create your first alias") — the same words the start-here card collapses into */
    if (el.closest('.d1j-jt') && /^\s*Create alias to hide your real ones\s*$/.test(s)) return 'Create your first alias';
    if (el.id === 'icCount' || (el.closest('#icCount'))) return s.replace(/(\d+)\s+cards?\b/, function (m, n) { return n + ' ' + (n === '1' ? N.one : N.many); });
    return s;
  }
  function rules(el, s) {
    var t = s.trim();
    if (VOCAB[t]) return s.replace(t, VOCAB[t]);
    /* the tab label reads as a place, so plural */
    if (el.closest && el.closest('.nav-item') && /^\s*ID [Cc]ard\s*$/.test(s)) return s.replace(/ID [Cc]ard/, V3ID ? 'Identity' : cap(N.many));   /* V3: "Identity" */
    return rename(scoped(el, s), MID);
  }
  function fixText(node) {
    var p = node.parentElement;
    if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName) || p.closest('.ut2-noren,#dbgBadge,.dbg-badge')) return;
    if (V3ID && p.closest('#idcardScreen,#v3Edit')) return;                 /* V3's words, as Yuan wrote them */
    var cur = node.data;
    if (WROTE.get(node) === cur) return;
    /* a text node that follows a <br> or other text is mid-sentence */
    var prev = node.previousSibling, pt = prev && (prev.textContent || '');
    MID = !!prev && !/[.!?:]\s*$/.test(pt) && !(prev.nodeType === 1 && /^(P|DIV|H\d|LI)$/.test(prev.tagName));
    var next = rules(p, cur);
    MID = false;
    if (next === cur) return;
    var k = (TRIES.get(node) || 0) + 1; TRIES.set(node, k);
    if (k > 40) return;                       /* same never-fight rule */
    WROTE.set(node, next); node.data = next;
  }
  var ATTRS = ['aria-label', 'placeholder', 'title'];
  /* Some fields are held by the build's own observer (Day 1's Activity hint
     is re-set on every change). Never fight: after two tries, let it be.   */
  function fixAttrs(el) {
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (!v) continue;
      var n = v === 'Identity name' ? (TOGGLE && AFTER ? rename('ID Cards, Passwords, Phone...') : 'Search your Vault') : rename(VOCAB[v] || v);
      if (n === v) continue;
      var k = (TRIES.get(el) || 0) + 1; TRIES.set(el, k);
      if (k > 2) continue;
      el.setAttribute(ATTRS[i], n);
    }
  }
  function sweep(root) {
    if (!root) return;
    if (root.nodeType === 3) { fixText(root); return; }
    if (root.nodeType !== 1) return;
    fixAttrs(root);
    var all = root.querySelectorAll('[aria-label],[placeholder],[title]');
    for (var i = 0; i < all.length; i++) fixAttrs(all[i]);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) fixText(n);
  }

  /* ═════════ additions (after only) ═════════ */
  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  var IC = 'assets/icons/Icons-Items/';

  /* v20 — aliases are made in the Vault, so "Generate an alias" opens the
     Vault's own email-alias form (Add an item › Email › Generate). It used to
     open the ID card flow. */
  async function openVaultAlias() {
    var inAdd = (q('#vtAdd') && q('#vtAdd').classList.contains('open')) ||
                (q('#d1jAdd') && getComputedStyle(q('#d1jAdd')).visibility !== 'hidden' && q('#d1jAdd').getBoundingClientRect().top < 200);
    if (!inAdd) { goTabSafe('vaults'); await wait(450); openVaultAdd(); await wait(900); }
    if (AFTER) { await pickVia(/^\s*Email\s*$/, 'alias'); return; }
    var tile = byText(DAY1 ? '#d1jAdd .d1j-add-cell' : '#vtAdd .vt-tile', /^\s*Email\s*$/);
    if (tile) tile.click();
    await wait(800);
    var row = DAY1 ? q('.d1j-tray-row[data-tray="alias"]') : q('#nqPick [data-nqpick="alias"]');
    if (row) row.click();
  }
  function openCreateAlias() { openVaultAlias(); }
  /* the Vault's own + — Day 1 routes it to #d1jAdd, so click it rather than call vtOpenAdd() */
  function openVaultAdd() {
    var f = document.querySelector('#vaultsScreen .vt-fab');
    if (f) f.click(); else { try { vtOpenAdd(); } catch (e) {} }
  }
  function goTabSafe(t) { try { (window.goTab || window.showTab)(t); } catch (e) { try { showTab(t); } catch (e2) {} } }

  /* C6 — the alias option leads "Add an item" */
  /* 05 · Add an item, Figma 9546:61073 (19 Oct): a list of rows instead of the
     tile grid. "Hide my info" (dark) makes an alias, "Contact" saves your own
     email / phone, the rest open the build's own tiles. Icons exported from
     that frame (originals in ut2/icons/add-*.svg). */
  var ADD_IC = {
    hide: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 13.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7092 19.7091 21.5 17.5 21.5C15.653 21.5 14.0992 20.2479 13.6392 18.5464L13.5869 18.626L13.5874 18.6265L13.5171 18.5874C13.4526 18.554 13.3489 18.5053 13.2104 18.4551C12.9336 18.3547 12.5205 18.25 12 18.25C11.4795 18.25 11.0664 18.3547 10.7896 18.4551C10.6511 18.5053 10.5474 18.554 10.4829 18.5874C10.4509 18.604 10.4288 18.617 10.417 18.624C10.4152 18.6251 10.4135 18.6257 10.4121 18.6265L10.4126 18.626L10.3604 18.5464C9.90027 20.2479 8.34697 21.5 6.5 21.5C4.29086 21.5 2.5 19.7092 2.5 17.5C2.50001 15.2909 4.29086 13.5 6.5 13.5C8.53335 13.5 10.211 15.0174 10.4653 16.9815C10.8607 16.8568 11.3803 16.75 12 16.75C12.6195 16.75 13.1389 16.8569 13.5342 16.9815C13.7885 15.0174 15.4666 13.5 17.5 13.5ZM17.5 15C16.1193 15 15 16.1193 15 17.5C15 18.8807 16.1193 20 17.5 20C18.8807 20 20 18.8807 20 17.5C20 16.1193 18.8807 15 17.5 15ZM6.5 15C5.11929 15 4.00001 16.1193 4 17.5C4 18.8807 5.11929 20 6.5 20C7.88071 20 9 18.8807 9 17.5C8.99999 16.1193 7.88071 15 6.5 15ZM13.5918 18.6289C13.5924 18.6293 13.5926 18.6298 13.5928 18.6299C13.5924 18.6297 13.5915 18.6289 13.5898 18.6279C13.5906 18.6284 13.5913 18.6286 13.5918 18.6289ZM13.5898 18.6279C13.5894 18.6277 13.5884 18.6273 13.5879 18.627L13.5874 18.6265C13.5884 18.627 13.5892 18.6275 13.5898 18.6279ZM12.5044 2.43702C13.9716 1.75291 15.7066 2.5083 16.2056 4.04835L18.1338 10H22V11.5H2V10H5.86572L7.79395 4.04835C8.29293 2.5083 10.0279 1.75292 11.4951 2.43702C11.815 2.58617 12.1845 2.58617 12.5044 2.43702ZM14.7788 4.51075C14.5577 3.82821 13.7884 3.49318 13.1382 3.7964C12.4165 4.13294 11.583 4.13294 10.8613 3.7964C10.2111 3.4932 9.44185 3.82821 9.2207 4.51075L7.44238 10H16.5571L14.7788 4.51075Z" fill="#F3F1ED"/></svg>',
    contact: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 9.33008L19 9.33008" stroke="#141410" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 12.3301L19 12.3301" stroke="#141410" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 15.3301L19 15.3301" stroke="#141410" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.43947 11.5C9.40599 11.5 10.1895 10.7165 10.1895 9.74999C10.1895 8.7835 9.40599 8 8.43947 8C7.47297 8 6.68945 8.7835 6.68945 9.74999C6.68945 10.7165 7.47297 11.5 8.43947 11.5Z" stroke="#141410" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 16.3301C5 15.3301 5.7 13.3301 8.5 13.3301C11.3 13.3301 12 15.3301 12 16.3301" stroke="#141410" stroke-width="1.5"/><rect x="3" y="5" width="18" height="14" stroke="#141410" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    password: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.3896 2.25C22.4169 2.25 23.25 3.08307 23.25 4.11035V19.8896C23.25 20.9169 22.4169 21.75 21.3896 21.75H2.61035C1.58307 21.75 0.750001 20.9169 0.75 19.8896V4.11035C0.75 3.08307 1.58307 2.25 2.61035 2.25H21.3896ZM2.61035 3.75C2.4115 3.75 2.25 3.9115 2.25 4.11035V19.8896C2.25 20.0885 2.4115 20.25 2.61035 20.25H21.3896C21.5885 20.25 21.75 20.0885 21.75 19.8896V4.11035C21.75 3.9115 21.5885 3.75 21.3896 3.75H2.61035ZM8.53027 11.1426L10.8154 9.68945L11.5596 10.8184L9.04102 12.1445L11.5596 13.4717L10.8154 14.5996L8.53027 13.1455L8.6543 15.9326H7.18945L7.31152 13.1709L5.0293 14.624L4.28516 13.4951L6.82422 12.1562L4.28516 10.8184L5.0293 9.68945L7.3125 11.1426L7.18945 8.36914H8.6543L8.53027 11.1426ZM16.7803 11.1426L19.0654 9.68945L19.8096 10.8184L17.291 12.1445L19.8096 13.4717L19.0654 14.5996L16.7803 13.1455L16.9043 15.9326H15.4395L15.5615 13.1709L13.2793 14.624L12.5352 13.4951L15.0742 12.1562L12.5352 10.8184L13.2793 9.68945L15.5625 11.1426L15.4395 8.36914H16.9043L16.7803 11.1426Z" fill="#141410"/></svg>',
    card: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.0098 3.75C22.2524 3.75 23.2598 4.75736 23.2598 6V18C23.2598 19.2426 22.2524 20.25 21.0098 20.25H3.00977C1.76713 20.25 0.759766 19.2426 0.759766 18V6C0.759766 4.75736 1.76712 3.75 3.00977 3.75H21.0098ZM2.25977 18C2.25977 18.4142 2.59555 18.75 3.00977 18.75H21.0098C21.424 18.75 21.7598 18.4142 21.7598 18V10.5H2.25977V18ZM9.00977 17.25H3.75977V15.75H9.00977V17.25ZM3.00977 5.25C2.59555 5.25 2.25977 5.58579 2.25977 6V9H21.7598V6C21.7598 5.58579 21.424 5.25 21.0098 5.25H3.00977Z" fill="#141410"/></svg>',
    bank: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.999 20.25H2.99902V18.75H20.999V20.25ZM6.74902 16.5H5.24902V9.75H6.74902V16.5ZM12.749 16.5H11.249V9.75H12.749V16.5ZM18.749 16.5H17.249V9.75H18.749V16.5ZM21.377 8.35254L20.6211 9.64746L11.999 4.61719L3.37695 9.64746L2.62109 8.35254L11.999 2.88184L21.377 8.35254Z" fill="#141410"/></svg>',
    other: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 11.25H18V12.75H12.75V18H11.25V12.75H6V11.25H11.25V6H12.75V11.25Z" fill="#141410"/></svg>'
  };
  /* Christine, 21 Oct: Phone and Email as rows of their own again (your own
     info, the build's forms), in place of the one Contact row */
  ADD_IC.phone = '<img src="assets/icons/Icons-Items/call.svg" width="24" height="24" alt="">';
  ADD_IC.email = '<img src="assets/icons/Icons-Items/email.svg" width="24" height="24" alt="">';
  var ADD_ROWS = [
    /* Christine, 21 Oct: no "Create alias" row — aliases are made on the ID card page (openIdFlow) */
    ['phone', 'Phone'], ['email', 'Email'], ['password', 'Password'],
    ['card', 'Payment card'], ['other', 'Others']   /* 21 Oct: Bank account moved into Others */
  ];
  function addGenBanner() {
    [['#vtAdd', '.vt-add-grid'], ['#d1jAdd', '.d1j-add-grid']].forEach(function (p) {
      var host = document.querySelector(p[0]); if (!host) return;
      var grid = host.querySelector(p[1]); if (!grid || host.querySelector('.ut2-add-list')) return;
      var list = el('<div class="ut2-add-list ut2-noren">' + ADD_ROWS.map(function (r) {
        return '<button type="button" class="ut2-add-row ' + r[0] + '" data-add-k="' + r[0] + '"><span class="ic">' + ADD_IC[r[0]] + '</span><span class="t">' + r[1] + '</span></button>';
      }).join('') + '</div>');
      list.addEventListener('click', function (e) {
        var b = e.target.closest('.ut2-add-row'); if (!b) return;
        e.stopPropagation(); addRowGo(b.dataset.addK);
      });
      grid.parentNode.insertBefore(list, grid);
      var imp = host.querySelector('.vt-tile.wide, .d1j-add-import');
      if (imp) {
        var svg = imp.querySelector('svg');
        var pill = el('<button type="button" class="ut2-add-import ut2-noren">' + (svg ? svg.outerHTML : '') + '<span>Import from other platforms</span></button>');
        pill.addEventListener('click', function (e) { e.stopPropagation(); imp.click(); });
        host.appendChild(pill);
      }
    });
  }
  function addTile(re) { return byText(DAY1 ? '#d1jAdd .d1j-add-cell' : '#vtAdd .vt-tile', re); }
  /* open a tile, and when it raises a tray, take one of its rows without showing it */
  async function pickVia(re, which) {
    var t = addTile(re); if (!t) return;
    if (!which) { t.click(); return; }
    var root = document.documentElement;
    root.classList.add('ut2-autopick');
    t.click();
    for (var i = 0; i < 30 && !trayRow(which); i++) await wait(40);
    await wait(260);
    var r = trayRow(which); if (r) r.click();
    setTimeout(function () { root.classList.remove('ut2-autopick'); }, 500);
  }
  function addRowGo(k) {
    if (k === 'hide') return openAliasFlow();
    if (k === 'contact') return openContactForm();
    if (k === 'phone' || k === 'email' || k === 'card') return openAddForm(k);   /* 21 Oct: our own form, Hide my … on the keyboard */
    if (k === 'other' && !DAY1) return openOthers();   /* Day 30's Others tile only toasts; Day 01's page gets a Bank row (othBankRow) */
    var map = { password: /^\s*Password\s*$/, card: /^\s*Payment card\s*$/, bank: /^\s*Bank account\s*$/, other: /^\s*Others\s*$/ };
    if (map[k]) addTile(map[k]) && addTile(map[k]).click();
  }
  /* Christine, 21 Oct: Bank account lives in Others. Day 01: a Bank account row
     at the top of the build's own Others page; its Add opens the build's bank
     form. Day 30 has no Others page (the tile only toasts), so it gets one in
     the same frame, with Day 01's list: Bank account works, the rest say they
     are not in this prototype yet, as Day 01 does. */
  var OTH_SVG = function (inner) { return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#141410" stroke-width="1.5" stroke-linejoin="round">' + inner + '</svg>'; };
  var OTH_ROWS = [
    ['bank', 'Bank account', ADD_IC.bank],
    ['note', 'Secure notes', OTH_SVG('<path d="M5.25 3h8.5l5 5v13h-13.5z"/><path d="M13.75 3v5h5"/><path d="M8.25 12.25h7.5M8.25 15.5h7.5M8.25 18.75h4.5"/>')],
    ['address', 'Address', '<img src="assets/icons/Icons-Items/Address.svg" width="24" height="24" alt="">'],
    ['key', 'Authentication Key', OTH_SVG('<rect x="3" y="9.75" width="18" height="11.5"/><path d="M7.5 9.75V7.5a4.5 4.5 0 0 1 9 0v2.25"/>')],
    ['date', 'Date', OTH_SVG('<rect x="3" y="5.25" width="18" height="15.75"/><path d="M3 10h18M8 3v4M16 3v4"/>')],
    ['idnum', 'Identification number', OTH_SVG('<rect x="2.5" y="5" width="19" height="14"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.6-1.4 1.7-2.1 3-2.1s2.4.7 3 2.1M14.5 10h4M14.5 13.5h4"/>')],
    ['url2', 'Secondary URL', OTH_SVG('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.4 4 5.5 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.5-4-9s1.4-6.6 4-9z"/>')]
  ];
  function openBankForm() { var t = addTile(/^\s*Bank account\s*$/); if (t) t.click(); }
  function openOthers() {
    var host = document.querySelector('.phone-frame') || document.body;
    var pick = null;
    var p = el('<div class="ut2-oth ut2-noren" role="dialog"><div class="bar"><button type="button" class="bk" aria-label="Back">' + CHEV + '</button><span class="tt">Others</span></div>' +
      '<div class="rows">' + OTH_ROWS.map(function (r) { return '<button type="button" class="row" data-k="' + r[0] + '"><span class="ic">' + r[2] + '</span><span class="t">' + r[1] + '</span></button>'; }).join('') + '</div>' +
      '<button type="button" class="add" disabled>Add</button></div>');
    host.appendChild(p);
    requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add('on'); }); });
    var close = function () { p.classList.remove('on'); setTimeout(function () { p.remove(); }, 380); };
    p.addEventListener('click', function (e) {
      if (e.target.closest('.bk')) { close(); return; }
      var r = e.target.closest('.row');
      if (r) { pick = r.dataset.k; [].forEach.call(p.querySelectorAll('.row'), function (x) { x.classList.toggle('sel', x === r); }); p.querySelector('.add').disabled = false; return; }
      if (e.target.closest('.add') && pick) {
        if (pick === 'bank') { close(); setTimeout(openBankForm, 200); return; }
        var nm = OTH_ROWS.filter(function (x) { return x[0] === pick; })[0][1];
        if (typeof window.vtToast === 'function') window.vtToast(nm + ' — not in this prototype yet');
        else if (typeof window.icToast === 'function') window.icToast(nm + ' — not in this prototype yet');
      }
    });
  }
  function othBankRow() {
    var rows = q('#d1jOth .d1j-oth-rows'); if (!rows || rows.querySelector('[data-oth="ut2bank"]')) return;
    var b = el('<button class="d1j-oth-row ut2-noren" type="button" data-oth="ut2bank"><span class="av">' + ADD_IC.bank + '</span><span class="t">Bank account</span></button>');
    rows.insertBefore(b, rows.firstChild);
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var a = e.target.closest('#d1jOth [data-othadd]'); if (!a) return;
    var sel = q('#d1jOth .d1j-oth-row.sel'); if (!sel || sel.dataset.oth !== 'ut2bank') return;
    e.stopPropagation(); e.preventDefault();
    q('#d1jOth').classList.remove('on');
    setTimeout(openBankForm, 200);
  }, true);

  var choice, choiceDim;
  function choiceSheet(title, sub, items, dark) {
    var host = document.querySelector('.phone-frame') || document.body;
    if (!choice) {
      choiceDim = el('<div class="ut2-shdim ut2-choicedim"></div>');
      choice = el('<div class="ut2-sheet ut2-choice ut2-noren" role="dialog"></div>');
      host.appendChild(choiceDim); host.appendChild(choice);
      choiceDim.addEventListener('click', closeChoice);
    }
    choice.innerHTML = '<div class="grab"></div><h3>' + title + '</h3><p class="sub">' + sub + '</p>' + items.map(function (it, i) {
      return '<button type="button" class="row" data-i="' + i + '"><span class="av' + (dark ? ' dark' : '') + '"><img src="' + IC + it[0] + '" alt=""></span><span class="t">' + it[1] + '</span></button>';
    }).join('');
    [].forEach.call(choice.querySelectorAll('.row'), function (b) {
      b.addEventListener('click', function () { closeChoice(); setTimeout(items[+b.dataset.i][2], 240); });
    });
    requestAnimationFrame(function () { choice.classList.add('on'); choiceDim.classList.add('on'); });
  }
  /* Christine, 20 Oct: "Create alias" runs the build's own ID card create flow
     (#icCreate) as an alias flow — What is this alias for? → Suggested aliases
     (the build's RECOMMENDED / OTHERS checklist) → Creating… → ready. Done files
     each alias into the Vault (window.vtAddMade, both days) and makes no ID card.
     The pane lives in #idcardScreen, so the ID card tab opens under it, the way
     the build's own callers do (goTab('idcard') then icOpenCreate()). */
  var ALIAS = { on: false };
  var ALIAS_SEC = { phone: 'Phone', email: 'Email', card: 'Payment card' };
  var ALIAS_LAB = { phone: 'Phone', email: 'Email', card: 'Card number' };
  var ALIAS_EMPTY = { phone: 'No call & message yet', email: 'No email yet', card: 'No transactions yet' };
  var ALIAS_CTA = { phone: 'Add contact', email: 'Copy email', card: 'Copy number' };
  function openAliasFlow() {
    if (typeof window.icOpenCreate !== 'function') return;
    ALIAS = { on: true, seen: false, done: false };
    document.documentElement.classList.add('ut2-iccalias');
    if (DAY1) { var x = q('#d1jAddClose'); if (x) x.click(); }
    else if (typeof window.vtCloseAdd === 'function') window.vtCloseAdd();
    goTabSafe('idcard');
    setTimeout(function () { window.icOpenCreate(); aliasFlow(); }, 60);
  }
  function endAlias() {
    ALIAS = { on: false };
    document.documentElement.classList.remove('ut2-iccalias');
    document.documentElement.removeAttribute('data-ut2-ast');
  }
  /* which page by what it holds: Day 30 has a fourth (personalize) page */
  function aliasStep() {
    var on = document.querySelector('#icCreate .icc-step.on'); if (!on) return '';
    if (on.contains(q('#iccCard'))) return 'mint';
    if (on.contains(q('#iccReco'))) return 'reco';
    if (on.contains(q('#iccWhat'))) return 'what';
    return 'other';
  }
  function aliasFlow() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    if (!ALIAS.on) return;
    var pane = q('#icCreate'); if (!pane) return;
    if (pane.classList.contains('open')) ALIAS.seen = true;
    else {
      if (ALIAS.seen) { var done = ALIAS.done; endAlias(); if (!done) goTabSafe('vaults'); }
      return;
    }
    var t = q('#iccTitle'); if (!t) return;
    var st = aliasStep(), R = document.documentElement;
    if (R.getAttribute('data-ut2-ast') !== st) R.setAttribute('data-ut2-ast', st);
    var n = document.querySelectorAll('#iccRows .r').length, many = n > 1, want = null;
    if (st === 'what') want = 'What is this<br>alias for?';
    else if (st === 'reco' && q('#iccReco') && visible(q('#iccReco'))) want = 'Suggested<br>aliases';
    else if (st === 'mint') want = (q('#iccCard') && q('#iccCard').classList.contains('ready'))
      ? (many ? 'Your aliases are<br>ready to use!' : 'Your alias is<br>ready to use!')
      : (many ? 'Creating your<br>aliases now…' : 'Creating your<br>alias now…');
    if (want && t.innerHTML !== want) t.innerHTML = want;
    if (st === 'reco') recoByKind();
  }
  /* Christine, 20 Oct: on Suggested aliases the rows are grouped by what they
     are — CONTACT (phone, email) and PAYMENT (card) — not RECOMMENDED / OTHERS.
     The build's ticks (what fits the purpose) stay as they are. */
  var RECO_GROUPS = [['CONTACT', ['phone', 'email']], ['PAYMENT', ['card']]];
  function recoByKind() {
    var box = q('#iccReco'); if (!box || !box.firstElementChild || box.firstElementChild.classList.contains('ut2-noren')) return;   /* ours already, or empty */
    var rows = {};
    [].forEach.call(box.querySelectorAll('[data-gen-pick]'), function (r) { rows[r.dataset.genPick] = r; });
    var frag = document.createDocumentFragment();
    RECO_GROUPS.forEach(function (g) {
      var have = g[1].filter(function (k) { return rows[k]; }); if (!have.length) return;
      frag.appendChild(el('<div class="icc-lab ut2-noren">' + g[0] + '</div>'));
      have.forEach(function (k) { frag.appendChild(rows[k]); delete rows[k]; });
    });
    Object.keys(rows).forEach(function (k) { frag.appendChild(rows[k]); });
    box.innerHTML = ''; box.appendChild(frag);
  }
  function aliasRows() {
    var KIND = { phone: 'phone', email: 'email', payment: 'card', card: 'card' };
    return [].slice.call(document.querySelectorAll('#iccRows .r')).map(function (r) {
      var k = KIND[(((r.querySelector('em') || {}).textContent) || '').trim().toLowerCase()];
      var v = r.querySelector('.v'); if (!k || !v) return null;
      return { k: k, label: ((r.querySelector('em') || {}).textContent || '').trim(), v: (v.dataset.final || v.textContent || '').trim() };
    }).filter(Boolean);
  }
  function finishAlias() {
    saveAliases();
    ALIAS.done = true;
    var x = q('#iccClose'); if (x) x.click();
    goTabSafe('vaults');
  }
  function saveAliases() {
    var purpose = ((q('#iccName') || {}).textContent || '').trim() || 'New alias';
    var KIND = { phone: 'phone', email: 'email', payment: 'card', card: 'card' };
    var rows = [].slice.call(document.querySelectorAll('#iccRows .r'));
    rows.forEach(function (r) {
      var k = KIND[(((r.querySelector('em') || {}).textContent) || '').trim().toLowerCase()];
      var v = r.querySelector('.v'); if (!k || !v) return;
      var val = (v.dataset.final || v.textContent || '').trim();
      if (k === 'card') val = '•••• ' + val.replace(/\D/g, '').slice(-4);
      var rec = { kind: k, alias: true, title: purpose, name: purpose, value: val,
                  section: ALIAS_SEC[k], vlab: ALIAS_LAB[k], empty: ALIAS_EMPTY[k], cta: ALIAS_CTA[k],
                  tone: null, glyph: '' };
      if (window.AV && window.AV.decide) rec.dec = window.AV.decide({ title: purpose, kind: k, value: val, alias: true });
      if (rec.dec && rec.dec.glyph && rec.dec.glyph.type !== 'logo' && window.AV.markSVG) { try { rec.glyph = window.AV.markSVG(rec.dec.glyph.key); } catch (eg) {} }
      if (rec.dec && rec.dec.glyph && rec.dec.glyph.type === 'logo' && rec.dec.glyph.src) rec.glyph = '<img src="' + String(rec.dec.glyph.src).replace(/ /g, '%20') + '" alt="">';   /* a brand's logo, as the build draws it (the page's icon was empty) */
      try { if (typeof window.vtAddMade === 'function') window.vtAddMade(rec); } catch (e) {}
    });
  }
  /* Christine, 20 Oct: no personalize page and no "Creating your aliases now…"
     — Continue on Suggested aliases makes them at once and opens them as an
     identity (card) named for what they are for. The rest of the build's flow
     still runs, hidden (html.ut2-ghostcc, mint at full speed, Day 30's
     personalize Skipped): the aliases go into the Vault, the build's Done makes
     the card (Day 30 builds it from these rows; Day 01 copies a seed card, so
     the rows are put on it after), and the card opens. */
  async function aliasFast() {
    var R = document.documentElement;
    for (var i = 0; i < 80; i++) {
      await wait(60);
      if (!ALIAS.on) return;
      var st = aliasStep();
      if (st === 'other') { var sk = q('#iccGhost'); if (sk && !sk.hidden) sk.click(); continue; }   /* Day 30: personalize → Skip */
      if (st === 'mint' && q('#iccCard') && q('#iccCard').classList.contains('ready')) break;
    }
    if (!ALIAS.on) { R.classList.remove('ut2-ghostcc'); return; }
    var rows = aliasRows(), name = ((q('#iccName') || {}).textContent || '').trim();
    saveAliases();
    var before = walletIds();
    ALIAS.done = true; ALIAS.pass = true;
    q('#iccNext').click();                            /* the build's Done: it makes the card and closes */
    await until2(function () { var p = q('#icCreate'); return p && !p.classList.contains('open'); }, 3000);
    setTimeout(function () { R.classList.remove('ut2-ghostcc'); }, 450);
    var after = walletIds(), id = null;
    for (var k in after) if (!before[k]) id = k;
    if (!id) { goTabSafe('vaults'); return; }
    if (DAY1 && typeof window.v3CardById === 'function') {
      var card = window.v3CardById(id);
      if (card) {
        card.items = rows.map(function (r) { return { k: r.label, v: r.v, t: r.k }; });
        if (name) card.title = name;
        if (typeof window.icResetCards === 'function') window.icResetCards();
      }
    }
    await wait(250);
    openIdc(id, LISTV);
  }
  document.addEventListener('click', function (e) {
    if (!ALIAS.on || !e.target.closest) return;
    var n = e.target.closest('#iccNext');
    if (n && !n.disabled && aliasStep() === 'reco' && !ALIAS.fast) {
      ALIAS.fast = true;
      document.documentElement.classList.add('ut2-ghostcc');   /* before the build's handler starts the mint */
      setTimeout(aliasFast, 0);
      return;
    }
    if (ALIAS.pass) return;
    if (!n || n.disabled || aliasStep() !== 'mint' || !(q('#iccCard') && q('#iccCard').classList.contains('ready'))) return;
    e.stopPropagation(); e.preventDefault();
    finishAlias();
  }, true);

  function closeChoice() { if (choice) { choice.classList.remove('on'); choiceDim.classList.remove('on'); } }

  /* C3 · C4 — captions in the trays (rows are rebuilt on every open) */
  function addTrayCaps() {
    var bodies = document.querySelectorAll('#nqPick .vt-sheet-body, #vtAddEmail .vt-sheet-body, .d1j-tray-rows');
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (!b.querySelector('[data-nqpick],[data-addemail],[data-tray]')) continue;
      if (!b.querySelector('.ut2-cap.is-alias')) b.appendChild(el('<div class="ut2-cap is-alias ut2-noren">New · made by Cloaked</div>'));
      if (!b.querySelector('.ut2-cap.is-own')) b.appendChild(el('<div class="ut2-cap is-own ut2-noren">Your real info</div>'));
    }
  }

  /* C2 — one line under each section title */
  function addSubs() {
    var bar = document.getElementById('vtL2Bar');
    var at = bar && (bar.nextElementSibling && bar.nextElementSibling.classList.contains('ut2-vseg') ? bar.nextElementSibling : bar);   /* 19's toggle sits between */
    if (at && !(at.nextElementSibling && at.nextElementSibling.classList.contains('ut2-sub'))) {
      at.parentNode.insertBefore(el('<div class="ut2-sub ut2-noren" data-sub="vault">Your saved logins, emails, phones and cards. Real ones and aliases.</div>'), at.nextSibling);
    }
    var row = document.querySelector('#icL1 .ic-count-row');
    /* Christine, 22 Oct: no line under the identities title — the ? beside it says it */
    if (false && row && !(row.previousElementSibling && row.previousElementSibling.classList.contains('ut2-sub'))) {
      row.parentNode.insertBefore(el('<div class="ut2-sub ut2-noren" data-sub="cards">Aliases grouped by situation, like shopping, dating or travel.</div>'), row);
    }
  }

  /* C7 — after the card is made, a "how it works" step slides up.
     A sheet rather than a block under the card: the finished card is tall
     (phone + email + See detail) and there is no room above Custom / Done. */
  var how, howDim;
  /* Christine, 19 Oct (Figma 9561:65463): redesigned — no grab bar, list
     items on page (20 padding, 40 dark avatars with white icons), Got it in
     a 10-inset 56px button. Icons: Figma arrow_Out and Icons-Hide; the 2FA
     badge is drawn as in the design (text in a 28×18 outline). */
  var HOW_HIDE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.0605 4.81055L4.06055 19.8105L3 18.75L5.01465 16.7344C3.33443 15.6309 1.93856 14.1301 0.966797 12.3613V11.6387C3.05784 7.83254 7.10222 5.25 11.75 5.25C13.1732 5.25004 14.5395 5.49295 15.8105 5.93848L18 3.75L19.0605 4.81055ZM18.2549 7.11523C20.0377 8.23098 21.5153 9.78971 22.5312 11.6387V12.3613C20.4402 16.1668 16.3975 18.7499 11.75 18.75C10.2223 18.75 8.76054 18.4688 7.41113 17.959L8.59082 16.7793C9.59017 17.0852 10.6509 17.25 11.75 17.25L12.1309 17.2432C15.9002 17.1121 19.1787 15.0447 21.0078 12C20.0666 10.4332 18.7413 9.12558 17.1631 8.20703L18.2549 7.11523ZM15.084 10.2861C15.3456 10.7971 15.4941 11.3758 15.4941 11.9893C15.4939 14.0571 13.8169 15.7334 11.749 15.7334C11.1358 15.7333 10.5577 15.5846 10.0469 15.3232L11.2061 14.1641C11.3801 14.2074 11.5615 14.2334 11.749 14.2334C12.9884 14.2334 13.9939 13.2286 13.9941 11.9893C13.9941 11.8014 13.9683 11.6197 13.9248 11.4453L15.084 10.2861ZM11.75 6.75C7.82081 6.75 4.38066 8.85279 2.49023 12C3.38399 13.4879 4.62498 14.7407 6.09961 15.6494L8.30273 13.4463C8.11302 12.9981 8.00494 12.5066 8.00488 11.9893C8.00504 9.92157 9.68136 8.24539 11.749 8.24512C12.2663 8.24512 12.7578 8.35321 13.2061 8.54297L14.6113 7.1377C13.6998 6.88681 12.7409 6.75003 11.75 6.75ZM11.749 9.74512C10.5098 9.74539 9.50504 10.75 9.50488 11.9893C9.5049 12.0705 9.511 12.1505 9.51953 12.2295L11.9893 9.75977C11.9103 9.75129 11.8303 9.74512 11.749 9.74512Z" fill="#F3F1ED"/></svg>';
  var HOW_OUT = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.9902 16.3453L15.4918 16.2859L15.7687 9.36331L7.22539 17.9066L6.16473 16.8459L14.708 8.30265L7.78542 8.57956L7.72603 7.0811L17.3762 6.69509L16.9902 16.3453Z" fill="#F3F1ED"/></svg>';
  function buildHow() {
    var host = document.querySelector('.phone-frame') || document.body;
    function li(icon, t, sub) {
      return '<div class="li"><span class="av">' + icon + '</span><div class="tx"><b>' + t + '</b><span>' + sub + '</span></div></div>';
    }
    howDim = el('<div class="ut2-shdim ut2-howdim"></div>');
    how = el('<div class="ut2-sheet ut2-how ut2-noren" role="dialog" aria-label="How your ' + N.one + ' works">' +
      '<h3>How your ' + N.one + ' works</h3>' +
      li(HOW_OUT, 'Messages come to you', 'Emails forward to ' + REAL_EMAIL) +
      li(HOW_HIDE, 'Sites only see the alias', 'Your real email and number stay hidden.') +
      li('<i class="fa">2FA</i>', 'Login codes still arrive', '2FA codes forward like any other messages.') +
      '<div class="gotw"><button class="ut2-got" type="button">Got it</button></div>' +
    '</div>');
    host.appendChild(howDim); host.appendChild(how);
    function close() { how.classList.remove('on'); howDim.classList.remove('on'); }
    howDim.addEventListener('click', close);
    how.querySelector('.ut2-got').addEventListener('click', close);
  }
  /* the visible "Your … is created!" headline (before mode only now) */
  function createdEl() {
    var h = q('#nqGenH');
    if (h && visible(h) && /created/i.test(h.textContent)) return h;
    var d = document.querySelectorAll('.d1j-gen .d1j-h1');
    for (var i = 0; i < d.length; i++) if (visible(d[i]) && /created|is ready|added/i.test(d[i].textContent) && !/generating/i.test(d[i].textContent)) return d[i];
    return null;
  }
  function createdNow() { var e = createdEl(); return e ? e.textContent : null; }
  /* shown on the item's own page, right after an alias is made (see v21) */
  function showHow(delay) {
    if (!how) buildHow();
    setTimeout(function () { how.classList.add('on'); howDim.classList.add('on'); }, delay || 700);
  }

  /* v21 — no "Your … is created!" page after making something. The build's own
     Done still runs (so the item is filed exactly as before); the saved page is
     hidden and the item's own page opens straight away.
       Day 30 email / phone   #nqGen     → its Done opens #nqDetail itself
       every .d1j-flow ending  .d1j-gen  → Done files it and goes to the Vault;
                                          then the item's page is opened here */
  /* Christine, 21 Oct (Figma 9646:87446): with the "created" page gone the
     item's page opens straight away, so its avatar says "saved" instead —
     its icon flips to a lock (now secured in Cloaked) and back. A coin flip on Y. */
  /* Christine, 21 Oct (Figma 9712:65932): the lock is the Vault's own padlock (Icons-Navigation/Vault), black on the orange disc */
  var LOCK_SVG = '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M24.2654 4.05273C30.8925 4.05273 36.2649 9.11637 36.2654 15.3629V20.3605L44 20.3084V44.0007H4V20.3084L12.2654 20.3605V15.3629C12.2659 9.11637 17.6383 4.05273 24.2654 4.05273ZM24.2654 8.57794C20.2893 8.57794 17.0667 11.6151 17.0662 15.3629V20.3605H31.4646V15.3629C31.4641 11.6151 28.2416 8.57794 24.2654 8.57794Z" fill="currentColor"/></svg>';
  var FLIPAT = 0;
  var FLIP_SEL = ['#nqDAv', '#d1jDetAv', '#vtL3 .vt-hero-av .vt-av', '#vtL3 .vt-l3-av', '#vtL3 .vt-dav'];
  /* Christine, 22 Oct (Figma 9823:114647, "Icon rotates and show that it's
     protected"): no lock any more — after Save the item's icon turns over the
     way a vault row's does (V3's coin: its reversed face comes round), holds,
     and turns back to its own face. */
  function rgbOf(c) { var d = document.createElement('i'); d.style.color = c; document.body.appendChild(d); var r = getComputedStyle(d).color; d.remove(); return r; }
  function edgeFor(bg, ink, mk) {
    if (!bg || /^transparent$|rgba\([^)]*,\s*0\)$/.test(rgbOf(bg))) return null;   /* a bare logo or art: no disc, so no coin side */
    if (rgbOf(bg) === rgbOf(AL_BG)) return { c: '#8a3407', al: true };
    return { c: (mk ? ink : bg) || ink || bg || '#8a3407', al: false };
  }
  function coin(av) {
    var w = av.getBoundingClientRect().width || 40, th = Math.max(4, Math.round(w * 0.15));
    av.style.setProperty('--ut2-th', th + 'px');
    av.style.setProperty('perspective', Math.round(w * 6) + 'px');
  }
  function flipAv(av) {
    if (!av || av.__ut2flip) return;
    av.__ut2flip = 1;
    var sp = av.querySelector(':scope > .ut2-spin'), keep = null;
    if (!sp) {                                            /* a page openSpin did not dress (the alias you just made): build the two faces here */
      var info = avInfo(av);
      if (!info) { av.__ut2flip = 0; return; }
      var bg = info.bg || getComputedStyle(av).backgroundColor, ink = info.ink || getComputedStyle(av).color;
      keep = { html: av.innerHTML, cls: av.className, st: av.getAttribute('style') || '' };
      av.classList.add('ut2-spinav');
      av.style.setProperty('background', 'transparent', 'important'); av.style.setProperty('background-image', 'none', 'important');
      av.innerHTML = '<span class="ut2-spin"><span class="ut2-f a">' + faceHTML(info, bg, ink) + '</span><span class="ut2-f b">' + faceBack(info, bg, ink) + '</span></span>';
      fitMarks(av);
      sp = av.querySelector(':scope > .ut2-spin');
    }
    if (!sp.querySelector('.ut2-edge')) {
      var fa = sp.querySelector('.ut2-f.a .ut2-face'), lc = lockColors(av) || [];
      var e = edgeFor(lc[0], lc[1], fa && (fa.classList.contains('mk') || fa.classList.contains('sv')));
      if (e) sp.insertBefore(el('<i class="ut2-edge' + (e.al ? ' al' : '') + '" style="background:' + e.c + '"></i>'), sp.querySelector('.ut2-f.b'));
    }
    coin(av);
    var EASE = 'cubic-bezier(.4,0,.2,1)', T = 420, HOLD = 800;
    var turn = function (from, to) { try { return sp.animate([{ transform: 'rotateY(' + from + 'deg)' }, { transform: 'rotateY(' + to + 'deg)' }], { duration: T, easing: EASE, fill: 'forwards' }); } catch (x) { return null; } };
    setTimeout(function () {
      turn(0, 180);                                       /* its reversed face comes round: saved, protected */
      setTimeout(function () {
        turn(180, 360);                                   /* and back to its own face */
        setTimeout(function () {
          try { sp.getAnimations().forEach(function (a) { a.cancel(); }); } catch (x) {}
          sp.style.transform = 'rotateY(0deg)';
          if (keep) { av.className = keep.cls; av.setAttribute('style', keep.st); av.innerHTML = keep.html; }
          av.__ut2flip = 0;
        }, T + 30);
      }, T + HOLD);
    }, 500);
  }
  function lockColors(av) {
    var clear = function (c) { return !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c); };
    var fc = av.querySelector('.ut2-f.a .ut2-face') || null, bg = '', ink = '';
    if (fc && !fc.classList.contains('bare')) {
      bg = getComputedStyle(fc).backgroundColor;
      var mk = fc.querySelector('.ut2-mk');
      ink = mk ? (mk.classList.contains('ut2-mki') ? ((mk.querySelector('[fill]:not([fill="none"]), [stroke]:not([stroke="none"])') || { getAttribute: function () { return ''; } }).getAttribute('fill') || AL_INK) : getComputedStyle(mk).backgroundColor) : getComputedStyle(fc).color;
    }
    if (clear(bg)) { bg = av.getAttribute('data-ut2bg') || av.style.background || getComputedStyle(av).backgroundColor; ink = av.getAttribute('data-ut2ink') || av.style.color || getComputedStyle(av).color; }
    if (clear(bg) || !ink) return null;                  /* a bare logo has no disc of its own: the default orange lock */
    return [bg, ink];
  }
  /* Christine, 22 Oct: one size for the mark inside every avatar — list row,
     the turning faces, the item page, the lock. The marks' own drawings sit at
     different sizes inside their boxes (and each place scaled the box its own
     way), so the size jumped as a row turned and the page opened. Each mark is
     measured (getBBox) and its viewBox set so the drawing's longer side is
     45% of the disc — the Figma's (Hinge's H, 18 of 40). */
  var FIT = 0.45;
  var FIT_SEL = '.vt-av.av-mark > svg, .vt-av.made > svg, .vt-av.glyph > svg, .d1j-det-av > svg, .ut2-face.mk:not(.raw) > svg, .ut2-flip-lock > svg';
  function fitMark(svg) {
    if (!svg || svg.getAttribute('data-ut2fit')) return;
    var bb; try { bb = svg.getBBox(); } catch (e) { return; }
    if (!bb || !bb.width || !bb.height) return;                       /* not laid out yet: next pass */
    var side = Math.max(bb.width, bb.height) / FIT, cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
    svg.setAttribute('viewBox', (cx - side / 2).toFixed(2) + ' ' + (cy - side / 2).toFixed(2) + ' ' + side.toFixed(2) + ' ' + side.toFixed(2));
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('data-ut2fit', '1');
  }
  function fitMarks(root) {
    if (!AFTER) return;
    var l = (root || document).querySelectorAll(FIT_SEL);
    for (var i = 0; i < l.length; i++) if (!l[i].getAttribute('data-ut2fit')) fitMark(l[i]);
  }
  function flipSoon() {
    var t0 = Date.now(); FLIPAT = t0;
    (function look() {
      for (var i = 0; i < FLIP_SEL.length; i++) {
        var a = q(FLIP_SEL[i]), r = a && a.getBoundingClientRect();
        /* on screen, not just laid out: a closed page's avatar sits off to the right with a rect of its own */
        if (a && visible(a) && r.width > 20 && r.left >= -1 && r.right <= innerWidth + 1) { flipAv(a); return; }
      }
      if (Date.now() - t0 < 1500) setTimeout(look, 40);
    })();
  }
  var SKIP = { nq: false };
  function skipNqGen() {
    var g = q('#nqGen'), done = q('#nqDone');
    if (!g || !done) return;
    var open = g.classList.contains('open');
    if (open && !SKIP.nq) {
      SKIP.nq = true;
      done.click();
      flipSoon();
      var d = q('#nqDetail');
      if (d && d.classList.contains('nq-dark')) showHow();
    } else if (!open) SKIP.nq = false;
  }
  /* bubble phase: the flow's own handler has already run reveal() */
  document.addEventListener('click', function (e) {
    if (!AFTER) return;
    var t = e.target.closest && e.target.closest('[data-go="3"], [data-add], .d1j-ae-next');
    var f = t && t.closest('.d1j-flow');
    if (!f || !f.classList.contains('on') || f.querySelector('.d1j-wzs.on')) return;
    var done = f.querySelector('.d1j-gen [data-done]');
    if (!done) return;
    var alias = !t.matches('[data-add]');            /* data-add is "save my own" */
    var got = null, home = false, _add = window.vtAddMade, _tab = window.goTab;
    var before = [].slice.call(document.querySelectorAll('.d30v-row'));
    if (typeof _add === 'function') window.vtAddMade = function (m) { got = m; return _add.apply(this, arguments); };
    if (typeof _tab === 'function') window.goTab = function (n) { if (n === 'vaults') home = true; return _tab.apply(this, arguments); };
    try { done.click(); } finally { window.vtAddMade = _add; window.goTab = _tab; }
    if (!home) return;                               /* handed back to a form (Hide my email): nothing to open */
    var opened = false;
    if (got && typeof window.d1jOpenMade === 'function') { window.d1jOpenMade(got); opened = true; }
    else {
      var rows = document.querySelectorAll('.d30v-row');
      for (var i = rows.length - 1; i >= 0; i--) if (before.indexOf(rows[i]) < 0) { rows[i].click(); opened = true; break; }
    }
    if (opened) flipSoon();
    if (opened && alias) showHow();
  });

  /* v20 — an ID card only groups what's already in the Vault.
     The "what should we generate" page is skipped: step 2 goes straight to
     the build's own pick page (its "Add manually"), and the pick sheets lose
     their "Generate a … alias" row, which now points to the Vault instead. */
  var V20 = { pickSeen: false };
  function idCardPicksOnly() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    if (ALIAS.on) return;                            /* Create alias keeps the Suggested aliases page */
    var reco = q('#iccReco'), items = q('#iccItems'), ghost = q('#iccGhost'), back = q('#iccBack');
    if (reco && visible(reco) && !(items && visible(items))) {
      if (V20.pickSeen) { V20.pickSeen = false; if (back) back.click(); }      /* Back from the pick page: go past the skipped page */
      else if (ghost && /manual/i.test(ghost.textContent)) ghost.click();
      return;
    }
    /* only touch class when it changes: classList.remove/toggle rewrite the
       attribute even when nothing changes, which re-fires our own observer */
    var hideGhost = !!(items && visible(items) && ghost && /guide me/i.test(ghost.textContent));
    if (items && visible(items)) V20.pickSeen = true;
    if (ghost && ghost.classList.contains('ut2-hide') !== hideGhost) ghost.classList.toggle('ut2-hide', hideGhost);
    var gens = document.querySelectorAll('.icc-sheet-scroll button.gen');
    for (var i = 0; i < gens.length; i++) {
      var g = gens[i];
      if (!/^\s*Generate/i.test(g.textContent) || g.classList.contains('ut2-hide')) continue;
      g.classList.add('ut2-hide');
      var hint = el('<div class="ut2-vhint ut2-noren"><p>New aliases are made in the Vault.</p><span class="go" role="button" tabindex="0">Go to Vault</span></div>');
      hint.querySelector('.go').addEventListener('click', function () {
        var x = q('#iccClose'); if (x) x.click();
        setTimeout(openVaultAlias, 500);
      });
      g.parentNode.insertBefore(hint, g.nextSibling);
    }
  }

  /* Activity (Christine, 20 Oct): the Monitor data / Block spam / Use an alias
     tiles go (ut2.css); their "See breakdown" moves up beside "Actions taken to
     protect you" and opens the same breakdown page (the build's mhOpenBreakdown). */
  /* Christine, 20 Oct (later): the total ("Actions taken to protect you · 11 ·
     ▲ Today · See breakdown") goes (ut2.css), and the state tabs get a fourth,
     Transactions: only payment rows (data-kind="transaction"). The build's
     tabs filter through their own engine; this one hides rows itself, after
     the build has painted, and lets go when another tab is picked. */
  var AVTX = false;
  function avTxApply() {
    var scr = q('#activityScreen') || document;
    [].forEach.call(document.querySelectorAll('#avStickTabs .av-st'), function (t) {
      var on = AVTX ? t.classList.contains('ut2-avtx') : null;
      if (on !== null && t.classList.contains('active') !== on) t.classList.toggle('active', on);
    });
    if (!AVTX) return;
    var qy = ((q('#avSearchInput') || {}).value || '').trim().toLowerCase();
    [].forEach.call(document.querySelectorAll('.av-row'), function (r) {
      var hide = r.dataset.kind !== 'transaction' || (!!qy && r.textContent.toLowerCase().indexOf(qy) === -1);
      if (r.hidden !== hide) r.hidden = hide;
    });
    [].forEach.call(document.querySelectorAll('.av-group'), function (g) {
      var any = false, n = g.nextElementSibling;
      while (n && n.classList.contains('av-row')) { if (!n.hidden) { any = true; break; } n = n.nextElementSibling; }
      if (g.hidden !== !any) g.hidden = !any;
    });
    [].forEach.call(document.querySelectorAll('.av-section'), function (s2) {
      var none = !s2.querySelector('.av-row:not([hidden])');
      if (s2.hidden !== none) s2.hidden = none;
    });
    avTxEmpty();
  }
  function avTxEmpty() {
    var st = q('#avStick'); if (!st) return;
    var em = st.parentNode.querySelector(':scope > .ut2-avempty');
    if (!em) { em = el('<div class="ut2-avempty ut2-noren">No transactions yet</div>'); st.parentNode.insertBefore(em, st.nextSibling); }
    var any = [].some.call(document.querySelectorAll('.av-row[data-kind="transaction"]'), function (r) { return !r.hidden && r.offsetParent !== null; });   /* Day 01 keeps old feeds in the DOM, display:none */
    var show = AVTX && !any;
    if (em.hidden !== !show) em.hidden = !show;
  }
  function avTxTab() {
    var host = q('#avStickTabs'); if (!host || host.querySelector('.ut2-avtx')) return;
    var b = el('<button class="av-st ut2-avtx ut2-noren" type="button" data-view="ut2tx">Transactions</button>');
    b.addEventListener('click', function () { AVTX = true; setTimeout(avTxApply, 0); });
    host.appendChild(b);
    host.classList.add('ut2-four');
  }
  document.addEventListener('click', function (e) {
    if (!AVTX || !e.target.closest) return;
    var t = e.target.closest('#avStickTabs .av-st'); if (!t || t.classList.contains('ut2-avtx')) return;
    AVTX = false; var mine = q('#avStickTabs .ut2-avtx'); if (mine) mine.classList.remove('active'); avTxEmpty();
  }, true);
  document.addEventListener('input', function (e) { if (AVTX && e.target && e.target.id === 'avSearchInput') setTimeout(avTxApply, 0); }, true);

  function addBreakdownLink() {
    var labs = document.querySelectorAll('.av-hero-label');
    for (var i = 0; i < labs.length; i++) {
      var l = labs[i];
      if (l.querySelector('.ut2-bdlink')) continue;
      if (!l.classList.contains('ut2-bdrow')) l.classList.add('ut2-bdrow');
      var a = el('<span class="ut2-bdlink ut2-noren" role="button" tabindex="0">See breakdown</span>');
      a.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof window.mhOpenBreakdown === 'function') window.mhOpenBreakdown('monitoring');
      });
      l.appendChild(a);
    }
  }

  /* v10 (moved with v20) — the special-words box in the Vault form says where the words go */
  function addKeywordHint() {
    var boxes = document.querySelectorAll('.nq-fwords, .d1j-ae-wbox');
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i];
      if (!visible(b) || b.querySelector('.ut2-kw')) continue;
      /* inside the box: Day 1's alias page lays its rows out absolutely */
      b.insertBefore(el('<div class="ut2-kw ut2-noren">These words go into your new address, like trip.river@cloaked.com. Leave it empty for a random one.</div>'), b.firstChild);
    }
  }

  /* 07 · 08 — every Vault row says whose it is; every alias says where it forwards.
     Same alias rule the build's avatars use (data-av-alias), plus the cases a
     row can't show: logins (alias = the login's email is ours), cards
     (Virtual = Cloaked Pay), phone/email by value. */
  var OWN_CARDS = /^(Chase|Bank of America)$/;
  function isOursAddr(v) { return /@(cloaked|clkd)\b|\.clkd\.id$|cloaked\.(id|com)$/i.test(v) || (v && v.indexOf('@') < 0 && /[a-z]/i.test(v) && !/\s/.test(v)); }
  function rowKind(id) { return (id.match(/^[a-z]+/) || [''])[0]; }
  function rowIsAlias(row) {
    var av = row.querySelector('[data-av-alias]');
    if (av) return av.getAttribute('data-av-alias') === '1';
    var k = rowKind(row.dataset.item || ''), d = ((row.querySelector('.vt-row-desc') || {}).textContent || '').trim();
    var t = ((row.querySelector('.vt-row-title') || {}).textContent || '').trim();
    if (k === 'ph') return d.replace(/\D/g, '') !== REAL_PHONE.replace(/\D/g, '');
    if (k === 'em' || k === 'lg') return isOursAddr(d);
    if (k === 'cd') return !OWN_CARDS.test(t);
    return false;
  }
  function addRowTags() {
    var rows = document.querySelectorAll('#vaultsScreen .vt-row[data-item]');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i], top = row.querySelector('.vt-row-top');
      if (!top || row.getAttribute('data-ut2al')) continue;
      var alias = rowIsAlias(row);
      row.setAttribute('data-ut2al', alias ? '1' : '0');
      if (!alias) continue;                       /* 19 Oct: only aliases are marked, your own info isn't */
      /* Christine, 21 Oct (Figma 9666:97473): an ALIAS tag after the name; the
         logo stays as it is (a black disc would lose the dark logos). Replaces the 20 Oct corner
         thumbnail on the avatar. */
      row.classList.add('ut2-al');
      aliasAv(row.querySelector('.vt-av'));
      var tt = top.querySelector('.vt-row-title');
      var tg = el('<span class="ut2-tag alias">Alias</span>');
      if (tt && tt.nextSibling) top.insertBefore(tg, tt.nextSibling); else top.appendChild(tg);
      /* 08 — Christine, 20 Oct: "Forwards to" lives on the item's page, not the list (fwdOut) */
    }
  }

  /* Christine, 20 Oct: an "Alias" filter beside All / Login / Phone… that
     shows only aliases. The build's own tabs are one group each and its All
     list is cut to a preview per group (Day 30), so the Alias list is ours:
     drawn from window.vtVaults() with the build's own row (window.vtRowHTML),
     inside #vaultsScreen so the build's tap still opens each item. */
  var AONLY = false, AKIND = 'alias', ALIST_SIG = '';
  var IDC_TAB = false;   /* Christine, 21 Oct: no Identities filter tab; identities stay in the All list */
  var SEC_LABEL = { login: 'Password', phone: 'Phone', email: 'Email', card: 'Payment card', bank: 'Bank account', address: 'Address' };
  function itemIsAlias(key, it) {
    if (it._av && typeof it._av.alias === 'boolean') return it._av.alias;
    if (key === 'login') return !!(it.login && it.login.cloaked);
    if (key === 'card') return it.kind === 'Virtual card';
    if (key === 'phone') return !it.own;
    if (key === 'email') return !it.own && (!/@/.test(it.desc || '') || !!(window.AV && window.AV.isAliasValue(it.desc)));
    return false;
  }
  function aliasGroups() {
    var vs = []; try { vs = window.vtVaults() || []; } catch (e) {}
    var v = vs[0]; if (!v) return { v: null, groups: [] };
    return { v: v, groups: v.groups.map(function (g) {
      return { key: g.key, label: SEC_LABEL[g.key] || g.label, items: g.items.filter(function (it) { if (!it._group) it._group = g.key; return itemIsAlias(g.key, it); }) };
    }).filter(function (g) { return g.items.length; }) };
  }
  function renderAliasList(force) {
    var body = q('#vtL2Body'); if (!body || typeof window.vtRowHTML !== 'function') return;
    var list = body.parentNode.querySelector(':scope > .ut2-alist');
    if (!list) { list = el('<div class="ut2-alist ut2-noren"></div>'); body.parentNode.insertBefore(list, body.nextSibling); }
    if (AKIND === 'idc') {   /* the Identities filter (1 Tab · folder list): ID cards as rows */
      var cs = idCards(), csig = 'idc|' + cs.map(function (c) { return c.id + c.title; }).join(',');
      if (!force && csig === ALIST_SIG && list.childNodes.length) return;
      ALIST_SIG = csig;
      list.innerHTML = cs.length
        ? '<section class="vt-sec first ut2-flatsec">' + flatSort(cs).map(idRowHTML).join('') + '</section>'
        : '<div class="ut2-aempty"><p>No identities yet</p><button type="button" class="ut2-aempty-go">' + ADD_IC.hide + '<span>Create alias</span></button></div>';
      var go = list.querySelector('.ut2-aempty-go');
      if (go) go.addEventListener('click', function (e) { e.stopPropagation(); openAliasFlow(); });
      return;
    }
    var a = aliasGroups(); if (!a.v) return;
    var sig = a.groups.map(function (g) { return g.key + ':' + g.items.map(function (it) { return it.id; }).join(','); }).join('|');
    if (!force && sig === ALIST_SIG && list.childNodes.length) return;
    ALIST_SIG = sig;
    if (!a.groups.length) {
      list.innerHTML = '<div class="ut2-aempty"><p>No aliases yet</p><button type="button" class="ut2-aempty-go">' + ADD_IC.hide + '<span>Create alias</span></button></div>';
      list.querySelector('.ut2-aempty-go').addEventListener('click', function (e) { e.stopPropagation(); openIdFlow(); });   /* 21 Oct: aliases are made in the ID card flow */
      return;
    }
    if (TOGGLE && FLAT) {   /* 1 Tab: one list, no section heads (Christine, 20 Oct; sections again 21 Oct) */
      list.innerHTML = '<section class="vt-sec first ut2-flatsec">' + flatSort([].concat.apply([], a.groups.map(function (g) { return g.items; })))
        .map(function (it) { return window.vtRowHTML(a.v.id, it); }).join('') + '</section>';
      return;
    }
    list.innerHTML = a.groups.map(function (g, i) {
      return '<section class="vt-sec' + (i ? '' : ' first') + '"><div class="vt-sec-head"><div class="vt-sec-plain"><div class="vt-sec-title">' + g.label + '</div></div></div>' +
        g.items.map(function (it) { return window.vtRowHTML(a.v.id, it); }).join('') + '</section>';
    }).join('');
  }
  function flatSort(items) {
    return items.slice().sort(function (x, y) { return String(x.title || '').localeCompare(String(y.title || ''), 'en', { sensitivity: 'base' }); });
  }
  /* Christine, 20 Oct (1 Tab only): All is one list — Passwords, Phone, Email…
     no longer split into sections — and the tabs filter it. The build's All
     is sectioned and cut to a preview per group, so All is drawn here too,
     A–Z, from window.vtVaults() with the build's row; search filters it; the
     build's own list comes back for Edit (select mode) and on every other tab. */
  var FLAT_SIG = '';
  /* Christine, 21 Oct (Figma 9631:82531): back to the sectioned Vault home —
     Passwords, Phone, Email… each with its own head — in 1 Tab too. The flat
     list stays in the code behind FLAT. In the folder-list version the
     identities get a section of their own at the end, so they stay findable. */
  var FLAT = false;
  function idcSection() {
    var body = q('#vtL2Body'), host = q('#vtL2Tabs');
    var allOn = !!(LISTV && !AONLY && host && body && host.querySelector('.vt-tab[data-tab="all"][aria-selected="true"]'));
    var sec = body && body.querySelector(':scope > .ut2-idsec');
    if (!allOn) { if (sec) sec.remove(); return; }
    var qy = ((q('#vtL2Search') || {}).value || '').trim().toLowerCase();
    var cards = idCards().filter(function (c) { return !qy || c.title.toLowerCase().indexOf(qy) !== -1; });
    var sig = qy + '|' + cards.map(function (c) { return c.id + c.title + (FOLD.favs[c.id] ? '*' : ''); }).join(',');
    if (sec && sec.dataset.sig === sig && sec === body.lastElementChild) return;
    if (sec) sec.remove();
    if (!cards.length) return;
    sec = el('<section class="vt-sec ut2-idsec ut2-noren"><div class="vt-sec-head"><div class="vt-sec-plain"><div class="vt-sec-title">' + esc(cap(N.many)) + '</div></div></div>' +
      cards.map(idRowHTML).join('') + '</section>');
    sec.dataset.sig = sig;
    body.appendChild(sec);
  }
  function flatAll() {
    var R = document.documentElement;
    var host = q('#vtL2Tabs'), body = q('#vtL2Body');
    if (!FLAT) { if (R.classList.contains('ut2-flat')) R.classList.remove('ut2-flat'); idcSection(); return; }
    var allOn = !!(TOGGLE && !AONLY && host && body && host.querySelector('.vt-tab[data-tab="all"][aria-selected="true"]'));
    if (R.classList.contains('ut2-flat') !== allOn) R.classList.toggle('ut2-flat', allOn);
    if (!allOn || typeof window.vtRowHTML !== 'function') return;
    var list = body.parentNode.querySelector(':scope > .ut2-flist');
    if (!list) { list = el('<div class="ut2-flist ut2-noren"></div>'); body.parentNode.insertBefore(list, body.nextSibling); }
    var vs = []; try { vs = window.vtVaults() || []; } catch (e) {}
    var v = vs[0]; if (!v) return;
    var qy = ((q('#vtL2Search') || {}).value || '').trim().toLowerCase();
    var items = [];
    v.groups.forEach(function (g) { g.items.forEach(function (it) {
      if (!it._group) it._group = g.key;
      if (!qy || ((it.title || '') + ' ' + (it.desc || '')).toLowerCase().indexOf(qy) !== -1) items.push(it);
    }); });
    if (LISTV) idCards().forEach(function (c) { if (!qy || c.title.toLowerCase().indexOf(qy) !== -1) items.push(c); });
    items = flatSort(items);
    var sig = qy + '|' + items.map(function (it) { return it.id + (it.pinned ? '*' : '') + (it.ut2idc ? it.title : ''); }).join(',');
    if (sig === FLAT_SIG && list.childNodes.length) return;
    FLAT_SIG = sig;
    list.innerHTML = items.length
      ? '<section class="vt-sec first ut2-flatsec">' + items.map(function (it) { return it.ut2idc ? idRowHTML(it) : window.vtRowHTML(v.id, it); }).join('') + '</section>'
      : '<div class="ut2-aempty"><p>Nothing matches “' + esc(qy) + '”</p></div>';
  }
  function setAliasOnly(on, kind) {
    AONLY = on; if (kind) AKIND = kind;
    var R = document.documentElement;
    if (R.classList.contains('ut2-aonly') !== on) R.classList.toggle('ut2-aonly', on);
    if (on) renderAliasList(true);
    var sc = q('#vtL2Scroll'); if (on && sc) sc.scrollTop = Math.min(sc.scrollTop, (q('#vtL2Stick') || {}).offsetTop || 0);
  }
  /* Christine, 22 Oct: Day 01's Vault shows the tab strip too, all of it, as Day 30
     does — All · Alias · Password · Phone · Email · Payment · Bank · Address. The
     build draws only the kinds the Vault holds (and hides the strip on day 1);
     the missing ones are added here, and an empty one says so. */
  var D1T = [['login', 'Password', 'passwords'], ['phone', 'Phone', 'phone numbers'], ['email', 'Email', 'emails'],
             ['card', 'Payment', 'payment cards'], ['bank', 'Bank', 'bank accounts'], ['address', 'Address', 'addresses']];
  var D1SEL = null;
  /* Christine, 22 Oct: Day 01's alias page (email or phone) says where it
     forwards, with the switch — as Day 30's does. Remembered on the item (ut2fwd). */
  function d1Fwd() {
    if (!DAY1 || !AFTER) return;
    var d = q('#d1jDetail.on.dark'), row = q('#d1jDetail .ut2-d1fwd');
    var vrow = d && d.querySelector('.d1j-det-vrow');
    var lab = ((q('#d1jDetLab') || {}).textContent || ''), val = ((q('#d1jDetVal') || {}).textContent || '').trim();
    var k = /phone/i.test(lab) ? 'phone' : /email/i.test(lab) ? 'email' : null;
    if (!vrow || !k || !val) { if (row && !q('#d1jDetail.on')) { row.remove(); var dd = q('#d1jDetail'); if (dd) dd.classList.remove('ut2-hasfwd'); } return; }
    if (row && row.dataset.v === val) return;
    if (row) row.remove();
    d.classList.add('ut2-hasfwd');
    var hit = null; vaultFlat().forEach(function (x) { if (String(x.it.desc || '').trim() === val) hit = x.it; });
    var real = k === 'phone' ? REAL_PHONE : REAL_EMAIL, on = !!(hit && hit.ut2fwd);
    row = el('<div class="ut2-d1fwd ut2-noren"><span class="t"><i>Forward to</i><b>' + esc(real) + '</b></span>' +
      '<button type="button" class="ut2-tgl' + (on ? ' on' : '') + '" role="switch" aria-checked="' + on + '" aria-label="Forward to ' + esc(real) + '"><i></i></button></div>');
    row.dataset.v = val;
    row.querySelector('.ut2-tgl').addEventListener('click', function () {
      on = !on; if (hit) hit.ut2fwd = on;
      this.classList.toggle('on', on); this.setAttribute('aria-checked', String(on));
    });
    vrow.parentNode.insertBefore(row, vrow.nextSibling);
  }
  /* Christine, 22 Oct (round 39): Home's "Risk level" is "Digital risk" — the
     identity cards say "Digital risk: Good" too (port/patch_icc.py), so one name. */
  if (AFTER) window.riskLabel = 'Digital risk';
  function homeRisk() {
    if (!AFTER) return;
    [].forEach.call(document.querySelectorAll('.dgr-head, .dgr-alt-head'), function (h) {
      if (/^\s*Risk level\s*$/.test(h.textContent)) h.textContent = 'Digital risk';
    });
    [].forEach.call(document.querySelectorAll('[data-tile-label="Risk level"]'), function (c) { c.dataset.tileLabel = 'Digital risk'; });
  }
  /* Christine, 23 Oct: Home's "Create alias identity" card keeps the mark the start-here
     card showed during onboarding (graph.svg), instead of switching to the thin outline eye */
  function d1jMark() {
    if (!AFTER) return;
    [].forEach.call(document.querySelectorAll('.d1j-mark'), function (m) {
      if (m.__ut2mk || !m.querySelector('svg path[d^="M1.6 10S5.4"]')) return;
      m.__ut2mk = 1;
      m.innerHTML = '<img src="assets/icons/Icons-Items/avatar-image/graph.svg" alt="" style="width:40px;height:40px;border-radius:50%;display:block">';
    });
  }
  function d1Tabs() {
    if (!DAY1 || !AFTER) return;
    var host = q('#vtL2Tabs'); if (!host) return;
    var all = host.querySelector('.vt-tab[data-tab="all"]'); if (!all) return;
    var prev = host.querySelector('.ut2-atab') || all;
    D1T.forEach(function (t) {
      var b = host.querySelector('.vt-tab[data-tab="' + t[0] + '"]');
      if (!b) { b = el('<button type="button" class="vt-tab ut2-d1t ut2-noren" data-tab="' + t[0] + '" aria-selected="false">' + t[1] + '</button>'); prev.parentNode.insertBefore(b, prev.nextSibling); }
      else if (b.previousElementSibling !== prev) prev.parentNode.insertBefore(b, prev.nextSibling);
      prev = b;
    });
    if (host.classList.contains('even')) host.classList.remove('even');
    var body = q('#vtL2Body'), em = body && body.querySelector(':scope > .ut2-d1empty');
    var own = D1SEL && host.querySelector('.ut2-d1t[data-tab="' + D1SEL + '"]');
    if (own) {
      [].forEach.call(host.querySelectorAll('.vt-tab'), function (b) { var on = String(b === own); if (b.getAttribute('aria-selected') !== on) b.setAttribute('aria-selected', on); });
      var T = D1T.filter(function (t) { return t[0] === D1SEL; })[0];
      if (body && !em) body.appendChild(el('<div class="ut2-d1empty ut2-noren"><p>No ' + T[2] + ' saved yet</p><button type="button" class="b">+ Add</button></div>'));
    } else if (em) em.remove();
  }
  document.addEventListener('click', function (e) {
    if (!DAY1 || !AFTER || !e.target.closest) return;
    var t = e.target.closest('#vtL2Tabs .vt-tab'); if (t) { D1SEL = t.classList.contains('ut2-d1t') ? t.dataset.tab : null; setTimeout(d1Tabs, 0); return; }
    if (e.target.closest('.ut2-d1empty .b')) { var f = q('#vaultsScreen .vt-fab'); if (f) f.click(); }
  }, true);
  function aliasTab() {
    var host = q('#vtL2Tabs'); if (!host) return;
    var all = host.querySelector('.vt-tab[data-tab="all"]');
    if (all && !host.querySelector('.ut2-atab')) {
      var b = el('<button type="button" class="vt-tab ut2-atab ut2-noren" data-tab="ut2alias" aria-selected="false">Alias</button>');
      b.addEventListener('click', function (e) {
        e.stopPropagation();                        /* the build's tab handler would take it for one of its own */
        if (!AONLY || AKIND !== 'alias') {
          var a = host.querySelector('.vt-tab[data-tab="all"]');
          if (a && a.getAttribute('aria-selected') !== 'true') a.click();   /* All first, so leaving Alias lands on All */
          setAliasOnly(true, 'alias');
        }
        aliasTab();
      });
      all.parentNode.insertBefore(b, all.nextSibling);
    }
    var at = host.querySelector('.ut2-atab');
    if (IDC_TAB && LISTV && at && !host.querySelector('.ut2-itab')) {
      var ib = el('<button type="button" class="vt-tab ut2-itab ut2-noren" data-tab="ut2idc" aria-selected="false">' + cap(N.many) + '</button>');
      ib.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!AONLY || AKIND !== 'idc') {
          var a = host.querySelector('.vt-tab[data-tab="all"]');
          if (a && a.getAttribute('aria-selected') !== 'true' && !AONLY) a.click();
          setAliasOnly(true, 'idc');
        }
        aliasTab();
      });
      at.parentNode.insertBefore(ib, at.nextSibling);
    }
    /* who looks selected: only aria-selected changes, which our observer ignores */
    var tabs = host.querySelectorAll('.vt-tab');
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].classList.contains('ut2-atab') ? (AONLY && AKIND === 'alias') :
               tabs[i].classList.contains('ut2-itab') ? (AONLY && AKIND === 'idc') : (AONLY ? false : null);
      if (on === null) continue;
      if (tabs[i].getAttribute('aria-selected') !== String(on)) tabs[i].setAttribute('aria-selected', String(on));
    }
    if (AONLY) renderAliasList(false);
  }
  document.addEventListener('click', function (e) {
    if (!AONLY || !e.target.closest) return;
    var t = e.target.closest('#vtL2Tabs .vt-tab:not(.ut2-atab):not(.ut2-itab), #vtL2Tabs .ut2-vtab');
    if (!t) return;
    var allTab = t.dataset && t.dataset.tab === 'all' && t.getAttribute('aria-selected') === 'false';
    setAliasOnly(false);
    if (allTab) { var h = q('#vtL2Tabs'); if (h) { var a = h.querySelector('.vt-tab[data-tab="all"]'); if (a) a.setAttribute('aria-selected', 'true'); } }
  }, true);
  document.addEventListener('input', function (e) {
    if (!e.target || e.target.id !== 'vtL2Search') return;
    if (AONLY) setAliasOnly(false);
    setTimeout(flatAll, 0);
  }, true);

  /* ── 1 Tab · folder list (Christine, 20 Oct) ───────────────────────────
     ID cards are items: they come from the build's wallet (Day 30
     icCardList, Day 01 the wallet's [data-card] + v3CardById) and are drawn
     as Vault rows. Folders (ours): Favorites = pinned ID cards, My Real Info =
     your own items, then the ones you make with "+ Add new Folder" (the same
     name sheet → pick list as the R3 folder flow). */
  var IDC_GLYPH = '<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M14.667 9.045v4.064c0 .86-.746 1.558-1.663 1.558H2.997c-.918 0-1.663-.698-1.663-1.558V9.045c0-.163.026-.318.077-.465.036-.111.085-.217.147-.315.058-.095.128-.184.207-.265.304-.314.744-.513 1.232-.513h10.007c.488 0 .928.199 1.232.513.08.081.149.17.207.265.062.098.111.203.148.313.05.147.076.304.076.467Z"/><path d="M14.667 6.108v.847c0 .163-.026.32-.076.467-.418-.358-.975-.578-1.587-.578H2.997c-.61 0-1.168.219-1.586.577a1.425 1.425 0 0 1-.077-.466v-.847c0-.858.746-1.557 1.663-1.557h10.007c.917 0 1.663.699 1.663 1.557Z"/><path d="M14.667 2.89v1.663c-.425-.399-1.014-.646-1.663-.646H2.997c-.649 0-1.238.247-1.663.646V2.891c0-.86.746-1.558 1.663-1.558h10.007c.917 0 1.663.698 1.663 1.558Z"/></svg>';
  var STAR_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M5 5.5A2.25 2.25 0 0 1 7.25 3.25h9.5A2.25 2.25 0 0 1 19 5.5v15.15l-7-4.98-7 4.98z"/></svg>';
  var FOLD = { favs: {}, list: [], n: 0, cur: null, ret: false, sig: '' };
  function idCards() {
    var out = [];
    if (typeof window.icCardList === 'function') {
      try { out = window.icCardList().map(function (c) { return { id: c.id, title: c.title, bg: c.bg, ink: c.ink, n: null }; }); } catch (e) {}
    } else {
      var seen = {};
      [].forEach.call(document.querySelectorAll('#icCards [data-card]'), function (e) {
        var id = e.dataset.card; if (seen[id]) return; seen[id] = 1;
        var c = typeof window.v3CardById === 'function' ? window.v3CardById(id) : null;
        out.push({ id: id, title: (c && c.title) || id, bg: (c && c.bg) || '#141410', ink: (c && c.ink) || '#F3F1ED', n: c && c.items ? c.items.length : null });
      });
    }
    out.forEach(function (c) { c.ut2idc = true; });
    return out;
  }
  function idAv(c, size) {
    return '<span class="vt-av ut2-idav" style="background:' + esc(c.bg) + ';color:' + esc(c.ink) + (size ? ';width:' + size + 'px;height:' + size + 'px' : '') + '">' + IDC_GLYPH + '</span>';
  }
  function idRowHTML(c) {
    return '<button class="vt-row ut2-idrow" type="button" data-ut2card="' + esc(c.id) + '">' + idAv(c) +
      '<span class="vt-row-main"><span class="vt-row-top"><span class="vt-row-title">' + esc(c.title) + '</span></span>' +
      '<span class="vt-row-desc">' + cap(N.one) + (c.n != null ? ' · ' + c.n + (c.n === 1 ? ' item' : ' items') : '') + (FOLD.favs[c.id] ? ' · Favorite' : '') + '</span></span></button>';
  }
  function openIdc(id, fromItems) {
    FOLD.cur = id; FOLD.ret = !!fromItems;
    if (typeof window.icOpenCard === 'function') window.icOpenCard(id);
    setTimeout(syncPin, 120);
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var r = e.target.closest('[data-ut2card]'); if (!r || !e.target.closest('#vaultsScreen')) return;
    e.stopPropagation(); e.preventDefault();
    openIdc(r.dataset.ut2card, true);
  }, true);
  /* pin = into Favorites. Day 30's card page has a bookmark (#icDetailStar) that
     only toggles itself; Day 01's has none, so it gets one beside Edit. */
  function curCardId() {
    if (DAY1 && typeof window.v3CurCard === 'function') { var c = window.v3CurCard(); if (c) return c.id; }
    return FOLD.cur;
  }
  function syncPin() {
    var b = q('#icDetailStar') || q('#icL2 .ut2-pin'); if (!b) return;
    var on = !!FOLD.favs[curCardId()];
    if (b.getAttribute('aria-pressed') !== String(on)) b.setAttribute('aria-pressed', String(on));
  }
  function pinButton() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    if (!AFTER) return;   /* Christine, 21 Oct: folders in every version, so Favorites (pin) too */
    var bar = q('#icL2 .ic-top-bar'); if (!bar) return;
    if (!q('#icDetailStar') && !bar.querySelector('.ut2-pin')) {
      var b = el('<button type="button" class="ic-btn round ut2-pin ut2-noren" aria-label="Pin to Favorites" aria-pressed="false">' + STAR_SVG + '</button>');
      b.addEventListener('click', function () {
        var id = curCardId(); if (!id) return;
        if (FOLD.favs[id]) delete FOLD.favs[id]; else FOLD.favs[id] = 1;
        syncPin();
        if (typeof window.icToast === 'function') window.icToast(FOLD.favs[id] ? 'Added to Favorites' : 'Removed from Favorites');
      });
      var edit = bar.querySelector('.capsule, .pill'); bar.insertBefore(b, edit || null);
    }
    /* Christine, 22 Oct (Figma 9714:75743): bookmark, share, Edit — Day 01's bar had no share */
    if (!bar.querySelector('[aria-label="Share this card"], .ut2-share')) {
      var sh = el('<button type="button" class="ic-btn round ut2-share ut2-noren" aria-label="Share this card"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.9639 3.82495L15.1572 21.825L13.8044 21.9883L9.25244 14.5916L1.85645 10.0403L2.01978 8.6875L20.0198 2.88086L20.9639 3.82495ZM4.02808 9.61475L10.0457 13.3179L13.332 10.0322L14.3926 11.0935L10.9678 14.5168L14.2292 19.8159L19.0859 4.75806L4.02808 9.61475Z"/></svg></button>');
      sh.addEventListener('click', function () { if (typeof window.icToast === 'function') window.icToast('Share this ' + N.one); });
      var ed = bar.querySelector('.capsule, .pill'); bar.insertBefore(sh, ed || null);
    }
    /* back from a card opened in Items goes back to Items */
    var l2 = q('#icL2'), open = !!(l2 && l2.classList.contains('open'));
    if (open) syncPin();
    if (FOLD.wasOpen && !open && FOLD.ret) { FOLD.ret = false; goTabSafe('vaults'); }
    FOLD.wasOpen = open;
  }
  document.addEventListener('click', function (e) {
    if (V3ID || !AFTER || !e.target.closest || !e.target.closest('#icDetailStar')) return;
    var id = curCardId(); if (!id) return;
    if (FOLD.favs[id]) delete FOLD.favs[id]; else FOLD.favs[id] = 1;   /* the build flips aria-pressed and toasts after this */
    setTimeout(function () { var b = q('#icDetailStar'); if (b) { b.setAttribute('aria-pressed', String(!!FOLD.favs[id])); } if (window.icToast) window.icToast(FOLD.favs[id] ? 'Added to Favorites' : 'Removed from Favorites'); }, 0);
  }, true);

  function ownItems() {
    return vaultFlat().filter(function (r) { return r.g !== 'contact' ? !itemIsAlias(r.g, r.it) : true; });
  }
  function folderEntries(f) {
    var cards = idCards(), byId = {};
    cards.forEach(function (c) { byId[c.id] = c; });
    if (f.id === 'fav') return Object.keys(FOLD.favs).filter(function (id) { return byId[id]; }).map(function (id) { return { card: byId[id] }; });
    if (f.id === 'real') return ownItems().map(function (r) { return { item: r }; });
    var all = vaultFlat(), items = {};
    all.forEach(function (r) { items[r.it.id] = r; });
    return (f.cards || []).filter(function (id) { return byId[id]; }).map(function (id) { return { card: byId[id] }; })
      .concat((f.items || []).filter(function (id) { return items[id]; }).map(function (id) { return { item: items[id] }; }));
  }
  function folders() { return [{ id: 'fav', name: 'Favorites' }, { id: 'real', name: 'My Real Info' }].concat(FOLD.list); }
  function entAv(en, size) {
    if (en.card) return idAv(en.card, size);
    try { return window.vtAvatarHTML(en.item.it.icon, en.item.it); } catch (e) { return '<span class="vt-av"></span>'; }
  }
  function folderList() {
    if (!LISTV) return;
    var scr = q('#icL1Scroll'); if (!scr) return;
    var box = scr.querySelector(':scope > .ut2-flv');
    if (!box) {
      box = el('<div class="ut2-flv ut2-noren"><div class="cnt"></div><div class="fl"></div><button type="button" class="add">+ Add new Folder</button></div>');
      box.querySelector('.add').addEventListener('click', function () { openNameSheet({ word: 'folder', onCreate: function (name) { openBulkPick(name, { cards: true, onSave: saveFolder }); } }); });
      box.querySelector('.fl').addEventListener('click', function (e) {
        var c = e.target.closest('.fc'); if (!c) return;
        var f = folders().filter(function (x) { return x.id === c.dataset.f; })[0]; if (f) openFolderPage(f);
      });
      var faq = scr.querySelector(':scope > .vt-faq');
      scr.insertBefore(box, faq || null);
    }
    var fs = folders();
    var data = fs.map(function (f) { return { f: f, en: folderEntries(f) }; });
    var sig = data.map(function (d) { return d.f.id + ':' + d.en.map(function (x) { return x.card ? x.card.id + x.card.title : x.item.it.id; }).join(','); }).join('|');
    if (sig === FOLD.sig && box.querySelector('.fc')) return;
    FOLD.sig = sig;
    box.querySelector('.cnt').textContent = fs.length + ' Folders';
    box.querySelector('.fl').innerHTML = data.map(function (d) {
      var n = d.en.length, show = d.en.slice(0, 3);
      return '<button type="button" class="fc" data-f="' + esc(d.f.id) + '"><span class="nm">' + esc(d.f.name) + '</span><span class="ct">' + n + (n === 1 ? ' item' : ' items') + '</span>' +
        (n ? '<span class="avs">' + show.map(function (en) { return '<span class="av">' + entAv(en) + '</span>'; }).join('') + (n > 3 ? '<span class="more">+' + (n - 3) + '</span>' : '') + '</span>'
           : '<span class="hint">' + (d.f.id === 'fav' ? 'Pin ' + N.a + ' ' + N.one + ' to keep it here' : 'Nothing here yet') + '</span>') + '</button>';
    }).join('');
  }
  function saveFolder(name, picks, cardIds) {
    var f = { id: 'uf' + (++FOLD.n), name: name, items: picks.map(function (r) { return r.it.id; }), cards: cardIds || [] };
    FOLD.list.push(f); FOLD.sig = '';
    folderList();
    if (FLP) paintFolders(FLP);
    var fl2 = q('#icL1Scroll > .ut2-fl2'); if (fl2) fl2.dataset.sig = '';
    openFolderPage(f);
  }
  /* Christine, 21 Oct (Figma 9644:86479) — 1 Tab · Folder list: no Items |
     Folders toggle; a folder button at the Vault's top right opens "Folders"
     (back · Folders · Edit, "N folders", white folder cards with "N items",
     "Create a new folder"), and a folder opens its own page (serif name,
     "N items", tabs, the items as Vault rows). */
  var FL_ICON = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M18.75 5.52148C18.75 4.60101 18.0038 3.85482 17.0833 3.85482H10.2548C10.0887 3.85482 9.92644 3.8052 9.78877 3.71232L7.58623 2.22648C7.44856 2.13361 7.28627 2.08398 7.1202 2.08398H2.91667C1.99619 2.08398 1.25 2.83018 1.25 3.75065V14.584C1.25 15.5045 1.99619 16.2507 2.91667 16.2507H17.0833C18.0038 16.2507 18.75 15.5045 18.75 14.584V5.52148Z" stroke="currentColor" stroke-width="1.25"/></svg>';
  var FL_BACK = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  function flTop(title) {
    return '<button type="button" class="ut2-con-back fl-back" aria-label="Back">' + FL_BACK + '</button>' +
      (title ? '<div class="fl-tt">' + esc(title) + '</div>' : '') +
      '<button type="button" class="fl-edit">Edit</button>';
  }
  function flEditToast(p) {
    p.querySelector('.fl-edit').addEventListener('click', function () { if (window.icToast) window.icToast('Edit — not in this prototype yet'); });
  }
  function vaultFoldBtn() {
    if (!AFTER) return;   /* Christine, 21 Oct: the folder button in every version (2 Tabs, 1 Tab ID cards, Folder list) */
    if (!CARDV) return;   /* Christine, 22 Oct: no folder button on the Vault for now (Day 01, then Day 30 too) */
    var edit = q('#vtL2Edit'); if (!edit || edit.parentNode.querySelector('.ut2-vfold')) return;
    /* 1 Tab · ID cards (21 Oct): the top-right button is the ID cards one (the
       nav's card glyph) and opens the card wallet; the toggle's Folders has the folders */
    var navIc = q('.bottom-nav .nav-item[onclick*="idcard"] svg');
    var b = CARDV
      ? el('<button type="button" class="vt-bar-btn ut2-vfold ut2-vcard ut2-noren" aria-label="' + cap(N.many) + '">' + (navIc ? navIc.outerHTML : IDC_GLYPH) + '</button>')
      : el('<button type="button" class="vt-bar-btn ut2-vfold ut2-noren" aria-label="Folders">' + FL_ICON + '</button>');
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      if (CARDV) { IVW.next = 'cards'; goTabSafe('idcard'); } else openFoldersPage();
    });
    edit.parentNode.insertBefore(b, edit.nextSibling);
  }
  /* 1 Tab · ID cards (Christine, 21 Oct): the Folders side of the toggle is two
     views of #idcardScreen — 'folders' (from the toggle: the real folder list,
     the same cards as the Folders page) and 'cards' (from the top-right ID card
     button: the wallet, with a back button and no toggle). */
  var CARDV = AFTER && TOGGLE && !LISTV;
  var IVW = { v: 'cards', next: null, open: false };
  function cardView() {
    if (!CARDV) return;
    var ic = q('#idcardScreen'), open = !!(ic && ic.classList.contains('open'));
    if (open && !IVW.open) { IVW.v = IVW.next || 'cards'; IVW.next = null; }
    IVW.open = open;
    var R = document.documentElement, f = open && IVW.v === 'folders', c = open && IVW.v === 'cards';
    if (R.classList.contains('ut2-ivf') !== f) R.classList.toggle('ut2-ivf', f);
    if (R.classList.contains('ut2-ivc') !== c) R.classList.toggle('ut2-ivc', c);
    var head = q('#icL1 .blank-head');
    if (head && !head.querySelector(':scope > .ut2-icback')) {
      var bk = el('<button type="button" class="ut2-icback ut2-noren" aria-label="Back">' + FL_BACK + '</button>');
      bk.addEventListener('click', function () { goTabSafe('vaults'); });
      head.insertBefore(bk, head.firstChild);
    }
    var scr = q('#icL1Scroll'); if (!scr) return;
    var box = scr.querySelector(':scope > .ut2-fl2');
    if (!box) {
      box = el('<div class="ut2-fl2 ut2-noren"><p class="fl-cnt"></p><div class="fl-cards"></div></div>');
      box.querySelector('.fl-cards').addEventListener('click', function (e) {
        if (e.target.closest('.fl-new')) {
          openNameSheet({ word: 'folder', onCreate: function (name) { openBulkPick(name, { cards: false, onSave: saveFolder }); } });
          return;
        }
        var cd = e.target.closest('.fl-card'); if (!cd) return;
        var fo = folders().filter(function (x) { return x.id === cd.dataset.f; })[0]; if (fo) openFolderPage(fo);
      });
      scr.insertBefore(box, scr.querySelector(':scope > .vt-faq'));
    }
    if (f) {
      var sig = folders().map(function (x) { return x.id + ':' + folderEntries(x).length; }).join('|');
      if (box.dataset.sig !== sig) { box.dataset.sig = sig; paintFolders(box); }
    }
  }
  var FLP = null;
  function paintFolders(p) {
    var fs = folders();
    p.querySelector('.fl-cnt').textContent = fs.length + (fs.length === 1 ? ' folder' : ' folders');
    p.querySelector('.fl-cards').innerHTML = fs.map(function (f) {
      var n = folderEntries(f).length;
      return '<button type="button" class="fl-card" data-f="' + esc(f.id) + '"><b>' + esc(f.name) + '</b><i>' + n + (n === 1 ? ' item' : ' items') + '</i></button>';
    }).join('') +
      '<button type="button" class="ut2-add-row fl-new"><span class="ic">' + ADD_IC.other + '</span><span class="l">Create a new folder</span></button>';
  }
  function openFoldersPage() {
    var p = conPage('flist', flTop('Folders') + '<p class="fl-cnt"></p><div class="fl-cards"></div>');
    FLP = p; flEditToast(p); paintFolders(p);
    p.querySelector('.fl-cards').addEventListener('click', function (e) {
      if (e.target.closest('.fl-new')) {
        /* 1 Tab · ID cards calls the ID cards themselves folders, so a folder there holds Vault items only */
        openNameSheet({ word: 'folder', onCreate: function (name) { openBulkPick(name, { cards: !(TOGGLE && !LISTV), onSave: saveFolder }); } });
        return;
      }
      var c = e.target.closest('.fl-card'); if (!c) return;
      var f = folders().filter(function (x) { return x.id === c.dataset.f; })[0]; if (f) openFolderPage(f);
    });
    var back = p.querySelector('.ut2-con-back');
    back.addEventListener('click', function () { if (FLP === p) FLP = null; });
  }
  var FL_TAB = { idc: function () { return cap(N.many); }, login: 'Password', phone: 'Phone', email: 'Email', card: 'Payment', bank: 'Bank', address: 'Address', contact: 'Contact', other: 'Others' };
  var FL_ORD = ['idc', 'login', 'phone', 'email', 'card', 'bank', 'address', 'contact', 'other'];
  function openFolderPage(f) {
    if (!AFTER) return openFolderPageOld(f);
    var en = folderEntries(f), vs = []; try { vs = window.vtVaults() || []; } catch (e) {}
    var v = vs[0] || { id: 'primary' };
    var kindOf = function (x) { return x.card ? 'idc' : x.item.g; };
    var has = {}, anyAlias = false;
    en.forEach(function (x) { has[kindOf(x)] = 1; if (x.item && itemIsAlias(x.item.g, x.item.it)) anyAlias = true; });
    var tabs = [['all', 'All']].concat(anyAlias ? [['alias', 'Alias']] : [])
      .concat(FL_ORD.filter(function (k) { return has[k]; }).map(function (k) { var l = FL_TAB[k]; return [k, typeof l === 'function' ? l() : l]; }));
    var p = conPage('fpage', flTop('') +
      '<h2>' + esc(f.name) + '</h2><p class="fsub">' + en.length + (en.length === 1 ? ' item' : ' items') + '</p>' +
      '<div class="fl-tabs">' + tabs.map(function (t, i) { return '<button type="button" class="tab' + (i ? '' : ' on') + '" data-k="' + t[0] + '">' + esc(t[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="fl-ls">' + (en.length ? en.map(function (x, i) {
        var t = x.card ? x.card.title : x.item.it.title, d = x.card ? cap(N.one) : (x.item.it.desc || '');
        return '<button type="button" class="frow" data-i="' + i + '" data-k="' + kindOf(x) + '"' + (x.item && itemIsAlias(x.item.g, x.item.it) ? ' data-alias="1"' : '') + '>' +
          entAv(x) + '<span class="tx"><b>' + esc(t) + '</b><i>' + esc(d) + '</i></span></button>';
      }).join('') : '<p class="fempty">' + (f.id === 'fav' ? 'Open ' + N.a + ' ' + N.one + ' and tap the bookmark to pin it here.' : 'Nothing here yet.') + '</p>') + '</div>');
    flEditToast(p);
    p.querySelector('.fl-tabs').addEventListener('click', function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      [].forEach.call(p.querySelectorAll('.fl-tabs .tab'), function (x) { x.classList.toggle('on', x === b); });
      var k = b.dataset.k;
      [].forEach.call(p.querySelectorAll('.frow'), function (r) {
        r.hidden = !(k === 'all' || (k === 'alias' ? r.dataset.alias === '1' : r.dataset.k === k));
      });
    });
    p.querySelector('.fl-ls').addEventListener('click', function (e) {
      var r = e.target.closest('.frow'); if (!r) return;
      var x = en[+r.dataset.i];
      [].forEach.call(document.querySelectorAll('.ut2-con.flist, .ut2-con.fpage'), conClose); FLP = null;   /* the item opens in the Vault itself */
      if (x.card) { openIdc(x.card.id, true); return; }
      goTabSafe('vaults');
      setTimeout(function () { try { window.vtOpenItem(v.id, x.item.it.id); } catch (er) {} }, 60);
    });
    p.querySelector('.ut2-con-back').addEventListener('click', function () { if (FLP) paintFolders(FLP); });
  }
  function openFolderPageOld(f) {
    var en = folderEntries(f), vs = []; try { vs = window.vtVaults() || []; } catch (e) {}
    var v = vs[0] || { id: 'primary' };
    var p = conPage('fold',
      '<button type="button" class="ut2-con-back" aria-label="Back">' + CHEV + '</button>' +
      '<h2>' + esc(f.name) + '</h2><p class="fsub">' + en.length + (en.length === 1 ? ' item' : ' items') + '</p>' +
      (en.length ? en.map(function (x, i) {
        var t = x.card ? x.card.title : x.item.it.title, d = x.card ? cap(N.one) : (x.item.it.desc || '');
        return '<button type="button" class="frow" data-i="' + i + '">' + entAv(x) + '<span class="tx"><b>' + esc(t) + '</b><i>' + esc(d) + '</i></span></button>';
      }).join('') : '<p class="fempty">' + (f.id === 'fav' ? 'Open ' + N.a + ' ' + N.one + ' and tap the bookmark to pin it here.' : 'Nothing here yet.') + '</p>'));
    p.addEventListener('click', function (e) {
      var r = e.target.closest('.frow'); if (!r) return;
      var x = en[+r.dataset.i]; conClose(p);
      if (x.card) { openIdc(x.card.id, false); return; }
      goTabSafe('vaults');
      setTimeout(function () { try { window.vtOpenItem(v.id, x.item.it.id); } catch (er) {} }, 380);
    });
  }

  /* Christine, 20 Oct: Contact is one form — name, email and phone together —
     saved as one Contact item (its own Vault section), not an email and a
     phone stored apart. Same frame as the build's Add password page. */
  function esc(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var CON = { n: 0 };
  var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  var CON_TONES = ['#B3C59A', '#E3C9A8', '#C9D6E8', '#E8C9D6', '#D6D0C4'];
  function conPage(cls, html) {
    var host = document.querySelector('.phone-frame') || document.body;
    var p = el('<div class="ut2-con ' + cls + ' ut2-noren" role="dialog">' + html + '</div>');
    host.appendChild(p);
    requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add('on'); }); });
    p.querySelector('.ut2-con-back').addEventListener('click', function () { conClose(p); });
    return p;
  }
  function conClose(p) { p.classList.remove('on'); setTimeout(function () { p.remove(); }, 380); }
  function openContactForm() {
    var p = conPage('form',
      '<button type="button" class="ut2-con-back" aria-label="Back">' + CHEV + '</button>' +
      '<h2>Add contact</h2>' +
      '<label class="row"><span>Name</span><input type="text" data-f="name" placeholder="ex: Margaret Lee" autocomplete="off"></label>' +
      '<div class="band"></div>' +
      '<label class="row"><span>Email</span><input type="email" data-f="email" placeholder="Add email" autocomplete="off" autocapitalize="off" spellcheck="false"></label>' +
      '<label class="row"><span>Phone</span><input type="tel" data-f="phone" placeholder="Add phone number" autocomplete="off"></label>' +
      '<button type="button" class="ut2-con-save" disabled>Save</button>');
    var f = function (k) { return p.querySelector('[data-f="' + k + '"]'); };
    var save = p.querySelector('.ut2-con-save');
    var check = function () { save.disabled = !(f('name').value.trim() && (f('email').value.trim() || f('phone').value.trim())); };
    p.addEventListener('input', check);
    setTimeout(function () { try { f('name').focus({ preventScroll: true }); } catch (e) {} }, 400);
    save.addEventListener('click', function () {
      if (save.disabled) return;
      addContact(f('name').value.trim(), f('email').value.trim(), f('phone').value.trim());
      conClose(p);
      if (DAY1) { var x = q('#d1jAddClose'); if (x) x.click(); }
      else if (typeof window.vtCloseAdd === 'function') window.vtCloseAdd();
      setAliasOnly(false);
      goTabSafe('vaults');
    });
  }
  function addContact(name, email, phone) {
    var vs = []; try { vs = window.vtVaults() || []; } catch (e) {}
    var v = vs[0]; if (!v) return;
    var g = null; v.groups.forEach(function (x) { if (x.key === 'contact') g = x; });
    if (!g) {
      g = { key: 'contact', label: 'Contact', items: [] };
      var at = -1; v.groups.forEach(function (x, i) { if (x.key === 'email' || x.key === 'phone') at = i; });
      v.groups.splice(at + 1, 0, g);
    }
    var tone = CON_TONES[CON.n % CON_TONES.length];
    var it = { id: 'ut2c' + (++CON.n), title: name, desc: [email, phone].filter(Boolean).join(' · '), own: true, _group: 'contact',
               icon: { raw: '<span class="ut2-letter">' + esc(name.charAt(0).toUpperCase()) + '</span>', bg: tone },
               ut2con: { name: name, email: email, phone: phone, tone: tone } };
    g.items.push(it);
    if (typeof window.vtRefresh === 'function') window.vtRefresh();
  }
  /* ── Christine, 21 Oct: Phone / Email / Payment card open a form of their own
     (no "yours or an alias" sheet). With the Phone, Email or Card number field
     focused, the keyboard carries the Password form's bar — your own value on
     the left, "Hide my phone / email / card" on the right. Hide generates the
     alias on the spot into the field (an email also gets its Forward to
     toggle); Create saves it; and a new alias is followed by a short tray on
     how to use it. Same page on both builds (vtAddMade / AV.decide). ── */
  var AF = { phone: { h: 'New phone number', lab: 'Phone', ph: '000-000-0000', mine: REAL_PHONE, hide: 'Hide my phone', tp: 'Work' },
             email: { h: 'New email', lab: 'Email', ph: 'example.com', mine: REAL_EMAIL, hide: 'Hide my email', tp: 'example.com' },
             card:  { h: 'Add a payment card', lab: 'Card number', ph: '1234 1234 1234 1234', mine: '', hide: 'Hide my card', tp: 'Free trials, Online shopping…' } };
  var AF_HOW = { phone: ['How your phone works', 'Give it out instead of your real one. Calls and texts come to this number in Cloaked, and you can mute it any time.'],
                 email: ['How your identity works', 'Sign up with it anywhere. Mail forwards to ' + REAL_EMAIL + ' — turn forwarding off when it gets noisy.'],
                 card:  ['How your card works', 'Pay with it online like any card. Charges go to your real card; the merchant never sees your number.'] };
  var AF_ROLL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.5 4.2v4.6h-4.6"/></svg>';
  function afCardNum() { var d = function (n) { var o = ''; for (var i = 0; i < n; i++) o += Math.floor(Math.random() * 10); return o; }; return '4111 2098 ' + d(4) + ' ' + d(4); }
  function openAddForm(k) {
    var A = AF[k]; if (!A) return;
    var R = document.documentElement;
    var rowIn = function (lab, f, ph, type) { return '<label class="row" data-r="' + f + '"><span>' + lab + '</span><input type="' + (type || 'text') + '" data-f="' + f + '" data-kbd="1" placeholder="' + ph + '" autocomplete="off" autocapitalize="off" spellcheck="false"></label>'; };
    var p = conPage('form af af-' + k,
      '<button type="button" class="ut2-con-back" aria-label="Back">' + CHEV + '</button>' +
      '<h2>' + A.h + '</h2>' +
      rowIn('Title', 'title', A.tp) +
      (k === 'card' ? rowIn('Cardholder name', 'holder', 'Name on card') : '') +
      rowIn(A.lab, 'value', A.ph, k === 'phone' ? 'tel' : 'text').replace('</label>', '<button type="button" class="rr" aria-label="Try another">' + AF_ROLL + '</button></label>') +
      (k === 'card' ? rowIn('Expiration date', 'exp', 'MM/YY') + rowIn('Security code', 'cvc', '123') : '') +
      '<div class="band"></div>' +
      /* Christine, 22 Oct: a phone alias forwards too (to your real number), like an email; no "+ Add folder or tag" */
      '<div class="row fwd" hidden><span class="col"><span class="fk">Forward to</span><span class="fv">' + esc(k === 'phone' ? REAL_PHONE : REAL_EMAIL) + '</span></span><button type="button" class="ut2-tgl" role="switch" aria-checked="false" aria-label="Forward to ' + esc(k === 'phone' ? REAL_PHONE : REAL_EMAIL) + '"><i></i></button></div>' +
      rowIn('Notes', 'note', '') +
      '<button type="button" class="ut2-con-save" disabled>Create</button>' +
      '<div class="ut2-hbar" data-kbd-keep="1" hidden>' + (A.mine ? '<button type="button" class="b mine">' + esc(A.mine) + '</button><span class="x"></span>' : '') + '<button type="button" class="b hide">' + A.hide + '</button></div>');
    R.classList.add('ut2-afon');
    var f = function (n) { return p.querySelector('[data-f="' + n + '"]'); };
    var save = p.querySelector('.ut2-con-save'), bar = p.querySelector('.ut2-hbar'), fwd = p.querySelector('.row.fwd');
    /* the bar rides the keyboard, so it lives beside the page, not inside the scroller */
    (document.querySelector('.phone-frame') || document.body).appendChild(bar);
    var st = { alias: false, fwd: false };
    var check = function () { save.disabled = !(f('title').value.trim() && f('value').value.trim()); };
    p.addEventListener('input', check);
    var tick = setInterval(function () { if (!p.isConnected) return clearInterval(tick); check(); }, 250);
    var kb = function (el) { try { if (el) { el.focus({ preventScroll: true }); if (window.kbdShow) window.kbdShow(el); p.classList.add('kb'); } else { if (window.kbdHide) window.kbdHide(); p.classList.remove('kb'); } } catch (e) {} };
    p.addEventListener('focusin', function (e) {
      var i = e.target.closest && e.target.closest('input[data-kbd]'); if (!i) return;
      if (window.kbdShow) window.kbdShow(i); p.classList.add('kb');
      bar.hidden = !(i === f('value') && !st.alias);
    });
    var onClick = function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.classList.contains('tap')) { if (window.icToast) window.icToast(t.dataset.t); return; }
      if (t.classList.contains('ut2-tgl')) { st.fwd = !st.fwd; t.classList.toggle('on', st.fwd); t.setAttribute('aria-checked', st.fwd ? 'true' : 'false'); return; }
      if (t.classList.contains('mine')) { f('value').value = A.mine; check(); return; }
      if (t.classList.contains('rr')) {                /* Christine, 21 Oct: keep rolling until it is the one you want */
        if (k === 'card') { f('value').value = afCardNum(); f('cvc').value = String(100 + Math.floor(Math.random() * 900)); }
        else f('value').value = nidGen(k, f('title').value.trim());
        t.classList.add('spin'); setTimeout(function () { t.classList.remove('spin'); }, 360);
        e.preventDefault(); return;
      }
      if (t.classList.contains('hide')) {
        st.alias = true; p.classList.add('alias');
        var title = f('title').value.trim();
        if (k === 'card') {
          f('value').value = afCardNum(); f('exp').value = '09/27'; f('cvc').value = String(100 + Math.floor(Math.random() * 900));
          if (!f('holder').value.trim()) f('holder').value = 'Cloaked Pay';
        } else f('value').value = nidGen(k, title);
        if (k === 'email' || k === 'phone') fwd.hidden = false;
        bar.hidden = true; check();
        try { f('value').blur(); } catch (e2) {}
        kb(null);
        /* nothing more to type into the value; the title still needs one if it is empty */
        if (!title) setTimeout(function () { kb(f('title')); }, 260);
        return;
      }
    };
    p.addEventListener('click', onClick); bar.addEventListener('click', onClick);
    /* the bar leaves with the keys (a tap elsewhere puts them away) */
    if (window.kbdOnToggle) window.kbdOnToggle(function (on) { if (!p.isConnected || on) return; bar.hidden = true; p.classList.remove('kb'); });
    setTimeout(function () { kb(f('title')); }, 420);
    var closeAll = function () {
      kb(null); bar.remove(); conClose(p); setTimeout(function () { R.classList.remove('ut2-afon'); }, 380);
    };
    p.querySelector('.ut2-con-back').addEventListener('click', function () { bar.remove(); setTimeout(function () { R.classList.remove('ut2-afon'); }, 380); kb(null); });
    save.addEventListener('click', function () {
      if (save.disabled) return;
      var title = f('title').value.trim(), val = f('value').value.trim();
      if (k === 'card') val = '.' + val.replace(/\D/g, '').slice(-4);   /* as the Vault's other cards read */
      var rec = { kind: k, alias: st.alias, title: title, name: title, value: val,
                  section: ALIAS_SEC[k], vlab: ALIAS_LAB[k], empty: ALIAS_EMPTY[k], cta: ALIAS_CTA[k], tone: null, glyph: '' };
      if (!st.alias) { rec.vlab = k === 'phone' ? 'Phone number' : k === 'email' ? 'Email' : 'Card number'; }
      if (window.AV && window.AV.decide) { try { rec.dec = window.AV.decide({ title: title, kind: k, value: val, alias: st.alias }); } catch (e) {} }
      if (rec.dec && rec.dec.glyph && rec.dec.glyph.type !== 'logo' && window.AV.markSVG) { try { rec.glyph = window.AV.markSVG(rec.dec.glyph.key); } catch (eg) {} }
      if (rec.dec && rec.dec.glyph && rec.dec.glyph.type === 'logo' && rec.dec.glyph.src) rec.glyph = '<img src="' + String(rec.dec.glyph.src).replace(/ /g, '%20') + '" alt="">';   /* a brand's logo, as the build draws it (the page's icon was empty) */
      var it = null; try { it = window.vtAddMade(rec); } catch (e3) {}
      if (it) { it.own = !st.alias; if (st.alias && (k === 'email' || k === 'phone')) it.ut2fwd = st.fwd; }
      /* Christine, 22 Oct: Save goes straight to the item's page — no Vault
         list in between. Everything underneath (the add sheet, the Vault tab,
         the item's page) is set up while the form still covers the screen;
         only then does the form leave, onto the page. */
      save.disabled = true;
      if (DAY1) { var x = q('#d1jAddClose'); if (x) x.click(); }
      else if (typeof window.vtCloseAdd === 'function') window.vtCloseAdd();
      setAliasOnly(false);
      goTabSafe('vaults');
      if (typeof window.vtRefresh === 'function') { try { window.vtRefresh(); } catch (e4) {} }
      /* Christine, 21 Oct (round 7): Create opens the item's own page, its
         avatar turns to the lock and back (saved), and a new alias then gets
         the "How your … works" tray (Figma 9714:74830). */
      var fwdOn = st.fwd;
      LASTROW = null;
      if (DAY1) { if (typeof window.d1jOpenMade === 'function') window.d1jOpenMade(rec); }
      else if (it && typeof window.vtOpenVaultItem === 'function') { try { window.vtOpenVaultItem((window.vtVaults()[0] || {}).id || 'primary', it.id); } catch (e5) {} }
      FLIPAT = Date.now();                                 /* openSpin lands on the icon's own face without turning; the flip below is the motion */
      /* 22 Oct: a push, as the build moves between pages — the page slides in
         from the right while the form moves off to the left, together */
      p.classList.add('fwd'); closeAll();
      setTimeout(flipSoon, 1000);                          /* after the page has settled — the build re-renders its hero once on open */
      if (st.alias) setTimeout(function () { howTray2(k, fwdOn); }, 3500);
    });
    return p;
  }
  /* Christine, 21 Oct (Figma 9714:74830): "How your identity works" — three
     rows on a light sheet. Email is the drawn one; phone and card follow it. */
  var HOW_IC = {
    out: '<svg viewBox="0 0 24 24" fill="none"><path d="M16.9902 16.3455L15.4918 16.2861L15.7687 9.36354L7.22539 17.9068L6.16473 16.8462L14.708 8.30288L7.78542 8.57979L7.72603 7.08133L17.3762 6.69532L16.9902 16.3455Z" fill="currentColor"/></svg>',
    hide: '<svg viewBox="0 0 24 24" fill="none"><path d="M19.0605 4.81055L4.06055 19.8105L3 18.75L5.01465 16.7344C3.33443 15.6309 1.93856 14.1301 0.966797 12.3613V11.6387C3.05784 7.83254 7.10222 5.25 11.75 5.25C13.1732 5.25004 14.5395 5.49295 15.8105 5.93848L18 3.75L19.0605 4.81055ZM18.2549 7.11523C20.0377 8.23098 21.5153 9.78971 22.5312 11.6387V12.3613C20.4402 16.1668 16.3975 18.7499 11.75 18.75C10.2223 18.75 8.76054 18.4688 7.41113 17.959L8.59082 16.7793C9.59017 17.0852 10.6509 17.25 11.75 17.25L12.1309 17.2432C15.9002 17.1121 19.1787 15.0447 21.0078 12C20.0666 10.4332 18.7413 9.12558 17.1631 8.20703L18.2549 7.11523ZM15.084 10.2861C15.3456 10.7971 15.4941 11.3758 15.4941 11.9893C15.4939 14.0571 13.8169 15.7334 11.749 15.7334C11.1358 15.7333 10.5577 15.5846 10.0469 15.3232L11.2061 14.1641C11.3801 14.2074 11.5615 14.2334 11.749 14.2334C12.9884 14.2334 13.9939 13.2286 13.9941 11.9893C13.9941 11.8014 13.9683 11.6197 13.9248 11.4453L15.084 10.2861ZM11.75 6.75C7.82081 6.75 4.38066 8.85279 2.49023 12C3.38399 13.4879 4.62498 14.7407 6.09961 15.6494L8.30273 13.4463C8.11302 12.9981 8.00494 12.5066 8.00488 11.9893C8.00504 9.92157 9.68136 8.24539 11.749 8.24512C12.2663 8.24512 12.7578 8.35321 13.2061 8.54297L14.6113 7.1377C13.6998 6.88681 12.7409 6.75003 11.75 6.75ZM11.749 9.74512C10.5098 9.74539 9.50504 10.75 9.50488 11.9893C9.5049 12.0705 9.511 12.1505 9.51953 12.2295L11.9893 9.75977C11.9103 9.75129 11.8303 9.74512 11.749 9.74512Z" fill="currentColor"/></svg>',
    twofa: '<span class="b2">2FA</span>',
    lock: '<svg viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M24.2654 4.05273C30.8925 4.05273 36.2649 9.11637 36.2654 15.3629V20.3605L44 20.3084V44.0007H4V20.3084L12.2654 20.3605V15.3629C12.2659 9.11637 17.6383 4.05273 24.2654 4.05273ZM24.2654 8.57794C20.2893 8.57794 17.0667 11.6151 17.0662 15.3629V20.3605H31.4646V15.3629C31.4641 11.6151 28.2416 8.57794 24.2654 8.57794Z" fill="currentColor"/></svg>'
  };
  var HOW2 = {
    email: ['How your identity works', [['out', 'Messages come to you', 'Emails forward to ' + REAL_EMAIL], ['hide', 'Sites only see the alias', 'Your real email and number stay hidden.'], ['twofa', 'Login codes still arrive', '2FA codes forward like any other messages.']]],
    /* Christine, 22 Oct: a Cloaked number doesn't forward — calls and texts come to it, in Cloaked */
    phone: ['How your phone works', [['chat', 'Calls and texts come here', 'Pick them up in Cloaked, on this number.'], ['hide', 'People only see the alias', 'Your real number stays hidden.'], ['twofa', 'Login codes still arrive', '2FA texts land here like any other message.']]],
    card:  ['How your card works', [['out', 'Pay like any card', 'Charges go to your real card.'], ['hide', 'Merchants only see the alias', 'Your real card number stays hidden.'], ['lock', 'Lock or limit any time', 'Set a spending limit or pause the card.']]]
  };
  /* Christine, 22 Oct: after making an identity, the same kind of tray tells you how to use it */
 var IDHOW_OFF = (function () { try { return localStorage.getItem('ut2-idhow-off') === '1'; } catch (e) { return false; } })();
  /* Christine, 22 Oct (later): what to know right after making one — the
     aliases are here together, by situation; each one is ALSO its own item in
     the Vault; use them to reach people; replies land here unless the email
     forwards to you. Says what this identity actually has (email / phone / card). */
  HOW_IC.cards = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="2.5" y="8.5" width="19" height="12.5" rx="2.2"/><path d="M4.5 5.2h15M7 2.2h10"/></svg>';
  HOW_IC.chat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 5.5h16v10H9.5L5.5 19v-3.5H4z"/></svg>';
  HOW_IC.inbox = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3.5 13.5 6 5.5h12l2.5 8V19h-17z"/><path d="M3.5 13.5H8.5l1 2h5l1-2h5"/></svg>';
  function howTrayId(name, kinds, fwd) {
    if (IDHOW_OFF) return;
    kinds = (kinds || []).filter(function (k) { return /^(email|phone|card)$/.test(k); });
    var LAB = { email: 'email', phone: 'phone number', card: 'card' };
    var what = kinds.length ? kinds.map(function (k) { return LAB[k]; }) : ['aliases'];
    var list = what.length > 1 ? what.slice(0, -1).join(', ') + ' and ' + what[what.length - 1] : what[0];
    var cap1 = list.charAt(0).toUpperCase() + list.slice(1);
    var reach = kinds.indexOf('phone') >= 0 && kinds.indexOf('email') >= 0 ? 'Call, text or email from them \u2014 people only see the alias.'
      : kinds.indexOf('phone') >= 0 ? 'Call or text from it \u2014 people only see the alias.'
      : kinds.indexOf('email') >= 0 ? 'Email from it \u2014 people only see the alias.' : 'Use them anywhere you\u2019d use your own.';
    fwd = fwd || {};
    var hasE = kinds.indexOf('email') >= 0, hasP = kinds.indexOf('phone') >= 0;
    var inbox = hasE && hasP
      ? (fwd.email && fwd.phone ? 'Mail, calls and texts forward to you.'
        : fwd.email ? 'Mail forwards to ' + REAL_EMAIL + '. Calls and texts stay here.'
        : fwd.phone ? 'Calls and texts forward to ' + REAL_PHONE + '. Mail stays here.'
        : 'Mail, calls and texts show up right here.')
      : hasE ? (fwd.email ? 'Its mail also forwards to ' + REAL_EMAIL + '.' : 'Its email doesn\u2019t forward to you, so its inbox is right here.')
      : hasP && fwd.phone ? 'Calls and texts forward to ' + REAL_PHONE + '.'
      : 'Calls and texts to it show up right here.';
    HOW2.__id = ['How to use \u201c' + name + '\u201d', [
      ['cards', 'Together here, by situation', 'Your \u201c' + name + '\u201d aliases, in one place.'],
      ['lock', 'Each one is in your Vault', cap1 + ' ' + (kinds.length > 1 ? 'are' : 'is') + ' saved there as ' + (kinds.length > 1 ? 'their own items.' : 'its own item.')],
      ['chat', 'Reach people with it', reach],
      ['inbox', 'Replies land here', inbox]]];
    howTray2('__id', undefined, true);
  }
  function howTray2(k, fwdOn, idForm) {
    var H = HOW2[k]; if (!H) return;
    var rows = H[1].slice();
    if (k === 'email' && fwdOn === false) rows[0] = ['out', 'Messages wait in Cloaked', 'Turn forwarding on to get them in your inbox.'];
    if (k === 'phone' && fwdOn) { rows[0] = ['out', 'Calls and texts come to you', 'They forward to ' + REAL_PHONE + '.']; rows[2] = ['twofa', 'Login codes still arrive', '2FA texts forward like any other message.']; }
    if (k === 'phone' && fwdOn === false) rows[0] = ['chat', 'Calls and texts come here', 'Pick them up in Cloaked, or turn forwarding on.'];
    var host = document.querySelector('.phone-frame') || document.body;
    var t = el('<div class="ut2-vtray ut2-how2 ut2-noren"><div class="dim"></div>' +
      '<div class="ut2-onb-banner vtc" role="dialog" aria-label="' + esc(H[0]) + '">' +
      '<h3>' + esc(H[0]) + '</h3>' +
      rows.map(function (r) { return '<div class="hrow"><span class="av">' + HOW_IC[r[0]] + '</span><span class="tx"><b>' + esc(r[1]) + '</b><i>' + esc(r[2]) + '</i></span></div>'; }).join('') +
      '<div class="foot">' + (idForm
        /* Christine, 22 Oct: the identity's tray — Close, or Don't show again (remembered on this device) */
        ? '<button type="button" class="never">Don\u2019t show again</button><button type="button" class="ok">Close</button>'
        : '<button type="button" class="ok">Got it</button>') + '</div></div></div>');
    host.appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('on'); }); });
    var close = function () { t.classList.remove('on'); setTimeout(function () { t.remove(); }, 400); };
    t.querySelector('.ok').addEventListener('click', close);
    t.querySelector('.dim').addEventListener('click', close);
    var nv = t.querySelector('.never');
    if (nv) nv.addEventListener('click', function () { IDHOW_OFF = true; try { localStorage.setItem('ut2-idhow-off', '1'); } catch (e) {} close(); });
  }
  /* the short "how to use it" tray after a new alias — the Day 01 Vault tray's shape */
  function howTray(k, val) {
    var H = AF_HOW[k]; if (!H) return;
    var host = document.querySelector('.phone-frame') || document.body;
    var t = el('<div class="ut2-vtray ut2-how ut2-noren"><div class="dim"></div>' +
      '<div class="ut2-onb-banner vtc" role="dialog" aria-label="' + esc(H[0]) + '">' +
      '<button type="button" class="x" aria-label="Close">' + X_SVG + '</button>' +
      '<h3>' + esc(H[0]) + '</h3><div class="val">' + esc(val) + '</div><p>' + esc(H[1]) + '</p>' +
      '<button type="button" class="ok">Got it</button></div></div>');
    host.appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('on'); }); });
    var close = function () { t.classList.remove('on'); setTimeout(function () { t.remove(); }, 400); };
    t.querySelector('.x').addEventListener('click', close);
    t.querySelector('.ok').addEventListener('click', close);
    t.querySelector('.dim').addEventListener('click', close);
  }
  function openContact(it) {
    var c = it.ut2con;
    var row = function (lab, val) {
      return val ? '<div class="row"><span>' + lab + '</span><b>' + esc(val) + '</b><button type="button" class="cp" data-v="' + esc(val) + '">Copy</button></div>' : '';
    };
    var p = conPage('det',
      '<button type="button" class="ut2-con-back" aria-label="Back">' + CHEV + '</button>' +
      '<div class="hd"><span class="big" style="background:' + c.tone + '">' + esc(c.name.charAt(0).toUpperCase()) + '</span><h2>' + esc(c.name) + '</h2><p>Contact</p></div>' +
      row('Email', c.email) + row('Phone', c.phone));
    p.addEventListener('click', function (e) {
      var b = e.target.closest('.cp'); if (!b) return;
      try { navigator.clipboard.writeText(b.dataset.v); } catch (er) {}
      b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1200);
    });
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var r = e.target.closest('#vaultsScreen .vt-row[data-item^="ut2c"]'); if (!r) return;
    var vs = []; try { vs = window.vtVaults() || []; } catch (er) {}
    var it = null;
    vs.forEach(function (v) { v.groups.forEach(function (g) { g.items.forEach(function (x) { if (x.id === r.dataset.item) it = x; }); }); });
    if (!it || !it.ut2con) return;
    e.stopPropagation(); e.preventDefault();
    if (!e.target.closest('.vt-copy')) openContact(it);
  }, true);

  /* Christine, 20 Oct (Figma 9603:71305): the FAQ opens with the two basics —
     "What's Vault?" and "What's Alias?", tagged "How it works" (the frame says
     "How it work") — on the Vault and on Folders / the ID card tab. */
  var FAQ_TOP = [['How it works', 'What\u2019s<br>Vault?'], ['How it works', 'What\u2019s<br>Alias?']];
  /* Christine, 21 Oct: the Vault's one line moves behind a ? beside the title
     (like the ? beside "My ID cards"); tapping it shows the line in a sheet */
  var VQ_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.3-2.5 3.9"/><circle cx="12" cy="17.4" r=".6" fill="currentColor"/></svg>';
  function vaultQ() {
    var t = q('#vtL2Title'); if (!t || t.querySelector('.ut2-vq')) return;
    var b = el('<button type="button" class="ut2-vq ut2-noren" aria-label="What is the Vault?">' + VQ_SVG + '</button>');
    /* Christine, 22 Oct: the ? reopens the Vault intro (the cover + cards), not a line of text */
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      if (VONB2 && window.vtIntroOpen) { window.vtIntroOpen(); return; }   /* V2: V3's page */
      if (!ONB.el) { ONB.want = true; mountOnb(); }
      if (ONB.open) ONB.open(); else choiceSheet('What\u2019s Vault?', 'Your saved logins, emails, phones and cards. Real ones and aliases.', []);
    });
    t.appendChild(b);
  }
  /* Christine, 22 Oct: the Identities tab's FAQ is about identities, not the Vault */
  var FAQ_ID = [['How it works', 'What\u2019s an<br>' + N.one + '?'], ['How it works', 'What goes in<br>' + N.a + ' ' + N.one + '?'],
                ['Managing My Stuff', 'One ' + N.one + ' for each<br>part of your life']];
  function faqTop() {
    var fs = document.querySelectorAll('.vt-faq');
    for (var i = 0; i < fs.length; i++) {
      var cards = fs[i].querySelectorAll('.vt-faq-card');
      if (V3ID && fs[i].closest('#idcardScreen')) continue;   /* V3's own FAQ */
      var LIST = fs[i].closest('#idcardScreen') ? FAQ_ID : FAQ_TOP;
      for (var j = 0; j < LIST.length && j < cards.length; j++) {
        var c = cards[j]; if (c.getAttribute('data-ut2faq') === String(j)) continue;
        var t = c.querySelector('.vt-faq-tag'), qn = c.querySelector('.vt-faq-q');
        if (t) t.textContent = LIST[j][0];
        if (qn) qn.innerHTML = LIST[j][1];
        c.setAttribute('data-ut2faq', String(j));
      }
    }
  }

  /* 08 — Christine, 20 Oct: on an alias's page "Forward to" stays out in the
     open; only Temporary pause and Notes sit behind See Details. The build
     puts all three in one hidden block (#lgMore on Vault items, #nqDMore on a
     just-made alias), so the Forward row moves out in front of it. */
  function fwdOut() {
    [['#lgMore', '.lgm-row'], ['#nqDMore', '.nq-row']].forEach(function (p) {
      var box = q(p[0]); if (!box) return;
      var rows = box.querySelectorAll(':scope > ' + p[1]);
      for (var i = 0; i < rows.length; i++) {
        if (!/Forward to/.test(rows[i].textContent)) continue;
        rows[i].classList.add('ut2-fwdrow');
        box.parentNode.insertBefore(rows[i], box);
      }
    });
    /* 21 Oct (round 7): an alias made with forwarding ON in the form shows it on here — the build's toggle only knows its own default */
    var l3 = q('#vtL3.open'); if (!l3) return;
    var tg = l3.querySelector('.ut2-fwdrow .nq-tog, .ut2-fwdrow [role="switch"]'); if (!tg || tg.__ut2fw) return;
    var val = ((l3.querySelector('.cg-row.kv .cg-h') || {}).textContent || '').trim(); if (!val) return;
    var hit = null; vaultFlat().forEach(function (x) { if (String(x.it.desc || '').trim() === val) hit = x.it; });
    if (!hit) return;
    tg.__ut2fw = 1;
    if (hit.ut2fwd && tg.getAttribute('aria-checked') !== 'true') tg.click();
  }

  /* 09 — a Good card says what Good means */
  function addRiskLine() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    var host = document.getElementById('icDetailCard');
    if (!host) return;
    var alert = host.parentNode.querySelector('.ic-alert');
    var line = host.parentNode.querySelector('.ut2-risk');
    var risk = (host.querySelector('.ic-card-risk') || {}).textContent || '';
    var good = /good/i.test(risk) && !(alert && visible(alert));
    if (good && !line) host.parentNode.insertBefore(el('<div class="ut2-risk ut2-noren"><b>Risk level: Good.</b> None of these aliases showed up in a data leak. Checked daily.</div>'), host.nextSibling);
    else if (!good && line) line.remove();
  }

  /* 10 — the "what's it for" step can be skipped. The button joins the CTA row
     and borrows the build's own .icc-ghost, like "Add manually" on step 2. */
  function addPurposeSkip() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    var chips = document.getElementById('iccChips'), next = document.getElementById('iccNext');
    if (!next) return;
    var cta = next.parentNode, mine = cta.querySelector('.ut2-skip');
    var step1 = chips && visible(chips);
    if (!step1) { if (mine) mine.remove(); return; }
    if (mine) return;
    var b = el('<button class="icc-ghost ut2-skip ut2-noren" type="button">Skip</button>');
    b.addEventListener('click', function () {
      var c = chips.querySelector('.icc-chip'); if (c) c.click();
      setTimeout(function () { var n = document.getElementById('iccNext'); if (n && !n.disabled) n.click(); }, 120);
    });
    cta.insertBefore(b, next);
  }

  /* v20 — the ID card tab's + groups, it doesn't create: say so on the button */
  var GROUP_LABEL = 'Group aliases by situation';
  function labelGroupButton() {
    if (!TOGGLE) return;   /* 2 Tabs (Christine, 21 Oct): the + stays a bare +, like the Vault's, and opens our identity flow (below) */
    var f = document.querySelectorAll('.ic-fab');
    for (var i = 0; i < f.length; i++) {
      if (f[i].classList.contains('ut2-xfab')) continue;
      f[i].classList.add('ut2-xfab');
      f[i].setAttribute('aria-label', GROUP_LABEL);
      f[i].appendChild(el('<span class="ut2-xfab-t ut2-noren">' + GROUP_LABEL + '</span>'));
    }
  }

  /* 13 — the ID card row (a folder for anything) waits behind "+ Add folder or tag"
     in every Day 30 create form. Day 01's forms never had that row. */
  function addFolderTag() {
    var r = q('#nqForm [data-nqtoast="Select ID Card"]');
    if (!r || r.classList.contains('ut2-ft-row')) return;
    r.classList.add('ut2-ft-row', 'ut2-hide');
    var b = el('<button class="nq-row tap ut2-ft ut2-noren" type="button"><span class="nq-k">+ Add folder or tag</span></button>');
    b.addEventListener('click', function (e) { e.stopPropagation(); b.remove(); r.classList.remove('ut2-hide'); });
    r.parentNode.insertBefore(b, r);
  }

  /* 19 (?ut2cards=toggle) — no ID card tab. The Vault carries a toggle:
     Vaults (the list) | Folder (the ID card wallet). Both screens get the same
     control under their header, and the Vault tab stays lit on either side. */
  function vaultToggle() {
    if (!TOGGLE) { if (AFTER) foldEmpty(); return; }   /* 2 Tabs: the same empty state on the Identities tab (20 Oct) */
    var nav = document.querySelector('.bottom-nav .nav-item[onclick*="idcard"]');
    if (nav && !nav.classList.contains('ut2-hide')) nav.classList.add('ut2-hide');
    var ic = q('#idcardScreen');
    if (ic && ic.classList.contains('open')) {
      var v = document.querySelector('.bottom-nav .nav-item[onclick*="\'vaults\'"]');
      if (v && !v.classList.contains('active')) v.classList.add('active');
    }
    /* Figma 9542:53109 — a floating Items | Folders toggle bottom-left, level
       with the + (same parent, same bottom: 96px), instead of a top segment */
    placeBtog(q('#vaultsScreen .vt-fab'), 'vaults');
    placeBtog(q('#icL1 .ic-fab'), 'folder');
    foldPlus();
    /* Figma 9564:67265 (Christine, 19 Oct): the Folders side is "My ID cards" */
    cardView();
    var FT = LISTV ? 'Vaults' : (CARDV && IVW.v === 'folders') ? 'Folders' : rename('My ID cards');   /* folder list (Figma 9603:70649): the header reads Vault(s) */
    var bt = q('#icL1 .blank-title');
    if (bt && bt.firstChild && bt.firstChild.nodeType === 3 && bt.firstChild.nodeValue !== FT) bt.firstChild.nodeValue = FT;
    if (AFTER && !LISTV) foldEmpty();
    var br = q('#iciTop .ici-brand');
    if (br && br.textContent !== 'Vaults') br.textContent = 'Vaults';
    /* Figma 9561:65816 (Christine, 19 Oct): "Vaults" in the header and tab bar */
    var vt = q('#vtL2Title');
    if (vt && vt.textContent !== 'Vaults') vt.textContent = 'Vaults';
    var vn = document.querySelector('.bottom-nav .nav-item[onclick*="\'vaults\'"] span');
    if (vn && vn.textContent !== 'Vaults') vn.textContent = 'Vaults';
    vaultTabs();
  }
  /* Christine, 21 Oct: on Folders too, the + opens "Add an item" (the Vault's
     sheet). Our own button styled as the Vault's .vt-fab, beside the toggle
     where the build's + sat (that one makes a folder and stays hidden). The
     sheet lives on the Vault screen, so it goes to Items first, then opens. */
  function foldPlus() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    var host = q('#icL1'), vf = q('#vaultsScreen .vt-fab');
    if (!host || !vf || host.querySelector(':scope > .ut2-fplus')) return;
    var b = el('<button type="button" class="vt-fab ut2-fplus ut2-noren" aria-label="Add an item">' + vf.innerHTML + '</button>');
    b.addEventListener('click', async function (e) {
      e.stopPropagation();
      goTabSafe('vaults'); await wait(450);
      openVaultAdd();
    });
    var anchor = host.querySelector(':scope > .ic-fab');
    if (anchor) host.insertBefore(b, anchor.nextSibling); else host.appendChild(b);
  }
  /* Christine, 21 Oct (Figma 9639:86478) — 2 Tabs: "Create a new [name]" runs
     its own flow. CIC-02 "Name the Alias ID" (field + purpose pills, drawn
     keyboard) → EIC-07 "Add to Alias ID" (Phone · Email · Payment cards, each
     "+ Add" / "Change") → a sheet per kind listing your ALIAS items and
     "Generate a … alias" (a new alias, saved to the Vault). Continue makes the
     card through the build's own create flow, hidden (ghostCard), and opens it. */
  var NID_CHIPS = ['Hide my info', 'Meet new people', 'Online shopping', 'Newsletter', 'Food Delivery', 'Marketplace chat', 'Free trial'];
  var NID_KINDS = [['phone', 'Phone', 'Add a phone number', 'a phone alias'],
                   ['email', 'Email', 'Add an email', 'an email alias'],
                   ['card', 'Payment cards', 'Add payment card', 'a card alias']];
  var NID_NEW = false;  /* (V2: step 2 made new aliases, RECOMMENDED · PAYMENT) */
  /* UserTest_V2_2Tabs (Christine, 21 Oct, Figma 9706:62637): the identity
     creation flow — "I wanna use the identity for" (story bar 1/3) → "Add items
     manually" (story bar 2/3): Phone · Email · Payment cards with Generate (a
     new alias, at once) and + Add (from the Vault), Show more for the rest
     (+ Add only) → Continue opens the identity. */
  var NID_V3 = true;
  var NID_MORE = [['bank', 'Bank Account'], ['note', 'Secure notes'], ['address', 'Address'], ['auth', 'Authentication Key'],
                  ['date', 'Date'], ['idnum', 'Identification number'], ['url2', 'Secondary URL']];
  var NID_BACK = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function nidStory(n, of) { var a = []; for (var i = 1; i <= (of || 3); i++) a.push(i); return '<div class="story">' + a.map(function (i) { return '<i' + (i <= n ? ' class="on"' : '') + '></i>'; }).join('') + '</div>'; }
  var NID_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>';
  function nidGen(k, name) {
    var d = function (n) { var o = ''; for (var i = 0; i < n; i++) o += Math.floor(Math.random() * 10); return o; };
    if (k === 'phone') return (2 + Math.floor(Math.random() * 7)) + d(2) + '-' + d(3) + '-' + d(4);
    if (k === 'email') {
      var w = String(name || 'alias').toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '').slice(0, 14) || 'alias';
      return w + d(3) + '@cloaked.com';
    }
    return '•••• ' + d(4);
  }
  /* Christine, 22 Oct (Figma 9827:121713): in R2 (V3's Identity) the create
     flow is V3's, but its step 2 is this flow's "Add items for the identity"
     page (Generate / + Add / Show more). opts.at2 = the name typed on V3's
     step 1; opts.onDone(values) hands the values back (UT2ICC in v3id*.js). */
  window.ut2IccStep2 = function (nm) {
    if (!V3ID || !window.UT2ICC) return;
    openIdFlow({ at2: nm,
      onDone: function (v) { window.UT2ICC.done(v); },
      onBack: function () { window.UT2ICC.back(); },
      onClose: function () { window.UT2ICC.close(); } });
  };
  function openIdFlow(opts) {
    opts = opts || {};
    var AT2 = !!opts.at2;
    if (V3ID && !AT2) return;                            /* the Identity tab is V3's */
    var host = document.querySelector('.phone-frame') || document.body;
    var R = document.documentElement, NM = cap(N.one);
    var p = el('<div class="ut2-nid ut2-noren' + (NID_V3 ? ' v3' : '') + '" role="dialog">' +
      '<section class="pg p1">' + (NID_V3 ? '<div class="tb3">' + nidStory(1) + '<button type="button" class="x3 x" aria-label="Close">' + NID_X + '</button></div>' : '<button type="button" class="x" aria-label="Close">' + NID_X + '</button>') +
      '<h2>' + (NID_V3 ? 'I wanna use the ' + esc(N.one) + ' for' : 'Name the ' + esc(NM)) + '</h2>' +
      '<div class="fld"><textarea rows="4" data-kbd autocomplete="off" spellcheck="false" placeholder="Chat with strangers, sign up for new trials..."></textarea></div>' +
      '<div class="pills" data-kbd-keep>' + NID_CHIPS.map(function (c) { return '<button type="button">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="go" disabled>Continue</button></section>' +
      '<section class="pg p2">' + (NID_V3
        ? '<div class="tb3"><button type="button" class="bk3" aria-label="Back">' + NID_BACK + '</button>' + nidStory(2, AT2 ? 4 : 3) + '<button type="button" class="x3 x" aria-label="Close">' + NID_X + '</button></div><h2>' + (AT2 ? 'Add items for<br>the ' + esc(N.one) : 'Add items manually') + '</h2>'
        : '<div class="bar"><button type="button" class="x" aria-label="Close">' + NID_X + '</button><div class="tt">Add to ' + esc(NM) + '</div></div>') +
      '<div class="rows"></div>' +
      '<button type="button" class="go" disabled>Continue</button></section>' +
      '<div class="dim"></div><div class="sh" role="dialog"><div class="hd"></div><div class="ls"></div>' +
      '<div class="ft"><button type="button" class="ok">Add</button></div></div></div>');
    host.appendChild(p);
    R.classList.add('ut2-nidon');
    var ta = p.querySelector('textarea'), go1 = p.querySelector('.p1 .go'), go2 = p.querySelector('.p2 .go');
    var picks = {}, name = '', sheetK = null;
    var kb = function (on) {
      try { if (on) { ta.focus({ preventScroll: true }); if (window.kbdShow) window.kbdShow(ta); } else { ta.blur(); if (window.kbdHide) window.kbdHide(); } } catch (e) {}
    };
    var close = function () {
      kb(false); p.classList.remove('on');
      setTimeout(function () { p.remove(); R.classList.remove('ut2-nidon'); }, 380);
    };
    if (AT2) p.classList.add('at2');
    requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add('on'); if (AT2) p.classList.add('two'); else setTimeout(function () { kb(true); }, 120); }); });
    [].forEach.call(p.querySelectorAll('.x'), function (b) { b.addEventListener('click', function () { close(); if (AT2 && opts.onClose) opts.onClose(); }); });
    var bk3 = p.querySelector('.bk3');
    if (bk3) bk3.addEventListener('click', function () {
      if (AT2) { p.classList.remove('two'); close(); if (opts.onBack) opts.onBack(); return; }   /* back to V3's step 1 */
      p.classList.remove('two'); setTimeout(function () { kb(true); }, 200);
    });
    var sync1 = function () { go1.disabled = !ta.value.trim(); };
    ta.addEventListener('input', sync1);
    ta.addEventListener('keyup', sync1);
    var tick = setInterval(function () { if (!p.isConnected) return clearInterval(tick); sync1(); }, 250);   /* the drawn keyboard writes .value */
    p.querySelector('.pills').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      ta.value = b.textContent; sync1();
    });
    /* Christine, 21 Oct: aliases are made here now (no "Create alias" in Add an
       item). After the name, step 2 picks which NEW aliases to make —
       RECOMMENDED (phone, email) · PAYMENT (card) — and Create makes them in
       the Vault and puts them on the new card. */
    var NSEL = { phone: true, email: true, card: false };
    var NEW_ROWS = [['Recommended', [['phone', 'Phone number', 'A new number that forwards to you', ADD_IC.phone], ['email', 'Email', 'A new address that forwards to you', ADD_IC.email]]],
                    ['Payment', [['card', 'Payment card', 'A virtual card for this ' + N.one, ADD_IC.card]]]];
    var paintNew = function () {
      p.querySelector('.rows').innerHTML = NEW_ROWS.map(function (g) {
        return '<div class="band">' + esc(g[0]) + '</div>' + g[1].map(function (r) {
          return '<button type="button" class="nrow' + (NSEL[r[0]] ? ' on' : '') + '" data-k="' + r[0] + '"><span class="ic">' + r[3] + '</span>' +
            '<span class="l"><b>' + esc(r[1]) + '</b><i>' + esc(r[2]) + '</i></span>' + NID_CB + '</button>';
        }).join('');
      }).join('');
      var n = Object.keys(NSEL).filter(function (k) { return NSEL[k]; }).length;
      go2.disabled = !n; go2.textContent = n ? 'Create ' + n + (n === 1 ? ' alias' : ' aliases') : 'Create';
    };
    var MORE = false;
    var pickTxt = function (k) { return (picks[k] || []).map(function (r) { return r.it.desc || r.it.title || ''; }).join(', '); };
    /* Christine, 21 Oct (Figma 9712:65151 / 65550): Generate once per kind —
       the row then shows the value with a reroll in place of the buttons; a
       generated email gets a Forward to row under it (off, green when on). */
    var GEN = {}, FWD3 = { email: false, phone: false };
    var ROLL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.5 4.2v4.6h-4.6"/></svg>';
    var paintV3 = function () {
      var row = function (k, label, gen) {
        var t = pickTxt(k);
        if (GEN[k]) {
          return '<div class="row r3 made" data-k="' + k + '"><span class="l"><b>' + esc(label) + '</b></span>' +
            '<span class="gv">' + esc(GEN[k].it.desc || '') + '</span><button type="button" class="rr3" aria-label="Try another">' + ROLL_SVG + '</button></div>' +
            (k === 'email' || k === 'phone' ? (function (real, on) { return '<div class="row fwd3" data-k="' + k + '"><span class="l"><i class="fk">Forward to</i><b>' + esc(real) + '</b></span><button type="button" class="tg3' + (on ? ' on' : '') + '" role="switch" aria-checked="' + (on ? 'true' : 'false') + '" aria-label="Forward to ' + esc(real) + '"><i></i></button></div>'; })(k === 'phone' ? REAL_PHONE : REAL_EMAIL, FWD3[k]) : '');
        }
        return '<div class="row r3" data-k="' + k + '"><span class="l"><b>' + esc(label) + '</b>' + (t ? '<i>' + esc(t) + '</i>' : '') + '</span>' +
          '<span class="bs">' + (gen ? '<button type="button" class="ch gen3">Generate</button>' : '') + '<button type="button" class="ch add3">+ Add</button></span></div>';
      };
      p.querySelector('.rows').innerHTML =
        NID_KINDS.map(function (k) { return row(k[0], k[1], true); }).join('') +
        (MORE ? NID_MORE.map(function (k) { return row(k[0], k[1], false); }).join('') : '') +
        '<button type="button" class="more3">' + (MORE ? 'Show less' : 'Show more') + '</button>';
      go2.disabled = !Object.keys(picks).some(function (k) { return (picks[k] || []).length; });
    };
    var paintRows = function () {
      if (NID_V3) return paintV3();
      if (NID_NEW) return paintNew();
      p.querySelector('.rows').innerHTML = NID_KINDS.map(function (k) {
        var pk = picks[k[0]] || [];
        return '<div class="row" data-k="' + k[0] + '"><span class="l"><b>' + esc(k[1]) + '</b>' +
          (pk.length ? '<i>' + esc(pk.map(function (r) { return r.it.desc || r.it.title || ''; }).join(', ')) + '</i>' : '') + '</span>' +
          '<button type="button" class="ch">' + (pk.length ? 'Change' : '+ Add') + '</button></div>';
      }).join('');
      go2.disabled = !NID_KINDS.some(function (k) { return (picks[k[0]] || []).length; });
    };
    go1.addEventListener('click', function () {
      if (go1.disabled) return;
      name = ta.value.trim(); kb(false);
      paintRows(); p.classList.add('two');
    });
    var dim = p.querySelector('.dim'), sh = p.querySelector('.sh');
    var closeSheet = function () { sh.classList.remove('on'); dim.classList.remove('on'); sheetK = null; };
    dim.addEventListener('click', closeSheet);
    /* Christine, 21 Oct: a checkbox on each row (like the pick list), several at once; Add keeps them */
    var NID_CB = '<span class="cb"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.2 5.2L20 7"/></svg></span>';
    var av = function (it) { try { return window.vtAvatarHTML(it.icon, it); } catch (e) { return '<span class="vt-av"></span>'; } };
    var paintSheet = function () {
      var K = NID_KINDS.filter(function (x) { return x[0] === sheetK; })[0];
      if (NID_V3) {                                /* + Add: everything of this kind in the Vault — aliases, then yours */
        var it2 = function (r, i) {
          return '<button type="button" class="it' + (sh._sel.indexOf(r.it) >= 0 ? ' on' : '') + '" data-i="' + i + '">' + NID_CB + '<span class="av">' + av(r.it) + '</span>' +
            '<span class="t"><b>' + esc(r.it.title || '') + '</b><i>' + esc(r.it.desc || '') + '</i></span></button>';
        };
        var al = [], own = [];
        sh._list.forEach(function (r, i) { (itemIsAlias(r.g, r.it) ? al : own).push(it2(r, i)); });
        sh.querySelector('.ls').innerHTML = (al.length ? '<div class="band">Alias</div>' + al.join('') : '') + (own.length ? '<div class="band">Your info</div>' + own.join('') : '');
        syncOk(); return;
      }
      sh.querySelector('.ls').innerHTML = '<div class="band">Alias</div>' +
        sh._list.map(function (r, i) {
          return '<button type="button" class="it' + (sh._sel.indexOf(r.it) >= 0 ? ' on' : '') + '" data-i="' + i + '">' + NID_CB + '<span class="av">' + av(r.it) + '</span>' +
            '<span class="t"><b>' + esc(r.it.title || '') + '</b><i>' + esc(r.it.desc || '') + '</i></span></button>';
        }).join('') +
        '<button type="button" class="gen"><span class="ic">' + ADD_IC.hide + '</span><span class="t"><b>Generate ' + K[3] + '</b></span></button>';
      syncOk();
    };
    var syncOk = function () {
      var n = sh._sel.length, ok = sh.querySelector('.ok');
      ok.textContent = n ? 'Add (' + n + ')' : 'Add';
      ok.disabled = !n && !(picks[sheetK] || []).length;
    };
    var openSheet = function (k) {
      sheetK = k;
      var K = NID_KINDS.filter(function (x) { return x[0] === k; })[0] || (function () { var m = NID_MORE.filter(function (x) { return x[0] === k; })[0]; return [k, m[1], 'Add ' + m[1].toLowerCase()]; })();
      sh.querySelector('.hd').textContent = K[2];
      sh._list = vaultFlat().filter(function (r) { return r.g === k && (NID_V3 || itemIsAlias(k, r.it)); });
      if (NID_V3 && !sh._list.length && !(picks[k] || []).length) {
        if (window.icToast) window.icToast('No ' + K[1].toLowerCase() + ' in your Vault yet');
        sheetK = null; return;
      }
      sh._sel = (picks[k] || []).map(function (r) { return r.it; });
      (picks[k] || []).forEach(function (r) { if (!sh._list.some(function (x) { return x.it === r.it; })) sh._list.push(r); });
      paintSheet();
      sh.querySelector('.ls').scrollTop = 0;
      dim.classList.add('on'); sh.classList.add('on');
    };
    sh.querySelector('.ok').addEventListener('click', function () {
      if (!sheetK || this.disabled) return;
      var k = sheetK;
      picks[k] = sh._list.filter(function (r) { return sh._sel.indexOf(r.it) >= 0; });
      if (!picks[k].length) delete picks[k];
      closeSheet(); paintRows();
    });
    sh.querySelector('.ls').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !sheetK) return;
      var k = sheetK;
      if (b.classList.contains('gen')) {
        var val = nidGen(k, name);
        var rec = { kind: k, alias: true, title: name, name: name, value: val,
                    section: ALIAS_SEC[k], vlab: ALIAS_LAB[k], empty: ALIAS_EMPTY[k], cta: ALIAS_CTA[k], tone: null, glyph: '' };
        if (window.AV && window.AV.decide) { try { rec.dec = window.AV.decide({ title: name, kind: k, value: val, alias: true }); } catch (e2) {} }
        var it = null; try { it = window.vtAddMade(rec); } catch (e3) {}
        var nr = { g: k, it: it || { title: name, desc: val } };
        sh._list.push(nr); sh._sel.push(nr.it);
        if (window.icToast) window.icToast('New ' + (k === 'card' ? 'card' : k) + ' alias saved to your Vault');
      } else if (b.classList.contains('it')) {
        var x = sh._list[+b.dataset.i].it, at = sh._sel.indexOf(x);
        if (at >= 0) sh._sel.splice(at, 1); else sh._sel.push(x);
        b.classList.toggle('on', at < 0); syncOk(); return;   /* in place: the list keeps its scroll */
      } else return;
      paintSheet();
    });
    p.querySelector('.rows').addEventListener('click', function (e) {
      var nr = e.target.closest('.nrow');
      if (nr) { NSEL[nr.dataset.k] = !NSEL[nr.dataset.k]; paintNew(); return; }
      if (e.target.closest('.more3')) { MORE = !MORE; paintV3(); return; }
      var tg3 = e.target.closest('.tg3');
      if (tg3) { var kf = tg3.closest('.row').dataset.k; FWD3[kf] = !FWD3[kf]; if (GEN[kf] && GEN[kf].it) GEN[kf].it.ut2fwd = FWD3[kf]; paintV3(); return; }
      var rr3 = e.target.closest('.rr3');
      if (rr3) {                                   /* try another: the same alias item, a new value */
        var kr = rr3.closest('.row').dataset.k, vr = nidGen(kr, name), gr = GEN[kr];
        if (gr && gr.it) { gr.it.desc = vr; if (gr.it.fields) gr.it.fields[0][1] = vr; if (typeof window.vtRefresh === 'function') { try { window.vtRefresh(); } catch (e6) {} } }
        paintV3(); return;
      }
      var g3 = e.target.closest('.gen3');
      if (g3) {                                    /* a new alias of this kind, at once — one per kind */
        var k3 = g3.closest('.row').dataset.k, v3 = nidGen(k3, name);
        if (GEN[k3]) { paintV3(); return; }
        var rec3 = { kind: k3, alias: true, title: name, name: name, value: v3,
                     section: ALIAS_SEC[k3], vlab: ALIAS_LAB[k3], empty: ALIAS_EMPTY[k3], cta: ALIAS_CTA[k3], tone: null, glyph: '' };
        if (window.AV && window.AV.decide) { try { rec3.dec = window.AV.decide({ title: name, kind: k3, value: v3, alias: true }); } catch (e4) {} }
      if (rec3.dec && rec3.dec.glyph && rec3.dec.glyph.type !== 'logo' && window.AV.markSVG) { try { rec3.glyph = window.AV.markSVG(rec3.dec.glyph.key); } catch (eg) {} }
        var it3 = null; try { it3 = window.vtAddMade(rec3); } catch (e5) {}
        var nr3 = { g: k3, it: it3 || { title: name, desc: v3 } };
        (picks[k3] = picks[k3] || []).push(nr3);
        GEN[k3] = nr3;
        if (window.icToast) window.icToast('New ' + (k3 === 'card' ? 'card' : k3) + ' alias saved to your Vault');
        paintV3(); return;
      }
      var a3 = e.target.closest('.add3');
      if (a3) { openSheet(a3.closest('.row').dataset.k); return; }
      var b = e.target.closest('.ch'); if (b) openSheet(b.closest('.row').dataset.k);
    });
    if (AT2) { name = String(opts.at2 || '').trim() || cap(N.one); paintRows(); }
    go2.addEventListener('click', function () {
      if (go2.disabled) return;
      if (AT2) {                                   /* hand the values to V3's flow, which makes the card */
        var vals = {};
        NID_KINDS.concat(NID_MORE).forEach(function (k) {
          var r = GEN[k[0]] || (picks[k[0]] || [])[0];
          if (r && r.it) vals[k[0]] = r.it.desc || r.it.value || r.it.title || '';
        });
        if (vals.card && !/^\./.test(vals.card)) vals.card = '.' + String(vals.card).replace(/\D/g, '').slice(-4);   /* V3 writes a card as .1234 */
        p.classList.add('fwd'); close();
        if (opts.onDone) opts.onDone(vals);
        return;
      }
      go2.disabled = true; go2.textContent = 'Creating…';
      var list = [];
      if (NID_NEW) {
        ['phone', 'email', 'card'].forEach(function (k) {
          if (!NSEL[k]) return;
          var val = nidGen(k, name);
          var rec = { kind: k, alias: true, title: name, name: name, value: val,
                      section: ALIAS_SEC[k], vlab: ALIAS_LAB[k], empty: ALIAS_EMPTY[k], cta: ALIAS_CTA[k], tone: null, glyph: '' };
          if (window.AV && window.AV.decide) { try { rec.dec = window.AV.decide({ title: name, kind: k, value: val, alias: true }); } catch (e2) {} }
          var it = null; try { it = window.vtAddMade(rec); } catch (e3) {}
          list.push({ g: k, it: it || { title: name, desc: val } });
        });
      } else NID_KINDS.concat(NID_MORE).forEach(function (k) { (picks[k[0]] || []).forEach(function (r) { list.push(r); }); });
      /* the build's card keeps phone / email / card; the rest show on the identity page (idDetailFlat) */
      ID_EXTRA[name] = list.filter(function (r) { return !/^(phone|email|card)$/.test(r.g); });
      /* 22 Oct: lands on the identity's page with the build's push — the page in from the right, the flow off to the left */
      var push = function () {
        var l2 = q('#icL2.open');
        if (l2) { try { l2.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' }); } catch (e5) {} }
        p.classList.add('fwd'); close();
        var kinds = list.map(function (r) { return r.g; }), fwdOn = { email: FWD3.email, phone: FWD3.phone };
        setTimeout(function () { if (q('#icL2.open')) howTrayId(name, kinds, fwdOn); }, 2700);   /* after the cone's pattern has come in */
      };
      ghostCard(name, list).then(push, push);
    });
  }
  /* Figma 9564:67265 (Christine, 19 Oct) — Folders with no ID card yet: a
     bordered card "Start grouping your vault items" + "+ Create a new folder"
     (opens the build's create flow, icOpenCreate), a "?" at the top right
     (the build's explainer, ichOpen), no + fab. Once a card exists the
     wallet is the one the build already draws (#idcardScreen loses .empty). */
  var Q_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.6" stroke="currentColor" stroke-width="1.3"/><path d="M9.7 9.6a2.35 2.35 0 0 1 4.6.6c0 1.6-2.3 2-2.3 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="16.4" r=".85" fill="currentColor"/></svg>';
  /* Christine, 21 Oct (round 7): the Day 01 Identities intro is back (the
     dark two-page ID-card story). Its "Skip intro" and "Create ID card" call
     the build's own create flow (#icCreate); here they open ours (openIdFlow,
     Figma 9639:86478) — same as the "Create a new identity" row. "Restart" on
     page 2 stays the build's. */
  /* Christine, 21 Oct: Identities has a + like the Vault's (the build's own
     .ic-fab, shown again in 2 Tabs); it opens "Create a new identity" (openIdFlow)
     instead of the build's create pane. */
  /* Christine, 22 Oct: Home's "Create alias identity" card opens the Identities intro (the slides), not the old alias onboarding */
  document.addEventListener('click', function (e) {
    if (!AFTER || !DAY1) return;
    var c = e.target.closest && e.target.closest('#d1jCardGuard'); if (!c) return;
    e.stopImmediatePropagation(); e.preventDefault();
    goTabSafe('idcard');
  }, true);
  document.addEventListener('click', function (e) {
    if (TOGGLE) return;
    if (V3ID) return;
    var f = e.target.closest && e.target.closest('#icL1 .ic-fab'); if (!f) return;
    e.stopPropagation(); e.preventDefault();
    openIdFlow();
  }, true);
  document.addEventListener('click', function (e) {
    if (V3ID) return;
    var root = e.target.closest && e.target.closest('#icIntro'); if (!root) return;
    var sk = e.target.closest('.ici-skip'), go = e.target.closest('.ici-btn:not(.ghost)');
    if (!sk && !go) return;
    if (sk && /restart/i.test(sk.textContent)) return;
    e.stopPropagation(); e.preventDefault();
    if (closeIdIntro() && sk) return;                     /* reopened from the ?: Skip just puts the cover away */
    if (TOGGLE && !CARDV) openNameSheet(); else openIdFlow();
  }, true);
  /* Christine, 22 Oct: the ? on Identities brings the intro cover back over
     the wallet (html.ut2-icintro forces #icIntro on); Skip intro closes it,
     Create an identity closes it and opens the flow. */
  function reopenIdIntro() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    var intro = q('#icIntro'); if (!intro) return;
    document.documentElement.classList.add('ut2-icintro');
    intro.setAttribute('aria-hidden', 'false');
    if (typeof window.introReset === 'function') { try { window.introReset(); } catch (e) {} }
    setTimeout(idIntroArt, 60);
  }
  function closeIdIntro() {
    var R = document.documentElement; if (!R.classList.contains('ut2-icintro')) return false;
    R.classList.remove('ut2-icintro');
    var intro = q('#icIntro'); if (intro && !q('#idcardScreen.empty')) intro.setAttribute('aria-hidden', 'true');
    return true;
  }
  document.addEventListener('click', function (e) {
    if (!AFTER || !e.target.closest) return;
    if (V3ID) return;
    var qb = e.target.closest('#icL1 .blank-head .ich-btn');
    if (qb) { e.stopImmediatePropagation(); e.preventDefault(); reopenIdIntro(); }
  }, true);
  function foldEmpty() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    var head = q('#icL1 .blank-head'), scr = q('#icL1Scroll');
    if (head && !head.querySelector(':scope > .ut2-fq')) {
      var b = el('<button type="button" class="ut2-fq ut2-noren" aria-label="What is an identity?">' + Q_SVG + '</button>');
      b.addEventListener('click', function () { reopenIdIntro(); });
      head.appendChild(b);
    }
    if (scr && !scr.querySelector(':scope > .ut2-fe')) {
      var c = el('<div class="ut2-fe ut2-noren"><div class="t">Start grouping your vault items</div>' +
        '<button type="button" class="b">+ Create a new ' + N.one + '</button></div>');
      c.querySelector('.b').addEventListener('click', function () { if (TOGGLE && !CARDV) openNameSheet(); else openIdFlow(); });   /* 2 Tabs and 1 Tab · ID cards: Figma 9639:86478 + new aliases (21 Oct) */
      var faq = scr.querySelector(':scope > .vt-faq');
      scr.insertBefore(c, faq || null);
    }
    /* Figma 9566:68966 (Christine, 19 Oct): once there is a card, a full-width
       "+ Create a new folder" sits 12 under the stack (and stands in for the +) */
    var cards = q('#icCards');
    if (cards && !(cards.nextElementSibling && cards.nextElementSibling.classList.contains('ut2-fadd'))) {
      var a = el('<button type="button" class="ut2-fadd ut2-noren">' + ADD_SVG + '<span>Create a new ' + N.one + '</span></button>');
      a.addEventListener('click', function () { if (CARDV) openIdFlow(); else openNameSheet(); });
      cards.parentNode.insertBefore(a, cards.nextSibling);
    }
    /* Christine, 21 Oct (Figma 9636:86141): 2 Tabs — no "Group aliases by
       situation" pill; under the cards a row like Add an item's (353x77 r16,
       + at 22, label at 70): "Create a new [name]", Christine, 21 Oct: it opens the Figma 9639:86478 flow (openIdFlow) */
    /* Christine, 22 Oct: removed — the black + at the bottom right already creates one (kept here, off) */
    if (false && !TOGGLE && cards && !q('#icL1 .ut2-frow')) {
      var r = el('<button type="button" class="ut2-add-row ut2-frow ut2-noren"><span class="ic">' + ADD_IC.other + '</span><span class="l">Create a new ' + N.one + '</span></button>');
      r.addEventListener('click', function () { openIdFlow(); });   /* Figma 9639:86478 */
      var fa = cards.nextElementSibling && cards.nextElementSibling.classList.contains('ut2-fadd') ? cards.nextElementSibling : cards;
      fa.parentNode.insertBefore(r, fa.nextSibling);
    }
  }
  /* Christine, 20 Oct: "+ Create a new folder / identity" works like 02_Main
     R3's folder flow (FD-02 → EV-02 → FD-05): name it in a sheet, pick the
     Vault items that go in (Select all / Save), land on it. The wallet card is
     still the build's: its create flow (#icCreate) runs hidden with the name
     (html.ut2-ghostcc), then Day 01 puts the picked items on the new card
     (window.v3CardById + icResetCards) and opens it. Day 30 exposes no card to
     edit, so its hidden run picks one item per kind through the flow's own pick
     sheets. */
  var GHOST_KIND = { phone: ['Phone', 'phone'], email: ['Email', 'email'], card: ['Payment', 'card'], login: ['Login', 'login'],
                     address: ['Address', 'address'], bank: ['Bank', 'bank'], contact: ['Contact', 'contact'] };
  function nsClose(p) { p.classList.remove('on'); setTimeout(function () { p.remove(); }, 380); }
  function openNameSheet(o) {
    o = o || {};
    var word = o.word || N.one;
    var host = document.querySelector('.phone-frame') || document.body;
    var p = el('<div class="ut2-ns ut2-noren"><div class="dim"></div><div class="sh" role="dialog">' +
      '<div class="hd">Create a new ' + word + '</div>' +
      '<div class="fld"><input type="text" placeholder="' + cap(word) + ' name" autocomplete="off" spellcheck="false"></div>' +
      '<div class="cta"><button type="button" class="c">Cancel</button><button type="button" class="k" disabled>Create</button></div></div></div>');
    host.appendChild(p);
    var inp = p.querySelector('input'), k = p.querySelector('.k');
    requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add('on'); try { inp.focus({ preventScroll: true }); } catch (e) {} }); });
    inp.addEventListener('input', function () { k.disabled = !inp.value.trim(); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !k.disabled) k.click(); });
    p.querySelector('.dim').addEventListener('click', function () { nsClose(p); });
    p.querySelector('.c').addEventListener('click', function () { nsClose(p); });
    k.addEventListener('click', function () {
      if (k.disabled) return;
      var name = inp.value.trim(); nsClose(p);
      setTimeout(function () { if (o.onCreate) o.onCreate(name); else openBulkPick(name); }, 200);
    });
  }
  function vaultFlat() {
    var vs = []; try { vs = window.vtVaults() || []; } catch (e) {}
    var v = vs[0], out = []; if (!v) return out;
    v.groups.forEach(function (g) { g.items.forEach(function (it) { if (!it._group) it._group = g.key; out.push({ g: g.key, it: it }); }); });
    return out;
  }
  function openBulkPick(name, o) {
    o = o || {};
    var host = document.querySelector('.phone-frame') || document.body;
    var all = vaultFlat(), sel = {};
    if (o.cards) all = idCards().map(function (c) { return { g: 'idc', card: c, it: { title: c.title, desc: cap(N.one) } }; }).concat(all);
    var av = function (it) { try { return window.vtAvatarHTML(it.icon, it); } catch (e) { return '<span class="vt-av"></span>'; } };
    /* Christine, 20 Oct: search + tabs on top, like the Vault, so the item you want is findable */
    var TAB_LAB = { idc: cap(N.many), login: 'Password', phone: 'Phone', email: 'Email', card: 'Payment', bank: 'Bank', address: 'Address', contact: 'Contact', other: 'Others' };
    var TAB_ORD = ['idc', 'login', 'phone', 'email', 'card', 'bank', 'address', 'contact', 'other'];
    var has = {}, anyAlias = false;
    all.forEach(function (r) { has[r.g] = 1; if (!r.card && itemIsAlias(r.g, r.it)) anyAlias = true; });
    var tabs = [['all', 'All']].concat(anyAlias ? [['alias', 'Alias']] : [])
      .concat(TAB_ORD.filter(function (k) { return has[k]; }).map(function (k) { return [k, TAB_LAB[k]]; }));
    var SEARCH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>';
    var p = el('<div class="ut2-bp ut2-noren" role="dialog"><div class="tb"><button type="button" class="pl all">Select all</button>' +
      '<div class="ttl"></div><button type="button" class="pl save" disabled>Save</button></div>' +
      '<div class="sr"><label class="sb">' + SEARCH_SVG + '<input type="search" placeholder="Search your Vault" autocomplete="off" spellcheck="false"></label></div>' +
      '<div class="tbs">' + tabs.map(function (t, i) { return '<button type="button" class="tab' + (i ? '' : ' on') + '" data-k="' + t[0] + '">' + esc(t[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="ls">' +
      all.map(function (r, i) {
        return '<div class="row" data-i="' + i + '"><span class="cb"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.2 5.2L20 7"/></svg></span>' +
          (r.card ? idAv(r.card) : av(r.it)) + '<span class="tx"><b>' + esc(r.it.title || '') + '</b><i>' + esc(r.it.desc || '') + '</i></span></div>';
      }).join('') + '</div></div>');
    p.querySelector('.ttl').textContent = name;
    host.appendChild(p);
    requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add('on'); }); });
    var save = p.querySelector('.save'), allB = p.querySelector('.all'), inp = p.querySelector('.sr input');
    var tab = 'all';
    var shown = function () {
      var qy = inp.value.trim().toLowerCase();
      return all.map(function (r, i) { return i; }).filter(function (i) {
        var r = all[i];
        if (tab === 'alias' && (r.card || !itemIsAlias(r.g, r.it))) return false;
        if (tab !== 'all' && tab !== 'alias' && r.g !== tab) return false;
        return !qy || ((r.it.title || '') + ' ' + (r.it.desc || '')).toLowerCase().indexOf(qy) !== -1;
      });
    };
    var paint = function () {
      var n = Object.keys(sel).length, vis = shown(), vmap = {};
      vis.forEach(function (i) { vmap[i] = 1; });
      [].forEach.call(p.querySelectorAll('.row'), function (r) { r.classList.toggle('on', !!sel[r.dataset.i]); r.hidden = !vmap[r.dataset.i]; });
      [].forEach.call(p.querySelectorAll('.tab'), function (b) { b.classList.toggle('on', b.dataset.k === tab); });
      save.disabled = !n;
      save.textContent = n ? 'Save (' + n + ')' : 'Save';
      allB.textContent = vis.length && vis.every(function (i) { return sel[i]; }) ? 'Deselect all' : 'Select all';
      var em = p.querySelector('.ls .none');
      if (!vis.length && !em) p.querySelector('.ls').appendChild(el('<p class="none">Nothing matches</p>'));
      else if (vis.length && em) em.remove();
    };
    p.querySelector('.tbs').addEventListener('click', function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      tab = b.dataset.k; paint(); p.querySelector('.ls').scrollTop = 0;
    });
    inp.addEventListener('input', paint);
    p.querySelector('.ls').addEventListener('click', function (e) {
      var r = e.target.closest('.row'); if (!r) return;
      if (sel[r.dataset.i]) delete sel[r.dataset.i]; else sel[r.dataset.i] = 1;
      paint();
    });
    allB.addEventListener('click', function () {   /* what you can see: the tab and the search */
      var vis = shown();
      if (vis.length && vis.every(function (i) { return sel[i]; })) vis.forEach(function (i) { delete sel[i]; });
      else vis.forEach(function (i) { sel[i] = 1; });
      paint();
    });
    save.addEventListener('click', function () {
      if (save.disabled) return;
      var picks = Object.keys(sel).map(function (i) { return all[+i]; });
      if (o.onSave) {
        p.classList.remove('on'); setTimeout(function () { p.remove(); }, 380);
        o.onSave(name, picks.filter(function (r) { return !r.card; }), picks.filter(function (r) { return r.card; }).map(function (r) { return r.card.id; }));
        return;
      }
      save.disabled = true; save.textContent = 'Saving…';
      ghostCard(name, picks).then(function () { p.classList.remove('on'); setTimeout(function () { p.remove(); }, 380); });
    });
  }
  function walletIds() {
    var ids = {};
    if (typeof window.icCardList === 'function') { try { window.icCardList().forEach(function (c) { ids[c.id] = 1; }); return ids; } catch (e) {} }
    [].forEach.call(document.querySelectorAll('#icCards [data-card]'), function (c) { ids[c.dataset.card] = 1; });
    return ids;
  }
  async function until2(fn, ms) { for (var t = 0; t < ms; t += 60) { if (fn()) return true; await wait(60); } return false; }
  /* Christine, 21 Oct (Figma 9809:112806, "Pattern on the cone shape fades
     in"): a new identity's card lands with its cone as a plain grey shape
     (#C7C7C7, the Figma's CIC-08), and the engraved pattern fades in over it.
     The shape is the art's own silhouette, drawn on a canvas laid over it. */
  function coneFade() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    var t0 = Date.now();
    (function look() {
      var arts = document.querySelectorAll('#icDetailCard .ic-card-art, #icL2 .ic-card-art'), art = null;
      for (var i = 0; i < arts.length; i++) if (visible(arts[i]) && arts[i].getBoundingClientRect().width > 40) { art = arts[i]; break; }
      var url = art && bgURL(art);
      if (!art || !url) { if (Date.now() - t0 < 2500) setTimeout(look, 60); return; }
      if (art.querySelector('.ut2-cone')) return;
      var W = art.clientWidth, H = art.clientHeight, dpr = 2;
      var cv = document.createElement('canvas');
      cv.className = 'ut2-cone ut2-noren'; cv.width = W * dpr; cv.height = H * dpr;
      if (getComputedStyle(art).position === 'static') art.style.position = 'relative';
      art.appendChild(cv);
      var im = new Image();
      im.onload = function () {
        var g = cv.getContext('2d'), s = Math.min(W / im.width, H / im.height), w = im.width * s, h = im.height * s;
        g.scale(dpr, dpr);
        g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
        g.globalCompositeOperation = 'source-in';
        g.fillStyle = '#C7C7C7'; g.fillRect(0, 0, W, H);
        setTimeout(function () {
          cv.classList.add('off');
          setTimeout(function () { cv.remove(); }, 1200);
        }, 1400);
      };
      im.onerror = function () { cv.remove(); };
      im.src = url;
    })();
  }
  async function ghostCard(name, picks) {
    if (typeof window.icOpenCreate !== 'function') return;
    var R = document.documentElement, before = walletIds();
    R.classList.add('ut2-ghostcc');
    try {
      window.icOpenCreate();
      await wait(120);
      var w = q('#iccWhat'); if (!w) return;
      w.value = name; w.dispatchEvent(new Event('input', { bubbles: true }));
      q('#iccNext').click();
      await until2(function () { var it = q('#iccItems'); return it && !it.hidden; }, 3000);   /* v20 swaps to the pick page */
      if (!DAY1) {
        /* one per kind, through the flow's own pick sheets: the card is built from them */
        var done = {};
        for (var i = 0; i < picks.length; i++) {
          var g = picks[i].g; if (done[g]) continue;
          var add = q('#iccItems [data-pick="' + g + '"]'); if (!add) continue;
          add.click(); await wait(350);
          /* the whole number, not its last four: 610-672-4823's "4823" also sits inside 319-448-2345 */
          var want = String(picks[i].it.desc || '').replace(/\D/g, ''), opt = null;
          var opts = document.querySelectorAll('#iccPick [data-vault]');
          for (var j = 0; j < opts.length; j++) { if (want && opts[j].textContent.replace(/\D/g, '').indexOf(want) >= 0) { opt = opts[j]; break; } }
          if (!opt) for (j = 0; j < opts.length; j++) if (opts[j].textContent.indexOf(picks[i].it.desc || '§') >= 0) { opt = opts[j]; break; }
          if (opt) { opt.click(); done[g] = 1; } else { var pd = q('#iccPickDim'); if (pd) pd.click(); }
          await wait(250);
        }
      }
      q('#iccNext').click();
      await until2(function () { var c = q('#iccCard'); return c && c.classList.contains('ready'); }, 4000);
      await wait(80);
      q('#iccNext').click();                         /* Done: the build adds the card and closes */
      await until2(function () { var p = q('#icCreate'); return p && !p.classList.contains('open'); }, 3000);
    } finally {
      setTimeout(function () { R.classList.remove('ut2-ghostcc'); }, 450);
    }
    var after = walletIds(), id = null;
    for (var k in after) if (!before[k]) id = k;
    if (!id) return;
    if (DAY1 && typeof window.v3CardById === 'function') {
      var card = window.v3CardById(id);
      if (card) {
        card.items = picks.map(function (r) {
          var m = GHOST_KIND[r.g] || [cap(r.g), r.g];
          var v = r.it.desc || r.it.title || '';
          if (r.g === 'card') v = '.' + String(v).replace(/\D/g, '').slice(-4);
          return { k: m[0], v: v, t: m[1] };
        });
        if (typeof window.icResetCards === 'function') window.icResetCards();
      }
    }
    await wait(300);
    if (typeof window.icOpenCard === 'function') window.icOpenCard(id);   /* land on it, like R3's FD-05 */
    coneFade();
  }

  /* Figma 9561:65816 tab strip: All · ID cards · Login · Phone · Email ·
     Payment · Bank. The build draws the strip (only kinds you have) and
     redraws it on every tap, so: its "Password" reads "Login", and an
     "ID cards" tab after All opens Folders (it is not a vault kind — a
     ut2 button, not .vt-tab, so the build's handler never sees it). */
  function vaultTabs() {
    var host = q('#vtL2Tabs'); if (!host) return;
    /* Christine, 21 Oct: back to the build's "Password" (was renamed "Login") */
    var pw = host.querySelector('.vt-tab[data-tab="login"]');
    if (pw && pw.textContent === 'Login') pw.textContent = 'Password';
    var hs = document.querySelectorAll('#vtL2Body .vt-sec-title');
    for (var i = 0; i < hs.length; i++) if (hs[i].textContent === 'Login') hs[i].textContent = 'Password';
    /* Christine, 20 Oct: no Identities / Folders tab in the strip — the
       floating Items | Folders toggle already goes there */
  }
  /* icons exported from Figma 9543:53737 / 9543:53736 (originals in ut2/icons/);
     fill -> currentColor so the on/off colours (#F3F1ED / white 60 percent) follow state */
  var BTOG_ICON = {
    /* Christine, 21 Oct (Figma 9659:87447): icon-only toggle — Items (two stacked cards) | Folders (folder) */
    vaults: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1.66602 8.33464C1.66602 7.41416 2.41221 6.66797 3.33268 6.66797H13.3327C14.2532 6.66797 14.9993 7.41416 14.9993 8.33464V14.168C14.9993 15.0884 14.2532 15.8346 13.3327 15.8346H3.33268C2.41221 15.8346 1.66602 15.0884 1.66602 14.168V8.33464Z" stroke="currentColor" stroke-width="1.25"/><path d="M16.6673 11.6667H17.5007C18.4211 11.6667 19.1673 10.9205 19.1673 10V4.16667C19.1673 3.24619 18.4211 2.5 17.5007 2.5H7.50065C6.58018 2.5 5.83398 3.24619 5.83398 4.16667V5" stroke="currentColor" stroke-width="1.25"/></svg>',
    folder: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1.25 5.52148C1.25 4.60101 1.99619 3.85482 2.91667 3.85482H9.74519C9.91127 3.85482 10.0736 3.8052 10.2112 3.71232L12.4138 2.22648C12.5514 2.13361 12.7137 2.08398 12.8798 2.08398H17.0833C18.0038 2.08398 18.75 2.83018 18.75 3.75065V14.584C18.75 15.5045 18.0038 16.2507 17.0833 16.2507H2.91667C1.99619 16.2507 1.25 15.5045 1.25 14.584V5.52148Z" stroke="currentColor" stroke-width="1.25"/></svg>'
  };
  function placeBtog(anchor, on, host) {
    if (!anchor) return;
    var parent = host || anchor.parentNode;
    if (parent.querySelector(':scope > .ut2-btog')) return;
    var g = el('<div class="ut2-btog ut2-noren" role="tablist" aria-label="Vault view">' +
      '<button type="button" role="tab" aria-label="Items" data-v="vaults"' + (on === 'vaults' ? ' class="on" aria-selected="true"' : '') + '><span class="ic">' + BTOG_ICON.vaults + '</span><span class="l">Items</span></button>' +
      '<button type="button" role="tab" aria-label="Folders" data-v="folder"' + (on === 'folder' ? ' class="on" aria-selected="true"' : '') + '><span class="ic sm">' + BTOG_ICON.folder + '</span><span class="l">Folders</span></button></div>');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.classList.contains('on')) return;
      if (b.dataset.v === 'folder') IVW.next = 'folders';   /* 1 Tab · ID cards: Folders is the folder list (21 Oct) */
      if (typeof window.goTab === 'function') window.goTab(b.dataset.v === 'folder' ? 'idcard' : 'vaults');
    });
    if (host) host.appendChild(g); else parent.insertBefore(g, anchor.nextSibling);
  }
  function placeSeg(after, on, dark) {
    if (!after || after.parentNode.querySelector(':scope > .ut2-vseg')) return;
    var g = el('<div class="ut2-vseg ut2-noren' + (dark ? ' dark' : '') + '" role="tablist">' +
      '<button type="button" role="tab" aria-label="Items" data-v="vaults"' + (on === 'vaults' ? ' class="on" aria-selected="true"' : '') + '>Vaults</button>' +
      '<button type="button" role="tab" data-v="folder"' + (on === 'folder' ? ' class="on" aria-selected="true"' : '') + '>Folder</button></div>');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.classList.contains('on')) return;
      if (typeof window.goTab === 'function') window.goTab(b.dataset.v === 'folder' ? 'idcard' : 'vaults');
    });
    after.parentNode.insertBefore(g, after.nextSibling);
  }

  /* v22 — Vault intro (after the Proton Pass tutorial, 19 Oct).
     Christine, 19 Oct (Figma 9552:62775): one dark page that scrolls, not
     pages — hero art, then a card per alias kind and one for folders. Shown
     first in Day 01's Vault (Vault toggle only); X, Skip Intro or the button
     at the end close it onto the Vault list. Copy says "alias" literally, so
     it is ut2-noren. */
  var ONB = { go: null, el: null };
  var ART = 'assets/ID card/';
  var X_SVG = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  /* alias visual, Figma 9553:63458 (Christine, 19 Oct; email as the example,
     same for phone and card). Four beats in the 329x264 box: (1) white pill
     with your real info → (2) it turns into the dark alias pill → (3) it
     rises and a dotted fork opens under it → (4) it settles at the top and
     the two ways it can go appear as dark cards. Icons: Figma's @
     (ut2/icons/onb-at.svg) and arrow_Out (onb-arrow-out.svg); the rest are
     the app's own Icons-Items. */
  var ONB_IC = '../ut2/icons/';
  var FORK_SVG = '<svg class="fk" width="157" height="32" viewBox="0 0 157 32" fill="none" aria-hidden="true">' +
    '<path d="M78.5 0V8A8 8 0 0 1 70.5 16H8A8 8 0 0 0 0 24V32M78.5 8A8 8 0 0 0 86.5 16H149A8 8 0 0 1 157 24V32" stroke="#F3F1ED" stroke-width="0.5" stroke-dasharray="2 2"/></svg>';
  /* p = [tone, icon src, light-source?, real, alias]; o = [icon src, white-source?, title, sub] */
  function onbFx(p, l, r) {
    function card(o) {
      return '<div class="o"><img class="ic' + (o[1] ? ' w' : '') + '" src="' + o[0] + '" alt=""><div class="t"><b>' + o[2] + '</b><span>' + o[3] + '</span></div></div>';
    }
    return '<div class="ut2-onb-fx"><div class="ap" style="--tone:' + p[0] + '"><span class="av"><img class="' + (p[2] ? 'lt' : 'dk') + (p[0] === '#83244F' ? ' inv' : '') + '" src="' + p[1] + '" alt=""></span>' +
      '<span class="v"><span class="rl">' + p[3] + '</span><span class="al">' + p[4] + '</span></span></div>' +
      FORK_SVG + '<div class="opts">' + card(l) + card(r) + '</div></div>';
  }
  /* email alias, Figma 9553:63458 (Christine, 19 Oct: updated, "a bit off"):
     (1) green #263427 box, white pill with your real email (sage avatar);
     (2) the box darkens from the top (→ #141410 at 55%), your email rises to
     44, a line drops through the Hide-my-info eye to the dark alias pill at
     172; (3) the box is fully dark, your email, line and eye are gone and the
     alias sits alone in the middle (108); (4) it rises to 39 and a dotted fork
     opens under it; (5) it settles at 16 (297 wide, 14 regular) and the two
     places its mail can go appear: Forwards to me (Margaret@gmail.com /
     523-256-2345) · Goes to Cloaked inbox (Read them right in the app).
     Icons: Figma's @ (onb-at.svg), arrow_Out (onb-arrow-out.svg) and the
     app's email glyph (same path as Figma's Icons-email). */
  /* updated again 19 Oct (frames 4–5): the alias stops at 50, a taller fork
     (157×68, 0.5 dashed, little arrowheads) runs from its foot to two small
     dark pills at 166 — 140/141×48 r16, a #141410 avatar with a 16 icon,
     10/1.3 text. */
  var FORK2_SVG = '<svg class="fk" width="157" height="68" viewBox="0 0 157 68" fill="none" aria-hidden="true">' +
    '<path d="M78.5 0V26A8 8 0 0 1 70.5 34H8A8 8 0 0 0 0 42V65.5M78.5 26A8 8 0 0 0 86.5 34H149A8 8 0 0 1 157 42V65.5" stroke="#F3F1ED" stroke-width="0.5" stroke-dasharray="2 2"/>' +
    '<path d="M-1.44 65.5H1.44L0 68ZM155.56 65.5H158.44L157 68Z" fill="#F3F1ED"/></svg>';
  /* ★ third pass, 19 Oct (Figma 9553:63458 again): the email card now runs on
     the contact card's grammar — 268-wide pills; the close-up keeps your
     email at 20 (50%), eye 76, line 68–108, alias 108; then dark, alias 64,
     a dotted arrow and brand chips 171×48 (logo 24 at 12, 16 medium at 48,
     12 apart, first at -5): Google Sign in · Verizon Sign in … rotating on. */
  var LOGO = 'assets/logo/';
  /* Christine, 19 Oct: every alias card ends on literal, everyday uses (logo
     + what you did) — the email signs in, the number goes on a profile or an
     order, the card pays — so none of them reads like a situation, which is
     the folders card's job. */
  function brandRow(list) {
    return '<div class="chips"><div class="trk b">' + list.map(function (c) {
      return '<span class="chip b"><img src="' + LOGO + c[0] + '" alt="">' + c[1] + '</span>';
    }).join('') + '</div></div>';
  }
  function onbMail() {
    var at = '<img src="' + ONB_IC + 'onb-at.svg" alt="">';
    return '<div class="ut2-onb-ph ml">' +
      '<div class="pp real"><span class="av">' + at + '</span><span>' + REAL_EMAIL + '</span></div>' +
      '<i class="ln"></i>' + HIDE_SVG +
      '<div class="pp alias"><span class="av">' + at + '</span><span>newyorkillusts@cloaked.id</span></div>' +
      DOT_SVG + brandRow([['Google.svg', 'Google Sign in'], ['Verizon.png', 'Verizon Sign in'], ['Netflix.svg', 'Netflix Sign in'], ['Spotify.svg', 'Spotify Sign in'], ['Airbnb.svg', 'Airbnb Sign in'], ['Amazon.png', 'Amazon Sign in']]) +
      '</div>';
  }
  /* contact alias, Figma 9558:63459 (Christine, 19 Oct; updated same day):
     (1) mauve box, white pill with your real number; (2) the box darkens
     from the top (→ #141410 at 55%), your number rises to 44 and a line
     drops through the Hide-my-info eye to the dark alias pill at 172;
     (3) it closes up — your number to -20 at 50%, the eye to 36, the alias
     to 68 — and a dotted arrow leads to where you give it out (chips at
     155); (4) the box goes fully dark, your number is gone, alias at 64,
     chips at 152; (5→) the chips rotate left one at a time to show more
     examples (Italy Trip, Business …; rotChips()). */
  var PH_PATH = 'M19.665 7.1998C20.4749 7.1998 21.1316 7.92353 21.1318 8.81601V23.1832C21.1318 24.0759 20.4751 24.8004 19.665 24.8004H12.332C11.5221 24.8003 10.8652 24.0758 10.8652 23.1832V8.81601C10.8654 7.9236 11.5222 7.1999 12.332 7.1998H19.665ZM14.751 8.55429C14.3771 8.55429 14.0732 8.85719 14.0732 9.23105C14.0734 9.60478 14.3772 9.90781 14.751 9.90781H17.2471C17.6207 9.90761 17.9237 9.60467 17.9238 9.23105C17.9238 8.85731 17.6208 8.55448 17.2471 8.55429H14.751Z';
  function phAv(bg, fg) {
    return '<svg class="av" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="' + bg + '"/><path d="' + PH_PATH + '" fill="' + fg + '"/></svg>';
  }
  var HIDE_SVG = '<svg class="eye" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="white"/><path d="M17.5127 6.5789L7.95996 18.1434L6.80371 17.1883L8.34375 15.323C6.86164 14.586 5.62665 13.4263 4.80078 11.9988C6.25344 9.4892 8.96677 7.79984 12.0752 7.79961C12.8486 7.79961 13.5974 7.90563 14.3086 8.10136L16.3564 5.62383L17.5127 6.5789ZM16.5391 9.08379C17.6958 9.81152 18.6626 10.8139 19.3486 11.9988C17.896 14.5089 15.1841 16.2 12.0752 16.2C11.6232 16.2 11.1797 16.1633 10.7471 16.0945L11.667 14.9803C11.7761 14.9923 11.8868 14.9998 11.999 14.9998C13.6558 14.9998 14.9989 13.6566 14.999 11.9998C14.999 11.6898 14.9516 11.3905 14.8643 11.1092L16.5391 9.08379ZM11.999 8.9998C10.3425 9.00001 8.99923 10.3433 8.99902 11.9998C8.99907 12.6756 9.22467 13.2978 9.60254 13.7986L13.3125 9.30742C12.9157 9.11247 12.471 8.9998 11.999 8.9998Z" fill="#141410"/></svg>';
  var DOT_SVG = '<svg class="dot" width="6" height="34" viewBox="0 0 6 34" fill="none" aria-hidden="true"><path d="M3 0V33" stroke="#F3F1ED" stroke-width="0.5" stroke-dasharray="1.5 1.5"/><path d="M1.6 31.6L3 33L4.4 31.6" stroke="#F3F1ED" stroke-width="0.5"/></svg>';
  /* chips: the first three are Figma's 126-wide ones, the rest hug (22 a side) */
  function chipRow(list) {
    return '<div class="chips"><div class="trk">' + list.map(function (c, i) {
      return '<span class="chip' + (i < 3 ? ' w' : '') + '">' + c + '</span>';
    }).join('') + '</div></div>';
  }
  function onbPhone() {
    return '<div class="ut2-onb-ph">' +
      '<div class="pp real">' + phAv('#83244F', '#D5A2B9') + '<span>281-380-9123</span></div>' +
      '<i class="ln"></i>' + HIDE_SVG +
      '<div class="pp alias">' + phAv('#141410', '#F3F1ED') + '<span>802-280-8091</span></div>' +
      DOT_SVG + brandRow([['Hinge.svg', 'Hinge profile'], ['Bumble.svg', 'Bumble profile'], ['Doordash.svg', 'DoorDash order'], ['Lyft.svg', 'Lyft ride'], ['Ebay.png', 'eBay listing'], ['Airbnb.svg', 'Airbnb host']]) +
      '</div>';
  }
  /* Christine, 19 Oct: once the chips are in, rotate them to show more
     examples — slide left by one chip, move it to the end, pause, repeat.
     Runs only while its card is .play; leaving resets the order. */
  var ROT_START = { ph: 4700, py: 4600, ml: 6000 };
  function rotChips(root) {
    var trks = root.querySelectorAll('.card .chips .trk');
    for (var i = 0; i < trks.length; i++) {
      var t = trks[i], card = t.closest('.card');
      if (!t._orig) t._orig = Array.prototype.slice.call(t.children);
      if (!card.classList.contains('play')) {
        if (t._t0) { t._t0 = 0; t._last = 0; t.style.transition = 'none'; t.style.transform = ''; t._orig.forEach(function (c) { t.appendChild(c); }); }
        continue;
      }
      var now = Date.now();
      if (!t._t0) { t._t0 = now; continue; }
      var k = card.querySelector('.ut2-onb-ph.ml') ? 'ml' : card.querySelector('.ut2-onb-ph') ? 'ph' : 'py';
      if (t._busy || now - t._t0 < ROT_START[k] || (t._last && now - t._last < 1800)) continue;
      t._last = now;
      (function (t) {
        var first = t.firstElementChild, w = first.offsetWidth + (parseFloat(getComputedStyle(first).marginRight) || 0);
        t._busy = true;
        t.style.transition = 'transform .6s cubic-bezier(.4, 0, .2, 1)';
        t.style.transform = 'translateX(' + (-w) + 'px)';
        setTimeout(function () {
          t.style.transition = 'none'; t.appendChild(first); t.style.transform = '';
          void t.offsetWidth; t._busy = false;
        }, 640);
      })(t);
    }
  }
  /* pay, Figma 9558:63699 (Christine, 19 Oct) — same grammar as the
     contact card: (1) blue #1A4459 box, white pill with your real card
     •••• 4821; (2) the box darkens from the top (→ #141410 at 55%), your
     card rises to 44, a line drops through the Hide-my-info eye to the dark
     alias card •••• 1234 at 170; (3) the view pans up 62 — the real card,
     line and eye drop to 25% — and a dotted arrow leads from the alias to
     where it is used: Strangers · Restaurant · Free trials; (4) it pans
     another 44 and the real card is gone. Icon is the filled debit-card
     glyph from the app's avatar-Vault item set (Figma's Icons-feature/debit
     card), #1A4459 on #96D3E9 / #F3F1ED on #141410. */
  var CARD_PATH = 'M31 26.4166C31 27.429 30.1794 28.2495 29.167 28.2496H10.833C9.82064 28.2495 9 27.429 9 26.4166V19.0836H31V26.4166ZM11.75 22.7496V25.4996H16.333V22.7496H11.75ZM29.167 12.6666C30.1793 12.6668 30.9998 13.4874 31 14.4996V16.3336H9V14.4996C9.00017 13.4874 9.82074 12.6668 10.833 12.6666H29.167Z';
  function pyAv(bg, fg) {
    return '<svg class="av" width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="' + bg + '"/><path d="' + CARD_PATH + '" fill="' + fg + '"/></svg>';
  }
  function onbPay() {
    return '<div class="ut2-onb-py"><div class="mv">' +
      '<div class="pp real">' + pyAv('#96D3E9', '#1A4459') + '<span>•••• 4821</span></div>' +
      '<i class="ln"></i>' + HIDE_SVG +
      '<div class="pp alias">' + pyAv('#141410', '#F3F1ED') + '<span>•••• 1234</span></div>' +
      DOT_SVG + brandRow([['Netflix.svg', 'Netflix $15.49'], ['Amazon.png', 'Amazon $42.10'], ['Spotify.svg', 'Spotify $11.99'], ['Doordash.svg', 'DoorDash $28.40'], ['Target.svg', 'Target $63.15'], ['Nike.svg', 'Nike $120.00']]) +
      '</div></div>';
  }
  /* folders, Figma 9558:63870 (Christine, 19 Oct) — eight beats in the box:
     (1) three small alias pills + outlined "+ Add to ID card" → (2) pills go,
     the button grows to the middle → (3) it fills (pressed) → (4) you type
     "Sign up for free trials" → (5) the pills sit in a dark card → (6) the
     card turns blue → (7) it is the finished ID card (Figma render,
     ut2/img/onb-idcard.png) → (8) the other cards stack up behind it. */
  var ADD_SVG = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7.42461 6.57498H10.3996V7.42498H7.42461V10.4H6.57461V7.42498H3.59961V6.57498H6.57461V3.59998H7.42461V6.57498Z" fill="currentColor"/></svg>';
  function fPill(k, tone, icon, txt) {
    return '<span class="fp ' + k + '"><span class="av" style="background:' + tone + '">' + icon + '</span>' + txt + '</span>';
  }
  /* folders, rebuilt frame by frame — Figma 9564:66808 (Christine, 19 Oct):
     (1) outlined "+ Add to ID card" in the middle → (2) it fills → (3) it
     rises to the top and three vault items line up under it, dim, each with
     an empty check → (4–5) they are checked one by one and light up →
     (6) all of it dims and a card outline forms around it → (7–8) "Sign up
     for / free trials" is typed into the card → (9) the card turns blue →
     (10) it is the finished ID card (Figma render, img/onb-idcard.png) →
     (11) the other cards stack up behind it. */
  var CHECK_SVG = '<svg class="ck" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#fff"/><path d="M15.937 20.2878C15.3692 20.9981 14.3138 21.0662 13.6592 20.4351L9.47925 16.4045L10.5208 15.325L14.7 19.3555C14.7186 19.3735 14.7489 19.3713 14.7651 19.3511L21.4141 11.0322L22.5859 11.9683L15.937 20.2878Z" fill="#0B0B0A"/></svg>';
  function onbFolder() {
    var at = '<span class="av" style="background:#A2BF7A"><img src="' + ONB_IC + 'onb-at.svg" alt=""></span>';
    function row(k, av, txt) {
      return '<div class="row ' + k + '"><span class="cb">' + CHECK_SVG + '</span><span class="pl">' + av + '<span>' + txt + '</span></span></div>';
    }
    var bands = [['Hide my info', 'c1'], ['Business Contact', 'c2'], ['Cancun Trip', 'c3'], ['Dating new people', 'c4']].map(function (c) {
      return '<div class="idc ' + c[1] + '"><div class="h"><b>' + c[0] + '</b><span>Risk level<br>Good</span></div></div>';
    }).join('');
    return '<div class="ut2-onb-fd">' +
      '<div class="stack">' + bands +
        '<div class="cd"><i class="ol"></i><i class="fl"></i>' +
        '<div class="tx"><span class="t1">Sign up for</span><i class="cur k1"></i><br><span class="t2">free trials</span><i class="cur k2"></i></div>' +
        '<img class="im" src="' + ONB_IC.replace('icons/', 'img/') + 'onb-idcard.png" alt=""></div>' +
      '</div>' +
      row('r1', at, 'Margaret611@gmail.com') + row('r2', pyAv('#96D3E9', '#1A4459'), '•••• 4821') + row('r3', phAv('#83244F', '#D5A2B9'), '281-380-9123') +
      '<button type="button" class="add" tabindex="-1">' + ADD_SVG + '<span>Add to identity</span></button>' +
      '</div>';
  }
  /* Christine, 22 Oct (later): the Vault intro's three cards, rewritten —
     1 what you save here is protected (an item turns to the lock and back),
     2 you can make aliases here too (a real row becomes an alias: black
     disc, orange mark, ALIAS tag), 3 an alias email's inbox is here, or it
     forwards to your real one (mail arrives, a toggle sends it on). */
  var ONB_ROW = function (ic, bg, t, sub, tag) {
    return '<div class="vr"><span class="av" style="background:' + bg + '">' + ic + '</span><span class="tx"><b>' + t + (tag ? '<i class="tag">ALIAS</i>' : '') + '</b><span>' + sub + '</span></span></div>';
  };
  var ONB_AT = '<img class="ic" src="' + ONB_IC + 'onb-at.svg" alt="">';
  /* 1 · three Vault rows; the middle one's avatar turns over to the lock and back (saved, protected) */
  function onbSecure() {
    return '<div class="ut2-onb-sec">' +
      '<div class="ls">' +
        ONB_ROW('<img class="ic" src="../ut2/img/vt-login.svg" alt="">', 'transparent', 'Netflix', '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022', false) +
        '<div class="vr k"><span class="av"><span class="f a">' + ONB_AT + '</span><span class="f b">' + LOCK_SVG + '</span></span><span class="tx"><b>Primary email</b><span>' + REAL_EMAIL + '</span></span></div>' +
        ONB_ROW('<img class="ic" src="../ut2/img/vt-card.svg" alt="">', 'transparent', 'Chase', '\u2022\u2022\u2022\u2022 4821', false) +
      '</div></div>';
  }
  /* 2 · a real row; a new alias row drops in under it — black disc, orange @, ALIAS tag */
  function onbAliasRow() {
    return '<div class="ut2-onb-al">' +
      '<div class="ls">' +
        '<div class="vr real"><span class="av"><img class="ic" src="' + ONB_IC + 'onb-at.svg" alt=""></span><span class="tx"><b>Primary email</b><span>' + REAL_EMAIL + '</span></span></div>' +
        '<div class="vr al"><span class="av"><img class="ic" src="' + ONB_IC + 'onb-at.svg" alt=""></span><span class="tx"><b>Soccer club<i class="tag">ALIAS</i></b><span>soccer.club@cloaked.com</span></span></div>' +
      '</div>' +
      '<div class="plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></div>' +
      '</div>';
  }
  /* 3 · the alias's inbox: two mails arrive; a Forward to toggle turns on and the mail slides across to your real address */
  function onbInbox() {
    var mail = function (k, from, sub) { return '<div class="ml ' + k + '"><span class="av"><img src="' + LOGO + from[1] + '" alt=""></span><span class="tx"><b>' + from[0] + '</b><span>' + sub + '</span></span></div>'; };
    return '<div class="ut2-onb-in">' +
      '<div class="hd"><span class="who">soccer.club@cloaked.com</span></div>' +
      '<div class="box">' + mail('m1', ['Nike', 'Nike.svg'], 'Your order is on its way') + mail('m2', ['Spotify', 'Spotify.svg'], 'Your receipt for October') + '</div>' +
      '<div class="fw"><span class="l">Forward to<br><b>' + REAL_EMAIL + '</b></span><span class="tg"><i></i></span></div>' +
      '</div>';
  }
  var ONB_CARDS = [
    { h: 'Everything you save is protected',
      p: 'Passwords, numbers, cards and addresses, encrypted and only yours.',
      v: onbSecure() },
    { h: 'Make aliases here too',
      p: 'An alias email or number stands in for your real one. It sits in the Vault right beside it.',
      v: onbAliasRow() },
    { h: 'Mail to an alias lands here',
      p: 'Read it in Cloaked, or forward it to your real inbox. It works like any other email.',
      v: onbInbox() }
  ];

  /* Christine, 19 Oct (Figma 9558:64871): a second version. The Vault opens
     on the list, with a "What's vault" card above the search; tapping it
     opens the intro, its X dismisses it. Same intro either way. */
  function mountBanner() {
    if (!BANNER || ONB.bannerGone) return;
    var scr = q('#vtL2Scroll'), stick = q('#vtL2Stick');
    if (!scr || !stick || scr.querySelector(':scope > .ut2-onb-banner, :scope > .ut2-vcard')) return;
    /* inside (20 Oct): the Home card itself, not the "What's vault" banner */
    var hc = q('#d1jCardGuard');
    if (hc) {
      var c = hc.cloneNode(true);
      c.removeAttribute('id'); c.removeAttribute('data-d1jonb');
      c.classList.add('ut2-vcard', 'ut2-noren');
      /* Christine, 20 Oct: in the Vault it says what it does here */
      var ct = c.querySelector('.d1j-t'); if (ct) ct.textContent = 'Create alias in this vault';
      c.addEventListener('click', function (e) { e.stopPropagation(); if (ONB.open) ONB.open(); });
      scr.insertBefore(c, stick);
      return;
    }
    var b = el('<div class="ut2-onb-banner ut2-noren" role="button" tabindex="0" aria-label="What\u2019s vault — open the intro">' +
      '<button type="button" class="x" aria-label="Dismiss">' + X_SVG + '</button>' +
      '<h3>What\u2019s vault</h3><p>Your saved logins, emails, phones and cards. Real ones and aliases.</p></div>');
    /* Figma 9561:65816: art = the Figma render below the copy (ut2/img/vault-banner-art.jpg) */
    b.addEventListener('click', function (e) {
      if (e.target.closest('.x')) { ONB.bannerGone = true; b.remove(); return; }
      if (ONB.open) ONB.open();
    });
    scr.insertBefore(b, stick);
  }
  /* Christine, 21 Oct (Figma 9603:79269): Day 01, the first time the Vault
     opens (1 Tab and 2 Tabs), a "What's vault" tray comes up over it — the
     banner card — and its X (or a tap outside) lets the Vault show. Once per
     visit; not on launcher slides (ut2go), which point at something else. */
  var VTRAY = { done: false, busy: !!GO };
  /* UserTest_V2_2Tabs, 21 Oct (Figma 9706:64459): the identity's own page —
     no card in a frame; the page is the identity's colour, its name and risk
     level at the top, the grey pattern (the wallet card's art, not the dark
     engraved one) in the middle, the rows on the colour, then Activities. */
  /* Figma 9706:64459 (Christine, 21 Oct): rows in bands on the colour —
     Phone · Email + Forward to · Card (name + last four, card art) and,
     under Show all, Bank Account · Address · URL and the other kinds picked in
     the create flow. The build's rows stay (their tap opens the row's tray);
     ours are added beside them. Identities made before this session get the
     Vault's own bank and home address. */
  var ID_EXTRA = {};
  var ID_MORE_LAB = { bank: 'Bank Account', address: 'Address', url2: 'URL', note: 'Secure notes', auth: 'Authentication Key', date: 'Date', idnum: 'Identification number' };
  /* Christine, 22 Oct (later): an identity you made shows only what you put in it.
     The ones that came with the prototype (Day 30's Hide my info…) keep the
     Vault's bank account and address under Show all, as the Figma. */
  function idExtraOf(title) {
    if (ID_EXTRA[title]) return ID_EXTRA[title];
    var all = vaultFlat(), out = [];
    ['bank', 'address'].forEach(function (g) { for (var i = 0; i < all.length; i++) if (all[i].g === g) { out.push(all[i]); break; } });
    return out;
  }
  /* Figma 9714:75743: an identity made before this session shows a card too (the Vault's first) */
  function idCardOf(title) {
    if (ID_EXTRA[title]) return null;
    var all = vaultFlat();
    for (var i = 0; i < all.length; i++) if (all[i].g === 'card') return all[i].it;
    return null;
  }
  function idValOf(it) {
    var f = it.fields && it.fields[0] && it.fields[0][1];
    return String(f || it.desc || it.title || '');
  }
  function idAv(it) { if (it && it.ut2logo) return '<span class="ut2-cav"><img src="' + esc(it.ut2logo) + '" alt="" style="width:40px;height:40px;display:block"></span>';
    try { return '<span class="ut2-cav">' + window.vtAvatarHTML(it.icon, it) + '</span>'; } catch (e) { return ''; } }
  var ACT_BTNS = '<span class="vt-search-row compact ut2-actbtns ut2-noren">' +
    '<button type="button" class="vt-ic-btn" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg></button>' +
    '<button type="button" class="vt-ic-btn" aria-label="Filter"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M7 12h10M10 17h4"/></svg></button></span>';
  function idDetailFlat() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    if (!AFTER) return;
    /* Figma 9714:75743: Activities has a search and a filter button (Day 01's had neither) */
    var at = q('#icL2 .ic-act-title');
    if (at && !at.querySelector('.vt-ic-btn')) {
      if (!at.querySelector(':scope > span')) at.innerHTML = '<span>' + esc(at.textContent.trim()) + '</span>';
      at.insertAdjacentHTML('beforeend', ACT_BTNS);
      [].forEach.call(at.querySelectorAll('.ut2-actbtns .vt-ic-btn'), function (b) {
        b.addEventListener('click', function () { if (typeof window.icToast === 'function') window.icToast(b.getAttribute('aria-label')); });
      });
    }
    var a = q('#icDetailCard .ic-card-art'); if (!a) return;
    var bg = a.style.backgroundImage || '';
    if (/detail\.png/i.test(bg)) a.style.backgroundImage = bg.replace(/([_-])detail\.png/i, function (m, sep) { return sep + 'cover.png'; });
    var card = a.closest('.ic-card'), box = card && card.querySelector('.ic-card-rows');
    if (!box || box.getAttribute('data-ut2flat')) return;
    box.setAttribute('data-ut2flat', '1');
    var title = ((card.querySelector('.ic-card-title') || {}).textContent || '').trim();
    var me = null; try { (window.icCardList() || []).forEach(function (c) { if (c.title === title) me = c; }); } catch (e) {}
    if (me && me.bg) card.style.setProperty('--ut2-idbg', /^#ff550c$/i.test(me.bg) ? MINT : me.bg);
    var vault = vaultFlat();
    var GRP = function (k) { k = String(k || '').trim(); return /^phone/i.test(k) ? 'p' : /^email/i.test(k) ? 'e' : /^(payment|card)/i.test(k) ? 'c' : /^(password|user)/i.test(k) ? 'l' : 'o'; };
    [].slice.call(box.querySelectorAll('.ic-card-row')).forEach(function (r) {
      var k = r.querySelector('.ic-card-k'), v = r.querySelector('.ic-card-v');
      r.setAttribute('data-g', GRP(k && k.textContent));
      if (r.getAttribute('data-g') !== 'c' || !v) return;
      var last = v.textContent.replace(/\D/g, '').slice(-4), it = null;
      vault.forEach(function (x) { if (!it && x.g === 'card' && String(x.it.desc || '').replace(/\D/g, '').slice(-4) === last) it = x.it; });
      k.setAttribute('data-l', 'Card');
      r.classList.add('ut2-cardrow');
      v.insertAdjacentHTML('afterend', '<span class="ut2-cv">' + (it ? '<b>' + esc(it.title) + '</b>' : '') + '<i>.' + esc(last) + '</i></span>' + (it ? idAv(it) : ''));
    });
    var es = box.querySelectorAll('.ic-card-row[data-g="e"]');
    /* Christine, 22 Oct (Figma 9714:75743): no Forward to row on the identity page */
    if (false && es.length) {
      /* On when the email alias on the card has forwarding on (the create flow's / the Vault form's toggle) */
      var fwdOn = false;
      [].forEach.call(es, function (r) { var v = ((r.querySelector('.ic-card-v') || {}).textContent || '').trim();
        vault.forEach(function (x) { if (x.g === 'email' && String(x.it.desc || '').trim() === v && x.it.ut2fwd) fwdOn = true; }); });
      es[es.length - 1].insertAdjacentHTML('afterend',
        '<div class="ut2-idrow" data-g="e"><span class="ic-card-k">Forward to</span><span class="ic-card-v">' + (fwdOn ? 'On' : 'Off') + '</span></div>');
    }
    var ex = idExtraOf(title);
    if (!box.querySelector('.ut2-cardrow')) {
      var cit = idCardOf(title);
      if (cit) {
        var last4 = String(cit.desc || '').replace(/\D/g, '').slice(-4);
        var crow = el('<div class="ut2-idrow ut2-cardrow ut2-noren" data-g="c" data-it="' + esc(cit.id || '') + '"><span class="ic-card-k">Card</span>' +
          '<span class="ut2-cv"><b>' + esc(cit.title) + '</b><i>.' + esc(last4) + '</i></span>' + idAv(cit) + '</div>');
        var lastTop = [].slice.call(box.querySelectorAll('.ic-card-row')).pop();
        if (lastTop) lastTop.parentNode.insertBefore(crow, lastTop.nextSibling); else box.insertBefore(crow, box.firstChild);
        crow.addEventListener('click', function (e) {
          e.stopPropagation();
          if (typeof window.vtOpenVaultItem === 'function') { try { window.vtOpenVaultItem((window.vtVaults()[0] || {}).id || 'primary', cit.id); } catch (e2) {} }
        });
      }
    }
    ex.forEach(function (r) {
      var lab = ID_MORE_LAB[r.g] || r.g;
      box.insertAdjacentHTML('beforeend', '<div class="ut2-idrow more" data-g="c" data-it="' + esc(r.it.id || '') + '">' +
        '<span class="ic-card-k">' + esc(lab) + '</span><span class="ic-card-v">' + esc(idValOf(r.it)) + '</span>' +
        (r.g === 'bank' ? idAv(r.it) : '') + '</div>');
    });
    /* bands: a new band starts where the group changes; Phone and Email close
       without a line, the card band keeps its lines down to Show all */
    var kids = [].slice.call(box.children);
    kids.forEach(function (r, i) {
      var g = r.getAttribute('data-g') || 'o', prev = i ? (kids[i - 1].getAttribute('data-g') || 'o') : null;
      var next = kids[i + 1] ? (kids[i + 1].getAttribute('data-g') || 'o') : null;
      r.classList.toggle('ut2-gs', prev !== null && prev !== g);
      r.classList.toggle('ut2-gl', next !== g && g !== 'c' && !(g === 'o' && ex.length));
    });
    if (ex.length) {
      var see = el('<button type="button" class="ut2-idsee" data-g="c">Show all</button>');
      box.appendChild(see);
      see.addEventListener('click', function (e) {
        e.stopPropagation();
        see.textContent = box.classList.toggle('ut2-open') ? 'Show less' : 'Show all';
      });
    }
    [].slice.call(box.querySelectorAll('.ut2-idrow.more[data-it]')).forEach(function (r) {
      r.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = r.getAttribute('data-it'); if (!id || typeof window.vtOpenVaultItem !== 'function') return;
        try { window.vtOpenVaultItem((window.vtVaults()[0] || {}).id || 'primary', id); } catch (e2) {}
      });
    });
  }
  /* ═══ Christine, 21 Oct — the alias look (Figma 9666:97473 / 97589) and the
     avatar spin on opening an item (the manager's note) ═══
     An alias wears a BLACK disc with its icon or logo in ORANGE. Opening any
     item spins its avatar once (Y axis, ~0.9s); the back face has the two
     colours swapped, so an alias page lands on an orange disc with a black
     icon (97589). A logo has no two colours, so it only turns. */
  var AL_BG = '#141410', AL_INK = '#FF550C';
  var SVG_CACHE = {};
  function fetchSVG(url) {
    if (SVG_CACHE[url]) return SVG_CACHE[url];
    return (SVG_CACHE[url] = fetch(url).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; }));
  }
  /* a baked-in avatar svg (assets/Avatar/…): the first filled shape is the disc, the rest the mark */
  function tintSVG(txt, bg, ink) {
    if (!txt) return '';
    var n = 0;
    return txt.replace(/fill="(#[0-9a-fA-F]{3,8})"/g, function () { return 'fill="' + (n++ === 0 ? bg : ink) + '"'; })
      .replace(/<svg([^>]*)\s(width|height)="[^"]*"/g, '<svg$1').replace(/<svg([^>]*)\s(width|height)="[^"]*"/g, '<svg$1');
  }
  function svgFills(txt) { var m = txt.match(/fill="(#[0-9a-fA-F]{3,8})"/g) || []; return m.map(function (x) { return x.slice(6, -1); }); }
  function bgURL(el) { var m = (el.style.backgroundImage || getComputedStyle(el).backgroundImage || '').match(/url\(["']?([^"')]+)["']?\)/); return m ? m[1] : ''; }
  /* a raster logo on an opaque ground (Amazon.png is a mark on white) has no
     alpha to mask with — its darkness becomes the mask instead. Cached per url;
     an svg or a transparent png is used as it is. */
  var MASK_CACHE = {};
  /* Christine, 22 Oct: an alias's logo sometimes showed as a bare black disc
     (the CSS mask hadn't come in, or the phone's browser dropped it). An svg
     logo is now drawn inline — the file fetched once, every fill and stroke
     set to the alias orange — so it is always there; the mask stays only as
     the first frame and for raster logos. */
  var INK = {};
  function inkSoon(url, cb) {
    if (!/\.svg(\?|$)/i.test(url || '')) return;
    if (INK[url] !== undefined) { if (INK[url]) cb(); return; }
    fetchSVG(url).then(function (txt) {
      INK[url] = txt && /<svg/i.test(txt) ? txt.replace(/<\?xml[^>]*>/, '').replace(/<svg([^>]*)\s(width|height)="[^"]*"/g, '<svg$1').replace(/<svg([^>]*)\s(width|height)="[^"]*"/g, '<svg$1') : '';
      if (INK[url]) cb();
    });
  }
  function mkHTML(url, col) {
    var t = INK[url];
    if (t) return '<span class="ut2-mk ut2-mki">' + t.replace(/(fill|stroke)="(?!none)[^"]*"/g, '$1="' + col + '"').replace(/(fill|stroke):\s*(?!none)[^;"]+/g, '$1:' + col) + '</span>';
    return '<i class="ut2-mk" style="' + MASK(url) + 'background:' + col + '"></i>';
  }
  function logoMask(url, cb) {
    if (/\.svg(\?|$)/i.test(url)) return cb(url);
    if (MASK_CACHE[url]) return cb(MASK_CACHE[url]);
    var im = new Image();
    im.onload = function () {
      try {
        var c = document.createElement('canvas'), w = c.width = im.naturalWidth, h = c.height = im.naturalHeight, x = c.getContext('2d');
        x.drawImage(im, 0, 0);
        var d = x.getImageData(0, 0, w, h), px = d.data, corner = px[3] + px[(w - 1) * 4 + 3] + px[(h - 1) * w * 4 + 3];
        var i, lum, on = 0;
        for (i = 3; i < px.length; i += 4) if (px[i] > 128) on++;
        var cover = on / (w * h);
        /* transparent corners and a mark that is mostly holes: the alpha IS the shape (Airbnb, Bumble) */
        if (corner < 30 && cover < 0.6) { MASK_CACHE[url] = url; return cb(url); }
        /* a filled badge (Amazon: an orange disc with a white smile): the LIGHT parts are the mark;
           an opaque picture on white: the DARK parts are */
        var light = corner < 30;
        for (i = 0; i < px.length; i += 4) {
          lum = (px[i] * .299 + px[i + 1] * .587 + px[i + 2] * .114) / 255;
          px[i + 3] = Math.round(px[i + 3] * Math.min(1, Math.max(0, (light ? (lum - .55) * 2.5 : (1 - lum) * 1.6))));
        }
        x.putImageData(d, 0, 0);
        MASK_CACHE[url] = c.toDataURL('image/png'); cb(MASK_CACHE[url]);
      } catch (e) { MASK_CACHE[url] = url; cb(url); }
    };
    im.onerror = function () { cb(url); };
    im.src = url;
  }
  /* 22 Oct: 56% box — a logo file's drawing fills ~80% of it, so ~45% of the disc, the same as the marks (fitMark) */
  var MASK = function (url) { return '-webkit-mask:url(&quot;' + url + '&quot;) center/56% no-repeat;mask:url(&quot;' + url + '&quot;) center/56% no-repeat;'; };
  /* what an avatar is made of — enough to redraw it in other colours */
  function avInfo(av) {
    if (!av) return null;
    var cs = getComputedStyle(av), url = bgURL(av);
    if (av.getAttribute('data-ut2k')) return { kind: av.getAttribute('data-ut2k'), bg: av.getAttribute('data-ut2bg'), ink: av.getAttribute('data-ut2ink'), url: av.getAttribute('data-ut2url'), svg: av.getAttribute('data-ut2svg') || av.innerHTML, alias: av.getAttribute('data-ut2al') === '1' };
    if (av.classList.contains('logo') && av.querySelector(':scope > img')) return { kind: 'logo', url: av.querySelector(':scope > img').getAttribute('src') };
    if (av.classList.contains('av-rule')) {
      if (av.classList.contains('av-mark')) return { kind: 'mark', bg: av.style.background || cs.backgroundColor, ink: av.style.color || cs.color, svg: av.innerHTML };
      var im = av.querySelector('img'); return { kind: 'logo', url: im ? im.getAttribute('src') : url };
    }
    if (av.classList.contains('made') || av.classList.contains('glyph') || av.classList.contains('letter') || av.classList.contains('raw'))
      return { kind: 'mark', bg: cs.backgroundColor, ink: cs.color, svg: av.innerHTML, cls: av.className };
    if (av.classList.contains('mark')) return { kind: 'logo', url: url };
    if (url && /\.svg(\?|$)/i.test(url)) return { kind: 'svg', url: url };
    if (url) return { kind: 'photo', url: url, bs: cs.backgroundSize, bp: cs.backgroundPosition };   /* 22 Oct: the photo keeps its own crop on the turning faces */
    return { kind: 'mark', bg: cs.backgroundColor, ink: cs.color, svg: av.innerHTML };
  }
  /* an alias row's avatar: black disc, orange mark / logo */
  function aliasAv(av) {
    if (!av || av.getAttribute('data-ut2al') === '1') return;
    var info = avInfo(av); if (!info) return;
    av.setAttribute('data-ut2al', '1');
    if (info.kind === 'mark') {
      av.style.setProperty('background', AL_BG, 'important'); av.style.setProperty('color', AL_INK, 'important');
      av.setAttribute('data-ut2k', 'mark'); av.setAttribute('data-ut2bg', AL_BG); av.setAttribute('data-ut2ink', AL_INK);
    } else if (info.kind === 'logo' && info.url) {
      av.classList.add('ut2-lg'); av.innerHTML = mkHTML(info.url, AL_INK);
      logoMask(info.url, function (m) { var mk = av.querySelector('i.ut2-mk'); if (mk && m !== info.url) { mk.style.cssText = MASK(m).replace(/&quot;/g, '"'); av.setAttribute('data-ut2url', m); } });
      inkSoon(info.url, function () { var mk = av.querySelector('i.ut2-mk'); if (mk) mk.outerHTML = mkHTML(info.url, AL_INK); });
      av.style.setProperty('background-image', 'none', 'important'); av.style.setProperty('background-color', AL_BG, 'important');
      av.setAttribute('data-ut2k', 'logo'); av.setAttribute('data-ut2url', info.url); av.setAttribute('data-ut2bg', AL_BG); av.setAttribute('data-ut2ink', AL_INK);
    } else if (info.kind === 'svg') {
      av.setAttribute('data-ut2k', 'svg'); av.setAttribute('data-ut2url', info.url); av.setAttribute('data-ut2bg', AL_BG); av.setAttribute('data-ut2ink', AL_INK);
      fetchSVG(info.url).then(function (txt) {
        if (!txt || !av.isConnected) return;
        av.classList.add('ut2-sv'); av.innerHTML = tintSVG(txt, AL_BG, AL_INK); av.setAttribute('data-ut2svg', txt);
        av.style.setProperty('background-image', 'none', 'important');
      });
    }
  }
  /* one face of the spinning avatar, in the given colours */
  function faceHTML(info, bg, ink) {
    if (!info) return '';
    if (info.kind === 'logo') {
      if (info.alias || info.bg === AL_BG) return '<span class="ut2-face" style="background:' + AL_BG + '">' + mkHTML(info.url, AL_INK) + '</span>';
      return '<span class="ut2-face bare"><img src="' + esc(info.url) + '" alt=""></span>';
    }
    if (info.kind === 'photo') return '<span class="ut2-face" style="background:url(&quot;' + esc(info.url) + '&quot;) ' + esc(info.bp || 'center') + '/' + esc(info.bs || 'cover') + ' no-repeat"></span>';
    if (info.kind === 'svg') return '<span class="ut2-face sv">' + (info.svg ? tintSVG(info.svg, bg, ink) : '') + '</span>';
    return '<span class="ut2-face mk' + (/\bmade\b/.test(info.cls || '') ? ' made' : '') + (/\braw\b/.test(info.cls || '') ? ' raw' : '') + '" style="background:' + bg + ';color:' + ink + '">' + (info.svg || '') + '</span>';
  }
  /* the reversed face: the alias colours swapped (orange disc, black mark) */
  function faceBack(info, bg, ink) {
    if (!info) return '';
    if (info.kind === 'logo' && (info.alias || info.bg === AL_BG))
      return '<span class="ut2-face" style="background:' + AL_INK + '">' + mkHTML(info.url, AL_BG) + '</span>';
    if (info.kind === 'mark' || info.kind === 'svg') return faceHTML(info, ink, bg);
    return faceHTML(info, bg, ink);
  }
  var LASTROW = null, ROWPASS = false;
  var ROW_SEL = '#vaultsScreen .vt-row[data-item], .ut2-alist .vt-row, #d1jFamily .vt-row';
  /* Christine, 21 Oct (Figma 9809:112806, "Icon rotates when opening an item"),
     22 Oct: subtle — the tapped row's icon turns half over (to its reversed
     face) and the item's page opens on that. No dim, no highlight (those were
     only to point at the row in the Figma). A tap is held for the turn and then
     handed back to the row; a script's click (a tour) goes straight through. */
  document.addEventListener('click', function (e) {
    if (ROWPASS) return;
    var r = e.target.closest && e.target.closest(ROW_SEL);
    if (!r) return;
    var inner = e.target.closest('button, a, input, label, [role="button"]');
    if (inner && inner !== r && r.contains(inner)) return;          /* a control inside the row keeps its own job */
    LASTROW = { row: r, t: Date.now() };
    if (!AFTER || !e.isTrusted) return;
    if (r.__ut2pick) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    var av = r.querySelector('.vt-av'), info = avInfo(av);
    if (!info) return;                                               /* 22 Oct: a photo turns too (both faces the photo) */
    e.preventDefault(); e.stopImmediatePropagation();
    rowPick(r, av, info, function () {
      LASTROW = { row: r, t: Date.now() };
      ROWPASS = true;
      try { r.click(); } finally { ROWPASS = false; }
    });
  }, true);
  function rowPick(row, av, info, open) {
    row.__ut2pick = 1;
    var go = function () {
      var bg = info.bg || getComputedStyle(av).backgroundColor, ink = info.ink || getComputedStyle(av).color;
      var keep = av.innerHTML, keepCls = av.className, keepStyle = av.getAttribute('style') || '';
      av.classList.add('ut2-spinav');
      /* Christine, 22 Oct: V3's flip (MV-7b/7c) — a coin, not a card: tight
         perspective, a 6px side band seen edge-on, .42s cubic-bezier(.4,0,.2,1) */
      var ed = info.alias ? { c: '#8a3407', al: true } : edgeFor(bg, ink, info.kind === 'mark' || info.kind === 'svg');
      av.style.setProperty('background', 'transparent', 'important'); av.style.setProperty('background-image', 'none', 'important');
      av.innerHTML = '<span class="ut2-spin"><span class="ut2-f a">' + faceHTML(info, bg, ink) + '</span>' + (ed ? '<i class="ut2-edge' + (ed.al ? ' al' : '') + '" style="background:' + ed.c + '"></i>' : '') + '<span class="ut2-f b">' + faceBack(info, bg, ink) + '</span></span>';
      coin(av);
      fitMarks(av);
      var sp = av.querySelector('.ut2-spin');
      try { sp.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(180deg)' }], { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }); } catch (e) {}
      setTimeout(function () {
        open();
        setTimeout(function () { av.className = keepCls; av.setAttribute('style', keepStyle); av.innerHTML = keep; row.__ut2pick = 0; }, 600);   /* put back once the page covers it */
      }, 440);
    };
    if (info.kind === 'svg' && !info.svg) fetchSVG(info.url).then(function (txt) { var f = svgFills(txt); info.svg = txt; info.bg = info.bg || f[0]; info.ink = info.ink || f[1]; go(); }, go);
    else go();
  }
  var SPIN_SEL = ['#vtL3.open .vt-hero-av .vt-av', '#d1jDetail.on #d1jDetAv', '#vtL3.open .lg-av .vt-av'];
  function openSpin() {
    if (!AFTER) return;
    var hero = null;
    for (var i = 0; i < SPIN_SEL.length && !hero; i++) { var h = q(SPIN_SEL[i]); if (h && visible(h)) hero = h; }
    if (!hero || hero.__ut2spun) return;
    var saving = Date.now() - FLIPAT < 2500;                                 /* the saved flip (icon → lock → icon) owns the motion */
    var src = LASTROW && Date.now() - LASTROW.t < 4000 ? LASTROW.row.querySelector('.vt-av') : null;
    var info = avInfo(src) || avInfo(hero);
    if (!info) return;
    /* an alias page with no row to read from (opened straight after Create): the alias colours */
    if (!src && (q('#vtL3.vt-dark') || q('#d1jDetail.dark')) && info.kind !== 'logo' && info.kind !== 'photo') { info.bg = AL_BG; info.ink = AL_INK; }
    if (!src && (q('#vtL3.vt-dark') || q('#d1jDetail.dark')) && info.kind === 'logo') info.alias = true;   /* an alias's logo: black disc, orange logo, as its row */
    hero.__ut2spun = 1;
    var run = function () {
      var bg = info.bg || getComputedStyle(hero).backgroundColor, ink = info.ink || getComputedStyle(hero).color;
      var two = info.kind === 'mark' || info.kind === 'svg';
      var front = faceHTML(info, bg, ink), back = faceBack(info, bg, ink); void two;   /* an alias's logo reverses too (orange disc, black logo) */
      hero.classList.add('ut2-spinav');
      hero.innerHTML = '<span class="ut2-spin"><span class="ut2-f a">' + front + '</span><span class="ut2-f b">' + back + '</span></span>';
      fitMarks(hero);
      var sp = hero.querySelector('.ut2-spin');
      /* Figma 9809:112806: the page opens standing still on the icon's own face — the turn happened on the list (rowPick) */
      sp.style.transform = 'rotateY(0deg)'; void saving;
    };
    if (info.kind === 'svg' && !info.svg) fetchSVG(info.url).then(function (txt) { var f = svgFills(txt); info.svg = txt; info.bg = f[0] || '#141410'; info.ink = f[1] || '#f3f1ed'; run(); });
    else run();
  }
  /* the alias page (97589): the item's name under its avatar, the way the Figma reads */
  /* Christine, 21 Oct (Figma 9734:108452, ONB-03): Day 01's "Margaret, start
     here. Biggest difference." step is a 353x443 card — art (the identity
     video in Figma; here its frame drawn live: a glowing disc behind eight
     sites that all hold usersmail@gmail.com), "Hide me with identity alias" /
     "Peace in 5 mins", and a "Get started →" row — with one black "Later"
     button 24 under it. No Create button. Get started opens the identity flow
     (the build's createFromWelcome → our capture on #icIntro → openIdFlow);
     Later is the build's dismissWelcome (the card collapses into Home's).
     On a short screen the card gives up height (and the list shrinks) so
     Later is never cut off. */
  /* Christine, 21 Oct (later): the card art is the motion from her own
     intro-v1-descriptive-short.html (the Figma video's source) — a breathing
     orb whose palette drifts every 7s, and one line per site where the real
     usersmail@gmail.com morphs character by character into a cloaked address
     while the brand mark turns into the orange cloaked mark, top row first,
     holds, then all turn back together. Ported here at the card's size (orb
     centre and radius from the Figma frame), and it only runs while the card
     is on screen. */
  var WF_SITES = [['Nike', 1, 'swift.pine@cloaked.id'], ['Google', 0, 'crayon@cloaked.id'], ['Walmart', 0, 'north.gate@relay.cloak'],
                  ['Apple', 1, 'quiet.fox@cloaked.email'], ['Zillow', 0, 'amber.wren@cloaked.id'], ['Lyft', 0, 'pine.echo@staycloaked.com'],
                  ['Airbnb', 0, 'dusk.harbor@relay.cloak'], ['Target', 0, 'slate.hare@cloaked.id']];
  function wfArt(art, card, liveFn) {
    var REAL = 'usersmail@gmail.com';
    var box = el('<div class="ut2-wfart ut2-noren" aria-hidden="true"><canvas class="orbc"></canvas><div class="rows"></div></div>');
    var host = box.querySelector('.rows');
    var rows = WF_SITES.map(function (sd, i) {
      var src = 'assets/logo/' + sd[0] + '.svg';
      var row = el('<div class="mrow"><div class="logowrap"><img class="real' + (sd[1] ? ' inv' : '') + '" src="' + src + '" alt="">' +
        '<span class="cloak"><img src="' + src + '" alt=""></span></div><canvas></canvas></div>');
      host.appendChild(row);
      return { row: row, cv: row.querySelector('canvas'), to: sd[2], seed: i + 1 };
    });
    art.appendChild(box);
    var bg = box.querySelector('.orbc'), bx = bg.getContext('2d');
    var sm = function (t) { return t * t * (3 - 2 * t); }, c01 = function (t) { return t < 0 ? 0 : t > 1 ? 1 : t; };
    var lerp3 = function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
    var scale3 = function (c, k) { return [c[0] * k, c[1] * k, c[2] * k]; };
    var PAL = [
      { c: [236, 176, 40], m: [196, 128, 52], e: [44, 98, 196] }, { c: [238, 150, 56], m: [198, 104, 72], e: [64, 84, 192] },
      { c: [214, 196, 52], m: [140, 168, 72], e: [36, 142, 162] }, { c: [238, 162, 46], m: [200, 108, 58], e: [72, 76, 196] },
      { c: [228, 184, 52], m: [168, 150, 64], e: [80, 112, 194] }, { c: [236, 170, 38], m: [192, 118, 56], e: [52, 108, 196] }];
    function colorAt(pal, f) {
      if (f <= 0) return pal.c; if (f >= 1) return pal.e;
      if (f < 0.34) return lerp3(pal.c, lerp3(pal.c, pal.m, 0.62), f / 0.34);
      if (f < 0.60) return lerp3(lerp3(pal.c, pal.m, 0.62), pal.m, (f - 0.34) / 0.26);
      if (f < 0.82) return lerp3(pal.m, lerp3(pal.m, pal.e, 0.60), (f - 0.60) / 0.22);
      return lerp3(lerp3(pal.m, pal.e, 0.60), pal.e, (f - 0.82) / 0.18);
    }
    var lumAt = function (f) { return f >= 1 ? 0 : (f < 0.96 ? 1 - 0.08 * (f / 0.96) : 0.92 * (1 - (f - 0.96) / 0.04)); };
    var noise = (function () { var c = document.createElement('canvas'); c.width = c.height = 128;
      var g = c.getContext('2d'), d = g.createImageData(128, 128);
      for (var i = 0; i < d.data.length; i += 4) { var v = 128 + (Math.random() * 2 - 1) * 22; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      g.putImageData(d, 0, 0); return c; })();
    var W = 0, H = 0;
    function size() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = bg.clientWidth || 353; H = bg.clientHeight || 362;
      bg.width = W * dpr; bg.height = H * dpr; bx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rows.forEach(function (r) {
        var w = r.cv.clientWidth || 240, h = 22;
        r.cv.width = w * 2; r.cv.height = h * 2;
        r.x = r.cv.getContext('2d'); r.x.setTransform(2, 0, 0, 2, 0, 0); r.W = w; r.H = h;
      });
    }
    function drawOrb(p, breath, np, op) {
      bx.clearRect(0, 0, W, H);
      /* Figma 9734:108812: the disc's rim passes ~215 under the card's top at the
         centre, ~140 at the sides — centre 30 above the card, radius 245 */
      var shift = (card.__ut2h ? (card.__ut2h - 443) * 0.5 : 0);
      var cx = W * 0.5, cy = card.__orb ? card.__orb.cy : -30 + shift, Rc = (card.__orb ? card.__orb.r : 245) * (1 + 0.035 * Math.sin(breath * 6.28319));
      var fn = 1 - Math.pow(1 - p, 2.4), oldB = 1 - sm(p), feF = Math.max(0.04, 0.16 - 0.12 * p);
      var bxs = Rc * 1.06, x0 = cx - bxs, y0 = cy - bxs, w2 = 2 * bxs;
      var g = bx.createRadialGradient(cx, cy, 0, cx, cy, Rc), N = 30;
      for (var i = 0; i <= N; i++) {
        var f = i / N, blend = c01((f - (fn - feF)) / feF);
        var col = lerp3(colorAt(np, f), scale3(colorAt(op, f), oldB), blend);
        col = scale3(col, lumAt(f) * 0.78);
        var a = f < 0.94 ? 1 : Math.max(0, 1 - (f - 0.94) / 0.06);
        g.addColorStop(f, 'rgba(' + Math.round(col[0]) + ',' + Math.round(col[1]) + ',' + Math.round(col[2]) + ',' + a.toFixed(3) + ')');
      }
      bx.fillStyle = g; bx.fillRect(x0, y0, w2, w2);
      bx.save(); bx.beginPath(); bx.arc(cx, cy, Rc * 0.99, 0, 6.2832); bx.clip();
      bx.globalCompositeOperation = 'soft-light'; bx.globalAlpha = 0.38;
      var jx = (Math.random() * 128) | 0, jy = (Math.random() * 128) | 0;
      for (var gx = Math.max(x0, -128) - jx; gx < Math.min(x0 + w2, W + 128); gx += 128)
        for (var gy = Math.max(y0, -128) - jy; gy < Math.min(y0 + w2, H + 128); gy += 128) bx.drawImage(noise, gx, gy);
      bx.restore(); bx.globalAlpha = 1; bx.globalCompositeOperation = 'source-over';
    }
    function shuffleStarts(n, seed) {
      var order = []; for (var i = 0; i < n; i++) order.push(i);
      var a = (seed * 2654435761) >>> 0;
      var rnd = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
      for (var j = n - 1; j > 0; j--) { var k = Math.floor(rnd() * (j + 1)); var tmp = order[j]; order[j] = order[k]; order[k] = tmp; }
      var st = new Array(n); for (var m = 0; m < n; m++) st[order[m]] = (n > 1 ? m / (n - 1) : 0) * 0.72;
      return st;
    }
    var FONT = '400 12px -apple-system,"SF Pro Text","Helvetica Neue",Arial,sans-serif';
    function draw(r, A, B, p) {
      var x = r.x, w = r.W, h = r.H; x.clearRect(0, 0, w, h);
      x.font = FONT; x.textAlign = 'center'; x.textBaseline = 'middle';
      var a = Array.from(A), b = Array.from(B), n = Math.max(a.length, b.length);
      var mw = function (c) { return c ? (x.measureText(c).width || 4) : 0; };
      var DUR = 0.34, MAXB = 6, lp = [], wid = [], total = 0, k;
      for (k = 0; k < n; k++) { lp[k] = c01((p - r.st[k]) / DUR); var t = sm(lp[k]); wid[k] = mw(a[k] || '') * (1 - t) + mw(b[k] || '') * t; total += wid[k]; }
      var cx = [], xx = w - total; for (k = 0; k < n; k++) { cx[k] = xx + wid[k] / 2; xx += wid[k]; }
      function gl(ch, px, blur, al, col, comp) {
        if (!ch || al <= 0.02) return;
        x.save(); if (comp) x.globalCompositeOperation = comp;
        if (blur > 0.4) x.filter = 'blur(' + blur.toFixed(1) + 'px)';
        x.globalAlpha = Math.min(1, al); x.fillStyle = col; x.fillText(ch, px, h / 2); x.restore(); x.filter = 'none';
      }
      for (k = 0; k < n; k++) {
        var A1 = a[k] || '', B1 = b[k] || '';
        if (A1 === B1) { gl(A1, cx[k], 0, 1, '#F3F1ED'); continue; }
        var tt = lp[k], heat = Math.sin(tt * Math.PI);
        if (heat > 0.03) { gl(A1, cx[k], tt * MAXB * 1.6 + 2, heat * 0.55, 'rgba(255,150,82,1)', 'lighter'); gl(B1, cx[k], (1 - tt) * MAXB * 1.6 + 2, heat * 0.55, 'rgba(255,150,82,1)', 'lighter'); }
        gl(A1, cx[k], tt * MAXB, 1 - sm(tt), '#F3F1ED');
        gl(B1, cx[k], (1 - tt) * MAXB, sm(tt), '#F3F1ED');
      }
    }
    var REST = 1200, MORPH = 900, STAG = 210, HOLD = 2200, BACK = 900;
    var T_BACK = REST + MORPH + STAG * (WF_SITES.length - 1) + HOLD, CYCLE = T_BACK + BACK;
    var INTERVAL = 7000, TRANSITION = 3500, lastK = -1, t0 = 0, sized = false, running = false;
    function live() {
      if (liveFn) return liveFn();
      var wf = q('#welcomeFlow'), st = q('#wfStageFound');
      return wf && getComputedStyle(wf).display !== 'none' && st && st.classList.contains('active') && !card.classList.contains('collapsing');
    }
    function frame(now) {
      if (!live()) { running = false; t0 = 0; return; }
      if (!sized || bg.clientWidth !== W || bg.clientHeight !== H) { size(); sized = true; }
      if (!t0) t0 = now;
      var kk = Math.floor(now / INTERVAL); if (kk !== lastK) lastK = kk;
      drawOrb(c01((now - kk * INTERVAL) / TRANSITION), (now % 5200) / 5200, PAL[kk % PAL.length], PAL[(kk + PAL.length - 1) % PAL.length]);
      var elp = now - t0 - 300, cyc = elp < 0 ? -1 : elp % CYCLE, back = cyc >= T_BACK, qq = back ? c01((cyc - T_BACK) / BACK) : 0;
      rows.forEach(function (r, i) {
        if (!r.x) return;
        if (!r.st) r.st = shuffleStarts(Math.max(Array.from(REAL).length, Array.from(r.to).length), r.seed);
        if (back) { r.row.classList.toggle('cloaking', qq < 0.5); draw(r, r.to, REAL, qq); return; }
        var local = cyc - REST - i * STAG, p = local <= 0 ? 0 : (local < MORPH ? c01(local / MORPH) : 1);
        r.row.classList.toggle('cloaking', local >= MORPH * 0.5);
        draw(r, REAL, r.to, p);
      });
      requestAnimationFrame(frame);
    }
    return function kick() { if (!running && live()) { running = true; requestAnimationFrame(frame); } };
  }
  /* ═══ Christine, 22 Oct (Figma 9817:112882) — the identity story, in motion.
     One 329x264 stage, looping: Margaret's real email / card / phone on a
     panel → the panel lifts away, "+ Create an identity" → pressed → "Sign up
     for free trials" types itself → a blue card appears and fills in (the
     card's own art) → the other identities drop in above it, a wallet. Used
     by the onboarding's start-here card and by the Identities intro. ═══ */
  var SL_IC = {
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="3.6"/><path d="M15.6 12v1.3a2.4 2.4 0 0 0 4.8 0V12a8.4 8.4 0 1 0-3.3 6.7"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12.5" rx="2"/><path d="M3 10.2h18"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="2.8" width="11" height="18.4" rx="2.4"/><rect x="10" y="17.6" width="4" height="1.3" rx=".6" fill="#141410"/></svg>'
  };
  var SL_CARDS = [['Hide my info', 'rgb(255,85,12)', 24], ['Business<br>Contact', '#B9A56C', 63.85], ['Cancun Trip', '#A2BF7A', 111.96], ['Dating new<br>people', '#D5A2B9', 151.81]];
  /* Christine, 22 Oct (Figma 9822:114546): with V3's Identity, the start-here
     card's art is V3's identity cards in three beats — the Primary identity
     alone → Hide my info rises over it → Business identity and Cancun trip
     stack on, a wallet. V3's own .ic-card.idf at its wallet size (353×235)
     scaled .75 = the Figma's 264.75×176.25. V3's card curve (.32,.72,0,1). */
  var IDF_MARK = '<svg class="idf-mark" viewBox="0 0 88 88" fill="currentColor" aria-hidden="true"><path d="M24.436 72.5999C24.436 72.5999 -0.247964 63.8138 5.17972 54.5404C8.63827 48.6829 16.5371 55.0276 28.8763 61.3722L24.4304 72.5999H24.436Z"/><path d="M54.5538 69.6683C73.3136 71.13 81.6253 62.8906 83.6 60.4545C83.6 60.4545 72.3987 46.6013 65.7996 37.3063C61.3035 30.9778 55.5467 21.9805 52.2499 16.7565C51.0785 14.8996 48.2782 14.9754 47.0844 16.8215C34.8345 35.7039 12.2758 49.8602 7.21631 52.5886C11.2159 50.9754 18.5124 56.0046 28.3915 61.3748C28.3915 61.3748 35.727 65.0777 40.6973 66.7938C47.0677 68.9916 54.5593 69.6737 54.5593 69.6737L54.5538 69.6683Z"/></svg>';
  var IDS_CARDS = [
    { t: 'Primary identity', n: 2, bg: '#1e1e1e', ink: '#f3f1ed', tile: '#ff550c', dark: 1, f: [['Phone', '425-223-6234'], ['Email', 'hidemy241@gmail.com'], ['Expiration date', 'Never']] },
    { t: 'Hide my info', n: 2, bg: '#9dc4eb', ink: '#141410', tile: '#84a5c6', f: [['Phone', '425-235-6234'], ['Email', 'hidemy241@cloaked.com'], ['Expiration date', '01/15/80']] },
    { t: 'Business identity', n: 2, bg: '#b9a56c', ink: '#141410', tile: '#9c8b5b', f: [['Phone', '425-235-6234'], ['Email', 'christine@playlist.studio'], ['Expiration date', '01/15/80']] },
    { t: 'Cancun trip', n: 3, bg: '#a9bd85', ink: '#141410', tile: '#8ba066', f: [['Phone', '425-235-6234'], ['Email', 'hidemy241@cloaked.com'], ['Expiration date', '01/15/80']] }
  ];
  function idsCardHTML(c, i) {
    return '<div class="ic-card idf' + (c.dark ? ' iti-dark' : '') + ' ut2-idsc" data-i="' + i + '" style="--card-bg:' + c.bg + ';--card-ink:' + c.ink + ';--card-tile:' + c.tile + '">' +
      '<div class="idf-head"><div class="idf-title">' + esc(c.t) + '</div><div class="idf-badge">Digital risk: Good</div></div>' +   /* round 39 */
      '<div class="idf-body"><div class="idf-tile" style="--card-tile:' + c.tile + '">' + IDF_MARK + '<i class="idf-wave"></i></div>' +
      '<div class="idf-fields">' + c.f.map(function (x) { return '<div class="idf-f"><span class="idf-k">' + esc(x[0]) + '</span><span class="idf-v">' + esc(x[1]) + '</span></div>'; }).join('') + '</div></div></div>';
  }
  function idStack(host, live) {
    var box = el('<div class="ut2-ids">' + IDS_CARDS.map(idsCardHTML).join('') + '</div>');
    host.appendChild(box);
    var cs = [].slice.call(box.querySelectorAll('.ut2-idsc'));
    var OFF = 250, T = [], running = false, beat = 0;
    /* where each card sits in each beat (Figma: 32 · 24/87 · 24/66/108/150) */
    var AT = [[32, OFF, OFF, OFF], [24, 87, OFF, OFF], [24, 66, 108, 150]];
    function put(i, y, ms, delay, op) {
      var c = cs[i];
      c.style.transition = ms ? 'transform ' + ms + 'ms cubic-bezier(.32,.72,0,1) ' + (delay || 0) + 'ms, opacity ' + ms + 'ms ease ' + (delay || 0) + 'ms' : 'none';
      c.style.transform = 'translateY(' + y + 'px) scale(.75)';
      if (op != null) c.style.opacity = op;
    }
    function go(b, ms) { AT[b].forEach(function (y, i) { put(i, y, ms, b === 2 && i === 3 ? 140 : 0); }); }
    function later(fn, ms) { T.push(setTimeout(fn, ms)); }
    function step() {
      if (!live()) { running = false; return; }
      beat = (beat + 1) % 4;
      if (beat === 1) { go(1, 900); later(step, 2100); }
      else if (beat === 2) { go(2, 900); later(step, 2900); }
      else if (beat === 3) {                                     /* the covers slip back down, last one first */
        [3, 2, 1].forEach(function (i, k) { put(i, OFF, 700, k * 110); });
        put(0, 32, 900, 200);
        later(function () { beat = 0; step(); }, 1300);
      } else { later(step, 1600); }
    }
    function start() {
      T.forEach(clearTimeout); T = []; running = true; beat = 0;
      cs.forEach(function (c, i) { put(i, i ? OFF : 52, 0, 0, i ? 1 : 0); });
      void box.offsetWidth;
      put(0, 32, 900, 60, 1);                                     /* the Primary identity comes in on its own */
      later(step, 1900);
    }
    function kick() { if (!running && live()) start(); }
    cs.forEach(function (c, i) { put(i, AT[2][i] === OFF ? OFF : AT[0][i], 0); });
    return { kick: kick };
  }
  function idSlides(host, live) {
    var pill = function (k, top, w, txt) {
      return '<div class="pl" style="top:' + top + 'px;width:' + w + 'px"><span class="pa">' + SL_IC[k] + '</span><span class="pt">' + txt + '</span></div>';
    };
    var stage = el('<div class="ut2-sl">' +
      '<div class="pn"></div>' +
      pill('email', 51.38, 196.52, esc(REAL_EMAIL)) + pill('card', 92.18, 93.84, '\u2022\u2022\u2022\u2022 4821') + pill('phone', 132.98, 121.04, '281-380-9123') +
      '<div class="bt"><span class="rp"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><span class="bl">Create ' + N.a + ' ' + N.one + '</span></div>' +
      '<div class="tap"></div>' +
      SL_CARDS.map(function (c, i) { return '<div class="sc o" style="--t:' + c[2] + 'px;--d:' + (i * 0.12).toFixed(2) + 's;background:' + c[1] + '"><b>' + c[0] + '</b><i>Risk level<br>Good</i></div>'; }).join('') +
      '<div class="sc me"><b>Sign up for<br>free trials</b><i>Risk level<br>Good</i>' +
        '<span class="art" style="background-image:url(&quot;assets/ID card/Sign up for free trials_cover.png&quot;)"></span>' +
        '<span class="rw"><span>Email</span><span>freetrail423@cloaked.com</span></span><span class="sd">See Details</span></div>' +
      '<div class="ty"><span class="tx"></span><i class="cu"></i></div>' +
      '</div>');
    host.appendChild(stage);
    var ty = stage.querySelector('.ty .tx'), T = [], running = false, on = {};
    var at = function (ms, fn) { T.push(setTimeout(fn, ms)); };
    var add = function () { for (var i = 0; i < arguments.length; i++) { on[arguments[i]] = 1; } stage.className = 'ut2-sl ' + Object.keys(on).join(' '); };
    var TEXT = 'Sign up for\nfree trials', CH = 58;
    /* Christine, 22 Oct (later): smoother — one easy-ease curve throughout,
       things travel rather than pop: the pills rise in out of a blur, the
       panel lifts away, a finger taps the button (a ripple fills it), the
       typed words become the new card's own title as the card grows behind
       them, its contents settle in, then the wallet stacks above it. */
    function play() {
      T.forEach(clearTimeout); T = []; on = {};
      if (!live()) { running = false; stage.className = 'ut2-sl'; return; }
      running = true;
      ty.innerHTML = '';
      stage.className = 'ut2-sl s0';
      void stage.offsetWidth;
      stage.className = 'ut2-sl';
      at(80, function () { add('a1'); });                 /* real ones rise in */
      at(2300, function () { add('a2'); });               /* panel lifts, the button */
      at(3300, function () { add('a3'); });               /* a finger comes */
      at(3900, function () { add('a4'); });               /* tap: ripple fills */
      at(4700, function () { add('a5'); });               /* button and panel go; the field */
      for (var i = 1; i <= TEXT.length; i++) (function (n) {
        at(5150 + n * CH, function () { ty.innerHTML = esc(TEXT.slice(0, n)).replace(/\n/g, '<br>'); });
      })(i);
      var t1 = 5150 + TEXT.length * CH + 550;
      at(t1, function () { add('a6'); });                 /* the card grows; the words become its title */
      at(t1 + 950, function () { add('a7'); });           /* contents settle */
      at(t1 + 2700, function () { add('a8'); });          /* the wallet */
      at(t1 + 5300, function () { add('a9'); });          /* away */
      at(t1 + 6000, play);
    }
    function kick() { if (!running && live()) play(); }
    return { kick: kick };
  }
  window.ut2Slides = function (host) { return idSlides(host, function () { return true; }); };   /* for the harness (GIF capture) */
  /* Figma 9822:114546 (with V3's Identity): "Use unique identity to hide your real one" */
  var WF_T = V3ID ? 'Use unique identity to hide your real one' : 'Create alias based on your situation';
  var WF_CTA = V3ID ? 'Learn more' : 'Get started';
  var WF_TOP = 263;
  function wfStart() {
    if (!DAY1 || !AFTER) return;
    var wf = q('#wfStageFound'), card = q('#wfFoundCard'); if (!wf || !card) return;
    if (!card.__ut2wf) {
      card.__ut2wf = 1;
      document.documentElement.classList.add('ut2-wf3');
      var art = card.querySelector('.wf-found-card-art');
      /* Christine, 22 Oct (Figma 9817:112807 / 9817:112882): the card's art is the identity story — the new slides, in motion */
      if (art) {
        var ab = el('<div class="ut2-slhost ut2-noren' + (V3ID ? ' ids' : '') + '" aria-hidden="true"></div>');
        art.appendChild(ab);
        card.__ut2sl = (V3ID ? idStack : idSlides)(ab, function () {
          var w = q('#welcomeFlow'), st = q('#wfStageFound');
          return !!(w && getComputedStyle(w).display !== 'none' && st && st.classList.contains('active') && !card.classList.contains('collapsing') && !document.hidden);
        });
        card.__ut2kick = card.__ut2sl.kick;
      }
      var t = card.querySelector('.wf-found-card-title'), sb = card.querySelector('.wf-found-card-sub'), cta = card.querySelector('.wf-found-card-cta span');
      if (t) t.textContent = WF_T;
      if (sb) sb.textContent = 'Peace in 5 mins';
      if (cta) cta.textContent = WF_CTA;
      var c2 = card.querySelector('.wf-found-card-cta');
      if (c2) c2.addEventListener('click', function (e) {
        e.stopPropagation(); e.preventDefault();
        /* Christine, 22 Oct: with V3's Identity it is "Learn more" — home, the Identity tab, and its intro page (II-1) over it */
        if (V3ID) {
          if (typeof window.skipToHome === 'function') window.skipToHome();
          goTabSafe('idcard');
          setTimeout(function () { if (window.icIntroPageOpen) window.icIntroPageOpen(); }, 60);
          return;
        }
        if (typeof window.createFromWelcome === 'function') window.createFromWelcome();
      }, true);
    }
    /* the build writes its own copy at init; keep ours */
    var t2 = card.querySelector('.wf-found-card-title');
    if (t2 && t2.textContent !== WF_T) {
      t2.textContent = WF_T;
      var s2 = card.querySelector('.wf-found-card-sub'); if (s2) s2.textContent = 'Peace in 5 mins';
      var c3 = card.querySelector('.wf-found-card-cta span'); if (c3) c3.textContent = WF_CTA;
    }
    /* the Figma's arrow (Icons-action/arrow_Right, 16, #F3F1ED) — thinner than the build's */
    var arw = card.querySelector('.wf-found-card-cta svg:not(.ut2-arw)');
    if (arw) arw.outerHTML = '<svg class="ut2-arw" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13.4038 8L8.67236 12.3672L7.99463 11.6328L11.3882 8.5H3.3335V7.5H11.3882L7.99463 4.36719L8.67236 3.63281L13.4038 8Z" fill="#F3F1ED"/></svg>';
    if (card.__ut2kick) card.__ut2kick();
    /* height: 443 when it fits, less on a short screen */
    if (!card.classList.contains('collapsing') && wf.classList.contains('active')) {
      var frame = document.querySelector('.phone-frame') || document.body;
      var fh = frame.getBoundingClientRect().height, top = card.getBoundingClientRect().top - frame.getBoundingClientRect().top;
      /* Christine, 22 Oct: it grew from small to full as it slid in (laggy) — it was
         being sized from where it was mid-slide. Size it only once it has landed;
         until then it is its full 443. */
      var moving = card.__ut2lt == null || Math.abs(top - card.__ut2lt) > 0.5 || top > fh * 0.6;   /* below the fold = not in yet */
      card.__ut2lt = top;
      if (!moving) WF_TOP = top;                    /* where it lands (263 on every phone so far) */
      var h = Math.round(Math.max(300, Math.min(443, fh - WF_TOP - 16 - 56 - 24)));
      if (card.__ut2h !== h) {
        card.__ut2h = h;
        var tr0 = card.style.transition; card.style.transition = 'none';   /* set, not animated */
        card.style.setProperty('--ut2cardh', h + 'px');
        void card.offsetHeight; card.style.transition = tr0;
        var n = Math.max(2, Math.min(8, Math.floor((h - 184) / 32.4 + 0.01)));
        card.style.setProperty('--ut2rowsh', (n * 32.4 - 1).toFixed(1) + 'px');
        card.style.setProperty('--ut2orb', Math.round((h - 443) * 0.5) + 'px');
      }
    }
  }
  /* Christine, 21 Oct (r16): tapping Later, the start-here title turns into
     Home's own — "Every sign up hands / out the real you." — as the card
     folds into Home's "Create alias" card, so nothing changes at the hand-off. */
  document.addEventListener('click', function (e) {
    if (!AFTER || !DAY1 || !e.target.closest || !e.target.closest('#wfLaterBtn')) return;
    var t = q('#wfFoundTitle'); if (!t || t.__ut2sw) return;
    t.__ut2sw = 1;
    /* and it travels to where Home's greeting really is: the build aims the
       fold at its own layout (greeting text at 162), but this Home sits
       higher, so title and card would jump at the hand-off. Measured, not assumed. */
    var hg = q('#homeGreeting'), ct = t.closest('.wf-found-content');
    if (hg && ct) {
      var dy = (hg.getBoundingClientRect().top + (parseFloat(getComputedStyle(hg).paddingTop) || 0)) - (t.getBoundingClientRect().top + 44);
      if (Math.abs(dy) > 2 && Math.abs(dy) < 200) {
        ct.style.transition = 'transform 1.6s cubic-bezier(0.4, 0, 0, 1)';
        ct.style.transform = 'translateY(' + Math.round(dy) + 'px)';
        setTimeout(function () { ct.style.transition = ''; ct.style.transform = ''; }, 4000);   /* the flow is gone by then */
      }
    }
    try { t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-in', fill: 'forwards' }); } catch (e2) {}
    setTimeout(function () {
      t.innerHTML = 'Every sign up hands<br>out the real you.';
      try { t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out', fill: 'forwards' }); } catch (e3) {}
    }, 230);
  }, true);
  /* Christine, 22 Oct: Day 01's Identities intro (#icIntro) gets the same art
     as the onboarding's start-here card ("for now") — the breathing orb and the
     eight sites whose usersmail@gmail.com turns into cloaked addresses — in a
     353-wide black card in the stage, in place of the brand constellation.
     The intro's copy, Our Solution and its buttons are the build's. */
  function idIntroArt() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    if (!AFTER) return;                                  /* 22 Oct: Day 30's intro too (reopened from the ?) */
    var intro = q('#icIntro'), stage = q('#iciStage'); if (!intro || !stage) return;
    var box = stage.querySelector(':scope > .ut2-icart');
    if (!box) {
      /* Christine, 22 Oct (later): the Identities intro gets its own art — the
         identity story slides (Figma 9817:112882), not the onboarding's orb */
      box = el('<div class="ut2-icart ut2-slhost ut2-noren" aria-hidden="true"></div>');
      stage.appendChild(box);
      intro.classList.add('ut2-icart-on');
      box.__sl = idSlides(box, function () {
        var sc = q('#idcardScreen');
        return !!(sc && sc.classList.contains('open') && visible(box) && box.getBoundingClientRect().height > 40 && !document.hidden);
      });
    }
    var r = stage.getBoundingClientRect();
    if (r.height > 0) {
      var k = Math.max(0.6, Math.min(1.15, (r.width - 32) / 329, (r.height - 16) / 264));
      if (box.__k !== k) { box.__k = k; box.style.setProperty('--slk', k.toFixed(3)); }
    }
    if (box.__sl) box.__sl.kick();
  }
  /* …and no second page: a wheel, a swipe or a tap on the intro no longer moves it on (the buttons show already) */
  ['wheel', 'touchstart', 'touchmove', 'click'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (!AFTER) return;
      var it = e.target.closest && e.target.closest('#icIntro.ut2-icart-on'); if (!it) return;
      if (e.target.closest('button, a, input')) return;
      e.stopPropagation();
    }, { capture: true, passive: true });
  });
  function aliasPageTitle() {
    var l3 = q('#vtL3.open.vt-dark'); if (!l3 || l3.querySelector('.ut2-l3t')) return;
    var hero = l3.querySelector('.vt-hero'), t = ((q('#vtL3Title') || {}).textContent || '').trim();
    if (!t && LASTROW && Date.now() - LASTROW.t < 6000) t = ((LASTROW.row.querySelector('.vt-row-title') || {}).textContent || '').trim();
    if (!hero || !t) return;
    var own = hero.querySelector('.vt-hero-title');                 /* the build already names it (logo items): one title, not two */
    if (own && visible(own) && own.textContent.trim()) return;
    hero.appendChild(el('<div class="ut2-l3t ut2-noren">' + esc(t) + '</div>'));
  }
  /* ═══ Christine, 21 Oct — on a phone (m.html): a two-finger long press
     anywhere opens the menu — Day 01 (onboarding) · Day 30 · Start page ═══ */
  /* ═══ Christine, 21 Oct — press D (desktop) to show the name of the page on
     screen, so QA notes can say which page they mean. The page is read from
     what is actually on top: the elements under a few points of the phone,
     walked up to the ones that fill the screen (a page) or are an overlay's
     sheet/tray. Shown as a pill at the top of the phone for 4s and copied to
     the clipboard. The launcher forwards its own D press (postMessage). ═══ */
  var PAGE_NAMES = {
    welcomeFlow: 'Onboarding', wfStageFound: 'Onboarding · Start here', homeScreen: 'Home', dashboardScreen: 'Dashboard',
    vaultsScreen: 'Vault', vtL1: 'Vault', vtL2: 'Vault list', vtL3: 'Vault item', d1jDetail: 'Vault item', nqDetail: 'Vault item',
    nqForm: 'Add item form', nqGen: 'Generate alias', mkDetail: 'Alias detail', mkEmail: 'Alias email', allItemsScreen: 'All items',
    idcardScreen: 'Identities', icL1: 'Identities', icL2: 'Identity page', icIntro: 'Identities intro', icCreate: 'Create ID card (build)',
    identityScreen: 'Identity', activityScreen: 'Activity', profileScreen: 'Profile', monitorScreen: 'Data removal',
    riskDetailScreen: 'Risk detail', threatScreen: 'Threat', actionsScreen: 'Actions', storyScreen: 'Story', guardScreen: 'Call Guard',
    vpnHomeScreen: 'VPN', vpnFlowScreen: 'VPN setup', journeyScreen: 'Journey', askScreen: 'Ask Cloaked', mailScreen: 'Mailbox',
    msgScreen: 'Messages', callScreen: 'Calls', txScreen: 'Transactions', celebrationScreen: 'Celebration',
    essentialPacksScreen: 'Essential packs', packBrokerScreen: 'Broker pack', companiesScreen: 'Companies', companyScreen: 'Company',
    removalDetailScreen: 'Removal detail'
  };
  var OVL_NAMES = [
    ['ut2-menu', 'Menu tray'], ['ut2-how2', 'How it works tray'], ['ut2-how', 'How to use tray'], ['ut2-ns', 'Name sheet'],
    ['ut2-nid', 'Create identity'], ['ut2-fl2', 'Folder'], ['flist', 'Folders'], ['af', 'Add form (Phone / Email / Card)'],
    ['ut2-oth', 'Others'], ['ut2-bp', 'Pick sheet'], ['ut2-onb', 'Vault onboarding'], ['ut2-vtray', 'Tray'], ['ut2-con', 'Overlay page'],
    ['ut2-sheet', 'Sheet']
  ];
  function pageName() {
    var frame = document.querySelector('.phone-frame') || document.body;
    var fr = frame.getBoundingClientRect();
    var W = Math.min(fr.width, innerWidth), H = Math.min(fr.height, innerHeight);
    var chain = [], seen = [];
    function add(label, el) { if (!label || seen.indexOf(el) >= 0) return; seen.push(el); chain.push({ l: label, el: el }); }
    /* the topmost thing under the phone's middle and upper middle */
    var pts = [[0.5, 0.5], [0.5, 0.25], [0.5, 0.8]], hit = null;
    for (var i = 0; i < pts.length && !hit; i++) {
      var x = fr.left + W * pts[i][0], y = fr.top + H * pts[i][1];
      var e0 = document.elementFromPoint(x, y);
      if (e0 && !(e0.closest && e0.closest('.ut2-pgname'))) hit = e0;
    }
    if (!hit) return 'Unknown page';
    var parts = [];
    for (var e = hit; e && e !== document.body; e = e.parentElement) {
      if (!e.getBoundingClientRect) continue;
      var r = e.getBoundingClientRect(), cls = typeof e.className === 'string' ? e.className : '';
      var big = r.width >= W * 0.85 && r.height >= H * 0.55;
      var ovl = null;
      for (var j = 0; j < OVL_NAMES.length; j++) if ((' ' + cls + ' ').indexOf(' ' + OVL_NAMES[j][0] + ' ') >= 0) { ovl = OVL_NAMES[j][1]; break; }
      if (ovl) {
        if (ovl === 'Create identity') {
          var step = e.classList.contains('two') ? 'Add items (step 2)' : 'What is it for (step 1)';
          ovl += ' · ' + step;
        }
        if (e.classList.contains('alias')) ovl += ' · alias (dark)';
        parts.unshift({ l: ovl, el: e, id: '.' + cls.split(' ')[0] });
      } else if (e.id && (PAGE_NAMES[e.id] || (big && !/(Scroll|Body|Cards|Inner|Wrap|Content|List|Stick|Stage|Canvas)$/.test(e.id)))) {
        parts.unshift({ l: PAGE_NAMES[e.id] || e.id, el: e, id: '#' + e.id });
      }
    }
    /* a page's own title, when it has one, says which instance it is */
    var TSEL = '.vt-hero-title, #vtL3Title, .ut2-l3t, .d1j-det-title, h1, h2, h3, .ic-card-title, .blank-title, .wf-found-title, .hd, .tt';
    var title = '';
    for (var k = parts.length - 1; k >= Math.max(0, parts.length - 1) && !title; k--) {   /* the page on top only: a page under it may have its own title */
      var ts = parts[k].el.querySelectorAll(TSEL);
      for (var m = 0; m < ts.length && !title; m++) if (visible(ts[m]) && !ts[m].closest('.ut2-wv, .ut2-pgname') && (ts[m].textContent || '').trim()) title = (ts[m].textContent || '').replace(/\s+/g, ' ').trim().slice(0, 48);
    }
    /* drop repeats like Vault › Vault */
    var names = [];
    parts.forEach(function (p) { if (names[names.length - 1] !== p.l) names.push(p.l); });
    var tab = (document.querySelector('.bottom-nav .nav-item.active span') || {}).textContent || '';
    if (!names.length && tab) names.push(tab.trim());
    var day = DAY1 ? 'Day 01' : 'Day 30';
    var ids = parts.map(function (p) { return p.id; }).filter(function (v, k, a) { return a.indexOf(v) === k; }).slice(-3).join(' ');
    return day + ' · ' + (names.join(' › ') || 'Unknown page') + (title ? ' — “' + title + '”' : '') + (ids ? '   [' + ids + ']' : '');
  }
  var PGN_T = 0;
  function showPageName() {
    var txt = pageName();
    var host = document.querySelector('.phone-frame') || document.body;
    var b = q('.ut2-pgname');
    if (!b) { b = el('<div class="ut2-pgname ut2-noren" role="status"></div>'); host.appendChild(b); }
    b.textContent = txt;
    b.classList.add('on');
    clearTimeout(PGN_T); PGN_T = setTimeout(function () { b.classList.remove('on'); }, 4000);
    try { if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(function () {}); } catch (e) {}
    return txt;
  }
  window.ut2PageName = pageName; window.ut2ShowPageName = showPageName;
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    if (e.key !== 'd' && e.key !== 'D') return;
    var a = document.activeElement;
    if (a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)) return;
    showPageName();
  });
  window.addEventListener('message', function (e) { if (e.data && e.data.ut2 === 'pageName') showPageName(); });

  var MOBILE = Q.get('ut2m') === '1';
  /* Christine, 21 Oct: on a phone the build must read as a full-screen app.
     Installed to the Home Screen the page is the screen (apple-mobile-web-app-
     capable), and that is unchanged. In a browser tab the toolbars take part of
     the screen while the build sized itself to 100vh (the screen) — so the tab
     bar and every bottom button sat under Safari's toolbar, out of reach. Here
     the frame is sized to the visible viewport instead (innerHeight, re-read on
     resize; not visualViewport, which shrinks under the system keyboard), and
     html.ut2-web trims the status-bar inset the browser already provides (the
     build's --hdr-top, the overlay's --ut2top). */
  (function phoneFit() {
    var coarse = false; try { coarse = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches; } catch (e0) {}
    if (!MOBILE && !coarse) return;
    var standalone = window.navigator.standalone === true;
    try { standalone = standalone || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches); } catch (e1) {}
    var R = document.documentElement;
    /* Christine, 21 Oct (later): opened from the Home Screen there are no
       browser bars, and iOS can report innerHeight without the status bar
       (~59pt short), which left a dark band under the tab bar. There, the
       build's own 100vh (the whole screen) is right — leave it alone. */
    if (standalone && !/[?&]ut2dbg=1\b/.test(location.search)) { R.classList.add('ut2-standalone'); return; }
    R.classList.add('ut2-phone'); if (!standalone) R.classList.add('ut2-web');
    /* The visible height, read four ways and taking the smallest that is
       sane: in-app browsers (Messages, Slack, KakaoTalk — the X / compass
       view) and Safari's own toolbars do not agree on which one excludes the
       bars. A fixed top:0/bottom:0 probe is exactly where the build's fixed tab
       bar is laid out. visualViewport is skipped while a field has focus (the
       system keyboard would shrink the app). */
    var probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;left:0;top:0;bottom:0;width:0;visibility:hidden;pointer-events:none;';
    R.appendChild(probe);
    var last = 0, DBG = Q.get('ut2dbg') === '1', dbg = null;
    function measure() {
      var vv = window.visualViewport, ae = document.activeElement;
      var typing = ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && !ae.readOnly;
      var c = { inner: window.innerHeight, client: R.clientHeight, probe: Math.round(probe.getBoundingClientRect().height),
                vv: vv && !typing ? Math.round(vv.height * (vv.scale || 1)) : 0 };
      var h = 0; for (var k in c) { var v = c[k]; if (v > 300 && (!h || v < h)) h = v; }
      c.h = h; return c;
    }
    function fit() {
      var m = measure(), h = m.h;
      if (dbg) dbg.textContent = 'inner ' + m.inner + ' · client ' + m.client + ' · probe ' + m.probe + ' · vv ' + m.vv + ' → ' + h +
        ' · ' + (standalone ? 'home screen' : 'browser') + ' · sab ' + getComputedStyle(R).getPropertyValue('--sab').trim() + ' · ' + (((document.querySelector('script[src*="ut2.js"]') || {}).src || '').split('v=')[1] || '');
      if (!h || h === last) return; last = h;
      R.style.setProperty('--ut2vh', h + 'px');
      if (!standalone) try { window.scrollTo(0, 0); } catch (e2) {}
    }
    if (DBG) {
      /* ?ut2dbg=1 — what this phone reports, for a screenshot */
      dbg = document.createElement('div');
      dbg.style.cssText = 'position:fixed;left:8px;right:8px;top:50%;z-index:2147483647;padding:8px 10px;border-radius:10px;background:rgba(0,0,0,.82);color:#7CFC9A;font:12px/1.35 ui-monospace,Menlo,monospace;pointer-events:none;';
      document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(dbg); fit(); });
      if (document.body) document.body.appendChild(dbg);
    }
    fit();
    window.addEventListener('resize', fit);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
    document.addEventListener('focusout', function () { setTimeout(fit, 250); });
    window.addEventListener('orientationchange', function () { setTimeout(fit, 60); setTimeout(fit, 400); });
    window.addEventListener('pageshow', function () { setTimeout(fit, 50); });
    setTimeout(fit, 300); setTimeout(fit, 1000); setTimeout(fit, 2500);
  })();
  function menuURL(day) {
    var ps = new URLSearchParams(location.search);
    ps.set('tab', 'home'); ps.delete('intro'); ps.delete('ut2go'); ps.set('ut2m', '1'); ps.delete('ut2pv');
    return '../' + day + '/app.html?' + ps.toString();
  }
  function openMenu() {
    if (q('.ut2-menu')) return;
    var host = document.querySelector('.phone-frame') || document.body;
    var t = el('<div class="ut2-vtray ut2-menu ut2-noren"><div class="dim"></div>' +
      '<div class="ut2-onb-banner vtc" role="dialog" aria-label="Menu">' +
      '<button type="button" class="x" aria-label="Close">' + X_SVG + '</button>' +
      '<h3>Prototype</h3>' +
      '<div class="mrows">' +
        '<button type="button" class="mrow" data-day="DayOne"><b>Day 01</b><i>Onboarding first</i></button>' +
        '<button type="button" class="mrow" data-day="Day30"><b>Day 30</b><i>A month in</i></button>' +
        '<button type="button" class="mrow" data-home="1"><b>Start page</b><i>Pick a build</i></button>' +
      '</div></div></div>');
    host.appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('on'); }); });
    var close = function () { t.classList.remove('on'); setTimeout(function () { t.remove(); }, 400); };
    t.querySelector('.x').addEventListener('click', close);
    t.querySelector('.dim').addEventListener('click', close);
    t.addEventListener('click', function (e) {
      var b = e.target.closest('.mrow'); if (!b) return;
      if (b.dataset.home) location.href = '../../m.html';
      else location.href = menuURL(b.dataset.day);
    });
  }
  (function () {
    var tm = null, x0 = 0, y0 = 0;
    var cancel = function () { if (tm) { clearTimeout(tm); tm = null; } };
    document.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 2) { cancel(); return; }
      x0 = (e.touches[0].clientX + e.touches[1].clientX) / 2; y0 = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      cancel(); tm = setTimeout(function () { tm = null; if (MOBILE) location.href = '../../m.html'; else openMenu(); }, 650);   /* Christine, 21 Oct: on a phone it goes straight back to the start page */
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (!tm || e.touches.length !== 2) return;
      var x = (e.touches[0].clientX + e.touches[1].clientX) / 2, y = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      if (Math.abs(x - x0) > 14 || Math.abs(y - y0) > 14) cancel();
    }, { passive: true });
    document.addEventListener('touchend', cancel, { passive: true });
    document.addEventListener('touchcancel', cancel, { passive: true });
    window.ut2Menu = openMenu;   /* for the harness */
  })();
  /* Christine, 21 Oct (round 7): the orange identity ("Hide my info", and the
     build's default colour for a new card) moves to mint from the identity
     palette (Figma identity/mint-01) — orange is the alias colour now. */
  var MINT = '#8ecfc1';
  function mintify() {
    if (V3ID) return;                                    /* the Identity tab is V3's */
    if (!AFTER) return;
    var els = document.querySelectorAll('#idcardScreen [style*="#ff550c"], #idcardScreen [style*="#FF550C"], #icDetailCard [style*="#ff550c"], .ic-fly [style*="#ff550c"], #homeScreen .id-card[style*="#ff550c"]');
    for (var i = 0; i < els.length; i++) {
      var st = els[i].getAttribute('style');
      els[i].setAttribute('style', st.replace(/#ff550c/gi, MINT));
    }
  }
  var VT_ROWS = [['vt-login', 'Passwords', '*********'], ['vt-phone', 'Phone', '832-398-8012'], ['vt-card', 'Card', '.1289'],
                 ['vt-email', 'Email', REAL_EMAIL], ['vt-address', 'Work', '39 Greenpoint ave, Brooklyn 11201']];
  function vtEligible() {
    if (!AFTER || !DAY1 || VTRAY.done || VTRAY.busy) return false;   /* 21 Oct: on the tour slides too (was skipped while GO ran a scenario) */
    var sc = q('#vaultsScreen');
    if (!sc || !sc.classList.contains('open')) return false;
    /* …but only over the Vault LIST: a tour that has already opened a flow or a page waits until you are back on it */
    if (q('.ut2-nid, .ut2-con.on, .ut2-bp, .ut2-oth.on, #nqForm.open, #nqPick.open, #vtL3.open, #d1jForm.on, .d1j-flow.on, .d1j-trayw.on')) return false;
    if (q('#vtAdd.open, #d1jAdd.on, .ut2-vt3, .ut2-pick, #vtL3.open, #d1jDetail.on, .ut2-con, .ut2-how2')) return false;   /* not over an item's page or a flow */
    return true;
  }
  /* Christine, 21 Oct (later): not the moment Vault opens — about a second on
     the list first, then the tray slides up (and the dim fades in under it).
     Leaving the list in that second puts it off until the next visit. */
  function vaultTray() {
    if (VONB2) return;                                   /* V2: V3's own tray greets the Vault */
    if (VTRAY.pend || !vtEligible()) return;
    VTRAY.pend = setTimeout(function () {
      VTRAY.pend = 0;
      if (!vtEligible()) return;
      showVaultTray();
    }, 1000);
  }
  function showVaultTray() {
    VTRAY.done = true;
    /* Christine, 21 Oct (Figma 9734:107810): the first time Day 01's Vault opens,
       a tray: a mini Vault (Passwords · Phone · Card · Email · Work), "A password
       manager that protects all of you", one line, Learn more (the Vault intro,
       ONB). A tap outside closes it. Replaces the in-list "What's vault" card. */
    var ROWS = VT_ROWS;
    var host = document.querySelector('.phone-frame') || document.body;
    var t = el('<div class="ut2-vt3 ut2-noren"><div class="dim"></div>' +
      '<div class="sh" role="dialog" aria-label="What’s vault">' +
        '<div class="mini">' + ROWS.map(function (r) {
          return '<div class="r"><img src="../ut2/img/' + r[0] + '.svg" alt=""><span class="t"><b>' + esc(r[1]) + '</b><i>' + esc(r[2]) + '</i></span></div>';
        }).join('') + '</div>' +
        '<h3>A password manager that protects all of you</h3>' +
        '<p>Logins, emails, phone numbers and cards. Your real ones and your aliases, side by side.</p>' +
        '<button type="button" class="ok">Learn more</button>' +
      '</div></div>');
    host.appendChild(t);
    document.documentElement.classList.add('ut2-vtrayon');   /* a tour's marks wait under it */
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('on'); }); });
    var close = function () { t.classList.remove('on'); document.documentElement.classList.remove('ut2-vtrayon'); setTimeout(function () { t.remove(); }, 420); };
    t.querySelector('.dim').addEventListener('click', close);
    t.querySelector('.ok').addEventListener('click', function () {
      close();
      setTimeout(function () { if (ONB.open) ONB.open(); }, 120);
    });
  }
  var VT_WIP = [{ h: 'Share an alias, not your number', p: 'lorem ipsum' },
                { h: 'Calls, messages, emails, transactions all happen here', p: 'lorem ipsum' }];
  function mountOnb() {
    if (VONB2) return;
    if (!AFTER) return;              /* 22 Oct: Day 30 too — hidden until the Vault's ? reopens it */
    if (!DAY1 && !ONB.el && !ONB.want) return;
    mountBanner();
    var sc = q('#vaultsScreen');
    /* Christine, 19 Oct: the tab bar stays, so the other tabs are one tap away.
       It picks its theme by sampling under itself on window scroll; nudge it
       each time the dark page comes into view. */
    var showing = !!(sc && sc.classList.contains('open') && ONB.el && !ONB.el.classList.contains('done'));
    if (showing && !ONB.nav) { ONB.nav = true; setTimeout(function () { window.dispatchEvent(new Event('scroll')); }, 80); setTimeout(function () { window.dispatchEvent(new Event('scroll')); }, 700); }
    else if (!showing) ONB.nav = false;
    /* the live hero runs only while the intro is on screen. The wallet's own
       renderWallet() stops the build whenever it repaints an empty wallet, so
       this also restarts it if that happens underneath us. */
    var bd = ONB.el && ONB.el.querySelector('.hero #iciBuild');
    if (bd && window.iciBuild) {
      if (showing && !bd.classList.contains('on')) { window.iciBuild.start(); bd.style.opacity = '1'; }
      else if (!showing && bd.classList.contains('on')) window.iciBuild.stop();
      else if (showing && bd.style.opacity !== '1') bd.style.opacity = '1';
    }
    if (!sc || sc.querySelector(':scope > .ut2-onb')) return;
    var o = el('<div class="ut2-onb embed ut2-noren" role="region" aria-label="Vault intro" data-nav-theme="black">' +
      '<div class="hdr"><button type="button" class="x" aria-label="Close">' + X_SVG + '</button><span class="ttl">Vault</span><button type="button" class="skip">Skip Intro</button></div>' +
      '<div class="scr">' +
        '<div class="hero"><img src="../ut2/img/onb-hero.jpg" alt=""></div>' +
        '<div class="intro"><h1>A password manager that protects all of you</h1>' +
        '<p>Logins, emails, phone numbers and cards. Your real ones and your aliases, side by side.</p></div>' +
        /* Christine, 22 Oct (Figma 9822:113803): two cards, art still WIP (a white "WIP" tag, as in the Figma) */
        VT_WIP.map(function (c) {
          return '<section class="card wip"><div class="vis"><span class="wipl">WIP</span></div><h2>' + c.h + '</h2><p>' + c.p + '</p></section>';
        }).join('') +
        '<button type="button" class="cta">Go to my Vault</button>' +
      '</div></div>');
    var scr = o.querySelector('.scr'), hdr = o.querySelector('.hdr');
    function close() { o.classList.add('done'); setTimeout(function () { window.dispatchEvent(new Event('scroll')); }, 60); }
    function top() { scr.scrollTop = 0; [].forEach.call(o.querySelectorAll('.card'), function (c) { c.classList.remove('play'); }); }
    ONB.open = function () { o.classList.remove('done'); top(); };
    ONB.go = function () { top(); };
    ONB.el = o;
    o.querySelector('.x').addEventListener('click', close);
    o.querySelector('.skip').addEventListener('click', close);
    o.querySelector('.cta').addEventListener('click', close);
    /* header gets its ground once the hero has scrolled under it */
    scr.addEventListener('scroll', function () {
      var on = scr.scrollTop > 24;
      if (on !== hdr.classList.contains('solid')) hdr.classList.toggle('solid', on);
    }, { passive: true });
    /* each card's motion plays as it comes into view, and again on the way back */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var c = e.target.parentNode;
          if (e.intersectionRatio >= 0.85 && !c.classList.contains('play')) c.classList.add('play');
          else if (e.intersectionRatio === 0 && c.classList.contains('play')) c.classList.remove('play');
        });
      }, { root: scr, threshold: [0, 0.85] });
      [].forEach.call(o.querySelectorAll('.card .vis'), function (v) { io.observe(v); });
    } else [].forEach.call(o.querySelectorAll('.card'), function (c) { c.classList.add('play'); });
    setInterval(function () { if (!o.classList.contains('done')) rotChips(o); }, 250);
    sc.appendChild(o);
    /* Christine, 19 Oct: the hero moves, as it did on the first intro's second
       page — the build's own pinstripes, gold wash, string fan and the email /
       number being rewritten into cloaked ones (iciBuild in day01.js). The
       intro is hidden after, so its stripes and build are moved in here and
       driven by the same code; the Figma still stays as the fallback. */
    /* Christine, 22 Oct (later): the hero is the tray's own picture — the mini
       Vault (Passwords · Phone · Card · Email · Work) — not the build's gold
       string fan; the intro continues what the tray showed. */
    var hero = o.querySelector('.hero');
    if (hero) {
      hero.classList.add('mini');
      hero.innerHTML = '<div class="mini">' + VT_ROWS.map(function (r) {
        return '<div class="r"><img src="../ut2/img/' + r[0] + '.svg" alt=""><span class="t"><b>' + esc(r[1]) + '</b><i>' + esc(r[2]) + '</i></span></div>';
      }).join('') + '</div>';
    }
    if (INTRO !== 'first' || (GO && GO !== 'v22')) o.classList.add('done');
  }

  /* Christine, 22 Oct: the Identities tab never lit up — the build finds the
     button by aria-label "ID card", and we rename it. Light it ourselves. */
  function navActive() {
    var nav = q('.bottom-nav'); if (!nav) return;
    var on = function (id) { var e = document.getElementById(id); return !!(e && e.classList.contains('open')); };
    var want = on('activityScreen') ? 'activity' : on('vaultsScreen') ? 'vaults' : on('idcardScreen') ? 'idcard' : on('profileScreen') ? 'profile' : on('monitorScreen') ? '' : 'home';
    [].forEach.call(nav.querySelectorAll('.nav-item'), function (b) {
      var oc = b.getAttribute('onclick') || '', m = /goTab\('(\w+)'\)/.exec(oc);
      var hit = m ? m[1] === want : false;
      if (b.classList.contains('active') !== hit) b.classList.toggle('active', hit);
    });
  }
  function decorate() {
    if (!AFTER) return;
    navActive();
    skipNqGen(); addGenBanner(); addTrayCaps(); addSubs();
    addRowTags(); addPurposeSkip(); idCardPicksOnly(); aliasFlow(); addBreakdownLink(); aliasTab(); d1Tabs(); d1Fwd(); homeRisk(); d1jMark(); flatAll(); fwdOut(); folderList(); pinButton(); faqTop(); othBankRow(); vaultQ(); vaultFoldBtn(); avTxTab(); if (AVTX) avTxApply(); addKeywordHint(); labelGroupButton(); addFolderTag(); vaultToggle(); mountOnb(); vaultTray(); mintify(); idDetailFlat(); openSpin(); aliasPageTitle(); wfStart(); idIntroArt(); fitMarks();
  }

  /* ═════════ review overlay: ring what changed ═════════ */
  var marks = [];
  function clearMarks() { marks.forEach(function (m) { clearInterval(m.t); m.el.remove(); }); marks = []; }
  function mark(target, label, opt) {
    opt = opt || {};
    var m = el('<div class="ut2-mark ' + (AFTER ? 'after' : 'before') + (opt.below ? ' below' : '') + '"><i></i></div>');
    m.querySelector('i').textContent = label;
    document.body.appendChild(m);
    var rec = { el: m };
    function place() {
      var r;
      if (typeof target === 'function') r = target();
      else { var t = typeof target === 'string' ? document.querySelector(target) : target; r = t && t.getBoundingClientRect(); }
      if (!r || !r.width) { m.style.display = 'none'; return; }
      var pad = opt.pad == null ? 4 : opt.pad;
      m.style.display = 'block';
      m.style.left = (r.left - pad) + 'px'; m.style.top = (r.top - pad) + 'px';
      m.style.width = (r.width + pad * 2) + 'px'; m.style.height = (r.height + pad * 2) + 'px';
      var tag = m.firstChild;
      if (r.left + r.width / 2 > innerWidth * 0.6) { tag.style.left = 'auto'; tag.style.right = '-2px'; }
      else { tag.style.left = '-2px'; tag.style.right = 'auto'; }
    }
    place(); rec.t = setInterval(place, 150);
    marks.push(rec);
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function q(s) { return document.querySelector(s); }
  function byText(sel, re) {
    var l = document.querySelectorAll(sel);
    for (var i = 0; i < l.length; i++) if (re.test(l[i].textContent)) return l[i];
    return null;
  }
  function visible(e) { if (!e) return false; var r = e.getBoundingClientRect(); return r.width > 0 && r.top < innerHeight && r.bottom > 0; }
  function rect(l, t, w, h) { return function () { return { left: l, top: t, width: w, height: h }; }; }

  async function openAddSheet() { openVaultAdd(); await wait(900); }
  async function openEmailTray() {
    await openAddSheet();
    var tile = byText(DAY1 ? '#d1jAdd .d1j-add-cell' : '#vtAdd .vt-tile', /^\s*Email\s*$/);
    if (tile) tile.click();
    await wait(900);
  }
  function trayRow(which) {
    if (DAY1) return q('.d1j-tray-row[data-tray="' + (which === 'alias' ? 'alias' : 'own') + '"]');
    return q('#nqPick [data-nqpick="' + (which === 'alias' ? 'alias' : 'real') + '"]');
  }
  async function playCreate() {
    try { icOpenCreate(); } catch (e) {}
    await wait(900);
    for (var i = 0; i < 24; i++) {
      var t = q('#iccTitle'); if (t && /ready to use/i.test(t.textContent)) break;
      var chips = document.querySelectorAll('#iccChips .icc-chip');
      var anyOn = document.querySelector('#iccChips .icc-chip.on, #iccChips .icc-chip[aria-pressed="true"], #iccChips .icc-chip.sel');
      var next = q('#iccNext'), ghost = q('#iccGhost');
      if (chips.length && visible(chips[0]) && !anyOn && next && next.disabled) { chips[1] ? chips[1].click() : chips[0].click(); }
      else if (ghost && visible(ghost) && /skip/i.test(ghost.textContent)) ghost.click();
      else if (next && visible(next) && !next.disabled) next.click();
      await wait(1100);
    }
  }

  function firstVisible(sel) {
    var l = document.querySelectorAll(sel);
    for (var i = 0; i < l.length; i++) { var r = l[i].getBoundingClientRect(); if (r.width && r.top > 120 && r.bottom < innerHeight - 90) return l[i]; }
    return null;
  }
  function rowById(id) { return q('#vaultsScreen .vt-row[data-item="' + id + '"]'); }
  async function showRow(id) {
    var r = rowById(id); if (!r) return null;
    r.scrollIntoView({ block: 'center' }); await wait(500); return r;
  }
  async function openCard(name) {
    var c = byText('#icL1 .ic-card-name, #icL1 .ic-card-head', name);
    if (c) { (c.closest('.ic-card') || c).click(); await wait(1600); }
  }
  async function vaultCreate() {
    await openVaultAlias(); await wait(1800);
    var t = q('#nqTitle') || q('#d1jAeemail input');
    if (t) { t.focus(); t.value = 'Newsletters'; t.dispatchEvent(new Event('input', { bubbles: true })); }
    await wait(400);
    var save = DAY1 ? q('#d1jAeemail .d1j-ae-next') : q('#nqSave');
    if (save && !save.disabled) save.click();
  }
  async function pickToReady() {
    for (var k = 0; k < 2; k++) {                        /* phone, then email */
      var add = document.querySelectorAll('#iccItems [data-pick]')[k];
      if (!add) break;
      add.click(); await wait(1100);
      var opts = document.querySelectorAll('.icc-sheet-scroll button:not(.gen)');
      var pick = null;
      for (var i = 0; i < opts.length; i++) if (visible(opts[i]) && !opts[i].classList.contains('ut2-hide')) { pick = opts[i]; if (AFTER || i > 0) break; }
      if (pick) pick.click();
      await wait(1100);
    }
    var n = q('#iccNext'); if (n && !n.disabled) n.click();
  }
  async function toStep(re) {
    try { icOpenCreate(); } catch (e) {}
    await wait(900);
    for (var i = 0; i < 12; i++) {
      var t = q('#iccTitle'); if (t && re.test(t.textContent)) return true;
      var chips = document.querySelectorAll('#iccChips .icc-chip');
      var next = q('#iccNext');
      var items = q('#iccItems');
      if (chips.length && visible(chips[0]) && next && next.disabled) chips[1] ? chips[1].click() : chips[0].click();
      else if (items && visible(items)) { await pickToReady(); await wait(5000); continue; }
      else if (next && visible(next) && !next.disabled) next.click();
      await wait(1000);
    }
    return false;
  }

  var SCEN = {
    v07: async function () {
      await showRow('ph2');
      mark(rowById('ph2'), AFTER ? 'Tagged: Alias' : '…and an alias look the same', { pad: 0, below: true });
      var own = rowById('ph1');
      var all = document.querySelectorAll('#vaultsScreen .vt-row[data-item="ph1"]');
      for (var i = 0; i < all.length; i++) if (visible(all[i])) own = all[i];
      mark(own, AFTER ? 'Your own info: no tag' : 'Your real number…', { pad: 0 });
    },
    v08: async function () {
      if (DAY1) return;
      await showRow('em11');
      var r = rowById('em11'); if (r) r.click();
      await wait(900);
      if (AFTER) mark('.ut2-fwdrow', 'Forward to, out in the open', { pad: 2 });
      else mark('[data-lgsee], #nqDSee', 'Forward to is hidden under here', { pad: 3 });
    },
    v09: async function () {
      if (DAY1) {
        await toStep(/ready to use/i);
        mark('#iccRisk', AFTER ? 'New card: "New", not "Good"' : 'Brand-new card already "Good"', { pad: 4 });
        return;
      }
      await openCard(/Free trials/);
      mark('.ic-alert', AFTER ? 'Meaning + one action' : 'Says what, not what to do', { pad: 3, below: true });
    },
    v10: async function () {
      await openVaultAlias(); await wait(1700);
      var w = q('#nqWordsBtn');
      if (!w || !visible(w)) { var l = document.querySelectorAll('button'); for (var i = 0; i < l.length; i++) if (visible(l[i]) && /Include special words/i.test(l[i].textContent)) { w = l[i]; break; } }
      if (w) w.click();
      await wait(1100);
      if (AFTER) mark('.ut2-kw', 'Says where the words go', { pad: 4 });
      else mark(q('.nq-fwords') && visible(q('.nq-fwords')) ? '.nq-fwords' : '.d1j-ae-wbox', 'Doesn’t say the words end up in the address', { pad: 4, below: true });
    },
    a1: async function () {
      mark('#avStickTabs', AFTER ? 'All · Inbox · Urgent · Transactions' : 'All · Unread · ' + (DAY1 ? 'Compromised' : 'Critical'), { pad: 2, below: true });
      if (!AFTER) mark('.av-hero', 'Total, three stat tiles, See breakdown', { pad: 4, below: true });
    },
    v14: async function () {
      mark('#homeGreeting', AFTER ? 'New opening line' : '"Biggest difference."', { pad: 4 });
      var card = byText('.d1j-tx', /alias|yourself/i);
      if (card) mark(card.closest('button, .d1j-card, div') || card, AFTER ? 'New hook' : '"Hide your real ones"', { pad: 6, below: true });
    },
    t13: async function () {
      var fab = q('#vaultsScreen .vt-fab'); if (fab) fab.click();
      await wait(1100);
      var tile = byText('#vtAdd .vt-tile', /^\s*Password\s*$/); if (tile) tile.click();
      await wait(1400);
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      if (window.kbdHide) window.kbdHide();
      var sc = q('#nqFormScroll'); if (sc) sc.scrollTop = 9999;
      await wait(500);
      mark(AFTER ? '.ut2-ft' : '#nqForm [data-nqtoast="Select ID Card"]', AFTER ? 'Tap to add a folder or tag' : 'ID card row in every create form', { pad: 0, below: true });
    },
    t19: async function () {
      if (TOGGLE) {
        mark('#vaultsScreen .ut2-btog', 'Items | Folders, inside the Vault', { pad: 4 });
        mark(document.querySelector('.bottom-nav .nav-item[onclick*="\'vaults\'"]'), 'No ID card tab', { pad: 2 });
      } else mark(document.querySelector('.bottom-nav .nav-item[onclick*="idcard"]'), 'A tab of its own', { pad: 2 });
    },
    v22: async function () {
      if (AFTER && ONB.el && INTRO === 'outside') {
        await wait(400);
        mark('.ut2-sub[data-sub="vault"]', 'Only a line here; the alias card stays on Home', { pad: 3, below: true });
      } else if (AFTER && ONB.el && BANNER) {
        await wait(400);
        mark('.ut2-vcard, .ut2-onb-banner', 'Home’s alias card, now in the Vault: tap for the intro', { pad: 4, below: true });
      } else if (AFTER && ONB.el) {
        ONB.open();
        await wait(500);
        mark('.ut2-onb.embed .intro h1', 'First thing in the Vault: one page that scrolls', { pad: 6, below: true });
      } else {
        await wait(800);
        var h = document.querySelector('#iciA h1, .ici-page.on h1');
        mark(h || '#icIntro', 'Two-page intro, one CTA', { pad: 6, below: true });
      }
    },
    t11: async function () {
      var card = byText('.d1j-tx', /alias|yourself/i);
      if (card) mark(card.closest('button, .d1j-card, div') || card, AFTER ? 'First action: create an alias' : '"Create alias" as one card among many', { pad: 6, below: true });
    },
    c1: async function () {
      var tabBtn = document.querySelectorAll('.bottom-nav .nav-item')[3];
      if (DAY1) { mark(AFTER ? '#icL1 .blank-title' : '.ici-brand', AFTER ? 'Renamed' : '"ID cards"'); }
      else { mark('.blank-title', AFTER ? 'Renamed' : '"ID card"'); }
      mark(tabBtn, AFTER ? 'Tab renamed' : 'Tab: "ID card"', { pad: 2 });
    },
    c2: async function () {
      mark('#vtL2Title', AFTER ? (TOGGLE ? 'One word: Vaults' : 'One word: Vault') : (DAY1 ? '"Vaults"' : 'No explanation'));
      if (AFTER) mark('.ut2-sub[data-sub="vault"]', 'One-line explanation', { below: true, pad: 2 });
      if (DAY1) mark('#vaultsScreen input[placeholder]', AFTER ? 'Was "Identity name"' : 'Search says "Identity name"', { below: true });
    },
    /* Christine, 19 Oct: after, there is no Email / Phone tray any more —
       "Add an item" already splits it (05): Hide my info (alias) first,
       Contact (your own) apart. So 03 and 04 ring those rows instead. */
    c3: async function () {
      if (AFTER) { await SCEN.c6(); return; }   /* 21 Oct: new aliases are made in the ID card flow */
      await openEmailTray();
      mark(trayRow('alias'), 'Alias option comes second', { pad: 0 });
    },
    c4: async function () {
      if (AFTER) {
        await openAddSheet();
        mark(DAY1 ? '#d1jAdd .ut2-add-row.phone' : '#vtAdd .ut2-add-row.phone', 'Your own Phone and Email, rows of their own', { pad: 4, below: true });
        return;
      }
      await openEmailTray();
      mark(trayRow('own'), '"Add an email" sits right next to alias', { pad: 0, below: true });
    },
    c6: async function () {
      if (AFTER) {   /* 21 Oct: aliases are made from the ID card page — open the flow at its new-alias step */
        if (CARDV) IVW.next = 'cards';
        goTabSafe('idcard'); await wait(900);
        openIdFlow(); await wait(700);
        var t = q('.ut2-nid textarea'); if (t) { t.value = 'Free trials'; t.dispatchEvent(new Event('input')); }
        await wait(300); var g = q('.ut2-nid .p1 .go'); if (g) g.click();
        await wait(700); mark('.ut2-nid .rows', 'New aliases are picked here', { pad: 2 });
        return;
      }
      await openAddSheet();
      mark(DAY1 ? '#d1jAdd .d1j-add-grid' : '#vtAdd .vt-add-grid', 'Alias is hidden inside each tile', { pad: 4 });
    },
    c7: async function () {
      await vaultCreate();
      if (AFTER) {
        for (var i = 0; i < 20 && !visible(q('.ut2-how.on')); i++) await wait(300);
        await wait(500);
        mark('.ut2-how', 'New: a "how it works" step', { pad: 2 });
      } else {
        for (var j = 0; j < 30 && !createdEl(); j++) await wait(500);
        await wait(1200);
        mark(createdEl() || '#vaultsScreen', 'Created. Nothing says where mail goes', { pad: 6, below: true });
      }
    },
    v21: async function () {
      await vaultCreate();
      if (AFTER) {
        var page = function () { var d = q('#nqDetail.open') || q('#d1jDetail.on'); return d && visible(d) ? d : null; };
        for (var i = 0; i < 20 && !page(); i++) await wait(300);
        for (var k = 0; k < 12 && !q('.ut2-how.on'); k++) await wait(250);
        await wait(600);
        var x = q('.ut2-how.on .ut2-got'); if (x) x.click();
        await wait(600);
        var p = page();
        mark(p ? (p.querySelector('.nq-dav, .d1j-det-av, [class*="dav"], [class*="det-av"]') || p) : '#vaultsScreen', 'Opens on the item\'s own page', { pad: 6 });
      } else {
        for (var j = 0; j < 30 && !createdEl(); j++) await wait(500);
        await wait(1200);
        mark(createdEl() || '#vaultsScreen', 'An in-between "created" page, then Done', { pad: 6, below: true });
      }
    },
    v20: async function () {
      async function until(fn, ms) { for (var t = 0; t < ms; t += 150) { if (fn()) return true; await wait(150); } return false; }
      var created = function () { var c = q('#icCreate'); return c && c.classList.contains('open'); };
      var fab;
      if (DAY1 && AFTER) fab = q('#idcardScreen .ic-fab');   /* 19 Oct: no intro after, straight to the wallet */
      else if (DAY1) {                  /* Day 1 has no cards yet: the intro's CTA is the way in */
        var cue = q('#iciCue'); if (cue && visible(cue)) { cue.click(); await wait(1500); }
        fab = byText('.ici-btn', /Group aliases|Create/);
      } else fab = q('#idcardScreen .ic-fab') || q('.ic-fab');
      if (!created() && fab && visible(fab)) {
        mark(fab, AFTER ? 'Groups, doesn’t create' : '+ makes new aliases', { pad: 4 });
        await wait(2600); clearMarks();
        if (!created()) fab.click();
      }
      if (!created()) { try { icOpenCreate(); } catch (e) {} }
      await until(function () { var c = q('#iccChips'); return c && visible(c); }, 4000);
      await wait(500);
      var chips = document.querySelectorAll('#iccChips .icc-chip'); if (chips[1]) chips[1].click();
      await wait(300); var n = q('#iccNext'); if (n) n.click();
      if (!AFTER) { await until(function () { return visible(q('#iccReco')); }, 4000); await wait(400); mark('#iccReco', 'ID card makes new aliases here', { pad: 2 }); return; }
      await until(function () { var i = q('#iccItems'); return i && visible(i); }, 4000);
      await wait(600);
      var add = q('#iccItems [data-pick="email"]') || q('#iccItems [data-pick]'); if (add) add.click();
      await until(function () { return visible(q('.ut2-vhint')); }, 3000);
      mark('.ut2-vhint', 'Pick only. New aliases live in the Vault', { pad: 4, below: true });
    }
  };

  async function runGo() {
    if (!SCEN[GO]) return;
    await wait(DAY1 ? 1400 : 900);
    VTRAY.busy = true;   /* the Day 01 Vault tray waits for the scenario to land */
    try { await SCEN[GO](); } catch (e) { console.warn('ut2 scenario', GO, e); }
    VTRAY.busy = false;
    try { parent.postMessage({ ut2: 'ready', go: GO, mode: MODE }, '*'); } catch (e) {}
  }
  /* rings go the moment you touch the phone */
  document.addEventListener('pointerdown', function () { if (marks.length) setTimeout(clearMarks, 0); }, true);
  window.ut2 = { mark: mark, clear: clearMarks, mode: MODE, name: NAME };

  function start() {
    if (AFTER) {
      sweep(document.body);
      decorate();
      var busy = false;
      new MutationObserver(function (list) {
        if (busy) return; busy = true;
        try {
          for (var i = 0; i < list.length; i++) {
            var r = list[i];
            if (r.type === 'characterData') fixText(r.target);
            else if (r.type === 'attributes') fixAttrs(r.target);
            else for (var j = 0; j < r.addedNodes.length; j++) sweep(r.addedNodes[j]);
          }
          decorate();
        } finally { busy = false; }
      }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'placeholder', 'class'] });
      /* some steps settle without a DOM change (a transform ends); a slow tick catches them */
      setInterval(decorate, 700);
    }
    runGo();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
