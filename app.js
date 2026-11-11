/* Selfsignal app — Plan B standalone build.
   One journey at a time: pick a lens -> set your signal -> 7 day cards -> review -> next move.
   All state is local (localStorage). No account, no tracking. */
'use strict';

const PACKS = window.SS_CONTENT.packs;
const bySlug = Object.fromEntries(PACKS.map(p => [p.slug, p]));
const KEY = 'selfsignal-app-v1';

let state = load();
function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { journeys: [], activeId: null }; }
  catch { return { journeys: [], activeId: null }; }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function active() { return state.journeys.find(j => j.id === state.activeId) || null; }
function uid() { return 'j' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function fmtDate(iso) { try { return new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return iso; } }

const app = document.getElementById('app');

/* ---------------- Home ---------------- */
function viewHome() {
  const j = active();
  let resume = '';
  if (j) {
    const p = bySlug[j.slug];
    const doneCount = Object.values(j.days || {}).filter(d => d.action).length;
    let stage = 'Set your signal';
    if (j.signalDone) stage = j.review ? 'Your next move' : (doneCount >= 7 ? 'Week review' : `Day ${Math.min(doneCount + 1, 7)} of 7`);
    resume = `
      <div class="card accent" style="--c:${p.color}">
        <div class="kicker">Current journey · ${esc(p.name)} / ${esc(p.verb)}</div>
        <h2 style="margin-top:8px">${esc(j.signal?.outcome || p.begin)}</h2>
        <div class="daydots">${[1,2,3,4,5,6,7].map(n => `<i class="${(j.days?.[n]?.action) ? 'done' : ''}"></i>`).join('')}</div>
        <p class="progress-note">${stage}</p>
        <div class="btn-row"><a class="btn" href="#/journey">Continue</a>
        <a class="btn secondary" href="#/lens/${p.slug}">About this lens</a></div>
      </div>`;
  }
  if (j?.nextMove?.step) {
    const p = bySlug[j.slug];
    resume += `
      <div class="card">
        <div class="kicker">My next move</div>
        <p class="body" style="margin-top:8px"><strong>${esc(j.nextMove.step)}</strong></p>
        ${j.nextMove.cue ? `<p class="body">Cue: ${esc(j.nextMove.cue)}</p>` : ''}
        ${j.nextMove.reviewDate ? `<p class="progress-note">Review on ${fmtDate(j.nextMove.reviewDate)}${j.nextMove.verdict ? ' · ' + esc(j.nextMove.verdict) : ''}</p>` : ''}
      </div>`;
  }
  app.innerHTML = `
    <h1>Discover your code.<br><span class="grad">Rewrite your story.</span></h1>
    <p class="sub">Choose the lens you're going through. Name one situation, walk seven days of small steps, then decide your next move. Start fresh — switch lenses whenever you like.</p>
    ${resume}
    <h2>${j ? 'Choose another lens' : 'Choose your lens'}</h2>
    <div class="grid">
      ${PACKS.map(p => `
        <a class="lens-card" href="#/lens/${p.slug}">
          <span class="orb" style="--c:${p.color}"></span>
          <span><span class="name">${esc(p.name)}</span><br>
          <span class="verb" style="color:${p.color}">${esc(p.verb.toUpperCase())}</span>
          <span class="begin" style="display:block">${esc(p.begin)}</span></span>
        </a>`).join('')}
    </div>`;
}

/* ---------------- Lens detail ---------------- */
function viewLens(slug) {
  const p = bySlug[slug];
  if (!p) return viewHome();
  app.innerHTML = `
    <span class="orb lg" style="--c:${p.color}"></span>
    <h1 style="text-align:center">${esc(p.name)} <span style="color:${p.color}">/ ${esc(p.verb)}</span></h1>
    <p class="sub" style="text-align:center">${esc(p.begin)}</p>
    <div class="card">
      <div class="block-label">A possible profile</div>
      <p class="body">${esc(p.profile)}</p>
      <div class="block-label">A possible motivation</div>
      <p class="body">${esc(p.motivation)}</p>
      <div class="block-label">Try this lens</div>
      <p class="body">${esc(p.tryLens)}</p>
      <div class="block-label">Constructive use</div>
      <p class="body">${esc(p.constructive)}</p>
      <div class="block-label">A practical example</div>
      <p class="body">${esc(p.example)}</p>
      <div class="block-label">Ways this lens could be constructive</div>
      ${p.choices.map((c, i) => `<p class="body">${i + 1}. ${esc(c)}</p>`).join('')}
    </div>
    <div class="btn-row">
      <button class="btn" id="startBtn">Start the ${esc(p.name)} journey</button>
      <a class="btn secondary" href="#/">All lenses</a>
    </div>
    <p class="progress-note">Seven days, at your pace. One situation, one small step at a time.</p>`;
  document.getElementById('startBtn').onclick = () => {
    if (active() && !confirm('You already have a journey in progress. Start a new one? The current journey stays in your History.')) return;
    const j = { id: uid(), slug, created: new Date().toISOString(), signal: {}, signalDone: false, days: {}, review: null, nextMove: null };
    state.journeys.unshift(j); state.activeId = j.id; save();
    location.hash = '#/journey';
  };
}

/* ---------------- Journey: signal ---------------- */
const SIGNAL_FIELDS = [
  ['situation', 'My situation', 'One situation or outcome you want to work with.'],
  ['outcome', 'By the end of this week, I would like to…', 'Choose an outcome that can make progress in short sessions — a draft, one conversation, a simple decision, or a small repeatable action.'],
  ['moved', 'I will know I moved forward when I can…', ''],
  ['influence', 'The part I can influence is…', ''],
  ['notSolving', 'What I am not trying to solve this week', 'Keep the scope humane. Naming what is out of scope protects the week.'],
];
function viewSignal(j) {
  const p = bySlug[j.slug];
  app.innerHTML = `
    <div class="kicker" style="color:${p.color}">${esc(p.name)} / ${esc(p.verb)} · Choose your signal</div>
    <h1>Name the situation.<br>Keep the scope humane.</h1>
    ${SIGNAL_FIELDS.map(([k, label, hint]) => `
      <label class="field"><span>${label}</span>${hint ? `<small>${hint}</small>` : ''}
      <textarea data-f="${k}" rows="2">${esc(j.signal?.[k] || '')}</textarea></label>`).join('')}
    <div class="btn-row"><button class="btn" id="sigGo">Begin Day 1</button>
    <a class="btn secondary" href="#/">Later</a></div>`;
  app.querySelectorAll('textarea[data-f]').forEach(t => t.oninput = () => { j.signal[t.dataset.f] = t.value; save(); });
  document.getElementById('sigGo').onclick = () => { j.signalDone = true; save(); viewJourney(); };
}

/* ---------------- Journey: day card ---------------- */
function currentDay(j) {
  for (let n = 1; n <= 7; n++) if (!j.days[n]?.action) return n;
  return 7;
}
function viewDay(j, n) {
  const p = bySlug[j.slug];
  const day = p.days[n - 1];
  const e = j.days[n] || (j.days[n] = {});
  app.innerHTML = `
    <div class="kicker" style="color:${p.color}">${esc(p.name)} · Day ${n} of 7 · ${esc(day.stepName)}</div>
    <h1>${esc(day.stepTitle)}</h1>
    <div class="daydots" style="--c:${p.color}">${[1,2,3,4,5,6,7].map(k => `<i class="${j.days[k]?.action ? 'done' : (k === n ? 'now' : '')}"></i>`).join('')}</div>
    <div class="card" style="--c:${p.color}">
      <div class="block-label">Objective</div>
      <p class="body">${esc(day.objective)}</p>
      <div class="block-label">${esc(p.name)} lens</div>
      <p class="body">${esc(day.lens)}</p>
      <details class="example"><summary>Example — illustrative, not your answer</summary><p>${esc(day.example)}</p></details>
      <div class="block-label">Exercise</div>
      <p class="body">${esc(day.exercise)}</p>
      <div class="block-label">Reflect</div>
      <p class="body">${esc(day.reflect)}</p>
      <label class="field"><span>Your reflection</span>
        <textarea id="reflect" rows="3" placeholder="Short, factual notes are enough.">${esc(e.reflect || '')}</textarea></label>
      <div class="block-label">Manageable action</div>
      <p class="body">${esc(day.action)}</p>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn small ${e.action === 'done' ? 'toggle-on' : 'secondary'}" id="actDone" style="--c:${p.color}">I did this</button>
        <button class="btn small ${e.action === 'skip' ? 'toggle-on' : 'secondary'}" id="actSkip" style="--c:${p.color}">Skip this day</button>
      </div>
      <div class="block-label">Takeaway</div>
      <p class="body takeaway">${esc(day.takeaway)}</p>
      <label class="field"><span>Notes</span>
        <textarea id="notes" rows="2">${esc(e.notes || '')}</textarea></label>
    </div>
    <div class="btn-row">
      ${n > 1 ? `<button class="btn secondary" id="prev">← Day ${n - 1}</button>` : ''}
      ${n < 7 ? `<button class="btn" id="next">Day ${n + 1} →</button>` : `<button class="btn" id="toReview">Finish: week review →</button>`}
    </div>`;
  const bind = (id, key) => { const el = document.getElementById(id); if (el) el.oninput = () => { e[key] = el.value; save(); }; };
  bind('reflect', 'reflect'); bind('notes', 'notes');
  document.getElementById('actDone').onclick = () => { e.action = e.action === 'done' ? null : 'done'; save(); viewDay(j, n); };
  document.getElementById('actSkip').onclick = () => { e.action = e.action === 'skip' ? null : 'skip'; save(); viewDay(j, n); };
  const prev = document.getElementById('prev'); if (prev) prev.onclick = () => viewDay(j, n - 1);
  const next = document.getElementById('next'); if (next) next.onclick = () => viewDay(j, n + 1);
  const tr = document.getElementById('toReview'); if (tr) tr.onclick = () => viewReview(j);
}

/* ---------------- Journey: review + next move ---------------- */
const REVIEW_FIELDS = [
  ['sharpened', 'One example that sharpened my view'],
  ['released', 'One thing that did not fit, or that I release'],
  ['helped', 'One condition that helped'],
  ['nextAction', 'The next action I choose for myself'],
  ['cue', 'When or what cue will remind me'],
];
function viewReview(j) {
  const p = bySlug[j.slug];
  j.review = j.review || {};
  app.innerHTML = `
    <div class="kicker" style="color:${p.color}">${esc(p.name)} · Week review</div>
    <h1>Keep what is useful.</h1>
    <p class="sub">The result is a prompt. Your week is evidence you can interpret for yourself.</p>
    ${REVIEW_FIELDS.map(([k, label]) => `
      <label class="field"><span>${label}</span>
      <textarea data-f="${k}" rows="2">${esc(j.review[k] || '')}</textarea></label>`).join('')}
    <div class="btn-row"><button class="btn" id="revGo">Set my next move</button>
    <button class="btn secondary" id="revBack">Back to Day 7</button></div>`;
  app.querySelectorAll('textarea[data-f]').forEach(t => t.oninput = () => { j.review[t.dataset.f] = t.value; save(); });
  document.getElementById('revGo').onclick = () => viewNextMove(j);
  document.getElementById('revBack').onclick = () => viewDay(j, 7);
}
function viewNextMove(j) {
  const p = bySlug[j.slug];
  j.nextMove = j.nextMove || { step: j.review?.nextAction || '', cue: j.review?.cue || '', reviewDate: '', verdict: '' };
  const verdicts = ['Continue', 'Adjust', 'Pause', 'Complete'];
  app.innerHTML = `
    <div class="kicker" style="color:${p.color}">${esc(p.name)} · After the seven days</div>
    <h1>My next move.</h1>
    <p class="sub">Pair a first move with a continuation cue. Momentum can be paced and renewed — a useful review can end with continuing, adjusting, pausing, or deciding this is complete for now.</p>
    <label class="field"><span>The next step I choose</span>
      <textarea id="nmStep" rows="2">${esc(j.nextMove.step)}</textarea></label>
    <label class="field"><span>A cue or condition that could help</span>
      <textarea id="nmCue" rows="2">${esc(j.nextMove.cue)}</textarea></label>
    <label class="field"><span>When I will review whether this still fits</span>
      <input type="date" id="nmDate" value="${esc(j.nextMove.reviewDate || '')}"></label>
    <div class="block-label">For now, this is</div>
    <div class="chips">${verdicts.map(v => `<button class="chip ${j.nextMove.verdict === v ? 'on' : ''}" data-v="${v}">${v}</button>`).join('')}</div>
    <div class="btn-row"><button class="btn" id="nmSave">Save &amp; finish</button>
    <a class="btn secondary" href="#/">Home</a></div>`;
  document.getElementById('nmStep').oninput = e => { j.nextMove.step = e.target.value; save(); };
  document.getElementById('nmCue').oninput = e => { j.nextMove.cue = e.target.value; save(); };
  document.getElementById('nmDate').onchange = e => { j.nextMove.reviewDate = e.target.value; save(); };
  app.querySelectorAll('.chip').forEach(c => c.onclick = () => { j.nextMove.verdict = c.dataset.v; save(); viewNextMove(j); });
  document.getElementById('nmSave').onclick = () => { j.status = 'reviewed'; save(); location.hash = '#/'; };
}

function viewJourney() {
  const j = active();
  if (!j) return viewHome();
  if (!j.signalDone) return viewSignal(j);
  if (j.status === 'reviewed') return viewNextMove(j);
  return viewDay(j, currentDay(j));
}

/* ---------------- History ---------------- */
function viewHistory() {
  const items = state.journeys.map(j => {
    const p = bySlug[j.slug];
    const doneCount = Object.values(j.days || {}).filter(d => d.action).length;
    return `<a class="hist-item" href="#/lens/${p.slug}">
      <strong style="color:${p.color}">${esc(p.name)} / ${esc(p.verb)}</strong>${j.id === state.activeId ? ' · current' : ''}
      <div class="meta">${esc(j.signal?.outcome || p.begin)}</div>
      <div class="meta">Started ${fmtDate(j.created.slice(0, 10))} · ${doneCount}/7 days marked${j.nextMove?.verdict ? ' · ' + esc(j.nextMove.verdict) : ''}</div></a>`;
  }).join('');
  app.innerHTML = `<h1>History</h1>
    ${items || '<p class="empty">No journeys yet. Pick a lens on the home screen and start with one situation.</p>'}
    ${state.journeys.length ? '<div class="btn-row"><button class="btn secondary" id="wipe">Delete all my data</button></div>' : ''}`;
  const w = document.getElementById('wipe');
  if (w) w.onclick = () => { if (confirm('Delete all journeys and notes from this device? This cannot be undone.')) { state = { journeys: [], activeId: null }; save(); viewHistory(); } };
}

/* ---------------- About ---------------- */
function viewAbout() {
  app.innerHTML = `<h1>About Selfsignal</h1>
    <div class="card">
      <div class="block-label">A note on this framework</div>
      <p class="body">These archetypes are self-reflection prompts, not a validated psychological assessment, diagnosis, or prediction. A result cannot decide what is right for you or promise a particular outcome. Keep your own judgment in the lead; use only what helps.</p>
      <div class="block-label">How to use it</div>
      <p class="body">1. Name one situation or outcome you want to work with.<br>2. Choose a prompt or small action from a relevant archetype.<br>3. Notice what happens, then keep, change, or release the approach.</p>
      <div class="block-label">Privacy</div>
      <p class="body">Everything you write stays in this browser, on this device. Nothing is sent or saved anywhere else. You can delete it all from the History screen at any time.</p>
      <div class="block-label">Source</div>
      <p class="body">Content from THE IDENTITY BLUEPRINT — Complete Edition (Selfsignal). Discover your code. Rewrite your story.</p>
    </div>`;
}

/* ---------------- Router ---------------- */
function route() {
  const h = location.hash || '#/';
  const m = h.match(/^#\/lens\/(.+)$/);
  if (m) return viewLens(m[1]);
  if (h === '#/journey') return viewJourney();
  if (h === '#/history') return viewHistory();
  if (h === '#/about') return viewAbout();
  return viewHome();
}
window.addEventListener('hashchange', route);
route();

if (navigator.serviceWorker && typeof navigator.serviceWorker.register === 'function') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
