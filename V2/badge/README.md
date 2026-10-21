# V2 · Debug badge (MB)

The on-screen short-code badge, ported from V1 (`V1/Day30/structure/MD-debug-badge.md`
has the full story; the mechanics here are the same). It lets a report say
`FA-20 #d1jFamDetail.fd-lisa` instead of a screenshot.

## Files

| File | Role |
| --- | --- |
| `build-badge.py` | **The tables** (L0 screens / L1 panes / L2 sheets, per build) and the writer. Edit codes here. |
| `badge-runtime.js` | The badge's JS, one copy for both builds. `__L0__` etc. are filled by the builder. |
| `badge.css` | The badge's styles (verbatim from V1). |

Outputs, never edit by hand:

- `../DayOne/app.html` and `../Day30/app.html` — one block right before `</body>`,
  between `<!-- BADGE BEGIN … -->` / `<!-- BADGE END -->`.
- `../DayOne/index.html` and `../Day30/index.html` — three pieces (CSS, the
  "Debug badge" checkbox under the sidebar, the sync script), each between
  `BADGE-INDEX … BEGIN/END` markers.

```sh
python3 build-badge.py            # (re)write all four files
python3 build-badge.py --check    # say what would change, touch nothing
python3 build-badge.py --strip    # remove the badge; files come back byte-identical
```

**Re-run after propagate.** Line numbers are resolved at build time (first
`id="…"` in `app.html`, else in `js/day01.js`), so any edit that shifts lines —
propagate always does, for Day 30 — leaves stale numbers until the next build.
The codes themselves do not move.

## Using it

Off by default; nothing is in the DOM until it is switched on. Four ways in:
press **D** (not while typing in a field), triple-tap the top-right 44×44 corner
within 1.2 s, `app.html?debug=1` (`?debug=0` forces off and forgets), or the
**Debug badge** checkbox in `index.html`'s sidebar. State is in
`sessionStorage`: survives reload and tab switches, resets when the browser tab
closes. Console: `cloakedDebug()` toggles, `cloakedDebug(true/false)` sets.

Collapsed: `<code> #<id>` of the deepest open layer, plus `⚠N` when N screens
are left open under the top one. Tap to expand: every open layer, three lines
each — id + line number, code, what the page is — and the Figma section
node-id / fileKey of the deepest code, with a Copy button (plain text, paste it
straight into chat). "Layers not listed are not open."

## Codes

Shared modules keep V1's codes — the family stack `FA-01…33`, the journey
`OB-11 · FA-02`, activity `AB-01…04`, activity readers `AD-`, the `nq` create
flow `CIP/CIE/CIN/CIC/CIM-`. `—` means deliberately uncoded (boot, orphans,
iframes). V2-only screens got their own sections on 17 Sep 2026 (MB-2):

| Section | Screens |
| --- | --- |
| `HM-01` | Home, both days (a day is a state; with the My Family card it reads `HM-01 · FA-01`) |
| `IC-01…05` | ID card tab: `IC-01` wallet `#icL1` · `IC-02` card detail `#icL2` (Cancun `· FA-25`, Free trials `· FA-26`) · `IC-03` create flow `#icCreate` · `IC-04` "Add to which ID card?" `#vtcSheet` · `IC-05` row actions `#icRowSheet` |
| `VT-01…04` | Vault tab: `VT-01` the list `#vtL2` · `VT-02` one item `#vtL3` · `VT-03` one message `#vtL4` · `VT-04` all items / select mode `#allItemsScreen` |
| `CE-01…06` | Create email (Day 30, `mk` flow), in step order: `CE-01` what kind `#vtAddEmail` · `CE-02` purpose `#mkEmail` · `CE-03` special words `#mkWords` · `CE-04` Custom tray `#mkCust` · `CE-05` additional info `#mkInfo` · `CE-06` new email landed `#mkDetail` |
| `DC-01…07` | Day-1 create (`d1j`): `DC-01` add item form · `DC-02/03` alias wizard phone/email · `DC-04/05` alias editor phone/email · `DC-06` item detail · `DC-07` Others |
| `FA-34/35` | Family layers only V2 has: `FA-34` phone guard `#d1jFamGuard` · `FA-35` switch view tray `#d1jSwitchView` |

`#famFlow` / `#famMember` (Day 1) are the legacy kid-enrolment flow, superseded
by `FA-07…16` / `FA-19…23`; they stay `—`. A `?` in a table means a code is
still pending — `build-badge.py` prints how many.

State variants: one element can be several Figma frames. `VARIANT` maps an id
to the classes that tell them apart; a table key is then `id.class` (or
`id.class.class`). Order matters when classes co-exist — `en-step-age` before
the step it stacks on, `fd-set.fd-margaret` before `fd-set`, `fd-noinvite`
before `fd-lisa`.

Day 1 plays the welcome sequence on a home entry, so the badge's first row
there is `#welcomeFlow` until it is dismissed; `?intro=0` skips it.
