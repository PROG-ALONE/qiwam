import { h, s, wait, reducedMotion } from '../../core/ui/dom.js';

// الجانب الديني من القصة، في مشهد مستقل قبل الكشف.
const NIGHTS = 30;
const LIT = 19;

export default {
  title: 'رمضان',
  date: 'رمضان 2026',
  tone: 'deep',
  questions: [],
  mount(stage, { done }) {
    const nights = h('ol.j-nights', { 'aria-label': 'ليالي رمضان' },
      Array.from({ length: NIGHTS }, (_, i) => h('li.j-night', { 'data-n': i + 1, title: `الليلة ${i + 1}` }, crescent())));
    const counter = h('p.j-when.j-nights-count', { 'aria-live': 'polite' }, '');
    const pray = h('button.btn.btn--primary.j-pray', { type: 'button' }, 'ليلة بعد ليلة');
    const after = [
      h('p.j-line.j-quiet', 'وصلّيتُ الليالي كاملة: قيامًا وركوعًا وسجودًا، ليلة بعد ليلة.'),
      h('p.j-line.j-quiet', 'وكانت نيتي أن أتمّ التراويح كلها.'),
    ];
    after.forEach(a => (a.hidden = true));

    stage.append(h('div.j-text.j-text--wide',
      h('p.j-line', 'في كانون الثاني تركتُ كل شيء. لم يكن ذلك استسلامًا، بل استعدادًا: أردتُ أن أحفظ ركبتي لصلاة رمضان.'),
      h('p.j-line', 'فالصلاة عندي ليست حركة، لكنها تحتاج إلى حركة.')),
      nights, counter, h('div.j-row', pray),
      h('div.j-text.j-text--wide', after));

    const items = [...nights.children];
    let started = false, finished = false;

    async function play(fast) {
      if (started && !fast) return;
      started = true;
      pray.hidden = true;
      for (let i = 0; i < LIT; i++) {
        items[i].classList.add(i === LIT - 1 ? 'is-flicker' : 'is-lit');
        counter.textContent = `الليلة ${i + 1}`;
        if (!fast && !reducedMotion()) await wait(i === LIT - 1 ? 900 : 170);
        if (finished && !fast) break;
      }
      counter.textContent = 'حتى الليلة التاسعة عشرة.';
      after.forEach(a => (a.hidden = false));
      finish();
    }
    function finish() {
      if (finished) return;
      finished = true;
      done();
    }
    pray.addEventListener('click', () => play(false));
    return { finish: () => play(true) };
  },
};

function crescent() {
  return s('svg', { viewBox: '0 0 20 20', width: 18, height: 18, 'aria-hidden': 'true' },
    s('path', { d: 'M13 3a7 7 0 1 0 4 12A6 6 0 0 1 13 3z' }));
}
