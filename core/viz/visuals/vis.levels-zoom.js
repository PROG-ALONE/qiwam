// سلّم مستويات التنظيم: اضغط على أي مستوى، أو شغّل الرحلة من الذرة إلى الإنسان.
// التعريفات من OpenStax A&P 2e، القسم 1.2 (مذكورة مع مراجعها في نص الدرس).
import { h, s } from '../../ui/dom.js';
import { animPlayer } from '../anim-player.js';

const LEVELS = [
  { id: 'atom', ar: 'الذرة', en: 'Atom', def: 'أصغر وحدة من العنصر الكيميائي.', icon: () => [s('ellipse', { cx: 50, cy: 50, rx: 38, ry: 13, fill: 'none' }), s('ellipse', { cx: 50, cy: 50, rx: 38, ry: 13, fill: 'none', transform: 'rotate(60 50 50)' }), s('ellipse', { cx: 50, cy: 50, rx: 38, ry: 13, fill: 'none', transform: 'rotate(-60 50 50)' }), s('circle', { cx: 46, cy: 48, r: 5, class: 'lz-solid' }), s('circle', { cx: 54, cy: 48, r: 5 }), s('circle', { cx: 50, cy: 55, r: 5, class: 'lz-solid' }), s('circle', { cx: 88, cy: 50, r: 3.5, class: 'lz-solid' }), s('circle', { cx: 31, cy: 17, r: 3.5, class: 'lz-solid' }), s('circle', { cx: 31, cy: 83, r: 3.5, class: 'lz-solid' })] },
  { id: 'molecule', ar: 'الجزيء', en: 'Molecule', def: 'ذرتان أو أكثر ترتبطان معًا، كجزيء الماء.', icon: () => [s('line', { x1: 50, y1: 46, x2: 26, y2: 66 }), s('line', { x1: 50, y1: 46, x2: 74, y2: 66 }), s('circle', { cx: 50, cy: 44, r: 17 }), s('circle', { cx: 24, cy: 68, r: 10 }), s('circle', { cx: 76, cy: 68, r: 10 }), s('text', { x: 50, y: 50, class: 'lz-t' }, 'O'), s('text', { x: 24, y: 72, class: 'lz-t lz-t-s' }, 'H'), s('text', { x: 76, y: 72, class: 'lz-t lz-t-s' }, 'H')] },
  { id: 'organelle', ar: 'العضيّة', en: 'Organelle', def: 'وحدة عاملة صغيرة داخل الخلية.', icon: () => [s('ellipse', { cx: 50, cy: 50, rx: 38, ry: 20 }), s('ellipse', { cx: 50, cy: 50, rx: 33, ry: 15, fill: 'none' }), s('path', { d: 'M20 50 L25 38 L30 61 L36 37 L42 62 L48 37 L54 62 L60 37 L66 62 L72 38 L78 60 L81 50', fill: 'none' })] },
  { id: 'cell', ar: 'الخلية', en: 'Cell', def: 'أصغر وحدة تعمل بنفسها في الكائن الحي.', icon: () => [s('circle', { cx: 50, cy: 50, r: 40 }), s('circle', { cx: 46, cy: 48, r: 14, fill: 'none' }), s('circle', { cx: 49, cy: 45, r: 4.5, class: 'lz-solid' }), s('path', { d: 'M64 34 A22 22 0 0 1 66 64 M70 30 A28 28 0 0 1 72 68', fill: 'none' }), s('ellipse', { cx: 28, cy: 70, rx: 9, ry: 4.5, transform: 'rotate(-20 28 70)' }), s('ellipse', { cx: 30, cy: 30, rx: 8, ry: 4, transform: 'rotate(30 30 30)' }), s('circle', { cx: 60, cy: 78, r: 4 })] },
  { id: 'tissue', ar: 'النسيج', en: 'Tissue', def: 'خلايا متشابهة تعمل معًا لأداء وظيفة محددة.', icon: () => Array.from({ length: 9 }, (_, i) => s('rect', { x: 18 + (i % 3) * 22, y: 18 + Math.floor(i / 3) * 22, width: 20, height: 20, rx: 6, fill: 'none' })).concat(Array.from({ length: 9 }, (_, i) => s('circle', { cx: 28 + (i % 3) * 22, cy: 28 + Math.floor(i / 3) * 22, r: 3 }))) },
  { id: 'organ', ar: 'العضو', en: 'Organ', def: 'بنية مستقلة تتكون من نوعين من الأنسجة أو أكثر.', icon: () => [s('path', { d: 'M50 30 Q68 18 80 34 Q88 52 66 72 L50 84 L34 72 Q12 52 20 34 Q32 18 50 30 Z', fill: 'none' })] },
  { id: 'system', ar: 'الجهاز العضوي', en: 'Organ system', def: 'أعضاء تعمل معًا لأداء وظائف كبرى في الجسم.', icon: () => [s('path', { d: 'M50 10 V30 Q30 34 34 50 Q40 64 60 60 Q74 56 70 72 Q66 86 50 90', fill: 'none' }), s('ellipse', { cx: 52, cy: 36, rx: 16, ry: 10, fill: 'none' })] },
  { id: 'organism', ar: 'الكائن الحي', en: 'Organism', def: 'كائن يؤدي بنفسه كل الوظائف اللازمة للحياة.', icon: () => [s('circle', { cx: 50, cy: 18, r: 9 }), s('path', { d: 'M50 28 V62 M50 36 L32 52 M50 36 L68 52 M50 62 L38 90 M50 62 L62 90', fill: 'none' })] },
];

export default {
  mount(el, { start = 0, compact = false } = {}) {
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
    show(start);
    player.seek(start / (LEVELS.length - 1));
    el.append(h('div.lz', { class: compact ? 'is-compact' : '' }, steps, h('div.lz-stage', art, h('div.lz-text', name, def)), compact ? null : player.el));
    return { show, player };
  },
};
