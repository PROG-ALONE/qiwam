// صفحة جناح لم يُبنَ بعد: هويته، وسؤاله، والأسئلة المفتوحة التي يحمل جوابها.
import { h } from './ui/dom.js';
import { header } from './ui/header.js';
import { wingIcon } from './ui/icons.js';
import wings from '../content/wings.js';
import questions from '../content/journey/questions.js';
import { go } from './router.js';

export function render(root, { wing }) {
  const w = wings.find(x => x.id === wing);
  if (!w) return go('#/map', { replace: true });

  const related = Object.entries(questions).filter(([, q]) => q.wings.includes(w.id));

  root.append(
    header({ wing: w }),
    h('main.wing-soon', { style: { '--c': w.color } },
      h('div.wing-soon-mark', wingIcon(w.id, 56)),
      h('h1', w.name),
      h('p.wing-soon-desc', w.desc),
      h('p.wing-soon-q', w.question),
      h('p.wing-soon-status', 'هذا الجناح قيد البناء، وسيُفتح هنا حين يكتمل أول درس فيه.'),
      related.length ? h('section.panel',
        h('h2', 'أسئلة من القصة جوابها هنا'),
        h('ul.qlist', related.map(([, q]) => h('li.qitem', h('span.qitem-mark', { 'aria-hidden': 'true' }, '؟'), h('span.qitem-body', h('span.qitem-text', q.text)))))) : null,
      h('a.btn', { href: '#/map' }, 'العودة إلى الخريطة')));
}
