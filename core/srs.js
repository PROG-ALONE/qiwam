// التكرار المتباعد بخوارزمية SM-2 للبطاقات والأسئلة التي أُخطئ فيها.
// quality: 0–5 (أقل من 3 = لم أتذكر).
import * as store from './store.js';

const DAY = 864e5;

export function getCards() { return store.get('srs', 'cards', {}); }

export function review(id, quality, meta = {}) {
  return store.update('srs', 'cards', cards => {
    const c = cards[id] || { ef: 2.5, interval: 0, reps: 0, due: Date.now(), ...meta };
    if (quality < 3) { c.reps = 0; c.interval = 1; }
    else {
      c.reps += 1;
      c.interval = c.reps === 1 ? 1 : c.reps === 2 ? 6 : Math.round(c.interval * c.ef);
    }
    c.ef = Math.max(1.3, c.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    c.due = Date.now() + c.interval * DAY;
    Object.assign(c, meta);
    return { ...cards, [id]: c };
  }, {});
}

/** أضف سؤالًا أخطأ فيه المتعلم ليعود إليه غدًا */
export const addMistake = (qid, meta) => review(`q:${qid}`, 1, { kind: 'question', ...meta });

export function dueCards(now = Date.now()) {
  return Object.entries(getCards()).filter(([, c]) => c.due <= now).map(([id, c]) => ({ id, ...c }));
}
