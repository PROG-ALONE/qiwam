// خلية مبسطة: الغشاء، والسيتوبلازم، والعضيّات. اضغط على أي جزء لترى اسمه.
// (الأجزاء الثلاثة كما يصفها OpenStax A&P 2e، القسم 1.2)
import { h, s } from '../../ui/dom.js';

const PARTS = {
  membrane: { ar: 'الغشاء', en: 'Membrane', note: 'غلاف مرن يحيط بالخلية.' },
  cytoplasm: { ar: 'السيتوبلازم', en: 'Cytoplasm', note: 'سائل مائي يملأ الخلية.' },
  organelle: { ar: 'العضيّات', en: 'Organelles', note: 'وحدات عاملة صغيرة داخل السيتوبلازم.' },
};

export default {
  mount(el) {
    const svg = s('svg', { viewBox: '0 0 320 240', class: 'cellv', role: 'img', 'aria-label': 'خلية مبسطة' });
    const part = (key, node) => { node.setAttribute('data-part', key); node.setAttribute('tabindex', '0'); node.setAttribute('role', 'button'); node.setAttribute('aria-label', PARTS[key].ar); return node; };
    svg.append(
      part('cytoplasm', s('ellipse', { class: 'cv-cyto', cx: 160, cy: 120, rx: 130, ry: 96 })),
      part('membrane', s('ellipse', { class: 'cv-mem', cx: 160, cy: 120, rx: 130, ry: 96 })),
    );
    const orgs = s('g');
    [[110, 90, 26, 12, -20], [210, 150, 30, 13, 15], [205, 80, 18, 10, 40], [120, 160, 20, 9, -10], [160, 118, 16, 16, 0]].forEach(([cx, cy, rx, ry, a]) =>
      orgs.append(part('organelle', s('ellipse', { class: 'cv-org', cx, cy, rx, ry, transform: `rotate(${a} ${cx} ${cy})` }))));
    svg.append(orgs);
    const out = h('p.cv-label', { 'aria-live': 'polite' }, 'اضغط على جزء من الخلية');
    const seen = new Set();
    const chips = h('div.cv-chips', Object.entries(PARTS).map(([k, p]) => h('span.cv-chip', { 'data-part': k }, p.ar)));
    const show = (k) => {
      seen.add(k);
      svg.querySelectorAll('[data-part]').forEach(n => n.classList.toggle('is-on', n.dataset.part === k));
      chips.querySelector(`[data-part="${k}"]`).classList.add('is-seen');
      out.replaceChildren(h('strong', PARTS[k].ar), ' ', h('span.ltr', `(${PARTS[k].en})`), `: ${PARTS[k].note}`);
    };
    svg.addEventListener('click', e => { const n = e.target.closest('[data-part]'); if (n) show(n.dataset.part); });
    svg.addEventListener('keydown', e => { const n = e.target.closest('[data-part]'); if (n && (e.key === 'Enter' || e.key === ' ')) show(n.dataset.part); });
    // الغشاء حلقة رفيعة: نجعل حافتها سميكة للنقر
    el.append(h('div.cv-wrap', svg, out, chips));
  },
};
