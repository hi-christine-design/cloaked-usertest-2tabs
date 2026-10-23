(function () {
  'use strict';

  var STREAMS = {
    trip: ['calls', 'messages', 'mailbox', 'login', 'transactions'],
    hide: ['calls', 'messages', 'mailbox', 'login'],
    biz: ['calls', 'messages'],
    dating: ['calls', 'messages', 'mailbox', 'login'],
    trials: ['mailbox', 'login']
  };

  var CARD_ART = {
    trip: 'assets/Avatar/avatar-image/cancun trip.png',
    hide: 'assets/Avatar/avatar-Vault item/Hide my info.svg',
    biz: 'assets/Avatar/avatar-Vault item/Business Contact.svg',
    dating: 'assets/Avatar/avatar-Vault item/Dating.svg',
    trials: 'assets/Avatar/avatar-Vault item/Free Trail.svg'
  };

  /* Initial-only activity avatars use the same identity colour as the card
     badge beside them. Static rows already carried these inline; synced vault
     rows did not, which left the letter floating on the white page. */
  var CARD_COLOR = {
    trip: '#acc28d',
    hide: '#ff550c',
    biz: '#b9a56c',
    dating: '#d5a2b9',
    trials: '#a8d9da'
  };

  var BRAND_ART = {
    Airbnb: 'assets/logo/Airbnb.svg',
    Amazon: 'assets/logo/Amazon.png',
    Bumble: 'assets/logo/Bumble.svg',
    Delta: 'assets/logo/Delta.png',
    Doordash: 'assets/logo/Doordash.svg',
    HBO: 'assets/logo/HBO.png',
    Hinge: 'assets/logo/Hinge.svg',
    Lululemon: 'assets/logo/Lululemon.png',
    Lyft: 'assets/logo/Lyft.svg',
    McDonald: 'assets/logo/mcdonald.svg',
    "McDonald's": 'assets/logo/mcdonald.svg',
    Nike: 'assets/logo/Nike.svg',
    Spotify: 'assets/logo/Spotify.png',
    Target: 'assets/logo/Target.svg',
    Workday: 'assets/logo/Workday.png'
  };

  var KIND = {
    calls: 'call',
    messages: 'message',
    mailbox: 'email',
    login: 'login',
    transactions: 'transaction'
  };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function asset(path) {
    if (!path) return '';
    if (path.indexOf('assets/') === 0) return path;
    if (path.indexOf('/') >= 0) return path.indexOf('logo/') === 0 ? 'assets/' + path : path;
    return 'assets/logo/' + path;
  }

  function cleanLabel(label) {
    var out = String(label || '').replace(/2027/g, '2026').replace(/JUNE/g, 'JUN');
    return out.replace(/\s+,/g, ',').replace(/,(?=\d)/g, ', ');
  }

  function timeValue(label) {
    var text = cleanLabel(label).toUpperCase();
    var base = new Date(2026, 7, 24, 16, 0, 0).getTime();
    var match;
    if ((match = text.match(/^(\d+)\s+HOURS?\s+AGO/))) return base - Number(match[1]) * 3600000;
    if ((match = text.match(/^TODAY(?:\s+(\d{1,2}):(\d{2})\s*(AM|PM))?/))) {
      if (!match[1]) return base;
      var hour = Number(match[1]) % 12 + (match[3] === 'PM' ? 12 : 0);
      return new Date(2026, 7, 24, hour, Number(match[2]), 0).getTime();
    }
    if (text === 'YESTERDAY') return new Date(2026, 7, 23, 12, 0, 0).getTime();
    var parsed = Date.parse(text.replace(/^(JUL|JUN|APR|AUG)\s+/, function (m) { return m; }));
    return isNaN(parsed) ? 0 : parsed;
  }

  /* The crossed circle the feed's own hand-written spam rows draw, verbatim, so
     a synced row and an authored one in the same column are one mark. */
  var SPAM_MARK = '<svg viewBox="0 0 24 24" fill="#fff" style="width:22px;height:22px;display:block"><path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM7.22 17.78A7.5 7.5 0 0 0 17.78 7.22zM12 4.5A7.5 7.5 0 0 0 6.17 16.71L16.71 6.17A7.46 7.46 0 0 0 12 4.5z"/></svg>';
  /* GLYPH.unknown — the mark the vault log and the ID card list already use for
     a caller with no name. This file ships no CSS, so the disc and the glyph
     size are inline rather than a class. */
  var UNKNOWN_MARK = '<svg viewBox="0 0 24 24" fill="#fff" style="width:26px;height:26px;display:block">' +
    '<g transform="translate(-8.3,-8.49) scale(1.0262)"><path d="M24.5557 27.5283H23.1338V26.0498H24.5557V27.5283Z"/><path d="M24.0107 20.501C24.546 20.51 25.1161 20.6638 25.5723 21C26.0461 21.3494 26.3994 21.9048 26.3994 22.6299C26.399 23.6944 25.5544 24.2367 25.1611 24.5146C24.9109 24.6915 24.7533 24.8067 24.6455 24.9277C24.5609 25.023 24.545 25.0804 24.5449 25.1445V25.3438H23.123V25.1445C23.1232 24.618 23.3398 24.218 23.6016 23.9238C23.8413 23.6546 24.1476 23.4431 24.3613 23.292C24.6212 23.1083 24.7782 22.9837 24.8711 22.8779C24.9544 22.783 24.9774 22.7133 24.9775 22.6299C24.9775 22.4559 24.9082 22.3219 24.75 22.2051C24.5727 22.0743 24.2969 21.9828 23.9883 21.9775C23.6791 21.9724 23.4131 22.0555 23.2461 22.1768C23.1039 22.2802 23.0216 22.4135 23.0215 22.6299V23.1895H21.5996V22.6299C21.5997 21.8908 21.9415 21.322 22.4316 20.9658C22.8981 20.6271 23.4762 20.4921 24.0107 20.501Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 17.5C27.5899 17.5 30.5 20.4101 30.5 24C30.5 27.5899 27.5899 30.5 24 30.5C20.4101 30.5 17.5 27.5899 17.5 24C17.5 22.7422 17.858 21.5682 18.4766 20.5732C17.7597 20.2859 16.9271 20.125 16 20.125C14.3381 20.125 12.9802 20.6389 12.0469 21.4795C11.1204 22.3139 10.5625 23.5132 10.5625 25H9.0625C9.0625 23.1118 9.78341 21.4986 11.043 20.3643C12.2956 19.2362 14.0311 18.625 16 18.625C17.2679 18.625 18.4382 18.8793 19.4463 19.3613C20.619 18.2099 22.2267 17.5 24 17.5ZM24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16 9.25C18.2782 9.25 20.125 11.0968 20.125 13.375C20.125 15.6532 18.2782 17.5 16 17.5C13.7218 17.5 11.875 15.6532 11.875 13.375C11.875 11.0968 13.7218 9.25 16 9.25ZM16 10.75C14.5503 10.75 13.375 11.9253 13.375 13.375C13.375 14.8247 14.5503 16 16 16C17.4497 16 18.625 14.8247 18.625 13.375C18.625 11.9253 17.4497 10.75 16 10.75Z"/></g></svg>';
  /* An initial is a LETTER. charAt(0) on these rows returns "(", "+" or a digit,
     which is the whole reason a Spam feed of phone numbers came out reading
     "( + 2". Same test the vault's vtInitial uses. */
  function initialOf(title) {
    var m = String(title || '').replace(/^SMS\s+[—-]\s+/, '').match(/[A-Za-z\u00c0-\u024f]/);
    return m ? m[0].toUpperCase() : '';
  }

  function avatar(card, stream, title, meta, unread, state) {
    meta = meta || {};
    var path = meta.img2 || asset(meta.img) || BRAND_ART[title];
    /* A login is already the item being reported, so a second item badge only
       repeats the same fact. Other inbox events identify the ID card that
       received them; transactions identify the virtual card that paid. */
    var badge = stream === 'login' ? ''
      : stream === 'transactions'
        ? '<i class="av-badge av-badge-payment-card"></i>'
        : '<i class="av-badge av-badge-' + card + '"></i>';
    var badgeClass = badge ? ' has-badge' : '';
    var unreadClass = unread ? ' has-dot' : '';
    var unreadDot = unread ? '<i class="av-dot"></i>' : '';
    /* Blocked FIRST — before the logo and before the initial. A blocked row is
       reporting the block, not the sender, so what it shows is the block's mark
       whatever else is known about the name. It also catches the summary rows
       ("Blocked — 14 senders"), which do hold a letter and would otherwise
       keep drawing "B" for something that is not a sender at all. */
    if (state === 'spam' || meta.glyph === 'spam') {
      return '<div class="av-av av-av-cg' + badgeClass + unreadClass + '">' + SPAM_MARK + unreadDot + badge + '</div>';
    }
    if (path) {
      return '<div class="av-av av-av-brand' + badgeClass + unreadClass + '"><img src="' + esc(path) + '" alt="">' + unreadDot + badge + '</div>';
    }
    var initial = initialOf(title);
    /* No logo, no letter: a bare number, and the honest mark for it is the one
       the rest of the app draws for a caller it cannot name. */
    if (!initial) {
      return '<div class="av-av' + badgeClass + unreadClass + '" style="background:#0b0b0a">' +
        UNKNOWN_MARK + unreadDot + badge + '</div>';
    }
    return '<div class="av-av av-av-ini' + badgeClass + unreadClass + '" style="background:' +
      (CARD_COLOR[card] || '#e0ddd6') + ';color:#141410">' + esc(initial) + unreadDot + badge + '</div>';
  }

  /* A deliberate sample, not "everything recent". The mix makes the Unread
     tab useful while preserving plenty of read rows for comparison. Keys use
     the event's stable content rather than its array index, so reordering a
     day cannot move the unread state onto a different event. */
  function isUnread(card, stream, label, entry) {
    var title = entry[0] || '', subtitle = entry[1] || '';
    return (card === 'trip' && stream === 'calls' && title === 'Casa del Mar Resort' && /9:15AM/i.test(label)) ||
      (card === 'trip' && stream === 'messages' && /^Your room is ready/.test(subtitle)) ||
      (card === 'trip' && stream === 'mailbox' && title === 'Delta' && /2 HOURS AGO/i.test(label)) ||
      (card === 'hide' && stream === 'calls' && title === 'Hospital' && /^TODAY/i.test(label)) ||
      (card === 'biz' && stream === 'messages' && title === 'Dana Whitfield') ||
      (card === 'dating' && stream === 'calls' && title === 'Leah') ||
      (card === 'trials' && stream === 'mailbox' && title === "McDonald's");
  }

  function rowHTML(card, stream, label, entry) {
    var title = entry[0] || '';
    /* Yuan, 25 Aug: "整个 app 里不再有 login 这个概念，都是 password".
       The stream KEY stays 'login' — that is the data's own name for it, in both
       builds' A[], and nobody reads it. */
    var subtitle = stream === 'login' ? 'Password created' : (entry[1] || '');
    var state = entry[2] || '';
    var meta = entry[3] || {};
    var tag = '';
    var amount = '';
    if (stream === 'calls') {
      tag = state === 'vm' ? 'Voicemail' : state === 'spam' ? 'Spam' : state === 'missed' ? 'Missed' : 'Call';
    } else if (stream === 'messages') {
      tag = state === 'spam' ? 'Spam' : 'Message';
    } else if (stream === 'mailbox') {
      tag = state === 'spam' ? 'Spam' : 'Email';
    } else if (stream === 'transactions') {
      amount = state.indexOf('amt:') === 0 ? state.slice(4) : state;
    }
    var tagHTML = tag ? '<span class="av-tag' + (tag === 'Spam' ? ' spam' : '') + '">' + tag + '</span>' : '';
    var amountHTML = amount ? '<span class="av-amt-right">' + esc(amount) + '</span>' : '';
    return '<div data-cat="identity" data-kind="' + KIND[stream] + '" data-card="' + card + '" class="av-row av-vault-row">' +
      avatar(card, stream, title, meta, isUnread(card, stream, label, entry), state) +
      '<div class="av-body"><div class="av-row-top"><span class="av-row-title">' + esc(title) + '</span></div>' +
      (subtitle ? '<div class="av-row-sub' + ((state === 'vm' || subtitle.length > 54) ? ' two' : '') + '">' + esc(subtitle) + '</div>' : '') +
      '</div>' + tagHTML + amountHTML + '</div>';
  }

  function removeLegacyVaultRows(section) {
    section.querySelectorAll('.av-row[data-cat="identity"], .av-row[data-cat="idcard"]').forEach(function (row) {
      row.remove();
    });
    section.querySelectorAll('.av-group').forEach(function (group) {
      var node = group.nextElementSibling;
      var hasRow = false;
      while (node && !node.classList.contains('av-group')) {
        if (node.classList.contains('av-row')) hasRow = true;
        node = node.nextElementSibling;
      }
      if (!hasRow) group.remove();
    });
  }

  function syncVaultActivity() {
    var source = window.DAY30_VAULT_ACTIVITY;
    var screen = document.getElementById('activityScreen');
    if (!source || !screen || screen.querySelector('.av-vault-sync')) return;

    var sections = screen.querySelectorAll('.av-section');
    if (sections.length < 2) return;
    var completed = sections[sections.length - 1];
    removeLegacyVaultRows(completed);

    var groups = {};
    Object.keys(STREAMS).forEach(function (card) {
      STREAMS[card].forEach(function (stream) {
        var blocks = source[card] && source[card][stream];
        (blocks || []).forEach(function (block) {
          var label = cleanLabel(block[0]);
          if (!groups[label]) groups[label] = [];
          (block[1] || []).forEach(function (entry) {
            groups[label].push(rowHTML(card, stream, label, entry));
          });
        });
      });
    });

    var labels = Object.keys(groups).sort(function (a, b) { return timeValue(b) - timeValue(a); });
    var vaultSection = document.createElement('div');
    vaultSection.className = 'av-section av-vault-sync';
    vaultSection.innerHTML = labels.map(function (label) {
      return '<div class="av-group" data-vault-date="true">' + esc(label) + '</div>' + groups[label].join('');
    }).join('');
    completed.parentNode.insertBefore(vaultSection, completed);
  }

  syncVaultActivity();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncVaultActivity);
  window.syncVaultActivity = syncVaultActivity;
})();
