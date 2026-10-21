/* ── Debug badge (MB) · runtime, shared by V2/DayOne and V2/Day30 ─────────────
   Ported from V1/Day30's `<script id="debugBadge">` (MD, MP-6, MZ-63). The
   mechanics are unchanged; only the tables differ per build and are injected by
   badge/build-badge.py, which also fills in the line numbers.

   Switches: press D / triple-tap the top-right corner / ?debug=1 / the checkbox
   in index.html. State lives in sessionStorage (survives reload, resets when
   the tab closes). Off = nothing is generated; only one keydown and one
   pointerdown listener exist, neither calls preventDefault.

   Why the whole stack and not one page: goTab's exclusivity covers only the
   tab roots; monitorScreen / vaultsScreen go through openScreen and are never
   closed by a later tab switch, so several screens can be .open at once. */
(function () {
  'use strict';
  var KEY = '__KEY__';
  var SEC = __SEC__;
  var L0 = __L0__;
  var L1 = __L1__;
  var L2 = __L2__;
  var L1SEL = '__L1SEL__';
  var L2SEL = '__L2SEL__';
  var VARIANT = __VARIANT__;
  var PUSH = __PUSH__;
  var HOME = __HOME__;

  var on = false, wrap = null, lastSig = '', timer = null;
  function ss(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); }
    catch (e) { return null; }
  }
  function sectionOf(code) {
    var m = /^([A-Z]{2,3})-/.exec(code || '');
    return m ? SEC[m[1]] : null;
  }
  function zOf(el) { var z = parseInt(getComputedStyle(el).zIndex, 10); return isNaN(z) ? 0 : z; }
  function topmost(els) {
    var best = null, bz = -Infinity, bi = -1;
    els.forEach(function (el, i) { var z = zOf(el); if (z > bz || (z === bz && i > bi)) { best = el; bz = z; bi = i; } });
    return best;
  }
  function keyOf(el) {
    var v = VARIANT[el.id];
    if (v) {
      /* two-class keys first ('fd-set.fd-margaret'), then one-class */
      for (var i = 0; i < v.length; i++) {
        var parts = v[i].split('.'), ok = true;
        for (var j = 0; j < parts.length; j++) if (!el.classList.contains(parts[j])) { ok = false; break; }
        if (ok) return el.id + '.' + v[i];
      }
    }
    return el.id;
  }
  function row(lay, el, tbl, isTop) {
    var k = keyOf(el);
    var m = tbl[k] || tbl[el.id] || ['—', el.className || el.tagName, 0, ''];
    return { lay: lay, id: k, code: m[0], label: m[1], ln: m[2] || 0, file: m[3] || '', top: !!isTop, z: zOf(el) };
  }
  function read() {
    var l0 = [].slice.call(document.querySelectorAll('[id$="Screen"].open, .screen.open'));
    var wf = document.getElementById('welcomeFlow');
    if (wf && getComputedStyle(wf).display !== 'none' && wf.offsetHeight) l0.push(wf);
    var seen = {}; l0 = l0.filter(function (e) { if (seen[e.id]) return false; seen[e.id] = 1; return true; });
    var l1 = [].slice.call(document.querySelectorAll(L1SEL));
    var l2 = [].slice.call(document.querySelectorAll(L2SEL));
    return { l0: l0, l1: l1, l2: l2, top: topmost(l0.concat(l1)) };
  }
  function collect() {
    var s = read(), rows = [];
    s.l0.forEach(function (el) { rows.push(row('L0', el, L0, el === s.top)); });
    s.l1.forEach(function (el) { rows.push(row('L1', el, L1, el === s.top)); });
    s.l2.forEach(function (el) { rows.push(row('L2', el, L2, false)); });
    /* Home is not a screen — it is the document itself */
    if (!s.l0.length) {
      var mfc = document.getElementById('d1jMyFam');
      var famOn = !!(mfc && !mfc.classList.contains('is-off'));
      var h = famOn ? HOME.family : HOME.plain;
      rows.unshift({ lay: 'L0', id: famOn ? '(Home).family-card' : '(Home)', code: h[0], label: h[1],
                     ln: h[2] || 0, file: '', top: !s.l1.length, z: 0 });
    }
    return rows;
  }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function baseId(id) { return String(id).split('.')[0]; }
  function pushParent(rows) {
    var t = rows.filter(function (r) { return r.top; })[0];
    return t ? (PUSH[baseId(t.id)] || null) : null;
  }
  function lnTxt(r) { return r.ln ? ((r.file ? r.file + ' ' : '') + 'L' + r.ln) : ''; }
  function paint(rows) {
    var pp = pushParent(rows);
    function isStaleRow(r) { return r.lay === 'L0' && !r.top && baseId(r.id) !== '(Home)' && baseId(r.id) !== pp; }
    var stale = rows.filter(isStaleRow).length;
    var head = rows.filter(function (r) { return r.top; })[0] || rows[0];
    var deepest = rows.filter(function (r) { return r.lay === 'L2'; }).pop()
               || rows.filter(function (r) { return r.lay === 'L1'; }).pop() || head;
    document.getElementById('dbgPillTxt').innerHTML =
      '<b>' + esc(deepest.code) + '</b> <i>' + esc(baseId(deepest.id) === '(Home)' ? 'Home' : '#' + deepest.id) + '</i>' +
      (stale ? ' <span class="dbgWarn">⚠' + stale + '</span>' : '');
    var h = '';
    rows.forEach(function (r) {
      var isStale = isStaleRow(r), ln = lnTxt(r);
      h += '<div class="r"><div class="h">' +
        '<span class="lay">' + r.lay + '</span>' +
        '<span class="id' + (r.top ? ' top' : '') + '">' + esc(baseId(r.id) === '(Home)' ? r.id : '#' + r.id) + '</span>' +
        (isStale ? '<span class="mk">⚠ stale, still open</span>' : (r.top ? '<span class="top">← topmost</span>' : '')) +
        (ln ? '<span class="ln">' + esc(ln) + '</span>' : '') +
        '</div><div class="code">' + esc(r.code) + '</div>' +
        '<div class="lbl">' + esc(r.label) + '</div></div>';
    });
    h += '<hr><div class="foot"><span>Figma Section ' + esc(sectionOf(deepest.code) || '(not coded)') +
         '</span><button id="dbgCopy">Copy</button></div>' +
         '<div class="foot" style="margin-top:4px">' + esc(BUILD) + ' · layers not listed are not open · D closes · or triple-tap top-right</div>' +
         '<div class="foot" id="dbgProbe" style="margin-top:4px;display:none;font-variant-numeric:tabular-nums"></div>';
    var panel = document.getElementById('dbgPanel');
    panel.innerHTML = h;
    document.getElementById('dbgCopy').onclick = function (e) {
      e.stopPropagation();
      var t = [BUILD, probe()].filter(Boolean).concat(rows.map(function (r) {
        return r.lay + '  ' + (baseId(r.id) === '(Home)' ? r.id : '#' + r.id) + '  ' + r.code +
               (lnTxt(r) ? '  ' + lnTxt(r) : '') + (r.top ? '  <= top' : '') + (isStaleRow(r) ? '  !! stale' : '');
      })).join('\n');
      var b = this;
      try { navigator.clipboard.writeText(t).then(function () { b.textContent = 'Copied'; }, function () { b.textContent = 'Copy failed'; }); }
      catch (err) { b.textContent = 'Copy failed'; }
    };
  }
  var BUILD = '__BUILD__';
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
      o.push('up' + (sec.classList.contains('up') ? '\u2713' : '\u2717'),
             'kbd' + (kbd && kbd.classList.contains('on') ? '\u2713' : '\u2717'),
             'words' + (sec.classList.contains('words') ? '\u2713' : '\u2717'),
             'sec ' + sec.clientHeight + '/' + sec.scrollHeight + '@' + Math.round(sec.scrollTop) + ' ' + cs.overflowY);
    }
    o.push('app@' + (app ? Math.round(app.scrollTop) : '-'), 'win@' + Math.round(window.scrollY || 0),
           'vv ' + (window.visualViewport ? Math.round(window.visualViewport.height) : '-') + '/' + window.innerHeight);
    return o.join(' \u00b7 ');
  }
  var lastProbe = '';
  function paintProbe() {
    var p = probe(), el = document.getElementById('dbgProbe');
    if (!el) return;
    if (p !== lastProbe) { lastProbe = p; el.textContent = p; el.style.display = p ? '' : 'none'; }
  }
  function tick() {
    if (!on) return;
    var rows = collect();
    var sig = rows.map(function (r) { return r.lay + r.id + r.top; }).join('|');
    if (sig !== lastSig) { lastSig = sig; lastProbe = ''; paint(rows); }
    paintProbe();
  }
  function build() {
    wrap = document.createElement('div');
    wrap.id = 'dbgWrap';
    wrap.innerHTML = '<div id="dbgPill"><span id="dbgPillTxt"></span></div><div id="dbgPanel"></div>';
    document.body.appendChild(wrap);
    document.getElementById('dbgPill').onclick = function () { wrap.classList.toggle('open'); };
    lastSig = ''; tick(); timer = setInterval(tick, 200);
  }
  function destroy() {
    if (timer) { clearInterval(timer); timer = null; }
    if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
    wrap = null;
  }
  function set(v) {
    v = !!v;
    if (v === on) return;
    on = v; ss(KEY, v ? '1' : '0');
    if (on) build(); else destroy();
    try { if (window.parent && window.parent !== window) window.parent.postMessage({ cloakedDebugState: on }, '*'); } catch (e) {}
  }
  window.cloakedDebug = function (v) { set(v === undefined ? !on : v); return on; };
  var q = null;
  try { q = new URLSearchParams(location.search).get('debug'); } catch (e) {}
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'd' && e.key !== 'D') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    set(!on);
  });
  var taps = [];
  document.addEventListener('pointerdown', function (e) {
    if (e.clientX < window.innerWidth - 44 || e.clientY > 44) return;
    var now = Date.now();
    taps = taps.filter(function (t) { return now - t < 1200; });
    taps.push(now);
    if (taps.length >= 3) { taps = []; set(!on); }
  }, true);
  window.addEventListener('message', function (e) {
    if (e.data && e.data.cloakedDebug !== undefined) set(!!e.data.cloakedDebug);
  });
  function boot() {
    if (q === '1') set(true);
    else if (q === '0') { ss(KEY, '0'); }
    else if (ss(KEY) === '1') set(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
