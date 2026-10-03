// أين تلمس الوتر الرضفي؟ ركبة مثنية قليلًا، ونقطة تومض تحت الرضفة. اضغطها ليضيء الوتر.
import { h } from '../../ui/dom.js';
import { knee } from '../knee.js';

export default {
  mount(el) {
    const k = knee({ angle: 30 });
    k.el.classList.add('is-palpate');
    const svg = k.el;
    const out = h('p.pp-label', { 'aria-live': 'polite' }, 'اضغط على النقطة تحت الرضفة');
    el.append(h('div.pp-wrap', svg, out));
    // الموضع يُحسب بعد أن يصير الرسم في الصفحة
    const tendon = svg.querySelector('.k-tendon--patellar');
    const bb = tendon.getBBox();
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    Object.entries({ cx: bb.x + bb.width / 2 + 18, cy: bb.y + bb.height * 0.35, r: 14, class: 'pp-dot', tabindex: 0, role: 'button', 'aria-label': 'ضع إصبعك هنا' }).forEach(([a, v]) => dot.setAttribute(a, v));
    svg.append(dot);
    const press = () => { svg.classList.add('is-found'); out.innerHTML = 'هنا: <strong>الوتر الرضفي</strong>، يصل الرضفة بعظم الظنبوب.'; };
    dot.addEventListener('click', press);
    dot.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && press());
  },
};
