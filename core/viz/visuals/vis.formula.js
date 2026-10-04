// أداة المعادلات: المعادلة بمتغيرات ملوّنة، ومنزلقات لتغيير القيم، وخطوات التعويض تتحدث حيًّا،
// ورسم يوضح الناتج، ثم «تمرّن»: مسائل بأرقام عشوائية مع تصحيح فوري وحلّ مفصّل.
import { h, s } from '../../ui/dom.js';
import formulas from '../../../content/formulas/index.js';

// كل خطوة «شرح: معادلة»؛ نعرض المعادلة معزولة من اليسار إلى اليمين حتى لا تنقلب الأرقام والرموز
const stepLi = (txt) => { const i = txt.lastIndexOf(': '); return i < 0 ? h('li', txt) : h('li', txt.slice(0, i + 2), h('span.ltr.fx-math', txt.slice(i + 2))); };

export default {
  mount(el, { formula = 'formula.percentage' } = {}) {
    const F = formulas[formula];
    const vals = Object.fromEntries(F.vars.map(v => [v.id, v.value]));
    const varChip = (id) => { const v = F.vars.find(x => x.id === id); return h('span.fx-var', { style: { '--vc': v.color } }, h('span.fx-var-name', v.ar), h('span.fx-var-val.ltr', String(vals[id]))); };

    const eq = h('div.fx-eq', { 'aria-live': 'polite' });
    const steps = h('ol.fx-steps');
    const result = h('p.fx-result');
    const err = h('p.fx-err');
    const pic = s('svg', { viewBox: '0 0 120 120', class: 'fx-pic', 'aria-hidden': 'true' });

    const draw = () => {
      eq.replaceChildren(h('span.fx-res-name', F.result.ar), ' = ', ...F.parts.map(p => (typeof p === 'string' ? h('span.fx-op', p) : varChip(p.v))));
      const e = F.valid?.(vals);
      err.textContent = e || '';
      if (e) { steps.replaceChildren(); result.textContent = ''; pic.replaceChildren(); return; }
      steps.replaceChildren(...F.steps(vals).map(stepLi));
      const out = F.compute(vals);
      result.replaceChildren(h('span', `${F.result.ar}: `), h('strong.ltr', `${Math.round(out * 10) / 10}${F.result.unit}`));
      if (F.picture === 'pie') pie(pic, out / 100, F.vars[0].color, F.vars[1].color);
    };

    const sliders = h('div.fx-sliders', F.vars.map(v => {
      const inp = h('input', { type: 'range', min: v.min, max: v.max, step: v.step, value: v.value, 'aria-label': v.ar, 'data-drag': '', style: { accentColor: v.color } });
      const num = h('output.ltr', String(v.value));
      inp.addEventListener('input', () => { vals[v.id] = +inp.value; num.textContent = inp.value; draw(); });
      return h('label.fx-slider', h('span', { style: { color: v.color } }, `${v.ar} (${v.unit})`), inp, num);
    }));

    // التمرين
    const pq = h('p.fx-pq');
    const pin = h('input.qz-text.qz-num.ltr', { type: 'number', step: 'any', inputmode: 'decimal', 'aria-label': 'جوابك' });
    const pfb = h('div.fx-pfb', { 'aria-live': 'polite' });
    const streakEl = h('span.fx-streak');
    let cur = null, streak = 0;
    const newProblem = () => { cur = F.practice(); pq.textContent = cur.text; pin.value = ''; pfb.replaceChildren(); pin.disabled = false; check.hidden = false; nextP.hidden = true; pin.focus({ preventScroll: true }); };
    const check = h('button.btn.btn--primary', { type: 'button' }, 'تحقق');
    const nextP = h('button.btn', { type: 'button', hidden: true }, 'مسألة أخرى');
    check.addEventListener('click', () => {
      if (pin.value === '') return;
      const ok = Math.abs(+pin.value - cur.answer) <= cur.tolerance;
      streak = ok ? streak + 1 : 0;
      streakEl.textContent = streak ? `إجابات صحيحة متتالية: ${streak}` : '';
      pfb.replaceChildren(
        h('p', { class: ok ? 'qz-verdict is-right' : 'qz-verdict is-wrong' }, ok ? 'صحيح.' : `ليس تمامًا. الجواب ${cur.answer}${cur.unit}.`),
        h('p.fx-sol-t', 'الحل خطوة بخطوة:'),
        h('ol.fx-steps', F.steps(cur.vars).map(stepLi)));
      pin.disabled = true; check.hidden = true; nextP.hidden = false;
    });
    nextP.addEventListener('click', newProblem);
    pin.addEventListener('keydown', e => e.key === 'Enter' && check.click());

    const tabs = h('div.cc-tabs');
    const learn = h('div.fx-learn', eq, h('div.fx-mid', sliders, pic), err, steps, result);
    const practice = h('div.fx-practice', { hidden: true }, pq, h('div.qz-calc', pin, h('span.qz-unit', F.result.unit), check, nextP), pfb, streakEl);
    [['learn', 'افهم المعادلة'], ['practice', 'تمرّن']].forEach(([m, t]) => {
      tabs.append(h('button.btn', { type: 'button', 'aria-pressed': String(m === 'learn'), onclick: (e) => {
        tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
        learn.hidden = m !== 'learn'; practice.hidden = m !== 'practice';
        if (m === 'practice' && !cur) newProblem();
      } }, t));
    });
    el.append(h('div.fx', h('p.fx-title', F.title, ' ', h('span.ltr', `(${F.en})`)), tabs, learn, practice));
    draw();
  },
};

function pie(svg, frac, c1, c2) {
  const f = Math.max(0, Math.min(1, frac));
  const a = f * Math.PI * 2, x = 60 + 50 * Math.sin(a), y = 60 - 50 * Math.cos(a);
  svg.replaceChildren(
    s('circle', { cx: 60, cy: 60, r: 50, fill: c2, 'fill-opacity': .25, stroke: c2, 'stroke-width': 2 }),
    f >= 0.999 ? s('circle', { cx: 60, cy: 60, r: 50, fill: c1, 'fill-opacity': .8 }) : s('path', { d: `M60 60 L60 10 A50 50 0 ${a > Math.PI ? 1 : 0} 1 ${x} ${y} Z`, fill: c1, 'fill-opacity': .8 }),
    s('text', { x: 60, y: 66, 'text-anchor': 'middle', class: 'fx-pic-t' }, `${Math.round(f * 100)}%`));
}
