import { h, svgPoint, clamp } from '../../core/ui/dom.js';
import { knee } from '../../core/viz/knee.js';

const LIMIT = 90;

export default {
  title: 'الحركة الممنوعة',
  date: '',
  tone: 'night',
  questions: ['q.flex'],
  mount(stage, { done }) {
    const k = knee({ angle: 0 });
    k.el.setAttribute('data-drag', '');
    k.el.classList.add('is-draggable');
    const deg = h('output.j-angle.ltr', '0°');
    const verdict = h('p.j-line.j-line--big.j-reveal', { hidden: true }, 'تسعين درجة. بس.');
    const hint = h('p.j-hint', 'اسحب الساق للخلف حتى تثني الركبة');
    // بديل للكيبورد وقارئ الشاشة
    const range = h('input.j-range.j-range--mini', { type: 'range', min: 0, max: 140, value: 0, 'aria-label': 'زاوية ثني الركبة', 'data-drag': '' });

    let attempts = 0, finished = false, over = false;
    const setAngle = (want) => {
      const a = clamp(want, 0, LIMIT);
      k.set({ angle: a });
      deg.textContent = `${Math.round(a)}°`;
      if (want > LIMIT + 4) { if (!over) { over = true; hitWall(); } }
      else if (want < LIMIT - 10) over = false;
    };
    const hitWall = () => {
      attempts++;
      k.el.classList.remove('is-shaking'); void k.el.getBoundingClientRect(); k.el.classList.add('is-shaking');
      if (navigator.vibrate) try { navigator.vibrate(30); } catch {}
      if (attempts >= 2) finish();
    };

    let dragging = false;
    k.el.addEventListener('pointerdown', e => { dragging = true; k.el.setPointerCapture(e.pointerId); move(e); });
    k.el.addEventListener('pointermove', e => dragging && move(e));
    k.el.addEventListener('pointerup', () => { dragging = false; over = false; });
    k.el.addEventListener('pointercancel', () => (dragging = false));
    function move(e) {
      const p = svgPoint(k.el, e);
      // زاوية الساق من مركز المفصل (200,250): للأسفل = 0، وللخلف (يسار) = موجب
      const a = Math.atan2(200 - p.x, p.y - 250) * 180 / Math.PI;
      setAngle(a < -20 ? 0 : a);
    }
    range.addEventListener('input', () => setAngle(+range.value));

    stage.append(h('div.j-split',
      h('div.j-text',
        h('p.j-line', 'ثني الركبة. حركة نسويها مئات المرات باليوم بدون ما ننتبه.'),
        hint, verdict),
      h('figure.j-figure', k.el, h('div.j-control', deg, range))));

    function finish() {
      if (finished) return;
      finished = true;
      k.set({ angle: LIMIT }); deg.textContent = `${LIMIT}°`;
      hint.hidden = true; verdict.hidden = false;
      done();
    }
    return { finish };
  },
};
