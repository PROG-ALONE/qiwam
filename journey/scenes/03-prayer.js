import { h } from '../../core/ui/dom.js';
import { knee } from '../../core/viz/knee.js';

export default {
  title: 'العلامة الأولى',
  date: '2025',
  tone: 'night',
  questions: ['q.bone'],
  mount(stage, { done }) {
    const k = knee({ angle: 8, bump: 0.15, skin: 1 });
    const lines = [
      h('p.j-line', 'العلامة الأولى لم تظهر في الملعب، بل في الصلاة.'),
      h('p.j-line', 'وأنا أصلّي، لاحظتُ نتوءًا في رجلي. قلت: حبّة.'),
      h('p.j-line.j-reveal', { hidden: true }, 'لكنّ النتوء أخذ يكبر ويكبر...'),
      h('p.j-line.j-reveal', { hidden: true }, 'حتى برز العظم.'),
    ];
    const hint = h('p.j-hint', 'المس النتوء');
    const target = h('button.j-hit', { type: 'button', 'aria-label': 'المس النتوء' }, k.el);

    let taps = 0;
    const STEPS = 5;
    target.addEventListener('click', () => {
      if (taps >= STEPS) return;
      taps++;
      const t = taps / STEPS;
      k.set({ bump: 0.15 + t * 0.85, skin: 1 - Math.max(0, t - 0.5) * 1.5, bone: Math.max(0, t - 0.4) / 0.6 });
      if (taps === 2) lines[2].hidden = false;
      if (taps >= STEPS) finish();
    });

    stage.append(h('div.j-split', h('div.j-text', lines, hint), h('figure.j-figure', target)));

    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      taps = STEPS;
      k.set({ bump: 1, skin: 0.25, bone: 1 });
      lines.forEach(l => (l.hidden = false));
      hint.hidden = true;
      done();
    }
    return { finish };
  },
};
