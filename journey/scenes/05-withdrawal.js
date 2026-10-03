import { h, s } from '../../core/ui/dom.js';

// محطات الانسحاب من البرومت 08 بالضبط. الوزن: 69 بالبداية، و85 بعد رمضان (ما عندنا قراءات بينهما، فما نرسم منحنى).
const STOPS = [
  { label: 'أيار 2025', text: 'رجلي صارت توجعني. وكملت.' },
  { label: 'تشرين الأول 2025', text: 'وقفت حديد الرجل. وبقيت ألعب طوبة.', drop: 'legs' },
  { label: 'تشرين الثاني 2025', text: 'وقفت الطوبة. ما بقيت أكدر.', drop: 'ball' },
  { label: 'شباط 2026', text: 'وقفت كل شي.', drop: 'all' },
  { label: 'بعد رمضان 2026', text: 'رجعت للحديد، بس الجزء العلوي. والميزان صعد.', weight: true },
];

export default {
  title: 'الانسحاب',
  date: '2025 – 2026',
  tone: 'night',
  questions: ['q.silent', 'q.plate'],
  mount(stage, { done }) {
    const items = {
      legs: h('li.j-item', h('span.j-item-icon', { 'aria-hidden': 'true' }, barbell()), 'حديد الرجل'),
      ball: h('li.j-item', h('span.j-item-icon', { 'aria-hidden': 'true' }, ball()), 'الطوبة'),
      rest: h('li.j-item', h('span.j-item-icon', { 'aria-hidden': 'true' }, barbell(true)), 'الحديد العلوي'),
    };
    const list = h('ul.j-items', Object.values(items));

    const scaleNum = h('span.j-scale-num.ltr', '69');
    const scale = h('div.j-scale', { 'aria-live': 'polite' }, h('span.j-scale-label', 'الوزن'), scaleNum, h('span.j-scale-unit', 'كغم'));

    const when = h('p.j-when', STOPS[0].label);
    const what = h('p.j-line', STOPS[0].text);
    const slider = h('input.j-range', { type: 'range', min: 0, max: STOPS.length - 1, step: 1, value: 0, 'aria-label': 'الزمن', 'data-drag': '' });
    const ticks = h('div.j-ticks', { 'aria-hidden': 'true' }, STOPS.map(st => h('span', st.label)));

    const apply = (i) => {
      when.textContent = STOPS[i].label;
      what.textContent = STOPS[i].text;
      items.legs.classList.toggle('is-gone', i >= 1);
      items.ball.classList.toggle('is-gone', i >= 2);
      items.rest.classList.toggle('is-gone', i >= 3 && i < 4);
      scale.classList.toggle('is-up', i >= 4);
      scaleNum.textContent = i >= 4 ? '85' : '69';
      if (i === STOPS.length - 1) done();
    };
    slider.addEventListener('input', () => apply(+slider.value));

    stage.append(
      h('div.j-text.j-text--wide',
        h('p.j-line', 'ما توقفت مرة وحدة. انسحبت شوي شوي.'),
        h('p.j-line.j-soft', 'اسحب الزمن.')),
      h('div.j-withdraw',
        h('div.j-timebox', when, what),
        list,
        scale),
      h('div.j-control.j-control--time', slider, ticks));

    return { finish: () => { slider.value = STOPS.length - 1; apply(STOPS.length - 1); } };
  },
};

function barbell(upper = false) {
  return s('svg', { viewBox: '0 0 64 32', width: 40, height: 20 },
    s('rect', { x: 4, y: 8, width: 6, height: 16, rx: 1.5 }),
    s('rect', { x: 54, y: 8, width: 6, height: 16, rx: 1.5 }),
    s('rect', { x: 10, y: 11, width: 4, height: 10, rx: 1 }),
    s('rect', { x: 50, y: 11, width: 4, height: 10, rx: 1 }),
    s('rect', { x: 14, y: 15, width: 36, height: 2 }));
}
function ball() {
  return s('svg', { viewBox: '0 0 32 32', width: 22, height: 22 },
    s('circle', { cx: 16, cy: 16, r: 13, fill: 'none', 'stroke-width': 2, stroke: 'currentColor' }),
    s('path', { d: 'M16 9l5 4-2 6h-6l-2-6z' }));
}
