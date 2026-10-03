import { h } from '../../core/ui/dom.js';
import { knee } from '../../core/viz/knee.js';

export default {
  title: 'القوة',
  date: 'مطلع 2025',
  tone: 'night',
  questions: ['q.load'],
  mount(stage, { done }) {
    const k = knee({ load: 0 });
    const feel = h('output.j-readout', 'ما أشعر به: لا شيء');
    const after = h('p.j-line.j-reveal', { hidden: true }, 'وكان الوتر يحمل ذلك كله. بصمت.');

    const slider = h('input.j-range', {
      type: 'range', min: 0, max: 100, value: 0, step: 1,
      'aria-label': 'الحمل', 'data-drag': '',
    });
    const loadLabel = h('span.j-range-label', 'الحمل');

    slider.addEventListener('input', () => {
      k.set({ load: +slider.value / 100 });
      // الإحساس لا يتغير، وهذا هو المعنى
      if (+slider.value >= 90) finish();
    });

    stage.append(
      h('div.j-split',
        h('div.j-text',
          h('p.j-line', 'في مطلع 2025 كان جسدي في أفضل حالاته: كرة قدم في الملعب، ومشي ساعة كل يوم، وتمارين حديد بلغتُ فيها 360 باوندًا في ضغط الأرجل، ووزني 69 كيلوغرامًا.'),
          h('p.j-line', 'وفي الوقت نفسه كانت رسالة الماجستير تقترب من نهايتها. والإنجاز لا يأتي جالسًا: تنقّل يومي بين الكلية والمكاتب لإكمال المتطلبات، وصعود ونزول، ووقوف طويل، حتى ناقشتُ الرسالة في 31 تموز 2025.'),
          h('p.j-line.j-soft', 'كان كل شيء يصعد، وكل شيء يضع حمله على الركبة نفسها. اسحب الحمل وشاهد.'),
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
