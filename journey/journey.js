// محرك المدخل "السجدة": يحمّل المشهد، ويدير "تم التفاعل"، والأسئلة المعلقة، والتنقل.

import { h } from '../core/ui/dom.js';
import * as store from '../core/store.js';
import { go } from '../core/router.js';
import questions from '../content/journey/questions.js';

export const SCENES = 12;

const loaders = {
  1: () => import('./scenes/01-opening.js'),
  2: () => import('./scenes/02-strength.js'),
  3: () => import('./scenes/03-prayer.js'),
  4: () => import('./scenes/04-doctors.js'),
  5: () => import('./scenes/05-withdrawal.js'),
  6: () => import('./scenes/06-ninety.js'),
  7: () => import('./scenes/07-ramadan.js'),
  8: () => import('./scenes/08-reveal.js'),
  9: () => import('./scenes/09-physio.js'),
  10: () => import('./scenes/10-xray.js'),
  11: () => import('./scenes/11-road.js'),
  12: () => import('./scenes/12-gather.js'),
};

export function journeyState() {
  return {
    reached: store.get('journey', 'reached', 1),
    completed: store.get('journey', 'completed', false),
    asked: store.get('journey', 'asked', []),
    answered: store.get('journey', 'answered', []),
  };
}

export function ask(qid) {
  store.update('journey', 'asked', a => (a.includes(qid) ? a : [...a, qid]), []);
}
export function answer(qid) {
  store.update('journey', 'answered', a => (a.includes(qid) ? a : [...a, qid]), []);
}

export async function render(root, params) {
  const n = Math.max(1, Math.min(SCENES, parseInt(params.n, 10) || 1));
  const st = journeyState();
  if (n > st.reached && !st.completed) return go(`#/journey/${st.reached}`, { replace: true });

  const mod = (await loaders[n]()).default;
  const alreadyDone = n < st.reached || st.completed;

  const progress = h('ol.j-progress', { 'aria-label': `المشهد ${n} من ${SCENES}` },
    Array.from({ length: SCENES }, (_, i) => h('li', { class: i + 1 < n ? 'is-past' : i + 1 === n ? 'is-now' : '' })));

  const skipBtn = h('button.btn.btn--quiet.j-skip', { type: 'button' }, 'أكمل المشهد');
  const stage = h('div.j-stage', { 'data-scene': n });
  const qBox = h('div.j-questions', { 'aria-live': 'polite' });
  const prev = h('button.btn.btn--quiet', { type: 'button', disabled: n === 1 }, 'السابق');
  const next = h('button.btn.btn--primary.j-next', { type: 'button', disabled: true }, n === SCENES ? 'تابِع' : 'التالي');

  const section = h('section.journey', { 'data-scene': n, 'data-tone': mod.tone || 'night' },
    h('header.j-top',
      h('a.j-brand', { href: '#/journey/1', 'aria-label': 'قِوام' }, 'قِوام'),
      progress,
      skipBtn),
    h('div.j-date', mod.date || ''),
    h('h1.sr-only', mod.title),
    stage,
    qBox,
    h('nav.j-nav', prev, next));
  root.append(section);

  let isDone = false;
  const showQuestion = (qid) => {
    const q = questions[qid];
    if (!q || qBox.querySelector(`[data-q="${qid}"]`)) return;
    ask(qid);
    qBox.append(h('p.j-q', { 'data-q': qid }, h('span.j-q-mark', { 'aria-hidden': 'true' }, '؟'), h('span', q.text)));
  };
  const done = () => {
    if (isDone) return;
    isDone = true;
    (mod.questions || []).forEach(showQuestion);
    next.disabled = false;
    skipBtn.hidden = true;
    section.classList.add('is-done');
    if (n === st.reached && n < SCENES) store.set('journey', 'reached', n + 1);
    if (n === SCENES) store.set('journey', 'reached', SCENES);
    requestAnimationFrame(() => next.focus({ preventScroll: true }));
  };

  const ctx = { done, answer, ask, journey: journeyState };
  const ctl = (await mod.mount(stage, ctx)) || {};

  skipBtn.addEventListener('click', () => { ctl.finish ? ctl.finish() : done(); });
  if (alreadyDone) { /* المشاهد السابقة: نسمح بالتقدم مباشرة مع بقاء التفاعل */ next.disabled = false; }

  prev.addEventListener('click', () => go(`#/journey/${n - 1}`));
  next.addEventListener('click', () => {
    if (next.disabled) return;
    go(n === SCENES ? '#/bridge' : `#/journey/${n + 1}`);
  });

  // لوحة المفاتيح: الأسهم (RTL: اليسار = التالي)
  const onKey = (e) => {
    if (!document.body.contains(section)) return document.removeEventListener('keydown', onKey);
    if (e.target.closest('input, [data-drag]')) return;
    if (e.key === 'ArrowLeft') next.click();
    if (e.key === 'ArrowRight' && !prev.disabled) prev.click();
  };
  document.addEventListener('keydown', onKey);

  // السحب الأفقي على النص (مو على الرسوم التفاعلية)
  let sx = null, sy = null;
  section.addEventListener('pointerdown', e => {
    if (e.target.closest('[data-drag], input, button, canvas')) { sx = null; return; }
    sx = e.clientX; sy = e.clientY;
  });
  section.addEventListener('pointerup', e => {
    if (sx == null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // RTL: السحب نحو اليمين يجيب الصفحة اللي بعدها (مثل تقليب كتاب عربي)
      if (dx > 0) next.click(); else if (!prev.disabled) prev.click();
    }
  });
}
