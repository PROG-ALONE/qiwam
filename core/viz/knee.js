// رسم ركبة جانبي مبسّط (SVG) يُستخدم بمشاهد المدخل ولاحقاً بمستكشف المفصل.
// المقدمة (Anterior) باتجاه اليمين. الثني يدوّر الساق حول مركز لقمة الفخذ باتجاه الخلف (اليسار).
// knee({ angle, load, bump, bone, skin }) → { el, set(opts) }
//   angle: زاوية الثني بالدرجات (0 = ممدودة)
//   load:  0..1 الحمل على الوتر الرضفي
//   bump:  0..1 حجم النتوء تحت الجلد
//   bone:  0..1 العظم الزائد عند القطب السفلي للرضفة (منشأ الوتر)
//   skin:  0..1 شفافية الجلد

import { s } from '../ui/dom.js';

const C = { x: 200, y: 252 };      // مركز لقمة الفخذ = محور الدوران
const rad = d => d * Math.PI / 180;

function rot(p, deg, c = C) {
  const a = rad(deg), dx = p.x - c.x, dy = p.y - c.y;
  return { x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a) };
}

let uid = 0;

export function knee(opts = {}) {
  const state = { angle: 0, load: 0, bump: 0, bone: 0, skin: 1, ...opts };
  const id = `kg${++uid}`;

  const svg = s('svg', { viewBox: '60 -10 300 540', class: 'knee', role: 'img', 'aria-label': 'رسم جانبي للركبة: عظم الفخذ، والرضفة، والظنبوب، والوتر الرضفي' });
  svg.append(s('defs', {},
    s('radialGradient', { id },
      s('stop', { offset: '0%', 'stop-color': 'var(--signal)', 'stop-opacity': '.7' }),
      s('stop', { offset: '100%', 'stop-color': 'var(--signal)', 'stop-opacity': '0' }))));

  // الجلد: فخذ ثابت، وساق تدور
  const thighSkin = s('path', { class: 'k-skin', d: 'M118 -10 L282 -10 Q290 150 282 236 Q276 266 262 280 L140 286 Q122 250 124 200 Q116 90 118 -10 Z' });
  const shankG = s('g');
  shankG.append(s('path', { class: 'k-skin', d: 'M136 262 Q200 250 268 262 Q284 300 270 352 Q262 420 252 530 L156 530 Q148 430 138 360 Q128 310 136 262 Z' }));

  // عظم الفخذ
  const femur = s('path', { class: 'k-bone', d: 'M168 -10 L224 -10 L226 168 Q264 196 254 246 Q244 296 198 298 Q152 296 148 252 Q144 210 168 172 Z' });

  // الظنبوب والشظية (يدوران مع الساق)
  const tibia = s('path', { class: 'k-bone', d: 'M146 304 Q200 292 256 302 Q262 318 256 332 Q266 350 248 368 L232 530 L178 530 L168 370 Q148 344 146 304 Z' });
  const fibula = s('path', { class: 'k-bone k-bone--soft', d: 'M144 336 Q156 328 166 340 L164 530 L152 530 Z' });
  shankG.append(fibula, tibia);

  const heat = s('ellipse', { class: 'k-heat', fill: `url(#${id})`, rx: 0, ry: 0 });
  const quadT = s('path', { class: 'k-tendon' });
  const patT = s('path', { class: 'k-tendon k-tendon--patellar' });
  const stress = s('g');
  const spur = s('path', { class: 'k-spur' });
  const patella = s('path', { class: 'k-bone k-patella' });
  const bump = s('ellipse', { class: 'k-bump', rx: 0, ry: 0 });

  svg.append(thighSkin, shankG, femur, heat, quadT, patT, stress, spur, patella, bump);

  function draw() {
    const a = state.angle;
    shankG.setAttribute('transform', `rotate(${a} ${C.x} ${C.y})`);

    // الرضفة تنزلق على مقدمة لقمة الفخذ مع الثني
    const beta = rad(32 - a * 0.72);
    const pc = { x: C.x + 66 * Math.cos(beta), y: C.y - 66 * Math.sin(beta) };
    const tilt = -10 + a * 0.55;
    const P = (dx, dy) => rot({ x: pc.x + dx, y: pc.y + dy }, tilt, pc);
    const top = P(-2, -32), pole = P(-3, 30);
    const back = [P(-12, -26), P(-14, 0), P(-11, 24)], front = [P(9, -28), P(13, 0), P(8, 26)];
    patella.setAttribute('d',
      `M${top.x} ${top.y} Q${front[0].x} ${front[0].y} ${front[1].x} ${front[1].y} Q${front[2].x} ${front[2].y} ${pole.x} ${pole.y}` +
      ` Q${back[2].x} ${back[2].y} ${back[1].x} ${back[1].y} Q${back[0].x} ${back[0].y} ${top.x} ${top.y} Z`);

    const tub = rot({ x: 254, y: 352 }, a);       // حدبة الظنبوب
    const mid = { x: (pole.x + tub.x) / 2 + 6, y: (pole.y + tub.y) / 2 };
    quadT.setAttribute('d', `M226 128 Q${pc.x + 2} ${pc.y - 70} ${top.x} ${top.y}`);
    patT.setAttribute('d', `M${pole.x} ${pole.y} Q${mid.x} ${mid.y} ${tub.x} ${tub.y}`);

    // الحمل: سماكة ولون الوتر، وتوهج، وخطوط إجهاد
    const L = state.load;
    patT.style.strokeWidth = 8 + L * 6;
    patT.style.stroke = `color-mix(in oklab, var(--tendon) ${Math.round(100 - L * 85)}%, var(--signal))`;
    heat.setAttribute('cx', mid.x); heat.setAttribute('cy', mid.y);
    heat.setAttribute('rx', 16 + L * 46); heat.setAttribute('ry', 26 + L * 50);
    heat.style.opacity = L;
    stress.replaceChildren();
    const n = Math.round(L * 5);
    for (let i = 0; i < n; i++) {
      const t = (i + 1) / (n + 1);
      const x = pole.x + (tub.x - pole.x) * t + 18, y = pole.y + (tub.y - pole.y) * t;
      stress.append(s('path', { class: 'k-stress-line', d: `M${x} ${y - 4} l9 -5 M${x} ${y + 4} l9 5` }));
    }

    // العظم الزائد: بروز من القطب السفلي للرضفة على امتداد الوتر
    const b = state.bone;
    if (b > 0) {
      const dir = { x: tub.x - pole.x, y: tub.y - pole.y };
      const len = Math.hypot(dir.x, dir.y), ux = dir.x / len, uy = dir.y / len;
      const tip = { x: pole.x + ux * 26 * b, y: pole.y + uy * 26 * b };
      spur.setAttribute('d', `M${pole.x - uy * 8} ${pole.y + ux * 8} L${tip.x} ${tip.y} L${pole.x + uy * 8} ${pole.y - ux * 8} Z`);
    } else spur.setAttribute('d', '');

    // النتوء على سطح الجلد الأمامي، تحت الرضفة
    const skinPt = rot({ x: 270, y: 300 }, a);
    bump.setAttribute('cx', skinPt.x + state.bump * 6); bump.setAttribute('cy', skinPt.y);
    bump.setAttribute('rx', state.bump * 14); bump.setAttribute('ry', state.bump * 18);

    svg.style.setProperty('--skin-op', state.skin);
  }

  draw();
  return {
    el: svg,
    set(next) { Object.assign(state, next); draw(); },
    get state() { return { ...state }; },
  };
}
