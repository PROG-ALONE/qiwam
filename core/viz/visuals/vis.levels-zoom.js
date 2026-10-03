// سلّم مستويات التنظيم: اضغط على أي مستوى، أو شغّل الرحلة من الذرة إلى الإنسان.
// التعريفات من OpenStax A&P 2e، القسم 1.2 (مذكورة مع مراجعها في نص الدرس).
import { h, s } from '../../ui/dom.js';
import { animPlayer } from '../anim-player.js';

const LEVELS = [
  { id: 'atom', ar: 'الذرة', en: 'Atom', def: 'أصغر وحدة من العنصر الكيميائي.', icon: () => [s('circle', { cx: 50, cy: 50, r: 8 }), s('ellipse', { cx: 50, cy: 50, rx: 34, ry: 12, fill: 'none' }), s('ellipse', { cx: 50, cy: 50, rx: 34, ry: 12, fill: 'none', transform: 'rotate(60 50 50)' }), s('ellipse', { cx: 50, cy: 50, rx: 34, ry: 12, fill: 'none', transform: 'rotate(-60 50 50)' })] },
  { id: 'molecule', ar: 'الجزيء', en: 'Molecule', def: 'ذرتان أو أكثر ترتبطان معًا، كجزيء الماء.', icon: () => [s('line', { x1: 50, y1: 46, x2: 26, y2: 66 }), s('line', { x1: 50, y1: 46, x2: 74, y2: 66 }), s('circle', { cx: 50, cy: 44, r: 16 }), s('circle', { cx: 24, cy: 68, r: 10 }), s('circle', { cx: 76, cy: 68, r: 10 })] },
  { id: 'organelle', ar: 'العضيّة', en: 'Organelle', def: 'وحدة عاملة صغيرة داخل الخلية.', icon: () => [s('ellipse', { cx: 50, cy: 50, rx: 36, ry: 20, fill: 'none' }), s('path', { d: 'M22 50 q7 -14 14 0 t14 0 t14 0 t14 0', fill: 'none' })] },
  { id: 'cell', ar: 'الخلية', en: 'Cell', def: 'أصغر وحدة تعمل بنفسها في الكائن الحي.', icon: () => [s('circle', { cx: 50, cy: 50, r: 36, fill: 'none' }), s('circle', { cx: 52, cy: 48, r: 12 }), s('ellipse', { cx: 30, cy: 62, rx: 7, ry: 4, fill: 'none' }), s('ellipse', { cx: 70, cy: 66, rx: 6, ry: 3, fill: 'none' })] },
  { id: 'tissue', ar: 'النسيج', en: 'Tissue', def: 'خلايا متشابهة تعمل معًا لأداء وظيفة محددة.', icon: () => Array.from({ length: 9 }, (_, i) => s('rect', { x: 18 + (i % 3) * 22, y: 18 + Math.floor(i / 3) * 22, width: 20, height: 20, rx: 6, fill: 'none' })).concat(Array.from({ length: 9 }, (_, i) => s('circle', { cx: 28 + (i % 3) * 22, cy: 28 + Math.floor(i / 3) * 22, r: 3 }))) },
  { id: 'organ', ar: 'العضو', en: 'Organ', def: 'بنية مستقلة تتكون من نوعين من الأنسجة أو أكثر.', icon: () => [s('path', { d: 'M50 30 Q68 18 80 34 Q88 52 66 72 L50 84 L34 72 Q12 52 20 34 Q32 18 50 30 Z', fill: 'none' })] },
  { id: 'system', ar: 'الجهاز العضوي', en: 'Organ system', def: 'أعضاء تعمل معًا لأداء وظائف كبرى في الجسم.', icon: () => [s('path', { d: 'M50 10 V30 Q30 34 34 50 Q40 64 60 60 Q74 56 70 72 Q66 86 50 90', fill: 'none' }), s('ellipse', { cx: 52, cy: 36, rx: 16, ry: 10, fill: 'none' })] },
  { id: 'organism', ar: 'الكائن الحي', en: 'Organism', def: 'كائن يؤدي بنفسه كل الوظائف اللازمة للحياة.', icon: () => [s('circle', { cx: 50, cy: 18, r: 9 }), s('path', { d: 'M50 28 V62 M50 36 L32 52 M50 36 L68 52 M50 62 L38 90 M50 62 L62 90', fill: 'none' })] },
];

export default {
  mount(el) {
    const art = s('svg', { viewBox: '0 0 100 100', class: 'lz-art', 'aria-hidden': 'true' });
    const name = h('h4.lz-name');
    const def = h('p.lz-def');
    const steps = h('ol.lz-steps', { role: 'tablist', 'aria-label': 'مستويات التنظيم' });
    const buttons = LEVELS.map((lv, i) => {
      const b = h('button.lz-step', { type: 'button', role: 'tab', 'aria-selected': 'false' }, h('span.lz-n', String(i + 1)), h('span', lv.ar));
      b.addEventListener('click', () => { player.pause(); show(i); player.seek(i / (LEVELS.length - 1)); });
      steps.append(h('li', b));
      return b;
    });

    let current = -1;
    function show(i) {
      if (i === current) return;
      current = i;
      const lv = LEVELS[i];
      art.replaceChildren(...lv.icon());
      art.animate?.([{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
      name.replaceChildren(lv.ar, ' ', h('span.ltr.lz-en', `(${lv.en})`));
      def.textContent = lv.def;
      buttons.forEach((b, j) => { b.setAttribute('aria-selected', String(j === i)); b.classList.toggle('is-past', j < i); });
    }

    const player = animPlayer({
      duration: 12000, label: 'رحلة من الذرة إلى الإنسان',
      onFrame: (t) => show(Math.min(LEVELS.length - 1, Math.floor(t * LEVELS.length))),
    });
    show(0);
    el.append(h('div.lz', steps, h('div.lz-stage', art, h('div.lz-text', name, def)), player.el));
    return { show, player };
  },
};
