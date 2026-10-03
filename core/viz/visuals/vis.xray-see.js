// ماذا ترى الأشعة السينية؟ بدّل بين الركبة كما هي، وما تُظهره الأشعة: العظم فاتح، والأنسجة الرخوة رمادية باهتة.
// (OpenStax A&P 2e، القسم 1.7)
import { h } from '../../ui/dom.js';
import { knee } from '../knee.js';

export default {
  mount(el) {
    const k = knee({ angle: 35 });
    k.el.classList.add('xs-knee');
    const out = h('p.xs-label', { 'aria-live': 'polite' });
    const modes = {
      real: 'الركبة كما هي: العظام، والوتر الرضفي (بلون فاتح دافئ)، والجلد والعضلات حولها.',
      xray: 'ما تراه الأشعة: العظام فاتحة واضحة، والوتر والعضلات رمادية باهتة تكاد تختفي.',
    };
    const set = (m) => { k.el.classList.toggle('is-xray', m === 'xray'); out.textContent = modes[m]; tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === m))); };
    const tabs = h('div.cc-tabs', [['real', 'الركبة'], ['xray', 'ما تراه الأشعة']].map(([m, t]) => h('button.btn', { type: 'button', 'data-m': m, onclick: () => set(m) }, t)));
    el.append(h('div.xs', tabs, h('div.xs-stage', k.el), out));
    set('real');
  },
};
