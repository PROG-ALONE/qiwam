import { h, typewriter } from '../../core/ui/dom.js';

export default {
  title: 'الافتتاح',
  date: '',
  tone: 'night',
  questions: ['q.what'],
  mount(stage, { done }) {
    const line = h('p.j-line.j-line--big');
    const hint = h('p.j-hint', { hidden: true }, 'المس الشاشة');
    const tap = h('button.j-tapzone', { type: 'button', 'aria-label': 'أكمل' });
    stage.append(h('div.j-center', line, hint), tap);

    const text = 'أصعب حركة مرّت عليّ لم تكن تسديدة، ولا رفعة بوزن 360 باوندًا. كانت حركة يؤدّيها طفل في السابعة من عمره.';
    const t = typewriter(line, text);
    let typed = false;
    t.done.then(() => { typed = true; hint.hidden = false; });

    const finish = () => { t.finish(); typed = true; hint.hidden = true; tap.remove(); done(); };
    tap.addEventListener('click', () => (typed ? finish() : t.finish()));
    return { finish };
  },
};
