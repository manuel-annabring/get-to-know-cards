# Review: Phase 1, Playable deck

Branch: `phase/1-playable-deck` (8 commits on top of `main`). Not pushed: the repository has no remote yet.
`npm run check` passes: typecheck, lint and prettier, 56 tests in 8 files, build.
A fresh-context reviewer went through the whole phase. Its findings are in section 5.

## 1. Try this

```bash
npm run dev -- --host
```

Open `http://localhost:5173` on the computer, and the printed network address on your phone (same Wi-Fi).

1. **Play a full game on your phone.** Tap through the start card, all 68 cards and the end card. Check the feel of the slide (380ms from the right) and whether tapping anywhere works on iOS (see open issue 1).
2. **Read the cards aloud with someone.** The pairs and trios are the heart of the game, so this is the best content test. Strike or reword what does not work.
3. **Check the look.** Portrait card, big rounded text, decor shapes, counter at the bottom. Compare it with the mockup.
4. **Look at the extremes.** The longest question is "Was machst du am liebsten in deiner Freizeit?" (45 characters) and the shortest is "Wie alt bist du?". Rotate the phone and make the browser window narrow (360px).
5. **Dev preview:** `http://localhost:5173/dev/preview.html` shows the start card, six colours and the end card in one grid. `?solo=N` shows one card in the real layout.

I did not store screenshots in the repo. The reviewer and the slice workers looked at screenshots at 390x844, 360x640 and 1280x720 during the run. They matched the agreed look.

## 2. Decisions

D-001 to D-029 are in [DECISIONS.md](DECISIONS.md). New in this phase: D-015 to D-029, all `open` until you have seen them.

**Foundation** (expensive to change):

| ID | Decision | Why it matters |
|---|---|---|
| D-016 | All card sizes are in "reference px" of the 280x520 mockup and scale with the card width through a CSS container query unit | The look is identical at every size. Needs a browser with container query units (iOS 16 or newer) |
| D-022 | Deck order is random, but forced to avoid adjacent same-group cards whenever that is possible (exact, tested over 3000 random fixtures) | Core of the game feel. The old group is never repeated directly |
| D-010 (from spec) | Vite, TypeScript, vanilla DOM, npm | Stack |

**Easy-to-change** (retune in minutes): D-015 toolchain strictness, D-017 phone card fills the viewport (taller than the mockup ratio), D-018 text shrinks when it would overflow, D-019 manual hyphenation on start and end cards, D-020 dev preview, D-021 where `QuestionGroup` lives, D-023 state shape, D-024 to D-026 content choices and keyword scan, D-027 transition mechanics, D-028 `click` on `document` plus keyboard, D-029 screen reader text.

## 3. Acceptance

All criteria of every slice passed. Evidence is in the slice reports and was re-checked by the reviewer.

| Slice | Result | Notes |
|---|---|---|
| 0 Setup | pass | `check` runs all four commands, `.claude/launch.json` and the screenshot method are in CLAUDE.md |
| 1.1 Card look | pass | Contrast test (3:1), no raw colours (test), local font only, 360x640 / 390x844 / 1280x720 checked, all 68 questions fit at 360x640 |
| 1.2 Deck engine | pass | 200 seeded runs on a 35-group fixture with no adjacent same-group cards, state machine fully tested, no DOM imports |
| 1.3 Content v1 | pass | 34 groups: 24 pairs, 5 trios, 5 singles, 68 cards. Longest question 45 characters. Keyword test checked with a bad question |
| 1.4 Wire-up | pass, with two parts only partly verified | Full game driven in the browser (1/68 to 68/68, end card, new game). 40 rapid taps leave one card. Keyboard and reduced motion verified. Animation timing, long press and pull-to-refresh need a real device |

## 4. History

One commit per slice (each followed by a small commit that only records its hash in STATUS.md), so any slice can be reverted alone.

| Slice | Commit |
|---|---|
| 0 Setup (on `main`) | `6f711d3` |
| 1.1 Card look | `c5ec998` |
| 1.2 Deck engine | `a7dacea` |
| 1.3 Content v1 | `35b4410` |
| 1.4 Wire-up and interaction | `37e77c6` |

## 5. Open issues

Not fixed in this phase, because the workflow says everything outside the slices is a note. Proposed for a small fix slice after your review.

**Code and look**

1. **Medium, unverified: tap on iOS.** `src/ui/game.ts:46` listens for `click` on `document`. iOS Safari does not always fire `click` on non-interactive elements. If tapping the empty card does nothing on your iPhone, the fix is `cursor: pointer` on `html, body, .stage` or `pointerup`.
2. **Low: last card and end card share a colour.** With 68 cards, card 68 and the end card are both teal. Only the decor layout changes. The cause is the fixed end colour (`src/theme.ts`).
3. **Low: slow phones.** The timer that releases the tap lock fires 120ms after the animation should end (`src/ui/transition.ts:37`). On a very slow first frame the incoming card could snap into place. It cannot get stuck. Raising the slack to 300ms or more would remove the jank risk.
4. **Low, your call: small text contrast.** Counter, start label and hint are small bold text, so WCAG asks 4.5:1 there. The palette meets the 3:1 rule for large text. Measured: red `#F0543C` 3.48, teal `#0E9F8E` 3.30, pink `#E8387F` 3.96, blue `#2F6FED` 4.55. Fix: slightly darker red, teal and pink, or make those texts larger.
5. **Low: German text outside the allowed places.** `dev/preview.ts` has strings outside `src/content/` and `src/ui/strings.ts`. It is dev only. It could import real questions instead.
6. **Info: text fitting and old iOS.** The text fit runs on resize only, not after the font loads (not triggered in any test). `cqw` units need iOS 16 or newer.
7. **Info: slide on desktop.** The incoming card slides in over the page and is not clipped to the card area on wide screens.

**Content flags (you decide)**

- 17 of the 24 pairs are "like / dislike". That can feel repetitive in a 68-card game. Swap some for different counterparts (first / last, past / future, real / wish).
- `daily-mood` ("Was nervt dich im Alltag am meisten?" / "Was freut dich im Alltag am meisten?") has no short shared answer form. Suggested replacement: "Welches Geräusch magst du am liebsten?" / "Welches Geräusch kannst du nicht ertragen?".
- `coffee-or-tea` ("Tee") also fits the `drinks` pair, and sweets answers fit "Was isst du am liebsten?". That muddies the guessing on purpose or by accident. Decide if you want it.
- `jobs` ("Was machst du beruflich?") can be touchy for students and people looking for work. Option: add "Welchen Beruf würdest du nie machen?" as a third question (trio limit is 6).
- Mildly personal: "Wovor hast du ein bisschen Angst?", "Wo wohnst du gerade?", "Wie alt fühlst du dich?". "Welche Schuhgröße hast du?" is body-adjacent but comes from your brief.
- No excluded topic was found by the scan or by the reviewer.

**Look vs mockup**

- On phones the card is taller than the mockup (fills the screen, D-017). The counter is centred. In layouts 2 and 5 one circle lies fully inside the card.
- The start card and card 6 share colour and decor layout (both index 0).

**Not verified**

- Wall-clock animation timing: the browser pane renders about 1 frame per second when unfocused. The values (380ms, easing, keyframes) were read from the computed animation.
- Long press, double-tap zoom, pull-to-refresh and safe-area insets on a real device.
- Reduced motion was checked by forcing the code path, not through the OS setting.
