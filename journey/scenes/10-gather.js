import { h, s, typewriter, reducedMotion } from '../../core/ui/dom.js';
import { skeleton, JOINTS } from '../../core/viz/figure.js';
import questions from '../../content/journey/questions.js';

export default {
  title: 'التجميع',
  date: '',
  tone: 'night',
  questions: [],
  mount(stage, { done, journey }) {
    const asked = journey().asked.filter(q => q !== 'q.what' && questions[q]);
    const ids = asked.length ? asked : Object.keys(questions).filter(q => q !== 'q.what');

    const field = h('div.j-gather');
    const chips = ids.map((id, i) => {
      const c = h('span.j-chip', questions[id].text);
      // توزيع مبعثر ثابت (مو عشوائي حتى يبقى نفس الشكل كل مرة)
      const angle = (i / ids.length) * Math.PI * 2 + 0.4;
      c.style.setProperty('--x', `${50 + Math.cos(angle) * 34}%`);
      c.style.setProperty('--y', `${48 + Math.sin(angle) * 34}%`);
      field.append(c);
      return c;
    });

    const svg = s('svg', { viewBox: '0 0 300 620', class: 'j-gather-fig', 'aria-hidden': 'true' });
    const fig = skeleton();
    svg.append(fig);
    field.append(svg);

    const line = h('p.j-line.j-line--big.j-final');
    const hint = h('p.j-hint', 'المس حتى تتجمع الأسئلة');
    const tap = h('button.j-tapzone', { type: 'button', 'aria-label': 'اجمع الأسئلة' });

    stage.append(field, h('div.j-center.j-center--bottom', line, hint), tap);

    let gathered = false;
    function gather() {
      if (gathered) return;
      gathered = true;
      tap.remove(); hint.hidden = true;
      const targets = Object.values(JOINTS);
      const fr = field.getBoundingClientRect();
      const sr = svg.getBoundingClientRect();
      chips.forEach((c, i) => {
        const [jx, jy] = targets[(i * 3 + 2) % targets.length];
        const tx = sr.left - fr.left + (jx / 300) * sr.width;
        const ty = sr.top - fr.top + (jy / 620) * sr.height;
        const cr = c.getBoundingClientRect();
        const dx = tx - (cr.left - fr.left + cr.width / 2);
        const dy = ty - (cr.top - fr.top + cr.height / 2);
        if (reducedMotion()) { c.style.opacity = 0; return; }
        c.animate([
          { transform: 'translate(-50%, -50%)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.08)`, opacity: 0 },
        ], { duration: 1400, delay: i * 90, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
      });
      setTimeout(() => {
        field.classList.add('is-gathered');
        const t = typewriter(line, 'كل سؤال من هذي له جواب. والجواب علم.');
        t.done.then(done);
      }, reducedMotion() ? 0 : 1400 + chips.length * 90);
    }
    tap.addEventListener('click', gather);
    return {
      finish: () => {
        if (!gathered) { gathered = true; tap.remove(); hint.hidden = true; chips.forEach(c => (c.style.opacity = 0)); field.classList.add('is-gathered'); }
        line.textContent = 'كل سؤال من هذي له جواب. والجواب علم.';
        done();
      },
    };
  },
};
