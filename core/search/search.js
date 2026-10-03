// البحث الشامل: العلوم، والدروس (المنشور منها والمخطط)، والكيانات، والمسرد. النتائج مجمعة حسب العلم.
import { h } from '../ui/dom.js';
import { header } from '../ui/header.js';
import { wingIcon } from '../ui/icons.js';
import wings from '../../content/wings.js';
import entities from '../../content/entities.js';
import glossary from '../../content/glossary.js';
import { normalize } from '../text/arabic.js';
import { hasStructure, loadStructure, flatLessons, loadLesson, lessonHref } from '../content.js';
import { entityTarget } from '../entities/refcard.js';
import { go } from '../router.js';

let index = null;
async function buildIndex() {
  if (index) return index;
  const docs = [];
  for (const w of wings) {
    docs.push({ wing: w.id, kind: 'علم', title: w.name, text: `${w.desc} ${w.question} ${w.en}`, href: `#/${w.id}` });
    if (!hasStructure(w.id)) continue;
    for (const l of flatLessons(await loadStructure(w.id))) {
      let text = `${l.course.title} ${l.level.title}`;
      if (l.status === 'open') {
        const L = await loadLesson(l.id);
        text += ' ' + [L.titleEn, ...L.objectives, ...L.summary, ...L.sections.map(s => s.html.replace(/<[^>]+>/g, ' '))].join(' ');
      }
      docs.push({ wing: w.id, kind: l.status === 'open' ? 'درس' : 'درس قادم', title: l.title, text, href: l.status === 'open' ? lessonHref(l.id) : `#/${w.id}` });
    }
  }
  for (const [id, e] of Object.entries(entities)) docs.push({ wing: e.owner, kind: 'موضوع', title: e.ar, text: `${e.en || ''} ${e.la || ''} ${e.hook || ''}`, href: entityTarget(id).href });
  for (const g of glossary) docs.push({ wing: 'glossary', kind: 'مصطلح', title: g.ar, text: `${g.en} ${g.la || ''} ${g.def}`, href: `#/glossary?t=${g.id}` });
  docs.forEach(d => { d.nt = normalize(d.title); d.nx = normalize(d.text); });
  return (index = docs);
}

export async function render(root) {
  const q0 = new URLSearchParams(location.hash.split('?')[1] || '').get('q') || '';
  const input = h('input.search-input', { type: 'search', value: q0, placeholder: 'ابحث: الكبد، الخلية، tendon…', 'aria-label': 'ابحث في قِوام' });
  const out = h('div.search-results', { 'aria-live': 'polite' });
  const form = h('form.search-form', { role: 'search' }, input, h('button.btn.btn--primary', { type: 'submit' }, 'ابحث'));
  form.addEventListener('submit', e => { e.preventDefault(); go(`#/search?q=${encodeURIComponent(input.value.trim())}`, { replace: true }); run(); });
  root.append(header(), h('main.page.page--wide', h('h1', 'البحث'), form, out));

  async function run() {
    const q = normalize(input.value);
    if (!q) { out.replaceChildren(h('p.empty', 'اكتب كلمة بالعربية أو الإنكليزية.')); return; }
    const docs = await buildIndex();
    const terms = q.split(' ');
    const hits = docs.map(d => ({ d, s: terms.reduce((a, t) => a + (d.nt.includes(t) ? 3 : 0) + (d.nx.includes(t) ? 1 : 0), 0) }))
      .filter(x => terms.every(t => x.d.nt.includes(t) || x.d.nx.includes(t))).sort((a, b) => b.s - a.s);
    if (!hits.length) { out.replaceChildren(h('p.empty', 'لا نتائج. جرّب كلمة أقصر، أو المصطلح الإنكليزي.')); return; }
    const groups = {};
    hits.forEach(({ d }) => (groups[d.wing] ||= []).push(d));
    out.replaceChildren(...Object.entries(groups).map(([wid, list]) => {
      const w = wings.find(x => x.id === wid);
      return h('section.search-group', { style: w ? { '--c': w.color } : null },
        h('h2', w ? [wingIcon(w.id, 20), ' ', w.name] : 'المسرد'),
        h('ul', list.map(d => h('li', h('a', { href: d.href }, h('strong', d.title)), h('span.search-kind', d.kind)))));
    }));
  }
  run();
}
