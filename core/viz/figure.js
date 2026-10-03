// هيكل جسم مبسّط بأسلوب لوحات التشريح (منظر أمامي). يُستخدم بالمشهد 10 وبالخريطة.
// ملاحظة: بالمنظر الأمامي، يسار الشخص يظهر على يمين المشاهد، فالركبة المصابة (اليسرى) = kneeR بالإحداثيات.

import { s } from '../ui/dom.js';

export const JOINTS = {
  head: [150, 58], neck: [150, 104], sternum: [150, 168],
  shoulderA: [104, 128], shoulderB: [196, 128],
  elbowA: [86, 226], elbowB: [214, 226],
  wristA: [76, 318], wristB: [224, 318],
  pelvis: [150, 300], hipA: [124, 318], hipB: [176, 318],
  kneeA: [120, 448], kneeB: [180, 448],
  ankleA: [116, 566], ankleB: [184, 566],
};

const BONES = [
  ['shoulderA', 'elbowA'], ['elbowA', 'wristA'], ['shoulderB', 'elbowB'], ['elbowB', 'wristB'],
  ['hipA', 'kneeA'], ['kneeA', 'ankleA'], ['hipB', 'kneeB'], ['kneeB', 'ankleB'],
];

export function skeleton({ highlightKnee = true, className = '' } = {}) {
  const g = s('g', { class: `fig ${className}` });
  const P = (k) => JOINTS[k];
  const line = (a, b, cls = 'fig-bone') => s('line', { class: cls, x1: P(a)[0], y1: P(a)[1], x2: P(b)[0], y2: P(b)[1] });

  g.append(
    s('ellipse', { class: 'fig-bone', cx: 150, cy: 58, rx: 30, ry: 36 }),
    s('path', { class: 'fig-bone', d: 'M150 96 C146 160 156 230 150 296' }),            // العمود الفقري
    s('path', { class: 'fig-bone', d: 'M104 128 Q150 112 196 128' }),                  // الترقوتان
    ...[0, 1, 2, 3].map(i => s('path', { class: 'fig-bone fig-rib', d: `M150 ${150 + i * 22} Q${116 - i * 2} ${148 + i * 22} ${112 + i * 3} ${176 + i * 22} M150 ${150 + i * 22} Q${184 + i * 2} ${148 + i * 22} ${188 - i * 3} ${176 + i * 22}` })),
    s('path', { class: 'fig-bone', d: 'M112 292 Q150 270 188 292 Q194 322 176 330 Q150 316 124 330 Q106 322 112 292 Z' }), // الحوض
    ...BONES.map(([a, b]) => line(a, b)),
  );
  Object.entries(JOINTS).forEach(([k, [x, y]]) => {
    if (k === 'head' || k === 'pelvis' || k === 'sternum') return;
    g.append(s('circle', { class: 'fig-joint', cx: x, cy: y, r: 5, 'data-joint': k }));
  });
  if (highlightKnee) {
    const [x, y] = JOINTS.kneeB;
    g.append(s('circle', { class: 'fig-knee-glow', cx: x, cy: y, r: 18 }), s('circle', { class: 'fig-knee', cx: x, cy: y, r: 7 }));
  }
  return g;
}
