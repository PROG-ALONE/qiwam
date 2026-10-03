import { h, s } from '../../core/ui/dom.js';

// العودة ثم الانسحاب: من فترة التوقف بعد الطبيب الثاني، إلى كانون الثاني 2026 (كما رواها صاحب القصة).
// on: ما زال يمارسه في هذه المحطة.
const STOPS = [
  { label: 'بعد الطبيب الثاني', text: 'توقفتُ فترة عن كل شيء: لا تمرين، ولا مشي، ولا صلاة على الأرض.', on: [] },
  { label: 'تشرين الثاني 2025', text: 'عدتُ إلى التمرين، ولعبتُ كرة القدم من جديد.', on: ['ball', 'legs', 'upper'] },
  { label: 'بعدها', text: 'تركتُ كرة القدم.', on: ['legs', 'upper'] },
  { label: 'ثم', text: 'تركتُ تمارين الأرجل.', on: ['upper'] },
  { label: 'كانون الثاني 2026', text: 'تركتُ كل شيء. عادت الحالة، وأردتُ أن أحفظ ركبتي لصلاة رمضان.', on: [] },
];

export default {
  title: 'العودة والانسحاب',
  date: '2025 – 2026',
  tone: 'night',
  questions: ['q.silent'],
  mount(stage, { done }) {
    // الترتيب من اليمين إلى اليسار: كرة القدم، ثم تمارين الأرجل، ثم الجزء العلوي
    const items = {
      ball: h('li.j-item', h('span.j-item-icon', { 'aria-hidden': 'true' }, ball()), h('span.j-item-name', 'كرة القدم')),
      legs: h('li.j-item', h('span.j-item-icon', { 'aria-hidden': 'true' }, barbell()), h('span.j-item-name', 'تمارين الأرجل')),
      upper: h('li.j-item', h('span.j-item-icon', { 'aria-hidden': 'true' }, dumbbell()), h('span.j-item-name', 'تمارين الجزء العلوي')),
    };
    const list = h('ul.j-items', Object.values(items));

    const when = h('p.j-when');
    const what = h('p.j-line');
    const slider = h('input.j-range', { type: 'range', min: 0, max: STOPS.length - 1, step: 1, value: 0, 'aria-label': 'الزمن', 'data-drag': '' });
    const ticks = h('div.j-ticks', { 'aria-hidden': 'true' }, STOPS.map(st => h('span', st.label)));

    const apply = (i) => {
      when.textContent = STOPS[i].label;
      what.textContent = STOPS[i].text;
      for (const [k, el] of Object.entries(items)) el.classList.toggle('is-gone', !STOPS[i].on.includes(k));
      if (i === STOPS.length - 1) done();
    };
    slider.addEventListener('input', () => apply(+slider.value));
    apply(0);

    stage.append(
      h('div.j-text.j-text--wide',
        h('p.j-line', 'لم أتوقف دفعة واحدة، ولم أعُد دفعة واحدة.'),
        h('p.j-line.j-soft', 'اسحب الزمن.')),
      list,
      h('div.j-timebox', when, what),
      h('div.j-control.j-control--time', slider, ticks));

    return { finish: () => { slider.value = STOPS.length - 1; apply(STOPS.length - 1); } };
  },
};

function barbell() {
  return s('svg', { viewBox: '0 0 64 32', width: 44, height: 22 },
    s('rect', { x: 4, y: 8, width: 6, height: 16, rx: 1.5 }),
    s('rect', { x: 54, y: 8, width: 6, height: 16, rx: 1.5 }),
    s('rect', { x: 10, y: 11, width: 4, height: 10, rx: 1 }),
    s('rect', { x: 50, y: 11, width: 4, height: 10, rx: 1 }),
    s('rect', { x: 14, y: 15, width: 36, height: 2 }));
}
function dumbbell() {
  return s('svg', { viewBox: '0 0 40 32', width: 30, height: 22 },
    s('rect', { x: 4, y: 9, width: 7, height: 14, rx: 2 }),
    s('rect', { x: 29, y: 9, width: 7, height: 14, rx: 2 }),
    s('rect', { x: 11, y: 14.5, width: 18, height: 3 }));
}
function ball() {
  return s('svg', { viewBox: '0 0 32 32', width: 26, height: 26 },
    s('circle', { cx: 16, cy: 16, r: 13, fill: 'none', 'stroke-width': 2, stroke: 'currentColor' }),
    s('path', { d: 'M16 9l5 4-2 6h-6l-2-6z' }));
}
