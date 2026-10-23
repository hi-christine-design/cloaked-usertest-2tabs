# Cloaked — Identity redesign · user-test build (V2 / Day30)

**Day 30** of the V2 build — the app after a month of use. Day 1 is the sibling
folder `../DayOne/`, which also carries the fuller README for the V2 folder as a
whole (the three builds, the shared blocks, the hand-off table). Paths and the
tab list below were corrected 17 Sep 2026 (MR-2).

Five tabs: **Home · Activity · Vault · ID card · Profile**. Plus the Companies /
data-removal flow, Call Guard, VPN, the `nq` create-an-identity flow
(`#nqForm` / `#nqGen` / `#nqDetail`), the Family stack (FA-01…28) and the
Protection Journey (`#journeyScreen`).

## Running it

Open **`index.html`**. It draws a phone bezel around `app.html` and scales it to
the window. On a touch device the bezel drops away and the app fills the screen.

`app.html` also runs standalone — you just lose the bezel and the auto-fit.
Share the **whole `V2/` folder** (or deploy it): `index.html` alone is a blank
page because it loads `app.html` in an iframe, and `app.html` loads
`../shared-vault-activity.js` from the folder above this one.

## Where this lives

```
00_Company/7. Netifly/Cloaked/prototype/UserTest/V2/
  DayOne/                    the day-1 build
  Day30/                     this folder
  shared-vault-activity.js   loaded by app.html as ../shared-vault-activity.js
```

`sync.sh` rsyncs this folder to the client mirror
(`02_Clients/2026/2026_Cloaked/04_User Test/UserTest-V2`). It copies this
folder only, so `../shared-vault-activity.js` does not travel — the mirror is
not being maintained for now (Yuan, 17 Sep 2026).

## Layout

```
app.html      published prototype generated from src/; URL remains unchanged
build-app.py  assembles and verifies app.html
src/          ordered, feature-sized editable source parts
index.html    launcher: phone bezel + auto-fit
sync.sh       mirror to the client folder (see above)
assets/       artwork, logos, icons, avatars, videos, embedded sub-prototypes
../shared-vault-activity.js   vault → activity feed sync, shared with V0/V1
```

Notable asset folders:

- `assets/Avatar/` — the single home for avatars: brand marks, people photos
  (`avatar-image/`), address/card artwork
- `assets/logo/` — company and brand logos
- `assets/icons/` — UI glyphs; `assets/navigation/` — the five tab icons
- `assets/vpn/` — the VPN detail page and its globe, embedded as an iframe
- `assets/ID card/` — ID card cover and detail artwork
- `assets/Family/` — the Family stack's artwork
- `assets/data visualization/ssn monitoring/ssn-embed.html` — pushed by propagate, do not hand-edit

## Shared blocks — do not hand-edit

`app.html` carries five blocks between `<!-- SHARED:… BEGIN/END -->` markers
(`family-css`, `family-people`, `journey`, `family`, `page-transition`) plus the
inlined risk chart. They are pushed from `../../V1/` by
`sh ../../V1/shared/propagate.sh` and verified by hash; an edit inside a marker
is overwritten on the next run. Fix it in `V1/Day30/app.html` (family stack) or
`V1/shared/*.js` (the rest) and propagate. See `../DayOne/README.md`.

## Editing the split source

`app.html` remains the deployed entry file, but edits belong in the ordered
files under `src/`. Build and validate with:

```sh
python3 build-app.py
python3 build-app.py --check
```

The build preserves the document order, runs the existing avatar and badge
generators, and verifies that the source parts reproduce `app.html` byte for
byte. Files ending in `.generated.html` are outputs. If the shared family
propagation tool updates `app.html`, capture those generated blocks before the
next build:

```sh
python3 build-app.py --capture-generated
```

## Known loose ends (17 Sep 2026)

- `app.html` links `../../shared-create-flow-polish.css` and `.js` (lines
  ~5573 and ~31533). Neither file exists under `UserTest/` — dead reference in
  all six builds. Decision pending (MR-4).
- Cache stamp is `20260904-d30all` on every `?v=` here; Day 1's is
  `20260904-jrtodo`. Bump the stamp of whichever file you ship.
