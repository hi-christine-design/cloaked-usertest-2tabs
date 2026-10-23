/* ═══════════════════════════════════════════════════════════════════════════
   av-rule.js (build dde9c7c30918) · ONE answer to "what does this Vault item look like" — MV-0
   ═══════════════════════════════════════════════════════════════════════════
   Source of truth: V2/shared/av-rule.js. Inlined into V2/Day30/app.html and
   V2/DayOne/js/day01.js between AVRULE BEGIN/END markers by
   `python3 V2/shared/build-avrule.py`. Do not edit the copies.

   The rule (Yuan, 17–18 Sep 2026; Figma "Annotation / Vault colors" 11994:98759
   and "Annotation / ID Card colors" 11994:99562):

   GLYPH — decided once, when the item is created, in this order:
     1. a photo the user uploaded          -> the photo, round, never recoloured
     2. a brand we have a logo for          -> the logo, bare (no disc)
        matched on: website · username host · the value's host (NOT for an
        alias — its host is ours) · the title
     3. a persona the title names           -> persona mark (dating, travel, business,
        shopping, trial, hide, bank)
     4. the property type                   -> property mark (email, phone, logins,
        card, bank, address)

   COLOUR — only when there is no logo/photo. 8 hue families, each a Light (01)
   and a Dark (02) that contrast ≥ 3:1 with each other. The family is picked by
   a stable hash of the title (a saved item must not change colour on repaint).
     non-alias : 01 with 02, either way round (the hash decides which is the disc)
     alias     : disc Cloaked Black #141410, mark the family's 01

   ITEM DETAIL (VT-02):
     alias     : the top (bar, avatar, title, rows) is DARK; Activities are light
     non-alias : all light
     on dark   : a mark avatar gets a 20% white outline (black disc on black);
                 a logo whose own ink is too dark for #141410 (< 3:1) is whitened;
                 a photo is left alone

   CONFIRMATION PAGE ("Your email is created!"):
     logo, one dominant colour   -> ground = that colour, ink by contrast
     logo, multicolour (Google…) -> ground white, the card gets a 15% black outline
     no logo, non-alias          -> ground = the avatar's disc colour
     no logo, alias              -> ground = the family's 01 (the mark's colour)
     photo                       -> dominant sampled colour; AA black/white UI ink
   The generating animation runs for ALIAS items only; its gradient is the
   confirmation ground.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var BLACK = '#141410', WHITE = '#ffffff', PAPER = '#f3f1ed', BRAND = '#ff550c';

  /* Figma 11994:98759 — hue, Light (01), Dark (02) */
  var FAMILIES = [
    { name: 'Iris',  light: '#bba7dd', dark: '#5c2074' },
    { name: 'Mauve', light: '#d5a2b9', dark: '#83244f' },
    { name: 'Coral', light: '#f79688', dark: '#5b2a27' },
    { name: 'Amber', light: '#e9c696', dark: '#7f5924' },
    { name: 'Camel', light: '#b9a56c', dark: '#45320a' },
    { name: 'Sage',  light: '#a2bf7a', dark: '#263427' },
    { name: 'Mint',  light: '#8ecfc1', dark: '#154f51' },
    { name: 'Blue',  light: '#96d3e9', dark: '#1a4459' }
  ];

  /* ── alias ─────────────────────────────────────────────────────────────────
     One test, replacing /@cloaked/, /cloak|clkd|clokd/, /@cloaked\.com$/ and
     it[2]. A value is an alias when its host is one of ours. Phone numbers
     carry no host, so a phone's alias-ness has to come from the item flag. */
  var OUR_HOSTS = /(^|\.)(cloaked\.(id|com)|mycloaked\.id|myclkd\.id|clkd\.(id|email)|clokd\.email|stayclkd\.com|usecloaked\.com)$/i;
  function hostOf(v) {
    v = String(v || '').trim().toLowerCase();
    var at = v.indexOf('@');
    if (at >= 0) return v.slice(at + 1);
    var m = /^(?:https?:\/\/)?([^\/\s?#]+)/.exec(v);
    return m ? m[1].replace(/^www\./, '') : '';
  }
  function isAliasValue(v) { return OUR_HOSTS.test(hostOf(v)); }

  /* ── brands ────────────────────────────────────────────────────────────────
     file: under assets/. tint: the colour a page floods with for this brand.
     ink: the mark's own dominant colour, for the whiten test on dark. multi:
     no single colour (Google, Instagram…) — ground goes white instead.
     Tints are the ones ICON_TINT already carried (measured off the art). */
  var BRANDS = {
    google:    { file: 'logo/Google.svg',      tint: '#fbbc05', multi: true },
    gmail:     'google',
    instagram: { file: 'logo/Instagram.svg',   tint: '#f56f34', multi: true },
    ebay:      { file: 'logo/Ebay.png',        tint: '#f6ae03', multi: true },
    outlook:   { file: 'pack/tasks/Outlook.png', tint: '#01459b', multi: true },
    hotmail:   'outlook', live: 'outlook', msn: 'outlook',
    apple:     { file: 'logo/Apple.svg',       tint: BLACK, ink: BLACK },
    icloud:    'apple',
    chatgpt:   { file: 'logo/ChatGPT.svg',     tint: BLACK, ink: BLACK },
    hinge:     { file: 'logo/Hinge.svg',       tint: BLACK, ink: BLACK, domain: 'hinge.co' },
    netflix:   { file: 'logo/Netflix.svg',     tint: '#e50914', ink: '#e50914', domain: 'netflix.com' },
    nike:      { file: 'logo/Nike.svg',        tint: BLACK, ink: BLACK },
    hbo:       { file: 'logo/HBO.png',         tint: BLACK, ink: BLACK },
    nytimes:   { file: 'logo/NewYorkTime.svg', tint: BLACK, ink: BLACK },
    amazon:    { file: 'logo/Amazon.png',      tint: '#f56600' },
    airbnb:    { file: 'logo/Airbnb.svg',      tint: '#ff385c' },
    att:       { file: 'logo/AT&T.svg',        tint: '#009edd', domain: 'att.com' },
    bumble:    { file: 'logo/Bumble.svg',      tint: '#f9c134' },
    delta:     { file: 'logo/Delta.png',       tint: '#f91c40' },
    disney:    { file: 'logo/Disney.png',      tint: '#2b70ff' },
    doordash:  { file: 'logo/Doordash.svg',    tint: '#ff0000' },
    facebook:  { file: 'logo/Facebook.png',    tint: '#1877f2' },
    ikea:      { file: 'logo/ikea.png',        tint: '#f6d33c' },
    linkedin:  { file: 'logo/Linkedin.png',    tint: '#177ce2' },
    lululemon: { file: 'logo/Lululemon.png',   tint: '#ed1a39' },
    lyft:      { file: 'logo/Lyft.svg',        tint: '#ea0b8c' },
    mcdonald:  { file: 'logo/mcdonald.svg',    tint: '#fdbb20', domain: 'mcdonalds.com' },
    mcdonalds: 'mcdonald',
    reddit:    { file: 'logo/Reddit.png',      tint: '#ff4500' },
    redfin:    { file: 'logo/Redfin.png',      tint: '#e83132' },
    spotify:   { file: 'logo/Spotify.svg',     tint: '#1ed760' },
    target:    { file: 'logo/Target.svg',      tint: '#f20f0f' },
    tmobile:   { file: 'logo/T mobile.svg',    tint: '#ef057d', domain: 't-mobile.com' },
    twitch:    { file: 'logo/Twitch.png',      tint: '#964fff' },
    twitter:   { file: 'logo/Twitter.svg',     tint: '#1da0f2' },
    ups:       { file: 'logo/UPS.svg',         tint: '#ffd20b' },
    verizon:   { file: 'logo/Verizon.png',     tint: '#fc0724' },
    walmart:   { file: 'logo/Walmart.svg',     tint: '#fdbb30' },
    zillow:    { file: 'logo/Zillow.svg',      tint: '#0d71ff' },
    workday:   { file: 'logo/Workday.png',     tint: '#c3822d' },
    docusign:  { file: 'logo/Docusign.png',    tint: '#8957ff' },
    adecco:    { file: 'logo/Adecco.png',      tint: '#13bdb8' }
  };
  function brand(key) {
    var b = BRANDS[key];
    while (typeof b === 'string') { key = b; b = BRANDS[key]; }
    return b ? { key: key, file: b.file, tint: b.tint, ink: b.ink || b.tint, multi: !!b.multi,
                 domain: b.domain || (key + '.com') } : null;
  }
  var BRAND_RE = null;
  function brandKey(text) {
    var flat = String(text || '').toLowerCase().replace(/[.@_/:-]/g, ' ').replace(/'s\b/g, '');
    if (!flat.trim()) return '';
    if (!BRAND_RE) {
      var keys = Object.keys(BRANDS).sort(function (a, b) { return b.length - a.length; });
      BRAND_RE = new RegExp('\\b(' + keys.join('|') + ')\\b');
    }
    var m = BRAND_RE.exec(flat);
    return m ? m[1] : '';
  }

  /* ── personas ──────────────────────────────────────────────────────────────
     Both builds' word lists, merged, `\b`-anchored so "work" does not fire on
     "network". Order = priority when a title names two. */
  var PERSONAS = [
    ['dating',   /\b(dating|date|tinder|bumble|hinge|match|romance|love)\b/],
    ['travel',   /\b(trip|travel|vacation|holiday|flight|flights|hotel|airline|cancun)\b/],
    ['business', /\b(business|work|working|office|client|clients|invoice|vendor|contact|contacts|company|hr)\b/],
    ['trial',    /\b(free ?trials?|trials?|demo|newsletter|newsletters|subscription|subscriptions|sign ?up|signup)\b/],
    ['shopping', /\b(shop|shopping|store|retail|order|orders|delivery|cart|marketplace|food)\b/],
    ['bank',     /\b(bank|banking|finance|loan|credit|payroll|savings|chase)\b/],
    ['hide',     /\b(hide|hidden|private|privacy|anon|anonymous|burner|spam|junk|throwaway)\b/]
  ];
  function persona(title) {
    var t = String(title || '').toLowerCase();
    for (var i = 0; i < PERSONAS.length; i++) if (PERSONAS[i][1].test(t)) return PERSONAS[i][0];
    return '';
  }
  /* kind -> property mark. `password`/`login`/`note` all read as a login. */
  var PROPS = { email: 'email', phone: 'phone', number: 'phone', login: 'logins', password: 'logins',
                note: 'logins', card: 'card', payment: 'card', bank: 'bank', address: 'address' };

  /* the marks, 40x40, fill = currentColor (lifted from assets/Avatar/avatar-Vault item) */
  var MARKS = {
    "trial": "M20.9394 32.3586C19.002 32.3586 17.2347 32.0704 15.6376 31.4939C14.0404 30.9268 12.6653 30.1093 11.5123 29.0414C10.3593 27.9735 9.47098 26.6882 8.84724 25.1855C8.22349 23.6829 7.91162 21.9959 7.91162 20.1247V20.1105C7.91162 18.3149 8.20932 16.6799 8.80471 15.2056C9.40955 13.7313 10.2601 12.4602 11.3564 11.3923C12.4527 10.3244 13.7569 9.50214 15.269 8.92565C16.7905 8.34916 18.4633 8.06091 20.2873 8.06091C22.65 8.06091 24.7008 8.51455 26.4397 9.42181C28.1786 10.3291 29.5253 11.6096 30.4798 13.2635C31.4344 14.9079 31.9116 16.8359 31.9116 19.0473V19.0615C31.9116 20.5169 31.6943 21.788 31.2595 22.8749C30.8342 23.9617 30.2341 24.8028 29.4592 25.3982C28.6842 25.9936 27.7722 26.2913 26.7232 26.2913C25.8632 26.2913 25.0977 26.1117 24.4267 25.7526C23.7557 25.3935 23.2406 24.8926 22.8815 24.2499L22.6689 23.8672H22.5554C22.1585 24.6988 21.6246 25.332 20.9536 25.7668C20.292 26.2015 19.5218 26.4189 18.6429 26.4189C17.6978 26.4189 16.8614 26.1637 16.1337 25.6534C15.406 25.1336 14.8342 24.4059 14.4184 23.4702C14.012 22.5252 13.8088 21.4194 13.8088 20.1531V20.1389C13.8088 18.9764 14.0215 17.9463 14.4468 17.0485C14.872 16.1507 15.4485 15.4466 16.1762 14.9363C16.9039 14.4259 17.7214 14.1708 18.6287 14.1708C19.4415 14.1708 20.1503 14.3645 20.7551 14.752C21.3694 15.1395 21.823 15.6782 22.116 16.3681H22.2294V14.5252H25.8301V20.876C25.8301 21.6037 25.9388 22.1708 26.1562 22.5772C26.3735 22.9741 26.6807 23.1725 27.0776 23.1725C27.4084 23.1725 27.6966 23.0119 27.9423 22.6906C28.1881 22.3692 28.3771 21.9156 28.5094 21.3297C28.6417 20.7437 28.7078 20.0585 28.7078 19.2741V19.26C28.7078 17.521 28.3676 16.0184 27.6872 14.752C27.0162 13.4856 26.0522 12.5075 24.7953 11.8176C23.5383 11.1277 22.0357 10.7827 20.2873 10.7827C18.9169 10.7827 17.6694 11.0048 16.5448 11.449C15.4202 11.8932 14.4515 12.5264 13.6387 13.3486C12.8354 14.1708 12.2117 15.1584 11.7675 16.3114C11.3328 17.4549 11.1154 18.7307 11.1154 20.1389V20.1531C11.1154 22.1472 11.5265 23.8483 12.3487 25.2564C13.1804 26.6551 14.357 27.7231 15.8785 28.4602C17.4096 29.1974 19.2288 29.5659 21.3363 29.5659C21.8844 29.5659 22.4279 29.5376 22.9666 29.4809C23.5052 29.4242 24.0392 29.3391 24.5684 29.2257C25.0977 29.1123 25.6175 28.9705 26.1278 28.8004V31.5506C25.2961 31.8246 24.455 32.0278 23.6045 32.1601C22.7539 32.2925 21.8655 32.3586 20.9394 32.3586ZM19.862 23.2151C20.429 23.2151 20.8827 22.9552 21.2229 22.4354C21.5631 21.9156 21.7332 21.1974 21.7332 20.2806V20.2239C21.7332 19.3356 21.5584 18.6409 21.2087 18.1401C20.8685 17.6297 20.4196 17.3746 19.862 17.3746C19.484 17.3746 19.1532 17.488 18.8697 17.7148C18.5862 17.9416 18.3641 18.2724 18.2034 18.7071C18.0522 19.1324 17.9766 19.6522 17.9766 20.2665V20.2806C17.9766 20.8949 18.0522 21.4242 18.2034 21.8684C18.3641 22.3031 18.5862 22.6386 18.8697 22.8749C19.1532 23.1017 19.484 23.2151 19.862 23.2151Z",
    "business": "M25.8799 14.4817H30.8184V19.9817H23.7793V21.8147H30.8184V30.0647H8.81836V14.4817H14.083V9.50024H25.8799V14.4817ZM17.1797 23.6487H22.6797V19.9817H17.1797V23.6487ZM8.81934 21.8147H16.1523V19.9817H8.81934V21.8147ZM16.7139 14.4817H23.25V12.1311H16.7139V14.4817Z",
    "dating": "M12.9963 23.4036C18.1097 25.6433 18.1792 25.8696 19.3326 30.1739H20.6674C21.6085 25.8696 21.8903 25.6433 27.0037 23.4036C33.6676 20.4848 30.808 13.0569 27.0037 12.2053C23.0018 11.3095 20.6666 13.4371 19.9996 16.7966C19.3326 13.4371 16.9982 11.3095 12.9963 12.2053C9.192 13.0569 6.33238 20.4848 12.9963 23.4036Z",
    "travel": "M29.2397 9.00017C29.6697 9.01081 30.0747 9.17669 30.4233 9.52068C31.1387 10.2268 31.1034 11.119 30.7817 11.9074C30.4648 12.6838 29.8464 13.4435 29.2319 14.05L25.6548 17.5812L26.8188 28.9133L26.6948 29.256L25.6763 30.2609L24.979 30.134L21.2505 21.8742L16.8755 25.674L17.2632 29.4572L17.1392 29.801L15.9243 30.9992L15.2505 30.9162L12.9614 27.1095L9.08545 24.8312L9.00146 24.1662L10.2163 22.967L10.5601 22.8439L14.063 23.1672L18.2769 18.6271L9.93115 15.2736L9.78857 14.5803L10.9438 13.4396L11.2925 13.3166L22.4771 14.4435L26.0542 10.9133C26.6187 10.3561 27.3268 9.6926 28.0532 9.3156C28.4202 9.12526 28.8246 8.98999 29.2397 9.00017ZM9.30518 24.466L13.2759 26.8L15.6206 30.6994L16.8354 29.5002L15.6206 30.6984L13.2759 26.799L9.30615 24.466L10.1733 23.6095L9.30518 24.466ZM14.2358 23.6086L14.2368 23.6095L19.0132 18.4631H19.0122L14.2358 23.6086ZM29.3481 13.3068C29.2119 13.4598 29.071 13.6083 28.9282 13.7492L27.3843 15.2736L28.9282 13.7502L29.1509 13.5226C29.2177 13.4522 29.2832 13.3798 29.3481 13.3068ZM26.3579 11.2131L22.6362 14.8859L26.3589 11.2131C26.5007 11.073 26.6488 10.9293 26.8013 10.7873L26.3579 11.2131Z",
    "shopping": "M10 11H30A3 3 0 0 1 33 14V26A3 3 0 0 1 30 29H10A3 3 0 0 1 7 26V14A3 3 0 0 1 10 11ZM7 15.5H33V20.5H7ZM11.25 24H17.75A1.25 1.25 0 0 1 19 25.25V25.25A1.25 1.25 0 0 1 17.75 26.5H11.25A1.25 1.25 0 0 1 10 25.25V25.25A1.25 1.25 0 0 1 11.25 24Z",
    "email": "M20.8537 31.3463C19.0778 31.3463 17.4578 31.082 15.9937 30.5536C14.5297 30.0338 13.2692 29.2844 12.2123 28.3055C11.1554 27.3266 10.341 26.1484 9.76927 24.7709C9.1975 23.3935 8.91162 21.8471 8.91162 20.1318V20.1188C8.91162 18.4729 9.18451 16.9741 9.73029 15.6227C10.2847 14.2712 11.0644 13.106 12.0693 12.1271C13.0743 11.1482 14.2698 10.3945 15.6559 9.86604C17.0506 9.33759 18.584 9.07336 20.256 9.07336C22.4218 9.07336 24.3017 9.48919 25.8957 10.3209C27.4897 11.1525 28.7242 12.3264 29.5992 13.8424C30.4741 15.3498 30.9116 17.1171 30.9116 19.1442V19.1572C30.9116 20.4914 30.7124 21.6566 30.3139 22.6528C29.924 23.6491 29.3739 24.4201 28.6635 24.9659C27.9532 25.5116 27.1172 25.7845 26.1556 25.7845C25.3672 25.7845 24.6655 25.6199 24.0504 25.2907C23.4353 24.9615 22.9632 24.5024 22.634 23.9133L22.4391 23.5624H22.3351C21.9713 24.3248 21.4818 24.9052 20.8667 25.3037C20.2603 25.7022 19.5543 25.9015 18.7486 25.9015C17.8823 25.9015 17.1156 25.6676 16.4485 25.1998C15.7815 24.7233 15.2574 24.0562 14.8762 23.1986C14.5037 22.3323 14.3174 21.3187 14.3174 20.1578V20.1448C14.3174 19.0793 14.5123 18.135 14.9022 17.312C15.292 16.489 15.8205 15.8436 16.4875 15.3758C17.1546 14.908 17.9039 14.6741 18.7356 14.6741C19.4806 14.6741 20.1304 14.8517 20.6848 15.2069C21.2479 15.562 21.6637 16.0558 21.9323 16.6882H22.0363V14.9989H25.3369V20.8206C25.3369 21.4876 25.4365 22.0074 25.6358 22.3799C25.835 22.7438 26.1166 22.9257 26.4804 22.9257C26.7836 22.9257 27.0479 22.7784 27.2731 22.4839C27.4984 22.1893 27.6716 21.7735 27.7929 21.2364C27.9142 20.6993 27.9748 20.0712 27.9748 19.3522V19.3392C27.9748 17.7452 27.663 16.3677 27.0392 15.2069C26.4241 14.046 25.5405 13.1494 24.3883 12.517C23.2361 11.8845 21.8587 11.5683 20.256 11.5683C18.9998 11.5683 17.8563 11.7719 16.8254 12.1791C15.7945 12.5863 14.9065 13.1667 14.1615 13.9204C13.4251 14.6741 12.8533 15.5794 12.4462 16.6363C12.0477 17.6845 11.8484 18.854 11.8484 20.1448V20.1578C11.8484 21.9857 12.2253 23.5451 12.979 24.8359C13.7413 26.1181 14.8199 27.097 16.2146 27.7727C17.6181 28.4484 19.2857 28.7863 21.2176 28.7863C21.72 28.7863 22.2182 28.7603 22.712 28.7083C23.2058 28.6564 23.6952 28.5784 24.1804 28.4744C24.6655 28.3705 25.142 28.2405 25.6098 28.0846V30.6056C24.8474 30.8568 24.0764 31.043 23.2967 31.1643C22.5171 31.2856 21.7027 31.3463 20.8537 31.3463ZM19.8661 22.9647C20.3859 22.9647 20.8018 22.7264 21.1136 22.25C21.4255 21.7735 21.5814 21.1151 21.5814 20.2748V20.2228C21.5814 19.4085 21.4212 18.7717 21.1006 18.3126C20.7888 17.8448 20.3773 17.6109 19.8661 17.6109C19.5196 17.6109 19.2164 17.7148 18.9565 17.9227C18.6966 18.1307 18.493 18.4339 18.3458 18.8324C18.2072 19.2222 18.1378 19.6987 18.1378 20.2618V20.2748C18.1378 20.8379 18.2072 21.323 18.3458 21.7302C18.493 22.1287 18.6966 22.4362 18.9565 22.6528C19.2164 22.8607 19.5196 22.9647 19.8661 22.9647Z",
    "phone": "M24.5835 9C25.5959 9.00008 26.4165 9.90474 26.4165 11.0205V28.9795C26.4165 30.0953 25.5959 30.9999 24.5835 31H15.4165C14.4042 30.9997 13.5835 30.0951 13.5835 28.9795V11.0205C13.5835 9.90486 14.4042 9.00027 15.4165 9H24.5835ZM18.4399 10.6924C17.9728 10.6924 17.5945 11.071 17.5942 11.5381C17.5942 12.0054 17.9726 12.3848 18.4399 12.3848H21.5601C22.0274 12.3848 22.4058 12.0054 22.4058 11.5381C22.4055 11.071 22.0272 10.6924 21.5601 10.6924H18.4399Z",
    "address": "M30 16.0273V29H10V16.0273L20 9L30 16.0273ZM14 19V24H19V19H14Z",
    "logins": "M20.2334 9.00549C22.635 9.12719 24.5447 11.1137 24.5449 13.5455V15.3639H30V28.9996H10V15.3639H15.4541V13.5455C15.4543 11.0354 17.4899 8.99987 20 8.99963L20.2334 9.00549ZM15.6924 19.6334L15.7891 21.4752L14.3096 20.5133L13.6367 21.5709L15.3037 22.4518L13.6367 23.3385L14.3096 24.3883L15.7832 23.4283L15.6924 25.2682H17.0459L16.9541 23.4303L18.4219 24.3883L19.1016 23.3385L17.4277 22.4479L19.1016 21.5631L18.4219 20.5133L16.9541 21.4703L17.0459 19.6334H15.6924ZM22.9551 19.6334L23.0508 21.4752L21.5723 20.5133L20.8994 21.5709L22.5664 22.4508L20.8994 23.3385L21.5723 24.3883L23.0469 23.4274L22.9551 25.2682H24.3086L24.2168 23.4303L25.6836 24.3883L26.3643 23.3385L24.6895 22.4479L26.3643 21.5631L25.6836 20.5133L24.2168 21.4703L24.3086 19.6334H22.9551ZM20 10.5211C18.3302 10.5214 16.9758 11.8757 16.9756 13.5455V15.3639H23.0234V13.5455C23.0233 11.8757 21.6698 10.5214 20 10.5211Z",
    "card": "M31 26.4166C31 27.429 30.1794 28.2495 29.167 28.2496H10.833C9.82064 28.2495 9 27.429 9 26.4166V19.0836H31V26.4166ZM11.75 22.7496V25.4996H16.333V22.7496H11.75ZM29.167 12.6666C30.1793 12.6668 30.9998 13.4874 31 14.4996V16.3336H9V14.4996C9.00017 13.4874 9.82074 12.6668 10.833 12.6666H29.167Z",
    "bank": "M14.5 26.6752H18.625V19.892H21.375V26.6752H25.5V19.892H28.25V26.6752H31V29.4252H9V26.6752H11.75V19.892H14.5V26.6752ZM31 14.4886V17.142H9V14.4886L20 7.97498L31 14.4886Z",
    "hide": "M29.1904 10.9648L13.2676 30.2393L11.5889 28.8516L14.2031 25.6865C11.5991 24.4686 9.43156 22.4738 8 19.999C10.421 15.815 14.946 13 20.1279 13C21.5401 13.0001 22.9032 13.2098 24.1885 13.5986L27.5107 9.57812L29.1904 10.9648ZM27.5674 15.1387C29.4979 16.3519 31.1121 18.0229 32.2559 20C29.8351 24.1845 25.3101 26.9998 20.1279 27C19.3746 27 18.6351 26.9378 17.9141 26.8232L19.4453 24.9688C19.6275 24.9889 19.8125 25 20 25C22.7614 25 25 22.7614 25 20C25 19.4835 24.9218 18.9853 24.7764 18.5166L27.5674 15.1387ZM20 15C17.2386 15 15 17.2386 15 20C15 21.245 15.4562 22.3826 16.209 23.2578L22.4854 15.6602C21.7533 15.2399 20.9046 15 20 15Z"
};
  var EVENODD = { shopping: 1 };

  /* ── colour maths ──────────────────────────────────────────────────────────*/
  function hex2rgb(h) {
    h = String(h || '').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function luma(hex) {
    var c = hex2rgb(hex).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) {
    var la = luma(a), lb = luma(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  /* which of black / white reads on this ground — WCAG contrast, not a guess */
  function inkOn(ground) { return contrast(ground, BLACK) >= contrast(ground, WHITE) ? BLACK : WHITE; }
  function modeOf(ground) { return inkOn(ground) === WHITE ? 'dark' : 'light'; }

  function hash(s) {
    s = String(s || ''); var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) & 0x7fffffff;
    return h;
  }

  /* Photo colour is sampled locally. Quantized population bins retain the
     dominant colour instead of averaging unrelated hues into grey. */
  var photoCache = Object.create(null);
  function dominantColor(pixels) {
    var bins = Object.create(null), best = null;
    for (var i = 0; i < pixels.length; i += 4) {
      var a = pixels[i + 3] / 255;
      if (a < 0.5) continue;
      var r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      var key = (r >> 5) + ',' + (g >> 5) + ',' + (b >> 5);
      var bin = bins[key] || (bins[key] = { n: 0, r: 0, g: 0, b: 0 });
      bin.n += a; bin.r += r * a; bin.g += g * a; bin.b += b * a;
    }
    Object.keys(bins).sort().forEach(function (key) {
      if (!best || bins[key].n > best.n) best = bins[key];
    });
    if (!best) return PAPER;
    return '#' + [best.r, best.g, best.b].map(function (v) {
      return ('0' + Math.round(v / best.n).toString(16)).slice(-2);
    }).join('');
  }
  function photoInk(ground) {
    // Pure black/white guarantees >=4.5:1 even around mid-luminance colours.
    return contrast(ground, '#000000') >= contrast(ground, WHITE) ? '#000000' : WHITE;
  }
  function photoColor(src) {
    if (photoCache[src]) return Promise.resolve(photoCache[src]);
    return new Promise(function (resolve) {
      var img = new Image(), done = false;
      var timer = setTimeout(function () { finish(PAPER); }, 5000);
      function finish(color) {
        if (done) return; done = true; clearTimeout(timer);
        img.onload = img.onerror = null;
        photoCache[src] = color; resolve(color);
      }
      img.onload = function () {
        try {
          var canvas = document.createElement('canvas');
          canvas.width = canvas.height = 64;
          var ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, 64, 64);
          finish(dominantColor(ctx.getImageData(0, 0, 64, 64).data));
        } catch (e) { finish(PAPER); }
      };
      img.onerror = function () { finish(PAPER); };
      if (/^https?:/i.test(src)) img.crossOrigin = 'anonymous';
      img.src = src;
    });
  }
  function readPhoto(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) {
        reject(new Error('Choose a JPG, PNG, WebP, GIF or AVIF photo.')); return;
      }
      if (file.size > 20 * 1024 * 1024) { reject(new Error('Choose a photo under 20 MB.')); return; }
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('This photo could not be read.')); };
      reader.onload = function () {
        photoColor(reader.result).then(function (color) { resolve({ src: reader.result, color: color }); });
      };
      reader.readAsDataURL(file);
    });
  }
  function photoTheme(el, dec) {
    var photo = !!(dec && dec.glyph.type === 'photo');
    el.classList.toggle('photo-theme', photo);
    if (!photo) return;
    el.style.setProperty('--photo-ground', dec.ground);
    el.style.setProperty('--photo-ink', dec.groundInk);
    el.style.setProperty('--photo-button-ink', dec.groundInk === WHITE ? '#000000' : WHITE);
  }

  /* ── the decision ──────────────────────────────────────────────────────────
     in : { title, site, user, value, kind, alias, photo }
     out: { alias, glyph:{type,key|src,file}, family, bg, ink, outline, whiten,
            mode, ground, groundInk, groundMode, cardOutline, generating } */
  function decide(o) {
    o = o || {};
    var alias = (o.alias === true || o.alias === false) ? o.alias : isAliasValue(o.value);
    var title = String(o.title || ''), kind = String(o.kind || '').toLowerCase();
    /* MV-4 · title AND kind AND value: three items all called "test" used to
       share one family (Yuan, 18 Sep: "3 个 ground 都是同样的颜色"). The same item
       still hashes the same, wherever it is drawn. */
    var seed = title + '|' + kind + '|' + String(o.value || '');
    var h = hash(seed);
    var fam = FAMILIES[h % FAMILIES.length], swap = ((h >> 3) & 1) === 1;
    var out = { alias: alias, family: fam.name, glyph: null, bg: null, ink: null,
                outline: false, whiten: false, mode: alias ? 'dark' : 'light',
                ground: null, groundInk: null, groundMode: null, cardOutline: false,
                generating: alias, brand: null };

    /* 1 · photo */
    if (o.photo) {
      out.glyph = { type: 'photo', src: o.photo };
      out.ground = photoCache[o.photo] || PAPER;
    } else {
      /* 2 · brand — website, username host, the value's host (non-alias only), title */
      var k = brandKey(o.site) || brandKey(hostOf(o.user)) ||
              (!alias ? brandKey(hostOf(o.value)) : '') || brandKey(title);
      var b = k ? brand(k) : null;
      if (b) {
        out.brand = b;
        out.glyph = { type: 'logo', key: b.key, src: 'assets/' + b.file, file: b.file };
        out.whiten = !b.multi && contrast(b.ink, BLACK) < 3;
        if (b.multi) { out.ground = WHITE; out.cardOutline = true; }
        else out.ground = b.tint;
      } else {
        /* 3 · persona · 4 · property */
        var p = persona(title);
        out.glyph = p ? { type: 'persona', key: p } : { type: 'prop', key: PROPS[kind] || 'logins' };
        if (alias) { out.bg = BLACK; out.ink = fam.light; out.ground = fam.light; }
        else if (swap) { out.bg = fam.light; out.ink = fam.dark; out.ground = fam.light; }
        else { out.bg = fam.dark; out.ink = fam.light; out.ground = fam.dark; }
        out.outline = alias;   /* a black disc on the dark detail top needs an edge */
      }
    }
    out.groundInk = o.photo ? photoInk(out.ground) : inkOn(out.ground);
    out.groundMode = out.groundInk === WHITE ? 'dark' : 'light';
    return out;
  }

  /* ── rendering helpers ─────────────────────────────────────────────────────
     markSVG(key, colour) -> an inline 40x40 svg in `colour` (currentColor when omitted)
     avatarHTML(dec, opts) -> the disc/logo/photo as one <span>; opts.cls adds classes,
       opts.dark = true renders for the dark detail top (outline / whiten applied). */
  function markSVG(key, colour) {
    var d = MARKS[key] || MARKS.logins;
    return '<svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true"' +
      (colour ? ' style="color:' + colour + '"' : '') + '><path d="' + d + '"' +
      (EVENODD[key] ? ' fill-rule="evenodd"' : '') + '/></svg>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function avatarHTML(dec, opts) {
    opts = opts || {};
    var cls = 'av-rule ' + (opts.cls || ''), style = '', inner = '';
    if (dec.glyph.type === 'photo') {
      cls += ' av-photo';
      inner = '<img src="' + esc(dec.glyph.src) + '" alt="">';
    } else if (dec.glyph.type === 'logo') {
      cls += ' av-logo' + (opts.dark && dec.whiten ? ' av-whiten' : '');
      inner = '<img src="' + esc(dec.glyph.src).replace(/ /g, '%20') + '" alt="">';
    } else {
      cls += ' av-mark' + (opts.dark && dec.outline ? ' av-outline' : '');
      style = 'background:' + dec.bg + ';color:' + dec.ink;
      inner = markSVG(dec.glyph.key);
    }
    return '<span class="' + cls.trim() + '"' + (style ? ' style="' + style + '"' : '') +
           ' data-av-glyph="' + esc(dec.glyph.key || dec.glyph.type) + '"' +
           ' data-av-alias="' + (dec.alias ? 1 : 0) + '">' + inner + '</span>';
  }
  /* the CSS the helper needs; a build includes it once */
  var CSS =
    '.av-rule{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;overflow:hidden;flex:none;box-sizing:border-box}' +
    '.av-rule svg{width:100%;height:100%;display:block}' +
    '.av-rule.av-photo img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.av-rule.av-logo{background:none;border-radius:0;overflow:visible}' +
    '.av-rule.av-logo img{width:100%;height:100%;object-fit:contain;display:block}' +
    '.av-rule.av-logo.av-whiten img{filter:brightness(0) invert(1)}' +
    '.av-rule.av-mark.av-outline{box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}';

  var AV = { BLACK: BLACK, WHITE: WHITE, PAPER: PAPER, BRAND: BRAND, FAMILIES: FAMILIES, BRANDS: BRANDS,
             PERSONAS: PERSONAS, PROPS: PROPS, MARKS: MARKS, CSS: CSS,
             hostOf: hostOf, isAliasValue: isAliasValue, brandKey: brandKey, brand: brand, persona: persona,
             luma: luma, contrast: contrast, inkOn: inkOn, modeOf: modeOf, hash: hash,
             dominantColor: dominantColor, photoColor: photoColor, readPhoto: readPhoto, photoTheme: photoTheme, photoInk: photoInk,
             decide: decide, markSVG: markSVG, avatarHTML: avatarHTML };
  if (typeof module !== 'undefined' && module.exports) module.exports = AV;
  root.AV = AV;
})(typeof window !== 'undefined' ? window : globalThis);
