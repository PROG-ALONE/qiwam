import { h } from '../core/ui/dom.js';
import * as store from '../core/store.js';
import { go } from '../core/router.js';
import bridge from '../content/bridge.js';

export function render(root) {
  const open = h('button.btn.btn--primary.bridge-go', { type: 'button' }, 'افتح الخريطة');
  open.addEventListener('click', () => {
    store.set('journey', 'completed', true);
    go('#/map');
  });

  root.append(h('main.bridge',
    h('article.bridge-inner',
      h('h1.bridge-title', bridge.title),
      h('p.bridge-intro', bridge.intro),
      bridge.texts.map(t =>
        h('figure.bridge-text',
          h('blockquote.scripture', { lang: 'ar' }, `«${t.text}»`),
          h('figcaption', t.source))),
      h('p.bridge-closing', bridge.closing),
      h('figure.bridge-text.bridge-verse',
        h('blockquote.scripture', `﴿${bridge.verse.text}﴾`),
        h('figcaption', bridge.verse.source)),
      h('div.bridge-actions', open))));
}
