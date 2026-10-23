/* Vault onboarding V2 (Christine, 23 Oct · Figma 9890:138727). Loaded by
   ut2.js with &ut2vonb=n, after Yuan's v3vonb bundle: her tray stays, and its
   Learn more (and the Vault's ?) open this page instead of hers.
   Three scroll stops, each scene plays once you land on it (V3's rule):
     0 · "A password manager…"  + → five empty rows → kinds → your items → the list scrolls → three
     1 · "Share an alias…"       aliases slide over the real three
     2 · "Calls, messages…"      one alias on top, a thread, what reaches it — phone → email → card, looping */
(function () {
  var host = document.getElementById('vaultsScreen'); if (!host || document.getElementById('vtnPage')) return;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EZ = 'cubic-bezier(.32,.72,0,1)';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function logo(f) { return 'assets/logo/' + encodeURIComponent(f); }

  /* glyphs (Figma Icon-large-vault, 36 box) */
  var P = {
    phone: 'M23.1035 5.61279C24.24 5.61279 25.1621 6.62789 25.1621 7.88037V28.0386C25.162 29.2909 24.2399 30.3062 23.1035 30.3062H12.8154C11.679 30.3062 10.757 29.2909 10.7568 28.0386V7.88037C10.7568 6.6279 11.6789 5.61279 12.8154 5.61279H23.1035ZM16.208 7.51221C15.6836 7.51227 15.2589 7.93706 15.2588 8.46143C15.2588 8.98593 15.6835 9.41155 16.208 9.41162H19.71C20.2345 9.41162 20.6602 8.98597 20.6602 8.46143C20.66 7.93702 20.2344 7.51221 19.71 7.51221H16.208Z',
    email: 'M19.1128 31.4286C16.9381 31.4286 14.9545 31.109 13.1617 30.4698C11.369 29.8412 9.82553 28.9348 8.53136 27.7508C7.2372 26.5668 6.24005 25.1418 5.53993 23.4758C4.83981 21.8098 4.48975 19.9395 4.48975 17.8649V17.8491C4.48975 15.8583 4.8239 14.0456 5.49219 12.4111C6.1711 10.7765 7.12582 9.36723 8.35633 8.18323C9.58685 6.99922 11.0507 6.08763 12.748 5.44848C14.4559 4.80932 16.3335 4.48975 18.3808 4.48975C21.0328 4.48975 23.3347 4.99269 25.2866 5.99857C27.2384 7.00446 28.7501 8.42422 29.8215 10.2579C30.8929 12.081 31.4286 14.2185 31.4286 16.6704V16.6861C31.4286 18.2997 31.1846 19.709 30.6966 20.9139C30.2193 22.1189 29.5457 23.0514 28.6758 23.7116C27.806 24.3717 26.7823 24.7017 25.6048 24.7017C24.6395 24.7017 23.7803 24.5026 23.0271 24.1045C22.2739 23.7063 21.6958 23.151 21.2927 22.4385L21.054 22.0141H20.9267C20.4812 22.9362 19.8818 23.6382 19.1287 24.1202C18.3861 24.6022 17.5216 24.8432 16.535 24.8432C15.4743 24.8432 14.5355 24.5603 13.7186 23.9945C12.9018 23.4182 12.2601 22.6114 11.7933 21.5741C11.3372 20.5263 11.1091 19.3003 11.1091 17.8963V17.8806C11.1091 16.5918 11.3478 15.4497 11.8251 14.4543C12.3025 13.4589 12.9496 12.6783 13.7664 12.1125C14.5832 11.5466 15.5008 11.2637 16.5191 11.2637C17.4314 11.2637 18.227 11.4785 18.9059 11.9081C19.5954 12.3377 20.1046 12.935 20.4335 13.6999H20.5607V11.6567H24.6024V18.6979C24.6024 19.5047 24.7244 20.1333 24.9683 20.5839C25.2123 21.024 25.5571 21.244 26.0026 21.244C26.3739 21.244 26.6974 21.0659 26.9732 20.7096C27.249 20.3534 27.4612 19.8504 27.6097 19.2008C27.7582 18.5512 27.8325 17.7915 27.8325 16.9218V16.9061C27.8325 14.9782 27.4506 13.3122 26.6868 11.9081C25.9337 10.5041 24.8517 9.41962 23.4408 8.65473C22.0299 7.88984 20.3433 7.5074 18.3808 7.5074C16.8427 7.5074 15.4424 7.75363 14.1801 8.24609C12.9177 8.73856 11.8304 9.44058 10.9181 10.3522C10.0165 11.2637 9.31635 12.3587 8.81778 13.637C8.32981 14.9048 8.08583 16.3194 8.08583 17.8806V17.8963C8.08583 20.1071 8.54728 21.9932 9.47017 23.5544C10.4037 25.1051 11.7244 26.2891 13.4322 27.1064C15.1507 27.9237 17.1927 28.3323 19.5583 28.3323C20.1736 28.3323 20.7835 28.3009 21.3882 28.238C21.9928 28.1752 22.5922 28.0809 23.1862 27.9551C23.7803 27.8294 24.3637 27.6722 24.9365 27.4836V30.5327C24.003 30.8366 23.0589 31.0618 22.1042 31.2085C21.1495 31.3552 20.1523 31.4286 19.1128 31.4286ZM17.9035 21.2911C18.5399 21.2911 19.0491 21.003 19.431 20.4267C19.8129 19.8504 20.0038 19.0541 20.0038 18.0377V17.9749C20.0038 16.9899 19.8076 16.2198 19.4151 15.6645C19.0332 15.0987 18.5293 14.8158 17.9035 14.8158C17.4791 14.8158 17.1079 14.9415 16.7896 15.193C16.4714 15.4444 16.2221 15.8112 16.0418 16.2932C15.872 16.7647 15.7872 17.341 15.7872 18.022V18.0377C15.7872 18.7188 15.872 19.3056 16.0418 19.798C16.2221 20.28 16.4714 20.652 16.7896 20.9139C17.1079 21.1654 17.4791 21.2911 17.9035 21.2911Z',
    card: 'M30.3066 25.292C30.3066 26.2011 29.5693 26.9384 28.6602 26.9385H7.25879C6.34958 26.9385 5.6123 26.2012 5.6123 25.292V16.2754H30.3066V25.292ZM8.41797 20.7656V24.1328H14.0303V20.7656H8.41797ZM28.6602 8.97949C29.5693 8.9796 30.3066 9.71684 30.3066 10.626V13.4688H5.6123V10.626C5.6123 9.71677 6.34958 8.97949 7.25879 8.97949H28.6602Z',
    login: 'M18.2617 5.61914C21.3754 5.7769 23.8524 8.35213 23.8525 11.5049V12.7549H29.1836V28.0605H6.73438V12.7549H12.0664V11.5049C12.0666 8.25065 14.7048 5.61158 17.959 5.61133L18.2617 5.61914ZM13.124 17.5469L13.2324 19.6152L11.5723 18.5352L10.8164 19.7217L12.6875 20.71L10.8164 21.7061L11.5723 22.8848L13.2266 21.8066L13.124 23.873H14.6436L14.54 21.8086L16.1875 22.8848L16.9512 21.7061L15.0713 20.7061L16.9512 19.7139L16.1875 18.5352L14.54 19.6094L14.6436 17.5469H13.124ZM21.2754 17.5469L21.3838 19.6152L19.7236 18.5352L18.9678 19.7217L20.8389 20.71L18.9678 21.7061L19.7236 22.8848L21.3779 21.8066L21.2754 23.8721H22.7949L22.6914 21.8086L24.3389 22.8848L25.1025 21.7061L23.2227 20.7061L25.1025 19.7139L24.3389 18.5352L22.6914 19.6094L22.7949 17.5469H21.2754ZM17.959 8.41797C16.2546 8.41822 14.8732 9.80043 14.873 11.5049V12.627H21.0459V11.5049C21.0457 9.80038 19.6635 8.41814 17.959 8.41797Z',
    addr: 'M26.9385 14.3911V26.0405H8.97949V14.3911L17.959 8.08154L26.9385 14.3911ZM12.5713 17.061V21.5513H17.0615V17.061H12.5713Z'
  };
  function glyph(k, fill) { return '<span class="vtn-av"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="' + P[k] + '" fill="' + fill + '"/></svg></span>'; }
  function disc(k, bg, fill) { return '<span class="vtn-av" style="background:' + bg + '"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="' + P[k] + '" fill="' + fill + '"/></svg></span>'; }
  function img(src, cls) { return '<img class="vtn-av' + (cls ? ' ' + cls : '') + '" src="' + esc(src) + '" alt="">'; }
  var GMAIL = '<span class="vtn-av"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M5.35752 28.9023H10V17.6271L3.36865 12.6528V26.9121C3.36865 28.0104 4.25917 28.9023 5.35752 28.9023Z" fill="#4285F4"/><path d="M25.9185 28.9023H30.561C31.6593 28.9023 32.5512 28.0118 32.5512 26.9121V12.6528L25.9185 17.6271V28.9023Z" fill="#34A853"/><path d="M25.9185 9.00684V17.6271L32.5512 12.6529V10.0006C32.5498 8.35306 31.2134 7.0166 29.5659 7.0166C28.9203 7.0166 28.2927 7.22581 27.7752 7.61395L25.9185 9.00684Z" fill="#FBBC04"/><path d="M10.002 17.6266V9.00635L17.9602 14.9743L25.9184 9.00635V17.6266L17.9602 23.5946L10.002 17.6266Z" fill="#EA4335"/><path d="M3.36865 10.0004V12.6527L10.0014 17.6269V9.00667L8.14468 7.61378C6.82473 6.62417 4.95424 6.89118 3.966 8.20975C3.57786 8.72727 3.36865 9.3549 3.36865 10.0004Z" fill="#C5221F"/></svg></span>';
  var X_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.0607 11.9999L16.773 15.7122L15.7123 16.7729L12 13.0606L8.28769 16.7729L7.22703 15.7122L10.9393 11.9999L7.22703 8.28762L8.28769 7.22696L12 10.9393L15.7123 7.22696L16.773 8.28762L13.0607 11.9999Z" fill="#F3F1ED"/></svg>';
  var CHEV = '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 4.5L6 7.5L9 4.5" stroke="white" stroke-opacity=".6" stroke-width=".75" stroke-linejoin="round"/></svg>';
  /* round 51 (Christine's reference: colour sweeping through the dots): the + is no longer plain white — the page's own glow
     (amber → blue) washes down into it from the top; the white disc is the button's background, the svg only its ring and + */
  var FAB = '<span class="vtn-sweep"></span><svg viewBox="0 0 56 56" fill="none" aria-hidden="true"><circle cx="28" cy="28" r="27.5" fill="none" stroke="#535353"/><path d="M28.75 27.25H34V28.75H28.75V34H27.25V28.75H22V27.25H27.25V22H28.75V27.25Z" fill="#141410"/></svg>';
  var SMS = '<svg viewBox="0 0 22 22" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.0397 2.64014C19.0113 2.64014 19.7998 3.42739 19.7999 4.39971V13.9001C19.7997 14.8722 19.0113 15.6597 18.0397 15.6597H5.26641L2.48075 18.9094L1.31995 18.4801V4.39971C1.32007 3.42739 2.10861 2.64014 3.08016 2.64014H18.0397ZM3.08016 3.96014C2.83681 3.96014 2.64002 4.15716 2.63995 4.39971V16.6967L4.46268 14.5704L4.96348 14.3397H18.0397C18.2526 14.3397 18.4299 14.1887 18.4709 13.9884L18.4799 13.9001V4.39971C18.4799 4.15716 18.2831 3.96014 18.0397 3.96014H3.08016Z" fill="#F3F1ED"/></svg>';
  var IN = '<svg viewBox="0 0 15 15" aria-hidden="true"><path d="M9.96825 9.58939L9.08851 9.55486L9.25148 5.49314L4.23889 10.5057L3.61672 9.88356L8.63 4.87028L4.56759 5.03394L4.53306 4.1542L10.1941 3.9277L9.96825 9.58939Z" fill="white" fill-opacity=".6"/></svg>';
  var ALIAS = { phone: ['Phone', '281-380-9123'], email: ['Email', 'newyork@cloaked.id'], card: ['Card', '.3802'] };
  var ORANGE = '#FF550C', INK = '#141410';

  function tx(t, s, tag) { return '<span class="vtn-tx"><b>' + esc(t) + (tag ? '<span class="vtn-tag">alias</span>' : '') + '</b>' + (s != null ? '<i>' + s + '</i>' : '') + '</span>'; }
  function inner(av, t, s, cls, tag) { return '<div class="vtn-in' + (cls ? ' ' + cls : '') + '">' + av + tx(t, s == null ? null : esc(s), tag) + '</div>'; }

  /* scene 0 · the five rows: a kind, then the item it holds (Figma 2336 → 3252), then the rest of the list */
  var KINDS = [
    ['phone', 'Phone', img(logo('AT&T.svg')), 'My Primary Phone', '832-398-8012'],
    ['email', 'Email', GMAIL, 'Gmail', 'Margaret611@gmail.com'],
    ['card', 'Card', img(logo('Chase.svg')), 'Primary card', '.1289'],
    ['login', 'Passwords', img(logo('Instagram.svg')), 'Instagram login', '*********'],
    ['addr', 'Address', disc('addr', '#1A4459', '#96D3E9'), 'Home', '39 Greenpoint ave, Brooklyn 11201']
  ];
  var MORE = [
    [img('assets/Avatar/avatar-Vault%20item/Address-work.svg'), 'Work', '39 Greenpoint ave, Brooklyn 11201'],
    [img('assets/Avatar/avatar-Vault%20item/Business%20Contact.svg'), 'Business Call', '315-646-2345'],
    [img('assets/Avatar/avatar-Vault%20item/card-bank%20of%20american.png'), 'Bank of America', '.1250'],
    [img(logo('Amazon.png')), 'Amazon', 'imaspidermanfaninnewyork@cloaked.com'],
    [img(logo('Lyft.svg')), 'Lyft', 'triptemporary523@cloaked.com'],
    [img(logo('Chase.svg')), 'Chase', '.4417']
  ];
  var STEP = 81.35, TOP0 = 8.83;
  var listH = KINDS.map(function (k, i) {
    return '<div class="vtn-row r5" style="top:' + (TOP0 + i * STEP) + 'px">' +
      inner(glyph(k[0], '#fff'), k[1], null, 'cat') + inner(k[2], k[3], k[4], 'item') + '</div>';
  }).join('') + MORE.map(function (m, i) {
    return '<div class="vtn-row more" style="top:' + (TOP0 + (i + 5) * STEP) + 'px">' + inner(m[0], m[1], m[2]) + '</div>';
  }).join('');
  var TRIO_TOP = [71.2, 152.55, 233.9];
  var realH = [[img(logo('AT&T.svg')), 'Phone', '832-398-8012'], [GMAIL, 'Email', 'Margaret611@gmail.com'], [img(logo('Chase.svg')), 'Card', '.1289']]
    .map(function (r, i) { return '<div class="vtn-row" style="top:' + TRIO_TOP[i] + 'px">' + inner(r[0], r[1], r[2]) + '</div>'; }).join('');
  var aliasH = ['phone', 'email', 'card'].map(function (k, i) {
    return '<div class="vtn-row solid" style="top:' + (TRIO_TOP[i] - .2) + 'px">' + inner(disc(k, ORANGE, INK), ALIAS[k][0], ALIAS[k][1], '', true) + '</div>';
  }).join('');
  var headH = ['phone', 'email', 'card'].map(function (k) { return inner(disc(k, ORANGE, INK), ALIAS[k][0], ALIAS[k][1], 'h-' + k, true); }).join('');

  /* scene 2 · what reaches each alias (Figma 8439 / 8898 / 9357) */
  function act(av, t, s, right, tall) {
    return '<div class="vtn-act' + (tall ? ' tall' : '') + '">' + av + '<span class="vtn-tx"><b>' + esc(t) + '</b><i>' + s + '</i></span>' + right + '</div>';
  }
  function initial(c, bg) { return '<span class="vtn-av" style="background:' + bg + ';display:flex;align-items:center;justify-content:center;color:#141410;font-size:21px;line-height:1">' + c + '</span>'; }
  var ACTS = {
    phone: [act(img('assets/Avatar/avatar-image/Ellipse%2098.png'), 'June', esc('Hey, it’s June — about Saturday, are we still on for 7?'), '<span class="vtn-r s">Voicemail</span>', true),
            act(img('assets/Avatar/avatar-image/Ellipse%2098-1.png'), 'Melissa', IN + 'New York, NY', '<span class="vtn-r">Call</span>'),
            act(img(logo('Lululemon.png')), 'Lululemon', esc('Your order is confirmed. We’ll text you when it ships.'), '<span class="vtn-r">' + SMS + '</span>')],
    email: [act(img(logo('Airbnb.svg')), 'Airbnb', esc('Welcome to Airbnb, start your first trip…'), ''),
            act(img('assets/Avatar/Game.png'), 'New games', esc('We just launched a new version today!'), ''),
            act(img(logo('New York Time.svg')), 'The New York Times', esc('Your account is activated!'), '')],
    card: [act(initial('C', '#A2BF7A'), 'Casa del Mar Resort', 'Hotel in Cancun .3802', '<span class="vtn-r amt">$525.60</span>'),
           act(img(logo('Lyft.svg')), 'Lyft', 'Ride to JFK .3802', '<span class="vtn-r amt">$25.12</span>'),
           act(img(logo('Delta.png')), 'Delta', 'Flight to Cancun .3802', '<span class="vtn-r amt">$325.24</span>')]
  };
  var actsH = ['phone', 'email', 'card'].map(function (k) { return '<div class="vtn-acts" data-k="' + k + '">' + ACTS[k].join('') + '</div>'; }).join('');

  /* V2.1 (&ut2vonb=n): the title and the art stay put, the scroll only changes the scene.
     V2.2 (&ut2vonb=n2, Christine 23 Oct): like Yuan's — each scene is a page you scroll to,
     its words and its art come up with it, and the art plays once it has landed. */
  var PAGED = true;   /* round 44 (Christine): V2.2 only — V2.1 retired; &ut2vonb=n now opens V2.2 too. The fixed-title path stays below, unused. */
  var COPY = ['<h1>One vault for everything that’s yours</h1><p>Keep your logins, cards and contact info in one place — and use an alias whenever you sign up.</p>',
              '<h1>Share an alias, not your real info</h1>',
              '<h1>Calls, texts, emails and payments — all in one place</h1>'];
  /* V2.2's storyline (Figma 9896:138728): four pages — the vault's kinds, your things in it, the alias, where it all lands */
  /* round 51 (Christine): V2.2 = &ut2vonb=n3 — no + and no kinds: the list of your things with their logos from the start,
     and no "Save them here" page (straight on to the alias). The four-page story above is now V2.1 (&ut2vonb=n2). */
  var LOGOS = (location.search.match(/[?&]ut2vonb=([^&]*)/) || [])[1] === 'n3';
  if (PAGED) COPY = LOGOS ? [COPY[0], COPY[1], COPY[2]] : [COPY[0], '<h1>Keep it all here, ready when you need it</h1>', COPY[1], COPY[2]];
  var KIND = LOGOS ? [1, 2, 3] : [0, 1, 2, 3];   /* page → its art's pose */
  var NS = COPY.length, LAST = NS - 1;
  var ART = '<div class="vtn-art">' +
      '<div class="vtn-fab">' + FAB + '</div>' +
      '<div class="vtn-clip"><div class="vtn-list">' + listH + '</div></div>' +
      '<div class="vtn-trio real">' + realH + '</div>' +
      '<div class="vtn-trio alias">' + aliasH + '</div>' +
      '<div class="vtn-head">' + headH + '</div><i class="vtn-line"></i>' + actsH +
    '</div>';
  /* round 48 (Christine): FAQs at the end, as V1 has them — its cards and classes. Round 54: Vault questions (copy review) */
  function faqCard(tag, q) { return '<div class="vt-faq-card" onclick="if (window.icToast) icToast(\'Article\')"><div class="vt-faq-tag">' + esc(tag) + '</div><div class="vt-faq-q">' + esc(q) + '</div><div class="vt-faq-arrow">&rarr;</div></div>'; }
  var FAQ = '<section class="vtn-faqsec"><div class="vti-faq vtn-faq"><h1 class="vti-faq-h">FAQs</h1><div class="vt-faq-cards">' +
    faqCard('Getting started', 'What’s an alias, and when should I use one?') + faqCard('Getting started', 'Can I import passwords from another manager?') +
    faqCard('Security', 'Who can see what’s in my vault?') + faqCard('Aliases', 'What happens when someone calls my alias number?') + '</div></div></section>';
  var page = document.createElement('div');
  page.className = 'vtn' + (PAGED ? ' paged' : ''); page.id = 'vtnPage'; page.setAttribute('aria-hidden', 'true');
  page.innerHTML =
    '<div class="vtn-bg"></div><canvas class="vtn-orb" aria-hidden="true"></canvas><i class="vtn-glint"></i>' +
    (PAGED
      ? '<div class="vtn-scroll">' + COPY.map(function (c) { return '<section><div class="vtn-copy"><div class="vtn-t on">' + c + '</div></div>' + ART + '</section>'; }).join('') + FAQ + '</div>'
      : '<div class="vtn-copy">' + COPY.map(function (c, i) { return '<div class="vtn-t' + (i ? '' : ' on') + '">' + c + '</div>'; }).join('') + '</div>' + ART +
        '<div class="vtn-scroll">' + COPY.map(function () { return '<section></section>'; }).join('') + '</div>') +
    '<button class="vtn-x" type="button" aria-label="Close">' + X_SVG + '</button><span class="vtn-brand">Vault</span>' +
    '<button class="vtn-cue" type="button">Scroll to explore' + CHEV + '</button>' +
    '<button class="vtn-cta" type="button">Get started</button>';
  var before = document.getElementById('vtAdd');
  if (before && before.parentNode === host) host.insertBefore(page, before); else host.appendChild(page);

  var Q = function (s) { return page.querySelector(s); }, QA = function (s) { return [].slice.call(page.querySelectorAll(s)); };
  var scroller = Q('.vtn-scroll'), titles = PAGED ? [] : QA('.vtn-t');
  function refs(art) {
    var q = function (s) { return art.querySelector(s); }, qa = function (s) { return [].slice.call(art.querySelectorAll(s)); };
    var A = { el: art, fab: q('.vtn-fab'), clip: q('.vtn-clip'), list: q('.vtn-list'), rows5: qa('.vtn-row.r5'), more: qa('.vtn-row.more'),
      real: qa('.vtn-trio.real .vtn-row'), alias: qa('.vtn-trio.alias .vtn-row'), head: q('.vtn-head'),
      heads: { phone: q('.h-phone'), email: q('.h-email'), card: q('.h-card') }, line: q('.vtn-line'), acts: {} };
    qa('.vtn-acts').forEach(function (g) { A.acts[g.dataset.k] = [].slice.call(g.children); });
    /* the activity rows' tops: the first June row is two lines tall */
    Object.keys(A.acts).forEach(function (k) { var y = 153.3; A.acts[k].forEach(function (r) { r.style.top = y + 'px'; y += (r.classList.contains('tall') ? 86.72 : 70.4) + 9.39; }); });
    return A;
  }
  var ARTS = QA('.vtn-art').map(refs);
  function artOf(k) { return ARTS[PAGED ? k : 0]; }

  /* ── a tiny timeline: set (no motion) / to (with motion) / at (later) ── */
  var timers = [];
  function at(ms, fn) { timers.push(setTimeout(fn, still ? 0 : ms)); }
  function clear() { timers.forEach(clearTimeout); timers = []; }
  function set(el, css) { el.style.transition = 'none'; for (var k in css) el.style[k] = css[k]; }
  function to(el, css, dur, ease, delay) {
    el.style.transition = still ? 'none' : ['opacity', 'transform', '--mt', '--mb', 'background-color', 'border-color'].map(function (p) { return p + ' ' + (dur || 550) + 'ms ' + (ease || EZ) + ' ' + (delay || 0) + 'ms'; }).join(',');
    for (var k in css) { if (k.indexOf('--') === 0) el.style.setProperty(k, css[k]); else el.style[k] = css[k]; }
  }
  function flush() { void page.offsetWidth; }

  var HC = TOP0 + 2 * STEP + 35.92;   /* the five rows' middle = the + */
  /* a scene's starting pose: 0 = the + alone (hidden until it pops, unless resting off-screen), 1 = the real three, 2 = the aliases */
  function reset(A, scene, rest) {
    set(A.fab, rest && scene === 0 ? { opacity: 1, transform: 'none' } : { opacity: 0, transform: 'scale(.6)' });
    set(A.list, { opacity: 1, transform: 'none' }); set(A.clip, {}); A.clip.style.setProperty('--mt', '0px'); A.clip.style.setProperty('--mb', '406px');
    A.rows5.forEach(function (r, i) {
      var c = TOP0 + i * STEP + 35.92;
      set(r, { opacity: 0, transform: 'translateY(' + ((HC - c) * .535).toFixed(1) + 'px) scaleY(.395)' });
      set(r.querySelector('.cat'), { opacity: 0, transform: 'none' });
      set(r.querySelector('.item'), { opacity: 0, transform: 'translateY(68px)' });
    });
    A.more.forEach(function (r) { set(r, { opacity: 1, transform: 'none' }); });
    A.rows5.concat(A.more).forEach(function (r) { r.style.backgroundColor = ''; r.style.borderColor = ''; r.__rel = null; });
    A.real.forEach(function (r) { set(r, { opacity: scene === 1 ? 1 : 0, transform: 'none' }); });
    A.alias.forEach(function (r) { set(r, { opacity: scene === 2 ? 1 : 0, transform: scene === 2 ? 'none' : 'translateY(40px)' }); });
    set(A.head, { opacity: 0 }); Object.keys(A.heads).forEach(function (k) { set(A.heads[k], { opacity: k === 'phone' ? 1 : 0, transform: k === 'phone' ? 'none' : 'translateY(72px)' }); });
    set(A.line, { transform: 'scaleY(0)' });
    Object.keys(A.acts).forEach(function (k) { A.acts[k].forEach(function (r) { set(r, { opacity: 0, transform: 'translateY(-14px)' }); }); });
    flush();
  }

  function play0(A) {
    reset(A, 0);
    at(150, function () { to(A.fab, { opacity: 1, transform: 'scale(1)' }, 520); });
    at(950, function () { to(A.fab, { transform: 'scale(.9)' }, 120, 'ease-out'); });
    at(1080, function () { to(A.fab, { transform: 'scale(1)' }, 220, 'ease-out'); });
    at(1400, function () {
      to(A.fab, { opacity: 0, transform: 'scale(.5)' }, 320, 'ease-in');
      A.rows5.forEach(function (r) { to(r, { opacity: 1, transform: 'none' }, 760); });
    });
    at(2150, function () { A.rows5.forEach(function (r, i) { to(r.querySelector('.cat'), { opacity: 1 }, 380, 'ease', i * 70); }); });
    A.rows5.forEach(function (r, i) {
      at(3100 + i * 240, function () {
        to(r.querySelector('.cat'), { opacity: 0, transform: 'translateY(-68px)' }, 560);
        to(r.querySelector('.item'), { opacity: 1, transform: 'none' }, 560);
      });
    });
    at(5000, function () { to(A.clip, { '--mt': '66px', '--mb': '340px' }, 500, 'ease'); to(A.list, { transform: 'translateY(-556.8px)' }, 2600, 'cubic-bezier(.45,0,.2,1)'); });
    at(7900, function () {
      to(A.list, { opacity: 0 }, 360, 'ease');
      A.real.forEach(function (r, i) { set(r, { opacity: 0, transform: 'translateY(14px)' }); flush(); to(r, { opacity: 1, transform: 'none' }, 560, EZ, 120 + i * 90); });
    });
  }
  function play1(A) { reset(A, 1); play1body(A); }
  function play1body(A) {
    A.alias.forEach(function (r, i) { at(450 + i * 140, function () { to(r, { opacity: 1, transform: 'none' }, 700); }); });
    at(1350, function () { A.real.forEach(function (r) { to(r, { opacity: 0 }, 200, 'ease'); }); });
  }
  var KS = ['phone', 'email', 'card'];
  function play2(A, fromHead) {
    var d = fromHead ? -700 : 0;   /* V2.2 lands with the phone alias already on top */
    if (!fromHead) reset(A, 2);
    /* the phone alias rises to the top; the other two step away */
    if (!fromHead) at(200, function () {
      to(A.alias[0], { transform: 'translateY(' + (47.5 - TRIO_TOP[0]) + 'px)' }, 620);
      to(A.alias[1], { opacity: 0, transform: 'translateY(10px)' }, 320, 'ease');
      to(A.alias[2], { opacity: 0, transform: 'translateY(10px)' }, 320, 'ease', 60);
    });
    at(840 + d, function () { set(A.head, { opacity: 1 }); set(A.alias[0], { opacity: 0 }); to(A.line, { transform: 'scaleY(1)' }, 420); });
    var n = 0;
    function show(k, t0) { A.acts[k].forEach(function (r, i) { at(t0, function () { to(r, { opacity: 1, transform: 'none' }, 520, EZ, i * 110); }); }); }
    function hide(k, t0) { A.acts[k].forEach(function (r, i) { at(t0, function () { to(r, { opacity: 0, transform: 'translateY(8px)' }, 300, 'ease', i * 50); }); }); }
    show('phone', 1100 + d);
    function next(t0) {
      var a = KS[n % 3], b = KS[(n + 1) % 3]; n++;
      hide(a, t0);
      at(t0 + 300, function () {
        to(A.heads[a], { opacity: 0, transform: 'translateY(-72px)' }, 520);
        set(A.heads[b], { opacity: 0, transform: 'translateY(72px)' }); flush(); to(A.heads[b], { opacity: 1, transform: 'none' }, 520);
        A.acts[b].forEach(function (r) { set(r, { opacity: 0, transform: 'translateY(-14px)' }); });
      });
      show(b, t0 + 760);
      at(t0 + 760, function () { if (page.classList.contains('open') && cur === LAST) next(3200); });
    }
    at(1100 + d, function () { next(3200); });
  }
  /* V2.2 poses and the two halves of the first scene */
  function poseP(A, j, rest) { poseK(A, KIND[j], rest); }
  function poseK(A, k, rest) {
    set(A.el, { opacity: 1 });
    reset(A, -1);
    if (k === 0 && rest) set(A.fab, { opacity: 1, transform: 'none' });
    if (k === 1) A.rows5.forEach(function (r) { set(r, { opacity: 1, transform: 'none' }); set(r.querySelector('.cat'), { opacity: 0 }); set(r.querySelector('.item'), { opacity: 1, transform: 'none' }); });
    if (k === 2) A.real.forEach(function (r) { set(r, { opacity: 1, transform: 'none' }); });
    if (k === 3) set(A.head, { opacity: 1 });
    flush();
  }
  function pKinds(A) {   /* + → five rows → the kinds */
    poseK(A, 0);
    var sw = A.fab.querySelector('.vtn-sweep'); sw.classList.remove('go'); void sw.offsetWidth;
    at(950, function () { sw.classList.add('go'); });   /* round 53: the colour comes with the press, and the rows open out of it */
    at(150, function () { to(A.fab, { opacity: 1, transform: 'scale(1)' }, 520); });
    at(950, function () { to(A.fab, { transform: 'scale(.9)' }, 120, 'ease-out'); });
    at(1080, function () { to(A.fab, { transform: 'scale(1)' }, 220, 'ease-out'); });
    at(1400, function () {
      to(A.fab, { opacity: 0, transform: 'scale(.5)' }, 320, 'ease-in');
      A.rows5.forEach(function (r) { to(r, { opacity: 1, transform: 'none' }, 760); });
    });
    at(2150, function () { A.rows5.forEach(function (r, i) { to(r.querySelector('.cat'), { opacity: 1 }, 380, 'ease', i * 70); }); });
  }
  /* round 48 (Christine's reference video): your things as a vertical carousel — every 1.6s the
     list steps up one row in .45s (fast, then settling); the row in the middle is the one in focus:
     full size, lifted, brighter; the rows either side shrink and dim; it wraps round for ever */
  var CAR_EZ = 'cubic-bezier(.22,1,.36,1)';
  function carPose(A, f, animate) {
    var rows = A.rows5.concat(A.more), N = rows.length, mid = 203 - 35.92;
    rows.forEach(function (r, i) {
      var rel = ((i - f) % N + N) % N; if (rel > N / 2) rel -= N;
      var d = Math.abs(rel), base = TOP0 + i * STEP;
      var y = mid + rel * STEP - base;
      var st = { opacity: d === 0 ? 1 : d === 1 ? .62 : d === 2 ? .26 : 0,
                 transform: 'translateY(' + y.toFixed(1) + 'px) scale(' + (d === 0 ? 1.04 : d === 1 ? .95 : .9) + ')',
                 backgroundColor: 'rgba(255,255,255,0)',   /* round 50: no grey fill on the row in focus */
                 borderColor: d === 0 ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.1)' };
      /* a row wrapping from the top to the bottom does it while it is invisible */
      var wrap = r.__rel != null && Math.abs(rel - r.__rel) > 1;
      if (animate && !wrap) to(r, st, 450, CAR_EZ); else set(r, st);
      r.__rel = rel;
    });
  }
  function pItems(A) {   /* your things, stepping by one at a time */
    poseK(A, 1);
    var f = 2, me = cur; carPose(A, f, false); flush();   /* round 52: V2.2 runs it on page 0 */
    function step() { if (cur !== me || !page.classList.contains('open')) return; f++; carPose(A, f, true); at(1600, step); }
    at(1200, step);
  }
  /* round 52 (Christine: "여기 모션은 계속 들어가 있어야해 V2.1 처럼"): V2.2's logo page runs V2.1's carousel (pItems) instead */
  function pLogos(A) {   /* round 51, unused since 52 · V2.2: your things, logos and all, rise in one after another, then stay */
    poseK(A, 1);
    A.rows5.forEach(function (r) { set(r, { opacity: 0, transform: 'translateY(18px)' }); }); flush();
    A.rows5.forEach(function (r, i) { at(150 + i * 90, function () { to(r, { opacity: 1, transform: 'none' }, 640); }); });
  }
  function pAlias(A) { poseK(A, 2); A.alias.forEach(function (r) { set(r, { opacity: 0, transform: 'translateY(40px)' }); }); play1body(A); }
  function pCalls(A) { poseK(A, 3); play2(A, true); }

  /* V2.2 (Christine 23 Oct: "asset 모션이 loop 되게"): while you stay on a page its art plays,
     holds, dips out and plays again (the calls page already cycles on its own) */
  function loopP(k, fn, period) {
    return function run(A, again) {
      fn(A);
      if (again) { set(A.el, { opacity: 0 }); flush(); to(A.el, { opacity: 1 }, 360, 'ease'); }
      at(period, function () {
        if (cur !== k || !page.classList.contains('open')) return;
        to(A.el, { opacity: 0 }, 300, 'ease');
        at(320, function () { if (cur === k) run(A, true); });
      });
    };
  }

  /* ── scenes on the scroll (V3's rule: land, then play) ── */
  var cur = -1, settle = 0;
  function scene(k) {
    if (k === cur) return; cur = k;
    clear();
    titles.forEach(function (t, i) { t.classList.toggle('on', i === k); });
    page.classList.toggle('s2', k === LAST);
    /* V2.2: the pages you are not on wait in their starting pose, so scrolling to one shows it ready */
    if (PAGED) ARTS.forEach(function (A, j) { if (j !== k) poseP(A, j, true); });
    (PAGED ? (LOGOS ? [pItems, loopP(1, pAlias, 4400), pCalls] : [pKinds, pItems, loopP(2, pAlias, 4400), pCalls]) : [play0, play1, play2])[k](artOf(k));
  }
  scroller.addEventListener('scroll', function () {
    clearTimeout(settle);
    settle = setTimeout(function () { scene(Math.max(0, Math.min(LAST, Math.round(scroller.scrollTop / Math.max(1, scroller.clientHeight))))); }, PAGED ? 260 : 140);
  }, { passive: true });
  Q('.vtn-cue').addEventListener('click', function () { scroller.scrollTo({ top: (cur + 1) * scroller.clientHeight, behavior: 'smooth' }); });

  /* ── open / close / Get started ── */
  function navOut(h) { document.body.classList.toggle('nav-out', !!h); }
  function open() {
    if (typeof window.vtIntroTrayClose === 'function') window.vtIntroTrayClose();
    page.classList.add('open'); page.setAttribute('aria-hidden', 'false'); navOut(true);
    scroller.scrollTop = 0; cur = -1; ARTS.forEach(function (A, j) { if (PAGED) poseP(A, j, j > 0); else reset(A, j); });
    setTimeout(function () { scene(0); }, 320);
    orbGo();
  }
  /* round 51 (Christine: "V1 에는 배경이 움직이는데 V2 는 안 움직여"): V1's breathing orb (Yuan's drawOrb, via
     window.vtiOrbDraw) paints this page's ground too, while the page is open */
  var orbCv = Q('.vtn-orb'), orbId = 0;
  function orbF(ts) { orbId = 0; if (!page.classList.contains('open') || typeof window.vtiOrbDraw !== 'function') return; window.vtiOrbDraw(orbCv, ts); if (!still) orbId = requestAnimationFrame(orbF); }
  function orbGo() { if (typeof window.vtiOrbDraw !== 'function') return; page.classList.add('orb'); if (!orbId) orbId = requestAnimationFrame(orbF); }
  function close(keepNav) {
    clear(); cur = -1;
    page.classList.remove('open'); page.setAttribute('aria-hidden', 'true');
    if (!keepNav) navOut(false);
  }
  Q('.vtn-x').addEventListener('click', function () { close(false); });
  Q('.vtn-cta').addEventListener('click', function () {
    if (typeof window.vtOpenAdd === 'function') window.vtOpenAdd();
    setTimeout(function () { close(true); }, 460);
  });
  /* leaving the Vault folds it away (as Yuan's page does) */
  var _go = window.goTab;
  if (typeof _go === 'function') window.goTab = window.showTab = function (name) {
    var r = _go.apply(this, arguments);
    if (name !== 'vaults' && page.classList.contains('open')) close(false);
    return r;
  };
  /* V2.2's cover tray (Christine 23 Oct: "처음 커버 트레이도 이 V2.2 에셋"): Yuan's tray keeps its title and
     Learn more, but its ring becomes the story's first beat — the glow, the +, the five kinds, your things — on a loop */
  if (PAGED) (function () {
    var tray = document.querySelector('#vtIntroTray .vti-tray'); if (!tray) return;
    tray.classList.add('vtn-tray');
    var ring = tray.querySelector('.vti-ring'); if (ring) ring.style.display = 'none';
    var art = document.createElement('div'); art.className = 'vtn-tart'; art.setAttribute('aria-hidden', 'true');
    if (LOGOS) tray.classList.add('logos');
    art.innerHTML = '<div class="vtn-tin"><div class="vtn-tfab">' + FAB + '</div>' + KINDS.map(function (k, i) {
      return '<div class="vtn-row t' + i + '" style="--i:' + i + '">' + inner(glyph(k[0], '#fff'), k[1], null, 'cat') + inner(k[2], k[3], k[4], 'item') + '</div>';
    }).join('') + '</div>';   /* round 47: the whole beat at .75 */
    if (ring) ring.parentNode.insertBefore(art, ring); else tray.insertBefore(art, tray.querySelector('.vti-cta'));
  })();
  window.vtIntroOpen = open; window.vtIntroClose = function () { close(false); }; window.vtIntroStart = function () { Q('.vtn-cta').click(); };
  window.UT2_VTN = 1;
})();
