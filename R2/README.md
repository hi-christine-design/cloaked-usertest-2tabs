# UserTest_V2 — Identities, round 2 changes (16 Oct 2026)

Open **index.html**. Left: the checklist. Middle: the prototype. Right: one slide per change
(Before / After / Why, in English). Tap a checklist item and the phone opens that screen and
rings what changed. Use **Before / After** to flip between the build as tested and this build,
and the **Rename to** toggle to compare Alias / Identity / Profile. Layout follows Figma Identity—WIP 9473:52370; the controls (Build, Rename to, Before / After, prev / next, Show again) reuse its selection-pill style.

## What's here

```
index.html            launcher (Figma 9566:69873, 19 Oct: left = title + controls at the foot — Build · Tabs (2 Tabs | 1 Tab (Toggle)); 20 Oct: no Naming or Onboarding controls — the name follows Tabs (2 Tabs = Identity, 1 Tab = Folder) and the Vault intro is always the banner; middle = phone; right = Checklist (20 Oct: grouped into conversation points — 01 Rename “ID card” · 02 Make aliases clear · 03 More guidance · 04 Faster creation · Things we didn't change (Risk level) · Still open; each group has its research line, rows have no numbers; GROUPS in index.html), the picked row opens into Where · Before|After · Why · Note · Show again; all text 10px; ←/→ and Esc still work)
assets/launcher/      check.svg from the Figma frame
V2/                   copy of UserTest/V2 (Day30 + DayOne), originals untouched
  ut2/ut2.js          the round-2 changes, as one layer on top of the build
  ut2/ut2.css
  Day30/app.html      = V2 + two lines that load ut2 (src/130-family-day30-data.html, rebuilt with build-app.py)
  DayOne/app.html     = V2 + the same two lines, just above the BADGE block
D2-explore/           unchanged
```

## How the layer works

- `?ut2=after` (default) applies the changes. `?ut2=before` is V2 exactly as it was tested.
- `?ut2name=identity|folder` sets what "ID card" is called (default identity; the launcher sends folder with 1 Tab (Toggle) and identity with 2 Tabs unless Naming is picked by hand).
- `?ut2cards=tab|toggle` (default tab). toggle = no ID card tab; the Vault and the ID card wallet share a floating "Items | Folders" toggle (Figma 9561:65816 light glass pill — was dark 9542:53109 — bottom-left beside the +; on scroll-down (build's body.nav-down) it slides 56 down to 40 from the foot, Figma 9561:66347; icons exported to V2/ut2/icons/). Same frame for the Vault screen in toggle mode: “Vaults” header + tab bar, search “ID Cards, Logins, Phone…”, tabs All · ID cards (→ Folders) · Login · Phone · Email (+ Payment / Bank when present; Day 1 shows the strip in toggle mode; the Vault one-line sub is hidden in toggle mode). Folders empty state (Figma 9564:67265): “My ID cards” + “?”, bordered card “Start grouping your vault items” / “+ Create a new folder” → icOpenCreate(); no + fab or count row; once an ID card exists the build’s wallet shows, with “+ Create a new folder” (56 r240, 12 under the stack, Figma 9566:68966) instead of the + fab, and no ⓘ / sub line and the Vault tab stays lit (after mode only). The launcher's "Tabs" control (2 Tabs = tab, 1 Tab (Toggle) = toggle) sets it for every slide; slide 19 always opens toggle.
- `?ut2intro=outside|inside|first` — Day 01 Vault intro. Default is `outside` (the fallback in `ut2.js`; the launcher always sends `outside`). `banner` is read as `inside` (behind the “What’s vault” card). `first` opens the intro first.
- `?ut2go=c1…c4, c6, c7, v07…v10, v14, t11, t13, t19, v20, v21, v22` opens the screen for that change and draws the review ring.
- Nothing in the build's own code was edited. Remove the two `UT2` lines to get V2 back.

## What's built (01–10, 14, 20 on the checklist)

c5 ("a create button on every tab") was dropped on 16 Oct: it came from the client deck's
recommendation, not from what members said in the sessions.

| id | change | where |
|---|---|---|
| c1 | Rename "ID card" (toggle) | ID card tab, tab bar, help sheet, create flow |
| c2 | One vocabulary + a line under each section title | Vault, ID card tab, Day 1 search |
| c3 | "Generate" leads — after: no Email/Phone tray; "Hide my info" leads "Add an item" (covered by c6) | Vault › + |
| c4 | Your own info kept apart — after: "Contact" is its own row in "Add an item" (covered by c6) | Vault › + |
| c6 | "Add an item" as a list (Figma 9546:61073): Create alias (dark; 20 Oct, was Hide my info → it runs the build's ID card create flow #icCreate as an alias flow: “What is this alias for?” → “Suggested aliases” (RECOMMENDED / OTHERS checklist) → Day 30's personalize page → “Creating your aliases now…” at full mint speed → ready → Done files each alias into the Vault with window.vtAddMade and makes no ID card; ut2.js aliasFlow / finishAlias, html.ut2-iccalias) · Contact (sheet: own Email / Phone) · Password · Payment card · Bank account · Others · Import pill. Rows drive the build's hidden tiles; trays are taken without showing (.ut2-autopick). Icons in V2/ut2/icons/add-*.svg | Vault › + |
| c7 | "How it works" sheet on a new alias's own page (Figma 9561:65463: dark round icons, one-line rows, 56px Got it) | Vault › + › Generate an alias › Create |
| v07 | "Alias" tag on alias rows only (Figma 9544:56508: 19px pill, #141410, white-10% stroke, 10px #F3F1ED, 4px gap); your own info has no tag (Yours dropped 19 Oct) | Vault (Day 30) |
| v08 | "Forwards to …" under every alias email and phone (Day 30) | Vault |
| v09 | Leak banner leads with "Rotate this alias"; Good explained; new card says "New" | ID card detail, create flow |
| v10 | Keyword step says the words go in the address; first step has Skip | ID card › + |
| v14 | Day 01 opening copy | Day 01 Home |
| t11 | First action = create (Notion 11). No change of its own: covered by c6, v14 and v21. The ring shows Day 01 Home's "Create your first alias" card. Item 12 (situation chips) was dropped 19 Oct: it was about identities | Day 01 Home |
| t13 | Day 30 create forms: the "ID card · Assign" row is hidden behind a "+ Add folder or tag" row; tapping it shows the Assign row (Notion 13, first step of the fast path). Day 01 forms have no such row | Day 30 · Vault › + › any form |
| t19 | ID cards in the Vault with a floating Items \| Folders toggle (see `ut2cards`). The ID card screen's title reads "Vault" on that side. "Cloaked handles" 1 and 2 (Activity split, daily banners) were dropped from the checklist 19 Oct | Vault |
| v22 | Day 01 Vault intro (both Tabs versions; since 20 Oct always the banner — the Page option is gone from the launcher; reference: Proton Pass tutorial; layout Figma 9552:62775): one dark scrolling page — live hero (the build’s own #iciBuild + pinstripes from the hidden ID card intro, moved in and driven by window.iciBuild; ut2/img/onb-hero.jpg is the fallback), password manager intro, then cards for login alias (one for many sites / new one per site), contact alias (forward to me / Cloaked inbox), payment alias and folders (Figma 9564:66808, rebuilt 19 Oct: “+ Add to ID card” → check three vault items → card outline → type “Sign up for free trials” → blue → the ID card → the stack). In the email card (Figma 9553:63458, third pass 19 Oct: onbMail() on the contact card’s grammar — real email → line + hide icon → separate alias → close-up → dotted arrow → brand chips Google / Verizon Sign in, rotating through Netflix · Spotify · Airbnb · Amazon) — earlier: the white pill with your real info turns into the dark alias pill as it scrolls into view, rises, a dotted fork opens and two dark cards appear; the contact card (Figma 9558:63459) shows your number → hide icon → alias number → close-up → dotted arrow → brand chips Hinge profile · Bumble profile · DoorDash order · Lyft ride · eBay listing · Airbnb host, rotating (rotChips()). The pay card (Figma 9558:63699): blue box darkens, real card •••• 4821 → hide icon → alias card •••• 1234, pan up, dotted arrow → payment chips Netflix $15.49 · Amazon $42.10 · Spotify $11.99 · DoorDash $28.40 · Target $63.15 · Nike $120.00, rotating (literal uses, so ②–④ don’t overlap the folders card’s situations). Shown first in the Vault (Items) the first time you open it (launcher “Vault intro: First open”), or behind a “What’s vault” card above the Vault search that opens it on tap and dismisses with X (“Vault intro: Banner”, Figma 9558:64871, `ut2intro=banner`); the tab bar stays; X / Skip Intro / “Go to my Vault” close it. The build’s two-page dark ID card intro (#icIntro) is hidden in after mode, Tab and Vault toggle alike: the ID card tab / Folders open on the empty wallet. Hero art: ut2/img/onb-hero.jpg (Figma render); banner art ut2/img/vault-banner-art.jpg (Figma 9561:65816). Open question for Cloaked: one alias for many accounts vs one per site | Day 01 · Vault (Items) |
| v20 | ID cards only group Vault items (step 2 = Pick from your Vault, no Generate rows); aliases are made in the Vault. The ID card + reads "+ Group aliases by situation" and the mint animation is skipped (the build's 45ms mint tick runs 12 frames per ms). Because of this, "Generate an alias" (c6) opens the Vault alias form and "How it works" (c7) follows a Vault alias | ID card › +, Vault › + |
| v21 | No "Your … is created!" page after any creation. ut2.js hides it (#nqGen in Day 30, .d1j-gen in the .d1j-flow wizards) and presses the build's own Done, so the item is filed exactly as before; then the item's own page opens (#nqDetail, or d1jOpenMade / the new .d30v-row). Hand-backs (Hide my email in a password form) just return to the form. "Custom avatar" lived only on that page | Vault › + › anything › Create |

## Known limits

- Cover art and the onboarding videos still say "ID card" (text is baked into the image files).
- No new design tokens. The prototype has no colour variables, so ut2.css reuses the values the
  build already uses (listed at the top of the file). The purple ring is review overlay only.
- c6 makes the six tiles 36px shorter so "Import" stays on screen.

**Activity (20 Oct, both days, after only):** the Monitor data / Block spam / Use an alias tiles are hidden; “See breakdown” is a link beside “Actions taken to protect you” and opens the build's breakdown (mhOpenBreakdown('monitoring')). The state tabs read All · Inbox · Urgent (were Unread, Compromised on Day 01 / Critical on Day 30).

**Vault (20 Oct, after only):**
- Aliases: no “Alias” text tag; a 18px black thumbnail with the alias mark (Create alias icon) on the avatar's bottom-right corner (.ut2-avw / .ut2-avb, addRowTags).
- “Alias” tab after All (both days where the tab strip shows: Day 30 always, Day 01 in 1 Tab (Toggle)): shows our own list `.ut2-alist` built from window.vtVaults() with the build's row (window.vtRowHTML), so Day 30's per-group preview cut doesn't hide any; empty state “No aliases yet” + Create alias. Any other tab or typing in search leaves it.
- Contact (Add an item): one form — Name, Email, Phone — saved as one item in a new “Contact” section after Email/Phone; tapping it opens a small Contact page with copy buttons (ut2.js openContactForm / addContact / openContact).
- Launcher Build order: Day 01 · Day 30.

**Risk level (20 Oct):** moved to “Things we didn't change” — Home already covers it. The ut2 edits are gone: a new card says “Good” again (the “New” rename was wrong), no risk line, the leak banner keeps the build's text. Activity changes are checklist row a1 (ut2go=a1).

**08 Forwarding (20 Oct):** no “Forwards to” line under Vault rows any more; on an alias's page the build's Forward to row is moved out of the See Details block (#lgMore on Vault items, #nqDMore on a just-made alias) so it is always visible; Temporary pause and Notes stay behind See Details (ut2.js fwdOut).

**1 Tab All (20 Oct):** in toggle mode the All tab is one A–Z list with no section heads (ut2.js flatAll → `.ut2-flist`, html.ut2-flat; search filters it; Edit's select mode shows the build's list). Category tabs and the Alias tab are filters with no section head.

**Vault tab strip (20 Oct):** no Identities / Folders tab any more (the floating Items | Folders toggle covers it): All · Alias · Login · Phone · Email …

**2 Tabs empty Identities tab (20 Oct):** same empty state as Folders (Figma 9564:67265): “My identities” 16 medium, “?” → ichOpen, bordered card “Start grouping your vault items” + “+ Create a new identity” → icOpenCreate; no + fab / count row while empty. Once a card exists the build's wallet and its “+ Group aliases by situation” come back.

**Create a new folder / identity (20 Oct):** the empty-state button and the “+ Create a new folder” under the cards open 02_Main R3's folder flow: FD-02 name sheet (“Create a new folder/identity”, pill input, Cancel / Create) → EV-02 bulk select of every Vault item (Select all / Save) → the build's create flow runs hidden (html.ut2-ghostcc) to make the card with that name → Day 01 puts the picked items on it (v3CardById + icResetCards) → opens the card. Day 30's card can only hold one phone / email / payment card from the flow's own pick list, so other picks don't reach the card there.

**Create alias, fast (20 Oct):** Continue on Suggested aliases skips Day 30's personalize page and the mint screen: the build's flow runs hidden (html.ut2-ghostcc, mint at full speed, Skip pressed), the aliases go into the Vault, the build's Done makes an identity card named for the purpose (Day 01: rows put on the copied seed card via v3CardById), and the card opens (ut2.js aliasFast).

**Onboarding options (20 Oct, Day 01):** launcher “Onboarding: Inside vault / Outside vault” → `ut2intro=inside|outside`. inside: Home's “Be yourself without exposing yourself / Create your first alias” card is hidden on Home (only “Your protection journey” stays) and a copy sits in the Vault above the search (`.ut2-vcard`, where the “What's vault” banner was) — tapping it opens the Vault intro. outside: Home as it is; the Vault shows only its one-line description (both Tabs versions). `first` still opens the intro first (URL only).

**1 Tab · Folder list (20 Oct, `ut2fold=list`, launcher Folders: ID cards | Folder list, shown only with 1 Tab):** ID cards are Vault items — rows in the A–Z All list and an “Identities” filter tab after Alias (from icCardList on Day 30, the wallet's [data-card] + v3CardById on Day 01); tapping opens the build's card page, Back returns to Items. Folders shows Figma 9603:70649: “Vaults” header, “N Folders”, 140-high #F3F1ED r20 folder cards (name, N items, three 32px avatars + “+N”), “+ Add new Folder” (name sheet → pick items and identities → folder page). Folders: Favorites (identities pinned with the card page's bookmark — Day 30's #icDetailStar, a .ut2-pin added on Day 01), My Real Info (your own items), then yours. Naming in this version is identity.

**Pick list (20 Oct):** the Select all / Save page (both folder flows) has a “Search your Vault” field and tabs like the Vault (All · Alias · Identities · Login · Phone · Email · Payment · Bank · Address · Contact — only kinds that exist); picks stay across tabs and searches, Select all takes what is shown, Save shows the count.

**FAQ (20 Oct, Figma 9603:71305):** the first two FAQ cards on the Vault and on Folders / the ID card tab read “How it works · What’s Vault?” and “How it works · What’s Alias?” (ut2.js faqTop; the frame's tag says “How it work”).

**Vault top (20 Oct):** the alias card in the Vault (Onboarding: Inside vault) reads “Create alias in this vault / Create your first alias”; the Vault's one-line description (“Your saved logins, emails, phones and cards. Real ones and aliases.”) now shows in every version, above the card.

**Suggested aliases groups (20 Oct):** in the Create alias flow the rows are grouped CONTACT (Phone number, Email) and PAYMENT (Payment card) instead of RECOMMENDED / OTHERS; the build's ticks for the purpose stay (ut2.js recoByKind).

**Activity top (20 Oct, later):** the “Actions taken to protect you · total · ▲ Today · See breakdown” block is hidden; the state tabs are All · Inbox · Urgent · Transactions — the fourth is ours (ut2.js avTxTab / avTxApply: only data-kind="transaction" rows, applied after the build paints, “No transactions yet” when none show; any other tab hands back to the build).

**Onboarding (21 Oct):** kept outside the Vault only — the launcher's Onboarding control is gone and `ut2intro` defaults to outside: Home keeps its “Be yourself without exposing yourself” card, the Vault has only its one-line description. (`ut2intro=inside` / `first` still work by URL.)

**Add an item rows (21 Oct):** Create alias · Phone · Email · Password · Payment card · Bank account · Others — Phone and Email open the build's own-info forms (pickVia 'own'); the one-form Contact row is gone (openContactForm stays in the code). Rows are 68 high so seven fit above Import.

**Others (21 Oct):** Bank account is no longer its own row — Add an item is Create alias · Phone · Email · Password · Payment card · Others (77 high again). Others lists Bank account first: on Day 01 a row added to the build's Others page (its Add opens the build's bank form), on Day 30 our own Others page in the same frame (Bank account works; Secure notes, Address, Authentication Key, Date, Identification number, Secondary URL say “not in this prototype yet”, as on Day 01).

**Vault ? and no Identities tab (21 Oct):** the Vault's one-line description no longer sits under the title — a “?” beside “Vaults”/“Vault” opens a sheet “What’s Vault? · Your saved logins, emails, phones and cards. Real ones and aliases.” (ut2.js vaultQ, like the ? beside “My ID cards”). In the Folder list version the “Identities” filter tab is gone (IDC_TAB=false); identities still sit in the All list.

**Password tab (21 Oct):** the Vault filter tab and section head read “Password” again (the build’s word) instead of “Login”; the Alias list section, the pick page tab and the 1 Tab search hint (“ID Cards, Passwords, Phone…”) follow.

**Folders + (21 Oct, 1 Tab):** the Folders side has the round + again (both Folders versions); it goes to Items and opens “Add an item” — the same sheet as the Vault’s + (ut2.js foldPlus, our .vt-fab styled button; the build’s own + that made a folder stays hidden). Folders are still made with “+ Create a new folder” / “+ Add new Folder”.

**Name: Alias ID (21 Oct):** a third name for the ID card — `ut2name=aliasid` (“alias ID / alias IDs”, “an alias ID”): “My alias IDs”, “5 alias IDs”, the “Alias IDs” tab, “Create alias ID”… The launcher has a Name row (Identity · Alias ID) wherever the name is Identity — 2 Tabs, and 1 Tab · Folder list; 1 Tab · ID cards stays Folder. General copy in Profile/settings that uses “identity” as an everyday word (“Identity sharing”) is left as it is, as with Identity.

**Create a new [name] row (21 Oct, 2 Tabs, Figma 9636:86141):** the ID card tab has no “+ Group aliases by situation” pill; under the cards a white row like Add an item’s (77 high, r16, 1px border, + at 22, label at 70) reads “Create a new identity / alias ID” and runs the same name → pick → open flow as the empty state (ut2.js foldEmpty .ut2-frow). With no cards yet the “Start grouping your vault items” card shows instead.

**Create a new [name] flow (21 Oct, 2 Tabs, Figma 9639:86478):** the row under the cards (and the empty state’s button) opens our own flow (ut2.js openIdFlow, .ut2-nid): CIC-02 “Name the Alias ID / Identity” — close, field, purpose pills (Hide my info, Meet new people, Online shopping, Newsletter, Food Delivery, Marketplace chat, Free trial; a pill fills the field), Continue, with the build’s drawn keyboard — then EIC-07 “Add to …” — Phone · Email · Payment cards, “+ Add” or “Change” (the pick shows under the label) — each opening a sheet “Add a phone number / Add an email / Add payment card” with an ALIAS band (your aliases of that kind) and “Generate a phone / an email / a card alias” (a new alias saved to the Vault). Continue (once something is picked) makes the card through the build’s create flow, hidden (ghostCard), and opens it. Day 01 has no aliases yet, so its sheets show Generate only. 1 Tab keeps the name → pick-list flow.

**Pick several (21 Oct):** in the Create a new [name] flow each kind’s sheet has a round checkbox on every row (like the pick list) and an “Add (n)” button at the foot; Generate makes a new alias and ticks it; reopening keeps the ticks; the row on “Add to …” lists every pick. Day 01’s card carries all of them; Day 30’s card holds one per kind (the build’s card), so it keeps the first.

**Folders from the top right (21 Oct, 1 Tab · Folder list, Figma 9644:86479):** the floating Items | Folders toggle is gone in this version; the Vault header has a round folder button after Edit (ut2.js vaultFoldBtn). It opens “Folders” (back · Folders · Edit, “N folders”, white 104-high cards with name and “N items”, then “Create a new folder” → name sheet → pick list → the new folder). A folder opens its page (back · Edit, serif name, “N items”, tabs All · Alias · kinds present, the items as rows); tapping an item closes the folder pages and opens it in the Vault (an identity opens its card). Edit says “not in this prototype yet”. Favorite tab and “…” from the frame are left out.

**Saved = secured (21 Oct, Figma 9646:87446):** with the “created” page skipped, the item’s own page opens at once and its avatar plays a quick coin flip (ut2.js flipAv): an empty ring (~0.26s), flips round to a lock on a soft disc (held ~0.4s), flips away and comes back as the item’s own icon (~1.1s in all). Runs after Add an item saves on both builds (Day 30 #nqDAv, Day 01 #d1jDetAv).

**Sections back (21 Oct, Figma 9631:82531):** the 1 Tab Vault home is sectioned again like 2 Tabs — Pinned, Passwords, Phone, Email, Payment cards… with their heads and See All — instead of one A–Z list (ut2.js FLAT=false; the flat list code stays). The Alias list is sectioned too. In the folder-list version the identities sit in their own section at the end of All.

**Flip slower (21 Oct):** the saved item’s avatar now holds the empty ring ~1s and the lock ~1s, and each flip runs 1.5× slower (in 255ms, out 195ms) — about 2.7s in all.

**Tab name (21 Oct):** the launcher row is “Tab name” (Identity · Alias ID) and shows for 2 Tabs only; 1 Tab is Folder (ID cards) or Identity (Folder list) as before.

**Flip from the icon (21 Oct):** no empty ring — the saved item’s own icon shows ~1s, flips to the lock (~1s), flips back to the icon (in 255ms, out 195ms; ~3.2s in all).

**Folders in every version (21 Oct):** the Vault’s top-right folder button, the Folders page and the folder page are now in 2 Tabs and 1 Tab · ID cards too (not only Folder list). Favorites (pin a card with its bookmark) works everywhere. In 1 Tab · ID cards, where the cards themselves are called folders, a new folder holds Vault items only.

**1 Tab is one version (21 Oct):** the launcher’s Folders control (ID cards | Folder list) is gone; 1 Tab always loads `ut2name=idcard` (“ID card / ID cards”). The Vault’s top-right button is the ID card one (the nav’s card glyph) → the card wallet “My ID cards” with a back button and no toggle (html.ut2-ivc). The toggle’s Folders → the real folder list on that screen (html.ut2-ivf, title “Folders”: “N folders”, folder cards, “Create a new folder”) → a folder opens its items. The Folder list code stays behind `ut2fold=list`.

**What’s vault tray (21 Oct, Day 01, Figma 9603:79269):** the first time the Vault opens on Day 01 (1 Tab and 2 Tabs), the “What’s vault” card (art, title, one line, X) slides up over it on a dim; X or a tap outside closes it and the Vault shows. Once per visit; not on launcher slides that open a specific change (ut2go). ut2.js vaultTray.

**Toggle, icons only (21 Oct, Figma 9659:87447):** the 1 Tab Items | Folders toggle is a 93×47 glass pill with two 40 circles — Items (two stacked cards) and Folders (folder), 20px icons, no labels; the side you are on is filled black 10%. Centred on the + beside it.

**Aliases are made on the ID card page (21 Oct):** Add an item has no “Create alias” row (Phone · Email · Password · Payment card · Others). Create a new [name] — 2 Tabs (Alias ID / Identity tab) and 1 Tab (ID cards, from the top-right button) — is: Name the [Name] → step 2 picks the NEW aliases to make, RECOMMENDED (Phone number, Email — ticked) · PAYMENT (Payment card) with round checkboxes → “Create N aliases” saves them in the Vault (vtAddMade) and makes and opens the card (ghostCard). The pick-saved-aliases step (Add to … + sheets) stays in the code behind NID_NEW=false. The Alias tab’s empty “Create alias” opens the same flow; launcher slides c3 / c6 now open it.

## UserTest_V2_2Tabs (21 Oct)
A copy of UserTest_V2 that keeps only 2 Tabs: the launcher has no Tabs or Tab name control (always 2 Tabs, always “Identity”), the 1 Tab slide (t19) is gone, and its saved state is its own (`ut2-launcher-2tabs-v2`; older `ut2-launcher-2tabs` blobs are ignored). UserTest_V2 stays as it was.

**Identity creation flow (Figma 9706:62637):** Create a new identity (under the cards, and the empty state) → “I wanna use the identity for” (story bar 1/3, X; field + purpose pills; drawn keyboard) → “Add items manually” (back, story bar 2/3, X): Phone · Email · Payment cards with **Generate** (makes a new alias of that kind at once, saved to the Vault; tap again for another) and **+ Add** (a sheet with everything of that kind in the Vault, Alias and Your info, checkboxes, Add (n)); **Show more** adds Bank Account, Secure notes, Address, Authentication Key, Date, Identification number, Secondary URL (+ Add only; “No … in your Vault yet” when there is none); picks show under each label → Continue makes the identity (build’s create flow, hidden) and opens it. ut2.js NID_V3. Day 30’s card holds one item per kind and no bank/address (the build’s card).

**Identity page (Figma 9706:64459):** the opened identity is a flat page on its colour, not a card — name (24px) top left, Risk level top right, the pattern in grey (`_cover.png` in place of `_detail.png`) centred at 189×121, then the rows in bands (black 5% between, 8px): Phone · Email + Email forwarding (Off) · Card (the card's name over its last four, card art) and, under “Show all”, Bank Account (with logo) · Address · URL and any other kind picked in the create flow. Identities that weren't made in the flow show the Vault's first bank and address there. The build's own rows stay, so a tap still opens the row's tray; an extra row opens its Vault item. Toolbar: back · bookmark · share · Edit. ut2.css `#icDetailCard` block + ut2.js `idDetailFlat()` / `ID_EXTRA`.

**Alias in the Vault (Figma 9666:97473):** an alias row carries a grey “ALIAS” tag (16px, r4, 10px caps) 8px after its name, in place of the corner thumbnail on the avatar. The logo itself is unchanged (a black disc, as drawn, would hide the dark logos — Apple, Hinge). ut2.js `addRowTags()`.

**Adding a phone, email or payment card (21 Oct):** the Vault's + → Phone / Email / Payment card opens a form of its own (no “yours or an alias” sheet): Title · the value (Phone / Email / Card number, with Cardholder name, Expiration date and Security code on a card) · Forward to (an email alias) · + Add folder or tag · Notes · Create. With the value field focused, the keyboard carries the Password form's bar — your own number or address on the left, **Hide my phone / Hide my email / Hide my card** on the right. Hide generates the alias into the field at once (an email also gets its Forward to toggle, on); Create saves it to the Vault; and a new alias is followed by a short dark tray on how to use it (“Your new number — give it out instead of your real one…”, Got it). A typed value saves as your own. ut2.js `openAddForm()` / `howTray()`, ut2.css `.ut2-con.af` / `.ut2-hbar` / `.ut2-how`.

**Day 01 (21 Oct):** the launcher's Day 01 starts on the build's onboarding (the welcome flow) — the **Skip onboarding** control (Day 01 only) opens it on Home instead. The “What's vault” tray now also shows on the tour slides, the first time the Vault list is on screen (it waits for the slide's flow to land, and the tour's marks wait under it).

**21 Oct, round 6 (Figma 9712:65151 · 65550 · 9666:97473 · 97589 · 9712:65932 · 9714:69420):**
- *Identity flow, Generate once per kind:* Generate on Phone / Email / Payment cards makes one alias; the row then shows the value with a reroll (↻ — same item, new value) and no buttons. A generated email gets a “Forward to Margaret611@gmail.com” row under it, off until you turn it on (green, #008924). The identity page's “Email forwarding” row reads that toggle.
- *Alias look:* an alias row's avatar is a black disc (#141410) with its icon or logo in orange (#FF550C) — a drawn mark is recoloured, a baked-in avatar svg is fetched and re-inked, a logo is masked (a raster badge like Amazon uses its light parts as the mark; `logoMask()`). The alias item's page is dark top to bottom (page #141410, blocks #1b1b18, 12px between), with the item's name under its avatar.
- *Avatar spin on open (the manager's note):* opening any Vault item spins its avatar once on the Y axis (~1.1s); the back face has the two colours swapped, so an alias lands on an orange disc with a black icon, your own items on their light/dark pair reversed. A logo or photo has one face, so it only turns. The saved flip (after Create on the build's own forms) keeps its icon → lock → icon beat; the lock is now the Vault's padlock, black on orange.
- *Phone:* `m.html` is the start page (dark, hint box, Day 01 - Onboarding / Day 30 cards with live scaled previews; tap opens the build full screen). Inside a build a **two-finger long press** anywhere opens a menu: Day 01 · Day 30 · Start page. The launcher (`index.html`) sends viewports under 760px to `m.html` (`?desktop=1` keeps the launcher). `vercel.json` / `.vercelignore` make the folder a static Vercel site: run `npx vercel --prod` in it.

**21 Oct, round 7 (Figma 9714:76147 · 74830):**
- *Day 01 intro is back:* Identities on Day 01 opens on the build's dark two-page story again (Skip intro · Our Solution · Learn more). “Skip intro” and the page-2 button (now “Create an identity”) open our identity flow, not the build's create pane; “Restart” on page 2 is still the build's.
- *Alias form is dark:* the Vault's + → Phone / Email / Payment card form turns black (#141410, blocks #1b1b18, light text) the moment Hide my … mints an alias, with a ↻ beside the value that mints another (the card number too). Create → the item's dark page opens with its avatar already on the back face (orange disc, black icon) → the avatar flips to the Vault padlock and back (the saved flip now happens on the detail page, not in the list) → ~3.5s in, a light tray: **How your identity works** (email: Messages come to you · Sites only see the alias · Login codes still arrive; with forwarding off, row 1 is “Messages wait in Cloaked”), **How your number works** (phone) and **How your card works** (card), each three 80px rows with a black 40px icon and a “Got it”. ut2.js `howTray2()`, ut2.css `.ut2-con.af.alias` / `.ut2-how2`.
- *Opening from the list:* tapping a Vault row spins the row's own avatar (700ms) while the page opens; an icon alias / own item reverses its two colours on the back, a logo or photo only turns. The page's avatar then does its own spin as before.
- *Identity cards:* the orange identity card is mint (#8ecfc1, identities palette) everywhere — the wallet, Home, the flyer and the identity page (`mintify()`); opening Hide my info no longer flashes a black card first (the fly layer's dark face is hidden).
- *Forward to on the detail page* follows the form: an email alias created with forwarding on shows On there too.
- Deployed on GitHub Pages: https://hi-christine-design.github.io/cloaked-usertest-2tabs/ (repo hi-christine-design/cloaked-usertest-2tabs; push the folder minus `.git`, `D2-explore`, `V2/Day30/src`, with `.nojekyll`).

**21 Oct, round 8 (Figma 9714:76249):**
- *Start page (`m.html`):* the cards are still thumbnails now — `m-dayone.jpg` (Day 01's “Welcome to Cloaked Margaret”) and `m-day30.jpg` (Day 30 Home) — no live builds, no motion. Labels “Day 01” / “Day 30”.
- *Two-finger long press* inside a build opened from the start page goes straight back to it (no menu). Opened from the desktop launcher it still shows the Day 01 · Day 30 · Start page menu.
- *Phone in a browser tab:* the build used to size itself to the whole screen (100vh), so in Safari the tab bar and bottom buttons (Continue, Create…) sat under the browser's toolbar and could not be tapped. On a phone the frame now takes the visible height (`--ut2vh` = innerHeight, kept current on resize), and outside the Home Screen the top inset kept for the status bar shrinks (`html.ut2-web`: `--hdr-top` 24, overlay bars `--ut2top` 20). Added to the Home Screen it is unchanged — full screen, status bar over the page. ut2.js `phoneFit()`.
- *Identities +:* the Identities tab has the Vault's + (56px black disc, bottom right); it opens Create a new identity (the identity flow), as the row under the cards does.

**21 Oct, round 9 — phone height, sturdier:** the visible height is now the smallest sane value of four readings (innerHeight, the root's clientHeight, a fixed top:0/bottom:0 probe — exactly where the tab bar is laid out — and visualViewport, skipped while a field has focus), re-read on resize, visualViewport resize, pageshow and blur. In-app browsers (the X / compass view from Messages, Slack…) and Safari disagree on which of these leaves out their bars. Add `&ut2dbg=1` to a build's URL to see what a phone reports (green box mid-screen: the four readings, the height used, browser vs home screen, build stamp). For a true full-screen app: open the start page in Safari (not an in-app view) → Share → Add to Home Screen (Open as Web App on).

**21 Oct, round 10 (Figma 9734:108452 · 9734:107810):**
- *Day 01 “start here” (ONB-03):* the step after the welcome is the Figma card — art, **Hide me with identity alias** / Peace in 5 mins, a **Get started →** row — with one black **Later** 24 under it (no Create button). Get started opens Create a new identity; Later collapses the card into Home as before. The Figma art is a video fill that can't be exported here, so the card draws its frame live (a glowing disc behind Nike · Google · Walmart · Apple · Zillow · Lyft · Airbnb · Target, each “usersmail@gmail.com”, using the build's logos). On a short screen the card gives up height (fewer rows) so Later is never cut off. ut2.js `wfStart()`, ut2.css `html.ut2-wf3`.
- *Day 01 Vault tray:* the first time the Vault opens, a tray slides up over a dim: a mini Vault (Passwords · Phone · Card · Email · Work, icons exported from Figma to `V2/ut2/img/vt-*.svg`), “A password manager that protects all of you”, one line, **Learn more** (opens the Vault intro). A tap outside closes it. It replaces the in-list “What's vault” card. ut2.js `vaultTray()`, ut2.css `.ut2-vt3`.
- *Press D (desktop):* shows the name of the page on screen at the top of the phone for 4 seconds and copies it, e.g. `Day 30 · Vault › Vault item — “Home” [#vaultsScreen #vtL3]` or `Day 01 · Create identity · What is it for (step 1)`. Works in the launcher (forwarded to the build) and in a build opened on its own; ignored while typing in a field. ut2.js `pageName()` / `showPageName()`.
- *Home Screen app (r11):* `manifest.webmanifest` (scope `./`, start `m.html`, standalone, icon `V2/ut2/img/app-icon-*.png`) is linked from `m.html` and `index.html`. Added to the Home Screen from the start page, the whole site is one app, so moving into Day 01 / Day 30 or back to the start page stays full screen; without it iOS treated those pages as outside the app and opened them in its in-app browser (X + toolbar). Re-add the icon from the start page after this change. The builds still have no manifest (on purpose, see their head).
- *Home Screen height (r12):* opened from the Home Screen (standalone) the overlay no longer sizes the frame — iOS can report the height without the status bar there, which left a ~60pt band under the tab bar. The build's own 100vh (the whole screen) applies; the visible-height fit is only for a browser tab.
- *Start-here card art (r13):* the card's art is now the motion from `intro-v1-descriptive-short.html` (the asset behind the Figma video), ported into ut2.js `wfArt()`: a breathing orb whose palette drifts every 7s (canvas, grain, centre/radius from the Figma frame), and the eight site rows where usersmail@gmail.com morphs letter by letter into a cloaked address while each logo turns into the orange cloaked mark, top row first, holds, then all turn back. Runs only while the card is on screen.

**21 Oct, round 14 (Figma 9734:107810 · 9809:112806 — avatar motion):**
- *Day 01 Vault tray* no longer appears the moment the Vault opens: about a second on the list first, then the dim fades in (.5s) and the tray slides up (.6s). Leaving the list in that second puts it off to the next visit. ut2.js `vaultTray()` / `showVaultTray()`.
- *Opening an item (Figma “Icon rotates when opening an item”):* tapping a Vault row (or an identity's item row) holds the tap: the row stays white while everything else dims (black at 50%, the Figma's grey), its icon turns over once — black disc / orange mark → orange disc / black mark → back — and then the item's page opens. The page's avatar no longer spins; it rests on the icon's own face (black disc, orange mark), as the Figma “Detail page”. A logo that isn't an alias just turns. Taps only — a tour's scripted clicks open straight away. ut2.js `rowPick()`, `faceBack()`, ut2.css `.ut2-pick`.
- *Saving an item (“Icon rotates and show that it's protected”):* unchanged flip (icon → orange disc with the black padlock → icon); the page now rests on the icon's own face before and after, not the reversed colours.
- *New identity (“Pattern on the cone shape fades in”):* after Create, the identity's card lands with its cone as a plain grey shape (#C7C7C7, Figma CIC-08) and the engraved pattern fades in over ~1s. ut2.js `coneFade()`, ut2.css `.ut2-cone`.
- *Alias page title:* a logo item (Airbnb…) showed its name twice under the avatar (the build's title and ours); now one.

**21 Oct, round 15 — ONB-03 card to the Figma frame (9734:108452, 393×852):** title box at 183 (Simula 32 / line 32, +0.16 tracking; was 36.8 line), card 263–706 (353×443, r20), **Later** 16 under the card at 722 (was 24). Inside the card: site rows start 34 from the top (8 rows, 32.4 each), logos 18px, the email line 12px, the Figma's thin arrow on Get started. On a short screen the card still gives up height first. Tapping Later, the title eases back to the build's own spacing as the card collapses, so the hand-off to Home is unchanged.

**21 Oct, round 16 — Later → Home:** tapping **Later** on the start-here card, its title turns into Home's own (“Every sign up hands / out the real you.”) as the card folds, and Home's first card now keeps the build's **Create alias / Hide your real ones** (was rewritten to “Be yourself without exposing yourself / Create your first alias”) — the same words the folding card shows. The fold also travels to where Home's greeting and card actually sit (measured on tap; this Home sits ~48px higher than the build's fold assumes), so title and card no longer jump at the hand-off.

**22 Oct, round 17:**
- *Save → item page directly:* Save on the new-item form no longer shows the Vault list on the way: the add sheet closes, the Vault tab and the item's page are set up under the form, then the form slides away onto the page (Day 01 and Day 30).
- *Item page icon* (mark avatars, e.g. the @ of an email alias) is bigger: the mark fills 72% of the 88 disc (was 53%).
- *Saved lock* takes the avatar's own colours (its disc and its mark — an alias: black disc, orange lock) instead of always orange / black.
- *Opening from the list* is subtler: no dim and no white row (those were only pointers in the Figma) — the row's icon turns half over (420ms, to its reversed face) and the page opens.
- *Identities (Day 01) intro:* the stage under the copy shows the onboarding start-here card's art (orb + the eight sites turning into cloaked addresses) in a 353-wide black card, in place of the brand constellation, for now. `idIntroArt()`.
- *Identity page:* no tab bar while an identity's own page is open (`#icL2.open`).
- *Identities:* the “+ Create a new identity” row under the cards is gone — the black + at the bottom right does it.

**22 Oct, round 18:**
- *Page moves follow the build:* Save on a new item is now a push — the item's page slides in from the right while the form moves off to the left (the build's detail pages all come in from the right). Creating an identity lands on its page the same way.
- *One mark size in every avatar:* each mark (svg) is measured and set so its drawing is 45% of the disc (the Figma's Hinge H, 18 of 40) — list rows, the turning faces, the item page and the saved lock all match, so nothing grows or shrinks as a row turns and the page opens. Logos in an alias's mask: 56% box (≈45% visible). A photo keeps its own crop on the turning faces. `fitMark()`.
- *Alias pages:* the mark is always orange on the black disc; the disc gets a hairline ring (it is the page's own black). Day 01's alias page is black all the way down (Activities too). Day 30: the history's tags (Missed, Call…) and letter avatars are light on black. Forward to's switch, off, is its grey at 20% on black (also on the alias form).
- *Opening from the list:* photo avatars (Cancun Trip…) turn half over too.
- *Identities (Day 01):* FAQ is about identities (What's an identity? / What goes in an identity? / One identity for each part of your life); no line under the title (the ? says it). Intro: the art is full width and there's no second page — Learn more / Create an identity show right away; a swipe or tap no longer pages.
- *Vault (Day 01):* no folder button for now.

**22 Oct, round 19:** Day 30 alias page — the line under Mailbox (and the other history headers) is white at 25% on black (was the light page's #E0DDD6).

**22 Oct, round 20:** on an alias's black page, Forward to's switch is green (#008924) when on — the same green as the alias form.

**22 Oct, round 21:**
- *Identity page → Figma 9714:75743:* rows on the page's colour with a line under each (no bands, no Forward to): Phone · Email · Card, and under Show all a Bank Account and an Address (always — Day 01's Vault has neither, so Margaret's Chase account and 39 Greenpoint ave). Identities made before this session show a Card (the Vault's first). Cone 58 under the title, rows at 346, Show all 48 tall. Toolbar: bookmark · share · Edit (Day 01 gets the share). Activities: 40px search + filter buttons (added on Day 01), tabs read Calls · Message · Mailbox · Login, rows 80 tall with black discs and orange marks, tags as the Figma (Spam red). No floating call button.
- *After creating an identity:* a "How to use “name”" tray, like the alias ones (sign up with it · everything comes back here · login codes still arrive).
- *Saved lock flip:* starts 0.5s sooner and is quicker — swish to the lock (120ms out / 180ms in), hold 0.8s, swish back.
- *Vault (Day 30 too):* no folder button.
- *Identities intro (Day 01):* the gradient lies under the whole intro (not cropped at the stage) and fills up behind the title; the site rows stay where they were.

**22 Oct, round 22:** an identity you make shows only what you put in it (no Bank Account / Address added on its own; the prototype's own identities in Day 30 keep the Vault's under Show all). The "How to use …" tray after making one has **Don't show again** (remembered on this device) and **Close**.

**22 Oct, round 23 (Figma 9817:112807 · 9817:112882):**
- *Onboarding start-here step:* title “Be with yourself without exposing yourself”; card “Create alias based on your situation” / Peace in 5 mins / Get started. The card's art is the identity story in motion (below), in place of the orb.
- *Identities intro (Day 01):* title “Create alias based on your situation” (its line under stays); the art is the same story.
- *The identity story* (`idSlides()`, a loop of ~11s on a 329×264 stage): Margaret's real email / card / phone pop in on a panel → the panel lifts away and “+ Create an identity” appears → pressed → “Sign up for free trials” types itself → a blue card appears and fills in (title, risk, its cone, Email row, See Details) → Hide my info · Business Contact · Cancun Trip · Dating new people drop in above it, a wallet → fade, again. Runs only while on screen.
- `identity-intro.gif` (543×435, 20fps, one loop) — the same motion as a GIF.

**22 Oct, round 24 — the story, smoother:** one curve for everything (easy ease, cubic-bezier(.33,0,.67,1)); the real ones rise in out of a blur, staggered; the panel lifts away and the button arrives; a finger taps it and a ripple fills it white; the typed words fly up and become the new card's own title as the card grows behind them; its contents settle in one after another; the card slides down as the others come down onto the stack; everything fades out softly and it starts again (~13s). GIF updated.
- *Home (Day 01):* the first card reads **Create alias identity** (and the start-here card's collapsed row that lands on it); tapping it opens the Identities intro (the story slides) instead of the old alias onboarding.

**22 Oct, round 25:**
- *Alias logos (Vault rows, item pages, the turning faces):* an svg logo is now drawn inline in the alias orange (fetched once) instead of through a CSS mask, which sometimes didn't come in and left a bare black disc. Raster logos keep the mask.
- *Vault tab strip:* room after the last tab, so Address scrolls fully clear of the right-edge fade.
- *"How to use …" after making an identity:* now says what matters — together here, by situation · each one (its email / phone number / card) is also its own item in your Vault · reach people with it · replies land here (or forward to your email, if that's on).

**22 Oct, round 26:**
- *Identities intro:* the line under the title now says what an identity is — “Aliases grouped for one part of your life. Use them anywhere, without giving out your real info.”
- *Tab bar:* the Identities tab lights up when you're on it (the build looked for the button by its old “ID card” label).
- *Vault intro (after the tray's Learn more):* the hero is the tray's own picture — the mini Vault — not the gold string fan, so the intro continues what the tray showed. Three new cards: **Everything you save is protected** (an item's avatar turns to the lock and back) · **Make aliases here too** (an alias row drops in under the real one: black disc, orange @, ALIAS tag) · **Mail to an alias lands here** (mail arrives in the alias's inbox; Forward to turns on and it goes on to your real one). Copy tightened throughout.

**22 Oct, round 27 — the ? buttons:** the ? beside **Vault** reopens the Vault intro (the cover with the mini Vault and the three cards) instead of showing a line of text — on Day 30 too. The ? beside **Identities** brings the Identities intro cover back over the wallet (title, line, the story slides, Learn more / Create an identity); Skip intro puts it away, Create an identity opens the flow. Day 30's intro now reads like Day 01's (Identities, the same line under the title, the slides).

**22 Oct, round 28 — the avatar turn, V3's way (Figma 9823:114647):**
- *Vault rows (both days):* tapping a row turns its avatar like V3's: a coin, not a card — tighter perspective, a thin side you see edge-on mid-turn (dark orange on an alias), cubic-bezier(.4,0,.2,1) over .42s. Its reversed face comes round (alias: orange disc, black mark), then the page opens.
- *After Save:* no lock. The new item's icon on its page turns over the same way (its reversed face), holds a moment and turns back — "it's protected". An alias brand logo (e.g. Hinge) now reverses too, and a brand logo shows on the page (it came up empty before).

**22 Oct, round 29 — Identity is V3's (Yuan), whole:**
- *Identity tab (Day 01 + Day 30):* list, intro (tray "One identity for each part of your life" → Learn more page → Create identity), create flow, identity page and Edit are V3's own, loaded on top of the build (`V2/ut2/v3id1.*`, `v3id30.*`, made by `port/`). Tab bar says **Identity**. Our own Identities layers from rounds 21–27 (story slides, how-to tray, our create flow, the flat identity page, mint cards) stand down; r28 as it was is `../R1` (04_UserTest_V2/R1). `&ut2v3id=0` brings ours back.
- *Start-here card (Day 01, Figma 9822:114546):* "Use unique identity to hide your real one" / Peace in 5 mins / Get started. The art is V3's identity cards in three beats, looping: the Primary identity alone → Hide my info rises over it → Business identity and Cancun trip stack on → they slip back.
- Home's "Create alias identity" lands on the Identity tab (V3's tray greets the first visit).

**22 Oct, round 30:**
- *Identity create flow (both days, Figma 9827:121713):* V3's flow, with R1's step 2 — **Add items for the identity**: Phone / Email / Payment cards, each with Generate (makes the alias at once; reroll to try another, an email gets Forward to) and + Add (from the Vault), Show more for the other kinds. Continue hands what you picked to V3's "Creating your identity now…" → "ready to use" card. Back returns to V3's first step; × closes the flow.
- *Start-here card:* no more growing from small to full as it slides in — it arrives at its size (443; less on a short screen, set before it shows).

**22 Oct, round 31 — Vault intro (Figma 9822:113803):**
- *The tray* on first opening the Vault ("A password manager that protects all of you" / Learn more) is black now, like the page it opens; the mini Vault stays white, Learn more is a light button.
- *The page behind Learn more:* same hero and title, the line "Logins, emails, phone numbers and cards. Your real ones and your aliases, side by side.", then two cards — **Share an alias, not your number** and **Calls, messages, emails, transactions all happen here** (lorem ipsum under each). Their art is still WIP: a white "WIP" tag, as in the Figma. The three earlier cards (protected · make aliases · mail lands here) are off.

**22 Oct, round 32:** no tab bar over the intros — it slides away while Identity's tray or its Learn more page is up, and while the Vault's tray or its intro page is up (both days); it comes back when they close.

**22 Oct, round 33 — launcher: Vault onboarding V1 / V2:**
- The right panel has a second tab, **Vault onboarding**. **V1 · Current** is ours (black tray → intro page with the two WIP cards, Figma 9822:113803). **V2 · V3 build (Yuan)** is the Vault intro from `03_UserTest_V1/V3`: the "Meet your smart vault" tray with the ring of logos → Learn more → One vault for everything that's yours online · Sign up without giving away your real info · Stay private when you meet new people · A virtual card for subscriptions · Get started. Tapping a row opens the Vault with that tray already up (both days); the pick stays for the rest of the prototype (the Vault's ? opens that version's page).
- V2 is loaded on top of the build (`V2/ut2/v3vonb1.*`, `v3vonb30.*`, made by `port/genvonb.py`; URL `&ut2vonb=2`). No tab bar over either version.

**22 Oct, round 34:** the start-here card's button reads **Learn more** (was Get started). It goes to the Identity tab and opens V3's Identity intro page over it ("One you. As many identities as life needs." · scroll to explore · Create identity); × lands on the Identity wallet.

**22 Oct, round 35:** Day 01's Vault has the tab strip, like Day 30 — All · Alias · Password · Phone · Email · Payment · Bank · Address. The kinds Day 01 doesn't hold yet (Payment, Bank, Address) still have their tab; it says "No … saved yet" with **+ Add** (the Add an item page).

**22 Oct, round 36:** A phone alias forwards like an email one: **Forward to 523-256-2345** with a switch in the Vault's new phone form, in "Add items for the identity" under a generated phone, and on Day 01's alias page (Day 30's page already had it). "How your phone works" follows the switch — off: **Calls and texts come here** / Pick them up in Cloaked, or turn forwarding on; on: **Calls and texts come to you** / They forward to 523-256-2345. The Vault's create form loses "+ Add folder or tag". On Day 01, an identity made with "Create a new identity" now joins the Identity list (Day 30 already did; port/patch_icc.py → v3id1.js). The Vault's first-visit tray no longer opens over an item's page or a flow.

**22 Oct, round 37 (client share):** Vault onboarding is Yuan's only (V3's "Meet your smart vault" tray and page) — on the launcher, on m.html and in the builds by default. The launcher's "Vault onboarding" tab is gone; the right column is the Checklist again. Ours (tray + intro page) stays in R1; `&ut2vonb=1` still brings it back here.

**22 Oct, round 38:** The launcher's Checklist, 01 Rename “ID card”, has a Note under it: Back to “Identity”. We explain it more with onboarding instead.

**22 Oct, round 39:** Digital risk. Each identity card says **Digital risk: Good** (or High) where it counted its items, on the wallet, the open card, the create flow and the intro's sample cards; Home's start-here cards too. Home's "Risk level" tile is now **Digital risk**. Why: Home already has Digital risk, so people can read the card's from there. The Checklist's "Risk level" moves from "Things we didn't change" to 03 More guidance as "Digital risk on each identity". (port/patch_icc.py patch_markup + 3 patches → v3id1/v3id30.js; ut2.js homeRisk().)

**23 Oct, round 40:** Vault onboarding V2 (Figma 9890:138727). The launcher's "Vault onboarding" tab is back: **V1 · V3 build (Yuan)** (default) and **V2 · Scroll story**. V2 keeps Yuan's tray; its Learn more (and the Vault's ?) opens one page with three scroll stops, each playing once you land on it (V3's rule and curve): *A password manager that protects all of you* (+ → Phone, Email, Card, Passwords, Address → your items → the list scrolls → three) · *Share an alias, not your real info* (aliases slide over the real three) · *Calls, messages, emails, transactions all happen here* (one alias on top, a dotted thread, what reaches it — phone → email → card, looping). Get started → the create page. Files: V2/ut2/vonbn.js + vonbn.css, loaded by ut2.js with `&ut2vonb=n`. The background glow is CSS (the Figma image couldn't be exported). Copy fixes from the Figma: "Bank of America", "Instagram login", "Your account is activated!", "We just launched a new version today!"; Casa del Mar's avatar is "C"; card rows read .3802 (the card alias).

**23 Oct, round 41:** Vault onboarding **V2.2 · Scroll pages** (`&ut2vonb=n2`): the same three scenes, scrolled like Yuan's V1 — each scene is its own page, its title and art come up as you scroll, and the art plays once the page lands (pages you leave wait in their starting pose and replay when you come back). Passing pages fade out under the bar and above Get started. The earlier one is now **V2.1 · Scroll story** (title and art stay put). Same files (vonbn.js / vonbn.css).

**23 Oct, round 42:** V2.2 follows the new storyline (Figma 9896:138728) — four pages: *A password manager that protects all of you* (+ → five rows → Phone, Email, Card, Passwords, Address) · *Save them here and use them when you need* (your five things, then the list runs on) · *Share an alias, not your real info* (aliases slide over the real three) · *Calls, messages, emails, transactions all happen here* (the alias on top, the thread, phone → email → card). V2.2's cover tray keeps Yuan's title and Learn more but swaps her ring for the story's first beat on a 9s loop (glow, +, the kinds turning into your things).

**23 Oct, round 43:** Activity: an alias row's small badge next to the avatar shows its identity's icon again (Cancun trip, Dating, Free trials…) — V3's rule had painted it a plain black disc (port/gen1.py + gen30.py skip that rule → v3id1/v3id30.css). Assets: everything in Yuan's V3 `assets/` that R2 lacked is copied in (both days: Avatar/avatar-Vault item/for intro/*, ID card/wave-tile*.svg, intro-logos/card/*-orange.svg, Day 01 ID card/BKGD-texture-tile.png, Day 30 icons/…/Cloaked-Default.svg), plus intro-logos/Spotify.svg and UPS.svg (from logo/). Same files copied into 02_Client Delivery/UserTest_R2.

**23 Oct, round 44:** Vault onboarding keeps V1 (Yuan) and **V2.2 · Scroll pages** only — V2.1 is retired (`&ut2vonb=n` now opens V2.2 too). V2.2's art loops while you stay on a page: it plays, holds, dips out and plays again (+ → kinds ≈5s · your things → the list runs on ≈6s · aliases slide over ≈4.5s; the calls page already cycles phone → email → card).

**23 Oct, round 45:** Day 01 Home's "Create alias identity" card keeps the solid hidden-eye mark it shows during onboarding (graph.svg) instead of switching to the thin outline eye once it lands on Home (ut2.js d1jMark()).

**23 Oct, round 46:** V2.2's cover tray stops at the kinds (Phone, Email, Card, Passwords, Address) — it no longer flips them into your real info. Loop: + → five rows → the kinds, hold, fade, again.

**23 Oct, round 47:** V2.2's cover tray art at .75 size, and it loops as a round trip: the + is pressed → the rows open → the kinds → they fold back into the + → pressed again (7.5s).

**23 Oct, round 48:** V2.2 page 2 (*Save them here and use them when you need*) moves like Christine's reference video: a vertical carousel that steps up one row every 1.6s (.45s, fast then settling); the middle row is in focus — full size, lifted, brighter — and the rows either side shrink and dim; it wraps round for ever. V2.2 ends with **FAQs** as V1 does (Yuan's four cards and classes).

**23 Oct, round 49:** V2.2 cover tray: the + waits half as long between loops (≈2s → ≈1s); the loop is 6.5s.

**23 Oct, round 50:** V2.2 page 1 plays once and stays: + pressed → the rows → the kinds, then still (the cover tray still loops). Page 2's carousel: the row in focus no longer gets a grey fill (it still grows and brightens).

**23 Oct, round 51:** Vault onboarding: the four-page scroll story is now **V2.1** (`&ut2vonb=n2`); new **V2.2 · Logos first** (`&ut2vonb=n3`) drops the + and the kinds — the tray shows your things with their logos straight away (rising one by one on a 5s loop), and the page has three stops: the logo list · *Share an alias* · *Calls, messages…* (no *Save them here* page), then FAQs. Both V2s now paint V1's breathing orb behind the page (the still glow is the fallback). V2.1's + gets a wash of the glow's own colours (amber → blue) sweeping down into it. Launcher: V1 label no longer names a person.

**23 Oct, round 52:** V2.2's first page (the logo list) keeps moving: it runs V2.1's vertical carousel (one row up every 1.6s, the middle row in focus, wrapping round) instead of rising once and stopping.

**23 Oct, round 53:** V2.1's +: white while it waits; the colour sweeps in on the press and the rows open out of it (no white flash between). Cover tray: the kinds hold 1.25s (was ≈2.9s; loop 6.5s → 4.82s); rows 60px on a 68px step with the inner box nudged half a pixel, so at .75 every row and every 6px gap lands on whole pixels. Pages fade out just above "Scroll to explore", so nothing sits behind it.

**23 Oct, round 54 (copy review, must-fixes only):** V2 page 1 *One vault for everything that’s yours* / *Keep your logins, cards and contact info in one place — and use an alias whenever you sign up.* · V2.1 page 2 *Keep it all here, ready when you need it* · last page *Calls, texts, emails and payments — all in one place* · June's voicemail now says it's June · Lululemon *Your order is confirmed. We’ll text you when it ships.* · card rows *Hotel in Cancun / Ride to JFK / Flight to Cancun .3802* · FAQs are Vault questions (alias, import, who can see, alias calls).

**23 Oct, round 55:** V2.1 (the four-page + story) is retired; the logos-first version is now just **V2** in the launcher (`&ut2vonb=n3`; `n`/`n2` open it too).
