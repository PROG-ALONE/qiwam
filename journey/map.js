// الخريطة: هيكل جسم في الوسط، والعلوم السبعة حوله، والمسار المقترح مضيء.
// ثم فهرس العلوم: لكل علم وصف لما ستتعلمه، لأي متعلّم.

import { h, s } from '../core/ui/dom.js';
import * as store from '../core/store.js';
import { skeleton } from '../core/viz/figure.js';
import { wingIcon } from '../core/ui/icons.js';
import wings, { suggestedPath } from '../content/wings.js';
import questions from '../content/journey/questions.js';
import { mapVerse } from '../content/bridge.js';
import { journeyState } from './journey.js';
import { header } from '../core/ui/header.js';

const CENTER = [500, 372];
// العلوم موزعة على حلقة بيضوية، بدءًا من الأعلى ومع اتجاه عقارب الساعة
const ORDER = ['story', 'body', 'anatomy', 'movement', 'rehab', 'football', 'nutrition'];
const POS = Object.fromEntries(ORDER.map((id, i) => {
  const a = (-90 + i * (360 / ORDER.length)) * Math.PI / 180;
  return [id, [CENTER[0] + 400 * Math.cos(a), CENTER[1] + 290 * Math.sin(a)]];
}));

export function render(root) {
  const st = journeyState();
  const byId = Object.fromEntries(wings.map(w => [w.id, w]));
  const meta = (w) => (w.status === 'soon' ? 'قريبًا' : `${w.lessons} درسًا`);

  // ——— اللوحة ———
  const svg = s('svg', { viewBox: '0 0 1000 720', class: 'map-svg', 'aria-hidden': 'true' });
  wings.forEach(w => {
    const [x, y] = POS[w.id];
    svg.append(s('line', { class: 'map-spoke', x1: CENTER[0], y1: CENTER[1], x2: x, y2: y, style: `--c:${w.color}` }));
  });
  const chain = ['story', ...suggestedPath];
  svg.append(s('path', { class: 'map-path', d: chain.map((id, i) => `${i ? 'L' : 'M'}${POS[id][0]} ${POS[id][1]}`).join(' ') }));
  svg.append(s('path', { class: 'map-path map-path--parallel', d: `M${POS.nutrition[0]} ${POS.nutrition[1]} Q ${CENTER[0]} ${CENTER[1] - 60} ${POS.body[0]} ${POS.body[1]}` }));
  const sc = 0.8;
  const figG = s('g', { transform: `translate(${CENTER[0] - 150 * sc} ${CENTER[1] - 310 * sc}) scale(${sc})` });
  figG.append(skeleton());
  svg.append(figG);

  const nodes = wings.map(w => {
    const [x, y] = POS[w.id];
    const step = suggestedPath.indexOf(w.id);
    return h('a.map-node', {
      href: `#/${w.id}`,
      style: { left: `${x / 10}%`, top: `${y / 7.2}%`, '--c': w.color },
      'data-wing': w.id,
      'aria-label': `${w.name}: ${w.desc}`,
    },
      h('span.map-node-dot', wingIcon(w.id, 22)),
      h('span.map-node-name', w.name, step >= 0 ? h('span.map-node-step', `${step + 1}`) : null));
  });

  // ——— فهرس العلوم ———
  const catalog = h('ol.sci-list', wings.map(w => {
    const step = suggestedPath.indexOf(w.id);
    return h('li', h('a.sci', { href: `#/${w.id}`, style: { '--c': w.color } },
      h('span.sci-mark', wingIcon(w.id, 26)),
      h('span.sci-body',
        h('span.sci-head', h('strong.sci-name', w.name), h('span.sci-en', { lang: 'en' }, w.en), step >= 0 ? h('span.map-node-step', { title: 'الترتيب في المسار المقترح' }, `${step + 1}`) : null),
        h('span.sci-desc', w.desc),
        h('span.sci-q', w.question)),
      h('span.sci-meta', meta(w))));
  }));

  // ——— أسئلتي المفتوحة ———
  const qList = h('ul.qlist', st.asked.map(id => {
    const q = questions[id];
    if (!q) return null;
    const solved = st.answered.includes(id);
    return h('li.qitem', { class: solved ? 'is-solved' : '' },
      h('span.qitem-mark', { 'aria-hidden': 'true' }, solved ? '✓' : '؟'),
      h('span.qitem-body',
        h('span.qitem-text', q.text),
        solved
          ? h('span.qitem-where', id === 'q.what' ? 'حُلّ في القصة: السجدة.' : 'حُلّ.')
          : h('span.qitem-where', 'جوابه في ', q.wings.map((wid, i) => [i ? ' و' : '', h('a.wchip', { href: `#/${wid}`, style: { '--c': byId[wid].color } }, byId[wid].name)]))));
  }));

  const last = store.get('progress', 'lastLesson', null);
  const cont = last
    ? h('a.btn.btn--primary', { href: last.href }, `تابِع: ${last.title}`)
    : h('p.empty', 'لم تفتح أي درس بعد. اختر علمًا من الفهرس وابدأ منه.');

  root.append(
    header(),
    h('main.map',
      h('section.map-hero',
        h('h1.map-title', 'خريطة قِوام'),
        h('figure.map-verse',
          h('blockquote.scripture', `﴿${mapVerse.text}﴾`),
          h('figcaption', mapVerse.source)),
        h('p.map-lede', 'سبعة علوم عن جسم الإنسان، تُدرَّس هنا من الصفر وبالعربية، حتى تبلغ مستوى طالب جامعي متخصص. لا تحتاج إلى قصة لتبدأ، ولا إلى اختصاص: يكفي أن تريد أن تعرف كيف خُلقت. اختر العلم الذي يشدّك، أو اتبع المسار المضيء لتمرّ بها كلها.')),
      h('section.map-stage', { 'aria-label': 'خريطة العلوم' }, h('div.map-board', svg, nodes)),
      h('div.map-side',
        h('section.panel',
          h('h2', 'تابِع من حيث توقفت'),
          cont,
          h('p.panel-foot', h('a', { href: '#/journey/1' }, 'أعد القصة'))),
        h('section.panel',
          h('h2', 'أسئلتي المفتوحة'),
          st.asked.length ? qList : h('p.empty', 'تظهر هنا الأسئلة التي تجمّعت في القصة وفي الدروس.'))),
      h('section.sci-section', { 'aria-labelledby': 'sci-title' },
        h('h2#sci-title.sci-title', 'العلوم'),
        catalog)));
}
