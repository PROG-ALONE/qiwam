// المكتبة: كل المراجع مع بحث وتصفية حسب النوع وقوة الدليل.
import { h } from '../ui/dom.js';
import { header } from '../ui/header.js';
import { allRefs, evidenceName, plainApa } from './registry.js';
import { normalize } from '../text/arabic.js';
import { openRef } from './panel.js';

const TYPES = { article: 'مقال', book: 'كتاب', guideline: 'إرشاد', consensus: 'إجماع', website: 'موقع' };

export function render(root) {
  const refs = allRefs();
  const q = h('input.lib-search', { type: 'search', placeholder: 'ابحث في المراجع', 'aria-label': 'ابحث في المراجع' });
  const type = h('select', { 'aria-label': 'النوع' }, h('option', { value: '' }, 'كل الأنواع'), Object.entries(TYPES).map(([v, t]) => h('option', { value: v }, t)));
  const ev = h('select', { 'aria-label': 'قوة الدليل' }, h('option', { value: '' }, 'كل مستويات الدليل'), [...new Set(refs.map(r => r.evidence))].map(e => h('option', { value: e }, evidenceName(e))));
  const list = h('ol.lib-list');
  const draw = () => {
    const text = normalize(q.value);
    const rows = refs.filter(r => (!type.value || r.type === type.value) && (!ev.value || r.evidence === ev.value) && (!text || normalize(plainApa(r)).includes(text)));
    list.replaceChildren(...rows.map(r => h('li.lib-item',
      h('p.ltr.lib-apa', { html: r.apa }),
      h('p.lib-meta', `${TYPES[r.type] || r.type} · ${evidenceName(r.evidence)} · ${r.access === 'open' ? 'وصول مفتوح' : 'محمي'}${r.license ? ` · ${r.license}` : ''}`),
      h('button.btn.btn--quiet', { type: 'button', onclick: () => openRef(r.id) }, 'التفاصيل'))));
    if (!rows.length) list.append(h('li.empty', 'لا مراجع تطابق البحث. جرّب كلمة أخرى أو أزل التصفية.'));
  };
  [q, type, ev].forEach(x => x.addEventListener('input', draw));
  draw();
  root.append(header(), h('main.page.page--wide',
    h('h1', 'المكتبة'),
    h('p.lede', 'كل مرجع في قِوام متحقق منه قبل إضافته، ومكتوب بصيغة APA. الملفات المفتوحة الترخيص تُرفق، وغيرها برابط.'),
    h('div.lib-filters', q, type, ev), list));
}
