// المسرد المشترك: عربي، وإنكليزي، ولاتيني، وتعريف، ولفظ تقريبي.
import { h } from '../ui/dom.js';
import { header } from '../ui/header.js';
import glossary from '../../content/glossary.js';
import { normalize } from '../text/arabic.js';
import { entityTarget } from '../entities/refcard.js';

export function render(root) {
  const focus = new URLSearchParams(location.hash.split('?')[1] || '').get('t');
  const q = h('input.lib-search', { type: 'search', placeholder: 'ابحث في المسرد', 'aria-label': 'ابحث في المسرد' });
  const list = h('dl.gl-list');
  const sorted = [...glossary].sort((a, b) => a.ar.localeCompare(b.ar, 'ar'));
  const draw = () => {
    const t = normalize(q.value);
    list.replaceChildren(...sorted.filter(g => !t || normalize(`${g.ar} ${g.en} ${g.la || ''} ${g.def}`).includes(t)).map(g => h('div.gl-item', { id: `t-${g.id}`, class: g.id === focus ? 'is-focus' : '' },
      h('dt', g.ar, ' ', h('span.ltr.gl-en', g.en), g.la ? h('span.ltr.gl-la', ` · ${g.la}`) : null),
      h('dd', g.def, g.say ? h('span.gl-say', ` اللفظ: ${g.say}`) : null, g.entity ? [' ', h('a', { href: entityTarget(g.entity).href }, 'اقرأ أكثر')] : null))));
  };
  q.addEventListener('input', draw);
  draw();
  root.append(header(), h('main.page', h('h1', 'المسرد'), q, list));
  if (focus) requestAnimationFrame(() => document.getElementById(`t-${focus}`)?.scrollIntoView({ block: 'center' }));
}
