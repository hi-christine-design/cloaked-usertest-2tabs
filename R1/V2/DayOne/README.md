# Cloaked — Identity redesign · user-test build (V2 / DayOne)

**Day 1** of the V2 build. Day 30 is the sibling folder `../Day30/` — both are in
the folder and both are live; see *The V2 folder* below. (Rewritten 17 Sep 2026,
MR-1. The previous text dated from 20–25 Aug and still described Day 30 as
archived and the folders under their pre-23-Aug names.)

| File | What it is |
| --- | --- |
| `index.html` | The hub — phone bezel, auto-fit, and the Identity row that loads Day 01. Open this one. |
| `app.html` | **Day 1** — the first session after signup. The hub loads it as `app.html?skip=1&tab=home`. |
| `css/day01.css` · `css/v1-vault-add.css` | Day 1's stylesheets (Day 30 inlines everything in its `app.html`). |
| `js/day01.js` | Day 1's own logic — the `d1j` create flow, the `ONB` hand-off table, the Protection Journey rows. |
| `assets/` | Everything the build pulls in: icons, avatars, data-viz pages, the onboarding and VPN sub-prototypes. |
| `manifest.webmanifest` | Install-to-homescreen name/icon. **Not linked from `app.html` on purpose** — see the long comment at the top of that file. |

`app.html` runs standalone too — you just lose the bezel and the auto-fit.

## The V2 folder

```
UserTest/V2/
  DayOne/                    this folder
  Day30/                     the day-30 build (app.html, index.html, sync.sh)
  shared-vault-activity.js   loaded by Day30/app.html as ../shared-vault-activity.js
```

Five tabs in both days: **Home · Activity · Vault · ID card · Profile**. Vault and
ID card are separate destinations. On day one the ID-card tab is the animated
pitch ("Every email, phone number and signup hands out the real you." → "Be
yourself, without exposing yourself.") behind *Skip intro*, landing on
Learn more / Create ID card.

## The three builds (V0 / V1 / V2)

Renumbered 23 Aug 2026 and moved under `UserTest/V{0,1,2}/{DayOne,Day30}` on
26 Aug. Anything written before those dates — `user-test-plan.html`, older
handoffs, the `explorations/2026-08-20_…` archive — uses the old
`DayOne-V1/V2/V3` names. The `?v=` cache-buster stamps date the code, not the
slot.

| Build | Bottom nav | Notes |
| --- | --- | --- |
| `V0` | Home · Data Removal · Call Guard · Identities · Pay | The oldest fork; its own README still describes the pre-restructure layout. |
| `V1` | Day 1: Home · Activity · Vault · Profile — Day 30: Home · Activity · Guard · Vault · Profile | **The maintained copy.** Holds `DayOne/.vercel` (deploys), `Day30/structure/` (milestone logs, conventions, debug badge), and `shared/` (see below). |
| `V2` | Home · Activity · Vault · ID card · Profile (both days) | This build. ID card is its own tab. |

## Shared blocks — do not hand-edit

Most of the Family feature, the Protection Journey, the page transitions and the
risk chart are **one source in `../../V1/shared/`**, pushed into every build by
`sh ../../V1/shared/propagate.sh` and verified by hash
(`propagate.sh --check` changes nothing and reports the hashes).

In this folder the pushed blocks sit in `app.html` between markers:

```
<!-- SHARED:family-css BEGIN -->    …    <!-- SHARED:family-css END -->
<!-- SHARED:family-people BEGIN --> …    <!-- SHARED:family-people END -->
<!-- SHARED:family BEGIN -->        …    <!-- SHARED:family END -->
<!-- SHARED:page-transition BEGIN --> …  <!-- SHARED:page-transition END -->
```

plus the inlined `risk-chart` body and `assets/data visualization/ssn monitoring/ssn-embed.html`.
An edit inside a marker is overwritten on the next propagate. Fix it in
`V1/Day30/app.html` (family stack) or `V1/shared/*.js` (the rest) and propagate.
The comments inside those blocks talk about `V1/DayOne`, `V1/Day30` and
`V1/shared` — that is correct, they were written for the source.

## Where Day 1's feature cards go

The `ONB` table in `js/day01.js` is the one place. As of 17 Sep:

| Card / entry | Opens | Where |
| --- | --- | --- |
| Identity alias | `assets/onboarding/alias/intro-v2-expressive-long.html` | in this folder, overlay iframe |
| Block spam calls / emails (Home tile, Guard : Off pill) | `assets/onboarding/call-guard/call-guard-intro-v2.html?page=final&…` | in this folder, overlay iframe |
| Cloaked Pay | `assets/onboarding/pay/intro-v1.html?page=2` | in this folder, overlay iframe |
| Data removal | `#monitorScreen` — the Monitoring screen in `app.html` (Figma 6841:220627) | in-file |
| VPN | `#vpnHomeScreen` → `assets/vpn/vpn-home.html`, same route Day 30 uses | in-file |

Two `ONB` entries are **dead but kept**: `drSending` (climbs to a
`03_User Journey/` folder that does not exist beside `prototype/`) and `vpnLive`
(`../../../vpn-final/Onboarding V1.html` — the folder exists, nothing calls the
key). Their comments in `day01.js` say why.

`app.html` floats its own 40px back circle over every overlay (`.d1j-back`,
left 20 / top 64) — which is why the embedded pages leave that slot empty
instead of drawing a second back button.

## Known loose ends (17 Sep 2026)

- `app.html` links `../../shared-create-flow-polish.css` and `.js`. Neither
  file exists anywhere under `UserTest/` — a dead reference in all six builds.
  Decision pending (MR-4).
- Cache stamp is `20260904-jrtodo` on every `?v=` in this folder; Day 30's is
  `20260904-d30all`. Bump the stamp of whichever file you ship.
