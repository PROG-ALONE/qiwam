// مستكشف المفصل: شريط سحب للزاوية، والمدى الطبيعي، والعضلات العاملة في كل مدى.
// القيم الرقمية (المدى، والعضلات) تأتي من الدرس نفسه بمراجعها؛ المكوّن لا يحمل أرقامًا.
import { h, s } from '../ui/dom.js';
import { knee } from './knee.js';

/**
 * jointExplorer({ joint: 'knee', max, normal: [min,max], muscles: [{ name, from, to }], ref })
 */
export function jointExplorer({ joint = 'knee', max = 140, normal, muscles = [], label = 'مستكشف المفصل' }) {
  if (joint !== 'knee') throw new Error('مستكشف المفصل يدعم الركبة حاليًا فقط');
  const k = knee({ angle: 0 });
  const deg = h('output.je-angle.ltr', '0°');
  const range = h('input.je-range', { type: 'range', min: 0, max, value: 0, 'aria-label': 'زاوية الثني بالدرجات', 'data-drag': '' });
  const band = normal ? h('div.je-band', { style: { '--a': normal[0] / max, '--b': normal[1] / max } }, h('span', `المدى الطبيعي: ${normal[0]}°–${normal[1]}°`)) : null;
  const list = h('ul.je-muscles', muscles.map(m => h('li', { 'data-from': m.from, 'data-to': m.to }, m.name)));

  const update = (a) => {
    k.set({ angle: a });
    deg.textContent = `${Math.round(a)}°`;
    list.querySelectorAll('li').forEach(li => li.classList.toggle('is-active', a >= +li.dataset.from && a <= +li.dataset.to));
  };
  range.addEventListener('input', () => update(+range.value));
  update(0);
  return { el: h('figure.je', { 'aria-label': label }, k.el, h('div.je-controls', deg, h('div.je-track', range, band)), muscles.length ? list : null), set: update };
}
