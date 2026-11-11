# THE IDENTITY BLUEPRINT → App Plan
Review of the Complete Edition PDF (88 pages, ~15,300 words) + plan to turn it into a simple app.
Prepared 2026-11-10. Source PDF: identity-blueprint-complete-edition.pdf (this folder).

## 1. What the book actually is (structure)

- Front matter (pp. 1–4): how to use it, the honesty note ("self-reflection prompts, not a validated psychological assessment"), and a quick-comparison table of the six archetypes (name / verb / "a useful place to begin").
- Six archetype chapters, 14 pages each, identical structure:
  1. **Profile** — possible profile, possible motivation, "Try this lens" (where does it fit / where does it miss)
  2. **Constructive use** + a practical example
  3. **Choose Your Signal worksheet** — my situation · by end of week I would like to… · I'll know I moved forward when… · the part I can influence · what I am NOT trying to solve this week · keep-the-scope-humane note
  4. **Seven-day path** — one page per day, every day the same six blocks: Objective · Archetype Lens note · Example (illustrative, not your answer) · Exercise · Reflect prompt · Manageable Action · Takeaway · Notes lines
  5. **After the seven days** — "My Next Move": a cue/condition that could help + when I will review whether this still fits (continue / adjust / pause / complete)
  6. **Printable worksheet + printable week review** (one example that sharpened my view · one thing that did not fit / I release · one condition that helped · next action I choose · reminder cue)
- The seven days are ONE universal skeleton, re-skinned per archetype:
  **1 Name the outcome · 2 Notice support · 3 Map friction · 4 Choose · 5 Prepare · 6 Test · 7 Review** (42 day-pages total).

## 2. Review — strengths

- **Ethically careful copy.** No diagnosis/prediction claims; examples explicitly "illustrative, not your answer"; user's judgment stays in the lead. This framing must survive into the app verbatim in spirit.
- **Genuinely actionable.** Every day ends in one manageable action + a takeaway; the week ends in a review with permission to pause/complete — no streak-shaming.
- **One engine, six skins.** The repeated structure is a feature for an app: build the journey player once, ship six content packs.
- **Scope control is built in** ("what I am NOT solving this week", "keep the scope humane") — rare and valuable; keep it prominent in the app.

## 3. Review — issues to fix (in the app, and ideally in the PDF)

1. **Duplicated text layer (product defect).** In the PDF file, body lines are stored twice (extraction/screen-reader view shows every line duplicated). Visually fine, but it breaks text search, copy-paste, and screen readers. Worth regenerating the PDF from source with a clean text layer — and it means app content extraction needs a dedupe pass.
2. **The book and the assessment are disconnected.** The book says "start with the result that brought you here," but nothing carries the site's assessment result into the reading experience. The app should close this loop (see §4).
3. **Static where it should be stateful.** Notes are print-only lines; there's no memory of yesterday, no "you are on Day 3," no reminder for the review date the book itself asks you to set. All of that is app-shaped.
4. **88 pages overstate the content.** ~15k words; the perceived bulk comes from repeating the skeleton ×6. In app form the true size is small — good news for build cost.

## 4. The app concept — "the book as a journey player"

**One-liner:** Selfsignal app = pick a lens, set your signal, walk seven days one card at a time, review, choose your next move. Everything else is library.

### Core loop (the whole app, in order)
1. **Arrive with a result** — deep link / code from the site's free assessment pre-selects your primary archetype (fixes issue #2). No result? Browse the six and pick — the book explicitly allows starting anywhere.
2. **Choose Your Signal** — the worksheet becomes a 5-field form (situation, week outcome, "moved forward when…", part I can influence, NOT solving). One screen, all optional except the outcome.
3. **Today card** — one day at a time: Objective → Lens note → (collapsible Example) → Exercise → Reflect (journal box) → Manageable Action (one-tap "done / skip") → Takeaway. Progress = "Day 3 of 7", never a streak.
4. **Week review** — the printable review becomes a form: sharpened my view / didn't fit or release / condition that helped / next action / reminder cue.
5. **My Next Move card** — saved home-screen card: next step + cue + review date, with an optional reminder on that date. Verdict chips exactly as the book words them: Continue · Adjust · Pause · Complete.
6. **Switch lenses freely** — start another archetype's journey on the same situation, or a new signal. Past journeys stay in History with their notes.

### Screens (6, that's all)
- **Home / Today** — current journey status, today's card entry, Next Move card if set
- **Archetypes** — six lens cards (orb, name, verb, "a useful place to begin"), primary result badged
- **Journey** — Signal form → 7 day cards → review (the player)
- **Journal / History** — all entries + past journeys, searchable
- **Next Move** — the card + review-date reminder
- **About** — the book's framing note (not a validated assessment…), privacy, export/delete my data

### Simplicity rules (non-negotiable, from the book's own tone)
- One journey at a time; one primary button per screen ("Today's step")
- Everything skippable; nothing locks; no streaks, no scores, no badges
- No account required — on-device storage, matching the site's "scored in your browser, not saved or sent" privacy stance; export = the printable worksheets as PDF (the book's printables, generated from your filled answers)
- Inter + near-black + archetype orbs (reuse Brand Kit assets already extracted)

### Content model (why this is cheap to build)
- **Static content packs (JSON), extracted from the PDF:** per archetype — profile, motivation, try-this-lens, constructive use, example, 7 days × (objective, lens, example, exercise, reflect, action, takeaway). 6 packs, written once, dedupe pass for issue #1.
- **User state (local):** signals, day entries (reflect text, action done/skip, notes), reviews, next moves. Tiny schema.

## 5. Monetization fit
- Free (already live): site assessment → result → **app preview**: your archetype's profile + Day 1.
- **$29 Blueprint = the app unlock** (all six journeys + reviews + printable export) — the PDF becomes the included printable companion instead of the product itself. Same price point, much stronger offer, and it answers the site's current "planned premium digital guide" wording with a real product.
- No subscription. Matches "minimal operating expense".

## 6. Build paths

**A. Web app (PWA) inside selfsignal.madethis.app — RECOMMENDED**
- Lives at /app on the existing domain: same funnel (assessment → app), same checkout, hosting already paid, MadeThis agent builds it from this spec + the content packs; Monet supplies spec, extracted content packs, brand assets, and QA.
- Installable to home screen, works offline, no app-store review/fees, no accounts needed (local-first fits PWA storage).
- Cost: MadeThis credits for the build (metered — get a quote first; this is exactly the kind of heavy task credits should go to).

**B. Standalone PWA built by Monet (GitHub Pages pattern, like his other apps)**
- More design control, $0 build credits — but splits the funnel across domains, duplicates hosting/auth/checkout work, and underuses the MadeThis setup he is already paying for. Fallback if A's quote is unreasonable.

**C. Native app (App Store / Play)** — not now: store fees, review friction, and accounts pressure all fight the product's privacy stance and the first-10-customers goal. Revisit only with proven demand.

## 7. Phases
- **MVP (one archetype end-to-end):** assessment handoff (result code/link), Signal form, 7-day player, journal, week review, Next Move + reminder, local save. Ship with the buyer's primary archetype only.
- **V1:** all six packs, lens switching, printable PDF export of filled worksheets, paywall/unlock wiring to the existing $29 checkout.
- **V2 (only if selling):** shareable Identity Card from the app, optional account/sync, assessment analytics (starts/completions — currently NOT tracked), additional journeys.

## 8. Decisions for Jesse
1. Build path A vs B (recommendation: A, with a credit quote from MadeThis first)
2. Free preview depth: profile + Day 1 (recommended) vs profile only
3. Does the $29 price stay, now that it's an app + PDF bundle? (recommendation: yes — stronger value at the same anchor)
