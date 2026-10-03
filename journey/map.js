// الخريطة: هيكل جسم بالوسط، والأجنحة الستة حوله، والمسار المقترح مضيء.

import { h, s } from '../core/ui/dom.js';
import * as store from '../core/store.js';
import { skeleton } from '../core/viz/figure.js';
import { wingIcon } from '../core/ui/icons.js';
import wings, { suggestedPath } from '../content/wings.js';
import questions from '../content/journey/questions.js';
import { mapVerse } from '../content/bridge.js';
import { journeyState } from './journey.js';
import { header } from '../core/ui/header.js';

// مواقع الأجنحة على لوحة 1000×720
const POS = {
  story:     [500, 78],
  anatomy:   [812, 200],
  movement:  [862, 478],
  rehab:     [640, 648],
  football:  [300, 640],
  nutrition: [150, 300],
};
const CENTER = [500, 372];

export function render(root) {
  const st = journeyState();
  const byId = Object.fromEntries(wings.map(w => [w.id, w]));

  // ——— اللوحة ———
  const svg = s('svg', { viewBox: '0 0 1000 720', class: 'map-svg', 'aria-hidden': 'true' });
  // خطوط من المركز لكل جناح
  wings.forEach(w => {
    const [x, y] = POS[w.id];
    svg.append(s('line', { class: 'map-spoke', x1: CENTER[0], y1: CENTER[1], x2: x, y2: y, style: `--c:${w.color}` }));
  });
  // قصتي ← التشريح (البداية)، ثم المسار المقترح
  const chain = ['story', ...suggestedPath];
  const d = chain.map((id, i) => `${i ? 'L' : 'M'}${POS[id][0]} ${POS[id][1]}`).join(' ');
  svg.append(s('path', { class: 'map-path', d }));
  svg.append(s('path', { class: 'map-path map-path--parallel', d: `M${POS.nutrition[0]} ${POS.nutrition[1]} Q 300 230 ${POS.anatomy[0]} ${POS.anatomy[1]}` }));
  // الجسم
  const figG = s('g', { transform: `translate(${CENTER[0] - 150 * 0.95} ${CENTER[1] - 310 * 0.95}) scale(.95)` });
  figG.append(skeleton());
  svg.append(figG);

  const nodes = wings.map(w => {
    const [x, y] = POS[w.id];
    const pathIdx = suggestedPath.indexOf(w.id);
    return h('a.map-node', {
      href: `#/${w.id}`,
      style: { left: `${x / 10}%`, top: `${y / 7.2}%`, '--c': w.color },
      'data-wing': w.id,
      'aria-label': `${w.name}: ${w.question}`,
    },
      h('span.map-node-dot', wingIcon(w.id, 22)),
      h('span.map-node-text',
        h('span.map-node-name', w.name, pathIdx >= 0 ? h('span.map-node-step', `${pathIdx + 1}`) : null),
        h('span.map-node-q', w.question),
        h('span.map-node-meta', w.status === 'soon' ? 'قريباً' : `${w.lessons} درس`)));
  });

  const board = h('div.map-board', svg, nodes);

  // ——— القائمة (تظهر بالشاشات الصغيرة بدل النصوص على اللوحة) ———
  const list = h('ol.map-list', wings.map(w =>
    h('li', h('a.map-row', { href: `#/${w.id}`, style: { '--c': w.color } },
      h('span.map-node-dot', wingIcon(w.id, 20)),
      h('span.map-row-text', h('strong', w.name), h('span', w.question)),
      h('span.map-node-meta', w.status === 'soon' ? 'قريباً' : `${w.lessons} درس`)))));

  // ——— أسئلتي المفتوحة ———
  const asked = st.asked.length ? st.asked : [];
  const qList = h('ul.qlist', asked.map(id => {
    const q = questions[id];
    if (!q) return null;
    const solved = st.answered.includes(id);
    return h('li.qitem', { class: solved ? 'is-solved' : '' },
      h('span.qitem-mark', { 'aria-hidden': 'true' }, solved ? '✓' : '؟'),
      h('span.qitem-body',
        h('span.qitem-text', q.text),
        solved
          ? h('span.qitem-where', id === 'q.what' ? 'انحل بالقصة: السجدة.' : 'انحل.')
          : h('span.qitem-where', 'جوابه بـ ', q.wings.map((wid, i) => [i ? ' و' : '', h('a.wchip', { href: `#/${wid}`, style: { '--c': byId[wid].color } }, byId[wid].name)]))));
  }));

  const last = store.get('progress', 'lastLesson', null);
  const cont = last
    ? h('a.btn.btn--primary', { href: last.href }, `كمّل: ${last.title}`)
    : h('p.empty', 'ما فتحت أي درس بعد. الأجنحة تنفتح وحدة وحدة، وأولها قصتي.');

  root.append(
    header(),
    h('main.map',
      h('section.map-hero',
        h('h1.map-title', 'خريطة قِوام'),
        h('figure.map-verse',
          h('blockquote.scripture', `﴿${mapVerse.text}﴾`),
          h('figcaption', mapVerse.source)),
        h('p.map-lede', 'ست علوم يحتاجها لاعب كرة القدم، وكلها تبدي من نفس الجسم. المسار المضيء هو الترتيب المقترح، والغذاء يمشي وياه بالتوازي.')),
      h('section.map-stage', { 'aria-label': 'الأجنحة' }, board, list),
      h('div.map-side',
        h('section.panel',
          h('h2', 'أسئلتي المفتوحة'),
          asked.length ? qList : h('p.empty', 'الأسئلة اللي تتجمع بالقصة وبالدروس تظهر هنا.')),
        h('section.panel',
          h('h2', 'كمّل من وين وقفت'),
          cont,
          h('p.panel-foot', h('a', { href: '#/journey/1' }, 'أعد القصة'))))));
}
