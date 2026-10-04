// فقر الدم المنجلي يصعد السلّم: جزيء ← خلية ← نسيج ← عضو ← إنسان، مع مقارنة «سليم / منجلي» في كل مستوى.
// كل وصف من OpenStax A&P 2e، القسم 18.3 (الهيموغلوبين S، والشكل المنجلي، وانسداد الشعيرات، والمضاعفات).
import { h, s } from '../../ui/dom.js';

const RED = '#c0392b', RED2 = '#e8968c', DEAD = '#9aa3ab';

const disc = (cx, cy, r = 13) => [s('circle', { cx, cy, r, fill: RED }), s('circle', { cx, cy, r: r * 0.45, fill: RED2 })];
const sickle = (cx, cy, rot = 0, k = 1) => s('path', { d: `M${-16 * k} 0 Q0 ${-22 * k} ${16 * k} 0 Q0 ${-3 * k} ${-16 * k} 0 Z`, fill: RED, stroke: '#8e2a20', 'stroke-width': 1, transform: `translate(${cx} ${cy}) rotate(${rot})` });

function hb(x, y, bad) {
  const blobs = [[-14, -12, '#c0392b'], [14, -12, '#d35f4f'], [-14, 12, '#d35f4f'], [14, 12, '#c0392b']];
  return s('g', { transform: `translate(${x} ${y})` },
    ...blobs.map(([dx, dy, c]) => s('circle', { cx: dx, cy: dy, r: 16, fill: c, stroke: '#7a241b', 'stroke-width': 1 })),
    ...blobs.map(([dx, dy]) => s('rect', { x: dx - 4, y: dy - 4, width: 8, height: 8, fill: '#f6d365', transform: `rotate(45 ${dx} ${dy})` })), // الهيم: واحد في كل وحدة
    bad ? s('circle', { cx: 22, cy: -20, r: 9, fill: 'none', stroke: '#111', 'stroke-width': 2.5, 'stroke-dasharray': '3 2' }) : null);
}

const LEVELS = [
  {
    id: 'molecule', ar: 'الجزيء',
    ok: { art: () => [hb(180, 92, false), s('text', { x: 180, y: 160, class: 'sk-t' }, 'هيموغلوبين طبيعي')], txt: 'الهيموغلوبين جزيء داخل خلايا الدم الحمراء، يحمل الأكسجين.' },
    bad: { art: () => [hb(180, 92, true), s('text', { x: 180, y: 160, class: 'sk-t' }, 'هيموغلوبين S')], txt: 'في هذا المرض الوراثي يصنع الجسم نوعًا غير طبيعي من الهيموغلوبين اسمه «هيموغلوبين S».' },
  },
  {
    id: 'cell', ar: 'الخلية',
    ok: { art: () => [...disc(120, 90, 34), s('ellipse', { cx: 250, cy: 90, rx: 10, ry: 36, fill: RED }), s('ellipse', { cx: 250, cy: 90, rx: 4, ry: 14, fill: RED2 }), s('text', { x: 120, y: 160, class: 'sk-t' }, 'من الأمام'), s('text', { x: 250, y: 160, class: 'sk-t' }, 'من الجانب')], txt: 'خلية الدم الحمراء قرص مقعّر الوجهين: ممتلئ عند الحافة، رقيق في الوسط، ومرن.' },
    bad: { art: () => [sickle(120, 100, -10, 2.4), sickle(250, 96, 25, 1.7), s('text', { x: 180, y: 160, class: 'sk-t' }, 'خلايا منجلية (هلالية)')], txt: 'يجعل هيموغلوبين S الخلايا تتخذ شكل المنجل (الهلال)، خصوصًا حين ينخفض الأكسجين.' },
  },
  {
    id: 'tissue', ar: 'النسيج',
    ok: { art: () => tissue(false), txt: 'الخلايا السليمة تنثني لتعبر الشعيرات الدموية الضيقة، فيصل الدم إلى خلايا النسيج كلها.' },
    bad: { art: () => tissue(true), txt: 'الخلايا المنجلية لا تنثني، فتعلق في الشعيرات الضيقة وتسدّ جريان الدم إلى الأنسجة.' },
  },
  {
    id: 'organ', ar: 'العضو',
    ok: { art: () => organs(false), txt: 'كل عضو يأخذ حاجته من الدم عبر شعيرات لا تُحصى.' },
    bad: { art: () => organs(true), txt: 'حين ينقطع الدم عن أنسجة عضو ما يتأذى العضو كله: في المفاصل ألم، وقد يصل الأذى إلى العين أو الدماغ.' },
  },
  {
    id: 'organism', ar: 'الإنسان',
    ok: { art: () => person(false), txt: 'إنسان سليم: المستويات كلها تعمل معًا.' },
    bad: { art: () => person(true), txt: 'خلل في جزيء واحد صعد السلّم كله: آلام في المفاصل، وتأخر في النمو، وقد يصل إلى العمى أو السكتة الدماغية.' },
  },
];

function tissue(bad) {
  const cells = [];
  for (let i = 0; i < 9; i++) for (const y of [26, 154]) cells.push(s('rect', { x: 14 + i * 38, y: y - 14, width: 34, height: 28, rx: 8, class: 'sk-tcell', fill: bad && i > 4 ? '#e6e8ea' : '#f6d4d8', stroke: bad && i > 4 ? DEAD : '#d99aa3' }));
  const flow = bad
    ? [sickle(150, 90, 15), sickle(176, 88, -20), sickle(196, 92, 40), sickle(132, 92, -35), sickle(212, 88, 0)]
    : [0, 1, 2, 3, 4, 5].map(i => s('g', { class: 'sk-flow', style: `animation-delay:${-i * 0.6}s` }, ...disc(0, 90, 10)));
  return [
    ...cells,
    s('path', { d: 'M0 62 H150 Q180 74 210 62 H360 M0 118 H150 Q180 106 210 118 H360', class: 'sk-vessel' }),
    ...flow,
    bad ? s('text', { x: 290, y: 96, class: 'sk-t sk-t-bad' }, 'لا يصل الدم') : s('path', { d: 'M300 90 h40 m-8 -6 l8 6 l-8 6', class: 'sk-arrow' }),
  ];
}

function organs(bad) {
  const hurt = (x, y, r) => (bad ? s('circle', { cx: x, cy: y, r, class: 'sk-hurt' }) : null);
  return [
    // مفصل الركبة
    s('path', { d: 'M48 20 V80 Q48 92 60 92 H72 Q84 92 84 80 V20 M48 160 V112 Q48 100 60 100 H72 Q84 100 84 112 V160', class: 'sk-organ' }), hurt(66, 96, 20),
    s('text', { x: 66, y: 186, class: 'sk-t' }, 'المفصل'),
    // العين
    s('path', { d: 'M136 92 Q180 52 224 92 Q180 132 136 92 Z', class: 'sk-organ' }), s('circle', { cx: 180, cy: 92, r: 16, fill: '#5a7ea6' }), s('circle', { cx: 180, cy: 92, r: 6, fill: '#111' }), hurt(180, 92, 26),
    s('text', { x: 180, y: 186, class: 'sk-t' }, 'العين'),
    // الدماغ
    s('path', { d: 'M262 110 Q252 70 286 58 Q300 40 322 54 Q350 54 346 84 Q358 104 336 116 Q320 132 296 122 Q272 130 262 110 Z', class: 'sk-organ' }),
    s('path', { d: 'M284 72 q10 8 2 18 M310 64 q-6 14 6 22 M328 92 q-12 6 -6 18', class: 'sk-fold' }), hurt(312, 96, 18),
    s('text', { x: 304, y: 186, class: 'sk-t' }, 'الدماغ'),
  ];
}

function person(bad) {
  const mark = (x, y) => (bad ? s('circle', { cx: x, cy: y, r: 9, class: 'sk-hurt' }) : null);
  return [
    s('circle', { cx: 180, cy: 30, r: 18, class: 'sk-body' }),
    s('path', { d: 'M180 48 V112 M180 62 L148 96 M180 62 L212 96 M180 112 L160 176 M180 112 L200 176', class: 'sk-limb' }),
    mark(173, 27), mark(187, 27), mark(180, 18), mark(166, 146), mark(194, 146), mark(156, 86), mark(204, 86),
    bad ? s('text', { x: 290, y: 60, class: 'sk-t sk-t-bad' }, 'ألم في المفاصل') : null,
    bad ? s('text', { x: 290, y: 100, class: 'sk-t sk-t-bad' }, 'تأخر في النمو') : null,
    bad ? s('text', { x: 70, y: 40, class: 'sk-t sk-t-bad' }, 'العين والدماغ') : null,
  ];
}

export default {
  mount(el) {
    let i = 0, bad = false, auto = null;
    const art = s('svg', { viewBox: '0 0 360 200', class: 'sk-art', role: 'img' });
    const cap = h('p.sk-cap', { 'aria-live': 'polite' });
    const steps = h('ol.sk-steps', LEVELS.map((lv, j) => h('li', h('button.sk-step', { type: 'button', onclick: () => { stop(); i = j; draw(); } }, h('span.sk-n', String(j + 1)), lv.ar))));
    const tog = h('div.cc-tabs', [['ok', 'سليم'], ['bad', 'منجلي']].map(([m, t]) => h('button.btn', { type: 'button', 'data-m': m, onclick: () => { stop(); bad = m === 'bad'; draw(); } }, t)));
    const play = h('button.btn.btn--primary.sk-play', { type: 'button', onclick: () => { stop(); bad = true; i = 0; draw(); auto = setInterval(() => { if (!document.body.contains(art)) return stop(); if (i < LEVELS.length - 1) { i++; draw(); } else stop(); }, 3200); } }, 'شغّل السلسلة: من الجزيء إلى الإنسان');
    function stop() { clearInterval(auto); auto = null; }
    function draw() {
      const lv = LEVELS[i], st = bad ? lv.bad : lv.ok;
      art.replaceChildren(...st.art().flat().filter(Boolean));
      art.setAttribute('aria-label', `${lv.ar}: ${st.txt}`);
      art.classList.toggle('is-bad', bad);
      cap.replaceChildren(h('strong', `${i + 1}. ${lv.ar} — ${bad ? 'منجلي' : 'سليم'}: `), st.txt);
      [...steps.querySelectorAll('.sk-step')].forEach((b, j) => { b.setAttribute('aria-current', String(j === i)); b.classList.toggle('is-past', j < i); });
      tog.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.m === 'bad') === bad)));
    }
    draw();
    el.append(h('div.sk', steps, tog, art, cap, play, h('p.cv-note', 'رسم تخطيطي مبسّط، وليس بمقياس رسم حقيقي.')));
  },
};
