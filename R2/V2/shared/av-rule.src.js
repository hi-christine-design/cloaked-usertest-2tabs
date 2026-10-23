/* ═══════════════════════════════════════════════════════════════════════════
   av-rule.js · ONE answer to "what does this Vault item look like" — MV-0
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
  var MARKS = __MARKS__;
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
