// بطاقة الإحالة: جملة فضول، ورمز الجناح المالك ولونه، وزر "اقرأ هناك" (أو "قريبًا").
import { h } from '../ui/dom.js';
import { wingIcon } from '../ui/icons.js';
import entities from '../../content/entities.js';
import wings from '../../content/wings.js';
import { lessonHref } from '../content.js';
import { pushReturn } from '../nav.js';

export function entityTarget(id) {
  const e = entities[id];
  if (!e) return null;
  const w = wings.find(x => x.id === e.owner);
  if (e.home && w?.status === 'open') {
    const [lesson, anchor] = e.home.split('#');
    return { href: `${lessonHref(lesson)}${anchor ? `?s=${anchor}` : ''}`, ready: true };
  }
  return { href: `#/e/${id}`, ready: false };
}

export function refCard(id) {
  const e = entities[id];
  if (!e) return h('div.refcard.is-missing', `كيان غير معروف: ${id}`);
  const w = wings.find(x => x.id === e.owner);
  const t = entityTarget(id);
  const go = h('a.refcard-go', { href: t.href }, t.ready ? `اقرأ في ${w.name} ←` : `${w.name}: قريبًا`);
  go.addEventListener('click', () => pushReturn());
  return h('aside.refcard', { style: { '--c': w.color }, 'data-entity': id },
    h('span.refcard-icon', wingIcon(w.id, 22)),
    h('div.refcard-body',
      h('p.refcard-title', h('strong', e.ar), e.en ? h('span.ltr.refcard-en', ` (${e.en})`) : null),
      h('p.refcard-hook', e.hook),
      go));
}
