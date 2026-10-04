// الأنسجة الأربعة: بطاقات برسوم تحاكي شكلها تحت المجهر (بألوان صبغة H&E المعتادة)،
// تُقلب لتظهر الاسم والوظيفة ومثالًا. الأوصاف من OpenStax A&P 2e، القسم 4.1، ومثال الوتر من 4.3.
import { h, s } from '../../ui/dom.js';

const C = { cyto: '#f3bfcd', nuc: '#6a3d9a', fib: '#e48aa6', mat: '#fbe6ec', line: '#b5577a' };
const nuc = (cx, cy, rx = 3.2, ry = 3.2, rot = 0) => s('ellipse', { cx, cy, rx, ry, fill: C.nuc, transform: rot ? `rotate(${rot} ${cx} ${cy})` : null });

const T = [
  {
    id: 'epithelial', ar: 'الطلائي', en: 'Epithelial',
    does: 'صفائح من خلايا متلاصقة تغطي سطوح الجسم وتبطّن تجاويفه وأعضاءه المجوّفة.',
    eg: 'مثال: الطبقة الخارجية من الجلد، وبطانة الأمعاء.',
    look: 'خلايا متلاصقة بلا فراغ بينها، فوق غشاء قاعدي.',
    art: () => [
      s('rect', { x: 4, y: 8, width: 92, height: 64, fill: C.mat }),
      ...[0, 1, 2, 3, 4, 5].map(i => s('rect', { x: 6 + i * 15, y: 30, width: 14, height: 30, rx: 2, fill: C.cyto, stroke: C.line, 'stroke-width': .8 })),
      ...[0, 1, 2, 3, 4, 5].map(i => nuc(13 + i * 15, 50, 3.2, 4.2)),
      ...[0, 1, 2, 3, 4].map(i => s('rect', { x: 6 + i * 18, y: 20, width: 17, height: 9, rx: 2, fill: C.cyto, stroke: C.line, 'stroke-width': .8 })),
      ...[0, 1, 2, 3, 4].map(i => nuc(14.5 + i * 18, 24.5, 4, 1.8)),
      s('line', { x1: 4, y1: 62, x2: 96, y2: 62, stroke: C.line, 'stroke-width': 2 }),
    ],
  },
  {
    id: 'connective', ar: 'الضام', en: 'Connective',
    does: 'يربط أجزاء الجسم ويدعمها ويحميها. خلاياه متباعدة في مادة بينية من ألياف وسائل.',
    eg: 'مثال: الأوتار، وهي نسيج ضام كثيف منتظم.',
    look: 'خلايا قليلة متفرقة، وألياف كثيرة، ومسافات واسعة.',
    art: () => [
      s('rect', { x: 4, y: 8, width: 92, height: 64, fill: C.mat }),
      ...[18, 32, 46, 60].map((y, i) => s('path', { d: `M4 ${y} q12 ${i % 2 ? 8 : -8} 23 0 t23 0 t23 0 t23 0`, fill: 'none', stroke: C.fib, 'stroke-width': 3.2 })),
      s('path', { d: 'M10 70 Q40 10 92 24', fill: 'none', stroke: C.line, 'stroke-width': .7 }),
      s('path', { d: 'M6 26 Q50 70 94 56', fill: 'none', stroke: C.line, 'stroke-width': .7 }),
      nuc(24, 25, 5, 1.6, -10), nuc(66, 40, 5, 1.6, 12), nuc(42, 54, 5, 1.6, -6), nuc(82, 64, 4, 1.6, 8),
    ],
  },
  {
    id: 'muscle', ar: 'العضلي', en: 'Muscle',
    does: 'خلاياه قابلة للإثارة وتنقبض فتولّد الحركة. وله ثلاثة أنواع: الهيكلي، والأملس، والقلبي.',
    eg: 'مثال: عضلات الفخذ (هيكلي)، وجدار المعدة (أملس)، والقلب (قلبي).',
    look: 'ألياف طويلة متوازية، تظهر في العضل الهيكلي مخطّطة بخطوط عرضية.',
    art: () => [
      s('rect', { x: 4, y: 8, width: 92, height: 64, fill: C.mat }),
      ...[0, 1, 2, 3].map(i => s('rect', { x: 4, y: 11 + i * 15, width: 92, height: 12, rx: 6, fill: C.cyto, stroke: C.line, 'stroke-width': .8 })),
      ...[0, 1, 2, 3].flatMap(i => Array.from({ length: 22 }, (_, k) => s('line', { x1: 8 + k * 4, y1: 12 + i * 15, x2: 8 + k * 4, y2: 22 + i * 15, stroke: C.line, 'stroke-width': k % 2 ? .5 : 1.1 }))),
      nuc(20, 12, 5, 1.4), nuc(64, 34, 5, 1.4), nuc(40, 49, 5, 1.4), nuc(80, 64, 5, 1.4),
    ],
  },
  {
    id: 'nervous', ar: 'العصبي', en: 'Nervous',
    does: 'خلاياه قابلة للإثارة، تولّد إشارات كهروكيميائية وتنقلها بسرعة من مكان إلى آخر.',
    eg: 'مثال: الدماغ، والحبل الشوكي، والأعصاب.',
    look: 'جسم خلية فيه النواة، وزوائد متفرعة (التغصنات)، وزائدة طويلة واحدة (المحور).',
    art: () => [
      s('rect', { x: 4, y: 8, width: 92, height: 64, fill: C.mat }),
      s('path', { d: 'M24 40 L10 24 M16 31 L8 32 M24 40 L8 50 M14 46 L10 58 M24 40 L20 16 M24 40 L30 62 M28 54 L36 66', fill: 'none', stroke: C.line, 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
      s('circle', { cx: 26, cy: 40, r: 9, fill: C.cyto, stroke: C.line, 'stroke-width': 1 }),
      s('circle', { cx: 26, cy: 40, r: 3.6, fill: C.nuc }),
      s('line', { x1: 35, y1: 40, x2: 86, y2: 40, stroke: C.line, 'stroke-width': 1.6 }),
      ...[42, 56, 70].map(x => s('rect', { x, y: 36.5, width: 11, height: 7, rx: 3.5, fill: '#fff', stroke: C.line, 'stroke-width': .8 })),
      s('path', { d: 'M86 40 l8 -8 M86 40 l9 0 M86 40 l8 8', fill: 'none', stroke: C.line, 'stroke-width': 1.4, 'stroke-linecap': 'round' }),
    ],
  },
];

export default {
  mount(el) {
    const seen = new Set();
    const status = h('p.ft-status', { 'aria-live': 'polite' }, 'خمّن اسم كل نسيج من شكله، ثم اقلب البطاقة.');
    const grid = h('div.ft-grid', T.map((t, i) => {
      const b = h('button.ft-card', { type: 'button', 'data-t': t.id, 'aria-label': `بطاقة ${i + 1}: ${t.look} اقلبها` },
        h('span.ft-front', s('svg', { viewBox: '0 0 100 80', class: 'ft-art', 'aria-hidden': 'true' }, ...t.art()), h('span.ft-look', t.look)),
        h('span.ft-back', h('strong', t.ar), h('span.ltr.ft-en', t.en), h('span.ft-does', t.does), h('span.ft-eg', t.eg)));
      b.addEventListener('click', () => {
        b.classList.toggle('is-flipped');
        seen.add(t.id);
        b.setAttribute('aria-label', b.classList.contains('is-flipped') ? `النسيج ${t.ar}: ${t.does}` : `بطاقة ${i + 1}: ${t.look} اقلبها`);
        status.textContent = seen.size < T.length ? `قلبت ${seen.size} من 4.` : 'أحسنت، رأيت الأنسجة الأربعة. لاحظ أن الطلائي متلاصق، والضام متباعد.';
      });
      return b;
    }));
    el.append(h('div.ft', grid, status, h('p.cv-note', 'رسوم تخطيطية بألوان الصبغة المعتادة في المجهر: النوى بنفسجية، والسيتوبلازم والألياف وردية.')));
  },
};
