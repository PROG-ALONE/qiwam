// صفحة الكيان: تحوّل إلى بيته إن كان منشورًا، وإلا تعرض بطاقته وجناحه المالك ومراجعه.
import { h } from '../ui/dom.js';
import { header } from '../ui/header.js';
import { wingIcon } from '../ui/icons.js';
import entities from '../../content/entities.js';
import wings from '../../content/wings.js';
import { entityTarget } from './refcard.js';
import { go } from '../router.js';
import { backButton } from '../nav.js';
import { getRef, parseCite } from '../refs/registry.js';
import { openRef } from '../refs/panel.js';
import { videoButtons } from '../ui/video.js';

export function render(root, { id }) {
  const e = entities[id];
  if (!e) return go('#/map', { replace: true });
  const t = entityTarget(id);
  if (t.ready) return go(t.href, { replace: true });
  const w = wings.find(x => x.id === e.owner);
  root.append(header({ wing: w }), h('main.page.entity-page', { style: { '--c': w.color } },
    backButton(),
    h('p.entity-wing', wingIcon(w.id, 20), `يُشرح في: ${w.name}`),
    h('h1', e.ar),
    h('p.entity-names.ltr', [e.en, e.la].filter(Boolean).join(' · ')),
    h('p.entity-hook', e.hook),
    h('p.empty', 'هذا الموضوع لم يُكتب درسه بعد. حين يُنشر، يأخذك هذا الرابط إليه مباشرة.'),
    videoButtons(e.en, e.ar),
    e.refs?.length ? h('section.panel', h('h2', 'المراجع'), h('ul.entity-refs', e.refs.map(c => {
      const r = getRef(parseCite(c).id);
      return r ? h('li', h('button.cite-link', { type: 'button', onclick: () => openRef(c) }, r.short)) : null;
    }))) : null));
}
