# Review: Phase 2, Quick deploy

The game is live: https://manuel-annabring.github.io/get-to-know-cards/
Repo (public): https://github.com/manuel-annabring/get-to-know-cards

This phase was small, so there was no separate fresh-context reviewer. The coordinator checked each slice report against its criteria and tested the live site.

## 1. Try this

1. Open the URL on your phone and play a few cards.
2. Send the link to the group (or show it as a QR code from your phone).
3. Watch what happens in the group: which questions get a laugh, which fall flat, which pairs are hard or too easy to guess. Note them for Phase 3.

Home-screen shortcut works on iOS ("Add to Home Screen"), but there is no offline mode yet. The group needs internet when the page loads.

## 2. Decisions

| ID | Decision | Impact |
|---|---|---|
| D-032 | GitHub Pages from a public repo, deployed by a GitHub Action on push to `main`, `base: './'` | foundation |
| D-033 | Local history rewritten to the GitHub noreply email before the first push | easy-to-change |
| D-034 | PWA, icon and how-to-play screen move to Phase 3 | easy-to-change |
| D-035 | Page title, description, theme colour and SVG favicon; the theme colour is tested against the palette | easy-to-change |
| D-036, D-037 | `.claude/launch.json` stays tracked; workflow design | easy-to-change |

## 3. Acceptance

| Slice | Result | Evidence |
|---|---|---|
| 2.1 Sub-path build | pass | No absolute paths in `dist/`. The sub-path copy (`/get-to-know-cards/`) and the root path both play; the font loads from the served files |
| 2.2 Repo files and workflow | pass | Workflow YAML parses, `git grep` shows no secrets or personal data in tracked files |
| 2.3 First deploy | pass | Trees identical before and after the rewrite, all 19 commits on `origin/main` carry the noreply address, the Actions run is green (build 1m10s, deploy 12s), live site at 390x844: start card, then card "1 / 66", Fredoka loaded, only requests to the Pages host, console clean |

## 4. History

| Slice | Commit |
|---|---|
| 2.1 | `9d6d173` |
| 2.2 | `6336ef5` |
| 2.3 | `3d38563` (hash update after the identity rewrite) |

## 5. Open issues

- **Not tested on a real phone from the live URL.** I checked it in the browser pane at 390x844 only.
- **The repo is public**, including `WORKFLOW.md`, `SPEC.md` and all questions. Anyone who opens the site can also read all questions in the page source. Fine for a group test, relevant if the questions become a product.
- **No licence** is set (all rights reserved by default). Decide in Phase 3.
- **Old email still exists locally.** The local tag `backup-pre-noreply` and `refs/original/` hold the pre-rewrite commits with the iCloud address. They were not pushed. Delete them when you no longer need the backup: `git tag -d backup-pre-noreply` and `git update-ref -d refs/original/refs/heads/main` (and the same for the two phase branches).
- **Runner note:** GitHub announced that `ubuntu-latest` moves to Ubuntu 26 on 2026-10-19 (shown as an annotation). Nothing to do now.
- The local phase branches are rewritten and merged, but only `main` is on GitHub.
