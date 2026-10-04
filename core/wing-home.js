// صفحة الجناح المفتوح: المستويات والكورسات والدروس، المنشور منها والمخطط له.
import { h } from './ui/dom.js';
import { header } from './ui/header.js';
import { wingIcon } from './ui/icons.js';
import wings from '../content/wings.js';
import { loadStructure, hasStructure, lessonHref } from './content.js';
import { lessonState } from './progress.js';
import * as store from './store.js';

export async function render(root, params) {
  const w = wings.find(x => x.id === params.wing);
  if (!w || w.status !== 'open' || !hasStructure(w.id)) return (await import('./wing-soon.js')).render(root, params);
  const st = await loadStructure(w.id);
  const statusText = { done: 'مكتمل', started: 'قيد الدراسة', new: 'جديد' };
  root.append(header({ wing: w }), h('main.wing-home', { style: { '--c': w.color } },
    h('section.wh-hero',
      h('div.wing-soon-mark', wingIcon(w.id, 48)),
      h('h1', w.name),
      h('p.wing-soon-desc', w.desc),
      h('p.wing-soon-q', w.question)),
    h('ol.wh-levels', st.levels.map(lv => h('li.wh-level',
      h('h2', h('span.wh-n', `المستوى ${lv.n}`), lv.title),
      lv.courses.map(c => h('section.wh-course',
        h('h3', c.title),
        c.lessons.length ? h('ol.wh-lessons', c.lessons.map(l => l.status === 'open'
          ? h('li', h('a.wh-lesson', { href: lessonHref(l.id), 'data-status': lessonState(l.id).status }, h('span', l.title), h('span.wh-st', `${l.minutes} دقيقة · ${statusText[lessonState(l.id).status]}`)))
          : h('li.wh-soon', h('span', l.title), h('span.wh-st', 'قريبًا')))) : h('p.wh-empty', 'الدروس قيد الإعداد.'))),
      lv.courses.some(c => c.lessons.some(l => l.status === 'open'))
        ? h('a.btn.wh-review', { href: `#/${w.id}/review/${lv.n}` }, `مراجعة المستوى ${lv.n} واختباره`, levelBest(w.id, lv.n))
        : null)))));
}

function levelBest(wing, n) {
  const b = store.get('levelReview', `${wing}.${n}`, { best: null }).best;
  return b == null ? null : h('span.wh-st', ` · ${Math.round(b * 100)}%`);
}
