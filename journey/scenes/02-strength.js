import { h } from '../../core/ui/dom.js';
import { knee } from '../../core/viz/knee.js';

export default {
  title: 'القوة',
  date: 'بداية 2025',
  tone: 'night',
  questions: ['q.load'],
  mount(stage, { done }) {
    const k = knee({ load: 0 });
    const feel = h('output.j-readout', 'شنو أحس: ولا شي');
    const after = h('p.j-line.j-reveal', { hidden: true }, 'والوتر كان يشيل كل هذا. بصمت.');

    const slider = h('input.j-range', {
      type: 'range', min: 0, max: 100, value: 0, step: 1,
      'aria-label': 'الحمل', 'data-drag': '',
    });
    const loadLabel = h('span.j-range-label', 'الحمل');

    const update = (v) => {
      k.set({ load: v / 100 });
      // الإحساس ما يتغير: هذا هو المعنى
      if (v >= 90) finish();
    };
    slider.addEventListener('input', () => update(+slider.value));

    stage.append(
      h('div.j-split',
        h('div.j-text',
          h('p.j-line', 'ملعب، ومشي ساعة كل يوم، وحديد.'),
          h('p.j-line', 'ليك برس بـ 360 باوند، ووزني 69 كيلو.'),
          h('p.j-line', 'وبـ 31 تموز 2025 ناقشت رسالة الماجستير.'),
          h('p.j-line.j-soft', 'كل شي كان يصعد. اسحب الحمل وشوف.'),
          after),
        h('figure.j-figure', k.el,
          h('div.j-control', loadLabel, slider, feel))));

    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      slider.value = 100; k.set({ load: 1 });
      after.hidden = false;
      done();
    }
    return { finish };
  },
};
