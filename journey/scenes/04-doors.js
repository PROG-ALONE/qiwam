import { h } from '../../core/ui/dom.js';

// ثلاثة أطباء، بلا أسماء ولا اتهام. فقط ما شعرتُ به كمريض لا يجد جوابًا.
const DOORS = [
  { answer: 'لا شيء فيك.' },
  { answer: 'خشونة.' },
  { answer: 'إبرة.', after: 'وبعد الإبرة، تورّمت رجلي كلها.' },
];

export default {
  title: 'ثلاثة أطباء',
  date: '2025',
  tone: 'night',
  questions: ['q.diagnosis'],
  mount(stage, { done }) {
    const ending = h('p.j-line.j-reveal', { hidden: true }, 'وفي النهاية، انتهى الجميع إلى الجواب نفسه: لا شيء فيك.');
    const opened = new Set();

    const doors = DOORS.map((d, i) => {
      const reply = h('p.j-door-reply', { hidden: true }, d.answer, d.after ? h('span.j-door-after', d.after) : null);
      const btn = h('button.j-door', { type: 'button', 'aria-label': `الباب ${i + 1}` },
        h('span.j-door-leaf', { 'aria-hidden': 'true' }, h('span.j-door-knob')));
      btn.addEventListener('click', () => open(i));
      return { btn, reply, wrap: h('div.j-door-wrap', btn, reply) };
    });

    function open(i) {
      if (opened.has(i)) return;
      opened.add(i);
      doors[i].btn.classList.add('is-open');
      doors[i].btn.disabled = true;
      doors[i].reply.hidden = false;
      if (opened.size === DOORS.length) { ending.hidden = false; done(); }
    }

    stage.append(
      h('div.j-text.j-text--wide',
        h('p.j-line', 'خلال عام 2025، راجعتُ ثلاثة أطباء.'),
        h('p.j-line.j-soft', 'افتح الأبواب.')),
      h('div.j-doors', doors.map(d => d.wrap)),
      h('div.j-text.j-text--wide', ending));

    return { finish: () => DOORS.forEach((_, i) => open(i)) };
  },
};
