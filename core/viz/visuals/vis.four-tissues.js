// الأنسجة الأربعة: بطاقات تُقلب لتظهر الاسم. (الأسماء من OpenStax A&P 2e، القسم 4.1)
import { h, s } from '../../ui/dom.js';

const T = [
  { ar: 'الطلائي', en: 'Epithelial', art: () => [0, 1, 2].map(r => [0, 1, 2, 3].map(c => s('rect', { x: 10 + c * 20, y: 18 + r * 16, width: 18, height: 14, rx: 3 }))).flat() },
  { ar: 'الضام', en: 'Connective', art: () => [s('path', { d: 'M8 30 Q30 10 50 30 T92 30', fill: 'none' }), s('path', { d: 'M8 45 Q30 25 50 45 T92 45', fill: 'none' }), s('path', { d: 'M8 60 Q30 40 50 60 T92 60', fill: 'none' }), s('circle', { cx: 30, cy: 52, r: 4 }), s('circle', { cx: 70, cy: 22, r: 4 })] },
  { ar: 'العضلي', en: 'Muscle', art: () => [0, 1, 2, 3].map(i => s('rect', { x: 8, y: 14 + i * 14, width: 84, height: 10, rx: 5 })).concat([20, 36, 52, 68, 84].map(x => s('line', { x1: x, y1: 12, x2: x, y2: 68 }))) },
  { ar: 'العصبي', en: 'Nervous', art: () => [s('circle', { cx: 30, cy: 40, r: 10 }), s('path', { d: 'M40 40 H92 M20 32 L6 20 M20 48 L6 60 M26 30 L22 14 M86 40 l6 -8 M86 40 l6 8', fill: 'none' })] },
];

export default {
  mount(el) {
    const grid = h('div.ft-grid', T.map((t, i) => {
      const b = h('button.ft-card', { type: 'button', 'aria-label': `بطاقة ${i + 1}: اقلبها` },
        h('span.ft-front', s('svg', { viewBox: '0 0 100 80', class: 'ft-art', 'aria-hidden': 'true' }, ...t.art()), h('span.ft-q', '؟')),
        h('span.ft-back', h('strong', t.ar), h('span.ltr', t.en)));
      b.addEventListener('click', () => { b.classList.toggle('is-flipped'); b.setAttribute('aria-label', b.classList.contains('is-flipped') ? `النسيج ${t.ar}` : `بطاقة ${i + 1}: اقلبها`); });
      return b;
    }));
    el.append(grid);
  },
};
