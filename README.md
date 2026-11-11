# Selfsignal — Identity Blueprint App

A simple, private, local-first web app built from **THE IDENTITY BLUEPRINT — Complete Edition**.

**Flow:** pick the archetype lens you're going through → set your signal (one situation) → walk a seven-day path, one day card at a time → week review → your next move. No account, no tracking — everything is stored on the device (localStorage).

## Run it
Any static host works. Locally:

```
npx serve .
# or
python3 -m http.server
```

Then open the printed URL. Add to home screen for the app experience (PWA).

## Files
- `index.html`, `styles.css`, `app.js` — the app (vanilla, no build step)
- `content.js` — all six archetype content packs, extracted from the book (42 day cards: objective, lens, example, exercise, reflect, manageable action, takeaway per day)
- `docs/APP_PLAN.md` — the book review + product plan this build follows
- `sw.js`, `manifest.webmanifest` — PWA shell (network-first for navigations; bump the cache version on every release)

## Privacy & framing
Self-reflection prompts, not a validated psychological assessment. User entries never leave the device; a full delete lives on the History screen.

## Status
Plan B standalone build (2026-11-10). MVP covers all six archetypes end-to-end.
Live: https://ne3ula.github.io/selfsignal-app/ (GitHub Pages, repo made public at Jesse's direction 2026-11-10). Whether MadeThis later recreates it on selfsignal.madethis.app is an open decision.
