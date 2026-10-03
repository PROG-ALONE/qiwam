// ابنِ جزيء ماء: اسحب ذرتَي الهيدروجين (أو اضغط عليهما) إلى ذرة الأكسجين.
import { h, s, svgPoint } from '../../ui/dom.js';

export default {
  mount(el, { onDone } = {}) {
    const svg = s('svg', { viewBox: '0 0 320 200', class: 'mol', role: 'img', 'aria-label': 'ذرة أكسجين وذرتا هيدروجين' });
    const O = { x: 160, y: 110 };
    const slots = [{ x: 118, y: 140 }, { x: 202, y: 140 }];
    const bonds = slots.map(sl => s('line', { class: 'mol-bond', x1: O.x, y1: O.y, x2: sl.x, y2: sl.y }));
    const oxy = s('g', { class: 'mol-atom mol-o' }, s('circle', { cx: O.x, cy: O.y, r: 30 }), s('text', { x: O.x, y: O.y + 7, 'text-anchor': 'middle' }, 'O'));
    svg.append(...bonds, oxy);
    const label = h('p.mol-label', { 'aria-live': 'polite' }, 'ذرات منفصلة');
    const start = [{ x: 40, y: 50 }, { x: 280, y: 50 }];
    let bonded = 0;
    const hyd = start.map((p, i) => {
      const g = s('g', { class: 'mol-atom mol-h', tabindex: 0, role: 'button', 'aria-label': 'ذرة هيدروجين: اضغط لربطها', 'data-drag': '' },
        s('circle', { cx: 0, cy: 0, r: 18 }), s('text', { x: 0, y: 6, 'text-anchor': 'middle' }, 'H'));
      g.setAttribute('transform', `translate(${p.x} ${p.y})`);
      let pos = { ...p }, drag = false, done = false;
      const snap = () => {
        if (done) return; done = true;
        pos = slots[i];
        g.animate?.([{ transform: g.getAttribute('transform').replace(/translate\(([^ ]+) ([^)]+)\)/, 'translate($1px, $2px)') }, { transform: `translate(${pos.x}px, ${pos.y}px)` }], { duration: 300, easing: 'ease-out' });
        g.setAttribute('transform', `translate(${pos.x} ${pos.y})`);
        bonds[i].classList.add('is-on');
        g.classList.add('is-bonded');
        if (++bonded === 2) { label.innerHTML = 'تكوّن <strong>جزيء ماء</strong> (<span class="ltr">H₂O</span>): ثلاث ذرات مرتبطة.'; svg.classList.add('is-done'); onDone?.(); }
        else label.textContent = 'ذرة واحدة ارتبطت… بقيت واحدة.';
      };
      g.addEventListener('pointerdown', e => { if (done) return; drag = true; g.setPointerCapture(e.pointerId); });
      g.addEventListener('pointermove', e => {
        if (!drag) return;
        const pt = svgPoint(svg, e); pos = { x: pt.x, y: pt.y };
        g.setAttribute('transform', `translate(${pos.x} ${pos.y})`);
        if (Math.hypot(pos.x - O.x, pos.y - O.y) < 70) { drag = false; snap(); }
      });
      g.addEventListener('pointerup', () => { if (drag) { drag = false; if (!done) { pos = { ...p }; g.setAttribute('transform', `translate(${p.x} ${p.y})`); } } });
      g.addEventListener('click', snap);
      g.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && snap());
      svg.append(g);
      return g;
    });
    el.append(h('div.mol-wrap', svg, label));
    return { hyd };
  },
};
