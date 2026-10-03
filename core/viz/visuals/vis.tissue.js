// من خلية واحدة إلى نسيج: اسحب الشريط لتجتمع خلايا متشابهة.
import { h, s } from '../../ui/dom.js';

export default {
  mount(el) {
    const N = 24, cols = 6;
    const svg = s('svg', { viewBox: '0 0 320 230', class: 'tis', role: 'img', 'aria-label': 'خلايا متشابهة تتجمع في نسيج' });
    const cells = Array.from({ length: N }, (_, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      const x = 40 + c * 48 + (r % 2) * 24, y = 40 + r * 48;
      const g = s('g', { class: 'tis-cell', transform: `translate(${x} ${y})` },
        s('path', { d: 'M0 -24 L21 -12 L21 12 L0 24 L-21 12 L-21 -12 Z' }), s('circle', { r: 6 }));
      svg.append(g); return g;
    });
    const range = h('input.tis-range', { type: 'range', min: 1, max: N, value: 1, 'aria-label': 'عدد الخلايا', 'data-drag': '' });
    const out = h('p.tis-label', { 'aria-live': 'polite' });
    const update = () => {
      const n = +range.value;
      cells.forEach((c, i) => c.classList.toggle('is-on', i < n));
      out.textContent = n === 1 ? 'خلية واحدة' : n < 8 ? `${n} خلايا متشابهة` : `${n} خلية متشابهة تعمل معًا: هذا نسيج`;
      svg.classList.toggle('is-tissue', n >= 8);
    };
    range.addEventListener('input', update); update();
    el.append(h('div.tis-wrap', svg, h('div.tis-ctl', h('span', 'خلية'), range, h('span', 'نسيج')), out));
  },
};
